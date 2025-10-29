/**
 * Device Context - Global Device Type State
 *
 * Provides centralized device type detection across the entire application.
 * Prevents multiple independent state instances from being created when
 * useDeviceType() is called in different components.
 *
 * Architecture Decision:
 * - Single source of truth for deviceType state
 * - One resize event listener for entire app
 * - All components read from same context
 * - Prevents state desynchronization issues
 *
 * @see CLAUDE.md Lesson #007 for why this is necessary
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

/**
 * Get device type based on window width
 * Breakpoints:
 * - Mobile: < 768px
 * - Tablet: 768px - 1023px
 * - Desktop: >= 1024px
 */
function getDeviceType(width: number): DeviceType {
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

/**
 * Device Context Type
 */
interface DeviceContextType {
  deviceType: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

/**
 * Device Context
 */
const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

/**
 * Device Provider Props
 */
interface DeviceProviderProps {
  children: ReactNode;
}

/**
 * Device Provider Component
 * Wraps the entire app to provide global device type state
 */
export function DeviceProvider({ children }: DeviceProviderProps) {
  const [deviceType, setDeviceType] = useState<DeviceType>(() => {
    const initialWidth = window.innerWidth;
    const initialType = getDeviceType(initialWidth);
    console.log('[DeviceContext] 🎬 INIT', {
      windowInnerWidth: initialWidth,
      deviceType: initialType,
      timestamp: new Date().toISOString(),
    });
    return initialType;
  });

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newType = getDeviceType(newWidth);

      // Only update if device type actually changed
      if (newType !== deviceType) {
        console.log('[DeviceContext] 📐 RESIZE - Device type changed', {
          windowInnerWidth: newWidth,
          oldDeviceType: deviceType,
          newDeviceType: newType,
          timestamp: new Date().toISOString(),
        });
        setDeviceType(newType);
      }
    };

    // Throttle resize events (max 10 times per second)
    let timeoutId: number;
    const throttledResize = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', throttledResize);

    console.log('[DeviceContext] 👂 Event listener ADDED', {
      currentDeviceType: deviceType,
      timestamp: new Date().toISOString(),
    });

    return () => {
      window.removeEventListener('resize', throttledResize);
      clearTimeout(timeoutId);
      console.log('[DeviceContext] 🗑️ Event listener REMOVED', {
        timestamp: new Date().toISOString(),
      });
    };
  }, [deviceType]);

  // Derived values
  const isMobile = deviceType === 'mobile' || deviceType === 'tablet';
  const isTablet = deviceType === 'tablet';
  const isDesktop = deviceType === 'desktop';

  const value: DeviceContextType = {
    deviceType,
    isMobile,
    isTablet,
    isDesktop,
  };

  return <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>;
}

/**
 * Hook to access device context
 * @throws Error if used outside DeviceProvider
 */
export function useDeviceContext(): DeviceContextType {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error('useDeviceContext must be used within a DeviceProvider');
  }
  return context;
}
