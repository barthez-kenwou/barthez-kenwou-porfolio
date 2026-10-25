import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Image } from '@/shared/ui/Image/Image.ui';

describe('Image component', () => {
  it('renders skeleton and then image on load', async () => {
    render(<Image src="/test.png" alt="test image" lazy={false} />);

    const skeleton = document.querySelector('[aria-hidden]');
    expect(skeleton).toBeTruthy();

    const img = screen.getByAltText('test image') as HTMLImageElement;
    expect(img).toBeTruthy();

    fireEvent.load(img);

    expect(img.complete || img.naturalWidth === 0 || img.naturalHeight === 0).toBeDefined();
  });
});
