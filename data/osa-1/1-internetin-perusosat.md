---
path: '/osa-1/1-internetin-perusosat'
title: 'Internetin perusosat'
hidden: false
---

<text-box variant='learningObjectives' name='Oppimistavoitteet'>

- Tiedät pääpiirteittäin miten Internet toimii.
- Tunnet käsitteet URI, DNS, HTTP ja HTML.
- Tunnet käsitteet käsitteet polku ja pyynnön parametri.
- Tunnet HTTP-protokollan tasolla GET ja POST-tyyppisten pyyntöjen perusrakenteen.
- Tunnistat palvelimelta palautettavan HTTP-protokollaa noudattavan vastauksen osat.

</text-box>

<quiz id="d985bdb0-bce9-5b9a-8809-df7eb787e59a"></quiz>


Internetin perustana ovat (1) palveluiden, palvelinohjelmistojen ja resurssien yksilöintiin käytetyt merkkijonomuotoiset osoitteet (URI, Uniform Resource Identifier) sekä näiden merkkijonomuotoisten osoitteiden verkko-osoitteiksi muuntamiseen käytettävä palvelu (DNS, Domain Name Services), (2) selainten ja palvelinten välisessä viestittelyssä käytettävä viestimuoto eli protokolla (HTTP, HyperText Transfer Protocol), sekä (3) yhteinen dokumenttien esityskieli (HTML, HyperText Markup Language).

Näiden kolmen peruspilarin -- URI, HTTP ja HTML -- lisäksi internetin mahdollistaa verkkoliikenne sekä siihen liittyvät protokollat kuten TCP ja TCP/IP. Jälkimmäisiin syvennytään tarkemmin kurssilla Tietoliikenteen perusteet (TKT-20004).

Yksinkertaisenkin verkkosivun hakemiseen liittyy monta askelta. Kun kirjoitat osoitteen selaimen osoitepalkkiin ja painat enteriä, seuraavat tapahtumat tapahtuvat.

1. Käyttäjä kirjoittaa osoitteen (URI, URL) selaimen osoitepalkkiin ja painaa hae.
2. Jos osoite on tekstimuotoinen osoite, esim. mooc.fi, selain ottaa yhteyden DNS-palvelimeen ja hakee DNS-palvelimelta tekstimuotoista osoitetta vastaavan IP-osoitteen.
3. Selain ottaa yhteyden IP-osoitteessa toimivaan palvelimeen ja lähettää sinne HTTP-pyynnön.
4. Palvelin vastaanottaa pyynnön ja käsittelee sen. Jos käyttäjän pyytämä sivu -- esimerkiksi HTML-sivu -- löytyy palvelimelta, palvelin palauttaa sivun käyttäjälle. Jos sivua ei löydy, palvelin palauttaa virheviestin.
5. Selain vastaanottaa palvelimen palauttaman vastauksen ja yhteys palvelimelle suljetaan.
6. Selain käsittelee palvelimen palauttaman vastauksen. Mikäli vastaus on HTML-sivu, selain käy sen läpi elementti elementiltä erikseen haettavia resursseja kuten kuvia, tyylitiedostoja, javascript-tiedostoja, ym, tunnistaen. Käyttäjälle voidaan näyttää tässä vaiheessa jo osa sivusta.
7. Selain hakee jokaisen erikseen haettavan resurssin erillisessä resurssikohtaisessa HTTP-pyynnössä.
8. Kun sivu on käsitelty ja kaikki siihen liittyvät resurssit on haettu ja käsitelty, sivu näkyy käyttäjälle kokonaan ladattuna

Tarkastellaan edellisessä tapahtumaketjussa esiintyneitä termejä hieman tarkemmin.

## URI ja DNS: Osoitteet ja niiden tulkinta


Verkossa sijaitseva resurssi tunnistetaan osoitteen perusteella. Osoite (URI eli Uniform Resource Identifier, myös terminä käyttöön jäänyt URL *Uniform Resource Locator*) koostuu resurssin nimestä ja sijainnista, joiden perusteella haluttu resurssi ja palvelin (sijainti) voidaan löytää verkossa olevien koneiden massasta.

Termi resurssi tulee ajalta, jolloin verkkosivut olivat lähinnä staattisia dokumentteja, mutta se vastaa oikeastaan mitä tahansa verkosta haettavaa sisältöä. URI-osoitteet näyttävät seuraavilta:

<pre>
protokolla://isäntäkone:portti/
</pre>

- `protokolla`: kyselyssä käytettävä protokolla, esimerkiksi HTTP tai HTTPS.
- `isäntäkone`: kone tai palvelin johon luodaan yhteys. Voi olla joko IP-osoite tai tekstuaalinen kuvaus (esim `mooc.fi` tai `www.hs.fi`).
- `portti`: mikäli portin jättää osoitteesta pois, tehdään pyyntö tyypillisesti protokollan oletusporttiin -- esimerkiksi HTTP-protokollan portti on oletuksea 80. Salatun HTTP-protokollan (HTTPS) portti on onoletuksena 443.

Osoitteissa voi olla lisäksi polku, tietoa haettavasta dokumentista, kyselyparametreja sekä ankkuri. Nämä kaikki, kuten myös portti, ovat valinnaisia.


<pre>
polku/kohdedokumentti.paate?kyselyparametri=arvo&toinen=arvo#ankkuri
</pre>

- `polku`: polku resurssiin palvelimella, esim `https://www.hs.fi/uutiset`.
- `kohdedokumentti` ja `.paate`: haettava resurssi sekä sen tiedostotyyppi, esim `lista.pdf`.
- `kyselyparametrit`: koostuu avain-arvo -pareista, joiden avulla palvelimelle pystyy toteuttamaan lisätoiminnallisuutta. Kuhunkin avaimeen liittyvä arvo annetaan `=`-merkillä eroteltuina, avain-arvo -parit erotetaan toisistaan `&`-merkillä.
- `ankkuri`: kertoo mihin kohtaan dokumentissa tulee mennä.

Yhdessä edellisten avulla tunnistetaan protokolla ja kone sekä koneesta haettava resurssi.


<quiz id="af9fc62f-27f9-524a-a465-1ff621166501"></quiz>


Kun käyttäjä kirjoittaa web-selaimen osoitekenttään osoitteen ja painaa enteriä, web-selain tekee kyselyn annettuun osoitteeseen. Koska tekstimuotoiset osoitteet ovat käytännössä vain ihmisiä varten, kääntää selain ensiksi halutun tekstimuotoisen osoitteen IP-osoitteeksi. Jos IP-osoite on jo tietokoneen tiedossa esimerkiksi aiemmin osoitteeseen tehdyn kyselyjen takia, selain voi ottaa yhteyden IP-osoitteeseen. Jos IP-osoite taas ei ole tiedossa, tekee selain ensin kyselyn <a href="https://fi.wikipedia.org/wiki/DNS" target="_blank">DNS</a>-palvelimelle (*Domain Name System*), jonka tehtävänä on muuntaa tekstuaaliset osoitteet IP-osoitteiksi (esim. Helsingin yliopiston kotisivu `https://www.helsinki.fi` on IP-osoitteessa `128.214.189.90`).

<br/>

IP-osoitteet yksilöivät tietokoneet ja mahdollistavat koneiden löytämisen verkon yli. Käytännössä yhteys IP-osoitteen määrittelemään koneeseen avataan <a href="https://fi.wikipedia.org/wiki/OSI-malli" target="_blank">sovelluskerroksen</a> <a href="https://fi.wikipedia.org/wiki/HTTP" target="_blank">HTTP-protokollan</a> avulla kuljetuskerroksen <a href="https://fi.wikipedia.org/wiki/TCP" target="_blank">TCP-protokollan</a> yli. TCP-protokollan tehtävänä on varmistaa, että viestit pääsevät perille. Selain ei ota "suoraan" yhteyttä palvelinohjelmistoon, vaan välissä on tyypillisesti useita viestinvälityspalvelimia, jotka auttavat viestin perillepääsemisessä.

<br/>

## HTTP: Selainten ja palvelinten välinen kommunikaatioprotokolla

HTTP (*HyperText Transfer Protocol*) on sovellustason protokolla, jota web-palvelimet ja selaimet käyttävät kommunikointiin. HTTP-protokolla perustuu asiakas-palvelin malliin, jossa jokaista pyyntöä kohden on yksi vastaus (*request-response paradigm*). Tämä tarkoittaa sitä, että jokainen pyyntö käsitellään erillisenä kokonaisuutena, eikä saman käyttäjän kahta peräkkäistä pyyntöä yhdistetä automaattisesti toisiinsa.

