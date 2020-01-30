---
path: '/osa-7/1-selainohjelmistot-ja-javascript'
title: 'Selainohjelmistot ja JavaScript'
hidden: false
---


<text-box variant='learningObjectives' name='Oppimistavoitteet'>

- Tutustut JavaScriptiin.
- Osaat toteuttaa napin painallukseen reagoivan JavaScript-sovelluksen.
- Osaat hakea JSON-muotoista tietoa palvelimelta JavaScriptillä.
- Osaat lähettää JSON-muotoista tietoa palvelimelle.

</text-box>

Olemme tähän mennessä tutustuneet pikaisesti sekä HTML:ään että CSS:ään. Siinä missä HTML on kieli rakenteen ja sisällön määrittelyyn ja CSS on kieli ulkoasun ja asettelun määrittelyyn, JavaScript on ohjelmointikieli, jolla voi määritellä sivuille dynaamista toiminnallisutta.

Tutustutaan tässä lyhyesti selainpuolen toiminnallisuuden toteuttamiseen JavaScriptillä.

<br/>

<text-box variant='hint' name='JavaScript-oppaita'>

JavaScriptin opetteluun löytyy paljon oppaita. Esimerkiksi W3Schoolsilla on hyvä [JavaScript-opas](https://www.w3schools.com/js/). Helsingin yliopistollakin on pidetty kurssia [Web-selainohjelmointi](https://web-selainohjelmointi.github.io/), jonka materiaali on nyt jo tosin melko vanhentunutta.

Kurssin Web-palvelinohjelmointi Java jälkeen kannattaa harkita kurssia [Full Stack Open](https://fullstackopen.com/), jossa opit JavaScriptillä tapahtuvaa web-sovelluskehitystä.

</text-box>


## JavaScriptin tuominen projektiin

JavaScript-koodin voi tuoda projektiin kirjoittamalla koodin suoraan sivulle tai lataamalla koodin erillisestä tiedostosta. Koodin kirjoittaminen suoraan sivulle tapahtuu lisäämällä koodi `script`-elementin sisään.

Alla olevassa esimerkissä määritellään sivu, jonka lataaminen näyttää käyttäjälle "hei maailma"-tekstin sisältävän ponnahdusikkunan.


```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8"/>
        <title>Otsikko</title>
    </head>
    <body>
        <script>
            alert("hei maailma")
        </script>
    </body>
</html>
```

Lähdekoodin voi myös ladata erillisestä tiedostosta. Tällöinkin käytetään `script`-elementtiä, mutta elementille määritellään `src`-attribuutti, jonka arvo kertoo lähdekooditiedoston sijainnin.

Spring-projekteissa JavaScript-tiedostot lisätään usein kansion `src/main/resources/public/javascript/` alle. JavaScript-tiedoston pääte on `.js`. Kansiossa `public` olevat tiedostot siirtyvät suoraan näkyville web-maailmaan, joten niitä ei tarvitse käsitellä erikseen esimerkiksi Thymeleaf-moottorin toimesta.

Jos lähdekoodi on kansiossa `javascript` olevassa tiedostossa `code.js`, käytetään `script`-elementtiä seuraavasti: `<script th:src="@{/javascript/code.js}"></script>`.

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8"/>
        <title>Otsikko</title>
    </head>
    <body>
        <script th:src="@{/javascript/code.js}"></script>
    </body>
</html>
```

Elementin `script` attribuutti `th:src` kertoo Thymeleafille, että lähdekooditiedoston sijanti tulee suhteuttaa sovelluksen sijaintiin. Näin sovellus voi sijaita myös muualla kuin palvelimen juuriosoitteessa.

Yleinen käytänne JavaScript-lähdekoodien sivulle lisäämiseen on lisätä ne sivun loppuun juuri ennen `body`-elementin sulkemista. Tämä johtuu siitä, että selain hakee JavaScript-tiedoston sisällön kun selain kohtaa tiedoston määrittelyn HTML-dokumentissa. Tällöin muut toiminnot voivat joutua odottamaan tiedoston latausta ja koodin suorittamista.

Mikäli lähdekooditiedosto ladataan vasta sivun lopussa, käyttäjälle näytetään sivun sisältöä jo ennen JavaScript-lähdekoodin latautumista, sillä selaimet usein näyttävät sivua käyttäjälle sitä mukaa kun se latautuu. Tällä voidaan luoda tunne nopeammin reagoivista ja latautuvista sivuista.

<text-box variant='hint' name='Määre defer siirtää lataamisen sivun loppuun'>

Nykyään `script`-elementille voi lisätä määreen `defer`, jonka olemassaolo kertoo että elementin `src`-attribuutin määrittelemän tiedoston sisältö tulee suorittaa vasta kun html-sivu on ladattu ja käsitelty.

```html
<script th:src="@{/javascript/code.js}" defer></script>
```

[Lisätietoa määreestä täältä](https://www.w3schools.com/tags/att_script_defer.asp).

</text-box>


### Funktiot

JavaScriptissä funktiot määritellään avainsanalla `function`, jota seuraa funktion nimi, sulut ja sulkujen sisään mahdollisesti määriteltävät parametrit. Funktion runko aloitetaan ja lopetetaan aaltosuluilla. Alla on määriteltynä funktio `sayHello`, jonka kutsuminen näyttää käyttäjälle ponnahdusikkunan, joka sisältää tekstin "hello there".

```javascript
function sayHello() {
    alert("hello there")
}
```

JavaScript on dynaamisesti tyypitetty kieli, eli parametrien (ja muuttujien) tyyppi päätellään ajonaikaisesti. Parametreja määriteltäessä ei siis kerrota niiden tyyppiä. Alla määritellään funktio `sayHelloTo`, jolle annetaan parametrina tervehdittävän henkilön nimi. Merkkijonojen yhdistäminen toimii JavaScriptissä samalla tavalla kuin Javassa eli `+`-merkillä.

```javascript
function sayHelloTo(name) {
    alert("hello " + name)
}
```

Kuten huomaat, puolipisteiden käyttö lausekkeen tai rivin jälkeen ei ole pakollista. Puolipisteitä saa kuitenkin käyttää mikäli haluaa.


### Tapahtumien kuuntelu

HTML-elementeille voi määritellä tapahtumienkäsittelijöitä. Elementin attribuutille `onclick` voidaan antaa parametrina elementin klikkauksen yhteydessä suoritettavan funktion kutsu.

Alla olevassa esimerkissä oletetaan, että tiedostossa `code.js` on aiemmin määritelty funktio `sayHelloTo`. Esimerkissä lisätään nappiin (`button`-elementti) tapahtumankuuntelija -- kun nappia klikataan, suoritetaan funktiokutsu `sayHelloTo('tyyppi')`.

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" >
        <title>Otsikko</title>
    </head>
    <body>

        <button onclick="sayHelloTo('tyyppi')">Paina tästä</button>
        <script th:src="@{javascript/code.js}" defer></script>
    </body>
</html>
```

Esimerkki on alla tarkasteltavana. JSFiddle-palvelussa HTML-koodissa ei erikseen näy JavaScript-koodin käyttöönottoa.

<iframe width="100%" height="150" src="https://jsfiddle.net/m8k7v6ey/embedded/result,js,html" allowfullscreen="allowfullscreen" frameborder="0"></iframe>


### Muuttujat ja funktioiden parametrit

JavaScriptissä muuttuja määritellään avainsanalla `var`, jota seuraa muuttujan nimi sekä arvon asettaminen. Muuttujat ovat JavaScriptissä dynaamisesti tyypitettyjä, joten muuttujien tyypiä ei määritellä erikseen -- muuttujan tyyppi päätellään ajonaikaisesti. Alla esitellään kaksi muuttujaa, joista ensimmäisen arvoksi asetetaan luku ja toisen arvoksi asetetaan merkkijono.

```javascript
var luku = 3
var merkkijono = "heippa"
```

JavaScriptissä puolipisteiden käyttö on mahdollista. Yllä niitä ei ole käytetty, mutta ohjelman voisi halutessaan kirjoittaa myös seuraavalla tavalla.

```javascript
var luku = 3;
var merkkijono = "heippa";
```

Kuten kaikkien muuttujien arvojen tyypit, myös funktioiden parametrien arvojen tyypit ovat dynaamisia. Aiemmin määriteltyä funktiota `sayHelloTo` voi kutsua antamalla funktiolle parametrina minkä tahansa muuttujan.

```javascript
var luku = 3
var merkkijono = "heippa"

sayHelloTo(luku)
sayHelloTo(heippa)
```

Yllä oleva ohjelma näyttäisi käyttäjälle ensin ponnahdusikkunan, joka sisältää tekstin "hello 3". Tämän jälkeen näytetään ponnahdusikkuma, joka sisältää tekstin "hello heippa".



<text-box variant='hint' name='JavaScriptin kehitys'>

JavaScript on kehittynyt vuosien saatossa yksittäisten selaimia kehittävien yritysten omia ominaisuuksia tarjoavasta skriptikielestä ohjelmointikieleksi, jota selaimet pyrkivät nykyään yhdessä tukemaan. JavaScriptille löytyy nykyään kirjastoja, joiden avulla muuttujien tyypit voidaan määrätä -- tämän lisäksi myös muut JavaScriptistä inspiraatiota saaneet sekä JavaScriptiksi käännettävissä olevat kielet, kuten [TypeScript](https://en.wikipedia.org/wiki/TypeScript), tarjovat mahdollisuuden muuttujien tyypitykseen.

Tässä materiaalissa raapaistaan JavaScriptiä hyvin pintapuolisesti ja merkittävä osa sen ominaisuuksista jää käsittelemättä. Voidaan oikeastaan jopa todeta, että tässä materiaalissa ei raapaista JavaScriptiä lähes lainkaan, sillä JavaScript on kirjastoineen nykyään niin laajasti käytössä. Tämän kurssin puitteissa materiaalissa esitetty sekä tarvittaessa hakukoneita käyttämällä löytyvä tieto on kuitenkin riittävää.

</text-box>


### Elementtien sisällön hakeminen ja muokkaaminen

Sivulla oleviin elementteihin pääsee käsiksi komennolla `document.getElementById("tunnus")` eli "anna dokumentista se elementti, jonka id:n arvo on 'tunnus'". Tässä `document` viittaa sivua kuvaavaan Document Object Modeliin, eli DOMiin, joka sisältää sekä tiedon sivun rakenteesta että mahdollisuudet sen muokkaamiseen.

Tarkastellaan seuraavaa HTML-dokumenttia, jossa on tekstikenttä ja nappi.

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" >
        <title>Otsikko</title>
    </head>
    <body>
        <input type="text" id="tekstikentta"/>
        <script th:src="@{javascript/code.js}" defer></script>
    </body>
</html>
```

Mikäli haluamme päästä käsiksi elementtiin, jonka tunnus on "tekstikentta", käytämme komentoa `document.getElementById("tekstikentta")`. Syötteitä sisältävien elementtien kuten `input` arvo (eli teksti) määritellään attribuutilla `value`.

Luodaan funktio, joka asettaa tekstikenttään uuden arvon -- tämä tapahtuu `value`-attribuutin arvoa muokkaamalla.

```javascript
function asetaArvo() {
    document.getElementById("tekstikentta").value = "Heippa!"
}
```

Kun yllä oleva funktio `asetaArvo`on määritelty, sivulle voi luoda napin, jonka painaminen kutsuu yllä määriteltyä funktiota.

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" >
        <title>Otsikko</title>
    </head>
    <body>
        <input type="text" id="tekstikentta"/>
        <button onclick="asetaArvo()">Paina tästä</button>
        <script th:src="@{javascript/code.js}" defer></script>
    </body>
</html>
```

Napin painaminen asettaa tekstikentän arvoksi tekstin "Heippa!". Alla sama esitettynä JSFiddlessä.


<iframe width="100%" height="200" src="//jsfiddle.net/dq8yj9t0/embedded/result,js,html/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>


Tekstikentän arvon voi tulostaa tai sen voi asettaa vaikkapa muuttujan arvoksi. Alla olevassa esimerkissä haetaan tekstikentän arvo, joka näytetään käyttäjälle ponnahdusikkunassa.


<iframe width="100%" height="200" src="//jsfiddle.net/5yma9kw2/embedded/result,js,html/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>


Ohjelmassa voidaan käsitellä luonnollisesti useampia tekstikenttiä sekä muita elementtejä. Alla olevassa esimerkissä dokumentissa on kaksi tekstikenttää, joiden arvot vaihdetaan päittäin nappia painettaessa.


<iframe width="100%" height="200" src="//jsfiddle.net/rL8ovwq9/embedded/result,js,html/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>


### Arvon asettaminen osaksi tekstiä

Tekstikentän arvo asetetaan `value`-attribuutin arvoa muokkaamalla. Kaikilla elementeillä ei kuitenkaan ole `value`-attribuuttia, vaan joillain näytetään niiden elementin *sisällä* oleva arvo tai.

Elementin sisälle asetetaan arvo muuttujaan liittyvällä attribuutilla `innerHTML`.

Alla olevassa esimerkissä sivulla on tekstielementti `p`, jossa ei ole lainkaan sisältöä. Jos käyttäjä syöttää tekstikenttään tekstiä ja painaa nappia, asetetaan tekstikentässä oleva teksti tekstielementin arvoksi.

<iframe width="100%" height="200" src="//jsfiddle.net/03gm9fjv/embedded/result,js,html/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

Myös tekstielementin sisälle voi asettaa arvoja. Tämä onnistuu näppärästi `span`-elementin avulla.

<iframe width="100%" height="200" src="//jsfiddle.net/ryf3zetx/embedded/result,js,html/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>


### Esimerkki: Laskin

Luodaan laskin. Laskimella on kaksi toiminnallisuutta: pluslasku ja kertolasku. Luodaan ensin laskimelle JavaScriptkoodi, joka on tiedostossa `laskin.js`. JavaScript-koodissa oletetaan, että on olemassa `input`-tyyppiset elementit tunnuksilla "eka" ja "toka" sekä `span`-tyyppinen elementti tunnuksella "tulos". Funktiossa `plus` haetaan elementtien "eka" ja "toka" arvot, ja asetetaan pluslaskun summa elementin "tulos" arvoksi. Kertolaskussa tehdään lähes sama, mutta tulokseen asetetaan kertolaskun tulos. Koodissa on myös apufunktio, jota käytetään sekä arvojen hakemiseen annetuilla tunnuksilla merkityistä kentistä että näiden haettujen arvojen muuttamiseen numeroiksi.


```javascript
function haeNumero(tunnus) {
    return parseInt(document.getElementById(tunnus).value)
}

function asetaTulos(tulos) {
    document.getElementById("tulos").innerHTML = tulos
}

function plus() {
    asetaTulos(haeNumero("eka") + haeNumero("toka"))
}

function kerto() {
    asetaTulos(haeNumero("eka") * haeNumero("toka"))
}
```

Laskimen käyttämä HTML-dokumentti näyttää seuraavalta:


```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" >
        <title>Laskin</title>
    </head>
    <body>
        <header>
            <h1>Plus- ja Kertolaskin</h1>
        </header>

        <section>
            <p>
                <input type="text" id="eka" value="0" />
                <input type="text" id="toka" value="0" />
            </p>

            <p>
                <input type="button" value="+" onclick="plus()" />
                <input type="button" value="*" onclick="kerto()" />
            </p>


            <p>Laskimen antama vastaus: <span id="tulos"></span></p>
        </section>

        <script src="javascript/laskin.js"></script>
    </body>
</html>
```


Kokonaisuudessaan laskin näyttää seuraavalta:


<iframe width="100%" height="400" src="//jsfiddle.net/0evta6x9/embedded/result,js,html/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>


<programming-exercise name='Calculator' tmcname='osa07-Osa07_01.Calculator'>

Tehtäväpohjassa on valmiina edellisen esimerkin plus- ja kertotoiminnallisuuden tarjoava laskin. Täydennä laskinta siten, että siinä on aiemman toiminnallisuuden lisäksi mahdollisuus miinus- ja jakolaskutoiminnallisuuteen.

Älä muokkaa palvelinpuolen toiminnallisuutta vaan keskity selainpuoleen. Varmista myös, että sivu on käytettävä ilman erillistä ohjetekstiä, eli että käyttämäsi napit ja tekstit kertovat käyttäjälle kaiken oleellisen.

Tehtävään ei ole TMC:ssä testejä. Palauta tehtävä palvelimelle kun laskimessa toimii plus- ja kertotoiminnallisuuden lisäksi myös miinus- ja jakolaskutoiminnallisuus.

</programming-exercise>


### Elementtien valinta ja kokoelmat


Käytämme `getElementById`-kutsua tietyn elementin hakemiseen. Tässä oletetaan, että id on aina uniikki, eli kahdella elementillä ei ole samaa id-attribuutin arvoa. Mikäli ohjelmoija haluaa hakea useamman elementin samalla kutsulla, löytyy siihenkin välineet. Kaikki sivun elementit voi hakea esimerkiksi `getElementsByTagName("*")`-kutsulla, joka palauttaisi kaikki sivun elementit. Tämä on kuitenkin hieman kömpelö.

W3C DOM-määrittely sisältää myös ohjelmointirajapinnan elementtien läpikäyntiin. [Selectors API](https://www.w3.org/TR/selectors-api/) sisältää mm. `querySelector`-kutsun, joka tarjoaa kyselytoiminnallisuuden elementtien hakemiseen -- toiminnallisuus muistuttaa.

Selector APIn tarjoamien `querySelector` (yksittäisen osuman haku) ja `querySelectorAll` (kaikkien osumien haku) -komentojen avulla kyselyn rajoittaminen vain esimerkiksi `nav`-elementissä oleviin `a`-elementteihin on helppoa.

```javascript
var linkit = document.querySelectorAll("nav a")
// linkit-muuttuja sisältää nyt kaikki
// a-elementit, jotka ovat nav-elementin sisällä
```

Vastaavasti `header`-elementin sisällä olevat linkit voi hakea seuraavanlaisella kyselyllä.


```javascript
var linkit = document.querySelectorAll("header a")
// linkit-muuttuja sisältää nyt kaikki
// a-elementit, jotka ovat header-elementin sisällä
```

Yllä `linkit` on kokoelma tietoa. Kokoelmien läpikäynti onnistuu perinteisellä `for`-toistolauseella. JavaScriptissä sen muoto on seuraava.

```javascript
var linkit = document.querySelectorAll("header a")
// linkit-muuttuja sisältää nyt kaikki
// a-elementit, jotka ovat header-elementin sisällä

for (var i = 0; i < linkit.length; i++) {
    alert(i + ": " + linkit[i]);
}
```

Yllä oleva näyttää kullekin linkille ponnahdusikkunan. Ponnahdusikkunassa on linkin indeksi kokoelmassa sekä linkkiin liittyvän elementin tiedot.



### Elementtien lisääminen

HTML-dokumenttiin lisätään uusia elementtejä `document`-olion `createElement`-metodilla. Alla luodaan `p`-elementti sekä siihen liitettävä tekstisolmu (kutsu `createTextNode`), joka asetetaan tekstielementin lapseksi.

```javascript
var tekstiElementti = document.createElement("p")
var tekstiSolmu = document.createTextNode("o-hai")

tekstiElementti.appendChild(tekstiSolmu)
```

Ylläoleva esimerkki ei luonnollisesti muuta HTML-dokumentin rakennetta sillä uutta elementtiä ei lisätä osaksi HTML-dokumenttia. Olemassaoleviin elementteihin voidaan lisätä sisältöä elementin `appendChild`-metodilla. Alla olevan tekstialue sisältää `article`-elementin, jonka tunnus on `osio`. Voimme lisätä siihen elementtejä elementin `appendChild`-metodilla.


```javascript
var tekstiElementti = document.createElement("p")
var tekstiSolmu = document.createTextNode("o-noes!")

tekstiElementti.appendChild(tekstiSolmu)

var alue = document.getElementById("osio")
alue.appendChild(tekstiElementti)
```


Artikkelielementin sekä sen sisältämien tekstielementtien lisääminen onnistuu vastaavasti. Alla olevassa esimerkissä käytössämme on seuraavanlainen `section`-elementti.


```html
<!-- .. dokumentin alkuosa .. -->
<section id="osio"></section>
<!-- .. dokumentin loppuosa .. -->
```

Uusien artikkelien lisääminen onnistuu helposti aiemmin näkemällämme `createElement`-metodilla.

```javascript
var artikkeli = document.createElement("article")

var teksti1 = document.createElement("p")
teksti1.appendChild(document.createTextNode("Lorem ipsum... 1"))
artikkeli.appendChild(teksti1)

var teksti2 = document.createElement("p")
teksti2.appendChild(document.createTextNode("Lorem ipsum... 2"))
artikkeli.appendChild(teksti2)

document.getElementById("osio").appendChild(artikkeli)
```

Alla olevassa esimerkissä napin painaminen johtaa uuden elementin lisäämiseen. Mukana on myös laskuri, joka pitää kirjaa elementtien lukumäärästä.


<iframe width="100%" height="300" src="//jsfiddle.net/d3gpqho6/embedded/result,js,html/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>


### Kommunikointi palvelimen kanssa


Kommunikointin palvelimen kanssa tapahtuu JavaScriptin [XMLHttpRequest](https://www.w3schools.com/js/js_ajax_http.asp)-olion avulla. Oliolla on kaksi tärkeää metodia:

- `open`, jolle määritellään pyynnön tyyppi (GET/POST) ja pyynnön osoite.

- `send`, jota käytetään parametrittomana `GET`-pyynnön yhteydessä -- `POST`-pyynnön yhteydessä metodille annetaan parametrina palvelimelle lähetettävä data.

Tämän lisäksi olion muuttujaan `onreadystatechange` määritellään funktio, jolla käsitellään palvelimelta saatu data. Funktiossa tarkastellaan pyynnön tilakoodia `readyState` sekä HTTP-statuskoodia `status` -- mikäli ensimmäisen arvo on 4 ja toisen arvo on 200, on pyyntö onnistunut ja vastausta voi halutessaan käyttää.

Alla olevassa esimerkissä esitellään JSON-muotoista dataa tuottavan verkkopalvelun käyttöä. JavaScript-koodissa määritellään osoite, XMLHttpRequest-olio ja olioon liittyvä palvelimelta saadun tiedon käsittelevä funktio. Funktiossa käytetään JavaScriptin valmista `JSON.parse`-funktiota tekstimuotoisen JSON-vastauksen olioksi muuntamiseen. Tämän jälkeen dokumenttiin asetetaan palvelimelta saatu arvo.

Itse napin painamiseen liittyvä toiminnallisuus on suoraviivainen. Nappia painettaessa kutsutaan funktiota, jossa tehdään GET-tyyppinen asynkroninen pyyntö annettuun osoitteeseen.

<iframe width="100%" height="400" src="//jsfiddle.net/txwduzg5/embedded/result,js,html/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>


<text-box variant='hint' name='JSON merkkijonoksi ja takaisin'>

JSON-olioiden muunto merkkijonoksi ja takaisin onnistuu JavaScriptin valmiiden välineiden avulla. Alla olevassa esimerkissä luodaan JavaScript-olio, näytetään siihen liittyvä arvo, ja muunnetaan olio merkkijonoksi. Tämän jälkeen olio muunnetaan takaisin merkkijonosta olioksi.

```java
var olio = {nimi: "Arvo", tieto: 2000}
alert(olio.nimi)

var mjono = JSON.stringify(olio)
olio = JSON.parse(mjono)
```

</text-box>


Mikäli Spring-sovelluksissa haluaa tehdä pyyntöjä palvelimelle, tulee palvelimen osoitteen mahdollinen muuttuminen huomioida pyynnöissä. Tämä onnistuu luomalla sovelluksen osoitetta kuvaava muuttuja, jonka arvon asettaminen annetaan Thymeleafin vastuulle. Esimerkki alla.

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:th="http://www.thymeleaf.org">
    <head>
        <title>Otsikko</title>
    </head>
    <body>
        <!-- content -->
        <script th:inline="javascript"> var contextRoot = /*[[@{/}]]*/ '';</script>
        <script th:src="@{/javascript/code.js}" defer></script>
    </body>
</html>
```

Nyt lähdekooditiedostossa `code.js` voidaan käyttää muuttujaan `contextRoot` asetettua arvoa osoitteen määrittelyssä.

```javascript
var url = contextRoot + "path/to/random"
```

<text-box variant='hint' name='Selaimen välimuisti'>

Olemme aiemmin määritelleet sovelluksemme kehityskonfiguraatioon asetukset, joilla Spring ei tallenna resursseja välimuistiin. Konfiguraatio on ollut seuraava.

```
spring.thymeleaf.prefix=file:src/main/resources/templates/
spring.thymeleaf.cache=false

spring.resources.static-locations=file:src/main/resources/public/
spring.resources.cache.period=0
```

Edellinen konfiguraatio ei kuitenkaan estä selainta tallentamasta sen hakemia resursseja välimuistiin. Sovelluksen kehitysvaiheessa Google Chromessa kannattaa kytkeä välimuistin käyttö pois päältä.

Välimuistin pois päältä laittaminen onnistuu Chromen DevToolsin asetuksista (Settings) nimellä "Disable cache (while DevTools is open)".

</text-box>


<programming-exercise name='Books' tmcname='osa07-Osa07_02.Books'>

Tehtäväpohjassa on sovellus, joka tarjoaa mahdollisuuden kirjojen lisäämiseen lomakkeen avulla sekä kontrollerimetodin satunnaisen kirjan tietojen hakemiseen JSON-muodossa.

Toteuta sovelluksessa olevaan `books.js`-tiedostoon toiminnallisuus, jonka avulla palvelimelta haetaan satunnaisen kirjan tiedot. Kirjan tiedot tulee hakea kun `books.html`-sivulla olevaa nappia painetaan -- kirjan tiedot tulee asettaa `books.html`-sivulla olevaan tauluun.

Tehtävässä ei ole testejä. Palauta tehtävä kun se toimii halutulla tavalla.

</programming-exercise>

Vastaavasti JSON-muotoisen datan lähettäminen onnistuu liittämällä JSON-muotoinen data `send`-metodin parametriksi. Alla olevassa esimerkissä lähetetään JSON-muotoista tietoa [JSONPlaceholder](https://jsonplaceholder.typicode.com/)-palvelulle.



<iframe width="100%" height="400" src="//jsfiddle.net/m17gc9e3/embedded/result,js,html/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>



<text-box variant='hint' name='Fetch API'>

Uudemmissa JavaScriptin versioissa on myös palvelimelle tehtäviä kyselyitä suoraviivaista Fetch API. Tästä lisää osoitteessa [https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

</text-box>


<programming-exercise name='Tasks' tmcname='osa07-Osa07_03.Tasks'>

Tehtävään on hahmoteltu tehtävien hallintaan tarkoitetun sovelluksen palvelinpuolen toiminnallisuutta. Lisää sovellukseen selainpuolen toiminnallisuus, joka mahdollistaa (1) tehtävien listaamisen sivulla JavaScriptin avulla ja (2) tehtävien lisäämisen JavaScriptin avulla.

Kummatkin (listaaminen ja lisääminen) tulee siis toteuttaa JavaScriptin avulla.

Sovellukselle ei ole automaattisia testejä.

</programming-exercise>


## CORS: Rajoitettu pääsy resursseihin

Palvelinohjelmiston tarjoamiin tietoihin kuten kuviin ja videoihin pääsee käsiksi lähes mistä tahansa palvelusta. Palvelinohjelmiston toiminnallisuus voi rakentua toisen palvelun päälle. On myös mahdollista toteuttaa sovelluksia siten, että ne koostuvat pääosin selainpuolen kirjastoista, jotka hakevat tietoa palvelimilta.

Selainpuolella JavaScriptin avulla tehdyt pyynnöt ovat oletuksena rajoitettuja. Jos palvelimelle ei määritellä erillistä [CORS](https://docs.spring.io/spring/docs/current/spring-framework-reference/web.html#mvc-cors)-tukea, eivät sovelluksen osoitteen ulkopuolelta tehdyt JavaScript pyynnöt onnistu ellei niitä erikseen salli.

Palvelinohjelmistot määrittelevät voiko niihin tehdä pyyntöjä myös palvelimen osoitteen ulkopuolelta ("Cross-Origin Resource Sharing"-tuki). Yksinkertaisimmillaan CORS-tuen saa lisättyä palvelinohjelmistoon lisäämällä kontrollerimetodille annotaatio `@CrossOrigin`. Annotaatiolle määritellään osoitteet, joissa sijaitsevista osoitteista pyyntöjä saa tehdä.


```java
@CrossOrigin(origins = "/**")
@GetMapping("/books")
@ResponseBody
public List<Book> getBooks() {
    return bookRepository.findAll();
}
```

Koko sovelluksen tasolla vastaavan määrittelyn voi tehdä erillisen konfiguraatiotiedoston avulla.

```java
@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**");
    }
}
```

