---
path: '/osa-1/3-spring-sovelluskehys'
title: 'Spring-sovelluskehys'
hidden: false
---


<text-box variant='learningObjectives' name='Oppimistavoitteet'>

- Tunnet pinnallisesti Spring-sovelluskehyksen.
- Tunnet käsitteet Dependency Injection ja Inversion of Control.
- Tiedät miten Dependency Injection ja Inversion of Control ilmenee Spring Boot -sovelluskehyksessä.
- Osaat luoda pyyntöihin reagoivan Web-sovelluksen Spring Boot -sovelluskehyksellä.

</text-box>


Käytämme kurssilla <a href="https://spring.io/" target="_blank">Spring</a>-sovellusperheen <a href="http://projects.spring.io/spring-boot/" target="_blank">Spring Boot</a> projektia web-sovellusten tekemiseen. Merkittävä osa web-sovellusten rakentamisesta perustuu valmiiden kirjastometodien käyttöön. Niiden avulla määritellään (1) mihin osoitteeseen tulevat pyynnöt käsitellään ja (2) mitä pyynnölle tulee tehdä. Spring Boot sisältää oletuksena myös web-palvelimen, jolloin ohjelmoijan tulee keskittyä vain palvelinlogiikan eli pyyntöjen käsittelyn toteuttamiseen.

<br/>

Tutustutaan ensin Spring-sovelluskehyksen oleellisimpiin osiin, jonka jälkeen toteutamme ensimmäiset web-sovellukset Spring Bootin avulla.


## Inversion of Control ja Dependency Injection

Inversion of Control on ohjelmistokehyksissä esiintyvä periaate, missä vastuuta ohjelman osien luomisesta sekä ohjelman osien välisestä kommunikaatiosta siirretään ohjelmistokehykselle. Tämä tarkoittaa käytännössä sitä, että kontrolli luotavista asioista sekä ohjelman suorituksesta on sovelluskehyksen vastuulla. Tällöin ohjelmoijan ei tarvitse kiinnittää huomiota kaikkiin yksityiskohtiin. Samalla toisaalta ohjelman suorituksen ymmärtäminen vaatii jonkinlaista ymmärrystä sovelluskehyksen toiminnasta.

Spring-sovelluskehyksessä Inversion of Control näkyy mm. siinä, että ohjelmoija toteuttaa sovelluskehyksen puitteissa luokkia, mutta ei esimerkiksi luo niistä olioita. Olioiden luominen on pääosin Spring-sovelluskehyksen vastuulla.

Dependency Injection on taas suunnittelumalli, missä riippuvuudet injektoidaan sovellukseen. Yksinkertaisimmillaan tämä tarkoittaa sitä, että luokkien oliomuuttujia ei luoda esim. konstruktoreissa, vaan ne annetaan konstruktorin parametrina tai esimerkiksi setterin parametrina.

Spring-sovelluskehyksen tapauksessa Inversion of Control ja Dependecy Injection luovat yhdessä tilanteen, missä sovelluskehys luo luokista olioita ja injektoi ne sovelluksen käyttöön. Tämän avulla vähennetään olioiden turhia riippuvuuksia, mikä helpottaa esimerkiksi sovellusten testaamista.

Lue lisää aiheesta <a href="https://www.jamesshore.com/Blog/Dependency-Injection-Demystified.html" target="_blank">James Shore</a>n blogista ja <a href="https://martinfowler.com/articles/injection.html" target="_blank">Martin Fowlerin</a> artikkelista.



## Spring Boot -projektin luominen


Uudet Spring Boot -projektit luodaan tyypillisesti <a href="https://start.spring.io/">Spring Initializr</a>-sivulla, missä käyttäjä voi valita käännökseen käytettävän työvälineen (<a href="https://maven.apache.org/" target="_blank">Maven</a>, <a href="https://gradle.org/" target="_blank">Gradle</a>), projektin käyttämän ohjelmointikielen (Java, Kotlin, Groovy), Spring Bootin version, sekä projektin käyttämät komponentit (esim. tietokannnat, kirjautuminen, ...).

