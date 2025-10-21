/**
 * App Framework Type Definitions
 * Ubuntu×XP Desktop Portfolio
 */

/**
 * App manifest - Metadata about an application
 */
export interface AppManifest {
  id: string; // Unique app identifier (e.g., 'pdf-viewer')
  name: string; // Display name (e.g., 'PDF Viewer')
  icon?: string; // Icon emoji or path
  description?: string; // Short description
  version?: string; // App version
  author?: string; // App author
  defaultSize?: {
    width: number;
    height: number;
  };
  minSize?: {
    width: number;
    height: number;
  };
  capabilities?: string[]; // What the app can do
}

/**
 * Base props that all apps receive
 */
export interface AppProps {
  windowId: string; // ID of the window containing this app
  nodeId?: string; // VFS node ID (if opened from a file/folder)
  [key: string]: any; // Allow additional props
}

/**
 * App registry type - Maps app IDs to lazy component loaders
 */
export type AppRegistry = Record<
  string,
  () => Promise<{ default: React.ComponentType<any> }>
>;

/**
 * PDF Viewer specific props
 */
export interface PdfViewerProps extends AppProps {
  fileUrl: string; // URL to the PDF file
}

/**
 * GitHub Viewer specific props (future)
 */
export interface GithubViewerProps extends AppProps {
  repoUrl?: string; // GitHub repository URL
}

/**
 * Browser app specific props (future)
 */
export interface BrowserProps extends AppProps {
  initialUrl?: string; // Starting URL
}
