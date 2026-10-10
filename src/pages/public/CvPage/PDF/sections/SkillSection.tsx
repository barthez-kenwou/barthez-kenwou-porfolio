import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { pdfStyles as styles } from '../styles/PDFStyles';

interface Props {
  skills: any;
  language: 'fr' | 'en';
}

type SkillItem = { name?: string } | string;

function skillName(sk: SkillItem): string {
  if (typeof sk === 'string') return sk.trim();
  return (sk?.name || '').trim();
}

function collectSkills(skills: Record<string, SkillItem[] | undefined>, keys: string[]): string[] {
  const seen = new Set<string>();
  const names: string[] = [];

  for (const key of keys) {
    const list = skills[key];
    if (!Array.isArray(list)) continue;
    for (const item of list) {
      const name = skillName(item);
      if (!name) continue;
      const id = name.toLowerCase();
      if (seen.has(id)) continue;
      seen.add(id);
      names.push(name);
    }
  }

  return names;
}

export const SkillSection: React.FC<Props> = ({ skills, language }) => {
  if (!skills || typeof skills !== 'object') return null;

  const bag = skills as Record<string, SkillItem[] | undefined>;

  const groups = [
    {
      label: 'DevOps & Cloud',
      keys: ['devops', 'devsecops', 'cloud'],
    },
    {
      label: language === 'fr' ? 'Full Stack' : 'Full Stack',
      keys: ['frontend', 'backend', 'database'],
    },
  ]
    .map((group) => ({
      label: group.label,
      names: collectSkills(bag, group.keys),
    }))
    .filter((group) => group.names.length > 0);

  if (groups.length === 0) return null;

  return (
    <View style={styles.section}>
      <View style={styles.sectionTitleBox}>
        <Text style={styles.sectionTitle}>
          {language === 'fr' ? 'Compétences' : 'Skills'}
        </Text>
      </View>
      {groups.map((group) => (
        <View key={group.label} style={styles.row}>
          <View style={styles.leftCol}>
            <Text style={styles.period}>{group.label}</Text>
          </View>
          <View style={styles.rightCol}>
            <View style={styles.skillGrid}>
              {group.names.map((name) => (
                <Text key={name} style={styles.skillPill}>
                  {name}
                </Text>
              ))}
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};
