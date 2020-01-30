---
path: '/osa-2/3-tietokantojen-kasittely'
title: 'Tietokantojen käsittely ohjelmallisesti'
hidden: false
---

<text-box variant='learningObjectives' name='Oppimistavoitteet'>

- Tunnet käsitteen Object-relational Mapping (ORM) ja tiedät mitä sillä tarkoitetaan.
- Osaat määritellä luokan siten, että luokasta luodaan Spring-sovelluskehyksen avulla tietokantataulu.
- Osaat käyttää Springin tarjoamaa tietokantataulun käsittelyyn tarkoitettua rajapintaa sekä luoda Springin rajapinnan perivän rajapinnan.
- Osaat kirjoittaa yhtä tietokantataulua käyttävän web-sovelluksen, joka tarjoaa mahdollisuuden tiedon lisäämiseen sekä tiedon listaamiseen.

</text-box>


Tietokantataulut ja luokat ovat hyvin samankaltaisia. Tietokantatauluissa määritellään sarakkeet ja viiteavaimet, luokissa määritellään attribuutit ja viitteet. Ei liene yllättävää, että tietokantatauluja kuvataan usein luokkien avulla.

Relaatiotietokantojen ja olio-ohjelmoinnin välimaastossa sijaitsee tarve olioiden muuntamiseen tietokantataulun riveiksi ja takaisin. Tähän käytetään ORM (<a href="https://en.wikipedia.org/wiki/Object-relational_mapping" target="_blank">Object-relational mapping</a>) -ohjelmointitekniikkaa, jota varten löytyy merkittävä määrä valmiita työvälineitä sekä kirjastoja.

<br/>

ORM-työvälineet tarjoavat ohjelmistokehittäjälle mm. toiminnallisuuden tietokantataulujen luomiseen luokista, jonka lisäksi ne helpottavat kyselyjen muodostamista ja hallinnoivat luokkien välisiä viittauksia. Ohjelmoijan vastuulle jää parhaassa tapauksessa sovellukselle tarpeellisten kyselyiden toteuttaminen vain niiltä osin kuin ORM-kehykset eivät valmiina tarjoa.

Relaatiotietokantojen käsittelyyn Javalla löytyy joukko ORM-sovelluksia. Oracle/Sun standardoi olioiden tallentamisen relaatiotietokantoihin <a href="http://en.wikipedia.org/wiki/Java_Persistence_API" target="_blank">JPA</a> (Java Persistence API) -standardilla. JPA:n toteuttavat kirjastot (esim. <a href="http://www.hibernate.org/" target="_blank">Hibernate</a>) abstrahoivat relaatiotietokannan ja helpottavat kyselyjen tekemistä suoraan ohjelmakoodista.

<br/>

Koska huomattava osa tietokantatoiminnallisuudesta on hyvin samankaltaista ("tallenna", "lataa", "poista", ...), voidaan perustoiminnallisuus piilottaa käytännössä kokonaan ohjelmoijalta. Tällöin ohjelmoijalle jää tehtäväksi usein tietokantatauluja kuvaavien luokkien sekä tietokantakyselyistä vastaavien rajapintojen määrittely. Tutustutaan tähän seuraavaksi.

