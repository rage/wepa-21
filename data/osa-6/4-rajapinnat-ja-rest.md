---
path: '/osa-6/4-rajapinnat-ja-rest'
title: 'Rajapinnat ja REST'
hidden: false
---


<text-box variant='learningObjectives' name='Oppimistavoitteet'>

- Tiedät mitä rajapinnoilla tarkoitetaan web-sovelluksista puhuttaessa.
- Tunnet käsitteet REST ja JSON.
- Tiedät miten JSON-muotoista tietoa käsitellään Spring-sovelluksissa.
- Osaat luoda sovelluksen, joka tarjoaa JSON-muotoista dataa REST-rajapinnan yli.
- Tiedät miten JSON-muotoista dataa tarjoavaa kolmannen osapuolen palvelua voidaan käyttää omassa sovelluksessa.

</text-box>


Olemme tähän asti tarkastelleet sovelluksia, jotka tuottavat käyttäjälle jonkinlaisen näkymän ja mahdollistavat sitä kautta sovelluksen käytön. Tutustutaan seuraavaksi sovelluksiin, jotka näkymän sijaan tarjoavat rajapinnan tiedon hakemiseen. Tällaisten rajapinnan tarjoavien sovellusten käyttäjiä ovat ensisijaisesti muut sovellukset sekä niiden kehittäjät.

Aloitamme eräästä ehkäpä tämän hetken suosituimmasta tavasta rajapintojen toteuttamiseen.


## Representational state transfer

