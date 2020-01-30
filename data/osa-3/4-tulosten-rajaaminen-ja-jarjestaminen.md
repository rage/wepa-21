---
path: '/osa-3/4-tulosten-rajaaminen-ja-jarjestaminen'
title: 'Tietokantakyselyiden tulosten rajaaminen ja järjestäminen'
hidden: false
---

<text-box variant='learningObjectives' name='Oppimistavoitteet'>

- Osaat määritellä kyselyn tuloksia rajaavia kriteerejä tietokantakyselyistä vastaavaan tietokantarajapintaan.
- Osaat järjestää kyselyn tuloksia.

</text-box>


Tietokantakyselyn tulokset halutaan usein tietynlaisessa järjestyksessä tai niin, että kysely palauttaa vain rajatun joukon kaikista tuloksista. Jos järjestäminen tai rajaus toteutetaan web-sovelluksessa (eli ei tietokannassa), sovelluksessa tehdään juuri se työ, mihin tietokannat on tarkoitettu. Lisäksi, jos tietokannan tieto noudetaan sovellukseen järjestämistä tai rajausta varten, käytetään tiedon kopiointiin paikasta toiseen turhaan aikaa ja resursseja.


#### Kriteerien lisääminen tietokantakyselyihin

Tietokantakyselyn tulokset halutaan usein hakea tietyn kriteerin mukaan -- esimerkiksi pankkijärjestelmässämme käyttäjä saattaisi haluta hakea konttoreita osoitteen perusteella. Tarkastellaan tässä miten tietokantakyselyihin voi lisätä ehtoja.


Kyselyiden muokkaaminen tapahtuu lisäämällä uusia metodeja rajapinnan `JpaRepository` perivään luokkaan. Voimme lisätä metodeja, jotka hakevat arvoja tietyn attribuutin tai attribuuttiyhdistelmän perusteella. Tällaiset metodit kirjoitetaan muodossa `findBy*Attribuutti*(*AttribuutinTyyppi* arvo)`. Esimerkiksi konttorin hakeminen osoitteen perusteella toteutetaan seuraavalla tavalla.

```java
public interface KonttoriRepository extends JpaRepository<Konttori, Long> {

    List<Konttori> findByOsoite(String osoite);
}
```

Spring Data JPA luo yllä olevasta metodista automaattisesti muotoa `SELECT * FROM Konttori WHERE osoite = '?'` olevan kyselyn, johon parametrina annettava merkkijono `osoite` asetetaan.

Vastaavasti tietyn pankin tietyssä osoitteessa oleva konttori haetaan seuraavalla tavalla.

```java
public interface KonttoriRepository extends JpaRepository<Konttori, Long> {

    List<Konttori> findByOsoite(String osoite);
    Konttori findByOsoiteAndPankki(String osoite, Pankki pankki);
}
```

Metodi `findByOsoiteAndPankki` muuntuu muotoon `SELECT * FROM Konttori WHERE osoite = '?' AND pankki_id = '?'` -- parametrit asetetaan metodikutsun yhteydessä annetuista arvoista.

Springin dokumentaatiossa käsitellään kyselyiden muodostamista tarkemmin, kts. <a href="https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#jpa.query-methods" target="_blank">Spring Data JPA: Query Methods</a>.

</br>

<quiz id="4e677527-9581-574e-b1ca-dfb4d7b3332d"></quiz>


#### Tietokantakyselyiden tulosten rajaaminen ja järjestäminen


Spring Data JPAn rajapinta <a href="http://docs.spring.io/spring-data/jpa/docs/current/api/org/springframework/data/jpa/repository/JpaRepository.html" target="_blank">JpaRepository</a> mahdollistaa edellä kuvatun lisäksi mahdollisuuden myös kyselyn tulosten rajaamiseen ja järjestämiseen. Voimme käyttää parametria <a href="http://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/domain/PageRequest.html" target="_blank">PageRequest</a> hakutulosten määrän rajoittamiseen sekä tulosten järjestämiseen.

<br/>

Alla olevalla `PageRequest`-oliolla ilmoitamme haluavamme ensimmäiset 10 hakutulosta attribuutin `nimi` mukaan käänteisessä järjestyksessä.

```java
Pageable pageable = PageRequest.of(0, 10, Sort.by("nimi").descending());
```