Käytännössä HTTP-asiakasohjelma (jatkossa selain) lähettää viestin palvelimelle, joka palauttaa HTTP-protokollan mukaisen vastauksen. Tällä hetkellä eniten käytetty HTTP-protokollan versio on 1.1, joka on määritelty <a href="https://www.w3.org/Protocols/rfc2616/rfc2616.html" target="_blank">RFC 2616</a>-spesifikaatiossa.

<br/>

Tutustutaan seuraavaksi tarkemmin HTTP-protokollaan, eli selainten ja palvelinten väliseen kommunikaatioon käytettyyn kommunikaatiotyyliin.

### HTTP-viestin rakenne: palvelimelle lähetettävä kysely

HTTP-protokollan viestit ovat tekstimuotoisia. Viestit koostuvat riveistä jotka muodostavat otsakkeen, sekä riveistä jotka muodostavat viestin rungon. Viestin runkoa ei ole pakko olla olemassa -- joskus palautetaan esimerkiksi vain uudelleenohjaukseen ohjeistava viesti. Viestin loppuminen ilmoitetaan kahdella peräkkäisellä rivinvaihdolla.

Palvelimelle lähetettävän viestin, eli kyselyn, ensimmäisellä rivillä on pyyntötapa, halutun resurssin polku ja HTTP-protokollan versionumero.


<pre>
PYYNTÖTAPA /POLKU_HALUTTUUN_RESURSSIIN HTTP/versio
otsake-1: arvo
otsake-2: arvo

valinnainen viestin runko
</pre>


Pyyntötapa ilmaisee HTTP-protokollassa käytettävän pyynnön tavan (esim. `GET` tai `POST`). Polku haluttuun resurssiin kertoo haettavan resurssin sijainnin palvelimella ja se voi sisältää URI:n osat polku, kohdedokumentti ja pääte, kyselyparametrit, sekä ankkurin (esim. `/uutiset/index.html?rajaa=10#uusin`). HTTP-versio kertoo käytettävän version (esim. `HTTP/1.0`).

Alla esimerkki hyvin yksinkertaisesta -- joskin yleisestä -- pyynnöstä. Huomaa että yhteys palvelimeen on HTTP-protokollalla tapahtuvan viestittelyn kohdalla jo muodostettu -- HTTP-protokolla ei siis liity yhteyden muodostamiseen.


<pre>
GET /index.html HTTP/1.0

</pre>


Yleisesti käytössä oleva HTTP/1.1 -protokolla mahdollistaa useamman palvelimen pitämisen samassa IP-osoitteessa virtuaalipalvelintekniikan avulla. Tällöin yksittäiset palvelinkoneet voivat sisältää useita palvelimia. Käytännössä IP-osoitetta kuunteleva kone voi joko itsessään sisältää useita ohjelmistoilla emuloituja palvelimia, tai se voi toimia reitittimenä ja ohjata pyynnön tietylle esimerkiksi yrityksen sisäverkossa sijaitsevalle koneelle.


Koska yksittäinen IP-osoite voi sisältää useampia palvelimia, pelkkä polku haluttuun resurssiin ei riitä oikean resurssin löytämiseen: resurssi voisi olla millä tahansa koneeseen liittyvällä virtuaalipalvelimella. HTTP/1.1 -protokollassa on pyynnöissä pakko olla mukana käytetyn palvelimen osoitteen kertova `Host`-otsake.


<pre>
GET /index.html HTTP/1.1
Host: www.munpalvelin.net

</pre>

Käytännössä tämä tarkoittaa sitä, että samassa IP-osoitteessa voi olla useita "alipalvelimia". Kun haet osoitetta tekstimuotoisella osoitteella, selain lähettää viestin yhteydessä `Host`-otsakkeen, jonka perusteella IP-osoitteeseen vastaava palvelin päättelee alipalvelimen.


<text-box variant='hint' name='Tekstimuotoisella osoitteella löytyy IP-osoite, mutta IP-osoite ei aina vastaa vain yhdestä palvelusta'>

Esimerkiksi osoitteeseen `www.hs.fi` vastaava palvelin löytyy mm. osoitteesta `13.32.56.28`.

<pre>
$ ping www.hs.fi
PING www.hs.fi (13.32.56.28) 56(84) bytes of data.
...
</pre>

