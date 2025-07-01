'use client'

import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Menubar from './Menubar'
import TextAlign from '@tiptap/extension-text-align'
import { EditorContent } from '@tiptap/react'

interface RichTextEditorProps {
  field: any
}

export const RichTextEditor = ({ field }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    editorProps: {
      attributes: {
        class:
          'min-h-[300px] p-4 focus:outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert !w-full !max-w-none',
      },
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      field.onChange(JSON.stringify(editor.getJSON()))
    },
    content: field.value ? JSON.parse(field.value) : '<p>Hello World 🌍</p>',
  })
  return (
    <div className="border-input dark:bg-input/30 w-full overflow-hidden rounded-lg border">
      <Menubar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}
