export const footerGroupLink = {
  loggedIn: [
    {
      title: { EN: "Design", UA: "Дизайн" },
      menu: [
        {
          title: { EN: "Discover", UA: "Огляд" },
          url: "/",
        },
        {
          title: { EN: "Profile", UA: "Профіль" },
          url: "/profile",
        },
      ],
    },
    {
      title: { EN: "Info", UA: "Інформація" },
      menu: [
        {
          title: { EN: "FAQ", UA: "Питання та відповіді" },
          url: "/faq",
        },
      ],
    },
  ],
  notLoggedIn: [
    {
      title: { EN: "Design", UA: "Дизайн" },
      menu: [
        {
          title: { EN: "Discover", UA: "Огляд" },
          url: "/",
        },
        {
          title: { EN: "Login", UA: "Увійти" },
          url: "/login",
        },
      ],
    },
    {
      title: { EN: "Info", UA: "Інформація" },
      menu: [
        {
          title: { EN: "FAQ", UA: "Питання та відповіді" },
          url: "/faq",
        },
        { title: { EN: "Registration", UA: "Реєстрація" }, url: "/register" },
      ],
    },
  ],
};
