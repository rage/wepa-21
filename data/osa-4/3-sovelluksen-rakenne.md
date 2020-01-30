---
path: '/osa-4/3-sovelluksen-rakenne'
title: 'Sovelluksen rakenne'
hidden: false
---

<text-box variant='learningObjectives' name='Oppimistavoitteet'>

- Tiedät MVC-arkkitehtuurin ja kerrosarkkitehtuurin.
- Tiedät mitä Front Controller -suunnittelumalli tarkoittaa.
- Osaat jakaa sovelluksen pienempiin sovelluksen sisäisiin palveluihin.

</text-box>


Web-sovellusten suunnittelussa noudatetaan useita arkkitehtuurimalleja. Tyypillisimpiä näistä ovat MVC-arkkitehtuuri sekä kerrosarkkitehtuuri. Kummassakin perusperiaatteena on vastuiden jako selkeisiin osakokonaisuuksiin.


### MVC-arkkitehtuuri

MVC-arkkitehtuurin tavoitteena on käyttöliittymän erottaminen sovelluksen toiminnasta siten, että käyttöliittymät eivät sisällä sovelluksen toiminnan kannalta tärkeää sovelluslogiikkaa. MVC-arkkitehtuurissa ohjelmisto jaetaan kolmeen osaan: malliin (*model*, tiedon tallennus- ja hakutoiminnallisuus), näkymään (*view*, käyttöliittymän ulkoasu ja tiedon esitystapa) ja käsittelijään (*controller*, käyttäjältä saatujen käskyjen käsittely sekä sovelluslogiikka).


MVC-malli yhdistetään tyypillisesti työpöytäsovelluksiin, missä käsittelijä voi olla jatkuvassa yhteydessä näkymään ja malliin. Tällöin käyttäjän yksittäinen toiminta käyttöliittymässä -- esimerkiksi tekstikentän tiedon päivitys -- liittyy tapahtumankäsittelijään, joka ohjaa tiedon malliin liittyvälle ohjelmakoodille, jonka tehtävänä on päivittää sovellukseen liittyvää tietoa tarvittaessa. Tapahtumankäsittelijä mahdollisesti sisältää myös ohjelmakoodia, joka pyytää muunnosta käyttöliittymässä.


Web-sovelluksissa käsittelijän ohjelmakoodia suoritetaan vain kun selain lähettää palvelimelle pyynnön. Ohjelmakoodissa haetaan esimerkiksi tietokannasta tietoa, joka ohjataan näkymän luontiin tarkoitetulle sovelluksen osalle. Kun näkymä on luotu, palautetaan se pyynnön tehneelle selaimelle. Spring-sovelluksissa kontrollereissa näkyvä `Model` viittaa tietoon, jota käytetään näkymän luomisessa -- se ei kuitenkaan vastaa MVC-mallin termiä model, joka liittyy kattavammin koko tietokantatoiminnallisuuteen.


<figure>
  <img src="../img/web-mvcish.png"/>
  <figcaption>
    Web-sovelluksissa käyttäjän pyyntö ohjautuu kontrollerille, joka sisältää sovelluslogiikkaa. Kontrolleri kutsuu pyynnöstä riippuen mallin toiminnallisuuksia ja hakee sieltä esimerkiksi tietoa. Tämän jälkeen pyyntö ohjataan näkymän luomisesta vastuulle olevalle komponentilla ja näkymä luodaan. Lopulta näkymä palautetaan vastauksena käyttäjän tekemälle pyynnölle.
  </figcaption>
</figure>


MVC-mallin perusidean noudattamisesta on useita hyötyjä. Käyttöliittymien (näkymien) suunnittelu ja toteutus voidaan eriyttää sovelluslogiikan toteuttamisesta, jolloin niitä voidaan työstää rinnakkain. Samalla ohjelmakoodi selkenee, sillä komponenttien vastuut ovat eriteltyjä -- näkymät eivät sisällä sovelluslogiikkaa, kontrollerin tehtävänä on käsitellä pyynnöt ja ohjata niitä eteenpäin, ja mallin vastuulla on tietoon liittyvät operaatiot. Tämän lisäksi sovellukseen voidaan luoda useampia käyttöliittymiä, joista jokainen käyttää samaa sovelluslogiikkaa, ja pyynnön kulku sovelluksessa selkiytyy.

<quiz id='5c98a55cddb6b814af32a9e2'></quiz>


###  Kerrosarkkitehtuuri


