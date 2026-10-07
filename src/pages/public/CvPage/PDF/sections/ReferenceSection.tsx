import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { pdfStyles as styles } from '../styles/PDFStyles';

interface Props {
  references: any[];
  language: 'fr' | 'en';
}

export const ReferenceSection: React.FC<Props> = ({ references, language }) => {
  if (!references || references.length === 0) return null;

  return (
    <View style={styles.section}>
      <View style={styles.sectionTitleBox}>
        <Text style={styles.sectionTitle}>
          {language === 'fr' ? 'Références Professionnelles' : 'Professional References'}
        </Text>
      </View>
      {references.map((ref, i) => (
        <View key={i} style={styles.row}>
          <View style={styles.leftCol}>
            <Text style={styles.period}>{ref.name}</Text>
          </View>
          <View style={styles.rightCol}>
            <Text style={styles.boldText}>{language === 'fr' ? ref.roleFr : ref.roleEn}</Text>
            <Text style={styles.metaText}>{ref.company}</Text>
            <Text style={styles.text}>
              {ref.email} | {ref.phone}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};
