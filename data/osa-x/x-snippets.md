---
path: '/osa-x/x-johdanto'
title: 'Johdanto'
hidden: true
---

<text-box variant='learningObjectives' name='Oppimistavoitteet'>

- osaamistavoitteet

</text-box>

tekstiä.

```java
koodia
```




## skaalautuvuus


----



<text-box variant='hint' name='Google Dev Tools'>

TODO: pakota chrome käyttöön

Google Chromen DevTools-apuvälineet löytää Tools-valikosta tai painamalla F12 (Linux). Apuvälineillä voi esimerkiksi tarkastella verkkoliikennettä ja lähetettyjä ja vastaanotettuja paketteja. Valitsemalla työvälineistä Network-välilehden, ja lataamalla sivun uudestaan, näet kaikki sivua varten ladattavat osat sekä kunkin osan lataamiseen kuluneen ajan.

Yksittäistä sivua avattaessa tehdään jokaista resurssia (kuva, tyylitiedosto, skripti) varten erillinen pyyntö. Esimerkiksi <a href="https://www.hs.fi" target="_blank">Helsingin sanomien</a> verkkosivua avattaessa tehdään hyvin monta pyyntöä.

<img src="/img/google-devtools-hs-fi.png" alt="Kuvakaappaus Google Dev Toolsista."/>

</text-box>


---

 Esimerkiksi <a href="https://jcp.org/aboutJava/communityprocess/mrel/jsr154/index2.html" target="_blank">Java Servlet API (versio 2.5)</a> sisältää seuraavan suosituksen GET-pyyntotapaan liittyen:



*The GET method should be safe, that is, without any side effects for which users are held responsible. For example, most form queries have no side effects. If a client request is intended to change stored data, the request should use some other HTTP method.*



Suomeksi yksinkertaistaen: GET-pyynnöt ovat tarkoitettu tiedon hakamiseen. Palvelinpuolen toiminnallisuutta suunniteltaessa tulee siis pyrkiä tilanteeseen, missä `GET`-tyyppisillä pyynnöillä ei muuteta palvelimella olevaa dataa.

---

Spring-sovelluksissa kontrollerimetodi kuuntelee GET-tyyppisiä pyyntöjä jos metodilla on annotaatio `@GetMapping`. Annotaatiolle määritellään parametrina kuunneltava polku.

---


Spring-sovelluksissa kontrollerimetodi kuuntelee POST-tyyppisiä pyyntöjä jos metodilla on annotaatio `@PostMapping`. Annotaatiolle määritellään parametrina kuunneltava polku.




<text-box variant='hint' name='Thymeleaf ja HTML' } do %>


    Käytämme kurssilla Thymeleaf-komponenttia dynaamisen sisällön lisäämiseen sivuille. Thymeleaf on erittäin tarkka HTML-dokumentin muodosta, ja pienikin poikkeama voi johtaa virhetilanteeseen. Kannattaakin aina edetä pienin askelein, ja aina muokata ja testata vain yhtä paikkaa kerrallaan. Tällöin virhetilanteessa tyypillisesti tietää mistä kohdasta kannattaa lähteä etsimään virhettä.


</text-box>



---



----



Esimerkiksi  hakeminen os

Kyselyiden rajoittaminen on suoraviivaista. Jos tuloksia halutaan hakea tietyllä attribuutin arvolla, rajapinnalle voidaan lisätä muotoa . Esimerkiksi päivämäärän perusteella tapahtuva haku onnistuu seuraavasti.





Spring Data JPAn rajapinta <a href="http://docs.spring.io/spring-data/jpa/docs/current/api/org/springframework/data/jpa/repository/JpaRepository.html" target="_blank">JpaRepository</a> mahdollistaa muutaman lisäparametrin käyttämisen osassa pyyntöjä. Voimme esimerkiksi käyttää parametria <a href="http://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/domain/PageRequest.html" target="_blank">PageRequest</a>, joka tarjoaa apuvälineet sivuttamiseen sekä pyynnön hakutulosten rajoittamiseen. Alla olevalla PageRequest-oliolla haluasimme ensimmäiset 50 hakutulosta attribuutin nimi mukaan käänteisessä järjestyksessä.





