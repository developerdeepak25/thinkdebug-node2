import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppLayout from "./App.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Send from "./components/pages/Send.tsx";
import Home from "./components/pages/Home.tsx";
import Template from "./components/pages/Template.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();


const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "send",
        element: <Send />,
      },
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "template",
        element: <Template />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />{" "}
      </QueryClientProvider>
    </GoogleOAuthProvider>{" "}
  </StrictMode>
);
