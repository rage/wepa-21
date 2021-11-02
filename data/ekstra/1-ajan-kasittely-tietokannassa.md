---
path: '/ekstra/ajan-kasittely-tietokannassa'
title: 'Ajan käsittely tietokannassa'
hidden: false
---


Tietoon liittyy usein aikamääreitä. Esimerkiksi kirjalla on julkaisupäivämäärä, henkilöllä on syntymäpäivä, elokuvalla on näytösaika jne. Tarkastellaan seuraavaksi [ajan käsittelyyn tarkoitettuja luokkia](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/time/package-summary.html).

Luokkaa [LocalDate](https://docs.oracle.com/javase/8/docs/api/java/time/LocalDate.html) käytetään vuoden, kuukauden ja päivämäärän tallentamiseen. Luokka [LocalDateTime](https://docs.oracle.com/javase/8/docs/api/java/time/LocalDateTime.html) mahdollistaa taas vuoden, kuukauden ja päivämäärän lisäksi tuntien, minuuttien, sekuntien ja millisekuntien tallentamisen.

Yksinkertaisimmillaan luokat toimivat seuraavalla tavalla.

```java
import java.time.LocalDate;
import java.time.LocalDateTime;

public class TimeTest {

    public static void main(String[] args) {
        System.out.println(LocalDate.now());
        System.out.println(LocalDateTime.now());
    }
}
```

<sample-output>

2020-02-11
2020-02-11T09:49:08.392536

</sample-output>


Luokkia voi käyttää suoraan entiteettien oliomuuttujina. Alla on määritelty henkilöä kuvaava entiteetti. Henkilöllä on pääavain (id), nimi, ja syntymäpäivä.


```java
import java.time.LocalDate;
import javax.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.AbstractPersistable;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Person extends AbstractPersistable<Long> {

    private String name;
    private LocalDate birthday;

}
```

Sovelluksen käynnistyessä tietokantaan luodaan -- kun käytössä on H2-tietokannanhallintajärjestelmä  -- seuraavanlainen tietokantataulu. Syntymäpäivää kuvaava sarake `birthday` luodaan [date](http://www.h2database.com/html/datatypes.html#date_type)-tyyppisenä sarakkeena.


```sql
CREATE TABLE PERSON (
    id bigint not null,
    birthday date,
    name varchar(255),
    primary key (id)
)
```

Aikamääreiden lähettäminen onnistuu myös sovelluksesta palvelimelle. Tällöin kontrollerin metodissa tulee määritellä menetelmä aikaa kuvaavan merkkijonon muuntamiseen aikamääreeksi. Muunto merkkijonosta aikamääreeksi onnistuu `DateTimeFormat`-annotaation avulla. Annotaatiolle annetaan parametrina tiedon muoto, alla on käytetty muotoa [DateTimeFormat.ISO.DATE](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/format/annotation/DateTimeFormat.ISO.html#DATE).


```java
@PostMapping("/persons")
public String create(@RequestParam String name,
      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate birthday) {
    // toiminnallisuus
}
```

Edellä oleva muoto DateTimeFormat.ISO.DATE olettaa, että päivämäärä lähetetään palvelimelle muodossa `yyyy-MM-dd`. Tässä on ensin vuosi (4 numeroa), sitten viiva, sitten kuukausi (2 numeroa), sitten viiva, ja lopulta päivä (2 numeroa). Tämä muoto liittyy [RFC3339-spesifikaatioon](https://tools.ietf.org/html/rfc3339#section-5.6), joka määrittelee muodon, mitä päivämäärissä *pitäisi* käyttää kun tietoa lähetetään palvelimelle. Spesifikaation takia voimme olettaa (tai toivoa), että esimerkiksi HTML:n [date](https://www.w3.org/TR/html-markup/input.date.html" target="_blank)-elementtiin syötettävä päivämäärä lähetetään palvelimelle em. muodossa.


Vastaavasti lomake, jolla henkilö voidaan luoda, on melko suoraviivainen. Lomake-elementin tyyppi `date` toimii joissakin selaimissa -- jonkinlainen ohjeistus käyttäjälle on kuitenkin hyvä olla olemassa.

```html
<form th:action="@{/persons}" method="POST">
    <input name="name" type="text"/><br/>
    <input name="birthday" type="date"/><br/>
    <input type="submit"/>
</form>
```


<text-box variant='hint' name='Sovelluksen aikavyöhykkeen asettaminen'>

Web-sovellukset voivat sijaita käytännössä lähes millä tahansa aikavyöhykkeellä. Sovellus käyttää oletuksena palvelimen asetuksissa asetettua aikavyöhykettä. Sovelluksen aikavyöhykkeen muuttaminen onnistuu sekä ohjelmallisesti että käynnistyksen yhteydessä. Ohjelmallisesti aikavyöhyke asetetaan TimeZone-luokan metodilla `setDefault` -- tästä esimerkki alla.

```java
import java.util.TimeZone;
import javax.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {

    @PostConstruct
    public void started() {
        TimeZone.setDefault(TimeZone.getTimeZone("GMT"));
    }

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
```

Käynnistyksen yhteydessä aikavyöhyke annetaan sovellukselle parametrina komentoriviltä. Kun sovellus on paketoitu (Clean & Build), sen voi käynnistää komentoriviltä. Sovellus löytyy projektin kansiosta `target`.


```console
$ java -Duser.timezone=GMT -jar target/<em>sovellus</em>.jar
```

Saat kansion target poistettua Clean-komennolla. Kansio kannattaa poistaa, sillä se sisältää kaikki sovelluksen ajamiseeen tarvittavat kirjastot.

</text-box>

Mikäli päivämääriä haluaa näyttää osana sovellusta, kannattaa tutustua Thymeleafin aikojen muokkaamista helpottavaan `#temporals`-apuvälineeseen. Tästä lisää mm. [Baeldungin päivämäärien käsittelyyn liittyvässä oppassa](https://www.baeldung.com/dates-in-thymeleaf).