Representational state transfer ([REST](https://en.wikipedia.org/wiki/Representational_state_transfer)) on ohjelmointirajapintojen toteuttamiseen tarkoitettu arkkitehtuurimalli (tai tyyli). REST-malli määrittelee sovellukset tietoa käsittelevien osien (komponentit), tietokohteiden (resurssit), sekä näiden yhteyksien kautta.

Tietoa käsittelevät osat ovat selainohjelmisto, palvelinohjelmisto, ym. Resurssit ovat sovelluksen käsitteitä ja tietoa (henkilöt, kirjat, laskentaprosessit, laskentatulokset -- käytännössä mikä tahansa voi olla resurssi) sekä niitä yksilöiviä osoitteita. Resurssikokoelmat ovat löydettävissä ja navigoitavissa: resurssikokoelma voi löytyä esimerkiksi osoitteesta `/persons`, `/books`, `/processes` tai `/results`. Yksittäisille resursseille määritellään uniikit osoitteet (esimerkiksi `/persons/1`) ja resursseihin liittyvällä tiedolla on selkeästi määritelty ja deterministinen esitysmuoto -- esim [HTML](https://en.wikipedia.org/wiki/HTML), [JSON](https://en.wikipedia.org/wiki/JSON) tai [XML](https://en.wikipedia.org/wiki/XML).

Resursseja ja tietoa käsittelevien osien yhteys perustuu tyypillisesti asiakas-palvelin -malliin, missä asiakas tekee pyynnön ja palvelin kuuntelee ja käsittelee vastaanottamiaan pyyntöjä sekä palauttaa niihin vastauksia.


<text-box variant='hint' name='Principled Design of the Modern Web Architecture'>

"The" REST on määritelty Roy Fieldingin ja Richard Taylorin artikkelissa [Principled Design of the Modern Web Architecture](https://www.ics.uci.edu/~fielding/pubs/webarch_icse2000.pdf) sekä Fieldingin väitöskirjan [viidennessä luvussa](https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm).

Tällä hetkellä termiä REST käytetään hyvin monenlaisista rajapinnoista, vaikkei niillä olisi mitään tekemistä RESTin kanssa. Fielding on ottanut tähän ilmiöön kantaa blogissaan -- hänen mukaansa [oleellista on mahdollisuus resurssien välillä navigointiin](http://roy.gbiv.com/untangled/2008/rest-apis-must-be-hypertext-driven).

*"A truly RESTful API looks like hypertext. Every addressable unit of information carries an address, either explicitly (e.g., link and id attributes) or implicitly (e.g., derived from the media type definition and representation structure). Query results are represented by a list of links with summary information, not by arrays of object representations (query is not a substitute for identification of resources)."*

</text-box>


## REST-rajapinnat web-sovelluksissa

HTTP-protokollan yli käsiteltävillä REST-rajapinnoilla on tyypillisesti seuraavat ominaisuudet:

1. Juuriosoite resurssien käsittelyyn (esimerkiksi `/books`)

2. Resurssien esitysmuodon määrittelevä mediatyyppi (esimerkiksi `HTML`, `JSON`, ...), joka kertoo asiakkaalle miten resurssiin liittyvä data tulee käsitellä.

3. Resursseja voidaan käsitellä HTTP-protokollan metodeilla (GET, POST, DELETE, ..)

Tarkastellaan tätä kirjojen käsittelyyn liittyvän esimerkin kautta.  Kirjojen käsittelyyn ja muokkaamiseen tarkoitettu rajapinta voisi olla esimerkiksi seuraavanlainen:

- `GET` osoitteeseen `/books` palauttaa kaikkien kirjojen tiedot.

- `GET` osoitteeseen `/books/{id}`, missä `{id}` on yksittäisen kirjan yksilöivä tunniste, palauttaa kyseisen kirjan tiedot.

- `PUT` osoitteeseen `/books/{id}`, missä `{id}` on yksittäisen kirjan yksilöivä tunniste, muokkaa kyseisen kirjan tietoja. Kirjan uudet tiedot lähetetään osana pyyntöä.

- `DELETE` osoitteeseen `/books/{id}` poistaa kirjan tietyllä tunnuksella.

- `POST` osoitteeseen `/books` luo uuden kirjan pyynnössä lähetettävän datan pohjalta.

Osoitteissa käytetään tyypillisesti substantiiveja -- ei `books?id={id}` vaan `/books/{id}`. HTTP-pyynnön tyyppi määrittelee operaation -- `DELETE`-tyyppisellä pyynnöllä poistetaan, `POST`-tyyppisellä pyynnöllä lisätään, `PUT`-tyyppisellä pyynnöllä päivitetään, ja `GET`-tyyppisellä pyynnöllä haetaan tietoja.

Datan muoto on toteuttajan päätettävissä. Tällä hetkellä suosituin datamuoto on [JSON](https://en.wikipedia.org/wiki/JSON), sillä sen käyttäminen selainohjelmistoissa käytettävällä JavaScriptilla on suoraviivaista. Myös palvelinohjelmistot tukevat olioiden muuttamista JSON-muotoon.

Oletetaan että edellä kuvattu kirjojen käsittelyyn tarkoitettu rajapinta käsittelee JSON-muotoista dataa. Kirjaa kuvaava luokka on seuraavanlainen:


```java
// pakkaus ja importit

@NoArgsConstructor
@AllArgsConstructor
@Data
public class Book extends AbstractPersistable<Long> {
  private String name;
}
```

Kun luokasta on tehty olio, jonka `id`-muuttujan arvo on `2` ja nimi `"Harry Potter and the Chamber of Secrets"`, on sen JSON-esitys (esimerkiksi) seuraavanlainen:


```json
{
  "id":2,
  "name":"Harry Potter and the Chamber of Secrets"
}
```

JSON-notaatio määrittelee olion alkavalla aaltosululla `{`, jota seuraa oliomuuttujien nimet ja niiden arvot. Lopulta olio päätetään sulkevaan aaltosulkuun `}`. Oliomuuttujien nimet ovat hipsuissa `"` sillä ne käsitellään merkkijonoina. Muuttujien arvot ovat arvon tyypistä riippuen hipsuissa. Tarkempi kuvaus JSON-notaatiosta löytyy sivulta [json.org](http://json.org/).


Pyynnön rungossa lähetettävän JSON-muotoisen datan muuntaminen olioksi onnistuu Springissä annotaation [@RequestBody](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/bind/annotation/RequestBody.html) avulla. Annotaation `@RequestBody` tulee edeltää kontrollerimetodin parametrina olevaa oliota, johon palvelimelle lähetetyn JSON-muotoisen datan arvot halutaan asettaa.

```java
@PostMapping("/books")
public String postBook(@RequestBody Book book) {
    bookRepository.save(book);
    return "redirect:/books";
}
```

Jotta yllä oleva esimerkki toimisi, tulee palvelimelle lähetettävän JSON-muotoisen datan muuttujien nimien vastata parametrina olevan olion muuttujien nimiä.

Palvelin palauttaa käyttäjälle `JSON`-muotoisen vastauksen mikäli pyyntöä käsittelevässä metodissa on annotaatio [@ResponseBody](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/bind/annotation/ResponseBody.html) ja palauttamalla metodista olio. Annotaatio `@ResponseBody` pyytää Spring-sovelluskehystä asettamaan palvelimen tuottama datan selaimelle lähetettävän vastauksen runkoon. Jos vastaus on olio, muutetaan se (oletuksena) automaattisesti JSON-muotoiseksi vastaukseksi.

Alla olevassa esimerkissä määritellään kontrolleriluokan metodi, joka kuuntelee pyyntöjä osoitteeseen `/books`, jota seuraa kirjan tunnuksen määrittelevä polkumuuttuja. Metodi palauttaa polkumuuttujan arvoa vastaavan olion tietokannasta `JSON`-muotoisena.

```java
@GetMapping("/books/{id}")
@ResponseBody
public Book getBook(@PathVariable Long id) {
    return bookRepository.getOne(id);
}
```

Alla oleva esimerkki sekä tallentaa olion tietokantaan että palauttaa tietokantaan tallennetun olion.

```java
@PostMapping("/books")
@ResponseBody
public Book postBook(@RequestBody Book book) {
    return bookRepository.save(book);
}
```

Yllä kuvattu kontrollerimetodi määrittelee polkua `/books` kuuntelevan toiminnallisuuden. Metodille voi lähettää JSON-muotoista dataa, joka tallennetaan tietokantaan. Metodin vastaus on myös JSON-muotoinen -- vastaus sisältää tietokantaan luodun kirjaolion tiedot (myös juuri luotuun kirjaan liittyvän pääavaimen).

Voimme lisätä annotaatioille `@GetMapping`, `@PostMapping`, jne lisätietoa metodin käsittelemän datan mediatyypistä. Attribuutti `consumes` kertoo minkälaista dataa metodin kuuntelema osoite hyväksyy. Metodi voidaan rajoittaa vastaanottamaan JSON-muotoista dataa merkkijonolla `"application/json"`. Vastaavasti metodille voidaan lisätä tieto sen tuottaman datan mediatyypistä. Attribuutti `produces` kertoo tuotettavan mediatyypin. Alla määritelty metodi sekä vastaanottaa että tuottaa JSON-muotoista dataa.


```java
@PostMapping(path="/books", consumes="application/json", produces="application/json")
@ResponseBody
public Book postBook(@RequestBody Book book) {
    return bookStorage.create(book);
}
```

## RestController

Kun toteutat omaa REST-rajapintaa, kontrolleriluokan annotaatioksi kannattaa määritellä annotaation `@Controller` sijaan annotaatio `@RestController`. Tällöin jokaiseen polkua kuuntelevaan metodiin tulee automaattisesti annotaatio `@ResponseBody` sekä oikea mediatyyppi -- tässä tapauksessa "application/json".

Toteutetaan seuraavaksi kaikki tarvitut metodit kirjojen tallentamiseen. Kontrolleri hyödyntää erillistä luokkaa, joka tallentaa kirjaolioita tietokantaan ja tarjoaa tuen aiemmin määrittelemiemme books-osoitteiden ja pyyntöjen käsittelyyn -- PUT-metodi on jätetty rajapinnasta pois.


```java
// importit

@RestController
public class BookController {

  @Autowired
  private BookRepository bookRepository;

  @GetMapping("/books")
  public List<Book> getBooks() {
      return bookRepository.findAll();
  }

  @GetMapping("/books/{id}")
  public Book getBook(@PathVariable Long id) {
      return bookRepository.getOne(id);
  }

  @DeleteMapping("/books/{id}")
  public Book deleteBook(@PathVariable Long id) {
      return bookRepository.deleteById(id);
  }

  @PostMapping("/books")
  public Book postBook(@RequestBody Book book) {
      return bookRepository.save(book);
  }
}
```

<text-box variant='hint' name='Apuvälineitä rajapinnan tarjoavan sovelluksen testaamiseen'>

Avoimen rajapinnan kolmannen osapuolen ohjelmistoille tarjoavat palvelinohjelmistot eivät aina sisällä erillistä käyttöliittymää. Niiden testaaminen tapahtuu sekä automaattisilla testeillä, että erilaisilla selainohjelmistoilla. Yksi hyvin hyödyllinen apuväline on Postman, jonka saa sekä [työpöytäsovelluksena](https://www.getpostman.com) että [Chromen liitännäisenä](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop).

Postmanin hyödyntäminen on erittäin suositeltavaa -- kannattaa katsoa sen johdatusvideo, joka löytyy Postmanin sivulta. Katso myös [Restiä käsittelevä](https://www.youtube.com/watch?v=7YcW25PHnAA) Youtube-video, missä Postmania käytetään hieman (alkaa kohdasta 6:33).

</text-box>


<programming-exercise name='ScoreService (2 osaa)' tmcname='osa06-Osa06_07.ScoreService'>

Tässä tehtävässä toteutetaan pelitulospalvelu, joka tarjoaa REST-rajapinnan pelien ja tuloksien käsittelyyn. *Huom! Kaikki syötteet ja vasteet ovat JSON-muotoisia olioita.*

Tehtäväpohjassa on toteutettu valmiiksi luokat `Game` ja `Score` sekä niihin liittyvät `Repository`-rajapinnat.


<h2>GameController</h2>

Pelejä käsitellään luokan `Game` avulla.

Toteuta pakkaukseen `scoreservice` luokka `GameController`, joka tarjoaa REST-rajapinnan pelien käsittelyyn:

- POST `/games` luo uuden pelin sille annetun pelin tiedoilla ja palauttaa luodun pelin tiedot. (Huom. vieläkin! Pyynnön *rungossa* oleva data on aina JSON-muotoista. Vastaukset tulee myös palauttaa JSON-muotoisina.)

- GET `/games` listaa kaikki talletetut pelit.

- GET `/games/{name}` palauttaa yksittäisen pelin tiedot *pelin nimen perusteella*.

- DELETE `/games/{name}` poistaa nimen mukaisen pelin ja palauttaa poistetun pelin tiedot.



<h2>ScoreController</h2>

Jokaiselle pelille voidaan tallettaa pelikohtaisia tuloksia (luokka `Score`). Jokainen pistetulos kuuluu tietylle pelille, ja tulokseen liittyy aina pistetulos `points` numerona sekä pelaajan nimimerkki `nickname`.

Toteuta pakkaukseen `scoreservice` luokka `ScoreController`, joka tarjoaa seuraavan REST-rajapinnan tuloksien käsittelyyn:

- POST `/games/{name}/scores` luo uuden tuloksen pelille `name` ja asettaa tulokseen pelin tiedot. Tuloksen tiedot lähetetään kyselyn rungossa.

- GET `/games/{name}/scores` listaa pelin `name` tulokset.

- GET `/games/{name}/scores/{id}` palauttaa tunnuksella `id` löytyvän tuloksen `name`-nimiselle pelille.

- DELETE `/games/{name}/scores/{id}` poistaa avaimen `id` mukaisen tuloksen peliltä `name` (pelin tietoja ei tule pyynnön rungossa). Palauttaa poistetun tuloksen tiedot.

</programming-exercise>


## Valmiin palvelun käyttäminen

Toisen sovelluksen tarjoamaan REST-rajapintaan pääsee kätevästi käsiksi [RestTemplate](http://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/client/RestTemplate.html)-luokan avulla.

Kolmannen osapuolen rajapintojen käyttö kannattaa kapseloida omaksi palveluksi -- alla olevassa esimerkissä kuvataan kirjojen hakemiseen tarkoitetun `BookService`-luokan alku.


```java
// importit

@Service
public class BookService {

  private RestTemplate restTemplate;

  public BookService() {
      this.restTemplate = new RestTemplate();
  }

  // tänne luokan tarjoamat palvelut
}
```


Alla on kuvattuna RestTemplaten käyttö tiedon hakemiseen, päivittämiseen, poistaamiseen ja lisäämiseen. Esimerkeissä merkkijono *osoite* vastaa palvelimen osoitetta, esimerkiksi `http://www.google.com`.


- GET osoitteeseen `/books` palauttaa kaikkien kirjojen tiedot *tai* osajoukon kirjojen tiedoista -- riippuen toteutuksesta.

```java
// kirjojen hakeminen
List<Book> books = restTemplate.getForObject("osoite/books", List.class);
```

- GET osoitteeseen `/books/{id}`, missä {id} on yksittäisen kirjan yksilöivä tunniste, palauttaa kyseisen kirjan tiedot.

```java
// tunnuksella 5 määritellyn kirjan hakeminen
Book book = restTemplate.getForObject("osoite/books/{id}", Book.class, 5);
```

- PUT osoitteeseen `/books/{id}`, missä {id} on yksittäisen kirjan yksilöivä tunniste, muokkaa kyseisen kirjan tietoja tai lisää kirjan kyseiselle tunnukselle (toteutuksesta riippuen, lisäystä ei aina toteutettu). Kirjan tiedot lähetetään pyynnön rungossa.

```java
// tunnuksella 5 määritellyn kirjan hakeminen
Book book = restTemplate.getForObject("osoite/books/{id}", Book.class, 5);
book.setName(book.getName() + " - DO NOT BUY!");

// kirjan tietojen muokkaaminen
restTemplate.put("osoite/books/{id}", book, 5);
```

- DELETE osoitteeseen `/books/{id}` poistaa kirjan tietyllä tunnuksella.

```java
// tunnuksella 32 määritellyn kirjan poistaminen
restTemplate.delete("osoite/books/{id}", 32);
```

- POST osoitteeseen `/books` luo uuden kirjan pyynnön rungossa lähetettävän datan pohjalta. Palvelun vastuulla on päättää kirjalle tunnus.


```java
Book book = new Book();
book.setName("Harry Potter and the Goblet of Fire");

// uuden kirjan lisääminen
book = restTemplate.postForObject("osoite/books", book, Book.class);
```

Usein sovellukset hyödyntävät kolmannen osapuolen tarjoamaa palvelua omien toiminnallisuuksiensa toteuttamiseen.


## REST-toteutuksen kypsyystasot


Martin Fowler käsittelee artikkelissaan [Richardson Maturity Model](http://martinfowler.com/articles/richardsonMaturityModel.html) REST-rajapintojen kypsyyttä. Richardson Maturity Model (RMM) jaottelee REST-toteutuksen kolmeen tasoon, joista kukin tarkentaa toteutusta.

Aloituspiste on tason 0 palvelut, joita ei pidetä REST-palveluina. Näissä palveluissa HTTP-protokollaa käytetään lähinnä väylänä viestien lähettämiseen ja vastaanottamiseen, ja HTTP-protokollan käyttötapaan ei juurikaan oteta kantaa. Esimerkki tason 0 palvelusta on yksittäinen kontrollerimetodi, joka päättelee toteutettavan toiminnallisuuden pyynnössä olevan sisällön perusteella.

Tason 1 palvelut käsittelevät palveluita resursseina. Resurssit kuvataan palvelun osoitteena (esimerkiksi `/books`-resurssi sisältää kirjoja), ja resursseja voidaan hakea tunnisteiden perusteella (esim. `/books/nimi`). Edelliseen tasoon verrattuna käytössä on nyt konkreettisia resursseja; olio-ohjelmoijan kannalta näitä voidaan pitää myös olioina, joilla on tila.

Tasolla 2 resurssien käsittelyyn käytetään kuvaavia HTTP-pyyntötyyppejä. Esimerkiksi resurssin pyyntö tapahtuu GET-metodilla, ja resurssin tilan muokkaaminen esimerkiksi PUT, POST, tai DELETE-metodilla. Näiden lisäksi palvelun vastaukset kuvaavat tapahtuneita toimintoja. Esimerkiksi jos palvelu luo resurssin, vastauksen tulee olla statuskoodi `201`, joka viestittää selaimelle resurssin luomisen onnistumisesta. Oleellista tällä tasolla on pyyntötyyppien erottaminen sen perusteella, että muokkaavatko ne palvelimen dataa vai eivät (GET vs. muut).


Kolmas taso sisältää tasot 1 ja 2, mutta lisää käyttäjälle mahdollisuuden ymmärtää palvelun tarjoama toiminnallisuus palvelimen vastausten perusteella. [HATEOAS](https://en.wikipedia.org/wiki/HATEOAS) määrittelee miten web-resursseja tulisi löytää webistä.


Roy Fielding kokee vain tason 3 sovelluksen oikeana REST-sovelluksena. Ohjelmistosuunnittelun näkökulmasta jokainen taso parantaa sovelluksen ylläpidettävyyttä -- *Level 1 tackles the question of handling complexity by using divide and conquer, breaking a large service endpoint down into multiple resources; Level 2 introduces a standard set of verbs so that we handle similar situations in the same way, removing unnecessary variation; Level 3 introduces discoverability, providing a way of making a protocol more self-documenting.* ([lähde](http://martinfowler.com/articles/richardsonMaturityModel.html))


**Huom!** Sovellusta suunniteltaessa ja toteuttaessa ei tule olettaa, että RMM-tason 3 sovellus olisi parempi kuin RMM-tason 2 sovellus. Sovellus voi olla huono riippumatta toteutetusta REST-rajapinnan muodosta -- jossain tapauksissa rajapintaa ei oikeasti edes tarvita; asiakkaan tarpeet ja toiveet määräävät, mitä sovelluskehittäjän kannattaa tehdä.


## Spring Data REST


Spring-sovelluskehys sisältää projektin [Spring Data REST](https://spring.io/projects/spring-data-rest), jonka avulla REST-palveluiden tekeminen helpottuu merkittävästi. Lisäämällä projektin `pom.xml`-konfiguraatioon riippuvuus `spring-boot-starter-data-rest` saamme Spring Boot-paketoidun version kyseisestä projektista käyttöömme.


```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-rest</artifactId>
</dependency>
```

Kun riippuvuus lisätään projektiin, `Repository`-rajapinnat tarjoavat automaattisesti REST-rajapinnan, jonka kautta resursseihin pääsee käsiksi. Riippuvuus tekee muutakin, kuten ottaa käyttöön rajapinnan käyttäjän elämää helpottavan [HAL-selaimen](https://github.com/mikekelly/hal-browser) -- tästä esimerkki osoitteessa [https://haltalk.herokuapp.com](https://haltalk.herokuapp.com).

REST-rajapinta luodaan oletuksena sovelluksen juureen, joka ei aina ole tilanteena ideaali. Spring Data REST-projektin konfiguraatiota voi muokata erillisen [RepositoryRestMvcConfiguration](https://docs.spring.io/spring-data/rest/docs/current/api/org/springframework/data/rest/webmvc/config/RepositoryRestMvcConfiguration.html)-luokan kautta. Alla olevassa esimerkissä REST-rajapinta luodaan osoitteen `/api/v1`-alle. Annotaatio `@Component` kertoo Springille, että luokka tulee ladata käyttöön käynnistysvaiheessa; rajapinta kertoo, mistä luokasta on kyse.


```java
// pakkaus ja importit

@Component
public class CustomizedRestMvcConfiguration extends RepositoryRestConfigurerAdapter {

  @Override
  public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
      config.setBasePath("/api/v1");
  }
}
```

Nyt jos sovelluksessa on entiteetti `Book` sekä siihen sopiva `BookRepository`, on Spring Data REST-rajapinta osoitteessa `/api/v1/books`.


Sovelluksen kehittäjä harvemmin haluaa kaikkia HTTP-protokollan metodeja kaikkien käyttöön. Käytössä olevien metodien rajaaminen onnistuu käytettävää `Repository`-rajapintaa muokkaamalla. Alla olevassa esimerkissä `BookRepository`-rajapinnan olioita ei pysty poistamaan automaattisesti luodun REST-rajapinnan yli.


```java
// pakkaus
import wad.domain.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RestResource;

public interface BookRepository extends JpaRepository<Message, Long> {

  @RestResource(exported = false)
  @Override
  public void delete(Long id);

}
```


## Spring Data REST ja RestTemplate

Spring Data RESTin avulla luotavien rajapintojen hyödyntäminen onnistuu RestTemplaten avulla. Esimerkiksi yllä luotavasta rajapinnasta voidaan hakea `Resource`-olioita, jotka sisältävät kirjoja. RestTemplaten metodi [exchange](http://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/client/RestTemplate.html#exchange-java.lang.String-org.springframework.http.HttpMethod-org.springframework.http.HttpEntity-java.lang.Class-java.lang.Object...-) palauttaa vastausentiteetin, mikä sisältää hakemamme olion tiedot. Kyselyn mukana annettava `ParameterizedTypeReference` taas kertoo, minkälaiseksi olioksi vastaus tulee muuntaa.


```java
RestTemplate restTemplate = new RestTemplate();
ResponseEntity<Resource<Book>> response =
  restTemplate.exchange("osoite/books/1", // osoite
                HttpMethod.GET, // metodi
                null, // pyynnön runko; tässä tyhjä
                new ParameterizedTypeReference<Resource<Book>>() {}); // vastaustyyppi

if (response.getStatusCode() == HttpStatus.OK) {
    Resource<Book> resource = response.getBody();
    Book book = resource.getContent();
}
```


<text-box variant='hint' name='Avoin data'>

Verkko on täynnä avoimia (ja osittain avoimia) ohjelmointirajapintoja, jotka odottavat niiden hyödyntämistä. Tällaisia kokoelmia löytyy muun muassa osoitteista [https://www.avoindata.fi/fi](https://www.avoindata.fi/fi), [https://data.europa.eu/euodp/en/home](https://data.europa.eu/euodp/en/home), [https://index.okfn.org/dataset/](https://index.okfn.org/dataset/), [https://github.com/toddmotto/public-apis](https://github.com/toddmotto/public-apis), [https://www.programmableweb.com/category/open-data/api](https://www.programmableweb.com/category/open-data/api), jne..

</text-box>

