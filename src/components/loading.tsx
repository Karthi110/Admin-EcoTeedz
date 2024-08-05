import { Loader2 } from "lucide-react";
import React from "react";

const LoadingPage = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Loader2 size={30} className="animate-spin" />
    </div>
  );
};

export default LoadingPage;