Tietokantatoiminnallisuuden saa sovelluksen käyttöön lisäämällä sovellukseen seuraavat riippuvuudet. Kuten aiemmin, riippuvuudet on valmiiksi määritelty tehtäväpohjiin.

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
</dependency>
```

Tietokantaa käyttävät tehtäväpohjamme ovat lisäksi määritelty siten, että sovellus luo oletuksena tehtäväpohjan juuripolkuun tietokantatiedostot `database.mv.db` ja `database.trace.db`. Nämä määrittelyt löytyvät tehtäväpohjan kansiossa `src/main/resources` olevasta tiedostosta `application.properties`.

Jos haluat tyhjentää tietokannan, poista nämä tiedostot ja käynnistä sovellus uudestaan. Voit vaihtoehtoisesti aina toteuttaa ohjelmaan toiminnallisuuden tietokannan tyhjentämiseksi.


## Luokan määrittely tallennettavaksi

JPA-standardin mukaan jokaisella tietokantaan tallennettavalla luokalla tulee olla annotaatio `@Entity` sekä `@Id`-annotaatiolla merkattu attribuutti, joka toimii tietokantataulun pääavaimena. JPA:ta käytettäessä pääavain on tyypillisesti numeerinen (`Long` tai `Integer`). Näiden lisäksi luokan tulee toteuttaa `Serializable`-rajapinta -- tämä ei vaadi muuta kuin luokkamäärittelyyn lisätyn `implements Serializable` osan. Tällaisia tietokantataulun määritteleviä luokkia kutsutaan entiteeteiksi.

Numeeriselle pääavaimelle voidaan lisäksi määritellä annotaatio `@GeneratedValue(strategy = GenerationType.AUTO)`, joka antaa vastuun pääavaimen arvojen luomisesta tietokannalle. Tietokantatauluun tallennettava luokka näyttää seuraavalta:


```java
// pakkaus

import java.io.Serializable;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Henkilo implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String nimi;

    // getterit ja setterit
```

Tietokantaan luotavien sarakkeiden ja tietokantataulujen nimiä voi muokata annotaatioiden `@Column` ja `@Table` avulla.


```java
// pakkaus

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "Henkilo")
public class Henkilo implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long id;
    @Column(name = "nimi")
    private String nimi;
    // getterit ja setterit
```

Yllä oleva luokka määrittelee tietokantataulun nimeltä "Henkilo", jolla on sarakkeet "id" ja "nimi". Oletuksena taulujen ja sarakkeiden nimet luodaan muuttujien nimien perusteella, joten yllä oleva määrittely ei oikeastaan muuta mitään.

Sovelluskehys päättelee sarakkeiden tyypit automaattisesti muuttujien tyyppien perusteella. Näihin voi kuitenkin vaikuttaa -- esimerkiksi tietokantaan tallennettavan merkkijonon pituuteen voi vaikuttaa `@Column`-annotaation attribuutilla `length`.

Spring Data JPA:n <a href="http://docs.spring.io/autorepo/docs/spring-data-jpa/current/api/org/springframework/data/jpa/domain/AbstractPersistable.html" target="_blank">AbstractPersistable</a>-luokkaa käytettäessä ylläolevan luokan määrittely kutistuu hieman. Yläluokka AbstractPersistable määrittelee pääavaimen, jonka lisäksi luokka toteuttaa myös rajapinnan Serializable.


```java
// pakkaus ja importit

@Entity
@Table(name = "Henkilo")
public class Henkilo extends AbstractPersistable<Long> {

    @Column(name = "nimi")
    private String nimi;
    // getterit ja setterit
```

Jos tietokantataulun ja sarakkeiden annotaatioita ei eksplisiittisesti määritellä, niiden nimet päätellään luokan ja muuttujien nimistä.

```java
// pakkaus ja importit

@Entity
public class Henkilo extends AbstractPersistable<Long> {

