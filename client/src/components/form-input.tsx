import type React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "react-hook-form";

export interface FormInputExtraProps {
  label: string;
  direction?: string;
  error?: FieldError;
}

interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    FormInputExtraProps {}

export function FormInput({
  label,
  direction,
  error,
  ...props
}: FormInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={props.id}>{label}</Label>
      <Input
        {...props}
        className={`${props.className || ""} ${
          error ? "border-red-500 focus-visible:ring-red-500" : ""
        }`}
      />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
      {direction && !error && (
        <p className="text-sm text-muted-foreground">{direction}</p>
      )}
    </div>
  );
}

interface FormInputWithActionProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    FormInputExtraProps {
  action: React.ReactNode;
}

export function FormInputWithAction({
  label,
  direction,
  action,
  ...props
}: FormInputWithActionProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={props.id}>{label}</Label>
      <div className="flex grow gap-2">
        <Input {...props} />
        {action && action}
      </div>
      {direction && (
        <p className="text-sm text-muted-foreground">{direction}</p>
      )}
    </div>
  );
}
