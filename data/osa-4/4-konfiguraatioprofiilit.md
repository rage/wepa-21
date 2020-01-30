---
path: '/osa-4/4-konfiguraatioprofiilit'
title: 'Konfiguraatioprofiilit'
hidden: false
---

<text-box variant='learningObjectives' name='Oppimistavoitteet'>

- Tiedät että sovelluksia voidaan kehittää erilaisissa ympäristöissä.
- Tiedät miten Springissä määritellään profiilikohtaisia konfiguraatiotiedostoja.
- Osaat määritellä sovellukseen ympäristökohtaista toiminnallisuutta.

</text-box>


Ohjelmistotuotannossa jokaisella ohjelmistokehittäjällä on oma ympäristö, missä sovellusta voi kehittää ja testata. Sovelluksen lähdekoodi sijaitsee versionhallintapalvelussa, ja sovelluksen toiminta ei ole riippuvainen työympäristöstä -- sovelluksen siirtämisen koneelta toiselle ei lähtökohtaisesti pitäisi vaatia muutoksia ohjelman lähdekoodiin. Samanlaista joustavuutta odotetaan myös silloin kun sovelluksesta julkaistaan uusi versio käyttäjille.

Sovelluksen julkaisun eli esimerkiksi tuotantopalvelimelle siirtämisen ei tule vaatia muutoksia sovelluksen lähdekoodiin. Kun sovellus on julkisessa käytössä, sillä on tyypillisesti ainakin usein eri tietokantaosoite kuin sovelluskehitysvaiheessa, mahdollisesti eri tietokannanhallintajärjestelmä, sekä todennäköisiä erilaisia salasanoihin ja ohjelman tuottamiin tulostuksiin (logeihin) liittyviä asetuksia.

Jotta tämä olisi mahdollista, tarvitsemme siis tavan asetusten määrittelyyn ympäristökohtaisesti.

Spring-projekteissa konfiguraatiotiedostot sijaitsevat kansiossa `src/main/resources/`. Spring etsii kansiosta tiedostoa nimeltä `application.properties`, johon ohjelmistokehittäjä voi määritellä sovelluksen käynnistyksen yhteydessä käytettäviä asetuksia. Asetustiedosto voi sisältää esimerkiksi tietokantaan liittyviä asetuksia:


```
spring.datasource.url=jdbc:h2:file:./database;create=true
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect

spring.jpa.show-sql=true
```

Yllä ensimmäiset kolme riviä kertovat tietokantaan liittyviä asetuksia. Ensimmäisellä rivillä kerrotaan tietokannan JDBC-osoite (käytetään H2-tietokannanhallintajärjestelmää), toisella rivillä kerrotaan muokataanko tietokantaa tarvittaessa automaattisesti (tietokantaa voi päivittää), ja kolmannella rivillä kerrotaan Hibernate-nimiselle ORM-kirjastolle käytettävä tietokannanhallintajärjestelmä sekä erityisesti sen spesifit komennot. Näitä seuraa asetus, joka määrää ohjelmaa kirjoittamaan tietokantakyselyt lokiin.

Mahdollisia asetuksia on hyvin suuri määrä. Näitä voi tarkastella osoitteessa <a href="https://docs.spring.io/spring-boot/docs/current/reference/html/common-application-properties.html" target="_blank">https://docs.spring.io/spring-boot/docs/current/reference/html/common-application-properties.html</a>.

<br/>

### Ympäristömuuttuja ja profiili

Käytettävä profiili määritellään tyypillisesti ympäristömuuttujan `SPRING_PROFILES_ACTIVE` avulla. Ympäristömuuttujan voi antaa sovellukselle parametrina sovellusta käynnistettäessä (`java ... -Dspring.profiles.active=arvo ...`) tai vaihtoehtoisesti sen voi asettaa unix-koneissa <a href="https://stackoverflow.com/questions/7328223/unix-export-command" target="_blank">export</a>-komennolla.

<br/>

Mikäli profiili määritellään, etsii Spring oletuskonfiguraatiotiedoston `application.properties` lisäksi myös annettuun profiiliin liittyvää konfiguraatiotiedostoa. Jos profiiliksi on määritelty `production`, etsii Spring konfiguraatiotiedostoa `application-production.properties`. Vastaavasti, jos profiiliksi on määritelty `test`, etsii Spring konfiguraatiotiedostoa `application-test.properties`.


### Profiilit ja erilaiset ympäristöt

Sovelluskehittäjän omalla koneella oleva sovellus, staging-ympäristössä oleva sovellus ja tuotantoympäristössä oleva sovellus voivat kaikki näyttää identtisiltä.
Huonossa tapauksessa ainoa tapa paikallisen kehitysympäristön ja tuotantoympäristön erottamiseen on selaimen osoitepalkki -- kumpikin sijaitsee erillisessä osoitteessa.

Ei ole kovin harvinaista, että sovelluskehittäjä testaa paikallisessa ympäristössä tekemiään muutoksia vahingossa tuotannossa. Tällainen testailu voi sisältää esimerkiksi -- verkkokaupassa -- tuotteiden lisäämistä ja poistamista sekä vaikkapa tuotteiden hintojen muuttamista. Profiileja voi käyttää myös tällaisen toiminnan vähentämiseen.

Profiilien avulla konkreettista käyttäjälle näkyvää sovellusta voi muuttaa. Esimerkiksi sovelluksen ylläpitäjille tarkoitetussa käyttöliittymässä voisi hyvin lukea isoilla kirjaimilla "TUOTANTOYMPÄRISTÖ" kun taas paikallisessa käytössä olevassa sovelluksessa voisi lukea isoilla kirjaimilla "TESTIYMPÄRISTÖ". Vastaavasti koko värimaailman voisi muokata toisenlaiseksi yms. Tutustutaan tähän mahdollisuuteen seuraavaksi tehtävän kautta.


<programming-exercise name='Profiles' tmcname='osa04-Osa04_04.Profiles'>

Harjoittelet tässä käytössä olevan profiilin tunnistamista ja näyttämistä. Muokkaa sovellusta siten, että...

- Kun käyttäjä tekee GET-pyynnön osoitteeseen `/profile`, käyttäjälle palautetaan tällä hetkellä käytössä oleva profiili merkkijonona.
- Kun käyttäjä tekee GET-pyynnön osoitteeseen `/`, käyttäjälle näytetään sivu, jolla näkyy tällä hetkellä käytössä oleva profiili.

Etsi netistä tähän apua. Hakulause "spring how to show active profile" lienee hyvä lähtökohta. Tiedostosta index.html puuttuvaan logiikkaan saattaa löytää apua hakusanoilla kuten "spring active profile thymeleaf".

</programming-exercise>
