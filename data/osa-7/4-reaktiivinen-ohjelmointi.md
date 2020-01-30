---
path: '/osa-7/4-reaktiivinen-ohjelmointi'
title: 'Reaktiivinen ohjelmointi'
hidden: false
---

<text-box variant='learningObjectives' name='Oppimistavoitteet'>

- Tiedät mitä funktionaalisella ja reaktiivisella ohjelmoinnilla pääpiirteittäin tarkoitetaan.
- Tiedät pääpiirteittäin mitä termi reaktiivinen web-sovellus tarkoittaa.

</text-box>


Tarkastellaan seuraavaksi lyhyesti reaktiivisten sovellusten ohjelmointia. Tutustumme ensin pikaisesti funktionaaliseen ohjelmointiin sekä reaktiiviseen ohjelmointiin, jonka jälkeen nämä yhdistetään. Lopuksi katsotaan erästä tapaa lisätä palvelimen ja selaimen välistä vuorovaikutusta.


## Funktionaalinen ohjelmointi

Funktionaalisen ohjelmoinnin ydinajatuksena on ohjelmakoodin suorituksesta johtuvien sivuvaikutusten minimointi. Sivuvaikutuksilla tarkoitetaan ohjelman tai ympäristön tilaan vaikuttavia epätoivottuja muutoksia. Sivuvaikutuksia ovat esimerkiksi muuttujan arvon muuttuminen, tiedon tallentaminen tietokantaan tai esimerkiksi käyttöliittymän näkymän muuttaminen.

Keskiössä ovat puhtaat ja epäpuhtaat funktiot. Puhtaat funktiot noudattavat seuraavia periaatteita: (1) funktio ei muuta ohjelman sisäistä tilaa ja sen ainoa tuotos on funktion palauttama arvo, (2) funktion palauttama arvo määräytyy funktiolle parametrina annettavien arvojen perusteella, eikä samat parametrien arvot voi johtaa eri palautettaviin arvoihin, ja (3) funktiolle parametrina annettavat arvot on määritelty ennen funktion arvon palauttamista.

Epäpuhtaat funktiot taas voivat palauttaa arvoja, joihin vaikuttavat myös muutkin asiat kuin funktiolle annettavat parametrit, jonka lisäksi epäpuhtaat funktiot voivat muuttaa ohjelman tilaa. Tällaisia ovat esimerkiksi tietokantaa käyttävät funktiot, joiden toiminta vaikuttaa myös tietokannan sisältöön tai jotka hakevat tietokannasta tietoa.

