---
path: '/osa-3/3-n-plus-1-kyselyn-ongelma'
title: 'N+1 kyselyn ongelma'
hidden: false
---

<text-box variant='learningObjectives' name='Oppimistavoitteet'>

- Tiedät mitä N+1 -kyselyn ongelma tarkoittaa.
- Osaat antaa esimerkkejä tilanteista, joissa N+1 -kyselyn ongelma voi esiintyä.
- Tunnet menetelmiä N+1 -kyselyn ongelman kiertämiseen.
- Tunnet tietokantakyselyiden ohjeistamiseen käytetyt annotaatiot `@EntityGraph` ja `@NamedEntityGraph` ja olet kokeillut niiden käyttöä.

</text-box>


Tietokanta-abstraktioita tarjoavat kirjastot päättävät miten haettavaan olioon liittyvät viitteet haetaan. Perinteisesti tähän on ollut käytössä kaksi vaihtoehtoa: (1) haetaan viitatut oliot samalla kun viittaavaa oliota haetaan, ja (2) hakea viitatut oliot vasta kun niitä pyydetään eksplisiittisesti esimerkiksi olion get-metodin kautta.

Viitattujen olioiden lataaminen vasta niitä tarvittaessa on yleisesti ottaen hyvä idea, mutta sillä on myös kääntöpuolensa.

Pohditaan pankkijärjestelmäämme, missä henkilöllä voi olla monta tiliä, ja yhdellä tilillä voi olla monta omistajaa -- `@ManyToMany`.

Luodaan sovellukseen sivu, joka tulostaa jokaisen tilin yhteydessä tilin omistajien lukumäärän. Kontrollerin puolella toteutus on helppo -- haemme tilit tietokannasta ja lisäämme ne modeliin.

```java
model.addAttribute("tilit", tiliRepository.findAll());
```

HTML-sivullakin toteutus on suhteellisen suoraviivainen.

```html
<h1>Tilit</h1>

<ul>
    <li th:each="tili: ${tilit}">
        <a th:href="@{/tilit/{id}(id=${tili.id})}">
            Tili: <span th:text="${tili.id}">tilin id</span>,
            Saldo: <span th:text="${tili.saldo}">saldo</span>,
            Omistajia <span th:text="${tili.omistajat.size()}">lukumäärä</span>
        </a>
    </li>
</ul>
```

Kun haemme kontrollerissa tilit, sovellus tekee yhden tietokantakyselyn. Kun tulostamme tiliin liittyvien omistajien lukumäärän, tulee omistajat hakea. Tämä tehdään tilikohtaisesti `th:each="tili: ${tilit}"`, joten kyselyitä tehdään yksi jokaista tiliä kohden. Tätä ongelmaa, missä näennäisesti yksinkertainen tiedon näyttäminen paisuu isoksi joukoksi tietokantakyselyitä kutsutaan N+1 -kyselyn ongelmaksi -- ongelmassa tehdään N-kyselyä alkuperäisen yhden kyselyn lisäksi.

Ongelman voi ratkaista useammalla tavalla:

- Ensimmäinen ratkaisu on poistaa N+1 -kyselyn ongelman aiheuttava osa sovelluksestamme -- kuinka tärkeää on näyttää tilin omistajien lukumäärä?
- Toinen ratkaisu on denormalisoida tietokantaa hieman, jolloin tauluun Tili lisättäisiin oma sarake omistajien lukumäärälle -- tämä vaatisi uuden sarakkeen tiedon ylläpidot automaattisesti.
- Kolmas ratkaisu on toteuttaa sivulle erillinen kysely, joka hakee sekä tilit että tilin omistajien lukumäärän -- tietokanta-abstraktio ei tiedä että haluamme vain omistajien lukumäärän, joten se yrittää hakea kaikki tiedot; yksinkertainen yhteenvetokysely ajaisi täysin saman asian.
- Neljäs vaihtoehto -- joka on tulossa yhä suositummaksi -- on käyttää ns. Entity Grapheja kyselyssä, joiden avulla voidaan määritellä tarkemmin mitä haetaan.

<br/>

Sovelluksen ennenaikaiseen optimointiin ei kuitenkaan kannata käyttää aikaa -- ongelmat kannattaa korjata sitä mukaa kun niitä kohdataan. <a href="https://en.wikipedia.org/wiki/Donald_Knuth" target="_blank">Knuthin</a> sanoin, *Programmers waste enormous amounts of time thinking about, or worrying about, the speed of noncritical parts of their programs, and these attempts at efficiency actually have a strong negative impact when debugging and maintenance are considered. We should forget about small efficiencies, say about 97% of the time: premature optimization is the root of all evil. Yet we should not pass up our opportunities in that critical 3%.*

<br/>

