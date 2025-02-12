import { Archive, FileImage, FileText, X } from 'lucide-react';

import type { FC } from 'react';
import { useRef } from 'react';

import { Button, error } from '@minhdtb/storeo-theme';

export type FileItem = {
  id?: string;
  name: string;
  size?: number;
  type?: string;
  file?: File;
  deleted?: boolean;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'application/pdf',
  'application/zip',
  'application/x-zip-compressed'
];

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return <FileImage className="h-4 w-4" />;
  if (type.includes('pdf')) return <FileText className="h-4 w-4" />;
  if (type.includes('zip')) return <Archive className="h-4 w-4" />;
  return <FileText className="h-4 w-4" />;
};

export type MultipleFileSelectProps = {
  value?: FileItem[];
  onChange?: (value: FileItem[]) => void;
};

export const MultipleFileSelect: FC<MultipleFileSelectProps> = ({
  value = [],
  onChange
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return false;
      }

      if (file.size > MAX_FILE_SIZE) {
        error(`${file.name} vượt quá kích thước cho phép (5MB)`);
        return false;
      }

      const isDuplicate = value.some(
        existingFile => existingFile.name === file.name && !existingFile.deleted
      );
      if (isDuplicate) {
        error(`File ${file.name} đã tồn tại`);
        return false;
      }

      return true;
    });

    if (validFiles.length) {
      const newFileItems = validFiles.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        file,
        deleted: false
      }));

      const newValue = [...value, ...newFileItems];
      onChange?.(newValue);
      event.target.value = '';
    }
  };

  const handleRemove = (index: number) => {
    const newValue = value.map((item, i) => {
      if (i === index) {
        return { ...item, deleted: true };
      }
      return item;
    });
    onChange?.(newValue);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const activeFiles = value.filter(file => !file.deleted);

  return (
    <div className="space-y-4">
      <div
        className={`border-appBlue flex max-h-[10rem] min-h-[5rem] w-full cursor-pointer items-center overflow-y-auto rounded-lg border border-dashed p-2 ${
          activeFiles.length > 0 ? 'justify-start' : 'justify-center'
        }`}
        onClick={handleClick}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ALLOWED_FILE_TYPES.join(',')}
          className="hidden"
          onChange={handleFileChange}
        />
        {activeFiles.length === 0 ? (
          <div className="flex w-full flex-col items-center gap-2">
            <span className="text-xs text-gray-500">
              Chấp nhận: Ảnh, PDF, ZIP
            </span>
          </div>
        ) : (
          <div className="flex w-full flex-wrap gap-2">
            {activeFiles.map((file, index) => (
              <div
                key={file.id || file.name}
                className="flex items-center gap-2 rounded bg-gray-100 px-2 py-1"
                onClick={e => e.stopPropagation()}
              >
                {getFileIcon(file.type || '')}
                <div className="flex flex-col">
                  <span className="text-xs">{file.name}</span>
                  {file.size && (
                    <span className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </span>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0"
                  onClick={e => {
                    e.stopPropagation();
                    handleRemove(index);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
