import { useState, useMemo } from "react";
import { PaginationStatus } from "convex/react";
import { Doc } from "../../../convex/_generated/dataModel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoaderIcon } from "lucide-react";
import { DocumentRow } from "./document-row";
import { Button } from "@/components/ui/button";

type SortField = "title" | "created";
type SortDirection = "asc" | "desc";

interface DocumentsTableProps {
  documents: Doc<"documents">[] | undefined;
  loadMore: (numItems: number) => void;
  status: PaginationStatus;
}

export const DocumentsTable = ({
  documents,
  loadMore,
  status,
}: DocumentsTableProps) => {
  const [sortField, setSortField] = useState<SortField>("created");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const sortedDocuments = useMemo(() => {
    if (!documents) return [];
    return [...documents].sort((a, b) => {
      let aValue, bValue;

      if (sortField === "title") {
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
      } else {
        aValue = new Date(a._creationTime).getTime();
        bValue = new Date(b._creationTime).getTime();
      }

      const comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [documents, sortField, sortDirection]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) return null;
    return (
      <span className="ml-1 text-xs text-muted-foreground ">
        {sortDirection === "asc" ? "↑" : "↓"}
      </span>
    );
  };

  const sortableHeadClass =
    "bg-[#d3e2f0] focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 rounded-full px-5 py-2.5 me-2 mb-2 hover: transition-colors";

  return (
    <div className="max-w-screen-xl mx-auto px-16 py-6 flex flex-col gap-5">
      {documents === undefined ? (
        <div className="flex justify-center h-24">
          <LoaderIcon className="animate-spin text-muted-foreground size-5" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-none">
              <TableHead
                className={sortableHeadClass}
                onClick={() => toggleSort("title")}
              >
                Имя
                {renderSortIndicator("title")}
              </TableHead>
              <TableHead>&nbsp;</TableHead>
              <TableHead className="hidden md:table-cell">Создатель</TableHead>
              <TableHead
                className={`hidden md:table-cell ${sortableHeadClass}`}
                onClick={() => toggleSort("created")}
              >
                Дата создания
                {renderSortIndicator("created")}
              </TableHead>
            </TableRow>
          </TableHeader>
          {sortedDocuments.length === 0 ? (
            <TableBody>
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  Документы не найдены
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {sortedDocuments.map((document) => (
                <DocumentRow key={document._id} document={document} />
              ))}
            </TableBody>
          )}
        </Table>
      )}
      <div className="flex items-center justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => loadMore(5)}
          disabled={status !== "CanLoadMore"}
        >
          {status === "CanLoadMore" ? "Загрузить ещё" : "Конец списка"}
        </Button>
      </div>
    </div>
  );
};