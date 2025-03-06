import { signal } from '@preact/signals-react';

export const scrollToBottomSignal = signal<number>(0);

export const triggerScrollToBottom = () => {
  scrollToBottomSignal.value++;
};
