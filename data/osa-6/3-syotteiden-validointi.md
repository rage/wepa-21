---
path: '/osa-6/3-syotteiden-validointi'
title: 'Syötteiden validointi'
hidden: false
---

<text-box variant='learningObjectives' name='Oppimistavoitteet'>

- Tiedät miten tietoa validoidaan.
- Osaat määritellä validointisääntöjä luokkien oliomuuttujiin.
- Tiedät mitä `@ModelAttribute`-annotaatio ja `BindingResult`-olio tekevät.
- Osaat validoida lomakedataa.

</text-box>

Tiedon validointi eli oikeellisuuden tarkistaminen on oleellisessa osassa useissa erilaisissa sovelluksissa. Ensimmäinen askel -- jonka olemme jo ottaneet -- on tallennettavan datan esittäminen ohjelmaan liittyvien käsitteiden kautta. Olemme käyttäneet datan tallentamisessa olioita, joihin on määritelty sopivat muuttujien tyypit. Tämä helpottaa työtämme jo hieman: esimerkiksi numerokenttiin ei saa asetettua merkkijonoja.

Tutustutaan seuraavaksi tarkemmin tiedon validointiin. Oletetaan, että käytössämme on seuraava luokka `Person`. Haluamme, että `Person`-luokasta tehdyt oliot sisältävät oikean muotoista dataa.


```java
// pakkaus, importit, annotaatiot
public class Person {

    private String socialSecurityNumber;
    private String name;
    private String email;

}
```

Luokan oliomuuttujiin liittyvien validaatiosääntöjen määrittely tapahtuu annotaatioilla. Muokataan luokkaa `Person` siten, että henkilöllä tulee olla henkilötunnus, nimi ja sähköpostiosoite.

Sovitaan että henkilötunnus ei saa koskaan olla tyhjä ja sen tulee olla tasan 11 merkkiä pitkä. Nimen tulee olla vähintään 5 merkkiä pitkä ja korkeintaan 30 merkkiä pitkä, ja sähköpostiosoitteen tulee olla validi sähköpostiosoite.

Tämä onnistuu seuraavilla annotaatioilla. Annotaatio `@NotEmpty` varmistaa ettei annotoitu attribuutti ole tyhjä -- lisätään se kaikkiin kenttiin. Annotaatiolla `@Size` voidaan määritellä pituusrajoitteita muuttujalle, ja annotaatiolla `@Email` varmistetaan, että attribuutin arvo on varmasti sähköpostiosoite.

Annotaatiot löytyvät pakkauksesta `javax.validation.constraints`.


```java
// pakkaus, importit, annotaatiot
public class Person {

    @NotEmpty
    @Size(min = 11, max = 11)
    private String socialSecurityNumber;

    @NotEmpty
    @Size(min = 5, max = 30)
    private String name;

    @NotEmpty
    @Email
    private String email;
}
```

Itse validointi tapahtuu kontrollerissa. Tarkastellaan tätä seuraavaksi.


## Olion käsittely kontrollerissa

Tiedon lähettäminen palvelimelle tapahtuu lomakkeen avulla POST-tyyppistä pyyntöä käyttäen. Lomakkeeseen on määritelty osoite, minne lomake lähetetään, lähetysmetodi, sekä lähetettävät kentät.

```html
<form th:action="@{/persons}" method="POST">
  <input type="text" name="socialSecurityNumber"/>
  <input type="text" name="name"/>
  <input type="text" name="email"/>
  <input type="submit" value="Create!"/>
</form>
```

Palvelimella pyynnön vastaanottaa tiettyä polkua kuunteleva kontrolleriluokkaan määritelty metodi, jonka parametreiksi on määritelty lomakkeessa olevat kentät.

Perinteinen yllä kuvatun lomakkeen kentät vastaanottava, olion tietokantaan tallentava, sekä uudelleenohjauksen aiheuttava kontrollerimetodi on seuraavanlainen.

