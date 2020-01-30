---
path: '/osa-5/1-http-protokollan-tilattomuus-ja-evasteet'
title: 'HTTP-protokollan tilattomuus ja evästeet'
hidden: false
---


<text-box variant='learningObjectives' name='Oppimistavoitteet'>

- Tunnet käsitteen tilattomuus.
- Tiedät mitä evästeet ovat ja mihin niitä käytetään.
- Osaat luoda sovelluksen, joka käyttää evästeitä käyttäjän tunnistamiseen.
- Tunnet evästeisiin liittyviä oleellisia lakiteknisia asioita.

</text-box>


HTTP on tilaton protokolla. Tämä tarkoittaa sitä, että jokainen pyyntö on erillinen kokonaisuus, joka ei liity aiempiin pyyntöihin. Suunnittelupäätöksen taustalla oli ajatus siitä, että verkkosivulle ladattava sisältö voi sijaita useammalla eri palvelimella. Jos HTTP ottaisi kantaa käyttäjän tilaan, tulisi myös hajautettujen ratkaisujen tilan ylläpitoon ottaa kantaa -- tämä olisi myös ollut melko tehotonta ([Basic HTTP as defined in 1992](https://www.w3.org/Protocols/HTTP/HTTP2.html)). Päätös tilattomuudesta on ollut järkevä: suurin osa verkkoliikenteestä liittyy muuttumattoman sisällön hakemiseen, jolloin palvelinten ei tarvitse varata resursseja käyttäjän tilan ylläpitämiseen, eikä palvelinten ja selainohjelmistojen toteuttajien ole tarvinnut toteuttaa mekanismeja käyttäjien tilan ylläpitämiseen.


Käyttäjän tunnistamiseen pyyntöjen välillä on kuitenkin tarvetta. Esimerkiksi verkkokaupat ja muut käyttäjän kirjautumista vaativat palvelut tarvitsevat tavan käyttäjän tunnistamiseen. Klassinen -- mutta huono -- tapa käyttäjän tunnistamiseen on ollut säilyttää GET-muotoisessa osoitteessa parametreja, joiden perusteella asiakas voidaan tunnistaa palvelinsovelluksessa. Tämä ei kuitenkaan ole suositeltavaa, sillä osoitteessa olevia parametreja voi muokata käsin.


<text-box variant='hint' name='Case: GET-parametri tunnistautumiseen'>

Eräässä järjestelmässä -- onneksi jo vuosia sitten -- verkkokaupan toiminnallisuus oli toteutettu siten, että GET-parametrina säilytettiin numeerista ostoskorin identifioivaa tunnusta. Käyttäjäkohtaisuus oli toteutettu palvelinpuolella siten, että tietyllä GET-parametrilla näytettiin aina tietyn käyttäjän ostoskori. Uusien tuotteiden lisääminen ostoskoriin onnistui helposti, sillä pyynnöissä oli aina mukana ostoskorin tunnistava GET-parametri. Ostoskorit oli valitettavasti identifioitu juoksevalla numerosarjalla. Henkilöllä 1 oli ostoskori 1, henkilöllä 2 ostoskori 2 jne..


Koska käytännössä kuka tahansa pääsi katsomaan kenen tahansa ostoskoria vain osoitteessa olevaa numeroa vaihtamalla, olivat ostoskorien sisällöt välillä hyvin mielenkiintoisia.

</text-box>


HTTP-protokollan tilattomuus ei pakota palvelinohjelmistoja tilattomuuteen. Mikäli haluamme pitää kirjaa käyttäjistä, löytyy siihen erilaisia keinoja yllä mainitusta GET-parametrin käytöstä lähtien. Toistaiseksi yleisin tekniikka käyttäjän tilan ylläpitoon ja tunnistamiseen on HTTP-pyynnön mukana kulkevat evästeet.


## HTTP ja evästeet

Merkittävä osa verkkosovelluksista sisältää käyttäjäkohtaista toiminnallisuutta, jonka toteuttamiseen sovelluksella täytyy olla jonkinlainen tieto käyttäjästä sekä mahdollisesti käyttäjän tilasta. HTTP-protokollan versio 1.1 sekä uudemmat tarjoavat mahdollisuuden tilallisten verkkosovellusten toteuttamiseen evästeiden (*cookies*) avulla.

Evästeet toteutetaan HTTP-protokollan otsakkeiden avulla. Kun käyttäjä tekee pyynnön palvelimelle, ja palvelimella halutaan asettaa käyttäjälle eväste, palautetaan vastauksen osana otsake `Set-Cookie`, jossa määritellään käyttäjäkohtainen evästetunnus. Otsake voi olla esimerkiksi seuraavan näköinen:

```
Set-Cookie: fb1a1466ccceee22a0=0hr0aa2ogdfgkelogg; Max-Age=3600; Domain=".helsinki.fi"
```

Yllä oleva palvelimelta palautettu vastaus pyytää selainta tallettamaan evästeen. Kun selaimella on tiettyyn osoitteeseen liittyvä eväste tallennettuna, tulee sen jatkossa lisätä eväste `fb1a1466ccceee22a0=0hr0aa2ogdfgkelogg` jokaiseen `helsinki.fi`-osoitteeseen lähetettävään pyyntöön. Yllä eväste on voimassa tunnin, eli selain ja palvelin voi unohtaa sen tunnin kuluttua sen asettamisesta.


Tarkempi syntaksi evästeen asettamiselle on seuraava:

```
Set-Cookie: nimi=arvo [; Comment=kommentti] [; Max-Age=elinaika sekunteina]
                    [; Expires=parasta ennen paiva] [; Path=polku tai polunosa jossa eväste voimassa]
                    [; Domain=palvelimen osoite (URL) tai osoitteen osa jossa eväste voimassa]
                    [; Secure (jos määritelty, eväste lähetetään vain salatun yhteyden kanssa)]
                    [; Version=evästeen versio]
```


Evästeet tallennetaan selaimen sisäiseen evästerekisteriin, josta niitä haetaan aina kun käyttäjä tekee selaimella kyselyn. Evästeet lähetetään palvelimelle jokaisen viestin yhteydessä `Cookie`-otsakkeessa.


```
Cookie: fb1a1466ccceee22a0=0hr0aa2ogdfgkelogg
```

Evästeiden nimet ja arvot ovat yleensä monimutkaisia ja satunnaisesti luotuja niiden yksilöllisyyden takaamiseksi. Tällöin jokaisella käyttäjällä on oma uniikki eväste, jonka käyttäjä lähettää palvelimelle.


Yleisesti ottaen evästeet ovat sekä hyödyllisiä että haitallisia: niiden avulla voidaan luoda yksiöityjä käyttökokemuksia tarjoavia sovelluksia ja esimerkiksi toteuttaa verkkokauppoja, mutta niitä voidaan käyttää myös käyttäjien seurantaan. Sovellusten kehittäjien pitää myös tiedostaa tämä -- esimerkiksi Googlen ilmaiseksi tarjoama [Google Analytics](https://fi.wikipedia.org/wiki/Google_Analytics)-palvelu, jota käytetään sivustojen kävijöiden seurantaan, kerää tietoa käyttäjistä. Mikäli tällaisia järjestelmiä käytetään arkaluonteisia tietoja sisältävillä sivuilla, voi käyttäjästä vuotaa yksityiseksi toivottuja tietoja ulkopuolisille tahoille. Tämä on näkynyt myös mediassa -- lue [Helsingin sanomien uutinen aiheesta](https://www.hs.fi/teknologia/art-2000006041757.html).


<text-box variant='hint' name='Evästeet hs.fi -palvelussa'>

Painamalla F12 tai valitsemalla Tools -> Developer tools, pääset tutkimaan sivun lataamiseen ja sisältöön liittyvää statistiikkaa. Lisäneuvoja löytyy [Google Developers](https://developers.google.com/web/tools/chrome-devtools/)-sivustolta.

Avaa developer tools, ja mene osoitteeseen [https://www.hs.fi](https://www.hs.fi). Valitsemalla developer toolsien välilehden `Application`, löydät valikon erilaisista sivuun liittyvistä resursseista. Etsi kohta `Storage` ja avaa sen alla oleva `Cookies`-kohta. Valitse vaihtoehto `https://www.hs.fi`. Kuinka monta eri evästettä selain lähettää tehdessäsi pyynnön osoitteeseen `https://www.hs.fi`?

</text-box>


## Evästeet ja istunnot eli sessiot


Kun selain lähettää palvelimelle pyynnön yhteydessä evästeen, palvelin etsii evästeen perusteella käynnissä olevaa istuntoa eli sessiota. Jos sessio löytyy, annetaan siihen liittyvät tiedot sovelluksen käyttöön käyttäjän pyynnön käsittelyä varten. Jos sessiota taas ei löydy, aloitetaan uusi sessio, johon liittyvä eväste palautetaan käyttäjälle vastauksen yhteydessä.

Javassa sessioiden käsittelyyn löytyy [HttpSession](https://docs.oracle.com/javaee/7/api/javax/servlet/http/HttpSession.html)-luokka, joka tarjoaa välineet sessio- ja käyttäjäkohtaisen tiedon tallentamiseen. Oleellisimmat luokan metodit ovat `public void setAttribute(String name, Object value)`, joka tallentaa sessioon arvon, sekä `public Object getAttribute(String name)`, jonka avulla kyseinen arvo löytyy.

HttpSession-olion saa Springissä yksinkertaisimmillaan käyttöön lisäämällä sen kontrollerimetodin parametriksi. Tällöin Spring asettaa kyseiseen pyyntöön liittyvän session metodin parametriin automaattisesti. Alla on kuvattuna sovellus, joka pitää sessiokohtaista kirjaa käyttäjien tekemistä pyynnöistä.


```java
import javax.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class VisitCountController {

    @GetMapping("*")
    @ResponseBody
    public String count(HttpSession session) {
        int visits = 0;
        if (session.getAttribute("count") != null) {
            visits = (int) session.getAttribute("count");
        }

        visits++;
        session.setAttribute("count", visits);

        return "Visits: " + visits;
    }
}
```


Kun käyttäjä tekee ensimmäistä kertaa pyynnön sovellukseen, palauttaa sovellus merkkijonon "Visits: 1". Vastauksen yhteydessä palautetaan myös eväste. Kun käyttäjä tekee seuraavan kerran pyynnön sovellukseen, lähettää selain pyynnön yhteydessä myös evästeen palvelimelle, jolloin palvelin osaa tunnistaa käyttäjän ja hakee oikean istunnon tiedot -- vastaukseksi palautuu lopulta merkkijono "Visits: 2".


<programming-exercise name='Hello Session' tmcname='osa05-Osa05_01.HelloSession'>

Toteuta sovellus, joka palauttaa käyttäjälle merkkijonon "Hello there!" jos käyttäjä ei ole ennen vieraillut sovelluksessa. Jos käyttäjä on vieraillut sovelluksessa aiemmin, tulee sovelluksen palauttaa käyttäjälle merkkijono "Hello again!".

Palauta merkkijono ensimmäisestä osasta tutun annotaation `@ResponseBody` avulla.

</programming-exercise>



<text-box variant='hint' name='Evästeiden ja istuntojen testaaminen selaimella'>

Istuntojen toiminnallisuuden testaaminen selaimella onnistuu näppärästi selainten tarjoaman anonyymitoiminnallisuuden avulla. Esimerkiksi Chromessa voi valita "New incognito window", mikä avaa käyttöön selainikkunan, missä ei aluksi ole lainkaan vanhoja evästeitä muistissa. Kun palvelimelle tehdään pyyntö, tallentuu vastauksen yhteydessä palautettava eväste selaimen muistiin vain siksi aikaa kun anonyymi-ikkuna on auki.

Session pituus riippuu esimerkiksi palvelimen asetuksista `session timeout` ja siitä, että salliiko käyttäjä evästeiden käytön.

</text-box>


`HttpSession`-olioon pääsee käsiksi myös muualla sovelluksessa ja sen voi injektoida esimerkiksi palveluun `@Autowired`-annotaation avulla. Edellinen kontrolleriin toteutettu toiminnallisuus voitaisiin tehdä myös palvelussa.


```java
// importit

@Service
public class CountService {

    @Autowired
    private HttpSession session;

    public int incrementAndCount() {
        int count = 0;
        if (session.getAttribute("count") != null) {
            count = (int) session.getAttribute("count");
        }

        count++;
        session.setAttribute("count", count);
        return count;
    }
}
```

Nyt kontrollerin koodi olisi kevyempi:

```java
// importit

@Controller
public class VisitCountController {

    @Autowired
    private CountService countService;

    @RequestMapping("*")
    @ResponseBody
    public String count() {
        return "Visits: " + countService.incrementAndCount();
    }
}
```

<programming-exercise name='Reload Heroes' tmcname='osa05-Osa05_02.ReloadHeroes'>

Reload Heroes -sovellus pitää kirjaa käyttäjän tekemistä sivun uudelleenlatauksista. Kun käyttäjä saapuu sovellukseen ensimmäistä kertaa, hänelle luodaan satunnainen käyttäjätunnus ja hänen vierailujen määrä asetetaan yhteen. Jokaisen uudelleenvierailun yhteydessä käyttäjän vierailujen määrä kasvaa yhdellä.

Täydennä luokan `ReloadStatusController` metodin reload toimintaa seuraavasti.

- Metodin tulee palauttaa model-attribuuttina "scores" viisi eniten uudelleenlatauksia tehnyttä käyttäjää suuruusjärjestyksessä. Listan ensimmäisellä sijalla on eniten uudelleenlatauksia tehnyt henkilö, toisella sijalla toiseksi eniten jne.
- Metodin tulee lisäksi palauttaa pyynnön tehneeseen henkilöön liittyvä `ReloadStatus`-olio modelin attribuuttina status. Jos käyttäjä ei ole tehnyt yhtäkään pyyntöä aiemmin, tulee käyttäjälle luoda uusi tunnus sekä alustaa uudelleenlatausten määrä yhteen. Jos taas käyttäjä on tehnyt pyyntöjä aiemmin, tulee käyttäjän tekemien pyyntöjen määrää kasvattaa yhdellä. Tieto pyyntöjen määrästä tulee myös tallentaa tietokantaan.

Voit testata sovelluksen toimintaa selaimen anonyymitilassa. Anonyymitilassa selain ei lähetä normaalitilassa kertyneitä evästeitä palvelimelle.

</programming-exercise>


<text-box variant='hint' name='Milloin sessioita kannattaa käyttää?'>

Muutamia faktoja sessioista:

- Sessio häviää kun käyttäjä poistaa selaimesta evästeet.
- Sessio häviää kun evästeen elinikä kuluu loppuun.
- Jokaisessa päätelaitteessa on tyypillisesti oma sessio: jos palvelua käytetään kännykällä ja padilla, kummallakin on omat evästeet. *Tämä on nykyään muuttumassa, esimerkiksi jotkut Googlen tuotteet pitävät kirjaa evästeistä myös laitteiden yli.*
- Käyttäjä voi estää evästeiden käytön selaimen asetuksista.

Sessioiden käyttö on näppärää sellaisen tiedon tallentamiseen mikä saakin kadota. Jos tiedon säilyvyys on oleellista sovelluksen toiminnan kannalta, kannattaa se tallentaa esimerkiksi tietokantaan.

</text-box>


## Spring luo oletuksena yhden ilmentymän luokasta

Spring luo oletuksena yhden olion jokaisesta sen hallinnoimasta luokasta -- viite tähän yksittäiseen olioon kopioidaan jokaisen `@Autowired`-annotaatiolla määritellyn olion arvoksi. Joskus hallinnoiduista luokista halutaan kuitenkin useampi versio, esimerkiksi vaikkapa käyttäjäkohtaisesti.

Hallinnoitujen olioiden luomista voidaan kontrolloida erillisen `@Scope`-annotaation avulla, mikä mahdollistaa ilmentymien luonnin esimerkiksi sessiokohtaisesti. Seuraavassa on esimerkki ostoskorista, joka on sessiokohtainen: jokaiselle sessiolle luodaan oma ostoskori, eli ostoskori tulee olemaan käyttäjäkohtainen.

Alla käytetty annotaatio `@Component` on luokan toiminnalle oleellinen -- se kertoo Springille, että tätäkin luokkaa tulee hallinnoida. Sen avulla Spring tietää, että luokka tulee kopioida `@Autowired`-annotaatiolla merkittyihin olioihin.


```java
// importit

@Data @NoArgsConstructor
@Component
@Scope(value = "session", proxyMode = ScopedProxyMode.TARGET_CLASS)
public class ShoppingCart implements Serializable {

    private Map<Item, Integer> items = new HashMap<>();
}
```

Ylläolevasta komponentista luotavat ilmentymät ovat elossa vain käyttäjän session ajan, eli sen aikaa kun käyttäjän eväste on voimassa. Ylläolevasta ostoskorista saa lisättyä ilmentymän sovellukseen aivan kuten muistakin komponenteista, eli `@Autowired`-annotaatiolla.


<text-box variant='hint' name='Mikä ihmeen proxymode?'>

Tarkempaa tietoa em. annotaatiosta löytyy [Springin dokumentaatiosta](https://docs.spring.io/spring/docs/current/spring-framework-reference/core.html#beans-factory-scopes) ja [Baeldungin aiheeseen liittyvästä oppaasta](https://www.baeldung.com/spring-bean-scopes).

</text-box>



<programming-exercise name='EuroShopper (3 osaa)' tmcname='osa05-Osa05_03.EuroShopper'>

Tässä tehtävässä toteutetaan verkkokauppaan ostoskoritoiminnallisuus.


<h2>Ostoskori</h2>

Luo pakkaukseen `euroshopper` luokka `ShoppingCart`, joka tarjoaa seuraavat toiminnallisuudet.

- Metodi `getItems()` palauttaa `Map<Item, Long>`-tyyppisen olion, joka sisältää ostoskorissa olevien tuotteiden tuotekohtaisen lukumäärän.
- Metodi `addToCart(Item item)` lisää ostoskoriin yhden kappaleen `Item`-tyyppistä esinettä.


<h2>Kontrolleri ostoskorille</h2>

Tee ostoskorista sessiokohtainen, jolloin eri käyttäjien tulee saada eri ostoskori käyttöönsä. Annotaatiosta `@Scope` on tässä hyötyä.

Luo projektiin sopiva kontrolleri, joka tarjoaa seuraavat osoitteet ja toiminnallisuudet.

- GET `/cart` asettaa model-olion "items"-nimiseen attribuuttiin ostoskorin sisällön (aiempi `getItems()`). Pyynnön vastauksena käyttäjälle näytetään sivu, joka luodaan polussa `/src/main/resources/templates/cart.html` olevasta näkymästä.
- POST `/cart/items/{id}` lisää ostoskoriin yhden {id}-tunnuksella tietokannasta löytyvän Item-olion. Pyyntö ohjataan osoitteeseen `/cart`.


<h2>Tilauksen tekeminen</h2>

Muokkaa luokkaa `euroshopper.OrderController` siten, että kun käyttäjä tekee POST-tyyppisen pyynnön osoitteeseen `/orders`, tilaus tallennetaan tietokantaan. Tutustu luokkiin `Order` ja `OrderItem` ennen toteutusta. Varmista että esimerkiksi `OrderItem` viittaa oikeaan tietokantatauluun.

Kun tilaus on tehty, tyhjennä myös ostoskori.

</programming-exercise>


## Lakiteknisiä asioita evästeisiin liittyen

Euroopan komissio on säätänyt yksityisyydensuojaan liittyvän lain, joka määrää kertomaan käyttäjille evästeiden käytöstä. Käytännössä käyttäjältä tulee pyytää lupaa minkä tahansa sisällön tallentamiseen hänen koneelleen ([ePrivacy directive, Article 5, kohta (3)](https://eur-lex.europa.eu/LexUriServ/LexUriServ.do?uri=CELEX:32002L0058:EN:HTML)). Myöhemmin säädetty [tarkennus](https://eur-lex.europa.eu/LexUriServ/LexUriServ.do?uri=CELEX:32002L0058:EN:HTML) tarkentaa määritelmää myös evästeiden käytön kohdalla.


*(25) However, such devices, for instance so-called "cookies", can be a legitimate and useful tool, for example, in analysing the effectiveness of website design and advertising, and in verifying the identity of users engaged in on-line transactions. Where such devices, for instance cookies, are intended for a legitimate purpose, such as to facilitate the provision of information society services, their use should be allowed on condition that users are provided with clear and precise information in accordance with Directive 95/46/EC about the purposes of cookies or similar devices so as to ensure that users are made aware of information being placed on the terminal equipment they are using. Users should have the opportunity to refuse to have a cookie or similar device stored on their terminal equipment. This is particularly important where users other than the original user have access to the terminal equipment and thereby to any data containing privacy-sensitive information stored on such equipment. Information and the right to refuse may be offered once for the use of various devices to be installed on the user's terminal equipment during the same connection and also covering any further use that may be made of those devices during subsequent connections. The methods for giving information, offering a right to refuse or requesting consent should be made as user-friendly as possible. Access to specific website content may still be made conditional on the well-informed acceptance of a cookie or similar device, if it is used for a legitimate purpose.*


Lisätietoa mm. [https://eur-lex.europa.eu/LexUriServ/LexUriServ.do?uri=OJ:L:2009:337:0011:0036:EN:PDF](https://eur-lex.europa.eu/LexUriServ/LexUriServ.do?uri=OJ:L:2009:337:0011:0036:EN:PDF) ja [https://finlex.fi/fi/laki/ajantasa/2014/20140917#L24P205](https://finlex.fi/fi/laki/ajantasa/2014/20140917#L24P205).

