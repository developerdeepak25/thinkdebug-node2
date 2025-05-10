// import { useGoogleLogin } from "@react-oauth/google";
import { useEffect, useMemo } from "react";
import CollapsableForm from "../CollapsableForm";
import NarrowLayout from "../Wrappers/NarrowLayout";
import { Button } from "../ui/button";
import { Mail, Plus } from "lucide-react";
import useStore from "@/store/store";
import { useFieldArray, useForm } from "react-hook-form";
import { createObjectFromArray } from "@/utils";
import { SendForm } from "@/type";
import { useMutation } from "@tanstack/react-query";

export type SendFormsValues = {
  forms: SendForm[];
};

function Send() {
  const { template } = useStore();
  const variableObj = useMemo(
    () => createObjectFromArray(template?.variables ?? [], ""),
    [template?.variables]
  );
  // useMuatioan
  const { mutate } = useMutation({
    mutationFn: async (data: SendFormsValues) => {
      console.log("Sending emails", data);
      const res = await fetch("http://localhost:3000/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
      return res.json();
    },
    onSuccess: (data) => {
      console.log("Emails sent successfully", data);
    },
    onError: (error) => {
      console.error("Error sending emails", error);
    },
  });

  const { register, handleSubmit, control, watch } = useForm<SendFormsValues>({
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

  // Use field array for dynamic form fields
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

  // onSubmit function to handle form submission
  const onSubmit = (data: SendFormsValues) => {

    console.log("Form data", data); //?dev

    // Prepare forms with content having variables replaced
    const formsWithContent = data.forms.map((form) => {
      let content = template?.content || "";
      // Replace all {{variable}} with the value from form.variables
      content = content.replace(/{{\s*([\w\d_]+)\s*}}/g, (_, varName) => {
        return form.variables[varName] ?? "";
      });
      return {
        ...form,
        content,
      };
    });

    console.log("Forms with content", formsWithContent); //?dev

    // Send the modified forms
    mutate({ forms: formsWithContent });
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
          <Button onClick={handleAddForm} className="flex items-center gap-2">
            <Plus size={16} />
            Add Form
          </Button>
          <Button
            // onClick={handleSendEmails}
            className="flex items-center gap-2"
            type="submit"
          >
            <Mail size={16} />
            Send Emails
          </Button>
        </div>
      </form>
    </NarrowLayout>
  );
}

export default Send;

// const requestCalendarAccess = useGoogleLogin({
//   flow: "auth-code",
//   scope:
//     "https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.readonly",
//   onSuccess: async (codeResponse) => {
//     console.log("gcp res", codeResponse);

//     try {
//       // setIs
//       // (null);

//       // Exchange code for tokens
//       console.log(`/store-token`);

//       const res = await fetch("http://localhost:3000/api/store-token", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ code: codeResponse.code }),
//         credentials: "include",
//       });
//       console.log("store", res);
//       if (!res.ok) {
//         throw new Error("Failed to store token");
//       }

//       // After successful authentication, create the event
//     } catch (err) {
//       // setError("Failed to authenticate with Google");
//       console.error("Authentication error:", err);
//     } finally {
//       // setIsLoading(false);
//     }
//   },
//   onError: (errorResponse) => {
//     // setError("Google authentication failed");
//     console.error("Google OAuth Error:", errorResponse);
//   },
// });

// const createCalendarEvent = async () => {
//   try {
//     //  setIsLoading(true);
//     //  setError(null);
//     console.log(`/create-event`);
//     const response = await fetch("http://localhost:3000/api/send-email", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       // body: JSON.stringify(event),
//       credentials: "include",
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       if (response.status === 401) {
//         requestCalendarAccess();
//         return;
//       }
//       if (response.status === 409) {
//         console.log("event already exists"); //TODO: add Toast
//         //  toast.error("Event already exists in calendar");
//         //  setError(data.message || "Event already exists in calendar");
//         return;
//       }
//       throw new Error(data.error || "Failed to create event");
//     }

//     console.log("Event created:", data); //TODO: add sucess Toast for event creation
//     //  toast.success("Event added to calendar");
//   } catch (err) {
//     //  setError(err.message);
//     console.error("Error creating event:", err);
//   } finally {
//     //  setIsLoading(false);
//   }
// };

// const handleCreateEvent = async () => {
//   try {
//     //  setIsLoading(true);
//     //  setError(null);

//     // Check if we have a valid token first
//     console.log(`/check-token`);
//     const tokenCheck = await fetch("http://localhost:3000/api/check-token", {
//       credentials: "include",
//     });

//     if (tokenCheck.ok) {
//       // We have a valid token, proceed with event creation
//       console.log(`token chaka chak`);
//       await createCalendarEvent();
//     } else {
//       // No valid token, request consent
//       requestCalendarAccess();
//     }
//   } catch (err) {
//     console.error("Error checking token:", err);
//     requestCalendarAccess();
//   }
//   //  finally {
//   //  setIsLoading(false);
//   //  }
// };

//   return (
// <div className="flex gap-4">
//   <Button onClick={requestCalendarAccess}>Login with Google</Button>
//   <Button onClick={handleCreateEvent}>Create Event</Button>
// </div>
//   );