```java
@PostMapping("/persons")
public String create(@RequestParam String socialSecurityNumber, @RequestParam String name, @RequestParam String email) {
    Person p = new Person(socialSecurityNumber, name, email);
    personRepository.save(p);
    return "redirect:/persons";
}
```

Springissä on myös erillinen annotaatio `@ModelAttribute`, jota voi käyttää pyynnössä olevien kytkemiseen annotaatiota seuraavaan olioon. Yllä olevan kontrollerimetodin voi korvata seuraavanlaisella metodilla.

```java
@PostMapping("/persons")
public String create(@ModelAttribute Person person) {
    personRepository.save(person);
    return "redirect:/persons";
}
```

Kun annotaatiota `@ModelAttribute` käytetään metodin parametrina olevan olion kanssa, annotaatio kertoo Springille, että parametrina olevan olion oliomuuttujien arvot tulee asettaa pyynnössä olevista arvoista. Pyynnössä olevien arvojen nimien tulee vastata oliomuuttujien nimiä -- esimerkiksi yllä `Person`-luokan arvot liittyvät suoraan käytettyyn lomakkeeseen.


<programming-exercise name='Links' tmcname='osa06-Osa06_05.Links'>

Tehtäväpohjassa on linkkien tallentamiseen ja listaamiseen tarkoitettu sovellus. Muokkaa sovelluksen `LinkController`-luokkaa siten, että se käyttää `@ModelAttribute`-annotaatiota `@RequestParam`-annotaation sijaan.

Tehtävässä ei ole automaattisia testejä. Palauta tehtävä kun olet tehnyt tehtäväannossa toivotut muutokset ja sovelluksen toiminta on pysynyt ennallaan.


</programming-exercise>


## Olion validointi kontrollerissa


Kontrollerimetodit validoivat olion jos kontrollerimetodissa olevalle `@ModelAttribute`-annotaatiolla merkatulle oliolle on asetettu myös annotaatio `@Valid` (`javax.validation.Valid`).


```java
@PostMapping("/persons")
public String create(@Valid @ModelAttribute Person person) {
    // .. esimerkiksi tallennus ja uudelleenohjaus
}
```

Spring validoi olion pyynnön vastaanottamisen yhteydessä, mutta validointivirheet eivät ole kovin kaunista luettavaa. Yllä olevalla kontrollerimetodilla virheellisen nimen kohdalla saamme hieman kaoottisen ilmoituksen.

<sample-output>

Whitelabel Error Page

This application has no explicit mapping for /error, so you are seeing this as a fallback.

(aika)
There was an unexpected error (type=Bad Request, status=400).
Validation failed for object='person'. Error count: 1

</sample-output>

Virheelle täytyy selvästi tehdä jotain..


## Validointivirheiden käsittely

Validointivirheet aiheuttavat poikkeuksen, joka näkyy virheviestinä mikäli niitä ei erikseen käsitellä. Validointivirheiden käsittely tapahtuu luokan `BindingResult` avulla, joka toimii validointivirheiden tallennuspaikkana. Luokan `BindingResult` kautta voimme käsitellä virheitä. `BindingResult`-olio kuvaa aina yksittäisen olion luomisen ja validoinnin onnistumista, ja se tulee asettaa heti validoitavan olion jälkeen. Seuraavassa esimerkki kontrollerista, jossa validoinnin tulos lisätään automaattisesti `BindingResult`-olioon.


```java
@PostMapping("/persons")
public String create(@Valid @ModelAttribute Person person, BindingResult bindingResult) {
    if(bindingResult.hasErrors()) {
        // validoinnissa virheitä: virheiden käsittely
    }

    // muu toteutus
}
```

Ylläolevassa esimerkissä kaikki validointivirheet tallennetaan `BindingResult`-olioon. Oliolla on metodi `hasErrors`, jonka perusteella päätämme jatketaanko pyynnön prosessointia vai ei. Yleinen muoto lomakedataa tallentaville kontrollereille on seuraavanlainen:


```java
@PostMapping("/persons")
public String create(@Valid @ModelAttribute Person person, BindingResult bindingResult) {
    if(bindingResult.hasErrors()) {
        return "personform";
    }

    // .. esimerkiksi tallennus

    return "redirect:/index";
}
```


