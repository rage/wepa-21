---
path: "/projekti"
title: "Projekti"
hidden: true
information_page: true
---

Kurssiin kuuluu ohjelmointiprojekti, jossa luodaan seuraus- ja kuvasovellus eli tuttavallisemmin vanhan kansan Twitter. Kuvaus saattaa muuttua vielä muutama viikko kurssin alun jälkeen. Lähetä palautetta telegramissa jos kuvauksessa on mielestäsi jotain häikkää!

Sovellukselta odotetut ominaisuudet:

#### Käyttäjien rekisteröityminen ####

Käyttäjä rekisteröityy sovellukseen kirjaamalla sovellukseen käyttäjätunnuksen, salasanan sekä nimen. Tämän lisäksi käyttäjältä kysytään profiilin näyttämisessä käytettävää merkkijonoa, jonka perusteella käyttäjän sivu voidaan löytää sovelluksesta. Esim. “https://sovellus.net/kayttajat/profiili-merkkijono”

#### Käyttäjien etsiminen ja seuraaminen ####

Käyttäjä voi etsiä muita käyttäjiä nimen perusteella. Käyttäjä voi seurata muita järjestelmässä olevia käyttäjiä. Käyttäjä myös tietää keitä hän seuraa.

#### Seuraajat ####

Käyttäjä voi tarkastella omia seuraajiaan. Seurauksen yhteydessä näytetään seuraajan nimi sekä seurauksen aloitusaika. Seuraajan voi myös halutessaan torjua seuraamasta, tällöin seuraus ei näy kummankaan profiilissa.

#### Kuva-albumi ####

Jokaisella käyttäjällä on kuva-albumi. Käyttäjä voi lisätä albumiinsa kuvia ja myös poistaa niitä. Kunkin käyttäjän kuva-albumi voi sisältää korkeintaan 10 kuvaa. Jokaiseen kuvaan liittyy myös tekstimuotoinen kuvaus, joka lisätään kuvaan kuvan lisäyksen yhteydessä.

#### Profiilikuva ####

Käyttäjä voi määritellä yhden kuva-albumissa olevan kuvan profiilikuvaksi.

#### Henkilökohtainen etusivu ####

Jokaisella käyttäjällä on henkilökohtainen “seinä”, joka sisältää henkilön nimen sekä mahdollisesti määritellyn profiilikuvan. Vain käyttäjä voi lähettää seinälle tekstimuotoisia viestejä, mutta seinällä näkyy myös seurattavien henkilöiden omat viestit. Jokaisesta viestistä näytetään viestin lähettäjän nimi, viestin lähetysaika, sekä viestin tekstimuotoinen sisältö. Viestit näytetään seinällä niiden saapumisjärjestyksessä siten, että seinällä näkyy aina korkeintaan 25 uusinta viestiä.

#### Tykkääminen ####

Kirjautuneet käyttäjät voivat tykätä kuvista ja seinällä olevista viesteistä. Tykkääminen tapahtuu viestin ja kuvan yhteydessä olevaa tykkäysnappia painamalla. Kukin käyttäjä voi tykätä tietystä kuvasta ja tietystä viestistä korkeintaan kerran (sama käyttäjä ei saa lisätä useampaa tykkäystä tiettyyn kuvaan tai viestiin). Viestien ja kuvien näytön yhteydessä näytetään niihin liittyvä tykkäysten lukumäärä.

#### Kommentointi ####

Seuraajat voivat kommentoida kuvia ja viestejä. Kommentointi tapahtuu viestin ja kuvan yhteydessä olevan kommentointikentän avulla. Kuvien ja viestien yhteydessä näytetään aina korkeintaan 10 uusinta kommenttia.

#### Apuresursseja: ####

Apumateriaalia tietokannassa olevan ajan käsittelyyn: https://web-palvelinohjelmointi-21.mooc.fi/ekstra/ajan-kasittely-tietokannassa

## Työn tekeminen ja palautus ##

TMC:ssä on erillinen kurssi “Web-palvelinohjelmointi Java 2021, projekti”, joka sisältää tehtäväpohjan sekä projektin käytössä olevat riippuvuudet - voit halutessasi lisätä projektiin myös muita riippuvuuksia. Saat pohjan käyttöösi valitsemalla TMC:n asetuksista organisaation “MOOC” sekä valitsemalla kurssiksi “Web-palvelinohjelmointi Java 2021, projekti”. Tämän jälkeen TMC lataa käyttöösi projektipohjan.

Työ palautetaan TMC:hen, Moodleen ja Herokuun. Palautus TMC:hen tapahtuu TMC:n submit-nappia painamalla ja sen voi tehdä useaan otteeseen. Vastaavasti Moodleen voi tehdä useamman palautuksen. Vain viimeinen palautus arvioidaan. Sovellus tulee myös lisätä Herokuun. Huomaa, että **TMC-palautuksessa saatat saada virheen “Failed to process submission. Likely sent in incorrect format”, mahdollisesti myös virheen joka alkaa “Unable to run tests because this course's teacher has not configured...” tai jonkun toisen virheen. Tästä ei kannata välittää, palautus menee silti läpi.**

Moodleen työstä palautetaan sekä linkki sovelluksen Herokussa toimivaan versioon että sovelluksen lähdekoodit sisältävä zip-paketti. Lähdekoodit sisältävä zip-paketti ei saa sisältää sovelluksen käännetyn version sisältävää target-kansiota.

**Työ tulee palauttaa sekä Moodleen että TMC:hen deadline päivänä. klo 23:59 mennessä.** Huomaa, että työn palauttaminen sekä Moodleen että TMC:hen voi kestää, eli varaa pelkälle palautuksellekin aikaa.

Käy katsomassa projektin ilmoittautumis- ja palautusohjeita täältä https://web-palvelinohjelmointi-21.mooc.fi/ilmoittautuminen **Huomaa että kurssille on ilmoittauduttava ennen projektin palautusta ja ilmoittautuminen vie 24 tuntia. Sinun on siis ilmoittauduttava kurssille viimeistään päivää ennen deadlinea.**

Arviointi

Projekti itse- ja vertaisarvioidaan, jonka lisäksi kurssin henkilökunta arvioi projektit. Itse- ja vertaisarviointi tapahtuu Moodlen työpajatoiminnallisuudella. Tarkista deadlinet etusivulta https://web-palvelinohjelmointi-21.mooc.fi

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

