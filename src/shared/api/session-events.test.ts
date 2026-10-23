import { describe, expect, it, vi } from 'vitest';
import { emitSessionEnded, onSessionEnded } from './session-events';

describe('session-events', () => {
  it('notifies subscribers and supports unsubscribe', () => {
    const first = vi.fn();
    const second = vi.fn();
    const offFirst = onSessionEnded(first);
    onSessionEnded(second);

    emitSessionEnded('refresh_failed');
    expect(first).toHaveBeenCalledWith('refresh_failed');
    expect(second).toHaveBeenCalledWith('refresh_failed');

    offFirst();
    emitSessionEnded('unauthorized');
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledWith('unauthorized');
  });
});
