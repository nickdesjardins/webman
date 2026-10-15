/**
 * Édition française de data/projects.ts. Mêmes identifiants, mêmes index,
 * mêmes statuts, mêmes liens, mêmes piles techniques et mêmes valeurs de
 * métriques; seul le texte visible est traduit. Doit exporter exactement
 * les mêmes noms que le module anglais et satisfaire ses interfaces.
 *
 * Les projets 1 à 3 sont en ligne. Leurs preuves proviennent du README de
 * chaque dépôt et de relevés datés (le banc d'essai du 7 octobre 2026 pour le
 * projet 1, les exécutions enregistrées le 14 octobre 2026 pour le projet 2,
 * le banc d'essai et les exécutions enregistrées le 15 octobre 2026 pour le
 * projet 3), donc chaque chiffre est vérifiable. Le projet 4 est une
 * architecture jalonnée d'un plan de livraison de 120 jours; ses métriques
 * sont des cibles de conception explicites, étiquetées comme telles.
 */
import type { Project } from "@/data/projects";

export const projects: Project[] = [
  {
    id: "invoice-extraction-service",
    slug: "invoice-data-extraction",
    seoTitle: "Extraction de données de factures par IA",
    plainTitle: "Lecteur de factures",
    plain:
      "Transforme les PDF, les numérisations et les courriels transférés en données de facture propres, prêtes pour votre logiciel comptable. Si un fournisseur d'IA est lent ou en panne, il passe tout seul à un autre, et chaque total est recalculé au cent près avant toute sortie.",
    index: "01",
    phase: "Phase 1 · Livré",
    title: "Service d'extraction de factures",
    shortTitle: "Extraction de factures",
    status: "live",
    statusLabel: "En production, code ouvert",
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
    slug: "compliance-document-search",
    seoTitle: "Recherche dans vos documents, sources citées",
    plainTitle: "Interrogez vos manuels",
    plain:
      "Vos équipes posent une question sur vos procédures ou vos règlements et reçoivent une réponse qui cite le passage exact et la page d'où il vient. Quand les documents ne le disent pas, la réponse le dit.",
    index: "02",
    phase: "Phase 2 · Livré",
    title: "Moteur de recherche hybride et contextuel pour la conformité",
    shortTitle: "Moteur de recherche hybride",
    status: "live",
    statusLabel: "Démo en ligne, code ouvert",
    summary:
      "Un moteur de recherche pour procédures opératoires normalisées et manuels réglementaires, qui ne répond qu'en citant la source. La recherche vectorielle et la recherche par mots-clés s'exécutent dans une seule requête PostgreSQL et sont fusionnées, un cross-encoder retient les trois meilleurs passages, et chaque citation renvoyée par le modèle est vérifiée contre le document stocké avant que quiconque la voie. Quand les documents ne le disent pas, la réponse le dit. La démo publique fonctionne à coût nul sur des modèles gratuits.",
    problem:
      "Le RAG naïf découpe le texte au nombre de caractères et classe par similarité cosinus seulement. Il brouille les identifiants exacts comme 21 CFR Part 11 ou SOP-QA-017, coupe une clause du document dont elle provient et laisse le modèle libre de mal recopier un chiffre ou de citer une page qu'il n'a jamais vue. En contexte de conformité, ce n'est pas un problème de qualité, c'est un risque juridique.",
    architecture:
      "PyMuPDF extrait les blocs de mise en page de chaque page, puis un segmenteur structurel les regroupe le long des titres en segments de 400 jetons avec un chevauchement de 60 jetons. Suivant le patron Contextual Retrieval d'Anthropic, chaque segment est stocké avec un préambule de mise en situation, et son embedding comme sa colonne tsvector générée sont construits à partir de ce texte. Une seule requête SQL exécute une recherche cosinus pgvector sur un index HNSW (m=16, ef_construction=64) et une recherche plein texte sur un index GIN, puis fusionne les deux listes par Reciprocal Rank Fusion (k=60) dans une CTE. Un cross-encoder lit la question avec chacun des candidats fusionnés, jusqu'à 50, et en garde 3. Le modèle doit renvoyer un JSON strict contenant une réponse, un score de confiance et des citations textuelles, ou un verdict explicite de contexte insuffisant. Le serveur réancre chaque citation dans le texte stocké du segment, écarte ce qui ne correspond pas, tire les titres et les numéros de page de la base de données et refuse de livrer une réponse dont aucune citation ne survit. La génération passe par une chaîne ordonnée de modèles OpenRouter gratuits avec repli, et Claude, les embeddings OpenAI et Cohere Rerank v3.5 s'activent par simple paramètre.",
    stack: [
      "Python 3.12",
      "FastAPI",
      "Pydantic v2",
      "PostgreSQL",
      "pgvector (HNSW)",
      "tsvector (GIN)",
      "Reciprocal Rank Fusion",
      "fastembed (ONNX)",
      "OpenRouter",
      "PyMuPDF",
      "Render",
    ],
    pipeline: [
      {
        name: "Ingestion",
        detail: "Blocs PyMuPDF, segments de 400 jetons selon les titres, préambule contextuel",
      },
      { name: "Indexation", detail: "pgvector HNSW et index GIN sur un tsvector généré, une seule table" },
      { name: "Recherche", detail: "Cosinus dense et plein texte dans une seule requête SQL" },
      { name: "Fusion", detail: "CTE de Reciprocal Rank Fusion, k=60, jusqu'à 50 candidats" },
      { name: "Reclassement", detail: "Cross-encoder qui lit question et passage ensemble, en garde 3" },
      {
        name: "Vérification",
        detail: "Réponse JSON stricte, citations réancrées dans le texte stocké, pages tirées de la base",
      },
    ],
    proofPoints: [
      "Sept exécutions réelles enregistrées le 14 octobre 2026 et publiées telles que le service les a renvoyées. Elles montrent que le pipeline fonctionne, pas à quelle fréquence il a raison, et un test retrouve chaque citation enregistrée mot pour mot dans le PDF d'exemple, à la page citée.",
      "Une citation ne peut pas être inventée. Elle est comparée au segment stocké, jamais au préambule généré, après normalisation Unicode et typographique, et le modèle ne fournit jamais de numéro de page.",
      "La suite hermétique n'a besoin ni de réseau, ni de base de données, ni de clé API, et s'exécute avec ruff à chaque push. Des tests optionnels sur un vrai PostgreSQL vérifient que la fusion SQL concorde avec son jumeau Python à 1e-9 près et qu'EXPLAIN utilise l'index HNSW.",
      "Tient dans une instance gratuite de 512 Mo. Trois changements de mémoire, dont la désactivation de l'arène mémoire d'ONNX Runtime, ont fait passer le service de 856 Mo à 441 Mo au pic, les deux modèles locaux chargés.",
      "Démo verrouillée par conception pour l'Internet public. Le téléversement exige la clé de l'opérateur, les questions sont plafonnées par visiteur et par jour, et l'allocation gratuite du jour est lue chez OpenRouter même, si bien qu'un redémarrage ne peut pas l'effacer.",
      "Sur les sept exécutions, la médiane est de 1,4 s pour la recherche (embedding, SQL, reclassement) et de 6,8 s de bout en bout, sur des modèles gratuits. La requête SQL elle-même prend environ 170 ms, et la génération représente l'essentiel du reste.",
    ],
    metrics: [
      {
        value: "6 / 6",
        label: "réponses à citations vérifiées sur les questions enregistrées",
        kind: "measured",
      },
      {
        value: "1 / 1",
        label: "question hors corpus déclinée, sans deviner",
        kind: "measured",
      },
      {
        value: "441 Mo",
        label: "de mémoire au pic, deux modèles locaux chargés, instance de 512 Mo",
        kind: "measured",
      },
      {
        value: "0,00 $",
        label: "de coût marginal par question sur la pile gratuite",
        kind: "measured",
      },
    ],
    links: [
      {
        label: "Page du projet",
        href: "https://nickdesjardins.github.io/hybrid-knowledge-rag/",
        kind: "docs",
      },
      {
        label: "Démo en ligne",
        href: "https://hybrid-retrieval-engine.onrender.com/",
        kind: "demo",
      },
      {
        label: "Code source sur GitHub",
        href: "https://github.com/nickdesjardins/hybrid-knowledge-rag",
        kind: "github",
      },
    ],
  },
  {
    id: "multi-agent-operations-pipeline",
    slug: "multi-agent-operations",
    seoTitle: "Agents IA avec approbation humaine (LangGraph)",
    plainTitle: "Agents d'opérations supervisés",
    plain:
      "Rédige les fiches produits de chaque canal de vente à partir de vos données d'inventaire, vérifie chaque allégation au regard des règles et n'envoie rien tant qu'une personne n'a pas approuvé. Si le texte enfreint encore une règle après une réécriture, il est remis à une personne au lieu d'être envoyé, et chaque décision est consignée.",
    index: "03",
    phase: "Phase 3 · Livré",
    title: "Pipeline autonome multiagent d'opérations et de marketing",
    shortTitle: "Opérations multiagents",
    status: "live",
    statusLabel: "Démo en ligne, code ouvert",
    summary:
      "Une machine à états LangGraph cyclique qui transforme un SKU d'inventaire en textes marketing par canal pour un produit de santé naturel homologué, et refuse de les laisser sortir tant qu'une personne ne les a pas signés. Un superviseur fait passer le travail par une consultation SQL en lecture seule, un agent de rédaction et un validateur de conformité qui répondent sous des schémas JSON stricts; les violations reviennent au rédacteur un nombre borné de fois, puis le graphe se met en pause sur un point de contrôle PostgreSQL. Une approbation ou une modification le reprend et déclenche un seul webhook signé HMAC, et un rejet termine le fil sans rien envoyer. La démo publique fonctionne à coût nul sur des modèles gratuits.",
    problem:
      "Lancer un produit sur plusieurs canaux suppose d'extraire les données du SKU d'une base transactionnelle, de rédiger une fiche produit, des puces de place de marché et une publication sociale, puis de vérifier chaque allégation contre la réglementation, comme les règles de Santé Canada sur les produits de santé naturels. Une chaîne linéaire ne peut ni réessayer, ni attendre un réviseur, ni expliquer ce qu'elle a fait, et un modèle qui note ses propres textes laisse passer des erreurs mécaniques comme un dosage interverti.",
    architecture:
      "Un nœud superviseur valide la requête et la route sur un état typé à réducteurs explicites. L'agent d'inventaire est un outil SQL déterministe en lecture seule\xa0: une seule consultation paramétrée, aucun appel de modèle, et un SKU inconnu ou en rupture termine l'exécution avant tout appel de modèle. L'agent de rédaction produit une fiche produit, cinq puces de place de marché, une publication sociale et une consigne d'image sous un schéma JSON strict, et l'agent validateur audite le brouillon contre la licence sous un autre. Un ensemble de vérifications Python déterministes (numéro de licence affiché, quantités d'ingrédients, mises en garde obligatoires, formulations interdites) l'emporte sur le modèle pour les règles mécaniques\xa0: leurs constats gagnent toujours, et une objection de pure formulation sur une allégation autorisée reformulée est écartée. Les violations reviennent au rédacteur avec des instructions de révision structurées pendant un nombre borné de cycles, et un brouillon encore fautif quand le budget est épuisé est remis à une personne. Le graphe est compilé avec interrupt_before sur le nœud webhook, si bien que chaque exécution s'arrête sur un point de contrôle PostgreSQL (langgraph-checkpoint-postgres sur un seul pool psycopg) et peut attendre son réviseur malgré les redémarrages. L'endpoint de révision approuve, modifie ou rejette\xa0: l'approbation et la modification reprennent le graphe, et un rejet est écrit dans le fil comme si le nœud webhook avait tourné, de sorte qu'il ne s'exécute jamais. Le nœud webhook refuse d'envoyer sans décision humaine consignée, signe la charge utile en HMAC-SHA256, réessaie sur 429, 5xx et délais dépassés, et écrit chaque tentative dans un journal d'audit. La génération passe par une chaîne ordonnée de modèles OpenRouter gratuits qui se répare quand un modèle est retiré.",
    stack: [
      "Python 3.12",
      "LangGraph",
      "FastAPI",
      "Pydantic v2",
      "PostgreSQL",
      "langgraph-checkpoint-postgres (psycopg)",
      "OpenRouter",
      "HMAC-SHA256 webhooks",
      "Render",
      "Neon",
      "GitHub Pages",
    ],
    pipeline: [
      {
        name: "Supervision",
        detail: "Requête validée, état typé à réducteurs, routage selon ce que l'état contient déjà",
      },
      {
        name: "Requête",
        detail: "Consultation SQL paramétrée en lecture seule, sans modèle; un SKU inconnu ou en rupture termine l'exécution",
      },
      {
        name: "Rédaction",
        detail: "Fiche produit, cinq puces, publication sociale, consigne d'image; schéma JSON strict",
      },
      {
        name: "Audit",
        detail: "Modèle validateur et vérifications déterministes qui gagnent toujours; les violations rebouclent, un nombre borné de fois, puis remontent à une personne",
      },
      {
        name: "Interruption",
        detail: "interrupt_before sur le nœud webhook; approuver, modifier ou rejeter par l'endpoint de révision",
      },
      {
        name: "Envoi",
        detail: "Webhook signé HMAC-SHA256, réessais sur 429, 5xx et délais dépassés, chaque tentative au journal d'audit",
      },
    ],
    proofPoints: [
      "Six scénarios enregistrés le 15 octobre 2026 sur la pile en ligne et publiés tels que l'API les a renvoyés\xa0: cas ordinaire, autocorrection, escalade, modification, rejet et rupture de stock. Les cinq exécutions qui ont rédigé un texte ont pris de 19 à 66 secondes sur des modèles gratuits, les douze appels de modèle ont tous été répondus par le premier modèle de la chaîne, et chacun des trois envois a attendu une décision humaine consignée.",
      "Dans l'exécution d'escalade, le modèle validateur a jugé le brouillon conforme, et la vérification déterministe des dosages a attrapé trois quantités de probiotiques interverties (10, 10 et 20 milliards d'UFC là où la licence dit 20, 20 et 10). Le brouillon est allé à une personne plutôt que vers la sortie, et la personne l'a rejeté.",
      "Dans l'exécution de rejet, le validateur a renvoyé le premier brouillon pour une allégation non autorisée et a accepté la réécriture\xa0: un cycle d'autocorrection, 66 secondes. Le réviseur l'a ensuite rejeté, et le nœud webhook n'a jamais tourné.",
      "Banc d'essai de modèles daté du 15 octobre 2026\xa0: 27 appels répartis sur trois modèles gratuits, sur les propres cas du pipeline, chaque réponse sauvegardée en JSONL pour que les chiffres puissent être recalculés sans appeler de modèle. Le modèle Liquid a répondu correctement 9 fois sur 9 avec une médiane de 9,1 s et le modèle NVIDIA 8 fois sur 9, et c'est l'ordre de la chaîne livrée.",
      "504 tests hermétiques\xa0: ni réseau, ni PostgreSQL, ni clé API. Les deux transports HTTP lèvent une exception avant qu'une requête ne sorte du processus, les vrais clients SDK ne peuvent pas être construits dans la suite, et le README comme la page du projet sont tenus au code par des tests. Quatre tests de plus font tourner le graphe compilé sur un vrai checkpointer PostgreSQL quand une base est fournie.",
      "Le webhook est la seule mutation. Le nœud refuse d'envoyer tant que le statut de révision humaine n'est pas approuvé ou modifié, un rejet est inscrit au point de contrôle comme si le nœud avait tourné, le récepteur vérifie la signature en temps constant, et chaque tentative figure au journal d'audit.",
    ],
    metrics: [
      {
        value: "3 / 3",
        label: "envois précédés d'une décision humaine consignée, 15 octobre 2026",
        kind: "measured",
      },
      {
        value: "9 / 9",
        label: "réponses correctes du modèle gratuit principal, banc d'essai daté",
        kind: "measured",
      },
      {
        value: "504",
        label: "tests hermétiques, sans réseau, sans base, sans clé",
        kind: "measured",
      },
      {
        value: "0,00 $",
        label: "de coût marginal par exécution sur la pile gratuite",
        kind: "measured",
      },
    ],
    links: [
      {
        label: "Page du projet",
        href: "https://nickdesjardins.github.io/autonomous-operation-marketing/",
        kind: "docs",
      },
      {
        label: "Démo en ligne",
        href: "https://multi-agent-ops-pipeline.onrender.com/",
        kind: "demo",
      },
      {
        label: "Code source sur GitHub",
        href: "https://github.com/nickdesjardins/autonomous-operation-marketing",
        kind: "github",
      },
    ],
  },
  {
    id: "llmops-gateway-evaluation-suite",
    slug: "llmops-gateway",
    plainTitle: "Contrôle qualité de l'IA",
    plain:
      "Un point de contrôle devant chaque appel à l'IA\xa0: il enregistre ce qui s'est passé et ce que ça a coûté, réutilise les réponses aux questions répétées et bloque un changement qui dégrade les réponses avant qu'il n'atteigne vos clients.",
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
