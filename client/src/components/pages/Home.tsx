import { Button } from "@/components/ui/button";

import useStore from "@/store/store";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import TemplateCard from "../TemplateCard";

export default function Home() {
  const { template } = useStore();

  useEffect(()=>{
    console.log(template);
    
  },[template])

  // Function to truncate text
  

  return (
    <>
      <main className="container mx-auto px-4 pt-28 grow">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Welcome to SmartSend
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
            Create and manage intelligent email templates for your marketing
            campaigns and customer communications.
          </p>
          <Button size="lg" className="text-white">
            <Link to={"/template"} className="text-inherit hover:text-inherit">
              Create Template
            </Link>
          </Button>
        </div>

        {/* Templates listing section */}
        <div className="border-t my-16">
          <h2 className="text-2xl font-medium pt-10 text-slate-700 text-center">
            Your Templates
          </h2>
          <div className="mt-10">
            {/* //!currently showing only one template for testing afterwords will add functionality to add multiple templates. store currently can only have one */}
            {template && Object.entries(template).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* //TODO:  */}
                {[template].map((template, index) => (
                  <TemplateCard
                    key={index}
                    title={template.name}
                    content={template.content}
                  />
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center h-40">
                <p className="text-muted-foreground">
                  Your templates will appear here
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
