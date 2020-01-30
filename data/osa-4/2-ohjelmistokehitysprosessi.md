---
path: '/osa-4/2-ohjelmistokehitysprosessi'
title: 'Muutama sana ohjelmistokehityksestä'
hidden: false
---

<text-box variant='learningObjectives' name='Oppimistavoitteet'>

- Osaat nimetä ohjelmiston elinkaaren vaiheita.
- Tunnet käsitteet GitHub ja Travis.
- Tiedät mistä jatkuvassa integraatiossa (Continuous Integration) on kyse.

</text-box>


Klassiseen ohjelmiston elinkaareen kuuluu vaatimusmäärittely, suunnittelu, toteutus, testaus, sekä ylläpito ja jatkokehitys. Vaatimusmäärittelyyn kuuluu ohjelmistoon liittyvien toiveiden ja vaatimusten kartoitus, jota seuraa suunnittelu, missä pohditaan miten vaatimukset toteutetaan. Toteutusvaihe sisältää ohjelmointia sekä sovelluksen elinympäristöön liittyvien komponenttien yhteensovittamista. Testaukseen kuuluu sovelluksen testaus niin automaattisesti kuin manuaalisesti. Kun ohjelmisto tai sen osa on toiminnassa, tulee elinkaaren osaksi myös käytössä olevasta ohjelmistosta löytyvien virheiden korjaaminen sekä uusien ominaisuuksien kehittäminen.


Ohjelmistojen kehitykseen liittyy jatkuva etsiminen ja kokeileminen. Ongelmat pyritään ratkaisemaan kokeilemalla vaihtoehtoja kunnes ongelmaan löytyy sopiva ratkaisu. Jos ongelma on osittain tuttu, on tarkasteltavia vaihtoehtoja vähemmän, ja jos ongelma on tuttu, on siihen tyypillisesti ainakin yksi valmis ratkaisumalli. Suositut ohjelmistoprojektien hallintaan tarkoitetut menetelmät kuten Scrum ja Kanban ohjaavat työn läpinäkyvyyteen, oman työskentelyn kehittämiseen sekä siihen, että muiden osallistuminen ohjelmistokehitykseen on helppoa.


### Ohjelmistoon liittyvät toiveet ja vaatimukset

Ohjelmistoon liittyvistä toiveista ja vaatimuksista keskustellaan asiakkaan ja käyttäjien kanssa, ja ne kirjataan muistiin. Vaatimukset kirjataan usein lyhyessä tarinamuodossa, joka kerrotaan uutta toiminnallisuutta toivovan henkilön näkökulmasta: "As a (käyttäjän tyyppi) I want (tavoite) so that (syy)." -- esimerkiksi "As a user I want to be able to view messages so that I can see what others have written". Vaatimuksia kirjattaessa saadaan kuva ohjelmistolta toivotusta toiminnallisuudesta, jonka jälkeen toiminnallisuuksia voidaan järjestää tärkeysjärjestykseen.


Toiminnallisuuksien tärkeysjärjestykseen asettaminen tapahtuu yhdessä asiakkaan ja käyttäjien kanssa. Kun toiminnallisuudet ovat kutakuinkin tärkeysjärjestyksessä, valitaan niistä muutama kerrallaan työstettäväksi. Samalla varmistetaan asiakkaan kanssa, että ohjelmistokehittäjät ja asiakas ymmärtävät toiveen samalla tavalla. Kun toiminnallisuus on valmis, toiminnallisuus näytetään asiakkaalle ja asiakas pääsee kertomaan uusia toiminnallisuustoiveita sekä mahdollisesti uudelleenjärjestelemään vaatimusten tärkeysjärjestystä.


Vaatimuksia ja toiveita, sekä niiden kulkemista projektin eri vaiheissa voidaan käsitellä esimerkiksi <a href="https://help.github.com/en/articles/about-project-boards" target="_blank">GitHub projectsin</a> tai <a href="https://trello.com/" target="_blank">Trellon</a> avulla. Mikäli ohjelmistoa kehittävä ryhmä sijaitsee samassa paikassa, eikä prosessia ole esimerkiksi asiakkaan toiveiden takia pakko laittaa verkkoon, on perinteinen valkotaulu ja post-it -laput lähes lyömätön yhdistelmä.

<br/>

### Versionhallinta

Ohjelmiston lähdekoodi ja dokumentaatio tallennetaan keskitetysti versionhallintaan, mistä kuka tahansa voi hakea ohjelmistosta uusimman version sekä lähettää sinne uudemman päivitetyn version. Käytännössä jokaisella ohjelmistokehittäjällä on oma hiekkalaatikko, jossa ohjelmistoon voi tehdä muutoksia vaikuttamatta muiden tekemään työhön. Jokaisella ohjelmistokehittäjällä on yleensä samat tai samankaltaiset työkalut (ohjelmointiympäristö, ...), mikä helpottaa muiden kehittäjien auttamista.


Kun ohjelmistokehittäjä valitsee vaatimuksen työstettäväksi, hän tyypillisesti hakee projektin versionhallinnasta projektin uusimman version, sekä lähtee toteuttamaan uutta vaatimusta. Kun vaatimukseen liittyvä osa tai komponentti on valmis sekä testattu paikallisesti (automaattiset testit on olemassa, toimii ohjelmistokehittäjän koneella), lähetetään uusi versio versionhallintapalvelimelle.

Versionhallintapalvelin sisältää myös mahdollisesti useampia versioita projektista. Versionhallintajärjestelmät mahdollistavat usein  haarojen (engl. "branch") käyttämisen, jolloin uusia ominaisuuksia voidaan toteuttaa erillään "päähaarasta" (useimmiten engl. "master"). Kun uusi ominaisuus on valmis, voidaan se lisätä päähaaraan. Versionhallinnassa olevia koodeja voidaan myös tägätä julkaisuversioiksi.

