import { useEffect } from 'react';

/**
 * Locks background page scrolling while a modal/drawer is mounted,
 * and restores the previous overflow value on unmount. Call this
 * unconditionally at the top of any modal component that renders
 * a fixed, full-screen overlay — the component only mounts while
 * the modal is open, so the lock is automatically scoped to that.
 */
export function useLockBodyScroll(): void {
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);
}
