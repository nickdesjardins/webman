/**
 * Édition française de data/projects.ts. Mêmes identifiants, mêmes index,
 * mêmes statuts, mêmes liens, mêmes piles techniques et mêmes valeurs de
 * métriques; seul le texte visible est traduit. Doit exporter exactement
 * les mêmes noms que le module anglais et satisfaire ses interfaces.
 *
 * Le projet 1 est en production. Ses preuves proviennent du README du dépôt
 * et de relevés de banc d'essai datés, donc chaque chiffre est vérifiable.
 * Les projets 2 à 4 sont des architectures jalonnées d'un plan de livraison
 * de 120 jours; leurs métriques sont des cibles de conception explicites,
 * étiquetées comme telles.
 */
import type { Project } from "@/data/projects";

export const projects: Project[] = [
  {
    id: "invoice-extraction-service",
    index: "01",
    phase: "Phase 1 · Livré",
    title: "Service d'extraction de factures",
    shortTitle: "Extraction de factures",
    status: "live",
    statusLabel: "En production, code ouvert",
    featured: true,
    summary:
      "Un microservice FastAPI asynchrone qui transforme des documents désordonnés et non structurés en un enregistrement de facture garanti, validé par schéma. La résilience vient du routage entre modèles, pas entre fournisseurs. Un modèle principal gratuit bascule vers un second fournisseur en cas de limite de débit, de délai dépassé ou d'exception de schéma, à coût marginal nul.",
    problem:
      "Les équipes des comptes fournisseurs reçoivent leurs factures sous forme de sorties OCR brutes, de fils de courriels transférés, de reçus de caisse et de PDF en langue étrangère. Un appel LLM brut renvoie de la prose, des blocs de code délimités ou un objet JSON de la mauvaise forme, et une seule panne chez un fournisseur bloque toute la file d'entrée.",
    architecture:
      "Les requêtes sont validées par Pydantic v2 avant tout appel de modèle. Le répartiteur parcourt une chaîne ordonnée de modèles avec décodage contraint par json_schema strict, à température 0. Chaque tentative s'exécute sous un délai d'expiration ferme et traduit les exceptions du SDK en une taxonomie d'erreurs unique. La sortie brute est débarrassée de ses délimiteurs de code et de ses préambules de raisonnement, analysée, puis normalisée par des validateurs qui recalculent les totaux de ligne au cent près et convertissent les symboles monétaires en codes ISO-4217. Le service veille aussi sur sa propre chaîne. Quand un modèle gratuit est retiré, il reteste le catalogue gratuit avec sept documents d'exemple et comble le vide selon une règle d'ordonnancement publiée.",
    stack: [
      "Python 3.12",
      "FastAPI",
      "Pydantic v2",
      "OpenRouter",
      "httpx",
      "Pytest",
      "GitHub Actions",
      "Render",
    ],
    pipeline: [
      {
        name: "Ingestion",
        detail: "ExtractRequest, 10 à 50k caractères, plafond de 1 Mo sur le corps, refusé avant lecture",
      },
      {
        name: "Durcissement",
        detail: "Neutralisation des injections de prompt, middleware request-id, budget d'appels avec Retry-After",
      },
      {
        name: "Modèle principal",
        detail: "json_schema strict, température 0, délai d'expiration ferme",
      },
      {
        name: "Fallback",
        detail: "Autre fournisseur, déclenché seulement après un appel échoué",
      },
      {
        name: "Récupération",
        detail: "Retrait des délimiteurs, suppression du préambule de raisonnement, décodage JSON",
      },
      {
        name: "Validation",
        detail: "InvoiceData.model_validate, recalcul des totaux, ISO-4217",
      },
    ],
    proofPoints: [
      "Dix classes de défaillance exercées hors ligne dans les tests de cascade, soit 429, 503, 404, délai dépassé, exception inattendue, JSON invalide, schéma non conforme, réponse vide, erreur amont intégrée à la réponse et sortie tronquée.",
      "La suite de tests ne peut pas atteindre le réseau, par construction. Chaque chemin sortant est fermé dans conftest, et un test qui tente d'en emprunter un échoue immédiatement.",
      "Instantané du banc d'essai daté du 7 octobre 2026. 3 passes de 7 documents par modèle, chaque appel enregistré en JSONL pour que les chiffres puissent être recalculés sans appeler de modèle.",
      "Chaque chiffre de la page du projet est vérifié par un test contre les enregistrements. Une phrase qui ne découle pas des données fait échouer le build.",
      "Côté journalisation, le modèle et la durée sont consignés, jamais le nom du fournisseur ni le numéro de facture au-dessus du niveau DEBUG.",
    ],
    metrics: [
      {
        value: "21 / 21",
        label: "entièrement corrects, modèle principal, banc d'essai daté",
        kind: "measured",
      },
      {
        value: "10",
        label: "classes de défaillance de fournisseur couvertes hors ligne",
        kind: "measured",
      },
      {
        value: "0",
        label: "appel réseau permis dans la suite de tests",
        kind: "measured",
      },
      {
        value: "0,00 $",
        label: "de coût marginal par requête sur la chaîne par défaut",
        kind: "measured",
      },
    ],
    links: [
      {
        label: "Documentation en ligne",
        href: "https://nickdesjardins.github.io/Invoice-Extraction-Service/",
        kind: "docs",
      },
      {
        label: "Code source sur GitHub",
        href: "https://github.com/nickdesjardins/Invoice-Extraction-Service",
        kind: "github",
      },
    ],
  },
  {
    id: "hybrid-compliance-retrieval-engine",
    index: "02",
    phase: "Phase 2 · Jalon",
    title: "Moteur de recherche hybride et contextuel pour la conformité",
    shortTitle: "Moteur de recherche hybride",
    status: "pipeline",
    statusLabel: "En cours de réalisation",
    delivery: "Livraison, jours 31 à 60",
    summary:
      "Un moteur de recherche pour documents réglementaires, procédures opératoires normalisées et dossiers de produits, qui répond avec des citations au paragraphe près plutôt qu'avec des suppositions plausibles. La recherche dense et la recherche lexicale s'exécutent en parallèle dans PostgreSQL, les candidats sont fusionnés, puis réduits à une poignée de passages à haute confiance par un cross-encoder.",
    problem:
      "Le RAG naïf découpe le texte au nombre de caractères et classe par similarité cosinus seulement. Il rate les codes SKU exacts et les termes réglementaires, fragmente le contexte et invite aux citations hallucinées. En contexte de conformité, ce n'est pas un problème de qualité, c'est un risque juridique.",
    architecture:
      "Les documents multipages sont segmentés sur leurs frontières structurelles. Suivant le patron Contextual Retrieval d'Anthropic, un worker alimenté par un modèle ajoute en tête de chaque segment le contexte du document et de la section avant l'indexation. Les segments sont stockés une seule fois dans PostgreSQL, avec un index pgvector HNSW (m=16, ef_construction=64) et un index inversé tsvector natif. Les requêtes exécutent la recherche dense et BM25 en concurrence, fusionnent les listes par Reciprocal Rank Fusion (k=60) et transmettent les 50 meilleurs candidats à Cohere Rerank 3. Les 3 meilleurs passages atteignent le modèle, contraint à un schéma Pydantic contenant la réponse, les citations textuelles à l'appui et les identifiants de source exacts, ou un verdict explicite de contexte insuffisant.",
    stack: [
      "PostgreSQL",
      "pgvector (HNSW)",
      "tsvector / BM25",
      "Reciprocal Rank Fusion",
      "Cohere Rerank 3",
      "Anthropic Contextual Retrieval",
      "Claude Sonnet",
      "FastAPI",
    ],
    pipeline: [
      { name: "Ingestion", detail: "Segmentation structurelle, préambule contextuel par segment" },
      { name: "Indexation", detail: "pgvector HNSW + tsvector dans un seul schéma PostgreSQL" },
      { name: "Recherche", detail: "Dense et BM25 en parallèle, top 50 chacune" },
      { name: "Fusion", detail: "Reciprocal Rank Fusion, k=60" },
      { name: "Reclassement", detail: "Attention croisée Cohere Rerank 3, de 50 à 3" },
      {
        name: "Réponse",
        detail: "Sortie contrainte par schéma, citations textuelles et identifiants de source",
      },
    ],
    proofPoints: [
      "Les URL et citations hallucinées sont éliminées structurellement, puisque le modèle ne peut citer que des identifiants présents dans l'ensemble récupéré.",
      "Une seule base de données pour les vecteurs, la recherche lexicale et les métadonnées relationnelles retire un magasin vectoriel distinct de la surface opérationnelle.",
      "Les tests unitaires s'exécutent sur des vecteurs d'embedding simulés, de sorte que la logique de recherche est vérifiée sans modèle ni clé API.",
    ],
    metrics: [
      { value: "< 800 ms", label: "latence p95 de bout en bout", kind: "target" },
      { value: "98%+", label: "fidélité au contexte sur le jeu de référence", kind: "target" },
      { value: "50 à 3", label: "compression des candidats avant génération", kind: "target" },
      { value: "0", label: "citation non fondée, par construction", kind: "target" },
    ],
  },
  {
    id: "multi-agent-operations-pipeline",
    index: "03",
    phase: "Phase 3 · Jalon",
    title: "Pipeline d'opérations multiagent autonome",
    shortTitle: "Opérations multiagents",
    status: "pipeline",
    statusLabel: "En cours de réalisation",
    delivery: "Livraison, jours 61 à 90",
    summary:
      "Un flux de travail LangGraph cyclique qui coordonne les requêtes SQL d'inventaire, la rédaction de textes propres à chaque canal et l'audit de conformité réglementaire. Les échecs de validation rebouclent avec des notes de révision structurées. Les mutations à haut risque attendent un humain avant que quoi que ce soit ne quitte le système.",
    problem:
      "Lancer un produit sur plusieurs canaux suppose d'extraire les données de SKU d'une base transactionnelle, de rédiger les fiches et de vérifier chaque allégation contre la réglementation, comme les règles de Santé Canada sur les PSN. Les chaînes linéaires ne peuvent ni réessayer, ni se mettre en pause, ni expliquer ce qu'elles ont fait.",
    architecture:
      "Un nœud superviseur analyse la requête et répartit le travail entre des sous-agents spécialisés, sur un schéma d'état typé avec réducteurs explicites. Un agent SQL d'inventaire effectue des appels d'outils déterministes en lecture seule, un agent de rédaction produit les textes et un agent validateur contrôle la conformité. Une sortie non conforme revient à la rédaction avec des instructions structurées. Si l'ambiguïté persiste, le graphe lève une interruption avec humain dans la boucle, persiste l'instantané du fil dans un checkpointer PostgreSQL et expose un endpoint de révision. Seul un état approuvé reprend et déclenche le webhook externe.",
    stack: [
      "LangGraph",
      "Python",
      "PostgreSQL Checkpointers",
      "Structured Tool Calling",
      "Claude Sonnet",
      "GPT-4o-mini",
      "FastAPI",
      "Webhooks",
    ],
    pipeline: [
      { name: "Supervision", detail: "État typé, réducteurs, routage conditionnel" },
      { name: "Requête", detail: "Agent SQL d'inventaire, outils déterministes en lecture seule" },
      { name: "Rédaction", detail: "Textes de fiches propres à chaque canal" },
      { name: "Audit", detail: "Validateur de conformité selon les exigences réglementaires" },
      { name: "Boucle", detail: "Notes de révision structurées renvoyées à la rédaction" },
      {
        name: "Interruption",
        detail: "Approbation humaine persistée dans PostgreSQL avant le webhook",
      },
    ],
    proofPoints: [
      "Graphe cyclique à validation autocorrective plutôt qu'un DAG fragile.",
      "Chaque transition de nœud fait l'objet d'un point de contrôle, ce qui permet la reprise de session et une piste d'audit complète.",
      "Des modèles économiques gèrent le routage et l'extraction, tandis que le modèle de pointe est réservé à la rédaction et au raisonnement de conformité.",
    ],
    metrics: [
      {
        value: "100%",
        label: "des mutations à haut risque soumises à un point de contrôle humain",
        kind: "target",
      },
      { value: "Rejeu complet", label: "de l'état depuis n'importe quel point de contrôle", kind: "target" },
      { value: "2 niveaux", label: "de cascade de modèles selon la complexité de la tâche", kind: "target" },
    ],
  },
  {
    id: "llmops-gateway-evaluation-suite",
    index: "04",
    phase: "Phase 4 · Projet synthèse",
    title: "Passerelle LLMOps de production et suite d'évaluation CI/CD",
    shortTitle: "Passerelle LLMOps",
    status: "pipeline",
    statusLabel: "En cours de réalisation",
    delivery: "Livraison, jours 91 à 120",
    summary:
      "Un proxy inverse d'entreprise placé devant chaque appel de modèle. Les requêtes sémantiquement similaires sont résolues depuis une cache vectorielle Redis en quelques millisecondes, chaque transaction est tracée, et un pipeline CI exécute des évaluations de régression sur des jeux de données de référence pour qu'une mauvaise modification de prompt n'atteigne jamais main.",
    problem:
      "Les dépenses d'API grimpent à chaque fonctionnalité, la latence p99 est imprévisible, et personne ne peut prouver qu'un ajustement de prompt n'a pas dégradé les réponses. Sans évaluation en CI, les fonctionnalités génératives sont livrées à l'aveuglette.",
    architecture:
      "Un proxy inverse FastAPI calcule l'embedding des prompts entrants et interroge une cache de similarité vectorielle Redis. Les correspondances au-dessus de 0.96 de similarité cosinus renvoient la réponse stockée sans appel amont. Les requêtes manquées sont routées selon la complexité de la tâche, la classification et l'extraction vers des modèles légers, la synthèse en plusieurs étapes vers des modèles de pointe. Tous les appels émettent des traces distribuées vers Langfuse avec attribution des jetons, du coût et de la latence. GitHub Actions exécute DeepEval et Ragas sur un jeu de données de référence organisé à chaque pull request et fait échouer le build si le taux d'hallucination dépasse 5 % ou si la fidélité tombe sous 95 %.",
    stack: [
      "FastAPI Reverse Proxy",
      "Redis Vector Similarity Cache",
      "Langfuse Tracing",
      "DeepEval",
      "Ragas",
      "GitHub Actions CI/CD",
    ],
    pipeline: [
      { name: "Proxy", detail: "Point d'entrée unique pour chaque appel de modèle" },
      { name: "Cache", detail: "Similarité vectorielle Redis, correspondance au-dessus de 0.96 cosinus" },
      { name: "Routage", detail: "Cascade par complexité entre niveaux de modèles" },
      { name: "Traçage", detail: "Spans Langfuse avec jetons, coût, latence" },
      { name: "Évaluation", detail: "DeepEval et Ragas sur jeux de données de référence en CI" },
      { name: "Verrou", detail: "PR bloquée au-dessus de 5 % de taux d'hallucination" },
    ],
    proofPoints: [
      "Sépare la télémétrie de production de l'évaluation de mise en production. La surveillance dit ce qui s'est passé, la suite CI dit si l'on peut fusionner.",
      "La mise en cache sémantique transforme les questions d'entreprise répétées en réponses de moins de 15 ms, sans aucun coût d'inférence.",
      "La triade RAG (pertinence du contexte, fidélité, pertinence de la réponse) est notée automatiquement à chaque modification.",
    ],
    metrics: [
      { value: "< 15 ms", label: "temps de réponse sur succès de cache", kind: "target" },
      { value: "0.96", label: "seuil cosinus pour la résolution par la cache", kind: "target" },
      { value: "5%", label: "plafond d'hallucination qui bloque une PR", kind: "target" },
      { value: "~65%", label: "de réduction du coût d'inférence grâce à la cache", kind: "target" },
    ],
  },
];

export const featuredProject = projects.find((p) => p.featured) ?? projects[0];
