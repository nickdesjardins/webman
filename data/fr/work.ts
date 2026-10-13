/**
 * Édition française de data/work.ts. Mêmes exports, mêmes identifiants, mêmes
 * URL, mêmes piles techniques et mêmes vignettes; seules les chaînes lues par
 * les visiteurs sont traduites.
 *
 * L'attribution compte. Le travail livré en emploi porte la valeur "employer"
 * et est crédité à New Roots Herbal Inc.; tout le reste porte "independent".
 * Les descriptions reflètent ce que chaque site en ligne montre réellement.
 * Les vignettes vivent dans /public/img/work/<id>.jpg (saisies le 9 octobre 2026).
 */

import type { SubIntro, WorkAttribution, WorkItem, WorkIntro, WorkKind } from "@/data/work";

export const workIntro: WorkIntro = {
  eyebrow: "Travail web en production",
  heading: "Livré pour le web depuis 2004.",
  description:
    "Avant les modèles de fondation, il y avait des boutiques en ligne, des systèmes de contenu et des pages de campagne qui devaient fonctionner le jour du lancement. Une sélection, regroupée par usage. Le travail accompli en emploi est attribué à l'employeur; tout le reste est indépendant.",
};

export const attribution: Record<WorkAttribution, { label: string; detail: string }> = {
  employer: {
    label: "Travail en emploi",
    detail:
      "Réalisé comme développeur web principal chez New Roots Herbal Inc. Ces propriétés web appartiennent à l'entreprise.",
  },
  independent: {
    label: "Indépendant",
    detail: "Produits personnels, mandats clients et expérimentations. Les miens, du début à la fin.",
  },
};

export const platform: WorkItem = {
  id: "newrootsherbal",
  title: "newrootsherbal.com: refonte complète de la plateforme",
  url: "https://newrootsherbal.com/",
  kind: "platform",
  attribution: "employer",
  lang: "EN / FR",
  summary:
    "Reconstruction complète de la présence web d'un fabricant de produits de santé naturels établi depuis 40 ans, sur Laravel 13: un CMS PHP sur mesure et une boutique en ligne, tous deux écrits à partir de zéro pour remplacer des dépendances tierces héritées.",
  highlights: [
    "Système de gestion de contenu sur mesure pour les produits, les pages et les campagnes, conçu pour l'équipe marketing qui l'utilise chaque jour.",
    "Boutique en ligne avec catalogue, panier et passage à la caisse, ainsi que les outils de gestion interne qui la font tourner.",
    "Localisateur de magasins bâti sur l'API Google Maps et système d'inventaire en temps réel avec synchronisation de base de données sans aucune défaillance.",
    "Migration sans interruption de service vers une infrastructure correctement dimensionnée, réduisant les coûts d'hébergement de plus de 40 %.",
  ],
  stack: ["Laravel 13", "PHP", "MySQL", "Blade", "JavaScript", "Google Maps API", "Linux VPS"],
  thumb: "/img/work/newrootsherbal.jpg",
};

export const campaignsIntro: SubIntro = {
  heading: "Microsites de campagne et d'éducation",
  description:
    "Dix-huit pages d'atterrissage pour les gammes de produits et les thèmes de santé de New Roots Herbal: des microsites Next.js autonomes sur leurs propres sous-domaines, plus des pages servies par la plateforme Laravel. Chacune est un entonnoir mesuré, conçu pour être lancé vite et convertir.",
};

