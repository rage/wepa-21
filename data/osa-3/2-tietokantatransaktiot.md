---
path: '/osa-3/2-tietokantatransaktiot'
title: 'Tietokantatransaktiot'
hidden: false
---

<text-box variant='learningObjectives' name='Oppimistavoitteet'>

- Tiedät miten tietokantatransaktio määritellään sovelluksessa.
- Tiedät miten tietokantatransaktion määrittely vaikuttaa tietokannasta haettuihin olioihin ja erityisesti niihin tehtyihin muutoksiin.
- Osaat luoda ohjelman, jossa käytetään useamman kyselyn niputtavia tietokantatransaktioita.

</text-box>


Kurssilla <a href="https://tietokantojen-perusteet-19.mooc.fi/osa-4/2-eheys-ja-tietokantatransaktiot" target="_blank">tietokantojen perusteet</a> todettiin seuraavaa: *Tietokantatransaktio sisältää yhden tai useamman tietokantaan kohdistuvan operaation, jotka suoritetaan (järjestyksessä) kokonaisuutena. Jos yksikin operaatio epäonnistuu, kaikki operaatiot perutaan, ja tietokanta palautetaan tilaan, missä se oli ennen transaktion aloitusta.*

<br/>

Käytännössä transaktioiden avulla pidetään yllä tietokannan eheyttä ja varmistetaan, ettei käyttäjälle näytetä epätoivottua tilaa.

Tietokantatransaktiot määritellään Spring-sovelluskehyksen avulla toteutetuissa sovelluksissa metodi- tai luokkatasolla annotaation `@Transactional` avulla. Annotaatiolla `@Transactional` merkittyä metodia suoritettaessa metodin alussa aloitetaan tietokantatransaktio, jossa tehdyt muutokset viedään tietokantaan metodin lopussa. Jos annotaatio `@Transactional` määritellään luokkatasolla, se koskee jokaista luokan metodia.


Rajapinnalle `JpaRepository` on valmiina määriteltynä transaktiot luokkatasolle. Tämä tarkoittaa sitä, että yksittäiset tallennusoperaatiot toimivat myös ilman `@Transactional`-annotaatiota.


Alla on kuvattuna tilisiirto, joka on ehkäpä klassisin transaktiota vaativa tietokantaesimerkki. Jos ohjelmakoodin suoritus epäonnistuu (esim. päätyy poikkeukseen) sen jälkeen kun toiselta tililtä on otettu rahaa, mutta toiselle sitä ei vielä ole lisätty, rahaa katoaa.


```java
@PostMapping("/tilit/{mistaId}/siirra")
public String siirra(@PathVariable Long mistaId,
        @RequestParam Long minneId,
        @RequestParam BigDecimal summa) {
    Tili mista = tiliRepository.getOne(mistaId);
    Tili minne = tiliRepository.getOne(minneId);

    mista.setSaldo(mista.getSaldo().subtract(summa));
    minne.setSaldo(minne.getSaldo().add(summa));

    tiliRepository.save(mista);

    // jos täällä tapahtuu poikkeus,
    // tietokannasta katoaa rahaa

    tiliRepository.save(minne);

    return "redirect:/tilit/" + mistaId;
}
```

Jos metodille määritellään annotaatio `@Transactional`, rahat eivät katoa vaan poikkeuksen yhteydessä koko operaatio peruuntuu.

```java
@Transactional
@PostMapping("/tilit/{mistaId}/siirra")
public String siirra(@PathVariable Long mistaId,
        @RequestParam Long minneId,
        @RequestParam BigDecimal summa) {
    Tili mista = tiliRepository.getOne(mistaId);
    Tili minne = tiliRepository.getOne(minneId);

    mista.setSaldo(mista.getSaldo().subtract(summa));
    minne.setSaldo(minne.getSaldo().add(summa));

    tiliRepository.save(mista);

    // jos täällä tapahtuu poikkeus,
    // metodissa tehtyjä muutoksia
    // ei viedä tietokantaan

    tiliRepository.save(minne);

    return "redirect:/tilit/" + mistaId;
}
```


## Vain lukemiseen tarkoitetut transaktiot

