"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Avatars } from "./avatars";
import { DocumentInput } from "./document-input";
import {
  BoldIcon,
  FileIcon,
  FileJsonIcon,
  FilePenIcon,
  FilePlusIcon,
  FileTextIcon,
  GlobeIcon,
  ItalicIcon,
  PrinterIcon,
  Redo2Icon,
  RemoveFormattingIcon,
  StrikethroughIcon,
  TextIcon,
  TrashIcon,
  UnderlineIcon,
  Undo2Icon,
} from "lucide-react";
import { BsFilePdf } from "react-icons/bs";
import { useEditorStore } from "@/store/use-editor-store";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { Inbox } from "./inbox";
import { Doc } from "../../../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RenameDialog } from "@/components/rename-dialog";
import { RemoveDialog } from "@/components/remove-dialog";
import { Document as DocxDocument, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, ImageRun} from "docx";
import { saveAs } from "file-saver";
import type { JSONContent } from "@tiptap/core";

type MyMark = {
  type: string;
  attrs?: Record<string, string | number | boolean | undefined>;
};

interface NavbarProps {
  data: Doc<"documents">;
}

export const Navbar = ({ data }: NavbarProps) => {
  const router = useRouter();
  const { editor } = useEditorStore();
  const mutation = useMutation(api.documents.create);

  const onNewDocument = () => {
    mutation({
      title: "Безымянный документ",
      initialContent: "",
    })
      .catch(() => toast.error("Что-то пошло не так..."))
      .then((id) => {
        toast.success("Документ создан");
        router.push(`/documents/${id}`);
      });
  };

  const insertTable = ({ rows, cols }: { rows: number; cols: number }) => {
    editor?.chain().focus().insertTable({ rows, cols, withHeaderRow: false }).run();
  };

  const onDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  };

  const onSaveJSON = () => {
    if (!editor) return;
    const content = editor.getJSON();
    const blob = new Blob([JSON.stringify(content)], { type: "application/json" });
    onDownload(blob, `${data.title}.json`);
  };

  const onSaveHTML = () => {
    if (!editor) return;
    const content = editor.getHTML();
    const blob = new Blob([content], { type: "text/html" });
    onDownload(blob, `${data.title}.html`);
  };

  const onSaveText = () => {
    if (!editor) return;
    const content = editor.getText();
    const blob = new Blob([content], { type: "text/plain" });
    onDownload(blob, `${data.title}.txt`);
  };

    const extractMarks = (marks: MyMark[] = []) => {
    const textStyle = marks.find((m) => m.type === "textStyle");
    const attrs = textStyle?.attrs;

    const font = typeof attrs?.fontFamily === "string" ? attrs.fontFamily : undefined;
    const fontSizeRaw = typeof attrs?.fontSize === "string" ? attrs.fontSize : undefined;
    const color = typeof attrs?.color === "string" ? attrs.color.replace("#", "") : undefined;

    let size: number | undefined;
    if (fontSizeRaw && fontSizeRaw.endsWith("px")) {
      const px = parseFloat(fontSizeRaw);
      size = Math.round(px * 0.75 * 2);
    }

    return {
      bold: marks.some((m) => m.type === "bold"),
      italics: marks.some((m) => m.type === "italic"),
      underline: marks.some((m) => m.type === "underline") ? {} : undefined,
      strike: marks.some((m) => m.type === "strike"),
      color,
      font,
      size,
    };
  };

 const parseNode = async (node: JSONContent): Promise<(Paragraph | Table)[]> => {
  const blocks: (Paragraph | Table)[] = [];

  if (node.type === "image" && node.attrs?.src) {
    const src = node.attrs.src as string;
    try {
      const res = await fetch(src);
      const buffer = await res.arrayBuffer();
      const image = new ImageRun({
        data: buffer,
        transformation: { width: 400, height: 300 },
      });
      blocks.push(new Paragraph({ children: [image] }));
      return blocks;
    } catch (err) {
      console.warn("Ошибка загрузки изображения:", src, err);
    }
  }

  if ((node.type === "paragraph" || node.type === "heading") && node.content) {
    const runs: TextRun[] = node.content.map((child) => {
      const text = child.text || "";
      const style = extractMarks(child.marks as MyMark[] | undefined);
      return new TextRun({ text, ...style });
    });

    let style: string | undefined = undefined;
    if (node.type === "heading") {
      const level = node.attrs?.level || 1;
      style = `Heading${level}`;
    }

    blocks.push(new Paragraph({ children: runs, style, spacing: { line: 276 } }));
  }

  if (node.type === "bulletList" && node.content) {
    node.content.forEach((item) => {
      const runs = item.content?.[0]?.content?.map((c) => new TextRun({ text: c.text || "" })) || [];
      blocks.push(new Paragraph({ children: runs, bullet: { level: 0 } }));
    });
  }

  if (node.type === "orderedList" && node.content) {
    node.content.forEach((item) => {
      const runs = item.content?.[0]?.content?.map((c) => new TextRun({ text: c.text || "" })) || [];
      blocks.push(new Paragraph({ children: runs, numbering: { reference: "numbered-list", level: 0 } }));
    });
  }

  if (node.type === "table" && node.content) {
    const rows = await Promise.all(
      node.content.map(async (row) =>
        new TableRow({
          children: (
            await Promise.all(
              row.content?.map(async (cell) =>
                new TableCell({
                  children: await parseNode(cell),
                  width: { size: 5000, type: WidthType.DXA },
                })
              ) || []
            )
          ),
        })
      )
    );

    blocks.push(
      new Table({
        rows,
        width: { size: 100, type: WidthType.PERCENTAGE },
      })
    );
  }

  if (node.content) {
    for (const child of node.content) {
      blocks.push(...(await parseNode(child)));
    }
  }

  return blocks;
};

  const onSaveDocx = async () => {
    let json: JSONContent | undefined;

    try {
      json = editor?.getJSON() || (data.initialContent ? JSON.parse(data.initialContent) : undefined);
    } catch (error) {
      console.error("Ошибка при разборе initialContent:", error);
      return;
    }

    if (!json) {
      toast.error("Нет содержимого для сохранения");
      return;
    }

    const mainFont =
      editor?.getJSON()?.content?.[0]?.content?.[0]?.marks?.find((m: MyMark) => m.type === "textStyle")?.attrs
        ?.fontFamily || "Inter";

    const children = await parseNode(json);

    const doc = new DocxDocument({
      styles: {
        default: {
          document: { run: { font: mainFont, size: 24 }, paragraph: { spacing: { line: 276 } } },
        },
        paragraphStyles: [
          { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { bold: true, size: 34 }, paragraph: { spacing: { before: 700, after: 300 } } },
          { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, run: { bold: true, size: 29 }, paragraph: { spacing: { before: 700, after: 300 } } },
          { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true, run: { bold: true, size: 27 }, paragraph: { spacing: { before: 500 } } },
          { id: "Heading4", name: "Heading 4", basedOn: "Normal", next: "Normal", quickFormat: true, run: { bold: true, size: 24 }, paragraph: { spacing: { before: 500 } } },
        ],
      },
      numbering: {
        config: [
          {
            reference: "numbered-list",
            levels: [{ level: 0, text: "%1.", alignment: AlignmentType.START }],
          },
        ],
      },
      sections: [{ children }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${data.title}.docx`);
    toast.success("Файл DOCX сохранен");
  };

  
    return (
        <nav className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
                <Link href="/">
            <Image src="/logo.svg" alt="Logo" width={52} height={36} className="px-1"/>
                </Link>
                <div className="flex flex-col">
                    <DocumentInput title={data.title} id={data._id}/>
                    <div className="flex">
                        <Menubar className="border-none bg-transparent shadow-none h-auto p-0">
                            <MenubarMenu>
                                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                                    Файл
                                </MenubarTrigger>
                                <MenubarContent className="print:hidden">
                                    <MenubarSub>
                                        <MenubarSubTrigger>
                                        <FileIcon className="size-5 mr-2"/>
                                        Сохранить
                                        </MenubarSubTrigger>
                                        <MenubarSubContent>
                                            <MenubarItem onClick={onSaveDocx}>
                                                <Image src="/docx.svg" alt="DOCX icon" width={22} height={22} className="mr-2" />
                                                DOCX
                                            </MenubarItem>
                                            <MenubarItem onClick={onSaveHTML}>
                                                <GlobeIcon className="size-5 mr-2"/>
                                                HTML
                                            </MenubarItem>
                                            <MenubarItem onClick={() => window.print()}>
                                                <BsFilePdf className="size-5 mr-2"/>
                                                PDF
                                            </MenubarItem>
                                            <MenubarItem onClick={onSaveText}>
                                                <FileTextIcon className="size-5 mr-2"/>
                                                Текст
                                            </MenubarItem>
                                            <MenubarItem  onClick={onSaveJSON}>
                                                <FileJsonIcon className="size-5 mr-2"/>
                                                JSON
                                            </MenubarItem>
                                        </MenubarSubContent>
                                    </MenubarSub>
                                    <MenubarItem onClick={onNewDocument}>
                                        <FilePlusIcon className="size-5 mr-2"/>
                                        Новый документ
                                    </MenubarItem>
                                    <MenubarSeparator/>
                                    <RenameDialog documentId={data._id} initialTitle={data.title}>
                                        <MenubarItem
                                        onClick={(e) => e.stopPropagation()}
                                        onSelect={(e) => e.preventDefault()}
                                        >
                                            <FilePenIcon className="size-5 mr-2"/>
                                            Переименовать
                                        </MenubarItem>
                                    </RenameDialog>
                                    <RemoveDialog documentId={data._id}> 
                                        <MenubarItem
                                            onClick={(e) => e.stopPropagation()}
                                            onSelect={(e) => e.preventDefault()}
                                        >
                                            <TrashIcon className="size-5 mr-2" />
                                            Удалить
                                        </MenubarItem>
                                        </RemoveDialog>

                                    <MenubarSeparator/>
                                    <MenubarItem onClick={() => window.print()}>
                                            <PrinterIcon className="size-5 mr-2"/>
                                            Печать <MenubarShortcut>Ctrl+P</MenubarShortcut>
                                        </MenubarItem>
                                </MenubarContent>
                            </MenubarMenu>
                            <MenubarMenu>
                                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                                    Правка
                                </MenubarTrigger>
                                <MenubarContent>
                                    <MenubarItem onClick={() => editor?.chain().focus().undo().run()}>
                                    <Undo2Icon className="size-5 mr-2"/>
                                    Отменить <MenubarShortcut>Ctrl+Z</MenubarShortcut>
                                    </MenubarItem>
                                    <MenubarItem onClick={() => editor?.chain().focus().redo().run()}>
                                    <Redo2Icon className="size-5 mr-2"/>
                                    Повторить <MenubarShortcut>Ctrl+Y</MenubarShortcut>
                                    </MenubarItem>
                                </MenubarContent>
                            </MenubarMenu>  
                            <MenubarMenu>
                                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                                    Вставка
                                </MenubarTrigger>
                                <MenubarContent>
                                    <MenubarSub>
                                        <MenubarSubTrigger>Таблица</MenubarSubTrigger>
                                            <MenubarSubContent>
                                                <MenubarItem onClick={() => insertTable({rows:1, cols:1})}>
                                                    1 x 1
                                                </MenubarItem>
                                                <MenubarItem onClick={() => insertTable({rows:2, cols:2})}>
                                                    2 x 2
                                                </MenubarItem>
                                                <MenubarItem onClick={() => insertTable({rows:3, cols:3})}>
                                                    3 x 3
                                                </MenubarItem>
                                            </MenubarSubContent>
                                    </MenubarSub>
                                </MenubarContent>
                            </MenubarMenu>
                            <MenubarMenu>
                                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                                    Формат
                                </MenubarTrigger>
                                <MenubarContent>
                                    <MenubarSub>
                                        <MenubarSubTrigger>
                                            <TextIcon className="size-5 mr-2"/>
                                            Текст
                                        </MenubarSubTrigger>
                                        <MenubarSubContent>
                                            <MenubarItem onClick={() => editor?.chain().focus().toggleBold().run()}>
                                                <BoldIcon className="size-5 mr-2"/>
                                                Жирный <MenubarShortcut>Ctrl+B</MenubarShortcut>
                                            </MenubarItem>
                                            <MenubarItem onClick={() => editor?.chain().focus().toggleItalic().run()}>
                                                <ItalicIcon className="size-5 mr-2"/>
                                                Курсив <MenubarShortcut>Ctrl+I</MenubarShortcut>
                                            </MenubarItem>
                                            <MenubarItem onClick={() => editor?.chain().focus().toggleUnderline().run()}>
                                                <UnderlineIcon className="size-5 mr-2"/>
                                                Почеркнутый <MenubarShortcut>Ctrl+U</MenubarShortcut>
                                            </MenubarItem>
                                            <MenubarItem onClick={() => editor?.chain().focus().toggleStrike().run()}>
                                                <StrikethroughIcon className="size-5 mr-2"/>
                                                <span>Зачеркнутый&nbsp;&nbsp;</span> <MenubarShortcut>Ctrl+Shift+U</MenubarShortcut>
                                            </MenubarItem>
                                        </MenubarSubContent>
                                    </MenubarSub>
                                    <MenubarItem  onClick={() => editor?.chain().focus().unsetAllMarks().run()}>
                                        <RemoveFormattingIcon className="size-5 mr-2"/>
                                        Очистить форматирование
                                    </MenubarItem>
                                </MenubarContent>
                            </MenubarMenu>                          
                        </Menubar>
                    </div>
                </div>
            </div>
            <div className="flex gap-3 items-center pl-6">
                        <Inbox/>
                        <Avatars/>
                        <OrganizationSwitcher
                        afterCreateOrganizationUrl="/"
                        afterLeaveOrganizationUrl="/"
                        afterSelectOrganizationUrl="/"
                        afterSelectPersonalUrl="/"
                        />
                        <div className="flex gap-3 items-center shrink-0 pr-6">
                        <UserButton/>
                        </div>
                        </div>
        </nav>
    );
};