Kun sovellus jaetaan selkeisiin vastuualueisiin, selkeytyy myös pyynnön kulku sovelluksessa. Kerrosarkkitehtuuria noudattamalla pyritään tilanteeseen, missä sovellus on jaettu itsenäisiin kerroksiin, jotka toimivat vuorovaikutuksessa muiden kerrosten kanssa.

Spring-sovellusten yhteydessä kerrosarkkitehtuurilla tarkoitetaan yleisesti ottaen seuraavaa jakoa:

- Käyttöliittymäkerros
- Kontrollerikerros
- Sovelluslogiikka ja palvelut
- Tallennuslogiikka (tietokanta-abstraktio ja tietokantapalvelut)


Kerrosarkkitehtuuria noudattaessa ylempi kerros hyödyntää alemman kerroksen tarjoamia toiminnallisuuksia, mutta alempi kerros ei hyödynnä ylempien kerrosten tarjoamia palveluita. Puhtaassa kerrosarkkitehtuurissa kaikki kerrokset ovat olemassa, ja kutsut eivät ohita kerroksia ylhäältä alaspäin kulkiessaan. Tällä kurssilla noudatamme avointa kerrosarkkitehtuuria, missä kerrosten ohittaminen on sallittua -- jos sovelluksen ylläpidettävyys ja rakenne ei sitä kiellä, voi myös Repository-rajapinnan toteuttavat oliot sisällyttää kontrollereihin.

<figure>
  <img src="../img/layers.png"/>
  <figcaption>
    Kerrosarkkitehtuurissa sovelluksen vastuut jaetaan kerroksittain. Näkymäkerros sisältää käyttöliittymät, joista voidaan tehdä pyyntöjä kontrollerille. Kontrolleri käsittelee palveluita, jotka ovat yhteydessä tallennuslogiikkaan. Tiedon tallentamiseen käytettäviä entiteettejä sekä muita luokkia (esim "view objects") käytetään kaikilla kerroksilla.
  </figcaption>
</figure>


Käyttöliittymäkerros sisältää näkymät (esim. Thymeleafin html-sivut) sekä mahdollisen logiikan tiedon näyttämiseen (esim tägit html-sivuilla). Käyttöliittymä näkyy käyttäjän selaimessa, ja käyttäjän selain tekee palvelimelle pyyntöjä käyttöliittymässä tehtyjen klikkausten ja muiden toimintojen pohjalta. Palvelimella toimivan sovelluksen kontrollerikerros ottaa vastaan nämä pyynnöt, ja ohjaa ne eteenpäin sovelluksen sisällä.

Tarkastellaan seuraavaksi kontrollerikerrosta, sovelluslogiikkaa ja palveluita sekä tallennuslogiikkaa.


### Kontrollerikerros

Kontrollerien ensisijaisena vastuuna on pyyntöjen kuuntelu, pyyntöjen ohjaaminen sopiville palveluille, sekä tuotetun tiedon ohjaaminen oikealle näkymälle tai näkymän generoivalle komponentille.

Jotta palveluille ei ohjata epäoleellista dataa, esimerkiksi huonoja arvoja sisältäviä parametreja, on kontrolleritason vastuulla myös pyynnössä olevien parametrien validointi. Opimme validoimaan syötteitä hieman myöhemmin tällä kurssilla.

Kontrollerikerroksen luokissa käytetään annotaatiota `@Controller`, ja luokkien metodit, jotka vastaanottavat pyyntöjä annotoidaan esimerkiksi `@GetMapping`- ja `@PostMapping`-annotaatioilla.


### Palvelukerros


Palvelukerros tarjoaa kontrollerikerrokselle palveluita. Palvelut voivat esimerkiksi abstrahoida kolmannen osapuolen tarjoamia komponentteja tai rajapintoja, tai sisältää toiminnallisuutta, jonka toteuttaminen kontrollerissa ei ole järkevää esimerkiksi sovelluksen ylläpidettävyyden kannalta.

Palvelukerroksen luokat merkitään annotaatiolla `@Service` tai `@Component`. Tämä annotaatio tarkoittaa käytännössä sitä, että sovelluksen käynnistyessä luokasta tehdään olio, joka ladataan sovelluksen muistiin. Tämän jälkeen jokaiseen luotavaan olioon, jonka luokassa on `@Autowired`-annotaatiolla merkitty oliomuuttuja, sisällytetään muistiin ladattu olio.