<br/>

Käytämme kurssilla sovellusten kääntämiseen Mavenia ja ohjelmointikielenä Javaa. Käytössämme on Spring Bootin versio 2.1.3. Projektiemme käyttämät komponentit kasvavat projektiemme myötä.


### Maven ja projektipohja

Käytämme tällä kurssilla <a href="https://maven.apache.org/" target="_blank">Maven</a>ia valmiiden kirjastojen noutamiseen sekä projektien hallintaan. Uusissa projekteissa kannattaa kuitenkin käyttää yllä mainittua Spring Initializr -palvelua, mutta kurssilla käytettävät tehtäväpohjat sisältävät tarvittavat riippuvuudet.

<br/>

Kun Spring-sovellus on konfiguroitu oikein (esim. Spring Initializr -palvelun avulla), Spring-projektin käynnistäminen onnistuu komentoriviltä komennolla `mvn spring-boot:run`. Tällöin  -- kun käytössä on <a href="http://docs.spring.io/spring-boot/docs/current/reference/html/using-boot-devtools.html" target="_blank">Spring Devtools</a>-projekti -- sovellus käynnistyy muutosten yhteydessä automaattisesti uudestaan.

<br/>

Ohjelmat voi ladata myös NetBeansiin, jossa ne toimivat kuten muidenkin ohjelmointikurssien tehtävät.


## Ensimmäinen palvelinohjelmisto

Ensimmäinen palvelinohjelmisto -- tai sovelluksen koodi -- voi tuntia aluksi hieman monimutkaiselta. Sovellus, joka käynnistää palvelimen ja palauttaa käyttäjälle selaimen kautta tarkasteltuna tekstin "Hei Maailma!", näyttää seuraavalta.


```java
package heimaailma;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@SpringBootApplication
@Controller
public class HeiMaailmaController {

    @GetMapping("*")
    @ResponseBody
    public String home() {
        return "Hei Maailma!";
    }

    public static void main(String[] args) throws Exception {
        SpringApplication.run(HeiMaailmaController.class, args);
    }
}
```

Luokka sisältää sekä sovelluskehyksen käynnistämiseen tarvittavan `main`-metodin että pyyntöjen käsittelyyn käytettävän `home`-metodin. Pilkotaan sovellus pienempiin osiin ja eriytetään pyyntöjä vastaanottava luokka ja sovelluksen käynnistämiseen käytettävä luokan toisistaan.


```java
package heimaailma;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class HeiMaailmaApplication {

    public static void main(String[] args) throws Exception {
        SpringApplication.run(HeiMaailmaApplication.class, args);
    }
}
```

Spring Boot -sovellukset tarvitsevat käynnistyäkseen `main`-metodin, jossa kutsutaan `SpringApplication`-luokan `run`-metodia. Metodille annetaan parametrina luokka, joka sisältää `@SpringBootApplication`-annotaation -- annotaatiota käytetään sovelluksen konfigurointiin; tässä mennään oletusasetuksilla.

Sovelluksen käynnistäminen etsii luokkia, joita se lataa käyttöönsä. Luokat on merkitty esim `@Controller`-annotaatiolla, mikä kertoo luokan sisältävän palvelimelle tulevia pyyntöjä käsitteleviä metodeja.

Alla on esimerkki tällaisesta luokasta.

```java
package heimaailma;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class HeiMaailmaController {

    @GetMapping("*")
    @ResponseBody
    public String home() {
        return "Hei Maailma!";
    }
}
```

Pyyntöjä vastaanottava luokka `HeiMaailmaController` on merkitty `@Controller`-annotaatiolla. Tämän perusteella Spring-sovelluskehys tietää, että luokan metodit saattavat käsitellä selaimesta tehtyjä pyyntöjä ja Spring ottaa vastuun pyyntöjen ohjaamisesta luokan metodeille.

