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
    { title: "Osa 1", tba: "15.03.21" },
    { title: "Osa 2", tba: "15.03.21" },
    { title: "Osa 3", tba: "15.03.21" },
    { title: "Osa 4", tba: "22.03.21" },
    { title: "Osa 5", tba: "22.03.21" },
    { title: "Osa 6", tba: "22.03.21" },
    { title: "Osa 7", tba: "22.03.21" },
  ],
  splitCourses: false,
}

module.exports = {
  default: courseSettings,
}
