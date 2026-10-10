import React from 'react';
import { View, Text, Link } from '@react-pdf/renderer';
import { pdfStyles as styles } from '../styles/PDFStyles';
import { cleanPdfText, firstSentence } from '../lib/pdfContent';

interface Props {
  projects: any[];
  language: 'fr' | 'en';
}

const PROJECTS_PORTFOLIO_URL = 'https://www.barthez-kenwou.dev/projects';

export const ProjectSection: React.FC<Props> = ({ projects, language }) => {
  if (!projects || projects.length === 0) return null;

  const featured = projects.slice(0, 6);
  const isFr = language === 'fr';

  return (
    <View style={styles.section}>
      <View style={styles.sectionTitleBox}>
        <Text style={styles.sectionTitle}>{isFr ? 'Projets Phares' : 'Featured Projects'}</Text>
      </View>

      {featured.map((proj, i) => {
        const title = cleanPdfText(isFr ? proj.titleFr : proj.titleEn);
        const description = firstSentence(isFr ? proj.descriptionFr : proj.descriptionEn);
        const tags = [
          ...(proj.techStack?.frontend || []),
          ...(proj.techStack?.backend || []),
          ...(proj.techStack?.database || []),
          ...(proj.techStack?.devops || []),
        ].slice(0, 5);

        return (
          <View key={i} style={styles.row} wrap={false}>
            <View style={styles.leftCol}>
              <Text style={styles.period}>{proj.date}</Text>
            </View>
            <View style={styles.rightCol}>
              <Text style={styles.boldText}>{title}</Text>
              <Text style={styles.metaText}>{description}</Text>
              {tags.length > 0 ? (
                <View style={styles.skillGrid}>
                  {tags.map((tag: string, idx: number) => (
                    <Text key={idx} style={styles.skillPill}>
                      {tag}
                    </Text>
                  ))}
                </View>
              ) : null}
            </View>
          </View>
        );
      })}

      <View style={styles.projectsMoreNotice}>
        <Text style={styles.projectsMoreText}>
          {isFr
            ? 'Portfolio complet (études de cas, démos) : '
            : 'Full portfolio (case studies, demos): '}
          <Link src={PROJECTS_PORTFOLIO_URL} style={styles.projectsMoreLink}>
            {PROJECTS_PORTFOLIO_URL}
          </Link>
        </Text>
      </View>
    </View>
  );
};