Luokalle `HeiMaailmaController` on määritelty metodi `home`, jolla on kaksi annotaatiota: `@GetMapping` ja `@ResponseBody`. Annotaation `@GetMapping` avulla määritellään kuunneltava polku sekä HTTP-protokollan pyyntötapa. Kaikki HTTP-protokollan GET-pyynnöt ohjataan kyseiselle metodille, koska annotaatiolle `@GetMapping` on lisäksi määritelty parametri `"*"`. Tähden sijaan parametrina voisi määritellä myös esimerkiksi polun.

 Annotaatio `@ResponseBody` kertoo sovelluskehykselle, että metodin vastaus tulee näyttää vastauksena sellaisenaan.


<text-box variant='hint' name='Tehtävien tekeminen'>

Tästä eteenpäin materiaalissa on myös ohjelmointitehtäviä. Tehtävien tekeminen ja palautus tapahtuu NetBeans-ympäristössä Test My Code-liitännäisen avulla. Test My Code lataa tehtäväpohjat sinulle valmiiksi.

**Huom!** NetBeans with TMC:n "testinappula" ei toistaiseksi toimi oikein Spring-tehtävien kanssa. Voit ajaa testit paikallisesti klikkaamalla projektia oikealla hiirennapilla ja valitsemalla test project. Testien ajaminen palvelimella toimii normaalisti, eli tämä ei vaikuta pisteiden ym saamiseen -- voit palauttaa tehtävät suoraan submit-napista.

</text-box>


<programming-exercise name='Hello World!' tmcname='osa01-Osa01_04.HelloWorld'>

Kuten huomattava osa ohjelmointikursseista, tämäkin kurssi alkaa tehtävällä, jossa toteutettava ohjelma kirjoittaa tekstin `Hello World!`.

Toteuta tehtäväpohjan pakkauksessa `helloworld` olevaan `HelloWorldController` luokkaan toiminnallisuus, joka kuuntelee GET-tyyppisiä pyyntöjä. Kun palvelin vastaanottaa pyynnön mihin tahansa polkuun, tulee palvelimen palauttaa merkkijono "Hello World!".

<img src="../img/exercises/hello-world.png"/>

Käynnistä palvelin painamalla NetBeansin play-nappia, suorittamalla `HelloWorldApplication`-luokan `main`-metodi, tai kirjoittamalla projektin juuripolussa `mvn spring-boot:run`. Avaa nettiselain, mene osoitteeseen <a href="http://localhost:8080" target="_blank">http://localhost:8080</a> ja näet selaimessasi tekstin "Hello World!".

<br/>

Palvelin sammutetaan NetBeansissa punaista nappia painamalla -- vain yksi sovellus voi olla kerrallaan päällä samassa osoitteessa. Palauta tehtävä lopuksi Test My Code:n submit-napilla.

</programming-exercise>


<text-box variant='hint' name='Apua! Palvelimeni ei suostu sammumaan!'>

Palvelimen sammuttaminen tapahtuu NetBeansissa punaista neliötä klikkaamalla, joka sammuttaa suoritettavan ohjelman. Joissakin MacOs-käyttöjärjestelmän versioissa tämä on kuitenkin bugista, jolloin palvelin tulee sammuttaa komentoriviltä.

Saat portissa 8080 käynnissä olevan prosessin tunnuksen tietoon terminaalissa komennolla `lsof -i :8080`. Etsi komennon palauttamasta tulosteesta prosessin tunnus, jonka jälkeen voit sammuttaa prosessin komennolla `kill -9 prosessin-tunnus`.

Esimerkiksi:

<pre>
> lsof -i :8080
COMMAND  PID     USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
java    9916 kayttaja   51u  IPv6 0x65802ef6be5c6f29      0t0  TCP *:tram (LISTEN)
>
</pre>

