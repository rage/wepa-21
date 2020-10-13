---
path: "/projekti"
title: "Projekti"
hidden: true
information_page: true
---

Kurssiin kuuluu ohjelmointiprojekti, jossa luodaan ansioluettelo- ja työntekijähakusovellus eli tuttavallisemmin vanhan kansan LinkedIn.

Sovellukselta odotetut ominaisuudet:

#### Käyttäjien rekisteröityminen ####

Käyttäjä rekisteröityy sovellukseen kirjaamalla sovellukseen käyttäjätunnuksen, salasanan sekä nimen. Tämän lisäksi käyttäjältä kysytään profiilin näyttämisessä käytettävää merkkijonoa, jonka perusteella käyttäjän sivu voidaan löytää sovelluksesta. Esim. “https://sovellus.net/kayttajat/profiili-merkkijono”

#### Käyttäjien etsiminen ja yhdistäminen ####

Käyttäjä voi etsiä muita käyttäjiä nimen perusteella. Käyttäjä voi lisätä yhteyksiinsä toisen henkilön. Yhteyttä ei kuitenkaan hyväksytä ellei toinen osapuoli hyväksy sitä.

#### Yhteydet ####

Käyttäjä voi tarkastella omia yhteyksiään. Yhteyden ohessa näytetään toisen henkilön nimi joka toimii linkkinä henkilön profiiliin sekä painikkeet yhteyden hyväksyntään ja hylkäykseen. Mikäli yhteys on jo muodostettu, on tilalla painike yhteyden katkaisemiseksi.

#### Profiilikuva ####

Käyttäjä voi määritellä profiilikuvan.

#### Henkilökohtainen etusivu ####

Jokaisella käyttäjällä on henkilökohtainen "seinä", joka sisältää yllä henkilön nimen sekä mahdollisesti määritellyn profiilikuvan. Tämän lisäksi seinällä on lista taidoista joita henkilöllä on. Käyttäjä voi lisätä taitoja omalta sivultaan. Muut käyttäjät voivat käydä kehumassa toisen käyttäjän taitoja hänen etusivullaan - tällöin taidon vieressä oleva kehujen lukumäärä kasvaa. Taidoista korostetaan 3 kaikkein kehuttua taitoa, ja loput ovat erillään.

#### Postaaminen ####

Kirjautuneet käyttäjät voivat lähettää postauksia yhteisellä sivulla. Postaussivulla näkyy yhteydessä olevien henkilöiden postaukset. Jokaisesta viestistä näytetään viestin lähettäjän nimi, viestin lähetysaika, sekä viestin tekstimuotoinen sisältö. Viestit näytetään postauslistassa niiden saapumisjärjestyksessä siten, että postauslistassa näkyy aina korkeintaan 25 uusinta viestiä.

### Postausten tykkääminen ###

Kirjautuneet käyttäjät voivat tykätä postauksista. Tykkääminen tapahtuu viestin yhteydessä olevaa tykkäysnappia painamalla. Kukin käyttäjä voi tykätä tietystä viestistä korkeintaan kerran (sama käyttäjä ei saa lisätä useampaa tykkäystä tiettyyn viestiin). Viestien näytön yhteydessä näytetään niihin liittyvä tykkäysten lukumäärä.

#### Kommentointi ####

Käyttäjät voivat kommentoida viestejä. Kommentointi tapahtuu viestin yhteydessä olevan kommentointikentän avulla. Viestien yhteydessä näytetään aina korkeintaan 10 uusinta kommenttia.

#### Apuresursseja: ####

Apumateriaalia tietokannassa olevan ajan käsittelyyn: https://web-palvelinohjelmointi-20.mooc.fi/ekstra/ajan-kasittely-tietokannassa

## Työn tekeminen ja palautus ##

