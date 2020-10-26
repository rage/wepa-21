const courseSettings = {
  language: "fi",
  name: "Web-palvelinohjelmointi Java, Syksy 2020",
  siteUrl: "https://web-palvelinohjelmointi-s20.mooc.fi",
  subtitle: "Opi tekemään verkossa toimivia sovelluksia",
  slug: "web-palvelinohjelmointi-syksy-20",
  tmcCourse: "wepa-s20",
  quizzesId: "17d9683d-d127-4721-9a6e-bbf63414b0d7",
  tmcOrganization: "mooc",
  bannerPath: "banner.jpg",
  sidebarEntries: [
    {
      title: "Tietoa kurssista",
      path: "/",
    },
    {
      title: "Osaamistavoitteet",
      path: "/osaamistavoitteet",
    },
    {
      title: "Arvostelu ja kokeet",
      path: "/arvostelu-ja-kokeet",
    },
    { title: "Tukiväylät", path: "/tukivaylat" },
    { title: "Projekti", path: "/projekti"},
    {
      title: "Usein kysytyt kysymykset",
      path: "/usein-kysytyt-kysymykset",
    },
    { separator: true, title: "Web-palvelinohjelmointi Java" },
  ],
  sidebarFuturePages: [
//    { title: "Osa 1", tba: "26.10.20" },
    { title: "Osa 2", tba: "30.10.20" },
    { title: "Osa 3", tba: "06.11.20" },
    { title: "Osa 4", tba: "13.11.20" },
    { title: "Osa 5", tba: "20.11.20" },
    { title: "Osa 6", tba: "27.11.20" },
    { title: "Osa 7", tba: "04.12.20" },
  ],
  splitCourses: false,
}

module.exports = {
  default: courseSettings,
}
