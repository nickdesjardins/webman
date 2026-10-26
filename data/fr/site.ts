/**
 * Édition française de data/site.ts. Même forme, mêmes identifiants, mêmes
 * liens; seul le texte visible est traduit. Doit satisfaire SiteContent.
 *
 * Titres : Nicolas n'est pas membre de l'Ordre des ingénieurs du Québec;
 * « ingénieur » (et « engineer ») est un titre réservé. Il se présente donc
 * comme « développeur », le terme des offres d'emploi québécoises
 * (« développeur IA », « développeur IA senior »). « Architecte » est aussi
 * un titre réservé au Québec et n'est pas utilisé pour le décrire.
 */
import type { SiteContent } from "@/data/site";

export const site: SiteContent = {
  name: "Nicolas Desjardins",
  shortName: "Nick Desjardins",
  brand: "Webman",
  brandAliases: ["Webman Dev", "webman.dev"],
  handle: "nickdesjardins",
  domain: "webman.dev",
  url: "https://webman.dev",
  title: "Développeur en IA appliquée et full-stack senior",
  metaTitle: "Nicolas Desjardins (Webman) | Automatisation IA, Montréal",
  tagline:
    "Je conçois des outils d'IA qui lisent vos documents, répondent à partir de vos propres fichiers et vous montrent la source.",
  description:
    "Nicolas (Nick) Desjardins (Webman), développeur en automatisation IA à Montréal : agents IA, traitement de documents, intégrations MCP. Permanent ou contrat.",
  summary:
    "Nicolas (Nick) Desjardins, qui travaille sous le nom Webman (webman.dev), est développeur en intelligence artificielle appliquée et développeur full-stack senior dans le Grand Montréal, au Québec, et travaille en français et en anglais. Consultant en intelligence artificielle et en automatisation des processus d'affaires pour les entreprises du Québec et du Canada, il conçoit du traitement de documents, des agents IA supervisés, une recherche avec citations dans les documents de l'entreprise et des intégrations MCP. Ses outils d'IA lisent les documents, répondent à partir des fichiers de l'entreprise en citant la source et continuent de fonctionner quand un fournisseur tombe en panne, avec plus de 8 ans d'expérience à faire tourner des systèmes web en production pour New Roots Herbal Inc. Il est ouvert aux postes permanents, aux contrats et aux placements par agence, en mode hybride à Montréal ou entièrement à distance, au Canada, aux États-Unis et partout dans le monde.",
  email: "nick.desjardins@live.com",
  location: {
    label: "Grand Montréal, QC, Canada",
    city: "Montréal",
    region: "QC",
    country: "CA",
    note: "Poste permanent, contrat ou placement par agence. Sur place, hybride ou entièrement à distance, partout dans le monde.",
  },
  availability: {
    status: "available",
    label:
      "Ouvert aux postes permanents, contrats et mandats d'agence · Montréal, hybride ou à distance partout dans le monde",
    short: "Ouvert : permanent, contrat ou agence",
    roles:
      "Postes visés : développeur en IA appliquée, Forward Deployed Engineer (FDE), solutions IA et développeur full-stack senior axé sur l'IA.",
  },
  links: {
    github: "https://github.com/nickdesjardins",
    linkedin: "https://www.linkedin.com/in/nicolas-desjardins/",
    resume: "/Nicolas-Desjardins-CV.pdf",
    resumeFileName: "Nicolas-Desjardins-CV.pdf",
  },
  nav: [
    { id: "overview", label: "Accueil", hidden: true },
    { id: "services", label: "Services" },
    { id: "projects", label: "Projets IA" },
    { id: "nextblock", label: "NextBlock" },
    { id: "work", label: "Sites web" },
    { id: "arsenal", label: "Compétences" },
    { id: "experience", label: "Parcours" },
    { id: "about", label: "À propos" },
    { id: "contact", label: "Contact" },
  ],
  hero: {
    role: "Développeur en IA appliquée",
    place: "Grand Montréal · français et anglais",
    promise:
      "Je conçois des outils d'IA qui lisent vos documents, répondent à partir de vos propres fichiers et vous montrent la source.",
    promiseAccent: "vous montrent la source",
    support:
      "Plus de 8 ans à faire tourner des systèmes web en production pour New Roots Herbal Inc. Quatre services d'IA livrés, au code public.",
    primaryCta: { label: "Voir ce que je construis", href: "#services" },
    resumeCta: "CV (PDF)",
    proof: [
      { value: "8+", label: "ans aux commandes de systèmes en production" },
      { value: "21/21", label: "factures de test lues sans erreur (7 oct. 2026)" },
      { value: "30+", label: "sites web migrés sans interruption" },
    ],
    demoLabel: "Voyez-le à l'œuvre",
    demoCaption: "Une facture en désordre entre. Des données propres et vérifiées en sortent.",
    portraitAlt: "Nicolas Desjardins",
  },
  /* Les deux questions reprennent contact.heading : la page s'ouvre et se ferme sur les mêmes deux lecteurs. */
  doors: {
    ariaLabel: "Raccourcis pour les recruteurs et les dirigeants d'entreprise",
    eyebrow: "En langage clair",
    lead:
      "Une seule page explique ce que je peux construire pour votre entreprise, comment le tout se branche sur les outils que votre équipe utilise déjà, et où vont vos données.",
    business: "Le travail s'accumule? Voir ce que je peux faire pour votre entreprise",
    hiring: "Vous recrutez? Voir mon parcours",
  },
  contact: {
    heading: "Vous recrutez, ou le travail s'accumule? Parlons-en.",
    body:
      "Poste permanent, contrat ou placement par votre agence : tout est bienvenu. Si les factures, les documents ou les courriels de clients s'accumulent, décrivez le problème dans vos mots et je vous dirai ce qu'il faudrait.",
    technical:
      "Pour les équipes techniques : la validation de schéma, les budgets de latence et les modes de défaillance sont des exigences, pas des détails.",
    responseTime: "Réponse en moins d'un jour ouvrable.",
  },
  founded: 2004,
  businessOpened: new Date(2012, 0, 1),
};
