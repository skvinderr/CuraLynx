
import type { ReactElement } from "react";

type Variants = "primary" | "secondary"
interface ButtonProps {
  variant: Variants ;
  size?: "sm" | "md" | "lg";
  text: string;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  onClick?: () => void;
  fullWidth?: boolean;
  loading?: boolean
}

const defaultStyles = "px-4 py-2 rounded-md flex items-center font-light"

const VariantStyles = {
  "primary":"bg-purple-600 text-white",
  "secondary":"bg-purple-300 text-white"
}

export const Button = ({variant,text,startIcon, onClick, fullWidth,loading}: ButtonProps) => {
  return <button onClick={onClick} className={VariantStyles[variant] + " "  + defaultStyles +`${fullWidth ? " w-full flex justify-centre items-center" : ""} ${loading ? "opacity-45" : "" }`} disabled={loading}> 

    <div className=" pr-2">{startIcon}</div> 
    {text}
  </button>
}
