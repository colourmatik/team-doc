"use client";

import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import Underline from '@tiptap/extension-underline'
import FontFamily from '@tiptap/extension-font-family'
import Image from '@tiptap/extension-image'
import ImageResize from 'tiptap-extension-resize-image'
import TextAlign from '@tiptap/extension-text-align'
import StarterKit from '@tiptap/starter-kit'
import {useEditor, EditorContent} from '@tiptap/react'
import TextStyle from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight'
import { Color } from '@tiptap/extension-color';
import Link from '@tiptap/extension-link'
import { useLiveblocksExtension} from "@liveblocks/react-tiptap";
import { useStorage } from "@liveblocks/react/suspense";

import { useEditorStore } from '@/store/use-editor-store';
import { FontSizeExtension } from '@/extensions/font-size';
import { LineHeightExtension } from '@/extensions/line-height';

import {Ruler} from './ruler'
import { Threads } from './threads';
import { RIGHT_MARGIN_DEFAULT, LEFT_MARGIN_DEFAULT } from "@/constants/margins";


interface EditorProps{
  initialContent?:string | undefined;
}

export const Editor = ({initialContent}: EditorProps) => {
  const leftMargin = useStorage((root) => root.leftMargin) ?? LEFT_MARGIN_DEFAULT;
  const rightMargin = useStorage((root) => root.rightMargin) ?? RIGHT_MARGIN_DEFAULT;
  const liveblocks = useLiveblocksExtension({
    initialContent,
    offlineSupport_experimental: true,
  });
  const {setEditor} = useEditorStore();

    const editor = useEditor({
        editorProps: {
            attributes: {
                style: `padding-left: ${leftMargin}px; padding-right: ${rightMargin}px;`,
                class: "focus:outline-none print:border-0 bg-white border border-[#C7C7C7] flex flex-col min-h-[1054px] w-[816px] pt-10 pr-14 pb-10 cursor-text" 
            },
        },
        extensions: [
            liveblocks,
            StarterKit.configure({
              history:false,
            }),
            LineHeightExtension,
            FontSizeExtension,
            TextAlign.configure({
              types:["heading", "paragraph"] 
            }),
            Link.configure({
              openOnClick: false,
              autolink:true,
              defaultProtocol:"https"
            }),
            Color,
            Highlight.configure({
              multicolor:true,
            }),
            FontFamily,
            TextStyle,
            Image,
            ImageResize,
            Underline,
            Table,
            TableCell,
            TableHeader,
            TableRow,
            TaskItem.configure({
                nested: true,
            }),
            TaskList,

        ],
        immediatelyRender: false,
        onCreate({editor}) {
          setEditor(editor);
        },
        onDestroy() {
          setEditor(null);
        },
        onUpdate({editor}){
          setEditor(editor)
        },
        onSelectionUpdate({editor}){
          setEditor(editor)
        },
        onTransaction({editor}){
          setEditor(editor)
        },
        onFocus({editor}){
          setEditor(editor)
        },
        onBlur({editor}){
          setEditor(editor)
        },
        onContentError({editor}){
          setEditor(editor)
        },
    })

    return ( 
        <div className='size-full overflow-x-auto bg-[#E6EEF7] px-4 print:p-0 print:bg-white print:overflow-visible'>
           <Ruler/>
           <div className='min-w-max flex justify-center w-[816px] py-4 print:py-0 mx-auto print:w-full print:min-w-0'>
            <EditorContent editor={editor}/>
            <div className='print:hidden'>
            <Threads editor={editor}/>
            </div>
            </div>
        </div>
     );

     
};