---
path: '/osa-1/2-web-palvelimen-toiminta'
title: 'Web-palvelimen toiminta'
hidden: false
---

<text-box variant='learningObjectives' name='Oppimistavoitteet'>

- Tunnet asiakas-palvelin -mallin.
- Tiedät pääpiirteittäin miten web-palvelimet ja web-selaimet toimivat.
- Osaat toteuttaa yksinkertaisen palvelimen ja selaimen Java-kielellä.

</text-box>

Tässä luvussa tarkastellaan web-palvelinten ja selainten toimintaa. Palvelimet noudattavat tyypillisesti asiakas-palvelin -mallia, ja web-palvelimet ja selaimet keskustelevat HTTP-protokollaa noudattaen. Tämän lisäksi tarkastellaan Javan tarjoamia välineitä palvelinyhteyden muodostamiseen sekä palvelimen toteuttamiseen.


## Asiakas-palvelin malli


Asiakas-palvelin -mallissa *(Client-Server model)* asiakkaat käyttävät palvelimen tarjoamia palveluja. Kommunikointi asiakkaan ja palvelimen välillä tapahtuu usein verkon yli siten, että selain ja palvelin sijaitsevat erillisissä fyysisissä sijainneissa (eri tietokoneilla). Palvelin tarjoaa yhden tai useamman palvelun, joita käyttäjä käyttää selaimen kautta.

Käytännössä selain näyttää käyttöliittymän ohjelmiston käyttäjälle. Selaimen käyttäjän ei tarvitse tietää, että kaikki käytetty tieto ei ole hänen koneella. Käyttäjän tehdessä toiminnon selain pyytää tarpeen vaatiessa palvelimelta käyttäjän tarpeeseen liittyvää lisätietoa. Tyypillistä mallille on se, että palvelin tarjoaa vain asiakkaan pyytämät tiedot ja liikkuvan tiedon määrä pidetään vähäisenä.

Asiakas-palvelin -malli mahdollistaa hajautetut ohjelmistot: selainta käyttävät loppukäyttäjät voivat sijaita eri puolilla maapalloa palvelimen sijaitessa tietyssä paikassa.



<quiz id="58a6d3ce-9681-5546-af51-c4dc79d079ff"></quiz>


###  Yhteyden muodostaminen palvelimelle Java-maailmassa

Ohjelmoijan näkökulmasta porttia voi ajatella tiedostona. Tiedostoon voi kirjoittaa ja siellä olevaa tietoa voi lukea. Kirjoitettava ja luettava tieto ei kuitenkaan toiseen koneeseen yhteyttä ottaessa tule tiedostosta, vaan yhteyden toisessa päässä toimivasta ohjelmasta. Tarkastellaan seuraavaksi yhteyden muodostamista palvelimelle Java-kielellä.

Java-maailmassa yhteys toiselle koneelle muodostetaan <a href="https://docs.oracle.com/javase/8/docs/api/java/net/Socket.html" target="_blank">Socket</a>-luokan avulla. Kun yhteys on muodostettu, toiselle koneelle lähetettävä viesti kirjoitetaan socketin tarjoamaan <a href="https://docs.oracle.com/javase/8/docs/api/java/io/OutputStream.html" target="_blank">OutputStream</a>-rajapintaan. Tämän jälkeen luetaan vastaus socketin tarjoaman <a href="https://docs.oracle.com/javase/8/docs/api/java/io/InputStream.html" target="_blank">InputStream</a>-rajapinnan kautta.

<br/>

```java
String osoite = "www.helsinki.fi";
int portti = 80;

// muodosta yhteys
Socket socket = new Socket(osoite, portti);

// lähetä viesti palvelimelle
PrintWriter kirjoittaja = new PrintWriter(socket.getOutputStream());
kirjoittaja.println("GET / HTTP/1.1");
kirjoittaja.println("Host: " + osoite);
kirjoittaja.println();
kirjoittaja.flush();

// lue vastaus palvelimelta
Scanner lukija = new Scanner(socket.getInputStream());
while (lukija.hasNextLine()) {
    System.out.println(lukija.nextLine());
}
```


Yllä oleva ohjelma ottaa yhteyden etsii www.helsinki.fi -osoitteeseen liittyvän palvelimen, ottaa yhteyden palvelimen porttiin 80, ja lähettää palvelimelle seuraavan viestin:


<pre>
GET / HTTP/1.1
Host: www.helsinki.fi

</pre>


Tämän jälkeen ohjelma tulostaa palvelimelta saatavan vastauksen.

Lisää verkkoliikenteen käsittelystä löytyy mm. <a href="https://docs.oracle.com/javase/tutorial/networking/sockets/" target="_blank">tästä oppaasta</a>.

<br/>


