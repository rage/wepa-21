---
path: '/ekstra/tietokantamigraatiot'
title: 'Tietokantamigraatiot'
hidden: false
---


Ohjelmistojen kehityksessä tulee vastaan tyypillisesti tilanne, missä tuotantokäytössä olevaa tietokantaskeemaa tulee muuntaa. Koska käytössä oleva tietokantaversio voi poiketa ohjelmistokehittäjän koneesta riippuen -- joku saattaa työstää uutta versiota, jollain toisella voi olla työn alla korjaukset vanhempaan versioon -- tarvitaa myös tietokantamuutosten automatisointiin välineitä. Tähän käytetään esimerkiksi <a href="https://flywaydb.org/" target="_blank">Flyway</a>-kirjastoa, josta molemmista löytyy myös <a href="http://docs.spring.io/spring-boot/docs/current/reference/html/howto-database-initialization.html" target="_blank">Spring Boot</a>-ohjeet.


Käytännössä tietokantamigraatiot toteutetaan niin, että tietokannasta pidetään yllä tietokantataulujen muutos- ja muokkauskomennot sisältäviä versiokohtaisia tiedostoja. Käytössä olevaan tietokantaan on määritelty esimerkiksi taulu, jossa on tieto tämänhetkisestä versiosta. Jos käynnistettävässä sovelluksessa on uudempia muutoksia, ajetaan niihin liittyvät komennot tietokantaan ja tietokantaan merkitty versio päivittyy.

(automaattisesti..)
