import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { pdfStyles as styles } from '../styles/PDFStyles';

interface Props {
  education: any[];
  language: 'fr' | 'en';
}

export const EducationSection: React.FC<Props> = ({ education, language }) => (
  <View style={styles.section}>
    <View style={styles.sectionTitleBox}>
      <Text style={styles.sectionTitle}>
        {language === 'fr' ? 'Éducation & Formations' : 'Education & Training'}
      </Text>
    </View>
    {(education || []).map((edu, i) => (
      <View key={i} style={styles.row}>
        <View style={styles.leftCol}>
          <Text style={styles.period}>{edu.period}</Text>
        </View>
        <View style={styles.rightCol}>
          <Text style={styles.boldText}>{language === 'fr' ? edu.degreeFr : edu.degreeEn}</Text>
          <Text style={styles.metaText}>{edu.school}</Text>
        </View>
      </View>
    ))}
  </View>
);
