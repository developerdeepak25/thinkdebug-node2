import { Outlet } from "react-router-dom";
import "./App.css";
import Navbar from "./components/navbar/Navbar";
const App = () => {
  return (
    <>
      <div className="flex flex-col h-full overflow-y-auto"> 
        <Navbar />
        <Outlet />
      </div>
    </>
  );
};

export default App;