Tarkastellaan edellisessä osassa ollutta tehtävää Bank Transfer sekä sen erästä mahdollista ratkaisua. Tehtävässä tavoitteena oli luoda sovellus, joka voi tehdä tilisiirron parametreina annettujen tilien välillä. Eräs ratkaisu on seuraavanlainen.


```java
@Controller
public class BankingController {

    @Autowired
    private AccountRepository accountRepository;

    @GetMapping("/")
    public String list(Model model) {
        model.addAttribute("accounts", this.accountRepository.findAll());
        return "index";
    }


    @Transactional
    @PostMapping("/")
    public String transfer(@RequestParam String from, @RequestParam String to, @RequestParam Integer amount) {
        Account accountFrom = this.accountRepository.findByIban(from);
        Account accountTo = this.accountRepository.findByIban(to);

        accountFrom.setBalance(accountFrom.getBalance() - amount);
        accountTo.setBalance(accountTo.getBalance() + amount);


        return "redirect:/";
    }
}
```

Yllä olevassa esimerkissä kontrollerin metodi `transfer` sisältää melko paljon sovelluslogiikkaa (noh, todellisuudessa 5 riviä ei ole vielä kovin paljoa). Erotetaan esimerkinomaisesti sovelluslogiikka kontrollerista ja luodaan erillinen luokka `BankingService`, joka sisältää pankkisovellukseen liittyvää sovelluslogiikkaa.

Luokka `BankingService` annotoidaan annotaatiolla `@Service`, jonka takia se päätyy Springin hallinnoimaksi. Tämä tarkoittaa sitä, että luokkaan voi injektoida springin hallinnoimia olioita ja että luokasta tehdyn olion voi injektoida muihin Springin hallinnoimiin luokkiin.

```java
@Service
public class BankingService {

}
```

Lisätään luokkaan tietokantatoiminnalisuus.


```java
@Service
public class BankingService {

    @Autowired
    private AccountRepository accountRepository;

}
```

Ja metodi tilisiirron tekemiseen.


```java
@Service
public class BankingService {

    @Autowired
    private AccountRepository accountRepository;

    @Transactional
    public void transfer(String from,String to, Integer amount) {
        Account accountFrom = this.accountRepository.findByIban(from);
        Account accountTo = this.accountRepository.findByIban(to);

        accountFrom.setBalance(accountFrom.getBalance() - amount);
        accountTo.setBalance(accountTo.getBalance() + amount);
    }

}
```

Kuten yltä huomaa, myös annotaation `@Transactional` voi määritellä myös `@Service`-annotaatiolla merkittyihin luokkiin.

Nyt `BankingController`-luokan toiminnallisuus kevenee hieman.


```java
@Controller
public class BankingController {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private BankingService bankingService;

    @GetMapping("/")
    public String list(Model model) {
        model.addAttribute("accounts", this.accountRepository.findAll());
        return "index";
    }

    @PostMapping("/")
    public String transfer(@RequestParam String from, @RequestParam String to,
                           @RequestParam Integer amount) {
        this.bankingService.transfer(from, to, amount);
        return "redirect:/";
    }
}
```

Yllä kontrolleriluokan metodi transfer on selkeä ja sen vastuulla on vain pyynnön vastaanottaminen sekä tehtävien delegointi.

Ehkäpä oleellisimpana etuna yllä olevassa muunnoksessa on se, että jatkossa myös muut tilisiirtoa mahdollisesti tarvitsevat sovelluksen osat voivat hyödyntää suoraan `BankingService`-luokassa määriteltyä metodia.

Tarkastellaan luokkaa `BankingController` vielä hieman. Luokkaan on injektoitu sekä aiemmin luomamme `BankingService` että `AccountRepository`. Tässä on esimerkki avoimesta arkkitehtuurista, jonka eräänä mahdollisena haittana on injektoitujen olioiden määrän kasvaminen. Puhtaassa arkkitehtuurissa kontrolleri ei riippuisi suoraan tietokannan muokkaamiseen liittyvästä `AccountRepository`-luokasta, vaan palvelutason komponentti `BankingService` tarjoaisi myös metodi tilien hakemiseen.

Lisätään luokkaan `BankingService` toiminnallisuus tilien hakemiseen ja muokataan luokkaa `BankingController` hyödyntämään tätä toiminnallisuutta.


```java
@Service
public class BankingService {

    @Autowired
    private AccountRepository accountRepository;

    public List<Account> list() {
        return accountRepository.findAll();
    }

    @Transactional
    public void transfer(String from, String to, Integer amount) {
        Account accountFrom = this.accountRepository.findByIban(from);
        Account accountTo = this.accountRepository.findByIban(to);

        accountFrom.setBalance(accountFrom.getBalance() - amount);
        accountTo.setBalance(accountTo.getBalance() + amount);
    }

}
```

