---
path: '/osa-7/3-sovellusten-skaalautuminen'
title: 'Isommille käyttäjämäärille skaalautuvat sovellukset'
hidden: false
---


<text-box variant='learningObjectives' name='Oppimistavoitteet'>

- Tiedät mitä sovellusten skaalaamisella tarkoitetaan.
- Osaat kertoa perinteiseen asiakas-palvelin -malliin liittyviä skaalautuvuusongelmia.
- Osaat määritellä sovellukseen välimuistin.
- Osaat määritellä asynkronisesti suoritettavia metodeja.
- Tunnet pintapuolisesti menetelmiä sovellusten skaalaamiseen suuremmille käyttäjämäärille.

</text-box>


Haasteena perinteisessä asiakas-palvelin mallissa on se, että palvelin sijaitsee yleensä tietyssä keskitetyssä sijainnissa. Keskitetyillä palveluilla on mahdollisuus ylikuormittua asiakasmäärän kasvaessa. Kapasiteettia rajoittavat muun muassa palvelimen fyysinen kapasiteetti (muisti, prosessorin teho, ..), palvelimeen yhteydessä olevan verkon laatu ja nopeus, sekä tarjotun palvelun tyyppi. Esimerkiksi pyynnöt, jotka johtavat tiedon tallentamiseen, vievät tyypillisesti enemmän resursseja kuin pyynnöt, jotka tarvitsevat vain staattista sisältöä.

Kun sovellukseen liittyvä liikenne ja tiedon määrä kasvaa niin isoksi, että sovelluksen käyttö takkuilee, tulee asialle tehdä jotain.


<text-box variant='hint' name='Hitausongelmat'>

Sovelluksen hitausongelmat liittyvät usein konfiguraatio-ongelmiin. Tyypillisiä ongelmia ovat esimerkiksi toistuvat tietokantakyselyt tauluihin, joiden kenttiin ei ole määritelty hakuoperaatioita tehostavia indeksejä. Yksittäisen käyttäjän etsiminen tietokantataulusta nimen perusteella vaatii pahimmassa tapauksessa kaikkien rivien läpikäynnin ilman indeksien käyttöä; indeksillä haku tehostuu merkittävästi.

Sovelluksen ongelmakohdat löytyvät usein sovelluksen toimintaa profiloimalla. Spring-sovellusten profilointi onnistuu esimerkiksi <a href="https://www.appdynamics.com/java/spring/" target="_blank">AppDynamicsin</a> ja <a href="https://www.yourkit.com/" target="_blank">YourKit</a>in avulla. Spring Boot-projekteihin voi lisätää myös <a href="https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#production-ready" target="_blank">Actuator</a>-komponentin, jonka avulla <a href="http://kielczewski.eu/2015/01/application-metrics-with-spring-boot-actuator/" target="_blank">sovellukseen voi lisätä tilastojen keruutoiminnallisuutta</a>.

</text-box>


Mikäli sovelluksen konfiguraatio on kunnossa, sovelluksen skaalautumisen edistämiseen on useampia lähtökohtia: (1) olemassaolevien resurssien käytön tehostaminen esimerkiksi välimuistitoteutusten ja palvelintehon kasvattamisen avulla, (2) resurssien määrän kasvattaminen esimerkiksi uusia palvelimia hankkimalla, ja (3) toiminnallisuuden jakaminen pienempiin vastuualueisiin ja palveluihin sekä näiden määrän kasvattaminen.

Sovellukset eivät tyypillisesti skaalaudu lineaarisesti ja skaalautumiseen liittyy paljon muutakin kuin resurssien lisääminen. Jos yksi palvelin pystyy käsittelemään tuhat pyyntöä sekunnissa, emme voi olettaa, että kahdeksan palvelinta pystyy käsittelemään kahdeksantuhatta pyyntöä sekunnissa.

Tehoon vaikuttavat myös muut käytetyt komponentit sekä verkkokapasiteetti eikä skaalautumiseen ole olemassa yhtä oikeaa lähestymistapaa. Joskus tehokkaamman palvelimen hankkiminen on nopeampaa ja kustannustehokkaampaa kuin sovelluksen muokkaaminen -- esimerkiksi hitaasti toimiva tietokanta tehostuu tyypillisesti huomattavasti lisäämällä käytössä olevaa muistia. Joskus taas käytetyn tietokantakomponentin vaihtaminen tehostaa sovellusta merkittävästi.

