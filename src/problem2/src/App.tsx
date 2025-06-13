import { Toaster } from "react-hot-toast";
import SwapForm from "./components/SwapForm";

function App() {
  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-black">
        <SwapForm />
      </div>
      <Toaster position="top-center" />
    </>
  );
}

export default App;
