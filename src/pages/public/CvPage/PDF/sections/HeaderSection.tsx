import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { pdfStyles as styles } from '../styles/PDFStyles';

interface Props {
  personalInfo: any;
  language: 'fr' | 'en';
}

const stripUrl = (url?: string) =>
  (url || '').replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '');

const formatPortfolioHost = (url?: string) => {
  const host = stripUrl(url);
  if (!host) return '';
  return host.startsWith('www.') ? host : `www.${host}`;
};

export const HeaderSection: React.FC<Props> = ({ personalInfo, language }) => (
  <View style={styles.header}>
    <View style={styles.headerLeft}>
      <Text style={styles.name}>{personalInfo.name}</Text>
      <Text style={styles.title}>
        {language === 'fr' ? personalInfo.titleFr : personalInfo.titleEn}
      </Text>
      {(personalInfo.subtitleFr || personalInfo.subtitleEn) && (
        <Text style={styles.subtitle}>
          {language === 'fr' ? personalInfo.subtitleFr : personalInfo.subtitleEn}
        </Text>
      )}
    </View>
    <View style={styles.headerRight}>
      <Text style={styles.text}>{personalInfo.location}</Text>
      <Text style={styles.text}>{personalInfo.email}</Text>
      <Text style={styles.text}>{personalInfo.phone}</Text>
      {personalInfo.website && (
        <Text style={styles.text}>{formatPortfolioHost(personalInfo.website)}</Text>
      )}
      {personalInfo.linkedin && <Text style={styles.text}>{stripUrl(personalInfo.linkedin)}</Text>}
      {personalInfo.github && <Text style={styles.text}>{stripUrl(personalInfo.github)}</Text>}
    </View>
  </View>
);
