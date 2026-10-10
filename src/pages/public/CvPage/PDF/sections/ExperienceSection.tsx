import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { pdfStyles as styles } from '../styles/PDFStyles';
import { cleanPdfText, selectExperienceBullets } from '../lib/pdfContent';

interface Props {
  experiences: any[];
  language: 'fr' | 'en';
}

export const ExperienceSection: React.FC<Props> = ({ experiences, language }) => (
  <View style={styles.section}>
    <View style={styles.sectionTitleBox}>
      <Text style={styles.sectionTitle}>
        {language === 'fr' ? 'Expérience Professionnelle' : 'Work Experience'}
      </Text>
    </View>
    {(experiences || []).map((exp, i) => {
      const company = cleanPdfText(
        (language === 'fr' ? exp.companyFr : exp.companyEn) || exp.company || '',
      );
      const title = cleanPdfText(language === 'fr' ? exp.titleFr : exp.titleEn);
      const bullets = selectExperienceBullets(
        language === 'fr' ? exp.descriptionFr : exp.descriptionEn,
        i,
      );

      return (
        <View key={i} style={styles.row} wrap={false}>
          <View style={styles.leftCol}>
            <Text style={styles.period}>{exp.period}</Text>
          </View>
          <View style={styles.rightCol}>
            <View style={styles.titleRow}>
              <Text style={styles.boldText}>{title}</Text>
              {company ? (
                <Text style={styles.companyInline}>
                  {'  ·  '}
                  {company}
                </Text>
              ) : null}
            </View>
            <View style={styles.bulletList}>
              {bullets.map((desc, idx) => (
                <Text key={idx} style={styles.bulletItem}>
                  • {desc}
                </Text>
              ))}
            </View>
          </View>
        </View>
      );
    })}
  </View>
);
