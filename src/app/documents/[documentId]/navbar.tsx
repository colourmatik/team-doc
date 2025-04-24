"use client"

import Image from "next/image"
import Link from "next/link"

import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu ,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent ,
    MenubarSubTrigger,
    MenubarTrigger ,
} from "@/components/ui/menubar";

import { DocumentInput } from "./document-input";
import { BoldIcon, FileIcon, FileJsonIcon, FilePenIcon, FilePlusIcon, FileTextIcon, GlobeIcon, ItalicIcon, PrinterIcon, RemoveFormattingIcon, StrikethroughIcon, TextIcon, TrashIcon, UnderlineIcon, Undo2Icon } from "lucide-react";
import { BsFilePdf } from "react-icons/bs";

export const Navbar = () => {
    return (
        <nav className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
                <Link href="/">
            <Image src="/logo.svg" alt="Logo" width={52} height={36} className="px-1"/>
                </Link>
                <div className="flex flex-col">
                    <DocumentInput/>
                    <div className="flex">
                        <Menubar className="border-none bg-transparent shadow-none h-auto p-0">
                            <MenubarMenu>
                                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                                    Файл
                                </MenubarTrigger>
                                <MenubarContent className="print:hidden">
                                    <MenubarSub>
                                        <MenubarSubTrigger>
                                        <FileIcon className="size-4 mr-2"/>
                                        Сохранить
                                        </MenubarSubTrigger>
                                        <MenubarSubContent>
                                            <MenubarItem>
                                                <GlobeIcon className="size-4 mr-2"/>
                                                HTML
                                            </MenubarItem>
                                            <MenubarItem>
                                                <BsFilePdf className="size-4 mr-2"/>
                                                PDF
                                            </MenubarItem>
                                            <MenubarItem>
                                                <FileTextIcon className="size-4 mr-2"/>
                                                Текст
                                            </MenubarItem>
                                            <MenubarItem>
                                                <FileJsonIcon className="size-4 mr-2"/>
                                                JSON
                                            </MenubarItem>
                                        </MenubarSubContent>
                                    </MenubarSub>
                                    <MenubarItem>
                                        <FilePlusIcon className="size-4 mr-2"/>
                                        Создать
                                    </MenubarItem>
                                    <MenubarSeparator/>
                                        <MenubarItem>
                                            <FilePenIcon className="size-4 mr-2"/>
                                            Переименовать
                                        </MenubarItem>
                                        <MenubarItem>
                                            <TrashIcon className="size-4 mr-2"/>
                                            Удалить
                                        </MenubarItem>
                                    <MenubarSeparator/>
                                    <MenubarItem onClick={() => window.print()}>
                                            <PrinterIcon className="size-4 mr-2"/>
                                            Печать <MenubarShortcut>Ctrl+P</MenubarShortcut>
                                        </MenubarItem>
                                </MenubarContent>
                            </MenubarMenu>
                            <MenubarMenu>
                                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                                    Правка
                                </MenubarTrigger>
                                <MenubarContent>
                                    <MenubarItem>
                                    <Undo2Icon className="size-4 mr-2"/>
                                    Отменить <MenubarShortcut>Ctrl+Z</MenubarShortcut>
                                    </MenubarItem>
                                    <MenubarItem>
                                    <Undo2Icon className="size-4 mr-2"/>
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
                                                <MenubarItem>
                                                    1 x 1
                                                </MenubarItem>
                                                <MenubarItem>
                                                    2 x 2
                                                </MenubarItem>
                                                <MenubarItem>
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
                                            <TextIcon className="size-4 mr-2"/>
                                            Текст
                                        </MenubarSubTrigger>
                                        <MenubarSubContent>
                                            <MenubarItem>
                                                <BoldIcon className="size-4 mr-2"/>
                                                Жирный <MenubarShortcut>Ctrl+B</MenubarShortcut>
                                            </MenubarItem>
                                            <MenubarItem>
                                                <ItalicIcon className="size-4 mr-2"/>
                                                Курсив <MenubarShortcut>Ctrl+I</MenubarShortcut>
                                            </MenubarItem>
                                            <MenubarItem>
                                                <UnderlineIcon className="size-4 mr-2"/>
                                                Почеркнутый <MenubarShortcut>Ctrl+U</MenubarShortcut>
                                            </MenubarItem>
                                            <MenubarItem>
                                                <StrikethroughIcon className="size-4 mr-2"/>
                                                <span>Зачеркнутый&nbsp;&nbsp;</span> <MenubarShortcut>Alt+Shift+5</MenubarShortcut>
                                            </MenubarItem>
                                        </MenubarSubContent>
                                    </MenubarSub>
                                    <MenubarItem>
                                        <RemoveFormattingIcon className="size-4 mr-2"/>
                                        Очистить форматирование
                                    </MenubarItem>
                                </MenubarContent>
                            </MenubarMenu>                          
                        </Menubar>
                    </div>
                </div>
            </div>
        </nav>
    );
};