<text-box variant='hint' name='Ohjelmointitehtävien tekeminen'>

Tästä eteenpäin materiaalissa on myös ohjelmointitehtäviä. Ohjelmointitehtävät tehdään NetBeans with TMC -järjestelmässä, jonka käyttöä on harjoiteltu esitietovaatimuksena olevilla kursseilla.

Mikäli et ole aiemmin käyttänyt NetBeans with TMC -järjestelmää, tutustu sen käyttöön osoitteessa <a href="https://materiaalit.github.io/tmc-asennus/netbeans/" target="_blank">https://materiaalit.github.io/tmc-asennus/netbeans/</a> olevia ohjeita noudattaen. Toisin kuin ohjeissa, kurssiksi tulee valita "Web-palvelinohjelmointi 2021" (löytyy organisaatiosta "MOOC").

Toisin kuin aiemmilla ohjelmointikursseilla, monissa tehtävistä ei ole automaattisia testejä. Yritä saada tehtävä tehtyä ennen sen palauttamista.

</text-box>


<programming-exercise name='Hello Browser!' tmcname='osa01-Osa01_01.HelloBrowser'>

Toteuta tehtäväpohjassa olevan `HelloBrowser`-luokan main-metodiin ohjelma, joka kysyy käyttäjältä sivun osoitetta, tekee syötetyn sivun juureen ("/") pyynnön, ja tulostaa käyttäjälle vastauksen.

Alla on esimerkkituloste, missä käyttäjän syöte on annettu punaisella.


<sample-output>

================
 THE INTERNETS!
================
Where to? **www.mooc.fi**

==========
 RESPONSE
==========
HTTP/1.1 301 Moved Permanently
// ... muita otsakkeita

&lt;html&gt;
&lt;head&gt;&lt;title&gt;301 Moved Permanently&lt;/title&gt;&lt;/head&gt;
&lt;body bgcolor="white"&gt;
&lt;center&gt;&lt;h1&gt;301 Moved Permanently&lt;/h1&gt;&lt;/center&gt;
&lt;hr&gt;&lt;center&gt;CloudFront&lt;/center&gt;
&lt;/body&gt;
&lt;/html&gt;

</sample-output>

Jos haettua osoitetta ei ole olemassa, ohjelman tulee heittää poikkeus.

</programming-exercise>




### Palvelimen toiminta Java-kielellä

Tarkastellaan seuraavaksi palvelimen toimintaa Java-kielellä.

Palvelimen toiminta muistuttaa huomattavasti yllä kuvattua yhteyden muodostamista. Toisin kuin yhteyttä toiseen koneeseen muodostaessa, palvelinta toteutettaessa luodaan <a href="https://docs.oracle.com/javase/8/docs/api/java/net/ServerSocket.html" target="_blank">ServerSocket</a>-olio, joka kuuntelee tiettyä koneessa olevaa porttia. Kun toinen kone ottaa yhteyden palvelimeen, saadaan käyttöön Socket-olio, joka tarjoaa mahdollisuuden lukemiseen ja kirjoittamiseen.

<br/>

Web-palvelin lukee tyypillisesti ensin pyynnön, jonka jälkeen pyyntöön kirjoitetaan vastaus. Alla on esimerkki yksinkertaisen palvelimen toiminnasta -- palvelin on toiminnassa vain yhden pyynnön ajan.


```java
// odotetaan pyyntöä porttiin 8080
ServerSocket server = new ServerSocket(8080);
Socket socket = server.accept();

// luetaan pyyntö
Scanner lukija = new Scanner(socket.getInputStream());
// ...

// kirjoitetaan vastaus
PrintWriter kirjoittaja = new PrintWriter(socket.getOutputStream());
// ...

// suljetaan resurssit
lukija.close();
kirjoittaja.close();
socket.close();
server.close();
```


`ServerSocket`-olion `accept`-metodi on blokkaava. Tämä tarkoittaa sitä, että `accept`-metodia kutsuttaessa ohjelman suoritus jää odottamaan kunnes palvelimeen otetaan yhteys. Kun yhteys on muodostettu, `accept`-metodi palauttaa `Socket`-olion, jota käytetään palvelimen ja yhteyden ottaneen koneen väliseen kommunikointiin.

Kokeile ylläolevaa ohjelmaa omalla koneellasi. Ohjelma käynnistää palvelimen, joka kuuntelee pyyntöä paikallisen koneen porttiin `8080`. Voit tehdä HTTP-muotoisen pyynnön porttiin 8080 selaimella kirjoittamalla selaimeen osoitteeksi `http://localhost:8080`.

<br/>

<text-box variant='hint' name='Tietokoneen portit'>

