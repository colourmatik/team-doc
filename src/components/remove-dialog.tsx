"use client";

import { toast } from "sonner";
import { useState } from "react";
import { useMutation } from "convex/react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useRouter } from "next/navigation";

interface RemoveDialogProps {
  documentId: Id<"documents">;
  children: React.ReactNode;
};

export const RemoveDialog = ({ documentId, children }: RemoveDialogProps) => {
  const router = useRouter();
  const remove = useMutation(api.documents.removeById);
  const [isRemoving, setIsRemoving] = useState(false);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
          <AlertDialogDescription>
            Это действие нельзя отменить. Ваш документ будет удален.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
            Отменить
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isRemoving}
            onClick={async (e) => {
              e.stopPropagation();
              setIsRemoving(true);
              try {
                await remove({ id: documentId });
                toast.success("Документ успешно удален");
                router.push("/");
              } catch {
                toast.error("Вы не являетесь владельцем документа");
              } finally {
                setIsRemoving(false);
              }
            }}
            
          >
            Удалить
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