Yllä oletetaan että lomake lähetettiin näkymästä "*personform*": käytännössä validoinnin epäonnistuminen johtaa nyt siihen, että pyyntö ohjataan takaisin lomakesivulle.


## Thymeleaf-lomakkeet ja BindingResult

Lomakkeiden validointivirheet saadaan käyttäjän näkyville Thymeleafin avulla. Lomakkeet määritellään kuten aiemmat HTML-lomakkeet, mutta niihin lisätään muutama lisäkenttä.

Lomakkeen attribuutti `th:object` kertoo olion, josta lomakkeen kenttien arvot haetaan -- *myös lomakkeen näyttävässä GET-metodissa tulee määritellä lomakkeeseen liittyvä olio*. Lomakkeen kentät määritellään attribuutin `th:field` avulla, jossa oleva `*{arvo}` kytkeytyy lomakkeeseen liittyvään olioon.

Mahdolliset virheet näytetään loitsulla `th:if="${#fields.hasErrors('arvo')}" th:errors="*{arvo}"`, eli "jos oliomuuttujaan arvo liittyi virhe, näytä se".

Kokonaisuudessan

Luodaan lomake aiemmin nähdyn `Person`-olion luomiseen.


```html
<form th:action="@{/persons}" th:object="${person}" method="POST">
    <table>
        <tr>
            <td>SSN: </td>
            <td><input type="text" th:field="*{socialSecurityNumber}" /></td>
            <td th:if="${#fields.hasErrors('socialSecurityNumber')}" th:errors="*{socialSecurityNumber}">SSN Virheviesti</td>
        </tr>
        <tr>
            <td>Name: </td>
            <td><input type="text" th:field="*{name}" /></td>
            <td th:if="${#fields.hasErrors('name')}" th:errors="*{name}">Name Virheviesti</td>
        </tr>
        <tr>
            <td>Email: </td>
            <td><input type="text" th:field="*{email}" /></td>
            <td th:if="${#fields.hasErrors('email')}" th:errors="*{email}">Email Virheviesti</td>
        </tr>
        <tr>
            <td><button type="submit">Submit</button></td>
        </tr>
    </table>
</form>
```

Yllä oleva lomake lähettää lomakkeen tiedot polussa `/persons` olevalle kontrollerimetodille. Lomakkeelle tullessa tarvitsemme erillisen tiedon käytössä olevasta oliosta. Alla on näytetty sekä kontrollerimetodi, joka ohjaa `GET`-pyynnöt lomakkeeseen, että kontrollerimetodi, joka käsittelee `POST`-tyyppiset pyynnöt. Huomaa erityisesti `@ModelAttribute`-annotaatio kummassakin metodissa. Metodissa `view` olion nimi on `person`, joka vastaa lomakkeessa olevaa `th:object`-attribuuttia -- jos annotaatiolla `@ModelAttribute` annotoidun olion nimi ja `th:object`-attribuutin arvo poikkeavat toisistaan, lomakkeen näyttäminen antaa virheen *Neither BindingResult nor plain target object for bean name ...*.


```java
@GetMapping("/persons")
public String view(@ModelAttribute Person person) {
    return "personform";
}

@PostMapping("/persons")
public String create(@Valid @ModelAttribute Person person, BindingResult bindingResult) {
    if(bindingResult.hasErrors()) {
        return "personform";
    }

    // .. tallennus ja uudelleenohjaus
}
```

Jos lomakkeella lähetetyissä kentissä on virheitä, virheet tallentuvat `BindingResult`-olioon. Tarkistamme kontrollerimetodissa `create` ensin virheiden olemassaolon -- jos virheitä on, palataan takaisin lomakkeeseen. Tällöin validointivirheet tuodaan lomakkeen käyttöön `BindingResult`-oliosta, jonka lomakkeen kentät täytetään `@ModelAttribute`-annotaatiolla merkitystä oliosta. Huomaa että virheet ovat pyyntökohtaisia, ja uudelleenohjauspyyntö kadottaa virheet.

