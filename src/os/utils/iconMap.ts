/**
 * Icon Mapping Utility
 * Shared utility for converting icon ID strings to emoji
 * Used by Window.tsx and Taskbar.tsx components
 */

/**
 * Icon string to emoji mapping
 */
export const ICON_MAP: Record<string, string> = {
  'desktop': '🖥️',
  'folder-home': '🏠',
  'folder-code': '💻',
  'folder-games': '🎮',
  'folder-projects': '💼',
  'folder-documents': '📄',
  'folder-downloads': '⬇️',
  'folder-pictures': '🖼️',
  'file-pdf': '📄',
  'file-markdown': '📝',
  'file-text': '📃',
  'file-image': '🖼️',
  'link-linkedin': '💼',
  'link-github': '🐙',
  'trash-empty': '🗑️',
  'trash-full': '🗑️',
};

/**
 * Get emoji display for icon string
 * @param iconStr - Icon ID string (e.g., 'folder-home')
 * @returns Emoji string (e.g., '🏠') or fallback
 */
export function getIconDisplay(iconStr: string | undefined): string {
  if (iconStr && ICON_MAP[iconStr]) {
    return ICON_MAP[iconStr];
  }
  // If already emoji or unknown, return as-is or fallback
  return iconStr || '📄';
}
