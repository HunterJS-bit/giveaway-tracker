<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Underline,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-blue-500 underline cursor-pointer',
      },
    }),
    Image.configure({
      inline: true,
      allowBase64: true,
    }),
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto focus:outline-none min-h-[200px] max-h-[500px] overflow-y-auto p-4 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600',
    },
  },
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML());
  },
});

watch(() => props.modelValue, (newValue) => {
  if (editor.value && newValue !== editor.value.getHTML()) {
    editor.value.commands.setContent(newValue, false);
  }
});

const isActive = (name: string, attributes = {}) => {
  return editor.value?.isActive(name, attributes) || false;
};

const toggleHeading = (level: number) => {
  editor.value?.chain().focus().toggleHeading({ level }).run();
};

const toggleBold = () => {
  editor.value?.chain().focus().toggleBold().run();
};

const toggleItalic = () => {
  editor.value?.chain().focus().toggleItalic().run();
};

const toggleUnderline = () => {
  editor.value?.chain().focus().toggleUnderline().run();
};

const toggleBulletList = () => {
  editor.value?.chain().focus().toggleBulletList().run();
};

const toggleOrderedList = () => {
  editor.value?.chain().focus().toggleOrderedList().run();
};

const toggleBlockquote = () => {
  editor.value?.chain().focus().toggleBlockquote().run();
};

const setTextAlign = (alignment: 'left' | 'center' | 'right') => {
  editor.value?.chain().focus().setTextAlign(alignment).run();
};

const addLink = () => {
  const url = window.prompt('Unesite URL:');
  if (url) {
    editor.value?.chain().focus().setLink({ href: url }).run();
  }
};

const addImage = () => {
  const url = window.prompt('Unesite URL slike:');
  if (url) {
    editor.value?.chain().focus().setImage({ src: url }).run();
  }
};

onBeforeUnmount(() => {
  editor.value?.destroy();
});
</script>

