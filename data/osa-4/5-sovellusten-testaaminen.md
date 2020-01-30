---
path: '/osa-4/5-sovellusten-testaaminen'
title: 'Sovellusten testaaminen'
hidden: false
---

<text-box variant='learningObjectives' name='Oppimistavoitteet'>

- Tiedät mitä yksikkötestaus, integraatiotestaus ja järjestelmätestaus tarkoittavat.
- Osaat toteuttaa automaattisesti suoritettavia integraatiotestejä sekä järjestelmätestejä.

</text-box>


Sovellusten testaaminen helpottaa sekä kehitystyötä että tulevaa ylläpitotyötä. Testaaminen voidaan karkeasti jakaa kolmeen osaan: yksikkötestaukseen, integraatiotestaukseen ja järjestelmätestaukseen. Tämän lisäksi on mm. myös käytettävyys- ja tietoturvatestaus, joita emme tässä käsittele tarkemmin.

Yksikkötestauksessa tarkastellaan sovellukseen kuuluvia yksittäisiä komponentteja ja varmistetaan että niiden tarjoamat rajapinnat toimivat tarkoitetulla tavalla. Integraatiotestauksessa pyritään varmistamaan, että komponentit toimivat yhdessä kuten niiden pitäisi. Järjestelmätestauksessa varmistetaan, että järjestelmä toimii vaatimusten mukaan järjestelmän käyttäjille tarjotun rajapinnan (esim. selain) kautta.

Kaikkien kolmen testaustyypin automaatioon löytyy Springistä välineitä. Tarkastellaan näitä seuraavaksi.


### Yksikkötestaus


Yksikkötestauksella tarkoitetaan lähdekoodiin kuuluvien yksittäisten osien testausta. Termi yksikkö viittaa ohjelman pienimpiin mahdollisiin testattaviin toiminnallisuuksiin, kuten olion tarjoamiin metodeihin. Seuratessamme <a href="https://en.wikipedia.org/wiki/Single_responsibility_principle" target="_blank">single responsibility principleä</a>, jokaisella oliolla ja metodilla on yksi selkeä vastuu, jota voi myös testata. Testaus tapahtuu yleensä testausohjelmistokehyksen avulla, jolloin luodut testit voidaan suorittaa automaattisesti. Yleisin Javalla käytettävä testauskehys on JUnit, johon on jo tutustuttu pikaisesti kursseilla ohjelmoinnin perusteet (TKT10002) ja ohjelmoinnin jatkokurssi (TKT10003).

<br/>

Uusia testiluokkia voi luoda NetBeansissa valitsemalla New -> Other -> JUnit -> JUnit Test. Tämän jälkeen NetBeans kysyy testiluokalle nimeä ja pakkausta. Huomaa että lähdekoodit ja testikoodit päätyvät erillisiin kansioihin -- juurin näin sen pitääkin olla. Kun testiluokka on luotu, on projektin rakenne kutakuinkin seuraavanlainen.


```
.
|-- pom.xml
`-- src
  |-- main
  |   |-- java
  |   |   `-- ... oman projektin koodit
  |   |-- resources
  |       `-- ... resurssit, mm. konfiguraatio ja thymeleafin templatet
  |
  `-- test
      `-- java
          `-- ... testikoodit!
```


Kurssin tehtäväpohjissa JUnit-testikirjasto on valmiina mukana. Yksikkötestauksesta JUnit-kirjaston avulla löytyy ohjeistusta aiemmin käydyiltä ohjelmointikursseilta TKT10002 ja TKT10003 sekä kursseilta Ohjelmistotekniikka (TKT-20002) ja Ohjelmistotuotanto (TKT-20006).


### Integraatiotestaus

Spring tarjoaa `spring-boot-starter-test`-kirjaston, jonka avulla JUnit-kirjasto saa `@Autowired`-annotaatiot toimimaan. Tämän avulla voimme injektoida testimetodille esimerkiksi repository-rajapinnan toteuttavan olion sekä testata sen tarjoamien metodien toimintaa. Testattava palvelu voi hyödyntää muita komponentteja, jolloin testauksen kohteena on kokonaisuuden toiminta yhdessä.

Käytetyn riippuvuuden versio liittyy Spring Boot -projektin versioon, eikä sitä tarvitse määritellä tarkemmin.


```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
```


Yksittäisten palvelujen testaamisessa tarvitsemme testiluokkien alkuun kaksi annotaatiota. Annotaatio `@RunWith(SpringRunner.class)` kertoo että käytämme Springiä yksikkötestien ajamiseen ja annotaatio `@SpringBootTest` lataa sovelluksen osat käyttöön.


