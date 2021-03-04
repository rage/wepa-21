const courseSettings = {
  language: "fi",
  name: "Web-palvelinohjelmointi Java, 2021",
  siteUrl: "https://web-palvelinohjelmointi-21.mooc.fi",
  subtitle: "Opi tekemään verkossa toimivia sovelluksia",
  slug: "web-palvelinohjelmointi-21",
  tmcCourse: "wepa-21",
  quizzesId: "3f581eee-cf43-42fa-999c-46fdf14bc961",
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
//    { title: "Osa 2", tba: "30.10.20" },
//    { title: "Osa 3", tba: "06.11.20" },
//    { title: "Osa 4", tba: "13.11.20" },
//    { title: "Osa 5", tba: "20.11.20" },
//    { title: "Osa 6", tba: "27.11.20" },
//    { title: "Osa 7", tba: "04.12.20" },
  ],
  splitCourses: false,
}

module.exports = {
  default: courseSettings,
}
