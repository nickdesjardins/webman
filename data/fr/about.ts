/**
 * Édition française de data/about.ts. La couche humaine: 10 % du site a le
 * droit d'être drôle, et c'est ici. Les champs id, value, decimals, suffix,
 * live, icon et src sont identiques à la source anglaise.
 */
import type { AboutContent, FactCard } from "@/data/about";

export const about: AboutContent = {
  heading: "À propos de moi: la vraie couche humaine",
  eyebrow: "Pince-sans-rire, franc, les pieds sur terre",
  intro: [
    "Je construis pour le web depuis 2004. En années techno, ça veut dire que j'ai survécu aux mises en page en tableaux, aux intros Flash, à la renaissance de PHP, aux guerres de frameworks JavaScript et maintenant à la ruée vers l'or de l'IA.",
    "Je prends l'architecture, la validation de schémas et la fiabilité des bases de données très au sérieux. Moi-même? Pas tellement.",
  ],
  photo: {
    src: "/img/me.avif",
    alt: "Nicolas Desjardins",
    caption: "Vraie photo. Pas générée. Légèrement compressée.",
  },
  truth: {
    heading: "La vérité sans fard",
    body: "Ces chiffres sont présentés hors contexte pour que j'aie l'air bon. La transparence des données compte, alors voici la méthodologie derrière chacun.",
    statement:
      "Si un modèle d'IA n'arrive pas à lire une facture ou hallucine des calculs de taxes, il n'est pas fusionné. Point final.",
  },
  outside: {
    heading: "En dehors des fenêtres de terminal",
    items: [
      { label: "Stratège de table", detail: "D&D et Magic: The Gathering, format Commander. Je construis mes decks comme je construis mes systèmes: la redondance d'abord." },
      { label: "Fumeur de brisket au BBQ", detail: "Quatorze heures à 107 °C. À basse température, lentement, et consigné dans un tableur." },
      { label: "Tacticien aux échecs", detail: "Préfère les longues parties positionnelles aux feux d'artifice tactiques. Comme en production." },
      { label: "Passionné de matériel et de double démarrage", detail: "Debian pour le travail, Windows pour les jeux, et un tiroir plein de câbles SATA dont j'aurai certainement besoin un jour." },
    ],
  },
};

export const facts: FactCard[] = [
  {
    id: "years-of-studies",
    label: "Années d'études",
    value: 20,
    icon: "graduation",
    methodology: "Calculées de la maternelle à l'université, parce que la transparence des données compte.",
  },
  {
    id: "hours-of-support",
    label: "Heures de soutien",
    live: "hours-since-business-opened",
    icon: "headset",
    methodology: "Comptées en 24/7 depuis l'ouverture de PcSquad en 2012. Le compteur tourne en direct. Moi aussi, la plupart du temps.",
  },
  {
    id: "hallucination-tolerance",
    label: "Tolérance aux hallucinations en production",
    value: 0,
    decimals: 2,
    suffix: "%",
    icon: "shield",
    methodology: "Mesurée au moment de la fusion. Le pipeline CI s'en charge pour que je n'aie pas à le faire.",
  },
  {
    id: "stats-made-up",
    label: "des statistiques sur le web sont inventées",
    value: 68.6,
    decimals: 1,
    suffix: "%",
    icon: "bar-chart",
    methodology: "Y compris celle-ci. Tout ce qui précède a une source.",
  },
];
