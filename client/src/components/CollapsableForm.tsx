import { useState } from "react";
import { Card } from "./ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { FormInput } from "./form-input";
import { Button } from "./ui/button";
import { Control, UseFormRegister, useWatch } from "react-hook-form";
import { SendForm } from "@/type";
import { SendFormsValues } from "./pages/Send";

type CollapsableFormProps = {
  index: number;
  formData: SendForm;
  handleRemoveForm: (index: number) => void;
  register: UseFormRegister<SendFormsValues>;
  control?: Control<SendFormsValues>;
};

const CollapsableForm = ({
  index,
  formData,
  register,
  handleRemoveForm,
  control
}: CollapsableFormProps) => {
  const [isOpen, setIsOpen] = useState(true);
  // Watch the email field in real-time
  const email = useWatch({ control, name: `forms.${index}.email` });

  const getFormTitle = () => {
    return email ? email : `Recipient ${index + 1} (No email entered)`;
  };

  return (
    <Card className="p-4 mb-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between ">
          <CollapsibleTrigger className="flex items-center gap-2 bg-transparent outline-none focus:outline-none border-0 bg-gray-50 hover:bg-gray-100 p-2 rounded-md">
            <h3 className="text-base font-semibold truncate max-w-md">
              {getFormTitle()}
            </h3>
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </CollapsibleTrigger>
          {index > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveForm(index)}
              className="text-red-500"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <CollapsibleContent className="space-y-2 mt-6">
          <FormInput
            id="gmail"
            type="mail"
            label="Enter your Gmail"
            {...register(`forms.${index}.email`)}
          />
          {Object.keys(formData.variables).length > 0 &&
            Object.keys(formData.variables).map((variableKey, varIndex) => (
              <FormInput
                id={`forms.${index}.variables.${variableKey}`}
                key={variableKey + "_collapsible_" + varIndex}
                label={variableKey}
                {...register(`forms.${index}.variables.${variableKey}`)}
              />
            ))}
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default CollapsableForm;