<template>
  <div class="tiptap-editor">
    <div v-if="editor" class="editor-toolbar">
      <!-- Text Formatting -->
      <div class="toolbar-group">
        <button
          type="button"
          :class="{ 'is-active': isActive('bold') }"
          @click="toggleBold"
          title="Bold"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 4v16h7.5c2.5 0 4.5-1.5 4.5-4 0-1.5-1-2.5-2.5-3 1.5-.5 2.5-1.5 2.5-3 0-2.5-2-4-4.5-4H6zm2.5 2.5h4c1 0 2 .5 2 1.5s-1 1.5-2 1.5h-4v-3zm0 5.5h4.5c1 0 2 .5 2 1.5s-1 1.5-2 1.5h-4.5v-3z"/>
          </svg>
        </button>
        <button
          type="button"
          :class="{ 'is-active': isActive('italic') }"
          @click="toggleItalic"
          title="Italic"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 4v3h2.2l-3.4 10H6v3h8v-3h-2.2l3.4-10H18V4h-8z"/>
          </svg>
        </button>
        <button
          type="button"
          :class="{ 'is-active': isActive('underline') }"
          @click="toggleUnderline"
          title="Underline"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 17c3.3 0 6-2.7 6-6V3h-2.5v8c0 1.9-1.6 3.5-3.5 3.5S8.5 12.9 8.5 11V3H6v8c0 3.3 2.7 6 6 6zm-7 2v2h14v-2H5z"/>
          </svg>
        </button>
      </div>

      <!-- Headings -->
      <div class="toolbar-group">
        <button
          type="button"
          :class="{ 'is-active': isActive('heading', { level: 2 }) }"
          @click="toggleHeading(2)"
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          :class="{ 'is-active': isActive('heading', { level: 3 }) }"
          @click="toggleHeading(3)"
          title="Heading 3"
        >
          H3
        </button>
      </div>

      <!-- Lists -->
      <div class="toolbar-group">
        <button
          type="button"
          :class="{ 'is-active': isActive('bulletList') }"
          @click="toggleBulletList"
          title="Bullet List"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 10.5c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5-.7-1.5-1.5-1.5zm0-6c-.8 0-1.5.7-1.5 1.5S3.2 7.5 4 7.5 5.5 6.8 5.5 6 4.8 4.5 4 4.5zm0 12c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5-.7-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/>
          </svg>
        </button>
        <button
          type="button"
          :class="{ 'is-active': isActive('orderedList') }"
          @click="toggleOrderedList"
          title="Ordered List"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/>
          </svg>
        </button>
      </div>

      <!-- Alignment -->
      <div class="toolbar-group">
        <button
          type="button"
          :class="{ 'is-active': isActive({ textAlign: 'left' }) }"
          @click="setTextAlign('left')"
          title="Align Left"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 21h18v-2H3v2zm0-4h12v-2H3v2zm0-4h18v-2H3v2zm0-4h12V7H3v2zm0-6v2h18V3H3z"/>
          </svg>
        </button>
        <button
          type="button"
          :class="{ 'is-active': isActive({ textAlign: 'center' }) }"
          @click="setTextAlign('center')"
          title="Align Center"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 21h10v-2H7v2zm-4-4h18v-2H3v2zm4-4h10v-2H7v2zm-4-4h18V7H3v2zm4-4h10V3H7v2z"/>
          </svg>
        </button>
        <button
          type="button"
          :class="{ 'is-active': isActive({ textAlign: 'right' }) }"
          @click="setTextAlign('right')"
          title="Align Right"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zm-6-4h18V3H3v2z"/>
          </svg>
        </button>
      </div>

      <!-- Links & Images -->
      <div class="toolbar-group">
        <button
          type="button"
          :class="{ 'is-active': isActive('link') }"
          @click="addLink"
          title="Add Link"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3.9 12c0-1.7 1.4-3.1 3.1-3.1h4V7H7c-2.8 0-5 2.2-5 5s2.2 5 5 5h4v-1.9H7c-1.7 0-3.1-1.4-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.7 0 3.1 1.4 3.1 3.1s-1.4 3.1-3.1 3.1h-4V17h4c2.8 0 5-2.2 5-5s-2.2-5-5-5z"/>
          </svg>
        </button>
        <button
          type="button"
          @click="addImage"
          title="Add Image"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
          </svg>
        </button>
      </div>
    </div>

    <EditorContent :editor="editor" />
  </div>
</template>

<style scoped>
.tiptap-editor {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.editor-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 8px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.toolbar-group {
  display: flex;
  gap: 2px;
  padding-right: 8px;
  border-right: 1px solid #e5e7eb;
}

.toolbar-group:last-child {
  border-right: none;
}

.editor-toolbar button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid transparent;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  color: #374151;
  transition: all 0.2s;
  font-size: 12px;
  font-weight: 500;
}

.editor-toolbar button:hover:not(:disabled) {
  background: #e5e7eb;
}

.editor-toolbar button.is-active {
  background: #3b82f6;
  color: white;
}

.editor-toolbar button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

:deep(.ProseMirror) {
  min-height: 200px;
}

:deep(.ProseMirror p) {
  margin: 0.5rem 0;
}

:deep(.ProseMirror h2) {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 1rem 0 0.5rem;
}

:deep(.ProseMirror h3) {
  font-size: 1.25rem;
  font-weight: bold;
  margin: 1rem 0 0.5rem;
}

:deep(.ProseMirror ul) {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin: 0.5rem 0;
}

:deep(.ProseMirror ol) {
  list-style-type: decimal;
  padding-left: 1.5rem;
  margin: 0.5rem 0;
}

:deep(.ProseMirror blockquote) {
  border-left: 3px solid #e5e7eb;
  padding-left: 1rem;
  margin: 1rem 0;
  color: #6b7280;
}

:deep(.ProseMirror img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1rem 0;
}

:deep(.ProseMirror a) {
  color: #3b82f6;
  text-decoration: underline;
}
</style>
