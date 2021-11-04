---
path: '/osa-5/2-autentikaatio-ja-auktorisointi'
title: 'Autentikaatio ja auktorisointi'
hidden: false
---


<text-box variant='learningObjectives' name='Oppimistavoitteet'>

- Osaat selittää autentikaation ja auktorisoinnin erot.
- Osaat luoda sovelluksen, joka pyytää käyttäjää kirjautumaan.
- Osaat määritellä kirjautumista vaativia polkuja ja metodeja, sekä piilottaa näkymän osia erilaisilta käyttäjäryhmiltä.

</text-box>


Autentikaatiolla tarkoitetaan käyttäjän tunnistamista esimerkiksi kirjautumisen yhteydessä, ja valtuutuksella, tai tuttavallisemmin auktorisoinnilla, tarkoitetaan käyttäjän oikeuksien varmistamista käyttäjän haluamiin toimintoihin.

Tunnistautumis- ja kirjautumistoiminnallisuus rakennetaan evästeiden avulla. Jos käyttäjällä ei ole evästettä, mikä liittyy kirjautuneen käyttäjän sessioon, hänet ohjataan kirjautumissivulle. Kirjautumisen yhteydessä käyttäjään liittyvään evästeeseen lisätään tieto siitä, että käyttäjä on kirjautunut -- tämän jälkeen sovellus tietää, että käyttäjä on kirjautunut.