Annotaatiolle `@Transactional` voidaan määritellä parametri `readOnly`, jonka avulla määritellään kirjoitetaanko muutokset tietokantaan. Jos parametrin `readOnly` arvo on `true`, metodiin liittyvä transaktio perutaan metodin lopussa (rollback) eikä metodissa mahdollisesti tehtyjä muutoksia viedä tietokantaan.


## Transaktiot ja entiteettien automaattinen hallinta

Kun metodille määritellään annotaatio `@Transactional`, tietokannasta ladatuista entiteeteistä pidetään kirjaa ja muutokset tallennetaan tietokantaan automaattisesti metodin suorituksen jälkeen.

Tämä tarkoittaa sitä, että tilisiirron määrittevä metodi voidaan kirjoittaa suoraviivaisemmin. Yllä kuvattu metodi toimii samalla tavalla kuin seuraava metodi:

```java
@Transactional
@PostMapping("/tilit/{mistaId}/siirra")
public String siirra(@PathVariable Long mistaId,
        @RequestParam Long minneId,
        @RequestParam BigDecimal summa) {
    Tili mista = tiliRepository.getOne(mistaId);
    Tili minne = tiliRepository.getOne(minneId);

    mista.setSaldo(mista.getSaldo().subtract(summa));
    minne.setSaldo(mista.getSaldo().add(summa));

    return "redirect:/tilit/" + mistaId;
}
```

Tarkastellaan toista esimerkkiä entiteettien automaattisesta hallinnasta.

Edellisessä osassa toteutettu tilin omistajan lisäämiseen käytetty metodi oli seuraavanlainen.

```java
@PostMapping("/tilit/{tiliId}/omistajat/{henkiloId}")
public String addOmistaja(@PathVariable Long tiliId, @PathVariable Long henkiloId) {
    Tili tili = tiliRepository.getOne(tiliId);
    Henkilo henkilo = henkiloRepository.getOne(henkiloId);

    henkilo.getTilit().add(tili);
    henkiloRepository.save(henkilo);

    return "redirect:/tilit/" + tiliId;
}
```

Kun metodille lisätään annotaatio `@Transactional`, ei henkilöä tarvitse metodin suorituksen yhteydessä enää erikseen tallentaa.

```java
@Transactional
@PostMapping("/tilit/{tiliId}/omistajat/{henkiloId}")
public String addOmistaja(@PathVariable Long tiliId, @PathVariable Long henkiloId) {
    Tili tili = tiliRepository.getOne(tiliId);
    Henkilo henkilo = henkiloRepository.getOne(henkiloId);

    henkilo.getTilit().add(tili);

    return "redirect:/tilit/" + tiliId;
}
```

Metodia voi suoraviivaistaa vielä edellisestä. Alla oleva metodi tekee saman asian kuin edellinen. Metodin luettavuus riippuu toki kontekstista ja on lukijan vastuulla päättää kumpi -- yllä vai alla oleva -- vaihtoehto on parempi.

```java
@Transactional
@PostMapping("/tilit/{tiliId}/omistajat/{henkiloId}")
public String addOmistaja(@PathVariable Long tiliId, @PathVariable Long henkiloId) {
    henkiloRepository
            .getOne(henkiloId)
            .getTilit().add(tiliRepository.getOne(tiliId));

    return "redirect:/tilit/" + tiliId;
}
```


<programming-exercise name='Bank Transfer' tmcname='osa03-Osa03_04.BankTransfer'>

Tehtäväpohjassa on valmiina yksinkertainen sovellus tilien hallintaan ja tilisiirtojen tekemiseen. Sovelluksen tilisiirtotoiminnallisuudessa on kuitenkin vielä viilattavaa -- jos sovellus kaatuu kesken tilisiirron, rahaa voi kadota.

Selvitä minkälaisia korjauksia tilisiirtotoiminnallisuus tarvitsee ja toteuta ne. Tehtävässä ei ole automaattisia testejä -- palauta tehtävä TMC:lle kun olet ratkaissut oleellisimmat tilisiirtoon liittyvät ongelmat.

</programming-exercise>