Miten sitten N+1 -kyselyn oikein tunnistaa ohjelmasta? Yksinkertaisin tapa on tarkastella tietokantaan tehtyjä kyselyitä. Spring tulostaa konsoliin käytetyt SQL-kyselyt kun lisäämällä projektin kansiossa `src/main/resources` olevaan konfiguraatiotiedostoon `application.properties` seuraavan rivin.

```
spring.jpa.show-sql=true
```

Nyt, kun sovellus on käynnissä, sovelluksessa tehdyt tietokantakyselyt tulostetaan ohjelman lokiin. Esimerkiksi yllä olevan sivun hakeminen tuottaa lokiin seuraavanlaiset kyselyt -- esimerkissämme tietokannassa on neljä tiliä:

```
Hibernate: select tili0_.id as id1_4_, tili0_.pankki_id as pankki_i3_4_, tili0_.saldo as saldo2_4_ from tili tili0_
Hibernate: select omistajat0_.tilit_id as tilit_id2_1_0_, omistajat0_.omistajat_id as omistaja1_1_0_, henkilo1_.id as id1_0_1_, henkilo1_.nimi as nimi2_0_1_ from henkilo_tilit omistajat0_ inner join henkilo henkilo1_ on omistajat0_.omistajat_id=henkilo1_.id where omistajat0_.tilit_id=?
Hibernate: select omistajat0_.tilit_id as tilit_id2_1_0_, omistajat0_.omistajat_id as omistaja1_1_0_, henkilo1_.id as id1_0_1_, henkilo1_.nimi as nimi2_0_1_ from henkilo_tilit omistajat0_ inner join henkilo henkilo1_ on omistajat0_.omistajat_id=henkilo1_.id where omistajat0_.tilit_id=?
Hibernate: select omistajat0_.tilit_id as tilit_id2_1_0_, omistajat0_.omistajat_id as omistaja1_1_0_, henkilo1_.id as id1_0_1_, henkilo1_.nimi as nimi2_0_1_ from henkilo_tilit omistajat0_ inner join henkilo henkilo1_ on omistajat0_.omistajat_id=henkilo1_.id where omistajat0_.tilit_id=?
Hibernate: select omistajat0_.tilit_id as tilit_id2_1_0_, omistajat0_.omistajat_id as omistaja1_1_0_, henkilo1_.id as id1_0_1_, henkilo1_.nimi as nimi2_0_1_ from henkilo_tilit omistajat0_ inner join henkilo henkilo1_ on omistajat0_.omistajat_id=henkilo1_.id where omistajat0_.tilit_id=?
```

Lokissa nähdään ensin tilien hakeminen, jota seuraa tilien hakeminen yksitellen. Syntaksi on automaattisesti luotua SQL:ää ja voi näyttää hieman monimutkaiselta -- tarkemmin tarkasteltuna kysely muuttuu tutuksi.

#### EntityGraph

Edellä kuvattiin muutamia vaihtoehtoja N+1 -kyselyn ongelman poistamiseksi. Tarkastellaan tässä neljättä vaihtoehtoa eli entity grapheja, jotka esiteltiin vuonna 2013 julkaistussa JPA 2.1 standardissa. Entity graphien avulla ohjelmoija voi määritellä kyselyn tuloksena haettavat oliot ym. tiedot.

Teemaan voi tarkemmin syventyä Spring Data JPA-projektin <a href="https://docs.spring.io/spring-data/jpa/docs/current/reference/html/" target="_blank">dokumentaatiossa</a> sekä mm. osoitteissa <a href="https://www.baeldung.com/jpa-entity-graph" target="_blank">https://www.baeldung.com/jpa-entity-graph</a> ja <a href="https://www.radcortez.com/jpa-entity-graphs/" target="_blank">https://www.radcortez.com/jpa-entity-graphs/</a>.

<br/>

Voimme korvata `JpaRepository`-luokan tarjoaman `findAll`-toteutuksen omalla metodillamme. Alla olevassa toteutuksessa kerrotaan, että haluamme hakea tilien yhteydessä myös tilien `omistajat`-muuttujaan liityvät tiedot.

```java
public interface TiliRepository extends JpaRepository<Tili, Long> {

    @EntityGraph(attributePaths = {"omistajat"})
    List<Tili> findAll();
}
```

<br/>

Kun tietokannasta tilit kutsulla `findAll`, sovellus hakee tilien yhteydessä myös omistajat.

```
Hibernate: select tili0_.id as id1_4_0_, henkilo2_.id as id1_0_1_, tili0_.pankki_id as pankki_i3_4_0_, tili0_.saldo as saldo2_4_0_, henkilo2_.nimi as nimi2_0_1_, omistajat1_.tilit_id as tilit_id2_1_0__, omistajat1_.omistajat_id as omistaja1_1_0__ from tili tili0_ left outer join henkilo_tilit omistajat1_ on tili0_.id=omistajat1_.tilit_id left outer join henkilo henkilo2_ on omistajat1_.omistajat_id=henkilo2_.id
```

