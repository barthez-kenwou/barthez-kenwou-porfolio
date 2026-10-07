import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { pdfStyles as styles } from '../styles/PDFStyles';

interface Props {
  languages: any[];
  language: 'fr' | 'en';
}

export const LanguageSection: React.FC<Props> = ({ languages, language }) => (
  <View style={styles.section}>
    <View style={styles.sectionTitleBox}>
      <Text style={styles.sectionTitle}>{language === 'fr' ? 'Langues' : 'Languages'}</Text>
    </View>
    <View style={styles.row}>
      <View style={styles.leftCol}>
        <Text style={styles.period}>{language === 'fr' ? 'Niveaux' : 'Proficiency'}</Text>
      </View>
      <View style={styles.rightCol}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {(languages || []).map((lang, i) => (
            <Text key={i} style={[styles.text, { marginRight: 15 }]}>
              <Text style={styles.boldText}>{lang.language}</Text>:{' '}
              {language === 'fr' ? lang.proficiencyFr : lang.proficiencyEn}
            </Text>
          ))}
        </View>
      </View>
    </View>
  </View>
);
