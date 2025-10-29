/**
 * TextViewer Component
 * Simple viewer for plain text files (.txt)
 * Notepad-style interface
 */

import { useMemo } from 'react';
import { useVFSNodes } from '../../os/store';
import './TextViewer.css';

interface TextViewerProps {
  windowId: string;
  nodeId?: string;
}

export default function TextViewer({ nodeId }: TextViewerProps) {
  const nodes = useVFSNodes();
  const file = nodeId ? nodes[nodeId] : null;

  // Extract text content from data URL or targetUrl
  const textContent = useMemo(() => {
    if (!file?.targetUrl) return 'No content';

    // Check if it's a data URL
    if (file.targetUrl.startsWith('data:')) {
      try {
        // Extract base64 data from data URL
        const base64Match = file.targetUrl.match(/base64,(.+)$/);
        if (base64Match) {
          const base64Data = base64Match[1];
          const decoded = atob(base64Data);
          return decoded;
        }
      } catch (error) {
        console.error('Failed to decode text content:', error);
        return 'Error: Could not decode file content';
      }
    }

    // If it's an external URL, we can't fetch it directly (CORS)
    return 'External file - content not available';
  }, [file?.targetUrl]);

  return (
    <div className="text-viewer">
      {/* Toolbar */}
      <div className="text-viewer__toolbar">
        <span className="text-viewer__toolbar-icon">📃</span>
        <span className="text-viewer__toolbar-title">{file?.name || 'Text File'}</span>
      </div>

      {/* Content */}
      <pre className="text-viewer__content">{textContent}</pre>
    </div>
  );
}