Kun IP-osoitteeseen `13.32.56.28` mennään selaimella, ei sieltä kuitenkaan löydy Helsingin sanomien sivua. Alipalvelimia käytetään muunmuassa kuorman tasaamiseen -- isommilla verkkopalveluilla kuten Helsingin sanomilla on todennäköisesti niin paljon käyttäjiä, ettei yhdellä palvelimella pystytä vastaamaan kaikkiin pyyntöihin. Tarkemmin osoitetta `13.32.56.28` tarkasteltaessa huomataankin, että kyseessä on <a href="https://en.wikipedia.org/wiki/Amazon_CloudFront" target="_blank">Amazonin CloudFront</a>-palvelu, jonka avulla palveluntarjoajat kuten Helsingin sanomat voivat skaalata tarjontaansa suuremmille joukoille.

</text-box>

### HTTP-viestin rakenne: palvelimelta saapuva vastaus

Palvelimelle tehtyyn pyyntöön saadaan aina jonkinlainen vastaus. Jos tekstimuotoiseen osoitteeseen ei ole liitetty IP-osoitetta DNS-palvelimilla, selain ilmoittaa ettei palvelinta löydy. Jos palvelin löytyy, ja pyyntö saadaan tehtyä palvelimelle asti, tulee palvelimen myös vastata jollain tavalla.

Palvelimelta saatavan vastauksen sisältö on seuraavanlainen. Ensimmäisellä rivillä on HTTP-protokollan versio, viestiin liittyvä statuskoodi, sekä statuskoodin selvennys. Tämän jälkeen on joukko otsakkeita, tyhjä rivi, ja mahdollinen vastausrunko. Vastausrunko ei ole pakollinen.


<pre>
HTTP/versio statuskoodi selvennys
otsake-1: arvo
otsake-2: arvo

valinnainen vastauksen runko
</pre>


Esimerkiksi:


<pre>
HTTP/1.1 200 OK
Date: Mon, 01 Sep 2014 03:12:45 GMT
Server: Apache/2.2.14 (Ubuntu)
Vary: Accept-Encoding
Content-Length: 973
Connection: close
Content-Type: text/html;charset=UTF-8

.. runko ..
</pre>


Kun palvelin vastaanottaa tiettyyn resurssiin liittyvän pyynnön, tekee se resurssiin liittyviä toimintoja ja palauttaa lopulta vastauksen. Kun selain saa vastauksen, tarkistaa se vastaukseen liittyvän statuskoodin ja siihen liittyvät tiedot -- tyypillinen statuskoodi on `200` (OK). Tämän jälkeen selain päättelee, mitä vastauksella tehdään, ja esimerkiksi näyttää vastaukseen liittyvän sisällön kuten web-sivun käyttäjälle.


### HTTP-statuskoodit

Statuskoodit (*status code*) kuvaavat palvelimella tapahtunutta toimintaa kolmella numerolla. Statuskoodien avulla palvelin kertoo mahdollisista ongelmista tai tarvittavista lisätoimenpiteistä. Yleisin statuskoodi on `200`, joka kertoo kaiken onnistuneen oikein. HTTP/1.1 sisältää viisi kategoriaa vastausviesteihin.

- 1**: informaatioviestit (esim 100 "Continue")
- 2**: onnistuneet tapahtumat (esim 200 "OK")
- 3**: asiakasohjelmistolta tarvitaan lisätoimintoja (esim 301 "Moved Permanently" tai 304 "Not Modified" eli hae välimuistista)
- 4**: virhe pyynnössä tai erikoistilanne (esim 401 "Not Authorized" ja 404 "Not Found")
- 5**: virhe palvelimella (esim 500 "Internal Server Error")

Lista lähes kaikista HTTP-statuskoodeista löytyy osoitteesta <a href="https://en.wikipedia.org/wiki/List_of_HTTP_status_codes" target="_blank">https://en.wikipedia.org/wiki/List_of_HTTP_status_codes</a>.

<br/>

<quiz id="10c93f6d-505d-5924-ad4e-7b9a7d7207b9"></quiz>

### HTTP-liikenteen testaaminen telnet-työvälineellä

Linux-ympäristöissä on käytössä telnet-työkalu, jota voi käyttää yksinkertaisena asiakasohjelmistona pyyntöjen simulointiin. Telnet-yhteyden tietyn koneen tiettyyn porttiin saa luotua komennolla `telnet isäntäkone portti`. Esimerkiksi Helsingin sanomien www-palvelimelle saa yhteyden seuraavasti:

