/**
 * useAppOpener - Platform-aware app opening hook
 * Abstracts Desktop vs Mobile app opening logic
 */

import { useIsMobile } from './useDeviceType';
import { useWindowActions } from '../store';
import type { WindowState } from '../types';

export interface AppOpenParams {
  id: string;
  appId: string;
  nodeId?: string;
  title: string;
  icon?: string;
  bounds: WindowState['bounds'];
  state: WindowState['state'];
  meta?: Record<string, unknown>;
}

/**
 * Custom event for mobile app opening
 */
export interface MobileOpenAppDetail {
  id: string;
  appId: string;
  nodeId?: string;
  title: string;
  icon?: string;
  meta?: Record<string, unknown>;
}

/**
 * Hook that returns platform-aware app opener
 */
export function useAppOpener() {
  const isMobile = useIsMobile();
  const { openWindow } = useWindowActions();

  return (params: AppOpenParams) => {
    if (isMobile) {
      // Mobile: Dispatch custom event for MobileOS to handle
      const detail: MobileOpenAppDetail = {
        id: params.id,
        appId: params.appId,
        nodeId: params.nodeId,
        title: params.title,
        icon: params.icon,
        meta: params.meta,
      };

      window.dispatchEvent(
        new CustomEvent('mobile:openApp', { detail })
      );
    } else {
      // Desktop: Use normal window manager
      openWindow({
        id: params.id,
        appId: params.appId,
        nodeId: params.nodeId,
        title: params.title,
        icon: params.icon,
        bounds: params.bounds,
        state: params.state,
        createdAt: Date.now(),
        meta: params.meta,
      });
    }
  };
}