Alla on esimerkkinä testiluokka, johon injektoidaan automaattisesti `BankingService`-olio sekä `AccountRepository`-rajapinnan toteuttama repository-olio.


```java
@RunWith(SpringRunner.class)
@SpringBootTest
public class ApplicationTest {

  @Autowired
  private BankingService bankingService;

  @Autowired
  private AccountRepository accountRepository;

  // ... testit jne
}
```

Käynnistämällä Springin osana testejä, saamme käyttöömme oliokontekstin, jonka avulla voimme asettaa testattavat oliot testiluokkiin testaamista varten. Testattavien olioiden riippuvuudet asetetaan myös automaattisesti, eli jos `BankingService` sisältää muita komponentteja, on ne myös automaattisesti asetettu.

Voimme ylläolevalla lähestymistavalla testata myös sitä, että sovelluksemme eri osat toimivat yhteen toivotusti. Oletetaan, että käytössämme on aiemmin esitelty luokka `BankingService`, joka tarjoaa metodin `transfer`. Metodin pitäisi siirtää annettu summan kahden tilin välillä. Tämän lisäksi käytössämme on `AccountRepository`, jonka avulla voimme hakea tietokannasta tietoa tilien nimien perusteella.


Kummatkin toteutukset voidaan injektoida testiluokkaan. Alla oleva testi tarkastaa, että luokan `BankingService` toteutus toimii toivotulla tavalla.


```java
// importit

@RunWith(SpringRunner.class)
@SpringBootTest
public class ApplicationTest {

  @Autowired
  private BankingService bankingService;

  @Autowired
  private AccountRepository accountRepository;

  @Test
  public void testBankTransfer() {
      Account first = new Account();
      first.setBalance(200);
      first.setIban("first");
      Account second = new Account();
      second.setIban("second");
      second.setBalance(0);

      accontRepository.save(first);
      accontRepository.save(second);

      bankingService.transfer("first", "second", 200);

      assertEquals(0, accountRepository.findByIban("first").getBalance());
      assertEquals(200, accountRepository.findByIban("second").getBalance());
  }

  // ja muita testejä
}
```


Yllä oleva testi testaa vain tilisiirron onnistumista. Se ei kuitenkaan tarkasta esimerkiksi sivuvaikutuksia. Auki jäävät muun muassa kysymykset: siirtääkö palvelu rahaa jollekin toiselle tilille? Mitä käy jos tilillä ei ole rahaa?


#### Testiprofiili

Edellisessä esimerkissä on toinenkin ongelma. Kun testissä luodaan uudet tilit ja siirretään rahaa niiden välillä, muutokset tapahtuvat oletuksena käytössä olevaan tietokantaan. Tähän asti käytössä on ollut H2-tietokannanhallintajärjestelmän tiedostoon kirjoittava versio. Tämä tarkoittaa sitä, että myös yllä toteutetuissa testeissä on käytössä sama tietokannanhallintajärjestelmä ja testeissä tehtävät muutokset kirjoitetaan tiedostoon, josta ne ovat myös testien ajamisen jälkeen. Tämä ei ole toivottu tilanne.

Luodaan uusi konfiguraatiotiedosto nimeltä `application-test.properties`. Konfiguraatiotiedoston pääte `-test` kertoo Springille, että kyseinen konfiguraatiotiedosto tulee ladata käyttöön mikäli käytössä on profiili `test`.

Määritellään konfiguraatio siten, että tietokantana on muistiin ladattava tietokanta. Tämä onnistuu seuraavasti:

```
spring.datasource.url=jdbc:h2:mem:db;DB_CLOSE_DELAY=-1
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect
```

Kun lisäämme testit sisältävään lähdekoodiin annotaation `@ActiveProfiles("test")`, käytetään testeissä `test`-profiiliin liittyvää konfiguraatiota.

```java
// importit

@ActiveProfiles("test")
@RunWith(SpringRunner.class)
@SpringBootTest
public class ApplicationTest {

  @Autowired
  private BankingService bankingService;

  // jne...
```

Nyt testien käytössä on tietokanta, joka luodaan aina testien käynnistyksen yhteydessä ja poistetaan testien suorituksen jälkeen.


### Järjestelmätestaus


