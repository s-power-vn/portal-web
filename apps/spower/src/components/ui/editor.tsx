import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, Smile } from 'lucide-react';

import { FC, KeyboardEvent, useEffect, useState } from 'react';

import { Popover, PopoverContent, PopoverTrigger } from '@minhdtb/storeo-theme';

import './editor.css';

// Danh sách emoji phổ biến
const commonEmojis = [
  '😀',
  '😃',
  '😄',
  '😁',
  '😆',
  '😅',
  '😂',
  '🤣',
  '😊',
  '😇',
  '🙂',
  '🙃',
  '😉',
  '😌',
  '😍',
  '🥰',
  '😘',
  '😗',
  '😙',
  '😚',
  '😋',
  '😛',
  '😝',
  '😜',
  '🤪',
  '🤨',
  '🧐',
  '🤓',
  '😎',
  '🤩',
  '😏',
  '😒',
  '😞',
  '😔',
  '😟',
  '😕',
  '🙁',
  '☹️',
  '😣',
  '😖',
  '😫',
  '😩',
  '🥺',
  '😢',
  '😭',
  '😤',
  '😠',
  '😡',
  '🤬',
  '🤯',
  '👍',
  '👎',
  '👏',
  '🙌',
  '👐',
  '🤲',
  '🤝',
  '👊',
  '✊',
  '🤛',
  '❤️',
  '🧡',
  '💛',
  '💚',
  '💙',
  '💜',
  '🖤',
  '💔',
  '❣️',
  '💕'
];

export type StEditorProps = {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
};

export const StEditor: FC<StEditorProps> = ({
  value = '',
  onChange,
  onSubmit,
  placeholder = 'Nhập tin nhắn...'
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: true
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: true
        }
      }),
      Placeholder.configure({
        placeholder,
        showOnlyWhenEditable: true
      })
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const htmlContent = editor.getHTML();
      onChange?.(htmlContent);
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none w-full p-2 rounded-md'
      },
      handleKeyDown: (view, event) => {
        if (event.key === 'Enter' && event.shiftKey) {
          return false;
        }

        if (event.key === 'Enter' && !event.shiftKey && onSubmit) {
          event.preventDefault();
          onSubmit();
          return true;
        }

        return false;
      }
    }
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && onSubmit) {
      e.preventDefault();
      onSubmit();
    }
  };

  const insertEmoji = (emoji: string) => {
    if (editor) {
      editor.chain().focus().insertContent(emoji).run();
      setShowEmojiPicker(false);
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="flex-1 overflow-hidden rounded-md border">
      <div className="editor-toolbar">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is-active' : ''}
          title="In đậm"
        >
          <Bold size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'is-active' : ''}
          title="In nghiêng"
        >
          <Italic size={14} />
        </button>
        <div className="ml-auto">
          <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
            <PopoverTrigger asChild>
              <button
                type="button"
                title="Emoji"
                className="flex h-7 w-7 items-center justify-center rounded hover:bg-gray-100"
              >
                <Smile size={14} />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2" align="end">
              <div className="emoji-grid">
                {commonEmojis.map((emoji, index) => (
                  <div
                    key={index}
                    className="emoji-item"
                    onClick={() => insertEmoji(emoji)}
                  >
                    {emoji}
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="editor-content">
        <EditorContent
          editor={editor}
          onKeyDown={handleKeyDown}
          className="max-h-[120px] min-h-[40px] w-full overflow-y-auto"
        />
      </div>
    </div>
  );
};
