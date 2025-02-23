import { FormInput } from "@/components/form-input";
import { FormTextarea } from "@/components/form-textarea";
import { Button } from "@/components/ui/button";
import NarrowLayout from "../Wrappers/NarrowLayout";
import InputWithBadges from "../InputWithBages";
import { useForm } from "react-hook-form";
import useStore from "@/store/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export type FormValues = {
  name: string;
  variables: string[];
  content: string;
};

export default function Template() {
  const {
    register,
    control,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      variables: [],
    },
  });
  const { addTemplate, template } = useStore();
  const navigate = useNavigate()
  useEffect(() => {
    console.log(template);
  }, [template]);

  const onSubmit = (data: FormValues) => {
    console.log(data);
    addTemplate(data);
    reset(); // may not be needed as will redirest to create | send page
    navigate('/send')
  };

  return (
    <NarrowLayout>
      <h1 className="text-3xl font-bold mb-8">Create Gmail Template</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormInput
          id="name"
          {...register("name", {
            required: "Template name is required",
          })}
          label="Template Name"
          direction="Enter a unique name for your template"
          error={errors.name}
        />
        <InputWithBadges<FormValues>
          control={control}
          name="variables"
          id="variables"
          label="Variables"
          direction="Enter variables and click add to add them to your template"
          setError={setError}
          clearErrors={clearErrors}
        />
        <FormTextarea
          id="content"
          label="Template Content "
          direction="Write your email template here. Use {{variable}} syntax for dynamic content"
          {...register("content", { required: 'Template content is required' })}
          rows={10}
          error={errors.content}
        />
        <Button type="submit" size="lg">
          Create Template
        </Button>
      </form>
    </NarrowLayout>
  );
}