Kirjautumissivuja ja -palveluita on kirjoitettu useita, ja sellainen löytyy lähes jokaisesta web-sovelluskehyksestä. Myös Spring-sovelluskehyksessä löytyy oma projekti kirjautumistoiminnallisuuden toteuttamiseen. Käytämme seuraavaksi [Spring Security](http://projects.spring.io/spring-security/) -projektia. Sen saa käyttöön lisäämällä Spring Boot -projektin `pom.xml`-tiedostoon seuraavan riippuvuuden.


```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

Yllä kuvattu riippuvuus tuo käyttöömme komponentin, joka tarkastelee pyyntöjä ennen kuin pyynnöt ohjataan kontrollerien metodeille. Jos käyttäjän tulee olla kirjautunut päästäkseen haluamaansa osoitteeseen, komponentti ohjaa pyynnön tarvittaessa erilliselle kirjautumisivulle -- tästä esimerkki mm. oppaassa [https://www.baeldung.com/spring-security-login](https://www.baeldung.com/spring-security-login).


<text-box variant='hint' name='Mistä käyttäjätunnus ja salasana?'>

Jos Spring Security -komponentin ottaa käyttöön, mutta ei luo siihen liittyvää konfiguraatiota, ovat oletuksena kaikki polut salattu. Käyttäjätunnus on oletuksena `user`, salasana löytyy sovelluksen käynnistyksen yhteydessä tulostuvista viesteistä.

Oletussalasanan voi asettaa konfiguraatiotiedostossa. Alla olevalla esimerkillä käyttäjätunnukseksi tulisi `user` ja salasanaksi `saippuakauppias`.

```
security.user.password=saippuakauppias
```

Salasanan lisääminen julkiseen versionhallintaan ei ole kuitenkaan hyvä idea. Salasanan voi asettaa myös tuotantoympäristön ympäristömuuttujien avulla. Esimerkiksi Herokun ympäristömuuttujien asettamiseen löytyy opas osoitteesta [https://devcenter.heroku.com/articles/config-vars](https://devcenter.heroku.com/articles/config-vars). Esimerkiksi ympäristömuuttujan `MYPASSWORD` saa käyttöön seuraavalla tavalla.

```
security.user.password=${MYPASSWORD}
```

Voit vaihtoehtoisesti myös luoda käyttöösi väliaikaisen konfiguraation, joka toteaa ettei pyyntöjä tarkasteta. Yksinkertaisimmillaan tämä näyttää seuraavalta.

```java
// importit ym

@Configuration
public class DevelopmentSecurityConfiguration
        extends WebSecurityConfigurerAdapter {

    @Override
    public void configure(WebSecurity sec) throws Exception {
        sec.ignoring().antMatchers("/**");
    }
}
```

</text-box>


## Tunnusten ja suojattavien sivujen määrittely

Kirjautumista varten luodaan erillinen konfiguraatiotiedosto, jossa määritellään sovellukseen liittyvät salattavat sivut. Oletuskonfiguraatiolla pääsy estetään käytännössä kaikkiin sovelluksen resursseihin, ja ohjelmoijan tulee kertoa ne resurssit, joihin käyttäjillä on pääsy.

Luodaan oma konfiguraatiotiedosto `SecurityConfiguration`, joka sisältää sovelluksemme tietoturvakonfiguraation. Huom! Konfiguraatiotiedostoja kannattaa luoda useampia -- ainakin yksi tuotantokäyttöön ja yksi sovelluksen kehittämiseen tarkoitetulle hiekkalaatikolle. Edellisessä osassa käytetyt konfiguraatioprofiilit ovat tässä erittäin hyödyllisiä.

```java
// pakkaus

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // Ei päästetä käyttäjää mihinkään sovelluksen resurssiin ilman
        // kirjautumista. Tarjotaan kuitenkin lomake kirjautumiseen, mihin
        // pääsee vapaasti. Tämän lisäksi uloskirjautumiseen tarjotaan
        // mahdollisuus kaikille.
        http.authorizeRequests()
                .anyRequest().authenticated().and()
                .formLogin().permitAll().and()
                .logout().permitAll();
    }

    @Bean
    @Override
    public UserDetailsService userDetailsService() {
        // withdefaultpasswordencoder on deprekoitu mutta toimii yhä
        UserDetails user = User.withDefaultPasswordEncoder()
                               .username("hei")
                               .password("maailma")
                               .authorities("USER")
                               .build();
        InMemoryUserDetailsManager manager = new InMemoryUserDetailsManager();
        manager.createUser(user);
        return manager;
    }
}
```

Yllä oleva tietoturvakonfiguraatio koostuu kahdesta osasta.

Ensimmäisessä osassa `configure(HttpSecurity http)` määritellään sovelluksen osoitteet, joihin on pääsy kielletty tai pääsy sallittu. Yllä todetaan, että käyttäjä tulee tunnistaa jokaisen pyynnön yhteydessä (`anyRequest().authenticated()`), mutta kirjautumiseen käytettyyn lomakkeeseen on kaikilla pääsy (`formLogin().permitAll()`). Vastaavasti uloskirjautumistoiminnallisuus on kaikille sallittu.

Toisessa osassa `public UserDetailsService userDetailsService()` määritellään käyttäjätietojen hakemiseen tarkoitetun `UserDetailsService`-rajapinnan toteuttava olio. Yllä luodaan ensin käyttäjätunnus `hei` salasanalla `maailma`. Käyttäjätunnuksella on rooli `USER` (tarkemmin pääsy resursseihin, joihin `USER`-käyttäjällä on pääsy -- palaamme näihin myöhemmin). Luotu käyttäjätunnus lisätään uuteen käyttäjien hallinnasta vastaavaan `InMemoryUserDetailsManager`-olioon -- olio toteuttaa `UserDetailsService`-rajapinnan.

<hr/>

Kun määritellään osoitteita, joihin käyttäjä pääsee käsiksi, on hyvä varmistaa, että määrittelyssä on mukana lause `anyRequest().authenticated()` -- tämä käytännössä johtaa tilanteeseen, missä kaikki osoitteet, joita ei ole erikseen määritelty, vaatii kirjautumista. Voimme määritellä osoitteita, jotka eivät vaadi kirjautumista seuraavasti:


```java
// ..
@Override
protected void configure(HttpSecurity http) throws Exception {
    http.authorizeRequests()
            .antMatchers("/free").permitAll()
            .antMatchers("/access").permitAll()
            .antMatchers("/to", "/to/*").permitAll()
            .anyRequest().authenticated().and()
            .formLogin().permitAll().and()
            .logout().permitAll();
}
// ..
```

Ylläolevassa esimerkissä osoitteisiin `/free` ja `/access` ei tarvitse kirjautumista. Tämän lisäksi kaikki osoitteet polun `/to/` alla on kaikkien käytettävissä. Loput osoitteet on kaikilta kielletty. Komento `formLogin().permitAll()` määrittelee sivun käyttöön kirjautumissivun, johon annetaan kaikille pääsy, jonka lisäksi komento `logout().permitAll()` antaa kaikille pääsyn uloskirjautumistoiminnallisuuteen.


<programming-exercise name='Hello Authentication' tmcname='osa05-Osa05_04.HelloAuthentication'>

Tehtävässä on sovellus viestien näyttämiseen. Tehtävänäsi on lisätä siihen salaustoiminnallisuus -- kenenkään muun kuin käyttäjän "maxwell_smart" ei tule päästä viesteihin käsiksi. Aseta Maxwellin salasanaksi "kenkapuhelin".

</programming-exercise>


Käyttäjätunnukset tallennetaan tyypillisesti tietokantaan, mistä ne voi tarvittaessa hakea. Salasanoja ei tule tallentaa selkokielisenä, sillä ne [voivat](http://www.forbes.com/sites/thomasbrewster/2015/10/28/000webhost-database-leak/) [joskus](https://techcrunch.com/2016/06/08/twitter-hack/) [päätyä](https://www.theregister.co.uk/2016/06/16/verticalscope_breach/) [vääriin](https://en.wikipedia.org/wiki/2012_LinkedIn_hack) [käsiin](https://www.independent.co.uk/life-style/gadgets-and-tech/news/gmail-hotmail-yahoo-email-passwords-stolen-hacked-hackers-russia-a7014711.html). Palaamme salasanojen tallentamismuotoon myöhemmin, nyt tutustumme vain siihen liittyvään tekniikkaan.



<text-box variant='hint' name='Klassinen erhe: USER'>

SQL-kielen spesifikaatiota heikosti tunteva aloitteleva web-ohjelmoija tekee usein `USER`-nimisen entiteetin tai attribuutin. Sana *user* on kuitenkin varattu SQL-spesifikaatiossa, joten sitä ei voi käyttää -- onneksi tietokantataulujen ja sarakkeiden nimiä voi muuttaa annotaatioilla..

</text-box>


Käyttäjätunnuksen ja salasanan noutamista varten luomme käyttäjälle entiteetin sekä sopivan repository-toteutuksen. Tarvitsemme lisäksi oman [UserDetailsService](https://docs.spring.io/spring-security/site/docs/current/api/org/springframework/security/core/userdetails/UserDetailsService.html)-rajapinnan toteutuksen, jota käytetään käyttäjän hakemiseen tietokannasta. Alla olevassa esimerkissä rajapinta on toteutettu siten, että tietokannasta haetaan käyttäjää. Jos käyttäjä löytyy, luomme siitä [User](https://docs.spring.io/spring-security/site/docs/current/api/org/springframework/security/core/userdetails/User.html)-olion, jonka palvelu palauttaa.


```java
// importit

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private AccountRepository accountRepository;

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
}
```

Kun oma UserDetailsService-luokka on toteutettu, voimme ottaa sen käyttöön SecurityConfiguration-luokassa.

```java
// ..