<sample-output>

$ **telnet www.hs.fi 80**

</sample-output>

Tätä seuraa telnetin infoa yhteyden muodostamisesta, jonka jälkeen pääsee kirjoittamaan pyynnön.


<sample-output>

Trying 13.32.56.28...
Connected to www.hs.fi.
Escape character is '^]'.


</sample-output>

Yritetään pyytää HTTP/1.1 -protokollalla juuridokumenttia. Huom! HTTP/1.1 -protokollassa tulee pyyntöön lisätä aina Host-otsake. Jos yhteys katkaistaan ennen kuin olet saanut kirjoitettua viestisi loppuun, ota apuusi tekstieditori ja copy-paste. Muistathan myös että viesti lopetetaan aina kahdella rivinvaihdolla.



<sample-output>

**GET / HTTP/1.1**
**Host: www.hs.fi**


</sample-output>


Palvelin palauttaa vastauksen, jossa on statuskoodi ja otsakkeita sekä dokumentin runko.


<sample-output>

HTTP/1.1 301 Moved Permanently
Server: CloudFront
Date: Sun, 03 Mar 2019 09:20:36 GMT
Content-Type: text/html
Content-Length: 183
Connection: keep-alive
Location: https://www.hs.fi/
X-Cache: Redirect from cloudfront
Via: 1.1 a529b95d300020af7b6819ecefd572f4.cloudfront.net (CloudFront)
X-Amz-Cf-Id: a8UnDgQydT2LUbo-uKy49aeZP-QgDFnMvJ43CRMxvFbuTd1zxDDRIA==

&lt;html&gt;
&lt;head&gt;&lt;title&gt;301 Moved Permanently&lt;/title&gt;&lt;/head&gt;
&lt;body bgcolor="white"&gt;
&lt;center&gt;&lt;h1&gt;301 Moved Permanently&lt;/h1&gt;&lt;/center&gt;
&lt;hr&gt;&lt;center&gt;CloudFront&lt;/center&gt;
&lt;/body&gt;
&lt;/html&gt;

</sample-output>


Yllä olevassa esimerkissä palvelimelta `www.hs.fi` sisältöä haettaessa palvelin vastaa "HTTP/1.1 301 Moved Permanently". Viestillä palvelin kertoo, että sisältöjä tulee hakea salatun HTTPS-protokollan yli. HTTPS-protokollaa noudattavien sivujen tarkastelu on hieman haastavampaa telnet-yhteyden yli, sillä viestittelyn tulee olla salattua -- tähän telnet ei tarjoa tukea.

Eräs vaihtoehto on Linux-koneilla HTTPS-yhteyden yli tapahtuvien viestien tarkasteluun on <a href="https://gnutls.org/" target="_blank">GnuTLS</a> kirjasto. Tämän avulla suojatun HTTP-yhteyden muodostaminen ja tarkastelu onnistuu suoraviivaisesti.

<br/>

<sample-output>

$ **gnutls-cli www.hs.fi**

Processed 148 CA certificate(s).
Resolving 'www.hs.fi'...
Connecting to '13.32.56.44:443'...
Certificate type: X.509
Got a certificate list of 4 certificates.
...

**GET / HTTP/1.1**
**Host: www.hs.fi**



// .. palvelin tulostaa vastauksen tänne

</sample-output>


Jos käytössäsi ei ole Linux-konetta, voit käyttää Telnetiä esimerkiksi <a href="https://www.chiark.greenend.org.uk/~sgtatham/putty/" target="_blank">PuTTY</a>-ohjelmiston avulla. Voit myös tehdä selailua käsin hieman myöhemmin toteutettavan Java-ohjelman avulla.

<br/>


<text-box variant='hint' name='Chrome Dev Tools'>


Google Chromen DevTools-apuvälineet löytää Tools-valikosta tai painamalla F12 (Linux). Apuvälineillä voi esimerkiksi tarkastella verkkoliikennettä ja lähetettyjä ja vastaanotettuja paketteja. Valitsemalla työvälineistä Network-välilehden, ja lataamalla sivun uudestaan, näet kaikki sivua varten ladattavat osat sekä kunkin osan lataamiseen kuluneen ajan.

