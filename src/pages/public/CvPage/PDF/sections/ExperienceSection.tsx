import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { pdfStyles as styles } from '../styles/PDFStyles';

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
      const company = (language === 'fr' ? exp.companyFr : exp.companyEn) || exp.company || '';

      return (
        <View key={i} style={styles.row}>
          <View style={styles.leftCol}>
            <Text style={styles.period}>{exp.period}</Text>
          </View>
          <View style={styles.rightCol}>
            <Text style={styles.boldText}>{language === 'fr' ? exp.titleFr : exp.titleEn}</Text>
            {company ? <Text style={styles.company}>{company}</Text> : null}
            <View style={styles.bulletList}>
              {((language === 'fr' ? exp.descriptionFr : exp.descriptionEn) || []).map(
                (desc: string, idx: number) => (
                  <Text key={idx} style={styles.bulletItem}>
                    • {desc}
                  </Text>
                ),
              )}
            </View>
          </View>
        </View>
      );
    })}
  </View>
);