Mutta! (Ainakin Spring Bootin versiossa 2.1.3) Sovellus hakee nyt myös henkilöiden pankit, vaikkei niitä eksplisiittisesti tarvita. Edellinen muutos aiheuttaa jostain syystä uuden N+1 -kyselyn ongelman. Onneksi kyselyjen logitus oli päällä. Korjataan tilanne pienellä purkkaratkaisulla -- pyydetään tilejä haettaessa myös tileihin liittyvät pankit.

```java
public interface TiliRepository extends JpaRepository<Tili, Long> {

    @EntityGraph(attributePaths = {"omistajat", "pankki"})
    List<Tili> findAll();
}
```

Nyt kysely hakee myös tileihin liittyvät pankit.

```
Hibernate: select tili0_.id as id1_4_0_, henkilo2_.id as id1_0_1_, pankki3_.id as id1_3_2_, tili0_.pankki_id as pankki_i3_4_0_, tili0_.saldo as saldo2_4_0_, henkilo2_.nimi as nimi2_0_1_, omistajat1_.tilit_id as tilit_id2_1_0__, omistajat1_.omistajat_id as omistaja1_1_0__, pankki3_.nimi as nimi2_3_2_ from tili tili0_ left outer join henkilo_tilit omistajat1_ on tili0_.id=omistajat1_.tilit_id left outer join henkilo henkilo2_ on omistajat1_.omistajat_id=henkilo2_.id left outer join pankki pankki3_ on tili0_.pankki_id=pankki3_.id
```

#### NamedEntityGraph

Yllä olevassa esimerkissä korvasimme `JpaRepository`-rajapinnan tarjoaman metodin. EntityGraphin voi määritellä myös osaksi entiteettiä annotaation `@NamedEntityGraph` avulla. Yllä olevan kyselyn voi toteuttaa myös seuraavalla tavalla.

Alla luokalle `Tili` on määritelty kysely `Tili.omistajatJaPankit`, joka hakee tilin haun yhteydessä omistajat ja pankit. Toiminnallisuus on käytännössä identtinen edellisen toteutuksemme kanssa.

```java
@NamedEntityGraph(name = "Tili.omistajatJaPankit",
  attributeNodes = {@NamedAttributeNode("omistajat"), @NamedAttributeNode("pankki")})
@Entity
@Data @NoArgsConstructor @AllArgsConstructor
public class Tili extends AbstractPersistable<Long> {

    private BigDecimal saldo = new BigDecimal(0);

    @ManyToOne
    private Pankki pankki;

    @ManyToMany(mappedBy = "tilit")
    private List<Henkilo> omistajat = new ArrayList<>();

}
```

Luokkaan `Tili` määritellyn kyselyn käyttäminen tapahtuu `JpaRepository`-rajapinnassa seuraavasti. Korvaamme yhä aiemman `findAll`-metodin, mutta toisin kuin aiemmin, kerromme kyselyn sijaan kyselyn nimen eli `Tili.omistajatJaPankit`.

```java
public interface TiliRepository extends JpaRepository<Tili, Long> {

    @EntityGraph(value = "Tili.omistajatJaPankit")
    List<Tili> findAll();
}
```

Tilanne ei ole vieläkään ihanteellinen, sillä korvaamme metodin `findAll`. Jossain muualla metodia saatetaan haluta käyttää ilman, että tilien hakemisen yhteydessä haetaan tilin omistajat ja pankit. Yksi vaihtoehto on toteuttaa erillinen metodi -- vaikkapa `findByIdNotNull` -- joka ajaa saman asian.


```java
public interface TiliRepository extends JpaRepository<Tili, Long> {

    @EntityGraph(value = "Tili.omistajatJaPankit")
    List<Tili> findByIdNotNull();
}
```


<programming-exercise name='Names and Addresses' tmcname='osa03-Osa03_05.NamesAndAddresses'>

Tehtäväpohja sisältää sovelluksen, joka sisältää henkilöitä ja osoitteita. Jokainen henkilö asuu tietyssä osoitteessa ja osoitteessa voi asua useita henkilöitä. Sovelluksessa tulostetaan kaikki tietokannassa olevat henkilöt sekä heidän osoitteensa.

Tämän hetkinen ratkaisu ei ole kovin optimaalinen, sillä sovelluksen toteutuksessa on N+1 -kyselyn ongelma.

Korjaa ongelma. Muokkaa sovellusta siten, että henkilöiden ja heidän osoitteidensa tulostaminen tapahtuu sovelluksessa yhdellä SQL-kyselyllä.

Tehtävässä ei ole testejä. Mielenkiintoisesti omalla koneella testattaessa voi käydä niin, ettei hitautta huomaa -- huomaat ongelman vähintäänkin sovelluksen lokeista.

</programming-exercise>



Tarkastellaan seuraavaksi mistä tämä `findByIdNotNull` oikeastaan tuleekaan...
