// import type React from "react"
// import { useState } from "react"

// interface TemplateForm {
//   name: string
//   variables: string
//   content: string
// }

// export function useTemplateForm(initialState: TemplateForm = { name: "", variables: "", content: "" }) {
//   const [form, setForm] = useState<TemplateForm>(initialState)

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target
//     setForm((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     // Handle form submission here
//     console.log(form)
//   }

//   return { form, handleChange, handleSubmit }
// }

