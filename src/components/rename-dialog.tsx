"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useMutation } from "convex/react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface RenameDialogProps {
  documentId: Id<"documents">;
  initialTitle: string;
  children: React.ReactNode;
};

export const RenameDialog = ({ documentId, initialTitle, children }: RenameDialogProps) => {
  const update = useMutation(api.documents.updateById);
  const [isUpdating, setIsUpdating] = useState(false);

  const [title, setTitle] = useState(initialTitle);
  const [open, setOpen] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);

    update({ id: documentId, title: title.trim() || "Пустой документ" })
      .catch(() => toast.error("что-то пошло не так"))
      .then(() => toast.success("Документ успешно переименован"))
      .finally(() => {
        setIsUpdating(false);
        setOpen(false);
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Переименовать документ</DialogTitle>
            <DialogDescription>
              Введите новое название документа
            </DialogDescription>
          </DialogHeader>
          <div className="my-4">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Название документа"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              disabled={isUpdating}
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
              }}
            >
              Отменить
            </Button>
            <Button
              type="submit"
              disabled={isUpdating}
              onClick={(e) => e.stopPropagation()}
            >
              Сохранить
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