**Huom!** Springin lomakkeita käytettäessä lomakesivut haluavat käyttöönsä olion, johon data kytketään jo sivua ladattaessa. Yllä lisäsimme pyyntöön `Person`-olion seuraavasti:


```java
@GetMapping("/persons")
public String view(@ModelAttribute Person person) {
    return "personform";
}
```

Mikäli lomakkeen näyttämiseen käytettävään metodiin ei halua laittaa lomaketta varten määriteltävää oliota, voi olion määritellä myös kontrollerissa. Tällöin kontrolleriluokkaan luodaan erillinen metodi, jonka sisältämä arvo lisätään automaattisesti pyyntöön. Toteutus olisi esimerkiksi seuraavanlainen:


```java
@ModelAttribute
private Person getPerson() {
    return new Person();
}

@GetMapping("/persons")
public String view() {
    return "personform";
}

@PostMapping("/person")
public String create(@Valid @ModelAttribute Person person, BindingResult bindingResult) {
    if(bindingResult.hasErrors()) {
        return "personform";
    }

    // .. tallennus ja uudelleenohjaus
}
```

Thymeleafin avulla tehdyistä lomakkeista ja niiden yhteistyöstä Springin kanssa löytyy lisää osoitteesta [https://www.thymeleaf.org/doc/tutorials/3.0/thymeleafspring.html#creating-a-form](https://www.thymeleaf.org/doc/tutorials/3.0/thymeleafspring.html#creating-a-form).



## Validointi ja entiteetit

Vaikka edellisessä esimerkissä käyttämäämme `Person`-luokkaa ei oltu merkitty `@Entity`-annotaatiolla -- eli se ei ollut tallennettavissa JPAn avulla tietokantaan -- mikään ei estä meitä lisäämästä sille `@Entity`-annotaatiota.

Toisaalta, lomakkeet voivat usein sisältää tietoa, joka liittyy useaan eri talletettavaan olioon. Tällöin voi luoda erillisen lomakkeen tietoihin liittyvän *lomakeolion*, jonka pohjalta luodaan tietokantaan tallennettavat oliot kunhan validointi onnistuu. Erilliseen lomakeobjektiin voi täyttää myös kannasta haettavia listoja ym. ennalta -- mikään ei siis estä määrittelemästä uusia luokkia tai olioita, jotka helpottavat lomakkeiden ym. käsitteyä.

Jos entiteeteille on määritelty validointisäännöt, määritellään osassa ORM-sovelluskehyksistä validointi myös osaksi tietokantaa. Tällöin tiedon validointi tapahtuu kontrollerin lisäksi myös tietokantatallennusten yhteydessä.


<programming-exercise name='Registration' tmcname='osa06-Osa06_06.Registration'>

Tehtävän mukana tulee sovellus, jota käytetään ilmoittatumiseen. Tällä hetkellä käyttäjä voi ilmoittautua juhliin oikeastaan minkälaisilla tiedoilla tahansa. Tehtävänäsi on toteuttaa parametreille seuraavanlainen validointi:

* Nimen (`name`) tulee olla vähintään 4 merkkiä pitkä ja enintään 50 merkkiä pitkä.
* Osoitteen (`address`) tulee olla vähintään 4 merkkiä pitkä ja enintään 50 merkkiä pitkä.
* Sähköpostiosoitteen (`email`) tulee olla validi sähköpostiosoite.

Tehtäväpohjan mukana tuleviin sivuihin on toteutettu valmiiksi lomake. Tehtävänäsi on toteuttaa validointitoiminnallisuus pakkauksessa `registration` olevaan luokkaan `Registration`.

Jos yksikin tarkastuksista epäonnistuu, tulee käyttäjälle näyttää rekisteröitymislomake uudelleen. Muista lisätä kontrolleriin validoitavalle parametrille annotaatio `@Valid`. Virheviestien ei tule näkyä vastauksessa jos lomakkeessa ei ole virhettä. Käyttöliittymä on tehtävässä valmiina.

</programming-exercise>
