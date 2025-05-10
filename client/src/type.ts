export type SendForm = {
  email: string;
  variables: Record<string, string>;
};


export type SendFormsValues = {
  forms: SendForm[];
};


export type TemplateType = {
  name: string;
  subject: string;
  variables: string[];
  content: string;
};