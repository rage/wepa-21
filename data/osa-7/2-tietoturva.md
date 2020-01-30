---
path: '/osa-7/2-tietoturva'
title: 'Muutama sana tietoturvasta'
hidden: false
---


<text-box variant='learningObjectives' name='Oppimistavoitteet'>

- Tiedät mitä HTTPS tarkoittaa.
- Tunnet lyhenteen OWASP.
- Tunnet tyypillisimpiä web-sovelluksiin liittyviä tietoturvaongelmia-
- Osaat nimetä joitakin OWASP Top 10 -listalla olevista Web-sovellusten tietoturvauhkista.

</text-box>


Tutustutaan lyhyesti web-sovellusten tietoturvaan liittyviin teemoihin.

## Suojattu verkkoyhteys

Kommunikointi selaimen ja palvelimen välillä halutaan käytännössä aina salata. HTTPS on HTTP-pyyntöjen tekemistä SSL (tai TLS)-salauksella. HTTPS mahdollistaa sekä käytetyn palvelun verifioinnin sertifikaattien avulla että lähetetyn ja vastaanotetun tiedon salauksen.

HTTPS-pyynnöissä asiakas ja palvelin sopivat käytettävästä salausmekanismista ennen varsinaista kommunikaatiota. Tässä selain ottaa ensin yhteyden palvelimen HTTPS-pyyntöjä kuuntelevaan porttiin (yleensä 443), lähettäen palvelimelle listan selaimella käytössä olevista salausmekanismeista. Palvelin valitsee näistä parhaiten sille sopivan (käytännössä vahvimman) salausmekanismin, ja lähettää takaisin salaustunnisteen (palvelimen nimi, sertifikaatti, julkinen salausavain). Selain ottaa mahdollisesti yhteyttä sertifikaatin tarjoajaan -- joka on kolmas osapuoli -- ja tarkistaa onko sertifikaatti kunnossa.

Selain lähettää tämän jälkeen palvelimelle salauksessa käytettävän satunnaisluvun palvelimen lähettämällä salausavaimella salattuna. Palvelin purkaa viestin ja saa haltuunsa selaimen haluaman satunnaisluvun. Viesti voidaan nyt lähettää salattuna satunnaislukua ja julkista salausavainta käyttäen.

Käytännössä kaikki web-palvelimet tarjoavat HTTPS-toiminnallisuuden valmiina, joskin se täytyy ottaa palvelimilla käyttöön. Esimerkiksi Herokussa HTTPS on oletuksena käytössä sovelluksissa -- aiemmin mahdollisesti Herokuun lisäämääsi sovellukseen pääsee käsiksi myös osoitteen `https://sovelluksen-nimi.herokuapp.com` kautta. Tämä ei kuitenkaan estä käyttäjiä tekemästä pyyntöjä sovellukselle ilman HTTPS-yhteyttä -- jos haluat, että käyttäjien tulee tehdä kaikki pyynnöt HTTPS-yhteyden yli, lisää tuotantokonfiguraatioon seuraava rivi.

```
security.require-ssl=true
```


<text-box variant='hint' name='Muutama sana turvallisesta verkkoyhteydestä'>

Mikäli yhteys selaimen ja sovelluksen välissä on salattu, on tilanne melko hyvä. Tässä välissä on hyvä kuitenkin mainita myös avointen verkkoyhteyksien käytöstä.

Jos selaimen käyttäjä käyttää sovellusta avoimen (salasanattoman) langattoman verkkoyhteyden kautta, voi lähetettyjä viestejä kuunnella (ja muokata) käytännössä kuka tahansa. Avoimissa verkoissa käyttöjärjestelmä kirjautuu siihen verkkoon, jonka signaali on vahvin. Jos ilkeämielinen henkilö rakentaa samannimisen verkon ja saa verkkoyhteyden signaalin vahvemmaksi kuin olemassaolevassa verkossa, ottaa käyttäjän käyttöjärjestelmä automaattisesti yhteyden ilkeämielisen henkilön verkkoon.

</text-box>


## OWASP ja tyypillisimpiä tietoturvauhkia

