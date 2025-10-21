/**
 * Event Bus - Pub/Sub System
 * Enables cross-component communication without tight coupling
 */

import type { EventType, SystemEvent, EventHandler } from './types';

class EventBus {
  private listeners: Map<EventType, Set<EventHandler>>;

  constructor() {
    this.listeners = new Map();
  }

  /**
   * Subscribe to an event
   */
  on<T = unknown>(eventType: EventType, handler: EventHandler<T>): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }

    const handlers = this.listeners.get(eventType)!;
    handlers.add(handler as EventHandler);

    // Return unsubscribe function
    return () => {
      handlers.delete(handler as EventHandler);
      if (handlers.size === 0) {
        this.listeners.delete(eventType);
      }
    };
  }

  /**
   * Unsubscribe from an event
   */
  off<T = unknown>(eventType: EventType, handler: EventHandler<T>): void {
    const handlers = this.listeners.get(eventType);
    if (handlers) {
      handlers.delete(handler as EventHandler);
      if (handlers.size === 0) {
        this.listeners.delete(eventType);
      }
    }
  }

  /**
   * Emit an event
   */
  emit<T = unknown>(eventType: EventType, payload: T): void {
    const event: SystemEvent<T> = {
      type: eventType,
      payload,
      timestamp: Date.now(),
    };

    const handlers = this.listeners.get(eventType);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(event);
        } catch (error) {
          console.error(`[EventBus] Error in handler for ${eventType}:`, error);
        }
      });
    }
  }

  /**
   * Clear all listeners for an event type
   */
  clear(eventType?: EventType): void {
    if (eventType) {
      this.listeners.delete(eventType);
    } else {
      this.listeners.clear();
    }
  }

  /**
   * Get count of listeners for an event type
   */
  listenerCount(eventType: EventType): number {
    return this.listeners.get(eventType)?.size ?? 0;
  }
}

// Singleton instance
export const eventBus = new EventBus();

// Export class for testing
export { EventBus };