Esimerkiksi alla oleva lisäys tarjoaa metodin henkilöiden etsimiseen, joilla ei ole huonetta (oletamme että Henkilo-luokalla on attribuutti Asunto).


```java
  public interface HenkiloRepository extends JpaRepository&lt;Henkilo, Long&gt; {
  List&lt;Henkilo&gt; findByAsuntoIsNull();
  }
```


  Vastaavasti voisimme hakea esimerkiksi nimen osalla: `findByNimiContaining(String osa)`.




```java
  Pageable pageable = new PageRequest(0, 50, Sort.Direction.DESC, "nimi");
```


  Voimme muokata metodia `findByAsuntoIsNull` hyväksymään `Pageable`-rajapinnan toteuttavan olion parametriksi, jolloin metodi palauttaa <a href="http://docs.spring.io/spring-data/data-commons/docs/1.6.1.RELEASE/api/org/springframework/data/domain/Page.html" target="_blank">Page</a>-luokan ilmentymän.


```java
  public interface HenkiloRepository extends JpaRepository&lt;Henkilo, Long&gt; {
  Page&lt;Henkilo&gt; findByAsuntoIsNull(Pageable pageable);
  }
```


  Yhdistämällä kaksi edellistä, voisimme hakea kaikki huoneettomat henkilöt sopivasti järjestettynä:


```java
  //...
  import org.springframework.data.domain.Page;
  import org.springframework.data.domain.PageRequest;
  import org.springframework.data.domain.Pageable;
  import org.springframework.data.domain.Sort;
  //...

  // tämä palvelussa
  Pageable pageable = new PageRequest(0, 50, Sort.Direction.DESC, "nimi");
  Page&lt;Henkilo&gt; henkiloSivu = henkiloRepository.findByAsuntoIsNull(pageable);
  List&lt;Henkilo&gt; henkilot = henkiloSivu.getContent();
```



<programming-exercise name='Last Messages' } do %>


    Tehtävässä on käytössä viestien lähetykseen käytettävä sovellus. Muokkaa sovellusta siten, että MessageServicen `list`-metodi palauttaa aina vain uusimmat 10 viestiä. Käytä tässä hyödyksi yllä nähtyä Pageable-oliota.


<% end %>






#### Tietokantakyselyiden tulosten rajaaminen ja järjestäminen


Oletetaan, että edellä käytössämme on seuraavanlainen PersonRepository-toteutus.



```java
  import java.time.LocalDate;
  import java.util.List;
  import org.springframework.data.jpa.repository.JpaRepository;

  public interface PersonRepository extends JpaRepository&lt;Person, Long&gt; {

      List&lt;Person&gt; findByBirthday(LocalDate birthday);
  }
```


Tarkemmin kyselyiden luomisesta löytyy osoitteessa <a href="https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#jpa.query-methods" target="_blank" norel>https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#jpa.query-methods</a> olevan dokumentaation kohdasta <em>Query creation</em>. Edellistä esimerkkiä voidaan laajentaa siten, että rajapinnalla on myös metodi nimen ja syntymäpäivän mukaan etsimiselle.


```java
  import java.time.LocalDate;
  import java.util.List;
  import org.springframework.data.jpa.repository.JpaRepository;

  public interface PersonRepository extends JpaRepository&lt;Person, Long&gt; {

      List&lt;Person&gt; findByBirthday(LocalDate birthday);
      List&lt;Person&gt; findByNameAndBirthday(String name, LocalDate birthday);
  }
```


  Myös edellä kuvatuille metodeille voidaan määritellä parametriksi Pageable-olio. Jos oletamme, että käyttäjä antaa pageablen aina metodille `findByBirthday`, voidaan sen määrittely muuttaa seuraavaksi.


```java
  import java.time.LocalDate;
  import java.util.List;
  import org.springframework.data.domain.Pageable;
  import org.springframework.data.jpa.repository.JpaRepository;

  public interface PersonRepository extends JpaRepository&lt;Person, Long&gt; {
      List&lt;Person&gt; findByBirthday(LocalDate birthday, Pageable pageable);
      List&lt;Person&gt; findByNameAndBirthday(String name, LocalDate birthday);
  }
```