Nyt luokassa `BankingController` ei enää tarvita suoraa riippuvuutta tietokanta-abstraktioon `AccountRepository`. Muokattuna toteutus on seuraava.


```java
@Controller
public class BankingController {

    @Autowired
    private BankingService bankingService;

    @GetMapping("/")
    public String list(Model model) {
        model.addAttribute("accounts", this.bankingService.list());
        return "index";
    }

    @PostMapping("/")
    public String transfer(@RequestParam String from, @RequestParam String to,
                           @RequestParam Integer amount) {
        this.bankingService.transfer(from, to, amount);
        return "redirect:/";
    }
}
```



<programming-exercise name='Jokes' tmcname='osa04-Osa04_03.Jokes'>

Tehtäväpohjassa on vitsejä kolmannen osapuolen verkkopalvelusta hakeva ja niitä käyttäjälle näyttävä sovellus. Sovellus tarjoaa vitsien tarkastelun lisäksi mahdollisuuden vitsien hyvyyden äänestämiseen. Tällä hetkellä sovelluksen luokka `JokeController` sisältää vitsien äänestämiseen liittyvää toiminnallisuutta.

Muokkaa sovelusta siten, että luot erillisen `VoteService`-luokan, joka kapseloi äänestystoiminnallisuuden. Uudessa versiossa luokan `JokeController` ei tule käyttää rajapintaa `VoteRepository` muuten kuin välillisesti `VoteService`-luokan kautta.

</programming-exercise>


### Tallennuslogiikka


Tallennuslogiikkakerros sisältää tiedon tallentamiseen liittyvät oleelliset oliot. Tämä sisältää niin relaatiotietokantojen käsittelyyn tarkoitettujen `JpaRepository`-rajapinnan perivät rajapinnat kuin muiden tietokantojen ja tietovarastojen käsittelyyn tarkoitetut luokat. Spring-sovelluksissa tiedon käsittelyyn käytetään tyypillisesti <a href="https://spring.io/projects/spring-data" target="_blank">Spring Data</a>-projektia, joka tarjoaa välineitä hyvin monenkaltaisten tietokantojen käsittelyyn. Esimerkiksi suositun <a href="https://www.mongodb.com/" target="_blank">MongoDB</a>-tietokannanhallintajärjestelmän käyttöönotto onnistuu <a href="https://spring.io/projects/spring-data-mongodb" target="_blank">Spring Data MongoDB</a>-projektin avulla kun taas hyvin laajat projektit voivat käyttää vaikkapa <a href="https://cassandra.apache.org/" target="_blank">Apache Cassandraa</a> <a href="https://spring.io/projects/spring-data-cassandra" target="_blank">Spring Data Cassandra</a>-projektin avulla.


<br/>

Tällä kurssilla käsittelemme Spring-sovelluskehyksen tarjoamia tallennusmahdollisuuksia hyvin pintapuolisesti, vain <a href="https://spring.io/projects/spring-data-jpa" target="_blank">Spring Data JPA</a>-projektia hyödyntäen. Tämä on tarkoituksenmukaista, sillä oikeastaan yhdellä kurssilla ei voisi mitenkään käsitellä kaikkia tiedon käsittelyyn tarjolla olevia välineitä.

<br/>


### Tietoa sisältävät oliot


Tiedon esittämiseen liittyvät oliot elävät kerrosarkkitehtuurissa kerrosten sivulla. Esimerkiksi entiteettejä voidaan käsitellä tallennuslogiikkakerroksella (tiedon tallennus), palvelukerroksella (tiedon käsittely), kontrollerikerroksella (tiedon lisääminen Model-olioon) sekä näkymäkerroksella (Model-olion käyttäminen näkymän luomiseen.


Sovellusten kehittämisessä näkee välillä myös jaon useampaan erilaiseen tietoa sisältävään oliotyyppiin. Entiteettejä käytetään tietokantatoiminnallisuudessa, mutta välillä näkymien käsittelyyn palautettavat oliot pidetään erillisinä entiteeteistä. Tähän ei ole oikeastaan yhtä oikeaa tapaa: lähestymistapa valitaan tyypillisesti ohjelmistokehitystiimin kesken.


<quiz id='5c98ca353972a9147410bbd0'></quiz>
