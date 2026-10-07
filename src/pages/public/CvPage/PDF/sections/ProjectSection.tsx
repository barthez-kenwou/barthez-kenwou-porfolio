import React from 'react';
import { View, Text, Link } from '@react-pdf/renderer';
import { pdfStyles as styles } from '../styles/PDFStyles';

interface Props {
  projects: any[];
  language: 'fr' | 'en';
}

const PROJECTS_PORTFOLIO_URL = 'https://www.barthez-kenwou.dev/projects';

export const ProjectSection: React.FC<Props> = ({ projects, language }) => {
  if (!projects || projects.length === 0) return null;

  const featured = projects.slice(0, 3);
  const isFr = language === 'fr';

  return (
    <View style={styles.section}>
      <View style={styles.sectionTitleBox}>
        <Text style={styles.sectionTitle}>{isFr ? 'Projets Phares' : 'Featured Projects'}</Text>
      </View>

      {featured.map((proj, i) => (
        <View key={i} style={styles.row}>
          <View style={styles.leftCol}>
            <Text style={styles.period}>{proj.date}</Text>
          </View>
          <View style={styles.rightCol}>
            <Text style={styles.boldText}>{isFr ? proj.titleFr : proj.titleEn}</Text>
            <Text style={styles.metaText}>{isFr ? proj.descriptionFr : proj.descriptionEn}</Text>
            <View style={[styles.skillGrid, { marginTop: 4 }]}>
              {[
                ...(proj.techStack?.frontend || []),
                ...(proj.techStack?.backend || []),
                ...(proj.techStack?.database || []),
                ...(proj.techStack?.devops || []),
              ]
                .slice(0, 6)
                .map((tag: string, idx: number) => (
                  <Text key={idx} style={styles.skillPill}>
                    {tag}
                  </Text>
                ))}
            </View>
          </View>
        </View>
      ))}

      <View style={styles.projectsMoreNotice}>
        <Text style={styles.projectsMoreText}>
          {isFr
            ? 'Note - Sélection limitée à 3 projets phares dans ce CV. Portfolio projets complet (études de cas, démos, stack technique) : '
            : 'Note - Limited to 3 featured projects in this CV. Full projects portfolio (case studies, demos, tech stack): '}
          <Link src={PROJECTS_PORTFOLIO_URL} style={styles.projectsMoreLink}>
            {PROJECTS_PORTFOLIO_URL}
          </Link>
        </Text>
      </View>
    </View>
  );
};