`Pageable`-olion voi antaa parametrina suurelle osalle tietokantarajapinnan valmiista metodeista. Esimerkiksi listattavien pankkien rajaus `findAll`-metodin kautta näyttäisi seuraavalta.

```java

@Controller
public class PankkiController {

    @Autowired
    private PankkiRepository pankkiRepository;

    // ...

    @GetMapping("/pankit")
    public String list(Model model) {
        Pageable pageable = PageRequest.of(0, 10, Sort.by("nimi").descending());

        model.addAttribute("pankit", pankkiRepository.findAll(pageable));
        return "pankit";
    }
    // ...

}
```

Yllä olevassa luokan `PankkiController` metodissa `list` tehdään tietokantakysely, joka hakee tietokannasta ensimmäiset 10 pankkia nimen perusteella järjestettynä. Mikäli haluaisimme seuraavat kymmenen pankkia, muokkaisimme `PageRequest.of`-pyynnön ensimmäistä parametria.

```java
Pageable pageable = PageRequest.of(0, 10, Sort.by("nimi").descending());
```

Ensimmäinen parametri kertoo "sivun" numeron, toinen sivulla olevien tulosten lukumäärän, ja kolmas määrittelee miten tulokset tulee järjestää. Tätä voisi käyttää myös tulosten rajattuun tarkasteluun -- voisimme esimerkiksi määritellä metodille pyyntöparametrin `sivu`, joka määrittelee mitä sivua tarkastellaan.

```java
@GetMapping("/pankit")
public String list(Model model, @RequestParam(defaultValue = "0") Integer sivu) {
    Pageable pageable = PageRequest.of(sivu, 10, Sort.by("nimi").descending());

    model.addAttribute("pankit", pankkiRepository.findAll(pageable));
    return "pankit";
}
```

Nyt tehdessämme pyynnön polkuun `/pankit` näemme ensimmäiset 10 pankkia. Pyyntö polkuun `/pankit?sivu=1` näyttäisi seuraavat 10 pankkia, jne.

Tässä on oleellista huomata että tulosten hakeminen ja rajaaminen tapahtuu tietokannassa. Tämän johdosta sovellus toimii paljon tehokkaammin jos toteutustapaa vertaa naiiviin lähestymistapaan, missä sovellukseen haetaan kaikki tiedot tietokannasta ja tiedon järjestäminen ja rajaaminen tapahtuu vasta sovelluksessa.


<programming-exercise name='Last Messages' tmcname='osa03-Osa03_06.LastMessages'>

Tehtävässä on käytössä viestien lähetykseen käytettävä sovellus. Muokkaa sovellusta siten, että osoitteeseen `/messages` tehdyn GET-tyyppisen pyynnön vastaus sisältää aina uusimmat 5 viestiä (lisäysajan perusteella järjestettynä). Käytä tässä hyödyksi yllä nähtyä Pageable-oliota.

</programming-exercise>


<programming-exercise name='Exams and Questions (2 osaa)'  tmcname='osa03-Osa03_07.ExamsAndQuestions'>

Tehtävänäsi on täydentää kokeiden ja koekysymysten hallintaan tarkoitettua sovellusta. Sovellukseen on toteutettu valmiiksi rungot kokeiden ja koekysymysten lisäämiseen tarvittaviin kontrollereihin, jonka lisäksi sovelluksessa on osittain valmiina tarvitut `Exam` ja `Question` -entiteetit.


Lisää sovellukseen tarvittavat Repository-rajapinnat ja täydennä Exam- ja Question-entiteettejä niin, että yhteen kokeeseen monta kysymystä ja yksi kysymys voi liittyä useampaan kokeeseen. Toteuta myös kontrollereille tarvittavat metodit ja toiminnallisuudet -- saat näitä selville HTML-sivuja tarkastelemalla (älä muuta HTML-sivujen rakennetta).

Muokkaa sovellusta lopulta niin, että osoitteessa "/exams" näytettävät kokeet järjestetään koepäivämäärän mukaan.

Tehtävä on kahden yksittäisen tehtäväpisteen arvoinen.

Huomaa, että testit eivät käsittele päivämääriä. Kokeile sovelluksen toimintaa -- myös tässäkin tehtävässä -- myös manuaalisesti.

</programming-exercise>