Yllä prosessin tunnus (PID) on 9916. Tämän jälkeen prosessi sammutetaan komennolla `kill -9 9916`.

<pre>
> lsof -i :8080
COMMAND  PID     USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
java    9916 kayttaja   51u  IPv6 0x65802ef6be5c6f29      0t0  TCP *:tram (LISTEN)
> kill -9 9916
</pre>

Jos käynnistät sovelluksen komentoriviltä (komento `mvn spring-boot:run` sovelluksen juurikansiossa), ei tätä ongelmaa pitäisi olla.

</text-box>


## Palvelinohjelmiston polut

Sovellus kuuntelee kaikkia palvelinohjelmistoon tulevia pyyntöjä jos pyyntöjen käsittelyyn tehty metodi on annotoitu `@GetMapping`-annotaatiolla, jolle on asetettu parametriksi `"*"`. Käytännössä `@GetMapping`-annotaation parametrilla määritellään polku, johon palvelimelle tulevat pyynnöt voidaan ohjata. Tähdellä ilmoitetaan, että kyseinen metodi käsittelee kaikki pyynnöt. Muiden polkujen määrittely on luonnollisesti myös mahdollista.

<br/>

Antamalla `@GetMapping`-annotaation poluksi merkkijono `"/salaisuus"`, kaikki web-palvelimen osoitteeseen `/salaisuus` tehtävät pyynnöt ohjautuvat metodille, jolla kyseinen annotaatio on. Allaolevassa esimerkissä määritellään polku `/salaisuus` ja kerrotaan, että polkuun tehtävät pyynnöt palauttavat merkkijonon `"Kryptos"`.

```java
// pakkaus ja importit

@Controller
public class SalaisuusController {

    @GetMapping("/salaisuus")
    @ResponseBody
    public String home() {
        return "Kryptos";
    }
}
```


<programming-exercise name='Hello Path' tmcname='osa01-Osa01_05.HelloPath'>

Toteuta pakkauksessa `hellopath` olevaan luokkaan `HelloPathController` seuraava toiminnallisuus:

- Pyyntö polkuun `/path` palauttaa käyttäjälle merkkijonon "Oikein!"

Palauta tehtävä TMC:lle kun olet valmis.

</programming-exercise>




Yhteen ohjelmaan voi määritellä useampia polkuja. Jokainen polku käsitellään omassa metodissaan. Alla olevassa esimerkissä pyyntöjä vastaanottavaan luokkaan on määritelty kolme erillistä polkua, joista jokainen palauttaa käyttäjälle merkkijonon.


```java
// pakkaus ja importit

@Controller
public class PolkuController {

    @GetMapping("/path")
    @ResponseBody
    public String path() {
        return "Polku (path)";
    }

    @GetMapping("/route")
    @ResponseBody
    public String route() {
        return "Polku (route)";
    }

    @GetMapping("/trail")
    @ResponseBody
    public String trail() {
        return "Polku (trail)";
    }
}
```


<programming-exercise name='Hello Paths' tmcname='osa01-Osa01_06.HelloPaths'>

Toteuta pakkauksessa `hellopaths` olevaan luokkaan `HelloPathsController` seuraava toiminnallisuus:

- Pyyntö polkuun `/hello` palauttaa käyttäjälle merkkijonon "Hello"
- Pyyntö polkuun `/paths` palauttaa käyttäjälle merkkijonon "Paths"

Alla olevassa kuvassa on esimerkki tilanteesta, missä selaimella on tehty pyyntö polkuun `/hello`

<img src="../img/exercises/hello.png"/>

Palauta tehtävä TMC:lle kun olet valmis.

</programming-exercise>



## Pyynnön parametrit

