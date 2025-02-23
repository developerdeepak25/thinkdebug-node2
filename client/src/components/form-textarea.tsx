import type React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FieldError } from "react-hook-form";

interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  direction: string;
  error?: FieldError;
}

export function FormTextarea({
  label,
  direction,
  error,
  ...props
}: FormTextareaProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={props.id}>{label}</Label>
      <Textarea
        {...props}
        className={`${props.className || ""} ${
          error ? "border-red-500 focus-visible:ring-red-500" : ""
        }`}
      />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
      {direction && !error && (
        <p className="text-sm text-muted-foreground">{direction}</p>
      )}{" "}
    </div>
  );
}