    private String nimi;
    // getterit ja setterit
```

Koska käytämme myös Lombok-projektia, luokkamme ei tarvitse oikeastaan edes gettereitä tai settereitä.

```java
// pakkaus ja importit

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Henkilo extends AbstractPersistable<Long> {

    private String nimi;
}
```

Yllä oleva luokka määrittelee tietokantataulun, jolla on pääavaimena toimiva `id`-niminen sarake. Yllä pääavaimen tyypiksi on annettu `Long` (`... extends AbstractPersistable<Long>`). Pääavaimen arvot luodaan automaattisesti. Tämän lisäksi tietokantataululla on merkkijonomuotoinen sarake `nimi`. Luokalla on myös konstruktorit, getterit, setterit sekä hashCode, equals, ja toString-metodit.



## Rajapinta tietokannan käsittelyyn

Kun käytössämme on tietokantataulua kuvaava luokka, voimme luoda tietokannan käsittelyyn käytettävän *rajapinnan*. Spring-sovelluskehystä ja JPA-standardia käyttäessämme tietokannan käsittelyyn tarkoitettu rajapintamme perii valmiin `JpaRepository`-rajapinnan, joka määrittelee normaalin CRUD-toiminnallisuuden (create, read, update, delete) sekä joukon muita metodeja.

Perittävälle `JpaRepository`-rajapinnalle annetaan kaksi tyyppiparametria. Ensimmäisellä tyyppiparametrilla kerrotaan tietokantataulua kuvaava luokka ja toinella tyyppiparametrilla tietokantataulun pääavaimen tyyppi.

Kutsutaan tätä rajapintaoliota nimellä `HenkiloRepository`. Esimerkissä oletetaan, että luokka `Henkilo` sijaitsee pakkauksessa `domain`.


```java
// pakkaus

import domain.Henkilo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HenkiloRepository extends JpaRepository<Henkilo, Long> {

}
```

Emme tee rajapinnasta konkreettista toteutusta. Spring luo automaattisesti rajapinnan toteuttavan olion sovelluksemme käynnistyksen yhteydessä.


### Tietokantaa käsittelevän olion tuominen kontrolleriin

Kun olemme luoneet rajapinnan `HenkiloRepository`, voimme lisätä sen kontrolleriluokkaan. Tämä tapahtuu määrittelemällä tietokanta-abstraktiota kuvaavan rajapinnan olio kontrollerin oliomuuttujaksi. Oliomuuttujalle asetetaan lisäksi annotaatio `@Autowired`. Tämä `@Autowired` liittyy ensimmäisessä osassa käsiteltyihin termeihin Inversion of Control ja Dependency Injection. Spring luo käynnistyksen yhteydessä `HenkiloRepository` rajapinnan toteuttavan olion, jonka se sitten injektoi `@Autowired`-annotaatiolla merkittyihin `HenkiloRepository`-muuttujiin.


```java
// ...

@Controller
public class HenkiloController {

    @Autowired
    private HenkiloRepository henkiloRepository;

    // ...
}
```

Nyt tietokantaan pääsee käsiksi `HenkiloRepository`-olion kautta. Katso <a href="http://docs.spring.io/spring-data/jpa/docs/current/api/org/springframework/data/jpa/repository/JpaRepository.html" target="_blank">JpaRepository</a>-luokan API, joka sisältää rajapinnan tarjoamien metodien kuvauksia. Huomaa, että JpaRepository perii mm. rajapinnan CrudRepository, jonka metodit ovat myös ohjelmiemme käytössä.

<br/>

Voimme esimerkiksi toteuttaa tietokannassa olevien olioiden listauksen sekä yksittäisen olion lisäämisen seuraavalla tavalla.

```java
// ...

@Controller
public class HenkiloController {

    @Autowired
    private HenkiloRepository henkiloRepository;

    @GetMapping("/")
    public String list(Model model) {
        model.addAttribute("list", henkiloRepository.findAll());
        return "henkilot"; // tässä oletetaan erillinen tiedosto henkilot.html
    }