Funktionaaliset ohjelmointikielet tarjoavat välineitä ja käytänteitä jotka "pakottavat" ohjelmistokehittäjää ohjelmoimaan funktionaalisen ohjelmoinnin periaatteita noudattaen. Tällaisia kieliä ovat esimerkiksi [Haskell](https://en.wikipedia.org/wiki/Haskell\_(programming\_language)), joka on puhdas funktionaalinen ohjelmointikieli eli siinä ei ole mahdollista toteuttaa epäpuhtaita funktioita. Toinen esimerkki on [Clojure](https://en.wikipedia.org/wiki/Clojure), jossa on mahdollista toteuttaa myös epäpuhtaita funktiota -- Clojureen löytyy myös erillinen nyt jo hieman vanhentunut Helsingin yliopiston kurssimateriaali [Functional programming with Clojure](https://mooc.fi/courses/2014/clojure/).


Funktionaalisen ohjelmoinnin hyötyihin liittyy muunmuassa testattavuus. Alla on annettuna esimerkki metodista, joka palauttaa nykyisenä ajanhetkenä tietyllä kanavalla näkyvän ohjelman.


```java
public TvOhjelma annaTvOhjelma(Opas opas, Kanava kanava) {
    Aikataulu aikataulu = opas.annaAikataulu(kanava);
    return aikataulu.annaTvOhjelma(new Date());
}
```

Ylläolevan metodin palauttamaan arvoon vaikuttaa aika, eli sen arvo ei määräydy vain annettujen parametrien perusteella. Metodin testaaminen on vaikeaa, sillä aika muuttuu jatkuvasti. Jos määrittelemme myös ajna metodin parametriksi, paranee testattavuus huomattavasti.

```java
public TvOhjelma annaTvOhjelma(Opas opas, Kanava kanava, Date aika) {
    Aikataulu aikataulu = opas.annaAikataulu(kanava);
    return aikataulu.annaTvOhjelma(aika);
}
```

Funktionaalisessa ohjelmoinnissa käytetään alkioiden käsittelyyn työvälineitä kuten `map` ja `filter`, joista ensimmäistä käytetään arvon muuntamiseen ja jälkimmäistä arvojen rajaamiseen. Alla olevassa esimerkissä käydään läpi henkilölista ja valitaan sieltä vain Maija-nimiset henkilöt. Lopulta heiltä valitaan iät ja ne tulostetaan.


```java
List<Henkilo> henkilot = // .. henkilo-lista saatu muualta

henkilot.stream()
        .filter(h -> h.getNimi().equals("Maija"))
        .map(h -> h.getIka())
        .forEach(System.out::println);
```

Ylläolevassa esimerkissä henkilot-listan sisältö ei muutu ohjelmakoodin suorituksen aikana. Periaatteessa -- jos useampi sovellus haluaisi listaan liittyvät tiedot -- kutsun `System.out::println` voisi vaihtaa esimerkiksi tiedon lähettämiseen liittyvällä kutsulla.



## Reaktiivinen ohjelmointi

[Reaktiivisella ohjelmoinnilla](https://en.wikipedia.org/wiki/Reactive_programming) tarkoitetaan ohjelmointiparadigmaa, missä ohjelman tila voidaan nähdä verkkona, missä muutokset muuttujiin vaikuttavat myös kaikkiin niistä riippuviin muuttujiin. Perinteisessä imperatiivisessa ohjelmoinnissa alla olevan ohjelman tulostus on 5.


```java
int a = 3;
int b = 2;
int c = a + b;
a = 7;

System.out.println(c);
```

Reaktiivisessa ohjelmoinnissa asia ei kuitenkaan ole näin, vaan ohjelman tulostus olisi 9. Lauseke `int c = a + b;` määrittelee muuttujan `c` arvon riippuvaiseksi muuttujista a ja b, jolloin kaikki muutokset muuttujiin a tai b vaikuttavat myös muuttujan c arvoon.

Reaktiivista ohjelmointia hyödynnetään esimerkiksi taulukkolaskentaohjelmistoissa, missä muutokset yhteen soluun voivat vaikuttaa myös muiden solujen sisältöihin, mitkä taas mahdollisesti päivittävät muita soluja jne. Yleisemmin ajatellen reaktiivinen ohjelmointiparadigma on kätevä tapahtumaohjatussa ohjelmoinnissa; käyttöliittymässä tehtyjen toimintojen aiheuttamat muutokset johtavat myös käyttöliittymässä näkyvän tiedon päivittymisen.

<text-box variant='hint' name='Reaktiivisen ohjelmoinnin kehitys'>

Osoitteessa [http://soft.vub.ac.be/Publications/2012/vub-soft-tr-12-13.pdf](http://soft.vub.ac.be/Publications/2012/vub-soft-tr-12-13.pdf) on hyvä johdanto reaktiivisen ohjelmoinnin kehitykseen. Lisää aiheesta on myös Andre Staltzin johdannossa, joka löytyy osoitteesta [https://gist.github.com/staltz/868e7e9bc2a7b8c1f754](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754). Nämä eivät kuitenkaan ole kurssin Web-palvelinohjelmointi Java kannalta oleellisia.

</text-box>


Termi reaktiivinen ohjelmointi (reactive programming) on kuormittunut, ja sillä on myös toinen yleisesti käytössä oleva merkitys. Reaktiivisella ohjelmoinnilla tarkoitetaan myös reaktiivisten sovellusten kehittämistä.


<text-box variant='hint' name='Reactive Manifesto'>


Tutustu [Reaktiivisen sovelluskehityksen manifestiin](https://www.reactivemanifesto.org/), joka ohjeistaa ohjelmistokehittäjiä luomaan sovelluksia, jotka vastaavat pyyntöön nopeasti (responsive), kestävät virhetilanteita (resilient), mukautuvat erilaisiin kuormiin (elastic) ja välittävät viestejä eri järjestelmän osa-alueiden välillä (message driven):

*Responsive: The system responds in a timely manner if at all possible. Responsiveness is the cornerstone of usability and utility, but more than that, responsiveness means that problems may be detected quickly and dealt with effectively. Responsive systems focus on providing rapid and consistent response times, establishing reliable upper bounds so they deliver a consistent quality of service. This consistent behaviour in turn simplifies error handling, builds end user confidence, and encourages further interaction.*

*Resilient: The system stays responsive in the face of failure. This applies not only to highly-available, mission critical systems -- any system that is not resilient will be unresponsive after a failure. Resilience is achieved by replication, containment, isolation and delegation. Failures are contained within each component, isolating components from each other and thereby ensuring that parts of the system can fail and recover without compromising the system as a whole. Recovery of each component is delegated to another (external) component and high-availability is ensured by replication where necessary. The client of a component is not burdened with handling its failures.*

*Elastic: The system stays responsive under varying workload. Reactive Systems can react to changes in the input rate by increasing or decreasing the resources allocated to service these inputs. This implies designs that have no contention points or central bottlenecks, resulting in the ability to shard or replicate components and distribute inputs among them. Reactive Systems support predictive, as well as Reactive, scaling algorithms by providing relevant live performance measures. They achieve elasticity in a cost-effective way on commodity hardware and software platforms.*

*Message Driven: Reactive Systems rely on asynchronous message-passing to establish a boundary between components that ensures loose coupling, isolation and location transparency. This boundary also provides the means to delegate failures as messages. Employing explicit message-passing enables load management, elasticity, and flow control by shaping and monitoring the message queues in the system and applying back-pressure when necessary. Location transparent messaging as a means of communication makes it possible for the management of failure to work with the same constructs and semantics across a cluster or within a single host. Non-blocking communication allows recipients to only consume resources while active, leading to less system overhead.*

Lainattu: [https://www.reactivemanifesto.org/](https://www.reactivemanifesto.org/).

</text-box>


## Funktionaalinen reaktiivinen ohjelmointi

[Funktionaalinen reaktiivinen ohjelmointi](https://en.wikipedia.org/wiki/Functional_reactive_programming) on funktionaalista ohjelmointia ja reaktiivista ohjelmointia yhdistävä ohjelmointiparadigma. Järjestelmiä on karkeasti jakaen kahta tyyppiä, joista toinen perustuu viestien lähettämiseen (viestejä välitetään verkon läpi kunnes tulos saavutettu) ja toinen viestien odottamiseen (odotetaan kunnes tulokselle on tarvetta, ja tuotetaan tulos).

Web-sovellusten kontekstissa reaktiivisilla web-sovelluksilla tarkoitetaan tyypillisesti funktionaalista reaktiivista ohjelmointia. Tutustutaan aiheeseen lyhyesti seuraavassa tehtävässä käsiteltävän oppaan avulla.

<programming-exercise name='Reactive Web Service' tmcname='osa07-Osa07_06.ReactiveWebService'>

Osoitteessa [https://spring.io/guides/gs/reactive-rest-service/](https://spring.io/guides/gs/reactive-rest-service/) on opas reaktiivisen web-sovelluksen kehittämisen aloittamiseen.

Käy opas läpi ja toteuta se tehtäväpohjaan. Kun olet valmis, palauta tehtävä TMC:lle. Riippuvuudet ovat tehtäväpohjassa valmiina.

Huom! Oppaassa pakkauksena käytetään pakkausta *hello*. Käytä tehtävässä pakkausta *reactiveweb*.

Tehtävään ei ole automaattisia testejä, mutta toteutat tehtävässä testejä.

</programming-exercise>


<quiz id="fcc9c534-0129-58cf-a9ce-fdb0b4ec1116"></quiz>