export const campaigns: WorkItem[] = [
  { id: "vitamins", title: "Vitamines", url: "https://vitamins.newrootsherbal.com/", kind: "campaign", attribution: "employer", summary: "Entonnoir d'éducation et de produits sur les vitamines B et les multivitamines.", stack: ["Next.js"], thumb: "/img/work/vitamins.jpg" },
  { id: "aging", title: "Vieillir en santé", url: "https://aging.newrootsherbal.com/", kind: "campaign", attribution: "employer", summary: "Microsite de la gamme de produits pour vieillir en santé.", stack: ["Next.js"], thumb: "/img/work/aging.jpg" },
  { id: "women", title: "Santé des femmes", url: "https://women.newrootsherbal.com/", kind: "campaign", attribution: "employer", summary: "Microsite de la gamme de produits pour la santé des femmes.", stack: ["Next.js"], thumb: "/img/work/women.jpg" },
  { id: "digestion", title: "Digestion", url: "https://digestion.newrootsherbal.com/", kind: "campaign", attribution: "employer", summary: "Entonnoir d'éducation et de produits sur la santé digestive.", stack: ["Next.js"], thumb: "/img/work/digestion.jpg" },
  { id: "cardiac-health", title: "Santé cardiaque", url: "https://newrootsherbal.com/cardiac-health", kind: "campaign", attribution: "employer", summary: "Page d'atterrissage sur la santé cardiaque, servie par la plateforme Laravel.", stack: ["Laravel"], thumb: "/img/work/cardiac-health.jpg" },
  { id: "coughandcold", title: "Rhume et toux", url: "https://www.coughandcold.ca/", kind: "campaign", attribution: "employer", summary: "Campagne saisonnière rhume et toux sur son propre domaine.", stack: ["Next.js"], thumb: "/img/work/coughandcold.jpg" },
  { id: "omegas", title: "Omégas", url: "https://omegas.newrootsherbal.com/", kind: "campaign", attribution: "employer", summary: "Microsite de la gamme de produits d'acides gras oméga.", stack: ["Next.js"], thumb: "/img/work/omegas.jpg" },
  { id: "vitamin-d", title: "Vitamine D", url: "https://newrootsherbal.com/vitamin-d", kind: "campaign", attribution: "employer", summary: "Page d'atterrissage de sensibilisation à la vitamine D, servie par la plateforme Laravel.", stack: ["Laravel"], thumb: "/img/work/vitamin-d.jpg" },
  { id: "ukraine", title: "Soutien à l'Ukraine", url: "https://newrootsherbal.com/ukraine", kind: "campaign", attribution: "employer", summary: "Page de campagne de soutien humanitaire.", stack: ["Laravel"], thumb: "/img/work/ukraine.jpg" },
  { id: "stress", title: "Gérer le stress", url: "https://stress.newrootsherbal.com/", kind: "campaign", attribution: "employer", summary: "Entonnoir d'éducation et de produits sur la gestion du stress.", stack: ["Next.js"], thumb: "/img/work/stress.jpg" },
  { id: "prostateperform", title: "Prostate Perform", url: "https://prostateperform.ca/", kind: "campaign", attribution: "employer", summary: "Campagne monoproduit sur son propre domaine.", stack: ["Next.js"], thumb: "/img/work/prostateperform.jpg" },
  { id: "probiotics", title: "Probiotiques", url: "https://probiotics.newrootsherbal.com/", kind: "campaign", attribution: "employer", summary: "Microsite de la gamme de produits probiotiques.", stack: ["Next.js"], thumb: "/img/work/probiotics.jpg" },
  { id: "pain-management", title: "Gestion de la douleur", url: "https://newrootsherbal.com/pain-management", kind: "campaign", attribution: "employer", summary: "Page d'atterrissage sur la gestion de la douleur, servie par la plateforme Laravel.", stack: ["Laravel"], thumb: "/img/work/pain-management.jpg" },
  { id: "mushrooms", title: "Champignons médicinaux", url: "https://mushrooms.newrootsherbal.com/", kind: "campaign", attribution: "employer", summary: "Microsite de la gamme de produits de champignons médicinaux.", stack: ["Next.js"], thumb: "/img/work/mushrooms.jpg" },
  { id: "magnesium", title: "Magnésium", url: "https://magnesium.newrootsherbal.com/", kind: "campaign", attribution: "employer", summary: "Entonnoir d'éducation et de produits sur le magnésium.", stack: ["Next.js"], thumb: "/img/work/magnesium.jpg" },
  { id: "immune", title: "Santé immunitaire", url: "https://immune.newrootsherbal.com/", kind: "campaign", attribution: "employer", summary: "Microsite de la gamme de produits pour la santé immunitaire.", stack: ["Next.js"], thumb: "/img/work/immune.jpg" },
  { id: "oils", title: "Huiles exotiques", url: "https://oils.newrootsherbal.com/", kind: "campaign", attribution: "employer", summary: "Microsite de la gamme de produits d'huiles exotiques.", stack: ["Next.js"], thumb: "/img/work/oils.jpg" },
  { id: "essential-oils", title: "Huiles essentielles", url: "https://newrootsherbal.com/essential-oils", kind: "campaign", attribution: "employer", summary: "Page d'atterrissage sur les huiles essentielles, servie par la plateforme Laravel.", stack: ["Laravel"], thumb: "/img/work/essential-oils.jpg" },
];

