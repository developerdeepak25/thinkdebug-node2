import { Send } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-background border-b" aria-label="Main navigation">
      <div className="container mx-auto px-4 py-4 flex items-center">
        <div className="flex items-center" aria-label="SmartSend logo">
          <Send className="h-6 w-6 text-primary mr-2" aria-hidden="true" />
          <span className="text-lg font-semibold">SmartSend</span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar