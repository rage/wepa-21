---
path: '/osa-6/1-toistuvat-rakenteet-html-sivuilla'
title: 'Toistuvat rakenteet HTML-sivuilla'
hidden: false
---

<text-box variant='learningObjectives' name='Oppimistavoitteet'>

- Osaat määritellä uudelleenkäytettäviä sivurakenteita.
- Osaat määritellä sivurakenteisiin parametreja.
- Osaat käyttää sivurakenteita sovelluksissasi.

</text-box>


Toteuttamamme ja käytössämme olleet HTML-sivut ovat kaikki noudattaneet samaa rakennetta. Sivuilla on jonkinlainen otsaketieto, ehkä jonkinlainen valikko tai kaksi, sekä konkreettinen polkuun liittyvä sisältö. Sovellusten sivut ovat melko samankaltaisia -- esimerkiksi palvelimelta saatujen tietojen listaamiseen käytetty sivu voi olla seuraava.

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org">
    <head lang="en">
        <meta charset="UTF-8" />
        <title>Otsikko</title>
    </head>
    <body>
        <h1>Otsikko</h1>

        <ul>
            <li th:each="arvo : ${arvot}" th:text="${arvo}"></li>
        </ul>

        <ul>
            <li><a th:href="@{/polku1}">Linkki 1</li>
            <li><a th:href="@{/polku2}">Linkki 2</li>
            <li><a th:href="@{/polku3}">Linkki 3</li>
            <li><a th:href="@{/polku4}">Linkki 4</li>
        </ul>
    </body>
</html>
```

Kun taas vaikkapa lomakkeen sisältävä sivu voi olla seuraava.


```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org">
    <head lang="en">
        <meta charset="UTF-8" />
        <title>Otsikko</title>
    </head>
    <body>
        <h1>Otsikko</h1>

        <form th:action="@{/polku}" method="POST">
            <input type="text" name="arvo"/>
            <input type="submit" value="Lisää!"/>
        </form>

        <ul>
            <li><a th:href="@{/polku1}">Linkki 1</li>
            <li><a th:href="@{/polku2}">Linkki 2</li>
            <li><a th:href="@{/polku3}">Linkki 3</li>
            <li><a th:href="@{/polku4}">Linkki 4</li>
        </ul>
    </body>
</html>
```

Kun tarkastelemme sivuja, niissä on paljon toisteisutta. Vain konkreettinen polkuun liittyvä sisältö vaihtelee sivujen välillä.

Hieman laajempia sovelluksia rakennettaessa HTML-sivuja on useita. Tällöin jokaiselle sivulle kopioidaan sama sisältö, jota muokataan tarpeeseen sopivaksi. Tilanne ei ole missään nimessä ideaali -- jos sivujen välillä toistuvaa sisältöä kuten vaikkapa otsikkoa tai valikkoa haluaa muuttaa, tulee jokaista HTML-sivua muokata erikseen.

Tarkastellaan seuraavaksi menetelmiä toistuvien rakenteiden uusiokäyttöön.


## Näkymäpalasten määrittely ja käyttö

Näkymäpalaset tai fragmentit ovat uudelleenkäytettäviä sivun osia. Niiden määrittely tapahtuu HTML-elementtiin lisättävällä `th:fragment`-attribuutilla, jolle annetaan arvona fragmentin nimi. Elementin, johon `th:fragment`-attribuutti on määritelty, sisältö on uudelleenkäytettävissä muilla sivuilla.

Tarkastellaan tätä esimerkin kautta. Luodaan edellä kuvatusta linkkilistasta oma fragmentti.

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org">
    <head lang="en">
        <meta charset="UTF-8" />
        <title>Layout</title>
    </head>
    <body>
        <div th:fragment="links">
            <ul>
                <li><a th:href="@{/polku1}">Linkki 1</li>
                <li><a th:href="@{/polku2}">Linkki 2</li>
                <li><a th:href="@{/polku3}">Linkki 3</li>
                <li><a th:href="@{/polku4}">Linkki 4</li>
            </ul>
        </div>
    </body>
</html>
```

Yllä olevassa HTML-tiedostossa on määritelty fragmentti `links`, jonka voi tuoda muiden sivujen käyttöön. Fragmentteja sisältävät sivut pidetään tyypillisesti `templates`-kansion alla olevassa erillisessä `fragments`-kansiossa. Oletetaan, että yllä olevan sivun nimi on `layout.html` ja että sijaitsee `templates`-kansion alla olevassa `fragments`-kansiossa.

Ylläolevan sivun `<div th:fragment="links">`-elementin sisällön saa vaihdettua sisällön käyttöön ottavalle sivulle määriteltävällä attribuutilla `th:replace`. Attribuutille `th:replace` annetaan arvona sekä fragmentit sisältävän kansion nimi, fragmentit sisältävän tiedoston nimi sekä fragmentin nimi. Arvo annetaan muodossa `kansio/tiedosto :: fragmentti`, eli esimerkiksi `fragments/layout :: links`.


<text-box variant='hint' name='Thymeleaf ja sivujen pitäminen välimuistissa'>

Thymeleaf lataa sivujen osat välimuistiin, jolloin niiden käyttö on nopeampaa. Tämä voi tehdä sivujen kehittämisestä tuskaista, sillä sivuihin tehtävät muutokset eivät automaattisesti päivity välimuistiin.

Sovelluksen kehitykseen käytettävässä profiilissa kannattaa kytkeä välimuisti pois päältä. Tämä tapahtuu lisäämällä seuraavat rivit kehityskäytössä olevaan konfiguraatiotiedostoon.

```

spring.thymeleaf.prefix=file:src/main/resources/templates/
spring.thymeleaf.cache=false

spring.resources.static-locations=file:src/main/resources/public/
spring.resources.cache.period=0
```

</text-box>


Alla olevalle sivulle tuotaisiin käyttöön `templates`-kansion alla olevassa kansiossa `fragments` olevan sivun `layout.html` fragmentti `links`.


```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org">
    <head lang="en">
        <meta charset="UTF-8" />
        <title>Otsikko</title>
    </head>
    <body>
        <h1>Otsikko</h1>

        <ul>
            <li th:each="arvo : ${arvot}" th:text="${arvo}"></li>
        </ul>

        <div th:replace="fragments/layout :: links"></div>
    </body>
</html>
```

Yllä kuvattu sivu näyttäisi käyttäjälle lopulta seuraavalta -- alla oletetaan, että `arvot` listassa on arvot `1`, `2` ja `3`.

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org">
    <head lang="en">
        <meta charset="UTF-8" />
        <title>Otsikko</title>
    </head>
    <body>
        <h1>Otsikko</h1>

        <ul>
            <li>1</li>
            <li>2</li>
            <li>3</li>
        </ul>

        <div>
            <ul>
                <li><a href="/polku1">Linkki 1</li>
                <li><a href="/polku2">Linkki 2</li>
                <li><a href="/polku3">Linkki 3</li>
                <li><a href="/polku4">Linkki 4</li>
            </ul>
        </div>
    </body>
</html>
```

Yksittäinen tiedosto voi sisältää myös useampia fragmentteja, joista sivun voi koostaa. Alla olevassa esimerkissä linkit sisältävään `layout.html`-tiedostoon on lisätty myös otsake.


```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org">
    <head lang="en">
        <meta charset="UTF-8" />
        <title>Layout</title>
    </head>
    <body>
        <div th:fragment="header">
            <h1>Otsikko</h1>
        </div>

        <div th:fragment="links">
            <ul>
                <li><a th:href="@{/polku1}">Linkki 1</li>
                <li><a th:href="@{/polku2}">Linkki 2</li>
                <li><a th:href="@{/polku3}">Linkki 3</li>
                <li><a th:href="@{/polku4}">Linkki 4</li>
            </ul>
        </div>
    </body>
</html>
```

Nyt edellä kuvattu arvot listaava sivu on yhä yksinkertaisempi.


```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org">
    <head lang="en">
        <meta charset="UTF-8" />
        <title>Otsikko</title>
    </head>
    <body>
        <div th:replace="fragments/layout :: header"></div>

        <ul>
            <li th:each="arvo : ${arvot}" th:text="${arvo}"></li>
        </ul>

        <div th:replace="fragments/layout :: links"></div>
    </body>
</html>
```

## Semantiikkaa

Edellä käytimme fragmenttien "ympäröimiseen" `div`-elementtiä, jota käytetään HTML-sivulla alueen määrittelyyn. Sana `div` ei kuitenkaan kerro meille elementin todellisesta käyttötarkoituksesta. HTML:ssä on muutamia elementtejä, jotka toimivat samoin kuin `div`-elementti, mutta niiden nimet ovat selkeämpiä -- `header` kuvaa otsakealuetta, `main` kuvaa sivun pääsisältöaluetta, `section` ja `article` sivun osaa, ja `footer` sivun alalaitaa. Muutetaan sivumme ja fragmenttimme näitä elementtejä sopivasti käyttäviksi.


```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org">
    <head lang="en">
        <meta charset="UTF-8" />
        <title>Layout</title>
    </head>
    <body>
        <header th:fragment="header">
            <h1>Otsikko</h1>
        </header>

        <footer th:fragment="links">
            <ul>
                <li><a th:href="@{/polku1}">Linkki 1</li>
                <li><a th:href="@{/polku2}">Linkki 2</li>
                <li><a th:href="@{/polku3}">Linkki 3</li>
                <li><a th:href="@{/polku4}">Linkki 4</li>
            </ul>
        </footer>
    </body>
</html>
```

Kun käytämme edellisiä fragmentteja osana sivuamme, tulee lopulliseen käyttäjän näkemään sivuun elementtien todellisempaa tarkoitusta kuvaavat elementit. Esimerkiksi alla oleva sivu..

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org">
    <head lang="en">
        <meta charset="UTF-8" />
        <title>Otsikko</title>
    </head>
    <body>
        <div th:replace="fragments/layout :: header"></div>

        <main>
            <ul>
                <li th:each="arvo : ${arvot}" th:text="${arvo}"></li>
            </ul>
        </main>

        <div th:replace="fragments/layout :: links"></div>
    </body>
</html>
```
..näkyy käyttäjälle lopulta seuraavanlaisena. Tässä oletetaan taas, että `arvot` listassa on arvot `1`, `2` ja `3`.

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org">
    <head lang="en">
        <meta charset="UTF-8" />
        <title>Otsikko</title>
    </head>
    <body>
        <header>
            <h1>Otsikko</h1>
        </header>

        <main>
            <ul>
                <li>1</li>
                <li>2</li>
                <li>3</li>
            </ul>
        </main>

        <footer>
            <ul>
                <li><a href="/polku1">Linkki 1</li>
                <li><a href="/polku2">Linkki 2</li>
                <li><a href="/polku3">Linkki 3</li>
                <li><a href="/polku4">Linkki 4</li>
            </ul>
        </footer>
    </body>
</html>
```



Käytännössä minkä tahansa elementin voi määritellä fragmentiksi. Alla fragmentit sisältävässä tiedostossa myös otsikon ja sivun merkistötiedot sisältävä `head`-elementti on määritelty fragmentiksi.

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org">
    <head th:fragment="head" lang="en">
        <meta charset="UTF-8" />
        <title>Layout</title>
    </head>
    <body>
        <header th:fragment="header">
            <h1>Otsikko</h1>
        </header>

        <footer th:fragment="links">
            <ul>
                <li><a th:href="@{/polku1}">Linkki 1</li>
                <li><a th:href="@{/polku2}">Linkki 2</li>
                <li><a th:href="@{/polku3}">Linkki 3</li>
                <li><a th:href="@{/polku4}">Linkki 4</li>
            </ul>
        </footer>
    </body>
</html>
```

Alla olevassa sivussa vaihtuu nyt myös otsaketiedosto.


```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org">
    <head th:replace="fragments/layout :: head" lang="en">
        <meta charset="UTF-8" />
        <title>Otsikko</title>
    </head>
    <body>
        <div th:replace="fragments/layout :: header"></div>

        <main>
            <ul>
                <li th:each="arvo : ${arvot}" th:text="${arvo}"></li>
            </ul>
        </main>

        <div th:replace="fragments/layout :: links"></div>
    </body>
</html>
```


<programming-exercise name='Hello Fragments' tmcname='osa06-Osa06_01.HelloFragments'>

Tehtäväpohjassa on sovellus, joka käyttää kolmea Thymeleaf-tiedostoa (`index.html`, `list.html`, `form.html`). Tarkastele näitä tiedostoja, tunnista niiden yhteiset osat ja tee sovellukseen fragmenttitiedosto, joka sisältää sivujen toistuvat osat.

Muokkaa tämän jälkeen Thymeleaf-tiedostoja siten, että ne käyttävät yhteisten osien näyttämiseen fragmenttitiedostossa määriteltyjä osia.

Tehtävässä ei ole automaattisia testejä. Palauta tehtävä kun olet muokannut sitä tehtävänannon mukaisesti ja sovellus toimii halutulla tavalla.

</programming-exercise>


## Parametrit fragmenteissa

Fragmentteihin voi myös määritellä parametreja, joita palat sitten käyttävät. Edellä määritellyn otsikon sisältävän fragmentin voisi muuttaa muotoon, missä otsikko annetaan fragmentille parametrina. Parametreja vastaanottava fragmentti määritellään kuten aiemmatkin fragmentit, mutta fragmenteille määritellään suluissa parametri tai parametrit. Mikäli parametreja on useampi kuin yksi, erotellaan ne toisistaan pilkuilla.


```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org">
    <head th:fragment="head" lang="en">
        <meta charset="UTF-8" />
        <title>Layout</title>
    </head>
    <body>
        <header th:fragment="header(text)">
            <h1 th:text="${text}">Otsikko</h1>
        </header>

        <footer th:fragment="links">
            <ul>
                <li><a th:href="@{/polku1}">Linkki 1</li>
                <li><a th:href="@{/polku2}">Linkki 2</li>
                <li><a th:href="@{/polku3}">Linkki 3</li>
                <li><a th:href="@{/polku4}">Linkki 4</li>
            </ul>
        </footer>
    </body>
</html>
```

Parametrillisen fragmentin käyttö onnistuu antamalla `th:replace`-attribuutille parametrin tai parametrien arvot. Nämä annetaan muodossa `nimi='arvo'`, esimerkiksi `th:replace="fragments/layout :: header(text='Otsikko')`. Mikäli parametreja on useampia, erotellaan ne pilkuilla toisistaan.

Alla olevassa esimerkissä sivun otsikkotekstiksi asetettaisiin fragmentissa määriteltyä parametria hyödyntäen merkkijono "Hei maailma!".

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org">
    <head th:replace="fragments/layout :: head" lang="en">
        <meta charset="UTF-8" />
        <title>Otsikko</title>
    </head>
    <body>
        <div th:replace="fragments/layout :: header(text='Hei maailma!')"></div>

        <main>
            <ul>
                <li th:each="arvo : ${arvot}" th:text="${arvo}"></li>
            </ul>
        </main>

        <div th:replace="fragments/layout :: links"></div>
    </body>
</html>
```

Mikäli fragmentti määritellään parametrilliseksi, tulee kaikkiin fragmenttia käyttäviin sivuihin määritellä fragmenttin käyttö siten, että fragmentille annetaan parametrin arvo.

Parametrin arvon voi luonnollisesti antaa myös muuttujana. Alla olevassa esimerkissä `text`-parametrin arvoksi annetaan palvelimelta saatu muuttuja `${otsikko}`.

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org">
    <head th:replace="fragments/layout :: head" lang="en">
        <meta charset="UTF-8" />
        <title>Otsikko</title>
    </head>
    <body>
        <div th:replace="fragments/layout :: header(text='${otsikko}')"></div>

        <main>
            <ul>
                <li th:each="arvo : ${arvot}" th:text="${arvo}"></li>
            </ul>
        </main>

        <div th:replace="fragments/layout :: links"></div>
    </body>
</html>
```


<text-box variant='hint' name='Fragmentit ja Thymeleafin apuvälineet'>

Thymeleafissa ja Thymeleafin fragmenteissa voi käyttää myös mm. listoja, jonka lisäksi Thymeleaf tarjoaa paljon välineitä erityyppisten arvojen formatointiin ja käsittelyyn.

Näistä lisää mm. seuraavissa osoitteissa:

- [https://www.baeldung.com/spring-thymeleaf-fragments](https://www.baeldung.com/spring-thymeleaf-fragments)

- [https://www.baeldung.com/spring-thymeleaf-3-expressions](https://www.baeldung.com/spring-thymeleaf-3-expressions)

</text-box>


<quiz id="f13360a3-aff4-5b8a-9e15-3753f8a73e7a"></quiz>


<programming-exercise name='Playlists' tmcname='osa06-Osa06_02.Playlists'>

Tehtäväpohjassa on kappaleiden ja soittolistojen käsittelyyn tarkoitettu sovellus. Sovelluksessa on kolme Thymeleaf-tiedostoa (`index.html`, `playlists.html`, `tracks.html`) sekä erillinen tiedosto fragmenteille (kansiossa `fragments` oleva tiedosto `layout.html`).

Muokkaa sovellusta seuravasti:

- Luo HTML-sivujen `head`-osiosta fragmentti `layout.html`-tiedostoon. Parameterisoi fragmentti siten, että sille tulee antaa otsikko (title) parametrina.
- Muuta HTML-sivuja siten, että ne käyttävät parameterisoitua `head`-fragmenttia.
- Luo `tracks.html`-tiedostossa olevasta kappaleet listaavasta taulukosta (table) fragmentti `layout.html` tiedostoon. Fragmentin tulee olla parameterisoitu siten, että taulukkoon listattavat kappaleet annetaan sille parametrina.
- Muuta `tracks.html`-sivua siten, että se käyttää juuri luomaasi kappaleiden listaamiseen käytettävää fragmenttia.

Tehtävässä ei ole automaattisia testejä. Palauta tehtävä kun olet muokannut sitä tehtävänannon mukaisesti ja sovellus toimii halutulla tavalla.

</programming-exercise>
