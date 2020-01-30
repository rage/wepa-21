---
path: '/osa-4/1-mediatyyppi-ja-tiedostojen-kasittely'
title: 'Mediatyyppi ja tiedostojen käsittely'
hidden: false
---

<text-box variant='learningObjectives' name='Oppimistavoitteet'>

- Tunnet käsitteen mediatyyppi.
- Osaat käsitellä eri muodossa olevaa tietoa.
- Osaat luoda sovelluksen, joka mahdollistaa tiedoston lähettämisen palvelimelle.
- Osaat luoda sovelluksen, joka palauttaa tiedoston palvelimelta.
- Osaat tallentaa tiedostoja tietokantaan.

</text-box>


Palvelimelle tehtävät pyynnöt ja palvelimelta saatavat vastaukset voivat sisältää erimuotoista tietoa. Pyyntö tai vastaus voi sisältää esimerkiksi tekstidokumentin, kuvatiedoston tai vaikkapa PDF-tiedoston. Palvelin vastaanottaa ja kertoo pyynnön tyypin HTTP-protokollan mukana kulkevalla otsakkeella `Content-Type`.

Tätä tietoa lähetettävän tai vastaanotettavan datan muodosta kutsutaan [mediatyypiksi](https://en.wikipedia.org/wiki/Internet_media_type). Tietoa käsittelevä ohjelmisto päättää mediatyypin perusteella miten data käsitellään. Mediatyyppi sisältää yleensä kaksi osaa; mediatyypin sekä tarkenteen (esim `application/json`). Kattava lista eri mediatyypeistä löytyy IANA-organisaation ylläpitämästä [mediatyyppilistasta](http://www.iana.org/assignments/media-types/media-types.xhtml).

Tyypillisiä mediatyyppejä ovat erilaiset kuvat `image/*`, videot `video/*`, äänet `audio/*` sekä erilaiset tekstimuodot kuten JSON `application/json`.

Web-palvelut voivat tarjota käytännössä mitä tahansa näistä tiedostotyypeistä käyttäjälle; käyttäjän sovellusohjelmisto päättelee vastauksessa tulevan mediatyypin mukaan osaako se käsitellä tiedoston.

Yksinkertaisimmillaan mediatiedoston lähetys palvelimelta toimii Springillä seuraavasti. Oletetaan, että käytössämme on levypalvelin ja polussa `/media/data/` oleva PNG-kuvatiedosto `architecture.png`.

```java
@GetMapping(path = "/images/1", produces = "image/png")
public void copyImage(OutputStream out) throws IOException {
    Files.copy(Paths.get("/media/data/architecture.png"), out);
}
```

Yllä olevassa esimerkissä kerromme että metodi kuuntelee polkua `/images/1` ja tuottaa `image/png`-tyyppistä sisältöä. Spring asettaa kontrollerin metodin parametriksi pyynnön vastaukseen liittyvän `OutputStream`-olion, johon vastaus voidaan kirjoittaa. `Files`-luokan tarjoama `copy`-metodi kopioi kuvan suoraan tiedostosta pyynnön vastaukseksi.

Ylläolevan kontrollerimetodin palauttaman kuvan voi näyttää osana sivua `img`-elementin avulla. Jos metodi kuuntelee osoitetta `/media/image.png`, HTML-elementti `<img src="/media/image.png" />` hakee kuvan automaattisesti osoitteesta sivun latautuessa.

**Huom!** Jos kuvat ovat staattisia eikä niitä esimerkiksi lisäillä tai poisteta, tulee niiden olla esimerkiksi projektin kansiossa `/src/main/resources/public/img` -- tällaisille staattisille kuville **ei** tule määritellä kontrollerimetodia. Kansion `public` alla olevat tiedostot kopioidaan web-sovelluksen käyttöön, ja niihin pääsee käsiksi web-selaimella ilman tarvetta kontrollerille.



## Tiedostojen tallentaminen ja lataaminen

Web-sivuilta voi lähettää tiedostoja palvelimelle määrittelemällä `input`-elementin `type`-parametrin arvoksi `file`. Tämän lisäksi lomakkeelle tulee kertoa, että se voi sisältää myös tiedostoja -- tämä tapahtuu `form`-elementin attribuutilla `enctype`, jonka arvoksi asetetaan [multipart/form-data](http://www.w3.org/TR/html401/interact/forms.html#h-17.13.4.2)).


```xml
<form th:action="@{/files}" method="POST" enctype="multipart/form-data">
    <input type="file" name="file" />
    <input type="submit" value="Send!"/>
</form>
```

Lomake lähettää tiedot palvelimelle, jonka tulee käsitellä pyyntö. Pyynnön käsittely tapahtuu aivan kuten minkä tahansa muunkin pyynnön, mutta tässä tapauksessa pyynnön parametrin tyyppi on [MultipartFile](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/multipart/MultipartFile.html), joka sisältää lähetettävän tiedoston tiedot.

Alla oleva kontrollerimetodi vastaanottaa pyynnön, ja tulostaa pyynnössä lähetetyn tiedoston koon ja tyypin. Se ei kuitenkaan tee vielä muuta.

```java
@PostMapping("/files")
public String create(@RequestParam("file") MultipartFile file) {
    System.out.println(file.getSize());
    System.out.println(file.getContentType());

    return "redirect:/files";
}
```

`MultipartFile`-olio sisältää viitteen tavutaulukkoon, joka sisältää pyynnössä lähetetyn datan. Tavutaulukon -- eli tässä tapauksessa datan -- tallennus tietokantaan onnistuu seuraavasti. Alla määritelty entiteetti `FileObject` kapseloi tavutaulukon ja mahdollistaa sen tallentamisen tietokantaan.


```java
import javax.persistence.Entity;
import javax.persistence.Lob;
import org.springframework.data.jpa.domain.AbstractPersistable;

// muita sopivia annotaatioita
@Entity
public class FileObject extends AbstractPersistable<Long> {

    @Lob
    private byte[] content;

}
```

Annotaatiolla <a href="http://docs.oracle.com/javaee/6/api/javax/persistence/Lob.html" target="_blank">@Lob</a> kerrotaan että annotoitu muuttuja tulee tallentaa tietokantaan isona dataobjektina. Tietokantamoottorit tallentavat nämä tyypillisesti erilliseen isommille tiedostoille tarkoitettuun sijaintiin, jolloin tietokannan tehokkuus ei juurikaan kärsi erikokoisten kenttien takia.

<br/>

Kun entiteetille tekee repository-olion, voi sen ottaa käyttöön myös kontrollerissa. Tietokantaan tallentaminen tapahtuu tällöin seuraavasti:


```java
@PostMapping("/files")
public String save(@RequestParam("file") MultipartFile file) throws IOException {
    FileObject fo = new FileObject();
    fo.setContent(file.getBytes());

    fileObjectRepository.save(fo);

    return "redirect:/files";
}
```

Tiedoston lähetys kontrollerista onnistuu vastaavasti. Tässä tapauksessa oletamme, että data on muotoa `image/png`; kontrolleri palauttaa tietokantaoliolta saatavan tavutaulukon pyynnön vastauksen rungossa.


```java
@GetMapping(path = "/files/{id}", produces = "image/png")
@ResponseBody
public byte[] get(@PathVariable Long id) {
    return fileObjectRepository.findOne(id).getContent();
}
```

<programming-exercise name='GifBin' tmcname='osa04-Osa04_01.GifBin'>

Tässä tehtävässä toteutetaan sovellus gif-kuvien varastointiin ja selaamiseen.

Pääset toteuttamaan huomattavan osan sovelluksesta itse -- tarkista että suunnittelemasi domain-oliot sopivat yhteen annetun näkymän kanssa.

Tehtäväpohjassa olevassa `gifs.html`-sivussa on toiminnallisuus, minkä avulla kuvia näytetään käyttäjälle.

Toteuta toiminnallisuus, jonka avulla seuraavat toiminnot ovat käytössä.

- Kun käyttäjä tekee GET-tyyppisen pyynnön osoitteeseen `/gifs`, hänet ohjataan osoitteeseen `/gifs/1`.
- Kun käyttäjä tekee GET-tyyppisen pyynnön osoitteeseen `/gifs/{id}`, hänelle näytetään sivu `gifs`. Pyynnön modeliin tulee lisätä attribuutti `count`, joka sisältää tietokannassa olevien kuvien määrän. Tämän lisäksi, pyyntöön tulee lisätä attribuutti `next`, joka sisältää seuraavan kuvan tunnuksen -- jos sellainen on olemassa,  attribuutti `previous`, joka sisältää edeltävän kuvan tunnuksen -- jos sellainen on olemassa, ja `current`, joka sisältää nykyisen kuvan tunnuksen -- jos sellainen on olemassa.
- Kun käyttäjä tekee GET-tyyppisen pyynnön osoitteeseen `/gifs/{id}/content`, tulee hänelle palauttaa tunnukslla `{id}` tietokannassa oleva kuva -- vastauksen mediatyypiksi tulee asettaa myös `image/gif`.

HTML-sivulla on myös lomake, jonka avulla palvelimelle voi lähettää uusia kuvia. Toteuta palvelimelle toiminnallisuus, jonka avulla osoitteeseen `/gifs` tehdystä POST-pyynnöstä otetaan sisältö talteen ja tallennetaan se tietokantaa. Huom! Tallenna sisältö vain jos sen mediatyyppi on `image/gif`. Pyyntö uudelleenohjataan aina lopuksi osoitteeseen `/gifs`.

</programming-exercise>


Kun tietokantaan tallennetaan isoja tiedostoja, kannattaa tietokanta suunnitella siten, että tiedostot ladataan vain niitä tarvittaessa. Voimme lisätä olioattribuuteille annotaatiolla `@Basic` lisämääreen `fetch`, minkä avulla hakeminen rajoitetaan eksplisiittisiin kutsuihin. Tarkasta tässä vaiheessa edellisen tehtävän mallivastaus -- huomaat että sielläkin -- vaikka annotaatio `@Basic` ei ollut käytössä -- konkreettinen kuva ladataan hyvin harvoin.


```java
import javax.persistence.Basic;
import javax.persistence.Entity;
import javax.persistence.Lob;
import org.springframework.data.jpa.domain.AbstractPersistable;

// muut annotaatiot
@Entity
public class FileObject extends AbstractPersistable<Long> {

    @Lob
    @Basic(fetch = FetchType.LAZY)
    private byte[] content;

}
```

Ylläoleva `@Basic(fetch = FetchType.LAZY)` annotaatio luo annotoidun muuttujan get-metodiin ns. proxymetodin -- muuttujaan liittyvä data haetaan tietokannasta vasta kun metodia `getContent()` kutsutaan.


## Yleiskäyttöinen tiedoston tallennus ja lataaminen

Edellisessä esimerkissä määrittelimme kontrollerimetodin palauttaman mediatyypin osaksi `@GetMapping` annotaatiota. Usein tiedostopalvelimet voivat kuitenkin palauttaa lähes minkätyyppisiä tiedostoja tahansa. Tutustutaan tässä yleisempään tiedoston tallentamiseen ja lataukseen.

Käytämme edellisessä esimerkissä käytettyä `FileObject`-entiteettiä toteutuksen pohjana.

Jotta voimme kertoa tiedoston mediatyypin, haluamme tallentaa sen tietokantaan. Tallennetaan tietokantaan mediatyypin lisäksi myös tiedoston alkuperäinen nimi sekä tiedoston pituus.


```java
import javax.persistence.Basic;
import javax.persistence.Entity;
import javax.persistence.Lob;
import org.springframework.data.jpa.domain.AbstractPersistable;

// muut annotaatiot
@Entity
public class FileObject extends AbstractPersistable<Long> {

    private String name;
    private String mediaType;
    private Long size;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    private byte[] content;

}
```

Pääsemme kaikkiin kenttiin käsiksi `MultipartFile`-olion kautta; muokataan aiemmin näkemäämme kontrolleria siten, että täytämme kaikki yllä määritellyt kentät tietokantaan tallennettavaan olioon.


```java
@PostMapping("/files")
public String save(@RequestParam("file") MultipartFile file) throws IOException {
    FileObject fo = new FileObject();

    fo.setName(file.getOriginalName());
    fo.setMediaType(file.getContentType());
    fo.setSize(file.getSize());
    fo.setContent(file.getBytes());

    fileObjectRepository.save(fo);

    return "redirect:/files";
}
```

Nyt tietokantaan tallennettu olio tietää myös siihen liittyvän mediatyypin. Haluamme seuraavaksi pystyä myös kertomaan kyseisen mediatyypin tiedostoa hakevalle käyttäjälle.


[ResponseEntity](http://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/http/ResponseEntity.html)-oliota käytetään vastauksen paketointiin; voimme palauttaa kontrollerista ResponseEntity-olion, jonka pohjalta Spring luo vastauksen käyttäjälle. ResponseEntity-oliolle voidaan myös asettaa otsaketietoja, joihin saamme asetettua mediatyypin.


```java
@GetMapping("/files/{id}")
public ResponseEntity<byte[]> viewFile(@PathVariable Long id) {
    FileObject fo = fileObjectRepository.findOne(id);

    final HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.parseMediaType(fo.getContentType()));
    headers.setContentLength(fo.getSize());

    return new ResponseEntity<>(fo.getContent(), headers, HttpStatus.CREATED);
}
```

Ylläolevassa esimerkissä vastaanotetaan pyyntö, minkä pohjalta tietokannasta haetaan FileObject-olio. Tämän jälkeen luodaan otsakeolio `HttpHeaders` ja asetetaan sille palautettavan datan mediatyyppi ja koko. Lopuksi palautetaan `ResponseEntity`-olio, mihin data, otsaketiedot ja pyyntöön liittyvä statusviesti (tässä tapauksessa `CREATED` eli tiedosto luotu palvelimelle) liitetään.


Edeltävä esimerkki ei ota kantaa tiedoston nimeen tai siihen, miten se ladataan. Voimme lisäksi vastaukseen [Content-Disposition](http://www.w3.org/Protocols/rfc2616/rfc2616-sec19.html)-otsakkeen, minkä avulla voidaan ehdottaa tiedoston tallennusnimeä sekä kertoa että tiedosto on liitetiedosto, jolloin se tulee tallentaa.


```java
@GetMapping("/files/{id}")
public ResponseEntity<byte[]> viewFile(@PathVariable Long id) {
    FileObject fo = fileObjectRepository.findOne(id);

    final HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.parseMediaType(fo.getContentType()));
    headers.setContentLength(fo.getSize());
    headers.add("Content-Disposition", "attachment; filename=" + fo.getName());

    return new ResponseEntity<>(fo.getContent(), headers, HttpStatus.CREATED);
}
```

<programming-exercise name='FileManager' tmcname='osa04-Osa04_02.FileManager'>

Tässä tehtävässä toteutetaan yleisempi tiedostojen varastointiin ja näyttämiseen käytettävä sovellus.

Kuten edellisessä tehtävässä, pääset toteuttamaan huomattavan osan sovelluksesta itse -- tarkista että suunnittelemasi domain-oliot sopivat yhteen annetun näkymän kanssa.

Toteuta toiminnallisuus, jonka avulla seuraavat toiminnot ovat käytössä.

- Kun käyttäjä tekee GET-tyyppisen pyynnön osoitteeseen `/files`, pyyntöön lisätään tietokannasta löytyvät tiedostot ja käyttäjä ohjataan sivulle `files.html`.
- Kun käyttäjä lähettää lomakkeella tiedoston osoitteeseen `/files`, pyynnöstä otetaan talteen kaikki tiedot mitä näkymässä halutaan näyttää, ja tallennetaan ne tietokantaan. Pyyntö ohjataan lopuksi uudelleen osoitteeseen `/files`.
- Kun käyttäjä klikkaa yksittäiseen tiedostoon liittyvää nimeä sen lataamista varten, tulee tiedosto lähettää käyttäjälle. Aseta pyyntöön datan lisäksi myös tiedoston mediatyyppi että ja ehdotus tiedoston tallennusnimestä.


</programming-exercise>