Oleellista sovelluskehityksen kannalta on ongelman lähestyminen pragmaattisesti. [Optimointia optimoinnin takia -- ilman tietoa konkreettisesta hyödystä -- voi olla järkevää välttää](http://wiki.c2.com/?PrematureOptimization); ohjelmistokehitystyö on itsessään kallista ja yhden ohjelmistokehittäjän kuukausipalkalla sivukuluineen saa usein ostettua useita palvelimia.

Tarkastellaan tässä muutamia tapoja sovellusten optimointiin.


## Palvelinpuolen välimuistit

Tyypillisissä palvelinohjelmistoissa huomattava osa kyselyistä on GET-tyyppisiä pyyntöjä. GET-tyyppiset pyynnöt hakevat tietoa mutta eivät muokkaa palvelimella olevaa dataa. Esimerkiksi tietokannasta dataa hakevat GET-tyyppiset pyynnöt luovat yhteyden tietokantasovellukseen, josta data haetaan. Mikäli näitä pyyntöjä on useita, eikä tietokannassa oleva data juurikaan muutu, kannattaa turhat tietokantakyselyt karsia.

Spring Bootia käytettäessä sovelluksiin voi lisätä [välimuistitoiminnallisuuden](https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-caching.html) melko helposti. Tämä tapahtuu lisäämällä konfiguraatiotiedostoon tai sovelluksen käynnistävän `main`-metodin sisältävään luokkaan annotaation `@EnableCaching`.

Kun välimuisti on konfiguroitu eli annotaatio on paikallaan, voimme lisätä välimuistitoiminnallisuuden `@Service`-annotaatiolla merkityille metodeille `@Cacheable`-annotaation avulla. Annotaatiolle annetaan parametrina välimuistin avain -- välimuistin voi ajatella toimivan käytännössä hajautustauluna, missä avain vastaa aina jotain välimuistiin tallennettavaa arvoa.

Alla olevassa esimerkissä metodin `read` palauttama arvo asetetaan välimuistiin. Arvo tunnistetaan avaimella `my-cache-key`.

```java
@Service
public class MyService {

    @Autowired
    private MyRepository myRepository;

    @Cacheable("my-cache-key")
    public My read(Long id) {
        return myRepository.getOne(id);
    }
}
```

Annotaatio `@Cacheable` luo annotoidulle metodille `read` proxy-metodin, joka ensin tarkistaa onko haettavaa tulosta välimuistissa -- proxy-metodit ovat käytössä vain jos metodia kutsutaan luokan ulkopuolelta. Jos tulos on välimuistissa, palautetaan se sieltä, muuten tulos haetaan tietokannasta ja se tallennetaan välimuistiin. Metodin parametrina annettavia arvoja hyödynnetään välimuistin avaimen toteuttamisessa, eli jokaista haettavaa oliota kohden voidaan luoda oma tietue välimuistiin. Tässä kohtaa on hyvä tutustua Springin [cache](https://docs.spring.io/spring/docs/current/spring-framework-reference/integration.html#cache)-dokumentaatioon.


*Huomaa, että Springin kontrollerimetodit palauttavat näkymän nimen -- kontrollerimetodien palauttamien arvojen cachettaminen ei siis ole toivottua..*

Välimuistitoteutuksen vastuulla ei ole pitää kirjaa tietokantaan tehtävistä muutoksista, jolloin välimuistin tyhjentäminen muutoksen yhteydessä on sovelluskehittäjän vastuulla. Dataa muuttavat metodit tulee annotoida sopivasti annotaatiolla `@CacheEvict`, jotta välimuistista poistetaan muuttuneet tiedot. Annotaatiolle `@CacheEvict` määritellään parametrina välimuistin avain (parametri `cacheNames`) sekä mahdollisesti tieto koko välimuistin tyhjentämisestä (parametri `allEntries`).



<programming-exercise name='Weather Service' tmcname='osa07-Osa07_04.WeatherService'>

Kumpulan kampuksella majaileva ilmatieteen laitos kaipailee pientä viritystä omaan sääpalveluunsa. Tällä hetkellä palvelussa on toiminnallisuus sijaintien hakemiseen ja lisäämiseen. Ilmatieteen laitos on lisäksi toteuttanut säähavaintojen lisäämisen suoraan tuotantotietokantaan, mihin ei tässä palvelussa päästä käsiksi. Palvelussa halutaan kuitenkin muutama lisätoiminnallisuus:

Lisää sovellukseen välimuistitoiminnallisuus. Osoitteisiin `/locations` ja `/locations/{id}` tehtyjen hakujen tulee toimia siten, että jos haettava sijainti ei ole välimuistissa, se haetaan tietokannasta ja tallennetaan välimuistiin. Jos sijainti taas on välimuistissa, tulee se palauttaa sieltä ilman tietokantahakua.

Lisää tämän jälkeen sovellukseen toiminnallisuus, missä käytössä oleva välimuisti tyhjennetään kun käyttäjä lisää uuden sijainnin tai tekee GET-tyyppisen pyynnön osoitteeseen `/flushcaches`. Erityisesti jälkimmäinen on tärkeä asiakkaalle, sillä se lisää tietokantaan tietoa myös palvelinohjelmiston ulkopuolelta.

</programming-exercise>


Oletuksena Spring käyttää välimuistina [ConcurrentHashMap](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ConcurrentHashMap.html)-luokkaan perustuvaa toteutusta. Mikäli sovelluskehittäjä tarvitsee hieman raskaampaa välineistöä käyttöönsä, tarjoaa Spring valmiit integraatiot niin eksplisiittisiin välimuistitoteutuksiin (esim. [EhCache](https://www.ehcache.org/)) kuin myös erilaisiin avain-arvo tietokantoihin sekä hajautettuun laskentaan tarkoitettuihin palveluihin (mm. [Redis](https://redis.io/), [Hazelcast](https://hazelcast.com/), [Couchbase](https://www.couchbase.com/)).


Kehitysympäristöön voi halutessaan määritellä konfiguraation `spring.cache.type=none`, jolloin välimuisti on poissa käytöstä kehitysympäristössä.


<text-box variant='hint' name='Välimuistit selainpuolella'>

Tiedostoja jaettaessa dataa ei kannata siirtää uudestaan jos tiedosto on jo käyttäjällä. Voimme määritellä HTTP-pyynnön vastauksen otsaketietoihin tietoa datan vanhentumisesta, jonka perusteella selain osaa päätellä milloin näytettävä tieto on vanhentunutta ja se pitäisi hakea uudestaan.

Eräs mahdollisuus on myös [entiteettitagin](https://en.wikipedia.org/wiki/HTTP_ETag) (ETag) käyttö pyynnön vastauksessa. Kun resurssiin liittyvään vastaukseen lisätään ETag-otsake, lähettää selain tiedostoa seuraavalla kerralla haettaessa aiemmin annetun arvon osana `"If-None-Match"`-otsaketta. Tällöin palvelimella voidaan tarkistaa onko tiedosto muuttunut -- jos ei, vastaukseksi riittää pelkkä statuskoodi 304 -- NOT MODIFIED.

</text-box>



## Palvelinmäärän kasvattaminen

Skaalautumisesta puhuttaessa puhutaan käytännössä lähes aina horisontaalisesta skaalautumisesta, jossa käyttöön hankitaan esimerkiksi lisää palvelimia. Vertikaalinen skaalautuminen on mahdollista tietyissä tapauksissa, esimerkiksi tietokantapalvelimen ja -kyselyiden toimintaa suunniteltaessa, mutta yleisesti ottaen horisontaalinen skaalautuminen on kustannustehokkaampaa. Käytännöllisesti ajatellen kahden viikon ohjelmointityö kymmenen prosentin tehonparannukseen on tyypillisesti kalliimpaa kuin muutaman päivän konfiguraatiotyö ja uuden palvelimen hankkiminen. Käyttäjien määrän kasvaessa uusien palvelinten hankkiminen on joka tapauksessa vastassa.

Pyyntöjen määrän kasvaessa yksinkertainen ratkaisu on palvelinmäärän eli käytössä olevan raudan kasvattaminen. Tällöin pyyntöjen jakaminen palvelinten kesken hoidetaan erillisellä kuormantasaajalla ([load balancer](https://en.wikipedia.org/wiki/Load_balancing_(computing))), joka ohjaa pyyntöjä palvelimille. Kuormantasaus ei ole skaalattavan sovelluksen vastuulla, vaan kuormantasaus tehdään erillisessä sovelluksessa. Myös Spring tarjoaa mahdollisuuden kuormantasaukseen esimerkiksi [NetFlix Ribbon](https://spring.io/guides/gs/spring-cloud-loadbalancer/)-projektin avulla.

Jos sovellukseen ei liity tilaa (esimerkiksi käyttäjän tunnistaminen tai ostoskori), kuormantasaaja voi ohjata pyyntöjä kaikille käytössä oleville palvelimille round-robin -tekniikalla. Jos sovellukseen liittyy tila, tulee tietyn asiakkaan tekemät pyynnöt ohjata aina samalle palvelimelle, sillä evästeet tallennetaan oletuksena palvelinkohtaisesti. Tämän voi toteuttaa esimerkiksi siten, että kuormantasaaja lisää pyyntöön evästeen, jonka avulla käyttäjä identifioidaan ja ohjataan oikealle palvelimelle. Tätä lähestymistapaa kutsutaan termillä *sticky session*.

Pelkkä palvelinmäärän kasvattaminen ja kuormantasaus ei kuitenkaan aina riitä. Kuormantasaus helpottaa verkon kuormaa, mutta ei ota kantaa palvelinten kuormaan. Jos yksittäinen palvelin käsittelee pitkään kestävää laskentaintensiivistä kyselyä, voi kuormantasaaja ohjata tälle palvelimelle lisää kyselyjä "koska eihän se ole vähään aikaan saanut mitään töitä".  Käytännössä tällöin entisestään paljon laskentaa tekevä palvelin saa lisää kuormaa. On kuitenkin myös mahdollista käyttää kuormantasaajaa, joka pitää lisäksi kirjaa palvelinten tilasta. Palvelimet voivat myös raportoida tilastaan -- Springillä tämä onnistuu esimerkiksi [Actuator](https://docs.spring.io/spring-boot/docs/current/reference/html/production-ready.html)-komponentin avulla. Tässäkin on toki omat huonot puolensa, sillä palvelimen tila voi muuttua hyvinkin nopeasti.

Parempi ratkaisu on palvelinmäärän kasvattaminen *ja* sovelluksen suunnittelu siten, että laskentaintensiiviset operaatiot käsitellään erillisillä palvelimilla. Tällöin käytetään käytännössä erillistä laskentaklusteria aikaa vievien laskentaoperaatioiden käsittelyyn, jolloin pyyntöjä kuuntelevan palvelimen kuorma pysyy alhaisena.

Riippuen pyyntöjen määrästä, palvelinkonfiguraatio voidaan toteuttaa jopa siten, että staattiset tiedostot (esim. kuvat) löytyvät erillisiltä CDN-palvelimilta, GET-pyynnöt käsitellään erillisillä pyyntöjä vastaanottavilla palvelimilla, ja datan muokkaamista tai prosessointia vaativat kyselyt (esim POST) ohjataan asiakkaan pyyntöjä vastaanottavien palvelinten toimesta laskentaklusterille.

<text-box variant='hint' name='Rajoitettu määrä samanaikaisia pyyntöjä osoitetta kohden'>

Staattisten resurssien kuten kuvien ja tyylitiedostojen hajauttaminen eri palvelimille on oikeastaan fiksua. [HTTP 1.1](http://www.w3.org/Protocols/rfc2616/rfc2616-sec8.html)-spesifikaation yhteyksiin liittyvässä osissa suositellaan tiettyyn osoitteeseen tehtävien samanaikaisten pyyntöjen määrän rajoittamista kahteen.

*Clients that use persistent connections SHOULD limit the number of simultaneous connections that they maintain to a given server. A single-user client SHOULD NOT maintain more than 2 connections with any server or proxy. A proxy SHOULD use up to 2*N connections to another server or proxy, where N is the number of simultaneously active users. These guidelines are intended to improve HTTP response times and avoid congestion.*

Käytännössä suurin osa selaimista tekee nykyään enemmän kuin 2 samanaikaista kyselyä samaan osoitteeseen. Jos web-sivusto sisältää paljon erilaisia staattisita resursseja, ja ne sijaitsevat kaikki samalla palvelimella, saadaan resursseja korkeintaan selaimeen rajoitettu määrä kerrallaan. Toisaalta, jos resurssit jaetaan useamman sijainnin kesken, ei tätä rajoitetta ole.

Resurssien jakaminen useampaan sijantiin mahdollistaa myös maantieteellisen hajauttamisen, missä käyttäjä saa sivun sisällön lähellä olevilta palvelimilta, mikä nopeuttaa vasteaikaa. Sama resurssi voi olla myös useammalla palvelimella.

Tämä toteutetaan CDN-palvelimilla -- käytimme näitä jo Twitter Bootstrapia hyödyntäessä. Aihe on kuitenkin hyvä kerrata vielä Wikipedian artikkelista [Content delivery network](https://en.wikipedia.org/wiki/Content_delivery_network).

</text-box>


Palvelinmäärän kasvattaminen onnistuu myös tietokantapuolella (tietokannat ovat erillisiä palvelinohjelmistoistamme). Tällöin käyttöön tulevat tyypillisesti hajautetut tietokantapalvelut kuten [Apache Cassandra](https://cassandra.apache.org) ja [Apache Geode](https://geode.apache.org/). Riippumatta käyttöön valitusta teknologiasta, aiemmin käyttämämme Spring Data JPA:n ohjelmointimalli sopii myös näihin tietokantoihin: esimerkiksi Cassandran käyttöönottoon löytyy ohjeistusta osoitteesta [https://spring.io/projects/spring-data-cassandra](https://spring.io/projects/spring-data-cassandra).



<text-box variant='hint' name='Teknologiahype'>

*Tämä teksti on jo hieman vanhentunut (aiheeseen liittyvä hype on vähentynyt). Teemana aihe on kuitenkin relevantti -- välillä sovelluksen komponentteja valitaan ilman tarkempaa tarkastelua.*

Tietokantamoottoreiden ympärillä on ollut kymmenisen vuotta  hype-tyyppistä keskustelua. Nyt kun tuosta on mennyt hetki, on hyvä tarkastella keskustelua ja siihen liittyviä jälkiviisauksia.

Eräs merkittävistä NoSQL-buumin aloittajista oli Twitterin noin 2010 tekemä [päätös siirtyä MySQL-relaatiotietokannan käytöstä NoSQL-tietokantaan](https://www.computerworld.com/article/2520084/twitter-growth-prompts-switch-from-mysql-to--nosql--database.html); taustasyynä muutokselle oli "relaatiotietokantojen hitaus".

Keskustelua seurasi [MySQL](https://www.mysql.com/)n ja [MariaDB](https://mariadb.org/)n kehittäjän Monty Wideniuksen [pohdintaa](https://jelastic.com/blog/are-nosql-and-big-data-just-hype/) teemaan liittyen: *The main reason Twitter had problems with MySQL back then, was that they were using it incorrectly. The strange thing was that the solution they suggested for solving their problems could be done just as easily in MySQL as in Cassandra.*

Käytännössä Widenius vihjasi, että Twitter vain käytti MySQL:ää huonosti.

</text-box>


## Pääavaimet ja tietokannat

Kun sovelluksen kasvu saavuttaa pisteen, missä yksittäisestä tietokantapalvelimesta siirrytään useamman tietokantapalvelimen käyttöön, on hyvä hetki miettiä sovelluksen pääavaimia. Tietokantojen määrän kasvaessa juoksevien numeeristen tunnusten (esim `Long`) käyttäminen tunnisteena voi olla ongelmallista.

Jos tietokantataulussa on numeerinen tunnus ja useampi sovellus luo uusia tietokantarivejä, tarvitaan erillinen palvelu tunnusten antamiselle -- tämän palvelun kaatuessa koko sovellus voi kaatua. Toisaalta, jos palvelua ei ole toteutettu hyvin, on tunnusten törmäykset (eli sama tunnus useammassa tietokannassa) mahdollisia, mikä johtaa helposti tiedon katoamiseen.

Yhtenä vaihtoehtona numeerisille tunnuksille on ehdotettu [UUID](http://docs.oracle.com/javase/7/docs/api/java/util/UUID.html)-pohjaisia satunnaisia merkkijonoavaimia. Näiden ongelmana on toki se, että niiden indeksointi on tehottomampaa kuin esimerkiksi numeromuodossa olevien avainten.

Aihetta käsitellään mm. osoitteessa [https://vladmihalcea.com/uuid-identifier-jpa-hibernate/](https://vladmihalcea.com/uuid-identifier-jpa-hibernate/) olevassa blogissa.


### Evästeet ja useampi palvelin

Kun käyttäjä kirjautuu palvelinohjelmistoon, tieto käyttäjästä pidetään tyypillisesti yllä sessiossa. Sessiot toimivat evästeiden avulla, jotka palvelin asettaa pyynnön vastaukseen, ja selain lähettää aina palvelimelle. Sessiotiedot ovat oletuksena yksittäisellä palvelimella, mikä aiheuttaa ongelmia palvelinmäärän kasvaessa. Edellä erääksi ratkaisuksi mainittiin kuormantasaajien (load balancer) käyttö siten, että käyttäjät ohjataan aina samalle koneelle. Tämä ei kuitenkaan ole aina mahdollista -- kuormantasaajat eivät aina tue sticky session -tekniikkaa -- eikä kannattavaa -- kun palvelinmäärää säädellään dynaamisesti, uusi palvelin käynnistetään tyypillisesti vasta silloin, kun havaitaan ruuhkaa -- olemassaolevat käyttäjät ohjataan ruuhkaantuneelle palvelimelle uudesta palvelimesta riippumatta.

Yksi vaihtoehto on tunnistautumisongelman siirtäminen tietokantaan -- skaalautumista helpottaa tietokannan hajauttaminen esimerkiksi käyttäjätunnusten perusteella. Sen sijaan, että käytetään palvelimen hallinnoimia sessioita, pidetään käyttäjätunnus ja kirjautumistieto salattuna evästeessä. Eväste lähetetään kaikissa tiettyyn osoitteeseen tehtävissä kutsuissa; palvelin voi tarvittaessa purkaa evästeessä olevan viestin ja hakea käyttäjään liittyvät tiedot tietokannasta.


## Asynkroniset metodikutsut ja rinnakkaisuus

Jokaiselle palvelimelle tulevalle pyynnölle määrätään säie, joka on varattuna pyynnön käsittelyn loppuun asti. Jokaisen pyynnön käsittelyyn kuuluu ainakin seuraavat askeleet: (1) pyyntö lähetetään palvelimelle, (2) palvelin vastaanottaa pyynnön ja ohjaa pyynnön oikealle kontrollerille, (3) kontrolleri vastaanottaa pyynnön ja ohjaa pyynnön oikealle palvelulle tai palveluille, (4) palvelu vastaanottaa pyynnön, suorittaa pyyntöön liittyvät operaatiot muiden palveluiden kanssa, ja palauttaa lopulta vastauksen metodin suorituksen lopussa, (5) kontrolleri ohjaa pyynnön sopivalle näkymälle, ja (6) vastaus palautetaan käyttäjälle. Pyyntöä varten on palvelimella varattuna säie kohdissa 2-6. Jos jonkun kohdan suoritus kestää pitkään -- esimerkiksi palvelu tekee pyynnön toiselle palvelimelle, joka on hidas -- on säie odotustilassa.

Palvelukutsun suorituksen odottaminen ei kuitenkaan aina ole tarpeen. Jos sovelluksemme suorittaa esimerkiksi raskaampaa laskentaa, tai tekee pitkiä tietokantaoperaatioita joiden tuloksia käyttäjän ei tarvitse nähdä heti, kannattaa pyyntö suorittaa asynkronisesti. Asynkronisella metodikutsulla tarkoitetaan sitä, että asynkronista metodia kutsuva metodi ei jää odottamaan metodin tuloksen valmistumista. Jos edellisissä askeleissa kohta 4 suoritetaan asynkronisesti, ei sen suoritusta tarvitse odottaa loppuun.

Ohjelmistokehykset toteuttavat asynkroniset metodikutsut luomalla palvelukutsusta erillisen säikeen, jossa pyyntö käsitellään. Spring Bootin tapauksessa asynkroniset metodikutsut saa käyttöön lisäämällä sovelluksen konfiguraatioon (tapauksessamme usein `Application`-luokassa) rivi `@EnableAsync`. Kun konfiguraatio on paikallaan, voimme suorittaa metodeja asynkronisesti. Jotta metodisuoritus olisi asynkroninen, tulee metodin olla `void`-tyyppinen, sekä sillä tulee olla annotaatio `@Async`.

Tutkitaan tapausta, jossa tallennetaan `Item`-tyyppisiä olioita. Item-olion sisäinen muoto ei ole niin tärkeä.


```java
@PostMapping("/items")
public String create(@ModelAttribute Item item) {
    itemService.create(item);
    return "redirect:/items";
}
```

Oletetaan että `ItemService`-olion metodi `create` on void-tyyppinen, ja näyttää seuraavalta:


```java
public void create(Item item) {
    // koodia..
}
```

Metodin muuttaminen asynkroniseksi vaatii `@Async`-annotaation `ItemService`-luokkaan.

```java
@Async
public void create(Item item) {
    // koodia..
}
```

Nyt metodi on asynkroninen, eikä sitä kutsuva metodi jää odottamaan suoritusta. Käytännössä asynkroniset metodikutsut toteutetaan asettamalla metodikutsu suoritusjonoon, josta se suoritetaan kun sovelluksella on siihen mahdollisuus.


<programming-exercise name='Calculations' tmcname='osa07-Osa07_05.Calculations'>

Tehtäväpohjassa on sovellus, joka tekee "raskasta laskentaa". Tällä hetkellä käyttäjä joutuu odottamaan laskentapyynnön suoritusta pitkään, mutta olisi hienoa jos käyttäjälle kerrottaisiin laskennan tilasta jo laskentavaiheessa.

Muokkaa sovellusta siten, että laskentaolio tallennetaan kertaalleen jo ennen laskentaa -- näin siihen saadaan viite; aseta oliolle myös status "PROCESSING". Muokkaa tämän jälkeen luokkaa `CalculationService` siten, että laskenta tapahtuu asynkronisesti.

Huom! Älä poista `CalculationService`-luokasta "raskasta laskentaa" kuvaavaa koodia:

```java
try {
    Thread.sleep(2000);
} catch (InterruptedException ex) {
    Logger.getLogger(CalculationService.class.getName()).log(Level.SEVERE, null, ex);
}
```

Kun sovelluksesi toimii oikein, laskennan lisäyksen pitäisi olla nopeaa ja käyttäjä näkee lisäyksen jälkeen laskentakohtaisen sivun, missä on laskentaan liittyvää tietoa. Kun sivu ladataan uudestaan noin 2 sekunnin kuluttua, on laskenta valmistunut.

</programming-exercise>


### Rinnakkain suoritettavat metodikutsut

Koostepalvelut, eli palvelut jotka keräävät tietoa useammasta palvelusta ja yhdistävät tietoja käyttäjälle, tyypillisesti haluavat näyttää käyttäjälle vastauksen.

Näissä tilanne on usein se, että palveluita on useita, ja niiden peräkkäinen suorittaminen on tyypillisesti hidasta. Suoritusta voi nopeuttaa ottamalla käyttöön rinnakkaisen suorituksen, joka onnistuu esimerkiksi Javan [ExecutorService](https://docs.oracle.com/javase/7/docs/api/java/util/concurrent/ExecutorService.html)-luokan avulla. Voimme käytännössä lisätä tehtäviä niitä suorittavalle palvelulle, jolta saamme viitteen tulevaa vastausta varten.

Spring tarjoaa myös tähän apuvälineitä. Kun lisäämme sovellukselle [AsyncTaskExecutor](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/core/task/AsyncTaskExecutor.html)-rajapinnan toteuttaman olion (esimerkiksi [ThreadPoolTaskExecutor](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/scheduling/concurrent/ThreadPoolTaskExecutor.html)), voimme injektoida sen sovelluksemme käyttöön tarvittaessa. Tietynlaisen olion lisäys sovellukseen tapahtuu luomalla `@Bean`-annotaatiolla merkitty olio konfiguraatiotiedostossa. Alla esimerkiksi luodaan edellä mainitut oliot.


```java
// konfiguraatiotiedosto
@Bean
public AsyncTaskExecutor asyncTaskExecutor() {
    ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
    executor.setCorePoolSize(8);
    return executor;
}
```

Nyt voimme ottaa käyttöön sovelluksessa `AsyncTaskExecutor`-rajapinnan toteuttavan olion.


```java
@Autowired
private AsyncTaskExecutor taskExecutor;
```

Käytännössä tehtävien lisääminen rinnakkaissuorittajalle tapahtuu seuraavalla tavalla. Alla luodaan [Callable](https://docs.oracle.com/javase/7/docs/api/java/util/concurrent/Callable.html)-rajapinnan toteuttava olio ja annetaan se `taskExecutor`-ilmentymälle. Olion `call`-metodi suoritetaan sitten, kun `taskExecutor`-oliolla laskentaresursseja vapaana.

```java
// käytössä yllä määritelty taskExecutor taskExecutor

taskExecutor.submit(new Callable<String>() {
    @Override
    public String call() {
        // laskentaa.. -- tulos voi olla käytännössä mitä tahansa
        return "OK!";
    }
});
```


### Viestijonot


Kun palvelinohjelmistoja skaalataan siten, että osa laskennasta siirretään erillisille palvelimille, on oleellista että palveluiden välillä kulkevat viestit (pyynnöt ja vastaukset) eivät katoa, ja että käyttäjän pyyntöjä vastaanottavan palvelimen ei tarvitse huolehtia toisille palvelimille lähetettyjen pyyntöjen perille menemisestä tai lähetettyjen viestien vastausten käsittelystä. Eniten käytetty lähestymistapa viestien säilymisen varmentamiseen on viestijonot (*messaging*, *message queues*), joiden tehtävänä on toimia viestien väliaikaisena säilytyspisteenä. Käytännössä viestijonot ovat erillisiä palveluita, joihin viestien tuottajat (*producer*) voivat lisätä viestejä, joita viestejä käyttävät palvelut kuluttavat (*consumer*).

Viestijonoja käyttävät sovellukset kommunikoivat viestijonon välityksellä. Tuottaja lisää viestejä viestijonoon, josta käyttäjä niitä hakee. Kun viestin sisältämän datan käsittely on valmis, prosessoija lähettää viestin takaisin. Viestijonoissa on yleensä varmistustoiminnallisuus: jos viestille ei ole vastaanottajaa, jää viesti viestijonoon ja se tallennetaan esimerkiksi viestijonopalvelimen levykkeelle. Viestijonojen konkreettinen toiminnallisuus riippuu viestijonon toteuttajasta.

Viestijonosovelluksia on useita, esimerkiksi [ActiveMQ](https://activemq.apache.org/) ja [RabbitMQ](https://www.rabbitmq.com/). Spring tarjoaa komponentteja viestijonojen käsittelyyn, tutustu lisää aiheeseen esimerkiksi osoitteessa [https://spring.io/guides/gs/messaging-rabbitmq/](https://spring.io/guides/gs/messaging-rabbitmq/). Myös Springin projekti [Spring Cloud Stream](https://spring.io/projects/spring-cloud-stream) tarjoaa välineitä skaalautuvien sovellusten tekemiseen.


## Palvelukeskeiset arkkitehtuurit

Monoliittisten "minä sisällän kaiken mahdollisen"-sovellusten ylläpitokustannukset kasvavat niitä kehitettäessä, sillä uuden toiminnallisuuden lisääminen vaatii olemassaolevan sovelluksen muokkaamista sekä testaamista. Olemassaoleva sovellus voi olla kirjoitettu hyvin vähäisesssä käytössä olevalla kielellä (vrt. pankkijärjestelmät ja COBOL) ja esimerkiksi kehitystä tukevat automaattiset testit voivat puuttua siitä täysin. Samalla myös uusien työntekijöiden tuominen ohjelmistokehitystiimiin on vaikeaa, sillä sovellus voi hoitaa montaa vastuualuetta samaan aikaan.


Yrityksen toiminta-alueiden laajentuessa sekä uusien sovellustarpeiden ilmentyessä aiemmin toteutettuihin toiminnallisuuksiin olisi hyvä päästä käsiksi, mutta siten, että toiminnallisuuden käyttäminen ei vaadi juurikaan olemassaolevan muokkausta. Koostamalla sovellus erillisistä palveluista saadaan luotua tilanne, missä palvelut ovat tarvittaessa myös uusien sovellusten käytössä. Palvelut tarjoavat rajapinnan (esim. REST) minkä kautta niitä voi käyttää. Samalla rajapinta kapseloi palvelun toiminnan, jolloin muiden palvelua käyttävien sovellusten ei tarvitse tietää sen toteutukseen liittyvistä yksityiskohdista. Oleellista on, että yksikään palvelu ei yritä tehdä kaikkea. Tämä johtaa myös siihen, että yksittäisen palvelun toteutuskieli tai muut teknologiset valinnat ei vaikuta muiden komponenttien toimintaan -- oleellista on vain se, että palvelu tarjoaa rajapinnan jota voi käyttää ja joka löydetään.


Yrityksen kasvaessa sen sisäiset toiminnat ja rakennettavat ohjelmistot sisältävät helposti päällekkäisyyksiä. Tällöin tilanne on käytännössä se, että aikaa käytetään samankaltaisten toimintojen ylläpitoon useammassa sovelluksessa -- pyörä keksitään yhä uudestaan ja uudestaan uusia sovelluksia kehitettäessä.


Service Oriented Architecture ([SOA](https://en.wikipedia.org/wiki/Service-oriented_architecture)), eli palvelukeskeinen arkkitehtuuri, on suunnittelutapa, jossa sovelluksen komponentit on suunniteltu toimimaan itsenäisinä avoimen rajapinnan tarjoavina palveluina. Pilkkomalla sovellukset erillisiin palveluihin luodaan tilanne, missä palveluita voidaan käyttää myös tulevaisuudessa kehitettävien sovellusten toimesta. Palveluita käyttävät esimerkiksi toiset palvelut tai selainohjelmistot. Selainohjelmistot voivat hakea palvelusta `JSON`-muotoista dataa Javascriptin avulla ilman tarvetta omalle palvelinkomponentille. SOA-arkkitehtuurin avulla voidaan helpottaa myös ikääntyvien sovellusten jatkokäyttöä: ikääntyvät sovellukset voidaan kapseloida rajapinnan taakse, jonka kautta sovelluksen käyttö onnistuu myös jatkossa.


<text-box variant='hint' name='Amazon ja palvelut'>

Amazon on hyvä esimerkki yrityksestä, joka on menestynyt osittain sen takia, että se on toteuttanut tarjoamansa toiminnallisuudet palveluina. Siirtymä ei kuitenkaan ollut yksinkertainen, alla oleva viesti on katkelma Amazonin toimitusjohtajan, Jeff Bezosin, noin vuonna 2002 kirjoittamasta viestistä yritykselle (alkuperäinen lähde poistunut internetistä, ks. esim. [toissijainen lähde](https://medium.com/slingr-for-slack/what-year-did-bezos-issue-the-api-mandate-at-amazon-57f546994ca2)).

1. All teams will henceforth expose their data and functionality through service interfaces.

2. Teams must communicate with each other through these interfaces.

3. There will be no other form of interprocess communication allowed: no direct linking, no direct reads of another team's data store, no shared-memory model, no back-doors whatsoever. The only communication allowed is via service interface calls over the network.

4. It doesn't matter what technology they use. HTTP, Corba, Pubsub, custom protocols — doesn't matter.

5. All service interfaces, without exception, must be designed from the ground up to be externalizable. That is to say, the team must plan and design to be able to expose the interface to developers in the outside world. No exceptions.

6. Anyone who doesn't do this will be fired.

Oikeastaan, hyvin suuri syy sille, että Amazon tarjoaa nykyään erilaisia pilvipalveluita (ks. [Amazon Web Services](https://aws.amazon.com/)) liittyy siihen kokemukseen, mitä yrityksen työntekijät sekä yritys on kerännyt kun yrityksen sisäistä toimintaa kehitettiin kohti palveluja tarjoavia ohjelmistotiimejä.

</text-box>


## Lisää sovellusten skaalautumisesta

Skaalautuvien sovellusten toteuttaminen on aiheena niin laaja, että siitä voisi tehdä hyvin yhden tai useamman kurssin. YouTubessa oleva [SpringDeveloper](https://www.youtube.com/user/SpringSourceDev)-kanava tarjoaa hyvän lähtökohdan Springiin syventymiseen -- kanavalla on myös paljon sovellusten skaalautumiseen liittyviä videoita.