Yksittäistä sivua avattaessa tehdään jokaista resurssia (kuva, tyylitiedosto, skripti) varten erillinen pyyntö. Esimerkiksi <a href="https://www.hs.fi" target="_blank">Helsingin sanomien</a> verkkosivua avattaessa tehdään hyvin monta pyyntöä.

<img src="../img/google-devtools-hs-fi.png" alt="Kuvakaappaus Google Dev Toolsista."/>

</text-box>

<quiz id="74ee9e59-7fd3-5700-ac1f-a645b8ee4ba9"></quiz>


### HTTP-protokollan pyyntötavat

HTTP-protokolla määrittelee kahdeksan erillistä pyyntötapaa (Request method), joista eniten käytettyjä ovat `GET` ja `POST`. Pyyntötavat määrittelevät rajoitteita ja suosituksia viestin rakenteeseen ja niiden prosessointiin palvelinpäässä.


#### Tiedon hakeminen: GET

GET-pyyntötapaa käytetään esimerkiksi dokumenttien hakemiseen: kun kirjoitat osoitteen selaimen osoitekenttään ja painat enter, selain tekee GET-pyynnön. GET-pyynnöt eivät tarvitse otsaketietoja HTTP/1.1:n vaatiman Host-otsakkeen lisäksi. Mahdolliset kyselyparametrit lähetetään palvelimelle osana haettavaa osoitetta.


<pre>
GET /sivu.html?parametri=arvo HTTP/1.1
Host: palvelimen-osoite.net

</pre>


#### Tiedon lähettäminen: POST

POST-pyyntötapaa käytetään tiedon lähettämiseen. Käytännön ero POST- ja GET-kyselyn välillä on se, että POST-tyyppisillä pyynnoillä kyselyparametrit liitetään pyynnön runkoon. Rungon sisältö ja koko määritellään otsakeosiossa. POST-kyselyt mahdollistavat multimedian (kuvat, videot, musiikki, ...) lähettämisen palvelimelle.


<pre>
POST /sivu.html HTTP/1.1
Host: palvelimen-osoite.net
Content-Type: application/x-www-form-urlencoded
Content-Length: 14

parametri=arvo

</pre>


#### Muita pyyntötyyppejä

Selaimen ja palvelimen välisessä kommunikoinnissa GET- ja POST-tyyppiset pyynnöt ovat eniten käytettyjä. Sivun tai siihen liittyvän osan kuten kuvan hakeminen tapahtuu käytännössä aina GET-tyyppisellä pyynnöllä, ja tiedon lähettäminen esimerkiksi lomakkeen kautta POST-tyyppisellä pyynnöllä. HTTP-protokolla määrittelee muitakin pyyntötyyppejä, joita käytetään palvelinohjelmistojen toteuttamisessa. Oleellisimpia ovat:

- *OPTIONS* pyytää tietoja resurssiin liittyvistä vaihtoehdoista (esimerkiksi voidaanko resurssi poistaa, ...)
- *DELETE* pyytää resurssin poistamista
- *HEAD* haluaa resurssiin liittyvät otsaketiedot, mutta ei resurssia

<quiz id="432a44f8-fb07-50d9-b706-60b74093222d"></quiz>

<text-box variant='hint' name='HTTP/2 ja HTTP/3'>

Web-sivustot sisältävät tyypillisesti useita erilaisia asioita: kuvia, tyylitiedostoja, musiikkia, videokuvaa ja niin edelleen. Sivun hakeminen tapahtuu useamman pyynnön aikana, missä ensin haetaan HTML-sivu, missä on viitteet sivun resursseihin kuten kuviin. Tämän jälkeen selain hakee jokaisen sivun resurssin erikseen. HTTP-protokollassa jokaisen resurssin hakemista varten muodostetaan uusi yhteys.

HTTP-protokollasta on julkaistu versio <a href="https://en.wikipedia.org/wiki/HTTP/2" target="_blank">HTTP/2</a> (<a href="https://tools.ietf.org/html/rfc7540" target="_blank">RFC 7540</a>). Eräs uudistus protokollassa on palvelimelle jätetty mahdollisuus lähettää pyyntöön vastauksena useampia resursseja osana samaa vastausta. Tällöin yhteyden avaamiseen ja sulkemiseen käytetty aika vähenee ja web-sivustojen lataaminen mahdollisesti nopeutuu. HTTP/2 -protokolla sisältää muitakin parannuksia nykytilanteeseen -- suurin osa toiminnallisuudesta toteutetaan kuitenkin palvelinohjelmistoa pyörittävässä palvelimessa, eikä itse palvelinohjelmistossa.