Palvelimelle voi lähettää tietoa pyynnön parametreina. Tutustutaan ensin tapaan, missä pyynnön parametrit lisätään osoitteeseen. Esimerkiksi pyynnössä `http://localhost:8080/salaisuus?onko=nauris` on parametri nimeltä `onko`, jonka arvoksi on määritelty arvo `nauris`.

Parametrien lisääminen pyyntöön tapahtuu lisäämällä osoitteen perään kysymysmerkki, jota seuraa parametrin nimi, yhtäsuuruusmerkki ja parametrille annettava arvo. Pyynnössä tuleviin parametreihin pääsee käsiksi <a href="http://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/bind/annotation/RequestParam.html" target="_blank">@RequestParam</a>-annotaation avulla.

Allaolevan esimerkin sovellus tervehtii kaikkia pyynnön tekijöitä. Ohjelma käsittelee polkuun `/hei` tulevia pyyntöjä ja palauttaa niihin vastauksena tervehdyksen. Tervehdykseen liitetään pyynnössä tulevan `nimi`-parametrin arvo.


```java
package parametrit;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class TervehtijaController {

    @GetMapping("/hei")
    @ResponseBody
    public String tervehdi(@RequestParam String nimi) {
        return "Hei " + nimi + ", mitä kuuluu?";
    }
}
```

Nyt esimerkiksi osoitteeseen `http://localhost:8080/hei?nimi=Ada` tehtävä pyyntö saa vastaukseksi merkkijonon `Hei Ada, mitä kuuluu?`.


<programming-exercise name='Hello Request Param' tmcname='osa01-Osa01_07.HelloRequestParam'>

Toteuta pakkauksessa `hellorequestparam` olevaan luokkaan `HelloRequestParamController` seuraava toiminnallisuus:

- Pyyntö polkuun `/hello` palauttaa käyttäjälle merkkijonon "Hello ", johon on liitetty `param`-nimisen parametrin sisältämä arvo.

</programming-exercise>


Jos parametreja on useampia, erotellaan ne toisistaan `&`-merkillä. Alla olevassa osoitteessa on kolme parametria, `eka`, `toka` ja `kolmas`, joiden arvot ovat `1`, `2` ja `3` vastaavasti.

<pre>
http://localhost:8080/salaisuus?eka=1&amp;toka=2&amp;kolmas=3
</pre>

Useampaa parametria käsittelevän sovelluksen saa toteutettua erottamalla parametrit pilkuilla toisistaan. Yllä olevan osoitteen saisi käsiteltyä esimerkiksi seuraavalla tavalla.

```java
// pakkaus ja importit

@Controller
public class SalaisuusController {

    @GetMapping("/salaisuus")
    @ResponseBody
    public String vastaa(@RequestParam String eka,
                         @RequestParam String toka,
                         @RequestParam String kolmas) {
        return "eka: " + eka + ", toka: " + toka + ", kolmas: " + kolmas;
    }
}
```


<programming-exercise name='Greeting' tmcname='osa01-Osa01_08.Greeting'>

Toteuta pakkauksessa `greeting` olevaan luokkaan `GreetingController` seuraava toiminnallisuus:

- Pyyntö polkuun `/greet` saa parametrit `name` ja `greeting`. Pyynnön vastauksena palautetaan merkkijono, mikä sisältää ensin tervehdyksen (greeting) ja sitten nimen (name). Nämä ovat eroteltu toisistaan pilkulla.

Esimerkiksi pyyntö `/greet?greeting=Greetings&name=Earthling` palauttaa merkkijonon `Greetings, Earthling`. Vastaavasti pyyntö `/greet?greeting=Oi&name=Mate` palauttaa merkkijonon `Oi, Mate`. Parametrien järjestyksellä ei ole väliä.

</programming-exercise>


Mikäli parametreja ei tunneta, saa pyynnössä olevat parametrit saa käyttöön mm. `@RequestParam`-annotaatiolla, mitä seuraa `Map`-tietorakenne. Allaolevassa esimerkissä pyynnön parametrit asetetaan `Map`-tietorakenteeseen, jonka jälkeen kaikki pyyntöparametrien avaimet palautetaan kysyjälle.


