import { useState } from "react";
import { InteractiveGridPattern } from "../components/ui/interactive-grid-pattern";
import { cn } from "../utils";
import { Link } from "react-router-dom";
import LoginComponent from "@/components/LoginComponent";

export default function GetStarted() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  return (
    <main className="w-full h-full">
      <LoginComponent />
    </main>
  );
}