export const employerAppsIntro: SubIntro = {
  heading: "Applications et outils internes",
  description:
    "Logiciels connexes aux produits, conçus pour la clientèle et le personnel de New Roots Herbal, au-delà du site web et de ses campagnes.",
};

export const employerApps: WorkItem[] = [
  {
    id: "smartstack",
    title: "SmartStack",
    url: "https://smartstack.smartstack-worker.workers.dev/",
    kind: "pwa",
    attribution: "employer",
    summary:
      "Application web progressive pensée mobile d'abord pour suivre les horaires de suppléments et la prise quotidienne, conçue pour New Roots Herbal et déployée sur Cloudflare Workers.",
    stack: ["PWA", "Cloudflare Workers", "TypeScript"],
  },
];

export const independent: WorkItem[] = [
  {
    id: "ryugu",
    title: "Ryūgū: Dix nuits vers le palais du Dragon",
    url: "https://japan.webman.dev/",
    kind: "personal",
    attribution: "independent",
    summary:
      "Un compagnon de voyage par chapitres pour un périple de onze jours autour du Japon et de Jeju: l'itinéraire, les légendes de dragons derrière chaque port, un programme jour par jour, l'étiquette, des phrases et du vocabulaire. Conçu d'abord comme une expérience de lecture.",
    stack: ["Next.js", "React"],
    thumb: "/img/work/ryugu.jpg",
  },
  {
    id: "thievescant",
    title: "Traducteur de Thieves' Cant",
    url: "https://www.thethievescant.com/",
    kind: "personal",
    attribution: "independent",
    lang: "EN / FR",
    summary:
      "Le compagnon du roublard de D&D 5e: traduisez l'anglais ou le français en Thieves' Cant, avec un dictionnaire, des symboles de guilde et des signes de vagabonds. Prototypé avec v0, terminé à la main.",
    stack: ["Next.js", "React", "v0"],
    thumb: "/img/work/thievescant.jpg",
  },
  {
    id: "civalgo-punch",
    title: "Civalgo Punch",
    url: "https://civalgo-punch.vercel.app/",
    kind: "experiment",
    attribution: "independent",
    summary:
      "Un système de pointage à l'arrivée et au départ en temps réel pour les travailleurs de chantier: un portail pour les travailleurs et un tableau de bord superviseur qui montre qui est sur le chantier en ce moment. Un exercice technique, gardé en ligne pour la démonstration.",
    stack: ["Next.js", "React", "Vercel"],
    thumb: "/img/work/civalgo-punch.jpg",
  },
  {
    id: "react-hooks",
    title: "Guide des hooks React",
    url: "https://react-hooks-delta-umber.vercel.app/",
    kind: "experiment",
    attribution: "independent",
    summary:
      "Une référence interactive pour chaque hook React, de useState à useImperativeHandle, avec des exemples en direct et un sélecteur de thème. Un bac à sable pédagogique, gardé en ligne pour la démonstration.",
    stack: ["Next.js", "React", "Vercel"],

    thumb: "/img/work/react-hooks.png",
  },
  {
    id: "musiquesd",
    title: "MusiqueSD",
    url: "https://www.musiquesd.com/",
    kind: "client",
    attribution: "independent",
    lang: "FR / EN",
    summary:
      "Site vitrine bilingue pour un studio d'enregistrement montréalais qui fait aussi de l'animation DJ et d'événements, de la location d'équipement et des cours de musique en ligne, avec un parcours de demande de soumission et une galerie.",
    stack: ["Next.js", "React"],
    thumb: "/img/work/musiquesd.jpg",
  },
  {
    id: "pcsquad",
    title: "PcSquad",
    url: "https://pcsquad.ca/",
    kind: "business",
    attribution: "independent",
    since: "2012",
    lang: "FR / EN",
    summary:
      "Ma première entreprise : un atelier régional de réparation d'ordinateurs et de création de sites web que j'ai fondé et dirigé comme propriétaire et PDG de 2012 à 2018, au service des particuliers et des PME des environs des Coteaux. Le site est toujours en ligne, bilingue, tel quel.",
    stack: ["HTML", "CSS", "JavaScript", "PHP"],
    thumb: "/img/work/pcsquad.jpg",
  },
];

export const kindLabel: Record<WorkKind, string> = {
  platform: "Plateforme",
  campaign: "Campagne",
  pwa: "PWA",
  client: "Site client",
  personal: "Personnel",
  experiment: "Expérimentation",
  business: "Entreprise personnelle",
};
