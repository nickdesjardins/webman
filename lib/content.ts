/**
 * Locale-aware access to every data module. Components call getContent(locale)
 * instead of importing data/*.ts directly, so the French edition is a drop-in.
 */
import type { Locale } from "@/lib/i18n";
import * as enAbout from "@/data/about";
import * as enArsenal from "@/data/arsenal";
import * as enExperience from "@/data/experience";
import * as enNextblock from "@/data/nextblock";
import * as enProjects from "@/data/projects";
import * as enServices from "@/data/services";
import * as enSite from "@/data/site";
import * as enWork from "@/data/work";
import * as frAbout from "@/data/fr/about";
import * as frArsenal from "@/data/fr/arsenal";
import * as frExperience from "@/data/fr/experience";
import * as frNextblock from "@/data/fr/nextblock";
import * as frProjects from "@/data/fr/projects";
import * as frServices from "@/data/fr/services";
import * as frSite from "@/data/fr/site";
import * as frWork from "@/data/fr/work";

export interface Content {
  locale: Locale;
  site: enSite.SiteContent;
  projects: enProjects.Project[];
  services: { intro: enServices.ServicesIntro; items: enServices.ServiceItem[] };
  nextblock: enNextblock.NextblockContent;
  work: {
    workIntro: enWork.WorkIntro;
    attribution: Record<enWork.WorkAttribution, { label: string; detail: string }>;
    platform: enWork.WorkItem;
    campaignsIntro: enWork.SubIntro;
    campaigns: enWork.WorkItem[];
    employerAppsIntro: enWork.SubIntro;
    employerApps: enWork.WorkItem[];
    independent: enWork.WorkItem[];
    kindLabel: Record<enWork.WorkKind, string>;
  };
  arsenal: {
    arsenal: enArsenal.ArsenalCategory[];
    tierLabel: Record<enArsenal.ToolTier, string>;
    arsenalIntro: enArsenal.ArsenalIntro;
  };
  experience: {
    experience: enExperience.ExperienceItem[];
    education: enExperience.EducationItem[];
    careerSummary: enExperience.CareerSummary;
  };
  about: {
    about: enAbout.AboutContent;
    facts: enAbout.FactCard[];
  };
}

function bundle(
  locale: Locale,
  m: {
    site: typeof enSite;
    projects: typeof enProjects;
    services: typeof enServices;
    nextblock: typeof enNextblock;
    work: typeof enWork;
    arsenal: typeof enArsenal;
    experience: typeof enExperience;
    about: typeof enAbout;
  }
): Content {
  return {
    locale,
    site: m.site.site,
    projects: m.projects.projects,
    services: { intro: m.services.servicesIntro, items: m.services.services },
    nextblock: m.nextblock.nextblock,
    work: {
      workIntro: m.work.workIntro,
      attribution: m.work.attribution,
      platform: m.work.platform,
      campaignsIntro: m.work.campaignsIntro,
      campaigns: m.work.campaigns,
      employerAppsIntro: m.work.employerAppsIntro,
      employerApps: m.work.employerApps,
      independent: m.work.independent,
      kindLabel: m.work.kindLabel,
    },
    arsenal: {
      arsenal: m.arsenal.arsenal,
      tierLabel: m.arsenal.tierLabel,
      arsenalIntro: m.arsenal.arsenalIntro,
    },
    experience: {
      experience: m.experience.experience,
      education: m.experience.education,
      careerSummary: m.experience.careerSummary,
    },
    about: { about: m.about.about, facts: m.about.facts },
  };
}

const content: Record<Locale, Content> = {
  en: bundle("en", {
    site: enSite,
    projects: enProjects,
    services: enServices,
    nextblock: enNextblock,
    work: enWork,
    arsenal: enArsenal,
    experience: enExperience,
    about: enAbout,
  }),
  fr: bundle("fr", {
    site: frSite,
    projects: frProjects,
    services: frServices,
    nextblock: frNextblock,
    work: frWork,
    arsenal: frArsenal,
    experience: frExperience,
    about: frAbout,
  }),
};

export function getContent(locale: Locale): Content {
  return content[locale];
}
