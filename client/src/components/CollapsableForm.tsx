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

type CollapsableFormProps = {
  index: number;
  formData?: any;
  handleChange?: () => void;
  handleRemoveForm: (index: number) => void;
};

const CollapsableForm = ({
  index,
  formData,
  handleChange,
  handleRemoveForm

}: CollapsableFormProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const getFormTitle = () => {
    if (!formData?.email) {
      return `Recipient ${index + 1} (No email entered)`;
    }
    return formData.email;
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
            name="gmail"
            type="mail"
            label="Enter your Gmail"
            // direction="Enter variables separated by commas (e.g., name, email, company)"
            value={""}
            //   onChange={handleChange}
          />
          <FormInput
            id="name"
            name="name"
            label="Name"
            // direction="Enter variables separated by commas (e.g., name, email, company)"
            value={""}
            //   onChange={handleChange}
          />
          <FormInput
            id="company"
            name="company"
            label="Company"
            // direction="Enter variabl es separated by commas (e.g., name, email, company)"
            value={""}
            //   onChange={handleChange}
          />
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default CollapsableForm;
