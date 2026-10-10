import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { pdfStyles as styles } from '../styles/PDFStyles';

interface Props {
  language: 'fr' | 'en';
}

export const ProfileSection: React.FC<Props> = ({ language }) => (
  <View style={styles.section}>
    <View style={styles.sectionTitleBox}>
      <Text style={styles.sectionTitle}>
        {language === 'fr' ? 'Profil Professionnel' : 'Professional Profile'}
      </Text>
    </View>
    <Text style={styles.text}>
      {language === 'fr'
        ? "Full Stack & DevOps. +3 ans à concevoir, déployer et sécuriser des apps web et des infrastructures cloud (AWS, CI/CD, microservices, serverless). Orienté résultats : idées complexes → produits fiables et performants."
        : 'Full Stack & DevOps. 3+ years designing, shipping, and securing web apps and cloud infrastructure (AWS, CI/CD, microservices, serverless). Results-driven: complex ideas → reliable, high-performing products.'}
    </Text>
  </View>
);
