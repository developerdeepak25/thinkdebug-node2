import { useEffect, useMemo, useState } from "react";
import CollapsableForm from "../CollapsableForm";
import NarrowLayout from "../Wrappers/NarrowLayout";
import { Button } from "../ui/button";
import { Mail, Plus } from "lucide-react";
import useStore from "@/store/store";
import { useFieldArray, useForm } from "react-hook-form";
import { createObjectFromArray } from "@/utils";
import { SendForm } from "@/type";
import { useMutation } from "@tanstack/react-query";
import { useGoogleLogin } from "@react-oauth/google";
import EmailSendResultModal, { EmailSendResult } from "../EmailSendResultModal";

export type SendFormsValues = {
  forms: SendForm[];
};
type EmailData = {
  to: string;
  subject: string;
  body: string;
};
type EmailsData = { forms: EmailData[] };

function Send() {
  const { template } = useStore();
  const variableObj = useMemo(
    () => createObjectFromArray(template?.variables ?? [], ""),
    [template?.variables]
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [sendResult, setSendResult] = useState<EmailSendResult | null>(null);

  // Mutation for sending emails
  const {
    mutate: sendEmails,
    isPending: isSending,
    isError: isSendError,
    error: sendError,
    reset: resetSend,
    isSuccess: isSendSuccess,
  } = useMutation({
    mutationFn: async (data: EmailsData) => {
      const res = await fetch("http://localhost:3000/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to send emails");
      }
      return res.json();
    },
    onSuccess: (data) => {
      setSendResult(data);
      setModalOpen(true);
    },
  });

  // Mutation for storing token
  const {
    mutateAsync: storeToken,
    isPending: isTokenStoring,
    isError: isTokenError,
    error: tokenError,
    reset: resetToken,
  } = useMutation({
    mutationFn: async (code: string) => {
      const res = await fetch("http://localhost:3000/api/store-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to store token");
      }
      return res.json();
    },
  });

  const { register, handleSubmit, control, watch, getValues } =
    useForm<SendFormsValues>({
      defaultValues: {
        forms: [
          {
            email: "",
            variables: variableObj,
          },
        ],
      },
    });

  useEffect(() => {
    console.log(watch("forms"));
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

  const getFormsWithContent = (data: SendFormsValues) => {
    return data.forms.map((form) => {
      let content = template?.content || "";
      content = content.replace(/{{\s*([\w\d_]+)\s*}}/g, (_, varName) => {
        return form.variables[varName] ?? "";
      });
      return {
        to: form.email,
        subject: template?.subject || "",
        body: content,
      };
    });
  };

  // Google OAuth for Gmail access
  const requestGmailAccess = useGoogleLogin({
    flow: "auth-code",
    scope:
      "https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.readonly",
    onSuccess: async (codeResponse) => {
      try {
        await storeToken(codeResponse.code);
        await doSendEmails();
      } catch (err) {
        console.error("Error storing token:", err);
        // error handled by mutation
      }
    },
    onError: (errorResponse) => {
      console.error("Login Failed:", errorResponse);
      // error handled by mutation
    },
  });

  // Helper to send emails with content
  const doSendEmails = async () => {
    const values = getValues();
    const formsWithContent = getFormsWithContent(values);
    sendEmails({ forms: formsWithContent });
  };

  // Handler for Send Emails button
  const onSubmit = async () => {
    resetSend();
    resetToken();
    try {
      const tokenCheck = await fetch("http://localhost:3000/api/check-token", {
        credentials: "include",
      });
      if (tokenCheck.ok) {
        await doSendEmails();
      } else {
        requestGmailAccess();
      }
    } catch (err) {
      console.error("Error checking token:", err);
      requestGmailAccess();
    }
  };

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