[Open Web Application Security Project (OWASP)](https://www.owasp.org/index.php/Main_Page) on kansainvälinen voittoa tavoittelematon  organisaatio (engl. non-profit organization), jonka pyrkimyksenä on sovelluksiin liittyvän tietoturvatietoisuuden kasvattaminen. OWASP pitää yllä web-sovelluksiin liittyvien tietoturvauhkien [Top 10](https://www.owasp.org/index.php/Category:OWASP_Top_Ten_Project)-listaa.

Vuoden 2017 lista löytyy [tästä linkistä](https://www.owasp.org/images/7/72/OWASP_Top_10-2017_%28en%29.pdf.pdf). Vuoden 2013 ja 2017 versiossa osa top 10 -listan tietoturvauhkista on muuttunut, mutta ensimmäisellä ja toisella sijalla ovat yhä samat tietoturvauhkat.

Listan ensimmäisellä sijalla -- eli yleisimpänä -- sijaitsee erilaiset injektiohyökkäykset. Tällaisia ovat esimerkiksi SQL:n syöttäminen osaksi tietokantaan syötettävää lomakedataa (toimii mikäli SQL-injektioihin ei ole varauduttu). Valmiita tietokanta-abstraktioita käytettäessä riski SQL-injektioiden onnistumiseen on pienempi kuin mikäli tietokanta-abstraktiot toteuttaa itse -- olemassaolevien tietokanta-abstraktioiden tietoturvaa [tarkastelevat myös muut](https://pivotal.io/security/cve-2016-6652), mikä edesauttaa ongelmien löytymistä.

Listan toisella sijalla on rikkinäinen autentikaatio, jonka kautta hyökkääjä pääsee käsiksi esimerkiksi salasanoihin, tai jonka kautta hyökkääjä voi esittäytyä jonain muuna käyttäjänä. Tämä on mahdollista muunmuassa mikäli käyttäjien tunnistamiseen käytetty komponentti on huonosti toteutettu, evästeet ovat arvattavissa ym.

<quiz id="ec8b9e2f-504d-5682-9af3-2b60e1c4138d"></quiz>


## Oman sovelluksen suojaaminen

Olemme harjoitelleet oman sovelluksen suojaamista oikeastaan koko kurssin ajan.

Tietokantaan tallennettavan tiedon muoto on määritelty käyttämällä tietokantatauluja kuvaavia luokkia, jolloin jokaiseen tietokantataulun attribuuttiin liittyy tietty tietotyyppi. Tällöin käyttäjällä ei ole mahdollisuutta lisätä tietokantaan epätoivotun muotoista dataa -- esimerkiksi numerokenttään ei voi lisätä merkkijonoa. Samalla tietokanta-abstraktiot kuten Spring Data JPA, jotka tekevät konkreettiset tietokantakyselyt puolestamme, vähentävät itseaiheutettujen SQL-injektiomahdollisuuksien määrää.

Vaikka käyttäjä pääsisi lisäämään tietokantaan tietoa jotain toista kautta, kuten vaikkapa toisen samaa tietokantaa käyttävän palvelun kautta, kurssilla käytetyt menetelmät tiedon näyttämiseen vähentävät käyttäjälle päätyvän harmia aiheuttavan sisällön riskiä. Mikäli tietokantaan saisi tallennettua JavaScript-koodia, esim. `<script>alert("hei")</script>`, tiedon näyttämiseen käytetty Thymeleafin `th:text`-komento muokkaa merkit `<` ja `>` muotoon `&lt;` ja `&gt;`. Tällöin tietokantaan jotain muuta kautta ujutettua JavaScript-koodia ei suoriteta käyttäjän koneella, vaikka se tietokannasta haettaisiinkin.

Olemme myös oppineet menetelmiä käyttäjätunnusten määrittelyyn sekä tietokantaan tallennettavan salasanan suojaamiseen (esim. [bcrypt](https://en.wikipedia.org/wiki/Bcrypt)). Olemme myös harjoitelleet polkujen ja metodien suojaamista, sekä tutustuneet suojausten tekemiseen käyttäjien roolien perusteella. Oleellista tässä on se, että olemme harjoitelleet toiminnallisuuden tekemistä hyväksi todetulla tietoturvakomponentilla eikä omilla häkkyröillä. Springin [Spring Security](https://spring.io/projects/spring-security)-projekti on itsessään hyvin laaja, ja olemme raapaisseet vain sen pintaa -- projekti tarjoaa hyvin monipuolisia menetelmiä autentikoitiin ja autorisointiin.

Vastaavasti myös muutkin käyttämämme kirjastot ovat olleet pitkään käytössä ja niitä on kehitetty jatkuvasti. Teemaa kannattaa jatkaa myös CSS- ja JavaScript-kirjastojen valinnassa. Esimerkiksi Twitter Bootstrap on erittäin hyvin tunnettu kirjasto, ja mikäli siihen liittyvään ladattavaan tiedostoon päätyisi tietoturvauhka, uhka korjattaisiin hyvin todennäköisesti hyvin nopeasti. Suositus tunnettujen ja paljon käytettyjen teknologioiden käyttöön ei kuitenkaan missään nimessä tarkoita sitä, etteikö uudempiin teknologioihin kannattaisi tutustua -- päinvastoin. Tuntemalla ja käyttämällä pitkään käytössä olleita teknologioita uudempien teknologioiden opetteluun on pohja aiemmasta.

Edellä mainittujen lisäksi käytössämme on myös useita pieniä asioita, joita emme oikeastaan huomaa. Esimerkiksi lomakkeita Spring Securityn kanssa käyttäessämme lomakkeisiin liitetään [Cross-Site Request Forgery](https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)) -token. Tämä "token", joka on satunnainen merkkijono, on lomakkeen latauskohtainen. Mikäli lomakkeen lähetyksen yhteydessä ei lähetetä oikeaa arvoa, sovelluskehys päättelee, että tieto tulee jostain epätoivotusta palvelusta. Tämän avulla estetään Cross-Site Request Forgery -hyökkäys.



<text-box variant='hint' name='Cyber Security Base'>

Kurssin Web-palvelinohjelmointi Java jälkeen kannattaa tehdä kurssisarjan [Cyber Security Base](https://cybersecuritybase.mooc.fi/) ensimmäiset kolme osaa: (1) Introduction to Cyber Security, (2) Securing Software, ja (3) Course Project I.

</text-box>
