/**
 * The human layer. 10% of the site gets to be funny. This is it.
 * The French edition lives in data/fr/about.ts and must satisfy AboutContent.
 */

export interface AboutContent {
  heading: string;
  eyebrow: string;
  intro: string[];
  photo: { src: string; alt: string; caption: string };
  truth: { heading: string; body: string; statement: string };
  outside: { heading: string; items: { label: string; detail: string }[] };
}

export const about: AboutContent = {
  heading: "About Me: the real human layer",
  eyebrow: "Witty, candid, grounded",
  intro: [
    "I've been building for the web since 2004. In tech years, that means I have survived table layouts, Flash intros, the PHP renaissance, the JavaScript framework wars, and now the AI gold rush.",
    "I take systems architecture, schema validation, and database reliability extremely seriously. Myself? Not so much.",
  ],
  photo: {
    src: "/img/me.avif",
    alt: "Nicolas Desjardins",
    caption: "Actual photo. Not generated. Slightly compressed.",
  },
  truth: {
    heading: "The Unvarnished Truth",
    body: "These numbers are presented without context so that I look good. Data transparency matters, so here is the methodology for each one.",
    statement:
      "If an AI model can't parse an invoice or hallucinates tax calculations, it doesn't get merged. Period.",
  },
  outside: {
    heading: "Outside of terminal windows",
    items: [
      { label: "Tabletop strategist", detail: "D&D and Magic: The Gathering, Commander format. I build decks the way I build systems: redundancy first." },
      { label: "BBQ brisket smoker", detail: "Fourteen hours at 107 °C. Low, slow, and logged in a spreadsheet." },
      { label: "Chess tactician", detail: "Prefers positional grinds over tactical fireworks. Same as in production." },
      { label: "Dual-boot hardware enthusiast", detail: "Debian for work, Windows for games, and a drawer full of SATA cables I will definitely need one day." },
    ],
  },
};

export interface FactCard {
  id: string;
  label: string;
  /** Static numeric value; omitted for live counters. */
  value?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  /** Live counter type handled by the component. */
  live?: "hours-since-business-opened";
  methodology: string;
  icon: "graduation" | "headset" | "shield" | "bar-chart";
}

export const facts: FactCard[] = [
  {
    id: "years-of-studies",
    label: "Years of Studies",
    value: 20,
    icon: "graduation",
    methodology: "Calculated from kindergarten to university, because data transparency matters.",
  },
  {
    id: "hours-of-support",
    label: "Hours of Support",
    live: "hours-since-business-opened",
    icon: "headset",
    methodology: "Counted as 24/7 since opening PcSquad in 2012. The counter is live. So was I, mostly.",
  },
  {
    id: "hallucination-tolerance",
    label: "Tolerance for Hallucinations in Production",
    value: 0,
    decimals: 2,
    suffix: "%",
    icon: "shield",
    methodology: "Measured at merge time. The CI pipeline enforces it so I do not have to.",
  },
  {
    id: "stats-made-up",
    label: "of statistics on the web are made up",
    value: 68.6,
    decimals: 1,
    suffix: "%",
    icon: "bar-chart",
    methodology: "Including this one. Everything above it has a source.",
  },
];