<br/>

HTTP-protokollan <a href="https://en.wikipedia.org/wiki/HTTP/3" target="_blank">kolmas versio</a> on myös työn alla. Kolmas versio pyrkii parantamaan erityisesti dynaamisten verkkosivujen toimintaa, joissa selain ja palvelin lähettävät viestejä paljon keskenään. Siinä missä HTTP/1 ja HTTP/2 ovat toimineet TCP-protokollan yli (viestin perille saapuminen pyritään varmistamaan), HTTP/3 tulee todennäköisesti toimimaan mm. verkkopeleissä paljon käytetyn UDP-protokollan yli jolloin viestien perille saapumista ei erikseen tulla varmistamaan.

</text-box>


## HTML: Yhteinen dokumenttien esityskieli


HTML on rakenteellinen kuvauskieli, jolla voidaan esittää linkkejä sisältävää tekstiä sekä tekstin rakennetta. HTML koostuu elementeistä, jotka voivat olla sisäkkäin ja peräkkäin. Elementtejä käytetään ohjeina dokumentin jäsentämiseen ja käyttäjälle näyttämiseen. HTML-dokumenteissa elementit avataan elementin nimen sisältävällä pienempi kuin -merkillä `<` alkavalla ja suurempi kuin -merkkiin `>` loppuvalla merkkijonolla (`<elementin_nimi>`), ja suljetaan merkkijonolla jossa elementin pienempi kuin -merkin jälkeen on vinoviiva (`</elementin_nimi>`).

HTML-dokumentin rakennetta voi ajatella myös puuna. Juurisolmuna on elementti `<html>`, jonka lapsina ovat elementit `<head>` ja `<body>`.

Jos elementin sisällä ei ole muita elementtejä tai tekstisolmuja eli tekstiä, voi elementin yleensä avata ja sulkea samalla merkkijonolla: (`<elementin_nimi />`).

HTML:stä on useita erilaisia standardeja, joista viimeisin julkaistu versio löytyy osoitteesta <a href="https://www.w3.org/TR/html/" target="_blank">https://www.w3.org/TR/html/</a>.

<br/>


```html
<!DOCTYPE html>
<html lang="fi">
  <head>
    <meta charset="UTF-8" />
    <title>selainikkunassa näkyvä otsikko</title>
  </head>
  <body>
    <p>
      Tekstiä tekstielementin sisällä, tekstielementti
      runkoelementin sisällä, runkoelementti html-elementin
      sisällä. Elementin sisältö voidaan asettaa useammalle
      riville.
    </p>
  </body>
</html>
```


Ylläoleva HTML-dokumentti sisältää dokumentin tyypin ilmaisevan aloitustägin (`<!DOCTYPE html>`), dokumentin aloittavan html-elementin (`<html>`), otsake-elementin ja sivun otsikon (`<head>`, jonka sisällä `<title>`), sekä runkoelementin (`<body>`).

Elementit voivat sisältää attribuutteja ja attribuuteille voi antaa arvoja. Esimerkiksi ylläolevassa esimerkissä html-elementille on määritelty erillinen attribuutti *lang*, joka kertoo dokumentissa käytetystä kielestä.  Ylläolevan esimerkin otsakkeessa on myös metaelementti, jota käytetään lisävinkin antamiseen selaimelle: "dokumentissa käytetään UTF-8 merkistöä". Tämä kannattaa olla dokumenteissa aina.

Nykyaikaiset web-sivut sisältävät paljon muutakin kuin sarjan HTML-elementtejä. Linkitetyt resurssit, kuten kuvat ja tyylitiedostot, ovat oleellisia sivun ulkoasun ja rakenteen luomisessa. Selainpuolella suoritettavat skriptitiedostot, erityisesti Javascript, ovat luoneet huomattavan määrän syvyyttä nykyaikaiseen web-kokemukseen. Internet on kasvanut myös käsitteenä tällä sivulla tarkastellun perinteisen "1980"-luvun internetin jälkeen. Esimerkiksi <a href="https://fi.wikipedia.org/wiki/Esineiden_internet" target="_blank">esineiden internet</a> (Internet of Things) eli kaikkien laitteiden kytkeminen verkkoon tulee muokkaamaan koko käsitystämme internetistä.

<br/>
