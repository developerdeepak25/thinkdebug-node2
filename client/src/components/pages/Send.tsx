import { useMemo, useState } from "react";
import CollapsableForm from "../CollapsableForm";
import NarrowLayout from "../Wrappers/NarrowLayout";
import { Button } from "../ui/button";
import { Mail, Plus } from "lucide-react";
import useStore from "@/store/store";
import { useFieldArray, useForm } from "react-hook-form";
import { createObjectFromArray } from "@/utils";
import { SendForm } from "@/type";
import EmailSendResultModal, { EmailSendResult } from "../EmailSendResultModal";
import useSendEmails from "@/hooks/useSendEmails";

export type SendFormsValues = {
  forms: SendForm[];
};

function Send() {
  const { template } = useStore();
  const variableObj = useMemo(
    () => createObjectFromArray(template?.variables ?? [], ""),
    [template?.variables]
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [sendResult, setSendResult] = useState<EmailSendResult | null>(null);

  const { register, handleSubmit, control, getValues,reset } = useForm<SendFormsValues>({
    defaultValues: {
      forms: [
        {
          email: "",
          variables: variableObj,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "forms",
  });

  const handleAddForm = () => {
    append({
      email: "",
      variables: variableObj,
    });
  };

  // Use custom hook for all mutation and onSubmit logic
  const {
    onSubmit,
    isSending,
    isTokenStoring,
    isSendError,
    isTokenError,
    sendError,
    tokenError,
    isSendSuccess,
  } = useSendEmails({
    template: template!,
    formValues: getValues(),
    setModalOpen,
    setSendResult,
    reset
  });

  return (
    <NarrowLayout>
      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((form, index) => (
          <CollapsableForm
            key={index}
            index={index}
            handleRemoveForm={() => remove(index)}
            formData={form}
            register={register}
            control={control}
          ></CollapsableForm>
        ))}
        <div className="mb-6 flex justify-between items-center">
          <Button
            onClick={handleAddForm}
            className="flex items-center gap-2"
            type="button"
          >
            <Plus size={16} />
            Add Form
          </Button>
          <Button
            className="flex items-center gap-2"
            type="submit"
            disabled={isSending || isTokenStoring}
          >
            <Mail size={16} />
            {isSending || isTokenStoring ? "Sending..." : "Send Emails"}
          </Button>
        </div>
        {(isSendError || isTokenError) && (
          <div className="text-red-500 mb-2">
            {sendError?.message || tokenError?.message || "An error occurred"}
          </div>
        )}
        {isSendSuccess && (
          <div className="text-green-600 mb-2">Emails sent successfully!</div>
        )}
      </form>
      <EmailSendResultModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        result={sendResult}
      />
    </NarrowLayout>
  );
}

export default Send;
