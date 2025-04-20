import { FileIcon, FileImageIcon, FileTextIcon } from 'lucide-react';

import { ReactElement } from 'react';

export function getFileIcon(type?: string): ReactElement {
  if (!type) return <FileIcon className="h-4 w-4" />;
  if (type.startsWith('image/')) return <FileImageIcon className="h-4 w-4" />;
  if (type.includes('pdf')) return <FileTextIcon className="h-4 w-4" />;
  if (type.includes('text')) return <FileTextIcon className="h-4 w-4" />;
  return <FileIcon className="h-4 w-4" />;
}
