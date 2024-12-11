import { computed, Signal } from '@angular/core';

export const canNavigate = (
  monthOffset: Signal<number>,
  monthRange: Signal<number>,
) => {
  return computed(() => {
    const offset = monthOffset();
    const range = monthRange();

    const previous = range < 0 ? offset - 1 > range : offset > 0;
    const next = range < 0 ? offset < 0 : offset + 1 < range;

    return { previous, next };
  });
};
