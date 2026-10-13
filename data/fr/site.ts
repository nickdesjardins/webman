/**
 * Édition française de data/site.ts. Même forme, mêmes identifiants, mêmes
 * liens; seul le texte visible est traduit. Doit satisfaire SiteContent.
 */
import type { SiteContent } from "@/data/site";

export const site: SiteContent = {
  name: "Nicolas Desjardins",
  shortName: "Nick Desjardins",
  handle: "nickdesjardins",
  domain: "webman.dev",
  url: "https://webman.dev",
  title: "Ingénieur systèmes principal devenu architecte en IA appliquée",
  tagline:
    "Relier les modèles de fondation de pointe à une infrastructure d'entreprise déterministe. Concevoir des moteurs RAG de production, des machines à états d'agents autocorrectrices et des services d'extraction à schéma imposé.",
  description:
    "Nicolas Desjardins est ingénieur en IA appliquée et ingénieur systèmes principal à Montréal, avec plus de 8 ans d'expérience en production sur des systèmes full-stack et d'infrastructure. Il conçoit des services d'extraction à schéma imposé, des moteurs de recherche hybrides, des pipelines d'agents LangGraph et des passerelles d'évaluation LLMOps.",
  keywords: [
    "Ingénieur en IA appliquée",
    "Ingénieur déployé chez le client",
    "Ingénieur solutions IA",
    "RAG",
    "Génération augmentée par récupération",
    "pgvector",
    "LangGraph",
    "FastAPI",
    "Pydantic",
    "LLMOps",
    "Next.js",
    "Montréal",
    "Télétravail Canada",
    "Télétravail États-Unis",
  ],
  email: "nick.desjardins@live.com",
  location: {
    label: "Grand Montréal, QC, Canada",
    city: "Montreal",
    region: "QC",
    country: "CA",
    note: "Ouvert aux mandats locaux, hybrides et en télétravail (Canada et États-Unis).",
  },
  availability: {
    status: "available",
    label:
      "Disponible pour des rôles seniors en IA appliquée et Forward Deployed (Montréal / télétravail Canada et États-Unis)",
    short: "Disponible pour des rôles seniors en IA appliquée",
  },
  links: {
    github: "https://github.com/nickdesjardins",
    linkedin: "https://www.linkedin.com/in/nicolas-desjardins/",
    resume: "/Nicolas-Desjardins-CV.pdf",
    resumeFileName: "Nicolas-Desjardins-CV.pdf",
  },
  nav: [
    { id: "overview", label: "Aperçu" },
    { id: "projects", label: "Projets" },
    { id: "nextblock", label: "NextBlock" },
    { id: "work", label: "Réalisations" },
    { id: "arsenal", label: "Arsenal" },
    { id: "experience", label: "Parcours" },
    { id: "about", label: "À propos" },
    { id: "contact", label: "Contact" },
  ],
  hero: {
    eyebrow: "Ingénierie en IA appliquée pour la production, pas pour les démos",
    heading: "Ingénieur systèmes principal devenu architecte en IA appliquée.",
    headingAccent: "architecte en IA appliquée",
    subheading:
      "Relier les modèles de fondation de pointe à une infrastructure d'entreprise déterministe. Concevoir des moteurs RAG de production, des machines à états d'agents autocorrectrices et des services d'extraction à schéma imposé.",
    primaryCta: { label: "Explorer les projets d'IA d'entreprise", href: "#projects" },
    secondaryCta: { label: "Inspecter la pile technique", href: "#arsenal" },
    proof: [
      { value: "8+", label: "ans aux commandes de systèmes en production" },
      { value: "30+", label: "propriétés numériques migrées sans aucune interruption de service" },
      { value: "200k+", label: "lignes de TypeScript livrées dans un CMS open source" },
    ],
  },
  contact: {
    heading: "Construisons des systèmes d'IA fiables qui fonctionnent vraiment en production.",
    body:
      "Si vous déployez des modèles de fondation dans une vraie entreprise et qu'il vous faut quelqu'un qui traite la validation de schéma, les budgets de latence et les modes de défaillance comme des exigences de premier ordre, on devrait se parler.",
    responseTime: "Réponse en moins d'un jour ouvrable.",
  },
  founded: 2004,
  businessOpened: new Date(2012, 0, 1),
};