```java
// pakkaus ja importit

@Controller
public class PyyntoParametrienNimetController {

    @GetMapping("/nimet")
    @ResponseBody
    public String nimet(@RequestParam Map<String, String> parametrit) {
        return parametrit.keySet().toString();
    }
}
```

Tämä parametrien käsittely voi tuntua aluksi magialta. Todellisuudessa kuitenkin sovelluskehykseen on toteutettu merkittävä määrä logiikkaa, jonka perusteella pyynnössä olevat parametrit tunnistetaan ja lisätään pyynnön käsittelyyn tarkoitetun metodin parametreiksi.


<programming-exercise name='Hello Request Params' tmcname='osa01-Osa01_09.HelloRequestParams'>

Toteuta pakkauksessa `hellorequestparams` olevaan luokkaan `HelloRequestParamsController` seuraava toiminnallisuus:

- Pyyntö polkuun `/hello` palauttaa käyttäjälle merkkijonon "Hello ", johon on liitetty `param`-nimisen parametrin sisältämä arvo.

- Pyyntö polkuun `/params` palauttaa käyttäjälle kaikkien pyynnön mukana tulevien parametrien nimet ja arvot.

Alla olevassa kuvassa on esimerkki tilanteesta, missä selaimella on tehty pyyntö polkuun `/params?hello=world&it=works`


<img src="../img/exercises/params-it-works.png"/>

</programming-exercise>


Parametrien tyypit voidaan määritellä pyynnön käsittelevään metodiin. Mikäli tiedämme, että metodi saa parametrinaan kokonaislukumuotoisen arvon, voidaan se käsitellä määritellä kokonaisluvuksi. Esimerkiksi nimen ja iän vastaanottava metodi määriteltäisiin seuraavalla tavalla.

```java
@GetMapping("/tervehdi")
@ResponseBody
public String tervehdi(@RequestParam String nimi, @RequestParam Integer ika) {
    return "Hei " + nimi + ", olet " + ika + " vuotta vanha.";
}
```

Huom! Yllä kokonaislukuparametri määritellään `Integer`-tyyppisenä. Tämä johtuu siitä, että tällöin arvo voi periaatteessa olla `null`. Alkeislukutyyppiseen `int`-muuttujaan ei voi asettaa `null`-arvoa, mikä voisi näkyä hyvin kryptisenä virheviestinä.


<programming-exercise name='Square' tmcname='osa01-Osa01_10.Square'>

Toteuta tässä tehtävässä pakkauksessa `square` sijaitsevaan `SquareController`-luokkaan seuraava toiminnallisuus:

- Pyyntö polkuun `/square` laskee parametrina `num` saatavan muuttujan arvon toisen potenssin ja palauttaa sen käyttjälle. Huomaa että arvo on numero, ja se tulee myös käsitellä numerona.

Palauta tehtävä TMC:lle kun olet valmis.

</programming-exercise>


<programming-exercise name='Calculator' tmcname='osa01-Osa01_11.Calculator'>

Toteuta tässä tehtävässä pakkauksessa `calculator` sijaitsevaan `CalculatorController`-luokkaan seuraava toiminnallisuus:

- Pyyntö polkuun `/add` laskee parametrien `first` ja `second` arvot yhteen ja palauttaa vastauksen käyttäjälle. Huomaa että arvot ovat numeroita, ja ne tulee myös käsitellä numeroina.

- Pyyntö polkuun `/multiply` kertoo parametrien `first` ja `second` arvot ja palauttaa vastauksen käyttäjälle.

Palauta tehtävä TMC:lle kun olet valmis.

</programming-exercise>


<quiz id="34b08e94-e65c-5fe2-9c00-b16d94d6cb52"></quiz>