Jos kokeilet käynnistää palvelimen koneellasi, saatat törmätä virheviestiin. Tähän on useita mahdollisia syitä: (1) koneellasi oleva palomuuri- tai tietoturvaohjelmisto ei salli portin avaamista, (2) portti on jo käytössä (koneellasi oleva ohjelma -- esimerkiksi palvelin -- käyttää porttia 80), tai käyttäjätunnuksellasi ei ole oikeuksia portin avaamiseen.

Tietokoneella on käytössä portit 0-65535, joista "normaali" käyttäjä saa tyypillisesti avata vain suurempia kuin 1024 olevia. Lue lisää porteista <a href="https://fi.wikipedia.org/wiki/Portti_(tietoliikenne)" target="_blank">Wikipediasta</a>.

</text-box>


Palvelin halutaan tyypillisesti toteuttaa niin, että se kuuntelee ja käsittelee pyyntöjä jatkuvasti. Tämä onnistuu toistolauseen avulla.


```java
// luodaan palvelin porttiin 8080
ServerSocket server = new ServerSocket(8080);

while (true) {
    // odotetaan pyyntöä
    Socket socket = server.accept();

    // luetaan pyyntö
    Scanner lukija = new Scanner(socket.getInputStream());
    // ...

    // kirjoitetaan vastaus
    PrintWriter kirjoittaja = new PrintWriter(socket.getOutputStream());
    // ...

    // vapautetaan resurssit
    lukija.close();
    kirjoittaja.close();
    socket.close();
}
```

Web-palvelimet käsittelevät useampia pyyntöjä lähes samanaikaisesti, sillä palvelinohjelmistot ovat tyypillisesti säikeistettyjä. Tällöin jokainen pyyntö käsitellään erillisessä säikeessä, joka luo pyyntöön vastauksen ja palauttaa sen käyttäjille. Javassa säikeille löytyy oma <a href="https://docs.oracle.com/javase/8/docs/api/java/lang/Thread.html" target="_blank">Thread</a>-luokka. Emme kuitenkaan tällä kurssilla perehdy säikeiden käyttöön sen tarkemmin -- mm. tätä varten löytyy kurssi Käyttöjärjestelmät (TKT-20003).

<br/>

<programming-exercise name='Hello Server!' tmcname='osa01-Osa01_02.HelloServer'>

Toteuta web-palvelin, joka kuuntelee pyyntöjä porttiin 8080.

Jos pyydetty polku on `/quit`, tulee palvelin sammuttaa.

Muulloin, minkä tahansa pyynnön vastaukseen tulee palauttaa HTTP-statuskoodi 200 sekä tehtäväpohjassa olevan `index.html`-sivun sisältö.

Huom! Älä missään nimessä käytä kutsua `System.exit` palvelimen sammuttamiseen nyt tai myöhemmissä tehtävissä.

Huom2! Kun kirjoitat vastauksen `PrintWriter`-olion avulla, kutsu olion `flush`-metodia ennen yhteyden sulkemista. Tällöin vältät tilanteen, missä yhteys suljetaan ennen kuin kaikki tieto on todellisuudessa kirjoitettu vastaukseen asti.

</programming-exercise>



<programming-exercise name='Hello Redirect Loop!' tmcname='osa01-Osa01_03.HelloRedirectLoop'>

Toteuta web-palvelin, joka kuuntelee pyyntöjä porttiin 8080.

Jos pyydetty polku on `/quit`, tulee palvelin sammuttaa.

Muulloin, minkä tahansa pyynnön vastaukseen kirjoitetaan resurssin siirtymisestä kertova (302-alkuinen) HTTP-statuskoodi sekä palvelimen osoite, eli `http://localhost:8080` -- tämä tulee tehdä HTTP-protokollan odottamassa muodossa eli:

<pre>
HTTP/1.1 302 Found
Location: http://localhost:8080

</pre>

Ota samalla selvää kuinka monta pyyntöä selaimesi tekee palvelimelle, ennen kuin se ymmärtää että jotain on vialla.

<img src="../img/exercises/redirectloop.png"/>

</programming-exercise>


##

Käsittelimme tässä luvussa selaimen ja palvelimen toimintaa sekä toteutimme yksinkertaisen selaimen ja palvelimen. Jatkossa oletamme, että käytössämme on selain (kurssin esimerkeissä oletetaan <a href="https://www.google.com/chrome/" target="_blank">Google Chrome</a>-selaimen käyttö). Tämän lisäksi jatkossa toteutettavat sovelluksemme hyödyntävät valmiita palvelimia kuten <a href="https://tomcat.apache.org" target="_blank">Apache Tomcat</a> ja <a href="https://www.eclipse.org/jetty/" target="_blank">Eclipse Jetty</a>.

<br/>

Kun käytössämme on valmiit selaimet ja palvelimet, voimme keskittyä web-sovelluksen logiikan toteuttamiseen.