Yleisin versionhallintatyökalu on <a href="https://en.wikipedia.org/wiki/Git_(software)" target="_blank">Git</a>, joka on käytössä <a href="https://github.com/" target="_blank">GitHub</a>issa. Netistä löytyy paljon oppaita gitin käyttöön; esim. "<a href="https://guides.github.com/activities/hello-world/" target="_blank">Ensiaskeleet Githubin käyttöön</a>".

<br/>


### Jatkuva integraatio


Versionhallintapalvelin on tyypillisesti kytketty integraatiopalvelimeen, jonka tehtävänä on suorittaa ohjelmistoon liittyvät testit jokaisen muutoksen yhteydessä sekä tuottaa niistä mahdollisesti erilaisia raportteja. Integraatiopalvelin kuuntelee käytännössä versionhallintajärjestelmässä tapahtuvia muutoksia, ja hakee uusimman lähdekoodiversion muutoksen yhteydessä.


Kun testit ajetaan sekä paikallisella kehityskoneella että erillisellä integraatiokoneella, ohjelmistosta huomataan virheitä, jotka eivät tule esille muutoksen tehneen kehittäjän paikallisella koneella (esimerkiksi erilainen käyttöjärjestelmä, selain, ...). On myös mahdollista että ohjelmistosta ei noudeta kaikkia sen osia -- ohjelmisto voi koostua useista komponenteista --  jolloin kaikkien vaikutusten testaaminen paikallisesti on mahdotonta. Jos testit eivät mene läpi integraatiokoneella, ohjelmistokehittäjä huomaa, että hänen tekemänsä muutokset eivät toimi muilla koneilla ja hänen tulee tehdä korjauksia.


Työkaluja automaattiseen kääntämiseen ja jatkuvaan integrointiin ovat esimerkiksi <a href="https://travis-ci.org" target="_blank">Travis</a> ja <a href="https://coveralls.io" target="_blank">Coveralls</a>. Travis varmistaa että viimeisin lähdekoodiversio kääntyy ja että testit menevät läpi, ja Coveralls tarjoaa välineitä testikattavuuden ja projektin historian tarkasteluun. Kummatkin ovat ilmaisia käyttää kun projektin lähdekoodi on avointa -- kumpikin tarjoaa myös suoran Github-tuen. Testikattavuuden tarkasteluun auttaa myös mm. <a href="https://github.com/cobertura/cobertura" target="_blank">Cobertura</a> ja <a href="https://www.eclemma.org/jacoco/" target="_blank">JaCoCo</a> -kirjastot.

<br/>

Travisin käyttöönottoon vaaditaan käytännössä se, että projekti on esimerkiksi Githubissa ja että sen juurikansiossa on travisin konfiguraatiotiedosto `.travis.yml`. Yksinkertaisimmillaan konfiguraatiotiedosto sisältää vain käytetyn ohjelmointikielen -- travis osaa esimerkiksi päätellä projektin tyypin `pom.xml`-tiedoston pohjalta. <a href="https://docs.travis-ci.com/user/getting-started/" target="_blank">Ohje Traviksen käyttöönottoon</a>.

<br/>

### Nopeasti näytille

Kun uusi vaatimus tai sen osa on saatu valmiiksi, kannattaa viedä palvelimelle palautteen saamista varten. On tyypillistä, että ohjelmistolle on ainakin *Staging*- ja *Tuotanto*-palvelimet. Staging-palvelin on lähes identtinen ympäristö tuotantoympäristöön verrattuna. Staging (usein myös QA)-ympäristöön kopioidaan ajoittain (ehkä anonymisoitu) tuotantoympäristön data, ja se toimii viimeisenä testaus- ja validointipaikkana (Quality assurance) ennen tuotantoon siirtoa. QA-ympäristöä käytetään myös demo- ja harjoitteluympäristönä. Kun QA-ympäristössä oleva sovellus on päätetty toimivaksi, siirretään sovellus tuotantoympäristöön.


Tuotantoympäristö voi olla yksittäinen palvelin, tai se saattaa olla joukko palvelimia, joihin uusin muutos viedään hiljalleen. Tuotantoympäristö on tyypillisesti erillään muista ympäristöistä mahdollisten virheiden minimoimiseksi.


Käytännössä versioiden päivitys tuotantoon tapahtuu usein automaattisesti. Esimerkiksi ohjelmistoon liittyvä Travis-konfiguraatio voidaan määritellä niin, että jos kaikki testit menevät läpi integraatiopalvelimella, siirretään ohjelmisto <a href="https://docs.travis-ci.com/user/deployment/heroku" target="_blank">automaattisesti tuotantoon</a>. Esimerkiksi Herokussa sijaitsevaan sovellukseen muutokset voidaan hakea automaattisesti GitHubista (<a href="https://devcenter.heroku.com/articles/github-integration" target="_blank">ohje</a>).

<br/>

<text-box variant='hint' name='Teemaan liittyviä kursseja'>

Tällä kurssilla ohjelmistokehitysprosessia tarkastellaan hyvin lyhyesti ja pintapuolisesti. Hyviä ohjelmistokehityskäytänteitä tarkastellaan mm. kursseilla Ohjelmistotekniikka (TKT-20002) ja Ohjelmistotuotanto (TKT-20006). Näistä jälkimmäisen kurssin syksyn 2018 materiaalit löytyvät osoitteesta <a href="https://github.com/mluukkai/ohjelmistotuotanto2018/wiki/Ohjelmistotuotanto-syksy-2018" target="_blank">https://github.com/mluukkai/ohjelmistotuotanto2018/wiki/Ohjelmistotuotanto-syksy-2018</a>

<br/>

</text-box>