TMC:ssä on erillinen kurssi “Web-palvelinohjelmointi Java 2020, projekti”, joka sisältää tehtäväpohjan sekä projektin käytössä olevat riippuvuudet - voit halutessasi lisätä projektiin myös muita riippuvuuksia. Saat pohjan käyttöösi valitsemalla TMC:n asetuksista organisaation “MOOC” sekä valitsemalla kurssiksi “Web-palvelinohjelmointi Java 2020, projekti”. Tämän jälkeen TMC lataa käyttöösi projektipohjan.

Työ palautetaan TMC:hen, Moodleen ja Herokuun. Palautus TMC:hen tapahtuu TMC:n submit-nappia painamalla ja sen voi tehdä useaan otteeseen. Vastaavasti Moodleen voi tehdä useamman palautuksen. Vain viimeinen palautus arvioidaan. Sovellus tulee myös lisätä Herokuun. Huomaa, että **TMC-palautuksessa saatat saada virheen “Failed to process submission. Likely sent in incorrect format”, mahdollisesti myös virheen joka alkaa “Unable to run tests because this course's teacher has not configured...” tai jonkun toisen virheen. Tästä ei kannata välittää, palautus menee silti läpi.**

Moodleen työstä palautetaan sekä linkki sovelluksen Herokussa toimivaan versioon että sovelluksen lähdekoodit sisältävä zip-paketti. Lähdekoodit sisältävä zip-paketti ei saa sisältää sovelluksen käännetyn version sisältävää target-kansiota.

**Työ tulee palauttaa sekä Moodleen että TMC:hen deadline päivänä. klo 23:59 mennessä.** Huomaa, että työn palauttaminen sekä Moodleen että TMC:hen voi kestää, eli varaa pelkälle palautuksellekin aikaa.

Käy katsomassa projektin ilmoittautumis- ja palautusohjeita täältä https://web-palvelinohjelmointi-20.mooc.fi/ilmoittautuminen **Huomaa että kurssille on ilmoittauduttava ennen projektin palautusta ja ilmoittautuminen vie 24 tuntia. Sinun on siis ilmoittauduttava kurssille viimeistään päivää ennen deadlinea.**

Arviointi

Projekti itse- ja vertaisarvioidaan, jonka lisäksi kurssin henkilökunta arvioi projektit. Itse- ja vertaisarviointi tapahtuu Moodlen työpajatoiminnallisuudella. Tarkista deadlinet etusivulta https://web-palvelinohjelmointi-20.mooc.fi

Arvioinnissa tarkastellaan sekä lähdekoodia että verkossa toimivaa sovellusta. Tarkastelussa kiinnitetään huomiota seuraaviin asioihin:

- (1) Sovelluksen toiminta, ulkoasu ja helppokäyttöisyys (15% projektin arvosanasta)
  - (a) Toimiiko Herokussa oleva sovellus? Tallennetaanko verkossa olevan sovelluksen tiedot tietokantaan, josta ne löytyvät myös sovelluksen uudelleenkäynnistyksen yhteydessä?
  - (b) Onko sovelluksen käyttö luontevaa?
  - (c) Tietääkö käyttäjä sovellusta käyttäessään miten hänen tulee toimia?
  - (d) Onko sovelluksen ulkoasu miellyttävä?

<br />

- (2) Toteutetut ominaisuudet (55% projektin arvosanasta)
  - (a) Onko sovelluksessa siltä halutut toiminnallisuudet?
  - (b) Toimiiko kukin ominaisuus toivotulla tavalla?

<br />

- (3) Toteutettujen ominaisuuksien laatu (10% projektin arvosanasta)
  - (a) Onko sovelluksen toiminnallisuudet toteutettu järkevästi? Esim. tehdäänkö tiedon järjestäminen tietokannassa, onko sovelluksessa N+1 -kyselyn ongelmaa, …
  - (b) Sovelluksen automaattiset testit ja niiden laatu.

<br />

- (4) Itse- ja vertaisarviointi (20% projektin arvosanasta)
  - (a) Kukin arvioi oman työnsä sekä vertaisarvioi kolme muuta työtä.
  - (b) Mikäli kurssilainen ei palauta työtä, voi hän silti vertaisarvioida muiden töitä.

