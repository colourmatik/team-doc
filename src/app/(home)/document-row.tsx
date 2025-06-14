import { TableCell, TableRow } from "@/components/ui/table";
import { Doc } from "../../../convex/_generated/dataModel";
import { SiGoogledocs } from "react-icons/si";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Building2Icon, CircleUserIcon } from "lucide-react";
import { DocumentMenu } from "./document-menu";

interface DocumentRowProps {
    document: Doc<"documents">;
}

export const DocumentRow = ({ document }: DocumentRowProps) => {
    const onNewTabClick = (id: string) => {
        window.open(`/documents/${id}`, "_blank");
    };

    const onRowClick = () => {
        onNewTabClick(document._id);
    };

    return (
        <TableRow className="cursor-pointer" onClick={onRowClick}>
            <TableCell className="w-[50px]">
                <SiGoogledocs className="size-6 fill-blue-500" />
            </TableCell>
            <TableCell className="font-medium md:w-[45%]">
                {document.title}
            </TableCell>
            <TableCell className="text-muted-foreground hidden md:flex items-center gap-2">
                {document.organizationId ? <Building2Icon className="size-4" /> : <CircleUserIcon className="size-4" />}
                {document.ownerName}
            </TableCell>
            <TableCell className="text-muted-foreground hidden md:flex items-center gap-2">
                {document.organizationId ? `В рамках ${document.organizationName}` : `Личный документ`}
            </TableCell>
            <TableCell className="text-muted-foreground hidden md:table-cell">
                {format(new Date(document._creationTime), "dd.MM.yyyy HH:mm", { locale: ru })}
            </TableCell>
            <TableCell className="items-center justify-end">
                <DocumentMenu documentId={document._id} title={document.title} onNewTab={onNewTabClick} />
            </TableCell>
        </TableRow>
    );
};
