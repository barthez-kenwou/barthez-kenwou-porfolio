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
        ? "Développeur Full Stack passionné et ingénieur DevOps junior. Plus de 3 ans d'expérience dans la conception, le développement et le déploiement d'applications web modernes et d'infrastructures cloud. Expert en architecture microservices, CI/CD, et solutions serverless. Orienté résultats avec une capacité démontrée à transformer des idées complexes en produits fonctionnels et performants."
        : 'Passionate Full Stack Developer and junior DevOps Engineer. Over 3 years of experience in designing, developing, and deploying modern web applications and cloud infrastructures. Expert in microservices architecture, CI/CD, and serverless solutions. Results-oriented with a proven ability to transform complex ideas into functional products.'}
    </Text>
  </View>
);
