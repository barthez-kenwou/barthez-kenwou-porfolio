import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { pdfStyles as styles } from '../styles/PDFStyles';

interface Props {
  languages: any[];
  language: 'fr' | 'en';
}

export const LanguageSection: React.FC<Props> = ({ languages, language }) => {
  if (!languages || languages.length === 0) return null;

  return (
    <View style={styles.section}>
      <View style={styles.sectionTitleBox}>
        <Text style={styles.sectionTitle}>{language === 'fr' ? 'Langues' : 'Languages'}</Text>
      </View>
      <Text style={styles.compactLine}>
        {(languages || [])
          .map(
            (lang) =>
              `${lang.language}: ${language === 'fr' ? lang.proficiencyFr : lang.proficiencyEn}`,
          )
          .join('   ·   ')}
      </Text>
    </View>
  );
};
