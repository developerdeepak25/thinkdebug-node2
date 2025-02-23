import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import React, { useState } from "react";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  UseFormClearErrors,
  UseFormSetError,
} from "react-hook-form";
import { FormInputExtraProps, FormInputWithAction } from "./form-input";

type InputWithBadgesProps<T extends FieldValues> = FormInputExtraProps & {
  control: Control<T>;
  name: Path<T>;
  setError?: UseFormSetError<T>;
  clearErrors?: UseFormClearErrors<T>;
} & React.ComponentProps<typeof Input>;

function InputWithBadges<T extends FieldValues>(
  props: InputWithBadgesProps<T>,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  const { control, name, setError, clearErrors, ...rest } = props;
  const [inputValue, setInputValue] = useState("");
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const addItem = () => {
          if (!inputValue) return;
          if (value.includes(inputValue)) {
            setError?.(name, {
              type: "manual",
              message: "Item already exists",
            });
          } else {
            clearErrors?.(name);
            onChange([...value, inputValue]);
            setInputValue("");
          }
        };

        const removeItem = (itemToRemove: string) => {
          onChange(value.filter((item: string) => item !== itemToRemove));
          clearErrors?.(name);
        };

        return (
          <div className="flex flex-col gap-2">
            {/* <div className="flex gap-2 "> */}
            <FormInputWithAction
              ref={ref}
              value={inputValue}
              // onChange={(e) => setInputValue(e.target.value)}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (error) clearErrors?.(name); // Reset error when user types
              }}
              className="flex-1"
              {...rest}
              action={
                <Button type="button" onClick={addItem}>
                  Add
                </Button>
              }
            />
            {/* Display error message if exists */}
            {error && <p className="text-red-500 text-sm">{error.message}</p>}
            <div className="flex flex-wrap gap-2">
              {value.map((item: string) => (
                <Badge
                  key={item}
                  variant="secondary"
                  className="flex items-center gap-1 px-3 py-1 text-sm"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => removeItem(item)}
                    className="ml-1 hover:bg-muted rounded-full"
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove {item}</span>
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}

export default React.forwardRef(InputWithBadges) as <T extends FieldValues>(
  props: InputWithBadgesProps<T> & {
    ref?: React.ForwardedRef<HTMLInputElement>;
  }
) => React.ReactElement;
