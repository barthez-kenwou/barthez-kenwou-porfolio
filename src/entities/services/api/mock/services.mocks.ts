import {
  HiOutlineCloud,
  HiOutlineServerStack,
  HiOutlineCodeBracketSquare,
  HiOutlineShieldCheck,
  HiOutlineBolt,
  HiOutlineAcademicCap,
} from 'react-icons/hi2';

/**
 * Prices are stored in EUR (source of truth).
 * FCFA display uses the official peg: 1 EUR = 655.957 XAF.
 */
export const services = [
  {
    icon: HiOutlineCloud,
    titleFr: 'Architecture Cloud AWS',
    titleEn: 'AWS Cloud Architecture',
    descFr:
      "Conception et mise en place d'infrastructures cloud robustes, scalables et sécurisées sur Amazon Web Services.",
    descEn:
      'Design and implementation of robust, scalable and secure cloud infrastructures on Amazon Web Services.',
    featuresFr: [
      "Design d'architecture multi-AZ et multi-région",
      "Migration cloud et modernisation d'applications",
      'Optimisation des coûts AWS (FinOps)',
      'Architecture serverless avec Lambda, API Gateway',
      'Infrastructure hautement disponible (99.99%)',
    ],
    featuresEn: [
      'Multi-AZ and multi-region architecture design',
      'Cloud migration and application modernization',
      'AWS cost optimization (FinOps)',
      'Serverless architecture with Lambda, API Gateway',
      'Highly available infrastructure (99.99%)',
    ],
    priceEur: 500,
    hourly: false,
    priceFr: 'À partir de 500€',
    priceEn: 'Starting at €500',
  },
  {
    icon: HiOutlineServerStack,
    titleFr: 'DevOps & CI/CD',
    titleEn: 'DevOps & CI/CD',
    descFr:
      'Automatisation complète de vos pipelines de développement et déploiement pour une livraison continue et fiable.',
    descEn:
      'Complete automation of your development and deployment pipelines for continuous and reliable delivery.',
    featuresFr: [
      'Mise en place de pipelines CI/CD (GitHub Actions, GitLab CI)',
      'Containerisation avec Docker et orchestration Kubernetes',
      'Infrastructure as Code avec Terraform/CloudFormation',
      'Monitoring et alerting (Prometheus, Grafana)',
      'Gestion des secrets et sécurité DevSecOps',
    ],
    featuresEn: [
      'CI/CD pipeline setup (GitHub Actions, GitLab CI)',
      'Containerization with Docker and Kubernetes orchestration',
      'Infrastructure as Code with Terraform/CloudFormation',
      'Monitoring and alerting (Prometheus, Grafana)',
      'Secrets management and DevSecOps security',
    ],
    priceEur: 400,
    hourly: false,
    priceFr: 'À partir de 400€',
    priceEn: 'Starting at €400',
  },
  {
    icon: HiOutlineCodeBracketSquare,
    titleFr: 'Développement Full Stack',
    titleEn: 'Full Stack Development',
    descFr:
      "Création d'applications web modernes, performantes et maintenables avec les technologies les plus récentes.",
    descEn:
      'Creation of modern, performant and maintainable web applications with the latest technologies.',
    featuresFr: [
      'Applications React/Next.js avec TypeScript',
      'APIs RESTful et GraphQL avec Node.js/NestJS',
      'Bases de données SQL et NoSQL optimisées',
      'Authentification sécurisée (OAuth, JWT)',
      'Tests automatisés et documentation',
    ],
    featuresEn: [
      'React/Next.js applications with TypeScript',
      'RESTful and GraphQL APIs with Node.js/NestJS',
      'Optimized SQL and NoSQL databases',
      'Secure authentication (OAuth, JWT)',
      'Automated tests and documentation',
    ],
    priceEur: 300,
    hourly: false,
    priceFr: 'À partir de 300€',
    priceEn: 'Starting at €300',
  },
  {
    icon: HiOutlineShieldCheck,
    titleFr: 'Audit & Sécurité',
    titleEn: 'Audit & Security',
    descFr:
      'Analyse approfondie de votre infrastructure et applications pour identifier et corriger les vulnérabilités.',
    descEn:
      'In-depth analysis of your infrastructure and applications to identify and fix vulnerabilities.',
    featuresFr: [
      'Audit de sécurité AWS (IAM, VPC, S3)',
      'Tests de pénétration et analyse de vulnérabilités',
      'Mise en conformité RGPD/SOC2',
      "Recommandations et plan d'action",
      'Formation équipe sécurité',
    ],
    featuresEn: [
      'AWS security audit (IAM, VPC, S3)',
      'Penetration testing and vulnerability analysis',
      'GDPR/SOC2 compliance',
      'Recommendations and action plan',
      'Security team training',
    ],
    priceEur: 600,
    hourly: false,
    priceFr: 'À partir de 600€',
    priceEn: 'Starting at €600',
  },
  {
    icon: HiOutlineBolt,
    titleFr: 'Optimisation Performance',
    titleEn: 'Performance Optimization',
    descFr: 'Amélioration des performances de vos applications et réduction des temps de réponse.',
    descEn: 'Improvement of your application performance and reduction of response times.',
    featuresFr: [
      'Analyse et profiling des performances',
      'Optimisation des requêtes base de données',
      'Mise en cache (Redis, CloudFront CDN)',
      'Load balancing et auto-scaling',
      'Optimisation frontend (bundle, lazy loading)',
    ],
    featuresEn: [
      'Performance analysis and profiling',
      'Database query optimization',
      'Caching (Redis, CloudFront CDN)',
      'Load balancing and auto-scaling',
      'Frontend optimization (bundle, lazy loading)',
    ],
    priceEur: 350,
    hourly: false,
    priceFr: 'À partir de 350€',
    priceEn: 'Starting at €350',
  },
  {
    icon: HiOutlineAcademicCap,
    titleFr: 'Consulting & Formation',
    titleEn: 'Consulting & Training',
    descFr:
      'Accompagnement personnalisé et formation de vos équipes aux meilleures pratiques cloud et DevOps.',
    descEn: 'Personalized support and training for your teams on cloud and DevOps best practices.',
    featuresFr: [
      'Consulting architecture technique',
      'Formation AWS pour développeurs',
      'Workshops DevOps et CI/CD',
      'Revue de code et bonnes pratiques',
      'Accompagnement équipe technique',
    ],
    featuresEn: [
      'Technical architecture consulting',
      'AWS training for developers',
      'DevOps and CI/CD workshops',
      'Code review and best practices',
      'Technical team support',
    ],
    priceEur: 100,
    hourly: true,
    priceFr: 'À partir de 100€/h',
    priceEn: 'Starting at €100/h',
  },
];