Järjestelmätestauksessa pyritään varmistamaan, että järjestelmä toimii toivotulla tavalla. Järjestelmää testataan saman rajapinnan kautta, kuin mitä sen loppukäyttäjät käyttävät. Järjestelmätestaukseen on monenlaisia työkaluja, joista käsittelemme tässä kahta. Tutustumme ensin integraatiotestauksessa järjestelmätason testaustoiminnallisuuteen, jonka jälkeen tutustumme harjoitustehtävän `FluentLenium`-kirjastoon.


#### MockMvc

Voimme tuoda halutessamme testien käyttöön koko web-sovelluksen kontekstin. Tämä onnistuu <a href="http://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/test/web/servlet/MockMvc.html" target="_blank">MockMvc</a>-olion avulla -- MockMvc-olio mahdollistaa pyyntöjen tekemisen sovelluksen tarjoamiin osoitteisiin, pyyntöjen tulosten tarkastelun, sekä pyyntöjen vastauksena tulleen datan tarkastelun. MockMvc-olion käyttö vaatii testeihin ylimääräisen annotaation `@AutoConfigureMockMvc`.

<br/>

Alla oleva esimerkki käynnistää sovelluksen ja tekee kaksi GET-pyyntöä osoitteeseen `/messages`. Ensimmäinen pyyntö liittyy testiin, missä varmistetaan että vastaus sisältää statuskoodin `200` eli "OK". Toinen pyyntö liittyy testiin, joka tarkistaa tarkistaa että vastauksessa on merkkijono "Awesome".


```java
// muut importit

// mm. mockMvc:n get- ja post-metodit
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ActiveProfiles("test")
@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
public class MessagesTest {

  @Autowired
  private MockMvc mockMvc;

  @Test
  public void statusOk() throws Exception {
      mockMvc.perform(get("/messages"))
              .andExpect(status().isOk());
  }

  @Test
  public void responseContainsTextAwesome() throws Exception {
      MvcResult res = mockMvc.perform(get("/messages"))
              .andReturn();

      String content = res.getResponse().getContentAsString();
      Assert.assertTrue(content.contains("Awesome"));
  }
}
```

Voit myös testata modeliin asetettujen attribuuttien olemassaoloa ja oikeellisuutta. Olemassaolon voi tarkistaa `model()`-metodin kautta, ja `MvcResult`-olion kautta pääsee käsiksi modelin sisältöön.

Alla ensimmäinen testimetodi varmistaa, että pyynnön käsittelevä kontrolleri lisää model-olioon attribuutin, jonka nimi on "messages". Toisessa haetaan attribuuttiin "messages" liittyvä tietosisältö -- tässä oletetaan, että se sisältää listan `Message`-tyyppisiä olioita.


```java
  @Test
  public void modelHasAttributeMessages() throws Exception {
      mockMvc.perform(get("/messages"))
              .andExpect(model().attributeExists("messages"));
  }

  @Test
  public void messagesCorrect() throws Exception {
      MvcResult res = mockMvc.perform(get("/messages"))
              .andReturn();

      // oletetaan, että kontrolleri asettaa kokoelman Message-tyyppisiä olioita
      // modeliin

      List<Message> messages = (List) res.getModelAndView().getModel().get("messages");

      // tarkista kokoelma
  }
```


MockMvc:n avulla voi testata käytännössä suurinta osaa palvelinsovellusten toiminnallisuudesta, mutta samalla se tarjoaa pääsyn samaan rajapintaan kuin mitä selain käsitteelee.


<programming-exercise name='Airports and Aircrafts Test' tmcname='osa04-Osa04_05.AirportsAndAircraftsTest'>

Muistamme edellisestä osiosta tehtävän, missä tehtiin sovellus lentokoneiden ja lentokenttien hallintaan. Tässä tehtävässä harjoitellaan hieman sekä integraatio- että järjestelmätestausta. Tehtävässä ei ole automaattisia testejä, joilla testattaisiin kirjoittamiasi testejä. Aina kun lisäät yksittäisen testin, voit ajaa testit klikkaamalla projektia oikealla hiirennapilla ja valitsemalla "Test".

Joudut todennäköisesti turvautumaan internetiin tehtävää ratkaistessasi. Pidä kirjaa sivuista, joilta hait apua tehtävän ratkaisemiseen -- tämän sivun lopussa kysytään testaustehtävien ratkaisemiseen käyttämiäsi lähteitä.

Palauttaessasi tehtävän olet tarkistanut, että kirjoittamasi testit toimivat kuten tehtävänannossa on kuvattu.


<h2>AirportServiceTest</h2>


