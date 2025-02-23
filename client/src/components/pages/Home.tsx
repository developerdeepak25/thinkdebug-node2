import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      {/* <nav className="bg-background border-b" aria-label="Main navigation">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <div className="flex items-center" aria-label="SmartSend logo">
            <Send className="h-6 w-6 text-primary mr-2" aria-hidden="true" />
            <span className="text-lg font-semibold">SmartSend</span>
          </div>
        </div>
      </nav> */}
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
        <div className="border-t my-16 flex justify-center items-center">
          <h1 className="text-2xl font-medium pt-20 text-slate-700">
            Your Templates apper here
          </h1>
        </div>
      </main>
    </>
  );
}