    @PostMapping("/")
    public String create(@RequestParam String nimi) {
        henkiloRepository.save(new Henkilo(nimi));
        return "redirect:/";
    }
}
```


<programming-exercise name='Item Database' tmcname='osa02-Osa02_08.ItemDatabase'>

Tässä tehtävässä on valmiiksi toteutettuna tietokantatoiminnallisuus sekä esineiden noutaminen tietokannasta. Lisää sovellukseen toiminnallisuus, jonka avulla esineiden tallentaminen tietokantaan onnistuu valmiiksi määritellyllä lomakkeella.

Toteuta siis kontrolleriluokkaan sopiva metodi (tarkista parametrin tai parametrien nimet HTML-sivulta) ja hyödynnä rajapinnan ItemRepository tarjoamia metodeja.

Alla esimerkki sovelluksesta kun tietokantaan on lisätty muutama rivi:

<img src="../img/exercises/itemdatabase.png"/>

Huom! Älä muokkaa tehtäväpohjassa olevaa HTML-sivua.

Sovellus luo oletuksena tehtäväpohjan juuripolkuun tietokantatiedostot database.mv.db ja database.trace.db. Jos haluat tyhjentää tietokannan, poista nämä tiedostot ja käynnistä sovellus uudestaan (tai, vaihtoehtoisesti, lisää ohjelmaan poistotoiminnallisuus..)

</programming-exercise>


<text-box variant='hint' name='H2-tietokannanhallintajärjestelmän konsoli'>

H2-tietokannanhallintajärjestelmässä tulee mukana konsoli, jota voi käyttää sovelluksen tietokannan tarkasteluun. Kun menet selaimella sovelluksen polkuun "/h2-console", eteesi aukeaa konsoli-ikkuna. Voit avata sovelluksen käyttämän tietokannan.

Tietokantaa käyttävät tehtäväpohjat on määritelty siten, että pääset niiden käyttämään tietokantaan käsiksi seuraavilla H2-konsolin asetuksilla:

* Driver class: org.h2.Driver
* JDBC URL: jdbc:h2:file:./database
* User name: sa
* Password:

Salasana jätetään siis tyhjäksi.

Konsoli on käynnissä aina sovelluksen ollessa käynnissä. Opimme myöhemmin menetelmiä konsolin poistamiseen.

</text-box>


<programming-exercise name='Person Database (2 osaa)' tmcname='osa02-Osa02_09.PersonDatabase'>

Seuraa edellä kuvattua esimerkkiä ja luo sovellus henkilöiden tallentamiseen ja listaamiseen. Tehtäväpohjassa on valmiina mukana `index.html`-tiedosto, joka sisältää listaustoiminnallisuuden sekä lomakkeen uuden henkilön lisäämiseksi.

Tehtävässä sinun tulee:

1. Luoda luokka `Person`. Lisää luokalle merkkijonomuotoinen attribuutti `name` ja tee luokasta entiteetti.
2. Luoda henkilöiden tallentamiseen tarkoitettu rajapinta `PersonRepository`, joka perii rajapinnan `JpaRepository`. Käytä rajapinnan `JpaRepository` tyyppiparametreina luokkaa `Person` sekä luokan `Person` pääavaimen tyyppiä.
3. Muokata luokkaa `PersonDatabaseController` siten, että luokalla on kaksi metodia:
    * Sovelluksen juuripolkuun tulevan GET-pyynnön käsittelevä metodi hakee tietokannasta kaikki henkilöoliot, lisää ne modeliin (`Model`-tyyppinen olio) avaimella "persons", ja siirtää käsittelyvastuun Thymeleafille.
    * Sovelluksen juuripolkuun tulevan POST-pyynnön käsittelevä metodi luo uuden henkilöolion, tallentaa sen tietokantaan, ja uudelleenohjaa selaimen tekemään uuden GET-tyyppisen pyynnön sovelluksen juuripolkuun.


Sovellus luo oletuksena tehtäväpohjan juuripolkuun tietokantatiedostot database.mv.db ja database.trace.db. Jos haluat tyhjentää tietokannan, poista nämä tiedostot ja käynnistä sovellus uudestaan (tai, vaihtoehtoisesti, lisää ohjelmaan poistotoiminnallisuus..)

Tehtäväpohjassa ei ole automaattisia testejä. Palauta tehtävä palvelimelle kun ohjelma toimii tehtävänannossa kuvatulla tavalla. Tehtävä on kahden yksittäisen tehtäväpisteen arvoinen.

</programming-exercise>


<quiz id="5d2def2e-1caa-5bb8-bee4-b2c9cec1a17a"></quiz>
