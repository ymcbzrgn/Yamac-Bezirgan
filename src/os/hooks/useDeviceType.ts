/**
 * Device Type Detection Hooks
 *
 * IMPORTANT: These hooks now delegate to DeviceContext for centralized state.
 * Do NOT use local useState - that creates multiple independent instances.
 *
 * Responsive breakpoints:
 * - Mobile: < 768px
 * - Tablet: 768px - 1023px
 * - Desktop: >= 1024px
 *
 * @see DeviceContext.tsx for implementation
 * @see CLAUDE.md Lesson #007 for architecture decision
 */

import { useDeviceContext } from '../contexts/DeviceContext';

// Re-export DeviceType for convenience
export type { DeviceType } from '../contexts/DeviceContext';

/**
 * Hook to detect and track device type
 * Delegates to DeviceContext for global state
 */
export function useDeviceType() {
  const { deviceType } = useDeviceContext();
  return deviceType;
}

/**
 * Hook to check if device is mobile (includes tablets for touch UX)
 * Returns true for mobile (<768px) AND tablet (768-1023px)
 * This ensures iPad and similar devices get mobile UI instead of desktop windows
 */
export function useIsMobile(): boolean {
  const { isMobile } = useDeviceContext();
  return isMobile;
}

/**
 * Hook to check if device is tablet
 */
export function useIsTablet(): boolean {
  const { isTablet } = useDeviceContext();
  return isTablet;
}

/**
 * Hook to check if device is desktop
 */
export function useIsDesktop(): boolean {
  const { isDesktop } = useDeviceContext();
  return isDesktop;
}
