import { useMutation } from "@tanstack/react-query";
import { useGoogleLogin } from "@react-oauth/google";
import { getAxiosErrorMessage, getFormsWithContent } from "@/utils";
import { useCallback, useRef } from "react";
import { EmailSendResult } from "../components/EmailSendResultModal";
import { SendFormsValues, TemplateType } from "@/type";
import { toast } from "sonner";
// import { UseFormReset } from "react-hook-form";

type UseSendEmailsProps = {
  template: TemplateType;
  formValues: SendFormsValues;
  setModalOpen: (open: boolean) => void;
  setSendResult: (result: EmailSendResult | null) => void;
//   reset: UseFormReset<SendFormsValues>;
};

type EmailsData = { forms: { to: string; subject: string; body: string }[] };

export default function useSendEmails({
  template,
  formValues,
  setModalOpen,
  setSendResult,
//   reset,
}: UseSendEmailsProps) {
  // Store refs to always have latest setModalOpen/setSendResult in callbacks
  const setModalOpenRef = useRef(setModalOpen);
  const setSendResultRef = useRef(setSendResult);
  setModalOpenRef.current = setModalOpen;
  setSendResultRef.current = setSendResult;

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
      setSendResultRef.current(data);
      setModalOpenRef.current(true);
    //   reset()
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
        toast.error(getAxiosErrorMessage(err, "Failed to store token"));
        // error handled by mutation
      }
    },
    onError: (err) => {
      toast.error(getAxiosErrorMessage(err, "Failed to request Gmail access"));
      // error handled by mutation
    },
  });

  // Helper to send emails with content
  const doSendEmails = useCallback(async () => {
    //   const values = getValues();
    const formsWithContent = getFormsWithContent(formValues, template!);
    sendEmails({ forms: formsWithContent });
  }, [formValues, template, sendEmails]);

  // Handler for Send Emails button
  const onSubmit = useCallback(async () => {
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
      toast.error(getAxiosErrorMessage(err, "Failed to check token"));
      requestGmailAccess();
    }
  }, [doSendEmails, requestGmailAccess, resetSend, resetToken]);

  return {
    onSubmit,
    isSending,
    isTokenStoring,
    isSendError,
    isTokenError,
    sendError,
    tokenError,
    isSendSuccess,
  };
}
