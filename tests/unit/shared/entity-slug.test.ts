import { describe, expect, it } from 'vitest';
import {
  buildEntityPathSlug,
  findByPathSlug,
  formatPathIdSuffix,
  getProjectPathSlug,
  parseEntityIdFromParam,
} from '@/shared/lib/entity-slug';

describe('entity-slug projects', () => {
  it('builds numeric path slug with padded id', () => {
    expect(buildEntityPathSlug('NEXUS Restaurant ERP', 12)).toBe('nexus-restaurant-erp-0012');
  });

  it('builds mongo path slug with short suffix (never bare ObjectId)', () => {
    const id = '674a1b2c3d4e5f678901abcd';
    expect(formatPathIdSuffix(id)).toBe('8901abcd');
    expect(
      getProjectPathSlug({
        id,
        titleEn: 'NEXUS Restaurant ERP',
        titleFr: 'NEXUS ERP Restaurant',
      }),
    ).toBe('nexus-restaurant-erp-8901abcd');
  });

  it('respects optional CMS slug override', () => {
    expect(
      getProjectPathSlug({
        id: '674a1b2c3d4e5f678901abcd',
        titleEn: 'Ignored Title',
        slug: 'nexus-erp',
      }),
    ).toBe('nexus-erp-8901abcd');
  });

  it('parses legacy numeric and full mongo params', () => {
    expect(parseEntityIdFromParam('12')).toBe('12');
    expect(parseEntityIdFromParam('name-0012')).toBe('12');
    expect(parseEntityIdFromParam('674a1b2c3d4e5f678901abcd')).toBe('674a1b2c3d4e5f678901abcd');
    expect(parseEntityIdFromParam('nexus-restaurant-erp-8901abcd')).toBeNull();
  });

  it('finds by readable slug or mongo short suffix', () => {
    const items = [
      { id: 3, titleEn: 'Alpha Tool', titleFr: 'Outil Alpha' },
      {
        id: '674a1b2c3d4e5f678901abcd',
        titleEn: 'NEXUS Restaurant ERP',
        titleFr: 'NEXUS',
      },
    ];
    expect(findByPathSlug(items, 'alpha-tool-0003')?.id).toBe(3);
    expect(findByPathSlug(items, 'nexus-restaurant-erp-8901abcd')?.id).toBe(
      '674a1b2c3d4e5f678901abcd',
    );
    expect(findByPathSlug(items, '674a1b2c3d4e5f678901abcd')?.id).toBe('674a1b2c3d4e5f678901abcd');
  });
});