Sovelluksessa on luokka `AirportService`, mikä sijaitsee pakkauksessa `airports`. Sille ei kuitenkaan ole yhtäkään testiä :(

Testaustehtävät saattavat vaatia toiminnallisuuksia aiemmin toteuttamistasi tehtävistä. Voit käyttää apuna toteutuksessa joko omaa vastaustasi tai mallivastausta.

Lisää testikansion (`Test Packages`) pakkaukseen `airports` luokka `AirportServiceTest`.

Lisää luokalle `AirportServiceTest` tarvittavat annotaatiot ja injektoi sinne oliomuuttujiksi `AirportService` ja `AirportRepository` -oliot. Toteuta luokkaan `AirportServiceTest` testimetodit, joiden avulla testataan, että luokan `AirportService` metodit toimivat oikein. Haluat varmistaa että:

- Kun uusi lentokenttä luodaan `AirportService`-luokan metodilla `create`, lentokenttä tallentuu tietokantaan ja tietokannasta löytyy annetuilla lentokenttä annetuilla parametreilla. Tee tälle tarkastukselle oma testimetodi.
- Kun lentokentät haetaan luokan `AirportService` metodilla `list`, metodi palauttaa kaikki tietokannassa olevat lentokentät. Tee tälle tarkastukselle oma testimetodi. Testimetodin alussa kannattaa lisätä tietokantaan muutamia lentokenttiä, jolloin tietokanta ei ole varmasti tyhjä.
- Kun luokan `AirportService` metodilla `create` luodaan jo tietokannassa oleva lentokenttä, ei tietokantaan tule uutta samannimistä lentokenttää. Tee tälle tarkastukselle oma testimetodi. Kun ajat testit, huomaat, että tätä tarkastusta ei ole toteutettu luokan `AirportService` metodiin `create`. Lisää tarkastus myös `create`-metodiin.


<h2>AircraftControllerTest</h2>

Lisää testikansion (`Test Packages`) pakkaukseen `airports` luokka `AircraftControllerTest`. Lisää luokkaan tarvittavat määrittelyt, jotta voit käyttää `MockMvc`-komponenttia testeissä.

Tee seuraavat testit:

- Kun osoitteeseen `/aircrafts` tehdään GET-pyyntö, vastauksen status on 200 (ok) ja vastauksen model-oliossa on parametrit `aircrafts` ja `airports`.
- Kun osoitteeseen `/aircrafts` tehdään POST-pyyntö, jonka parametriksi annetaan `name`-kenttä, jonka arvona on "HA-LOL", pyynnön vastaukseksi tulee uudelleenohjaus. Tee tämän jälkeen erillinen kysely tietokantaan esim. `AircraftRepository`:n avulla, ja varmista, että tietokannasta löytyy lentokone, jonka nimi on `HA-LOL`.
- Kun osoitteeseen `/aircrafts` tehdään POST-pyyntö, jonka parametriksi annetaan `name`-kenttä, jonka arvona on "XP-55", pyynnön vastaukseksi tulee uudelleenohjaus. Tee tämän jälkeen GET-pyyntö osoitteeseen `/aircrafts`, ja tarkista että pyynnön vastauksena saatavan `model`-olion sisältämässä `"aircrafts"`-listassa on juuri luotu lentokone.

</programming-exercise>



#### FluentLenium


MockMvc:n lisäksi järjestelmätestaukseen käytetään melko paljon käyttöliittymän testaamiseen tarkoitettua <a href="http://www.seleniumhq.org/" target="_blank">Selenium</a>ia ja sen kapseloivia kirjastoja kuten <a href="https://fluentlenium.com/" target="_blank">FluentLenium</a>ia. Nämä kirjastot ovat web-selaimen toimintojen automatisointiin tarkoitettuja välineitä, jotka antavat sovelluskehittäjälle mahdollisuuden käydä läpi sovelluksen käyttöliittymää ohjelmallisesti. Kirjastot poikkeavat edellä nähdystä `MockMvc`-oliosta siten, että ne mahdollistavat testien ajamisen selaimen kaltaisessa ympäristössä, missä testeissä voi klikata linkkejä, täyttää lomakkeita ymym.

<br/>

Tarkastellaan FluentLeniumin käyttöä lyhyesti. Alla on listattuna FluentLenium-kirjaston vaatimat riippuvuudet. Oletamme, että testit kirjoitetaan JUnit-testikirjaston avulla (FluentLenium tarjoaa myös muita vaihtoehtoja). Riippuvuudet ovat valmiina määriteltynä tehtäväpohjissa.

```xml
<dependency>
    <groupId>org.fluentlenium</groupId>
    <artifactId>fluentlenium-junit</artifactId>
    <version>3.7.1</version>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.fluentlenium</groupId>
    <artifactId>fluentlenium-assertj</artifactId>
    <version>3.7.1</version>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.seleniumhq.selenium</groupId>
    <artifactId>htmlunit-driver</artifactId>
</dependency>
```

Oletetaan, että käytössämme on sovellus, joka tarjoaa ilmoittautumismahdollisuuden ja jonka näyttämä HTML-sivu on seuraavanlainen.

```html
<html>
  <head>
    <title>Ilmoittautuminen</title>
  </head>
  <body>
    <h2>Ilmoittautuneet</h2>
    <ul>
      <li>Rekku</li>
      <li>Kaja</li>
      <li>Vainu</li>
    </ul>

    <h2>Lisää uusi ilmoittautuminen</h2>
    <form method="POST" action="/ilmoittautuminen">
      <input type="text" name="name" id="nimi"/>
      <input type="submit" value="Lähetä!"/>
    </h1>
  </body>
</html>
```

Testaamme toiminnallisuutta "Käyttäjä voi ilmoittautua". Lisäämme listalle käyttäjän Rolle. Oletetaan, että yllä oleva lomake löytyy osoitteesta "/ilmoittautuminen" ja että käyttäjää ei ole aluksi listalla, mutta käyttäjän tulee löytyä listalta ilmoittautumisen jälkeen. Testiflow on seuraava:

1. Avaa sivu "/ilmoittautuminen"
2. Varmistetaan ettei ilmoittautuneissa ole Rollea.
3. Etsi kenttä, johon syötetään nimi. Tunnistamme kentän sen `id`-attribuutin perusteella. Kirjoita attribuutin `id` arvolla "nimi" tunnistettavaan kenttään uuden ilmoittautuneen nimi. Tässä lisäämme ilmoittautuneisiin Rollen.
4. Lähetä lomake.
5. Varmista, että sivulle on lisätty Rolle.

```java
// importit

@ActiveProfiles("test")
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class IlmoittautumisJarjestelmaTest extends org.fluentlenium.adapter.junit.FluentTest {

    @LocalServerPort
    private Integer port;

    @Test
    public void canSignUp() {
        // Avaa sivu "/ilmoittautuminen"
        goTo("http://localhost:" + port + "/ilmoittautuminen");

        // Varmistetaan ettei ilmoittautuneissa ole Rollea
        assertFalse(pageSource().contains("Rolle"));

        // Etsi kenttä, jonka attribuutin 'id' arvo on nimi ja täytä kentän arvoksi Rolle
        find("#nimi").fill().with("Rolle");

        // Lähetä lomake
        find("form").first().submit();

        // Varmista, että sivulle on lisätty Rolle
        assertTrue(pageSource().contains("Rolle"));

    }
// ...
```

Yllä tehdään useita oletuksia. Testi olettaa, että sivulla ei ole merkkijonoa "Rolle" missään tilanteessa. Testi myös olettaa, että sivulla on täsmälleen yksi lomake. Mikäli lomakkeita olisi useampi, voi lomakkeeseen myös määritellä oman `id`-attribuutin, jolloin lomake voidaan tunnistaa attribuutin arvon perusteella. Lopulta, testi olettaa, että lomakkeen lähetyksen jälkeen käyttäjä ohjataan sivulle, missä ilmoittautumiset ovat listattuna (tai tarkemmin, juuri ilmoittautunut on listattuna). Testi ei toisaalta tarkastele millään tavalla esimerkiksi tietokantaan tehtyjä muutoksia -- näiden tarkastelu onnistuisi injektoimalla käyttöön tietokanta-abstraktion.

Tarkastellaan yllä toteutettua testiä hieman tarkemmin. Annotaatio `@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)` käynnistää palvelimen integraatiotestausta varten satunnaisessa portissa. Sovelluksen portti asetetaan annotaatiota `@LocalServerPort` seuraavaan muuttujaan `port`.

Testissä menemme paikalliseen osoitteeseen `http://localhost:*portti*/ilmoittautuminen`, missä portin numero on satunnaisesti valittu -- surffaamme siis haluttuun osoitteeseen. Tarkastamme tämän jälkeen, että sivulla ei ole merkkijonoa "Rolle". Tätä seuraa kentän, jonka id-attribuutin arvo on "nimi" täyttäminen merkkijonolla "Rolle" -- tietyn kentän hakeminen onnistuu `find`-metodilla, jolle annetaan parametrina kentän tiedot: jos kentällä on attribuutti `id`, voidaan kenttä tunnistaa testeissä merkkijonolla `#idattribuutinarvo` eli risuaidalla '#', jota seuraa kentän attribuutin `id` arvo.

Tätä seuraa lomakkeen lähettäminen lomakkeeseen liittyvällä submit-metodilla. Kun lomake on lähetetty, haetaan sivun lähdekoodista tekstiä "Rolle". Jos tekstiä ei löydy, testi epäonnistuu.

Oleellista testien kirjoittamisessa on siis mahdollisuus kenttien tunnistamiseen. Tämä onnistuu määrittelemällä sivuilla sopivat `id`-attribuutit. Muita toiminnallisuuksia on listattuna FluentLenium-kirjaston dokumentaatiossa, joka löytyy osoitteesta <a href="http://www.fluentlenium.org/" target="_blank">http://www.fluentlenium.org/</a>. Googlesta on myös apua.

<br/>


<programming-exercise name='Movie Database Test' tmcname='osa04-Osa04_06.MovieDatabaseTest'>

Tehtäväpohjassa on sovellus elokuvien ja näyttelijöiden hallintaan. Tässä tehtävässä harjoitellaan hieman järjestelmätestausta FluentLeniumin avulla. Kuten edellisessä tehtävässä, tässäkään tehtävässä ei ole automaattisia testejä vaan tehtävänäsi on toteuttaa ne.

Joudut todennäköisesti turvautumaan internetiin tehtävää ratkaistessasi. Pidä kirjaa sivuista, joilta hait apua tehtävän ratkaisemiseen -- tämän sivun lopussa kysytään testaustehtävien ratkaisemiseen käyttämiäsi lähteitä.

<h2>Näyttelijän lisääminen ja poistaminen</h2>


Luo testikansioon `movies` testiluokka `ActorTest`, johon asetat Fluentlenium-testaamiseen tarvittavat komponentit.


Toteuta luokkaan testi, jossa tehdään seuraavat askeleet:


1. Mennään näyttelijäsivulle
2. Tarkistetaan ettei sivulla ole tekstiä "Uuno Turhapuro"
3. Etsitään kenttä, jonka id on "name" ja asetetaan kenttään teksti "Uuno Turhapuro".
4. Lähetetään lomake.
5. Tarkistetaan että sivulla on teksti "Uuno Turhapuro"
6. Klikataan "Uuno Turhapuro"on liittyvää poista-nappia
7. Tarkistetaan ettei sivulla ole tekstiä "Uuno Turhapuro"


<h2>Elokuvan lisääminen ja näyttelijän lisääminen elokuvaan</h2>


Luo testikansioon `movies` testiluokka `MovieTest`, johon asetat Selenium-testaamiseen tarvittavat komponentit.

Toteuta luokkaan testi, jossa tehdään seuraavat askeleet:


1. Mennään elokuvasivulle
2. Tarkistetaan ettei sivulla ole tekstiä "Uuno Epsanjassa"
3. Tarkistetaan ettei sivulla ole tekstiä "Uuno Turhapuro"
4. Etsitään kenttä, jonka id on "name" ja lisätään siihen arvo "Uuno Epsanjassa"
5. Etsitään kenttä, jonka id on "lengthInMinutes" ja lisätään siihen arvo "92"
6. Lähetetään lomake
7. Tarkistetaan että sivulla on teksti "Uuno Epsanjassa"
8. Tarkistetaan ettei sivulla ole tekstiä "Uuno Turhapuro"
9. Mennään näyttelijäsivulle
10. Tarkistetaan ettei sivulla ole tekstiä "Uuno Turhapuro"
11. Etsitään kenttä, jonka id on "name" ja asetetaan kenttään teksti "Uuno Turhapuro"
12. Lähetetään lomake
13. Tarkistetaan että sivulla on teksti "Uuno Turhapuro"
14. Etsitään linkki, jossa on teksti "Uuno Turhapuro" ja klikataan sitä
15. Etsitään nappi, jonka id on "add-to-movie" ja klikataan sitä.
16. Mennään elokuvasivulle
17. Tarkistetaan että sivulla on teksti "Uuno Epsanjassa"
18. Tarkistetaan että sivulla on teksti "Uuno Turhapuro"


</programming-exercise>


<quiz id='5c98ee47ddb6b814af32ab0d'></quiz>
