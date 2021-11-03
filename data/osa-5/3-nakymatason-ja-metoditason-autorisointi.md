---
path: '/osa-5/3-nakymatason-ja-metoditason-auktorisointi'
title: 'Näkymä- ja metoditason auktorisointi'
hidden: false
---


Tutustuimme juuri käyttäjän tunnistamiseen eli autentikointiin. Autentikoinnin lisäksi sovelluksissa on tärkeää varmistaa, että käyttäjä saa tehdä asioita, joita hän yrittää tehdä: auktorisointi. Jos käyttäjän tunnistaminen toimii mutta sovellus ei tarkista oikeuksia tarkemmin, on mahdollista päätyä esimerkiksi tilanteeseen, missä [käyttäjä pääsee tekemään epätoivottuja asioita](https://www.telegraph.co.uk/technology/facebook/10251869/Mark-Zuckerberg-Facebook-profile-page-hacked.html).


### Näkymätason auktorisointi

Määrittelimme aiemmin oikeuksia sovelluksen polkuihin liittyen. Tämä ei kuitenkaan aina riitä, vaan käyttöliittymissä halutaan usein rajoittaa toiminta esimerkiksi käyttäjäroolien perusteella. Thymeleaf-projektiin löytyy liitännäinen, jonka avulla voimme lisätä tarkistuksia HTML-sivuille. Liitännäisen saa käyttöön lisäämällä seuraavan riippuvuuden `pom.xml`-tiedostoon.

```xml
<dependency>
    <groupId>org.thymeleaf.extras</groupId>
    <artifactId>thymeleaf-extras-springsecurity5</artifactId>
</dependency>
```

Kun näkymien `html`-elementtiin lisätään `sec:`-nimiavaruuden määrittely, voidaan sivulle määritellä elementtejä, joiden sisältö näytetään vain esimerkiksi tietyllä roolilla kirjautuneelle käyttäjälle. Seuraavassa esimerkissä teksti "salaisuus" näkyy vain käyttäjälle, jolla on rooli "ADMIN".


```xml
<html xmlns="http://www.w3.org/1999/xhtml"
        xmlns:th="http://www.thymeleaf.org"
        xmlns:sec="http://www.springframework.org/security/tags">

    ...
    <div sec:authorize="hasAuthority('ADMIN')">
        <p>salaisuus</p>
    </div>
    ...
```

Attribuutilla `sec:authorize` määritellään säännöt, joita tarkistuksessa käytetään. Attribuutille käy mm. arvot `isAuthenticated()`, `hasAuthority('...')` ja `hasAnyAuthority('...')`. Lisää sääntöjä löytyy Spring Securityn dokumentaation kohdasta [Expression-Based Access Control](https://docs.spring.io/spring-security/site/docs/current/reference/html/authorization.html#el-access).


<text-box variant='hint' name='Näkymän muutokset liittyvät käytettävyyteen'>

Edellä lisätty toiminnallisuus liittyy sovelluksen käytettävyyteen. Vaikka linkkiä ei näytettäisi osana sivua, kuka tahansa voi muokata sivun rakennetta selaimellaan. Tällöin pyynnön voi myös tehdä osoitteeseen, jota sivulla ei aluksi näy.

Tämä pätee oikeastaan kaikkeen selainpuolen toiminnallisuuteen. Web-sivuilla Javascriptin avulla toteutettu dynaaminen toiminnallisuus on hyödyllistä käytettävyyden kannalta, mutta se ei millään tavalla takaa, että sovellus olisi turvallinen käyttää. Tietoturva toteutetaan suurelta osin palvelinpäässä.

</text-box>

### Metoditason auktorisointi

Pelkän näkymätason auktorisoinnin ongelmana on se, että usein toimintaa halutaan rajoittaa tarkemmin -- esimerkiksi siten, että tietyt operaatiot (esim. poisto tai lisäys) mahdollistetaan vain tietyille käyttäjille tai käyttäjien oikeuksille. Käyttöliittymän näkymää rajoittamalla ei voida rajoittaa käyttäjän tekemiä pyyntöjä, sillä pyynnöt voidaan tehdä myös "käyttöliittymän ohi" -- kukaan ei estä käyttäjää lähettämästä tietoa palvelimelle vaikkapa omaa ohjelmaa tai [Postmania](https://www.getpostman.com/downloads/) käyttäen.

<text-box variant='hint' name='Näkymän muutokset liittyvät käytettävyyteen'>
    
Sovelluksen konfiguraatioista riippuen saatamme joskus joutua ottamaan `@Secured`-annotaation erikseen käyttöön. Harjoitustehtävissä tätä annotaatiota ei tarvitse erikseen ottaa käyttöön. Lisäämällä tietoturvakonfiguraatiotiedostoon annotaation `@EnableGlobalMethodSecurity(securedEnabled = true, proxyTargetClass = true)`, Spring Security etsii metodeja, joissa käytetään sopivia annotaatioita ja suojaa ne. Suojaus tapahtuu käytännössä siten, että metodeihin luodaan proxy-metodit; aina kun metodia kutsutaan, kutsutaan ensin tietoturvakomponenttia, joka tarkistaa onko käyttäjä kirjautunut.

</text-box>

Saamme sovellukseemme käyttöön myös metoditason auktorisoinnin. Kun konfiguraatiotiedostoon on lisätty annotaatio, on käytössämme muun muassa annotaatio [@Secured](https://docs.spring.io/spring-security/site/docs/current/reference/html/jc.html#jc-method). Annotaation avulla voidaan määritellä roolit (tai oikeudet), joiden kohdalla annotoidun metodin kutsuminen on sallittua. Alla olevassa esimerkissä `post`-metodin käyttöön vaaditaan "ADMIN"-oikeudet.


```java
@Secured("ADMIN")
@PostMapping("/posts")
public String post() {
    // ..
    return "redirect:/posts";
}
```

Esimerkiksi jos käyttäjien tunnistaminen tapahtuu alla olevalla `UserDetailsService`-rajapinnan olettamalla metodilla, kukaan ei pääse tekemään POST-pyyntöä polkuun `/posts`.


```java
@Override
public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    Account account = accountRepository.findByUsername(username);
    if (account == null) {
        throw new UsernameNotFoundException("No such user: " + username);
    }

    return new org.springframework.security.core.userdetails.User(
            account.getUsername(),
            account.getPassword(),
            true,
            true,
            true,
            true,
            Arrays.asList(new SimpleGrantedAuthority("USER")));
}
```

Jos taas roolin tai oikeuden "USER" vaihtaa muotoon "ADMIN", pääsevät kaikki tekemään pyynnön kyseiseen metodiin.


<programming-exercise name='Hidden fields' tmcname='osa05-Osa05_08.HiddenFields'>

Tehtävässä on hahmoteltu viestien näyttämiseen tarkoitettua sovellusta.

Luo sovellukseen tietoturvakonfiguraatio, missä määritellään kaksi käyttäjää. Ensimmäisellä käyttäjällä "user", jonka salasana on "password" on "USER"-oikeus. Toisella käyttäjällä "postman", jonka salasana on "pat", on "POSTER"-oikeus. Toteuta tietoturvakonfiguraatio siten, että käyttäjiä ei lisätä tietokantaan.

Muokkaa näkymää `messages.html` siten, että vain käyttäjät, joilla on "POSTER"-oikeus näkee lomakkeen, jolla voi lisätä uusia viestejä.

Muokkaa lisäksi konfiguraatiota siten, että käyttäjä voi kirjautua ulos osoitteesta `/logout`. Voit käyttää seuraavaa koodia (joutunet lisäämään konfiguraatioon muutakin..).

```java
http.formLogin()
    .permitAll()
    .and()
    .logout()
    .logoutUrl("/logout")
    .logoutSuccessUrl("/login");
```

Lisää tämän jälkeen sovellukseen metoditason suojaus millä rajoitat POST-pyyntöjen tekemisen osoitteeseen `/message` vain käyttäjille, joilla on "POSTER"-oikeus. Vaikka testit päästäisivät sinut läpi jo ennen tämän toteutusta, tee se silti.

</programming-exercise>

Annotaatio `@Secured` määrittelee roolit, joilla metodia voi käyttää. Mikäli sovelluksessa haluaa tehdä tarkempaa tarkastelua, käytetään edellisen sijaan annotaatioita `@PreAuthorize` ja `@PostAuthorize`-annotaatioita. Lisää aiheesta mm. [Baeldungin oppaassa](https://www.baeldung.com/spring-security-method-security).


<text-box variant='hint' name='Rekisteröitymiseen liittyvää pohdintaa..'>

Käyttäjän identiteetin varmistaminen vaatii käyttäjälistan, joka taas yleensä ottaen tarkoittaa käyttäjän rekisteröintiä jonkinlaiseen palveluun. Käyttäjän rekisteröitymisen vaatiminen heti sovellusta käynnistettäessä voi rajoittaa käyttäjien määrää huomattavasti, joten rekisteröitymistä kannattaa pyytää vasta kun siihen on tarve.

Erillinen rekisteröityminen ja uuden salasanan keksiminen ei ole aina tarpeen. Web-sovelluksille on käytössä useita kolmannen osapuolen tarjoamia keskitettyjä identiteetinhallintapalveluita. Esimerkiksi [OAuth2](https://oauth.net/2/):n avulla sovelluskehittäjä voi antaa käyttäjilleen mahdollisuuden käyttää jo olemassaolevia tunnuksia. Myös erilaiset sosiaalisen median palveluihin perustuvat autentikointimekanismit ovat yleistyneet viime aikoina.

Merkittävään osaan näistä löytyy myös Spring-komponentit. Esimerkiki Facebookin käyttäminen kirjautumisessa on melko suoraviivaista -- aiheeseen löytyy opas mm. osoitteesta [http://www.baeldung.com/facebook-authentication-with-spring-security-and-social](http://www.baeldung.com/facebook-authentication-with-spring-security-and-social).

</text-box>
