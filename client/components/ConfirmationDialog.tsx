import React from "react";
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
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle } from "lucide-react";

interface ConfirmationDialogProps {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  variant?: "destructive" | "default";
  trigger?: React.ReactNode;
  children?: React.ReactNode;
}

export function ConfirmationDialog({
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  variant = "destructive",
  trigger,
  children,
}: ConfirmationDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger || children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            {variant === "destructive" && (
              <AlertTriangle className="h-5 w-5 text-red-600" />
            )}
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-left">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={
              variant === "destructive"
                ? "bg-red-600 hover:bg-red-700 focus:ring-red-600"
                : ""
            }
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Specialized delete confirmation dialog
interface DeleteConfirmationProps {
  itemName: string;
  itemType: string;
  onConfirm: () => void;
  additionalWarning?: string;
  trigger?: React.ReactNode;
  children?: React.ReactNode;
}

export function DeleteConfirmation({
  itemName,
  itemType,
  onConfirm,
  additionalWarning,
  trigger,
  children,
}: DeleteConfirmationProps) {
  const description = `Are you sure you want to delete "${itemName}"? This action cannot be undone.${
    additionalWarning ? ` ${additionalWarning}` : ""
  }`;

  return (
    <ConfirmationDialog
      title={`Delete ${itemType}`}
      description={description}
      confirmText={`Delete ${itemType}`}
      cancelText="Cancel"
      onConfirm={onConfirm}
      variant="destructive"
      trigger={trigger}
    >
      {children}
    </ConfirmationDialog>
  );
}

// Quick delete button with confirmation
interface DeleteButtonProps {
  itemName: string;
  itemType: string;
  onConfirm: () => void;
  additionalWarning?: string;
  size?: "sm" | "default" | "lg";
  variant?: "outline" | "ghost" | "destructive";
  showIcon?: boolean;
}

export function DeleteButton({
  itemName,
  itemType,
  onConfirm,
  additionalWarning,
  size = "sm",
  variant = "outline",
  showIcon = true,
}: DeleteButtonProps) {
  return (
    <DeleteConfirmation
      itemName={itemName}
      itemType={itemType}
      onConfirm={onConfirm}
      additionalWarning={additionalWarning}
      trigger={
        <Button
          variant={variant}
          size={size}
          className="text-red-600 hover:text-red-700"
        >
          {showIcon && <Trash2 className="h-3 w-3 mr-1" />}
          Delete
        </Button>
      }
    />
  );
}

// Order cancellation dialog
interface CancelOrderProps {
  orderNumber: string;
  onConfirm: () => void;
  trigger?: React.ReactNode;
  children?: React.ReactNode;
}

export function CancelOrderDialog({
  orderNumber,
  onConfirm,
  trigger,
  children,
}: CancelOrderProps) {
  return (
    <ConfirmationDialog
      title="Cancel Order"
      description={`Are you sure you want to cancel order ${orderNumber}? The other party will be notified and any advance payments will be refunded according to the payment terms.`}
      confirmText="Cancel Order"
      cancelText="Keep Order"
      onConfirm={onConfirm}
      variant="destructive"
      trigger={trigger}
    >
      {children}
    </ConfirmationDialog>
  );
}
