export type Talk = {
  id: number;
  title: string;
  img: string;
  author: string;
  datetime?: string; // ISO 8601 e.g. "2025-10-03T20:00:00+02:00"
  hasBreak?: boolean;
  country?: string; // optional ISO 3166-1 alpha-2 (e.g. "CO")
  linkedin?: string;
  instagram?: string;
  youtube?: string;
  twitch?: string;
  twitter?: string;
  tiktok?: string;
  github?: string;
  web?: string;
};

export const talks: Talk[] = [
  {
    id: 0,
    title: "¿Por qué mi app es lenta? - Hablemos de pruebas de performance",
    img: "/speakers/rodrigo.webp",
    author: "Rodrigo Campos",
    datetime: "2025-10-03T20:00:00+02:00",
    web: "https://rodrigo-campos.dev/",
    linkedin: "https://www.linkedin.com/in/rcampostapia/",
  },
  {
    id: 1,
    hasBreak: true,
    title: "Preparándote para entrevistas técnicas sin morir en el intento",
    img: "/speakers/tatiana.webp",
    author: "Tatiana Rodríguez",
    datetime: "2025-10-03T20:30:00+02:00",
    linkedin: "https://www.linkedin.com/in/jessicatatianarodriguez",
    instagram: "https://www.instagram.com/tatanomada",
  },
  {
    id: 2,
    title: "Hazlo tú mismo: servidores y aplicaciones en tu casa",
    img: "/speakers/anibal.webp",
    author: "Anibal",
    datetime: "2025-10-03T21:30:00+02:00",
    twitch: "https://www.twitch.tv/TheAnibalOS",
    youtube: "https://www.youtube.com/@AnibalOS",
    twitter: "https://x.com/TheAnibalOS",
  },
  {
    id: 3,
    hasBreak: true,
    title: "Ampliar el impacto más allá del código",
    img: "/speakers/aleja.webp",
    author: "Aleja Henao Espitia",
    datetime: "2025-10-03T22:00:00+02:00",
    instagram: "https://www.instagram.com/alejahenaoe",
    linkedin: "https://www.linkedin.com/in/alejahenaoe/",
    tiktok: "https://www.tiktok.com/@alejahenaoe",
    github: "https://github.com/alejahenaoes",
    twitter: "https://x.com/Aastronautgirl",
  },
  {
    id: 4,
    title: "Patrones de diseño con React y Typescript",
    img: "/speakers/antonio.webp",
    author: "Antonio Rodríguez",
    datetime: "2025-10-03T23:00:00+02:00",
    linkedin: "https://www.linkedin.com/in/antoniorchagoya/",
  },
];
