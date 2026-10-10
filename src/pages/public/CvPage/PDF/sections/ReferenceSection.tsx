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
          {language === 'fr' ? 'Références' : 'References'}
        </Text>
      </View>
      {references.map((ref, i) => {
        const role = language === 'fr' ? ref.roleFr : ref.roleEn;
        const details = [role, ref.company, ref.email, ref.phone].filter(Boolean).join('  ·  ');

        return (
          <View key={i} style={styles.row} wrap={false}>
            <View style={styles.leftCol}>
              <Text style={styles.period}>{ref.name}</Text>
            </View>
            <View style={styles.rightCol}>
              <Text style={styles.compactLine}>{details}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};
