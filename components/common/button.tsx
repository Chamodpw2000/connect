import React from 'react'
import { Button } from '../ui/button'

interface CustomButtonProps {
    label: string;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
    type?: "submit";
}

const CustomButton = ({ label, onClick, className = '', disabled = false, type }: CustomButtonProps) => {

  return (
    <div>
        <Button
          className={`w-[200px] bg-secondary text-white hover:bg-secondary/80 cursor-pointer ${className}`}
          onClick={onClick}
          disabled={disabled}
          type={type}
        >
            {label}
        </Button>
    </div>
  )
}

export default CustomButton