@Configuration
@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // mahdollistetaan h2-konsolin käyttö
        http.csrf().disable();
        http.headers().frameOptions().sameOrigin();

        http.authorizeRequests()
                .antMatchers("/h2-console", "/h2-console/**").permitAll()
                .anyRequest().authenticated();
        http.formLogin()
                .permitAll();
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

Edellisessä esimerkissä salasanojen tallentamisessa käytetään [BCrypt](https://docs.spring.io/spring-security/site/docs/current/api/org/springframework/security/crypto/bcrypt/BCryptPasswordEncoder.html)-algoritmia, joka rakentaa merkkijonomuotoisesta salasanasta hajautusarvon. Tällöin salasanoja ei ole tallennettu selkokielisenä, mutta salasanojen mekaaninen arvaaminen on toki yhä mahdollista.

<programming-exercise name='Hello Db Authentication' tmcname='osa05-Osa05_05.HelloDbAuthentication'>

Tehtävän ohjelmakoodiin on toteutettu käyttäjät tunnistava sovellus, joka tallentaa käyttäjien salasanat salattuna tietokantaan. Luo sovellukseen kaksi käyttäjää, joilla on samat salasanat. Käyttäjien luominen onnistuu polun `/accounts` kautta.

Käy tämän jälkeen tarkastelemassa sovelluksen tietokantaa H2-konsolissa. Vaikka kummankin lisäämäsi käyttäjän salasana on sama, pitäisi tietokannassa olevien hajautusarvojen olla erilaiset.

Tehtävässä ei ole testejä.

</programming-exercise>

<quiz id="06043931-3256-56c2-90b1-e5331c4d23c6"></quiz>


Kun käyttäjä on kirjautuneena, saa häneen liittyvän käyttäjätunnuksen ns. tietoturvakontekstista.

```java
Authentication auth = SecurityContextHolder.getContext().getAuthentication();
String username = auth.getName();
```

<quiz id="1b9a8219-bd69-5ffe-ac21-3c41b68fe032"></quiz>


Autentikaation tarpeen voi määritellä myös pyyntökohtaisesti. Alla olevassa esimerkissä GET-tyyppiset pyynnöt ovat sallittuja juuriosoitteeseen, mutta POST-tyyppiset pyynnöt juuriosoitteeseen eivät ole sallittuja.


```java
@Override
protected void configure(HttpSecurity http) throws Exception {
    // mahdollistetaan h2-konsolin käyttö
    http.csrf().disable();
    http.headers().frameOptions().sameOrigin();

    http.authorizeRequests()
        .antMatchers("/h2-console","/h2-console/**").permitAll()
        .antMatchers(HttpMethod.GET, "/").permitAll()
        .antMatchers(HttpMethod.POST, "/").authenticated()
        .anyRequest().authenticated();
    http.formLogin()
        .permitAll();
}
```

<programming-exercise name='Reservations' tmcname='osa05-Osa05_06.Reservations'>

Tehtävänäsi on täydentää kesken jäänyttä varaussovellusta siten, että kaikki käyttäjät näkevät varaukset, mutta vain kirjautuneet käyttäjät pääsevät lisäämään varauksia.

Kun käyttäjä tekee pyynnön sovelluksen juuripolkuun `/reservations`, tulee hänen nähdä varaussivu. Alla olevassa esimerkissä tietokannassa ei ole varauksia, mutta jos niitä on, tulee ne listata kohdan Current reservations alla.


<img src="../img/exercises/reservations-emptylist.png" />

Jos kirjautumaton käyttäjä yrittää tehdä varauksen, hänet ohjataan kirjautumissivulle. Kirjautumissivun ulkoasu on todennäköisesti erilainen kuin alla kuvattu kirjautumissivu.

<img src="../img/exercises/reservations-login.png" />

Kun kirjautuminen onnistuu, voi käyttäjä tehdä varauksia.

<img src="../img/exercises/reservations-reservations.png" />

Sovelluksen tulee kirjautumis- ja varaustoiminnallisuuden lisäksi myös varmistaa, että varaukset eivät mene päällekkäin.

Tarvitset ainakin:

- Palvelun käyttäjän tunnistautumiseen, jolla täydennät luokkaa SecurityConfiguration.
- Tavan aikaleimojen käsittelyyn.
- Kontrollerin varausten käsittelyyn ja tekemiseen.

Lisätty 10.4. -- lisäapua aikaleimojen käsittelyyn löytyy [tämän linkin takaa](/ekstra/ajan-kasittely-tietokannassa).

</programming-exercise>


## Käyttäjien roolit

Käyttäjillä on usein erilaisia oikeuksia sovelluksessa. Verkkokaupassa kaikki voivat listata tuotteita sekä lisätä tuotteita ostoskoriin, mutta vain tunnistautuneet käyttäjät voivat tehdä tilauksia. Tunnistautuneista käyttäjistä vain osa, esimerkiksi kaupan työntekijät, voivat tehdä muokkauksia tuotteisiin.

Tällaisen toiminnan toteuttamiseen käytetään oikeuksia, joiden lisääminen vaatii muutamia muokkauksia aiempaan kirjautumistoiminnallisuuteemme. Aiemmin näkemässämme luokassa `CustomUserDetailsService` noudettiin käyttäjä seuraavasti:

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

Palautettavan `User`-olion luomiseen liittyy lista oikeuksia. Yllä käyttäjälle on määritelty oikeus `USER`, mutta oikeuksia voisi olla myös useampi. Seuraava esimerkki palauttaa käyttäjän "USER" ja "ADMIN" -oikeuksilla.

```java
    return new org.springframework.security.core.userdetails.User(
            account.getUsername(),
            account.getPassword(),
            true,
            true,
            true,
            true,
            Arrays.asList(new SimpleGrantedAuthority("USER"), new SimpleGrantedAuthority("ADMIN")));
```

Oikeuksia käytetään käytettävissä olevien polkujen rajaamisessa. Voimme rajata luokassa `SecurityConfiguration` osan poluista esimerkiksi vain käyttäjille, joilla on `ADMIN`-oikeus. Alla olevassa esimerkissä kaikki käyttäjät saavat tehdä GET-pyynnön sovelluksen juuripolkuun. Vain `ADMIN`-käyttäjät pääsevät polkuun `/clients`, jonka lisäksi muille sivuille tarvitaan kirjautuminen (mikä tahansa oikeus). Kuka tahansa pääsee kirjautumislomakkeeseen käsiksi.


```java
@Override
protected void configure(HttpSecurity http) throws Exception {
    http.authorizeRequests()
            .antMatchers(HttpMethod.GET, "/").permitAll()
            .antMatchers("/clients").hasAnyAuthority("ADMIN")
            .anyRequest().authenticated();
    http.formLogin()
            .permitAll();
}
```

Oikeuksia varten määritellään tyypillisesti erillinen tietokantataulu, ja käyttäjällä voi olla useampia oikeuksia.


<programming-exercise name='Only for the Selected' tmcname='osa05-Osa05_07.OnlyForTheSelected'>

Sovelluksessa on `Account` entiteetti, jolle on määritelty käyttäjätunnus, salasana ja lista oikeuksia. Sovelluksessa näitä oikeuksia ei kuitenkaan oteta huomioon.

Muokkaa ensin luokkaa `CustomUserDetailsService` siten, että sovellus ottaa käyttäjän oikeudet huomioon.

Kun luokka `CustomUserDetailsService` huomioi käyttäjän oikeudet, suojaa sovelluksen polut seuraavasti:

- Kuka tahansa saa nähdä polusta `/happypath` palautetun tiedon
- Vain USER tai ADMIN -käyttäjät saavat nähdä polusta `/secretpath` palautetun tiedon
- Vain ADMIN-käyttäjät saavat nähdä polusta `/adminpath` palautetun tiedon


</programming-exercise>

<text-box variant='hint' name='Käyttäjän luominen'>

Käyttäjien luominen tapahtuu sovelluksissa tyypillisesti erillisen "rekisteröidy"-sivun kautta. Tämä on sivu, missä muutkin sivut, ja tallentaa tietoa tietokantaan normaalisti. Käyttäjän salasanan luomisessa tosin hyödynnetään esimerkiksi BCrypt-salausta.

</text-box>


### Muutama sana salasanoista

Salasanoja ei tule tallentaa selväkielisenä tietokantaan. Salasanoja ei tule -- myöskään -- tallentaa salattuna tietokantaan ilman, että niihin on lisätty erillinen "suola", eli satunnainen merkkijono, joka tekee salasanasta hieman vaikeammin tunnistettavan.

Vuonna 2010 tehty tutkimus vihjasi, että noin 75% ihmisistä käyttää samaa salasanaa sähköpostissa ja sosiaalisen median palveluissa. Jos käyttäjän sosiaalisen median salasana vuodetaan selkokielisenä, on siis mahdollista, että samalla myös hänen salasana esimerkiksi Facebookiin tai Google Driveen on päätynyt julkiseksi tiedoksi. Jos ilman "suolausta" salattu salasana vuodetaan, voi se mahdollisesti löytyä verkossa olevista valmiista salasanalistoista, mitkä sisältävät salasana-salaus -pareja. [Jostain syystä salasanat ovat myös usein ennustettavissa](http://wpengine.com/unmasked/).


Suolan lisääminen salasanaan ei auta tilanteissa, missä salasanat ovat ennustettavissa, koska salasanojen koneellinen läpikäynti on melko nopeaa. Salausmenetelmänä kannattaakin käyttää sekä salasanan suolausta, että algoritmia, joka on hidas laskea. Eräs tällainen on jo valmiiksi Springin kautta käyttämämme [BCrypt](https://en.wikipedia.org/wiki/Bcrypt)-algoritmi.


<figure>

<img src="http://imgs.xkcd.com/comics/password_strength.png">

<figcaption>https://xkcd.com/936/ -- xkcd: Password strength. </figcaption>

</figure>


## Profiilit ja käyttäjät

Kuten aiemmin kurssilla opimme, osa Springin konfiguraatiosta tapahtuu ohjelmallisesti. Esimerkiksi tietoturvaan liittyvät asetukset, esimerkiksi aiemmin näkemämme `SecurityConfiguration`-luokka, määritellään usein ohjelmallisesti. Haluamme kuitenkin luoda tilanteen, missä tuotannossa on eri asetukset kuin kehityksessä.

Tämä onnistuu `@Profile`-annotaation avulla, jonka kautta voimme asettaa tietyt luokat tai metodit käyttöön vain kun `@Profile`-annotaatiossa määritelty profiili on käytössä. Esimerkiksi aiemmin luomamme `SecurityConfiguration`-luokka voidaan määritellä tuotantokäyttöön seuraavasti:

```java
// importit

@Profile("production")
@Configuration
@EnableWebSecurity
public class ProductionSecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .anyRequest().authenticated();
        http.formLogin()
                .permitAll();
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

Voimme luoda erillisen tietoturvaprofiilin, jota käytetään oletuksena sovelluskehityksessä. Oletusprofiili määritellään merkkijonolla `default`.

```java
// importit

@Profile("default")
@Configuration
@EnableWebSecurity
public class DefaultSecurityConfiguration extends WebSecurityConfigurerAdapter {

    // paikallinen profiili
}
```


Nyt tuotantoympäristössä käyttäjät noudetaan tietokannasta, mutta kehitysympäristössä on täysin erillinen konfiguraatio. Jos profiilia ei ole erikseen määritelty, käytetään oletusprofiilia (default).
