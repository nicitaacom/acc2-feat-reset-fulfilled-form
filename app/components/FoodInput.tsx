"use client"

import { TIngredient } from "@/interfaces/TIngredient"
import { UseFormRegister } from "react-hook-form"
import { twMerge } from "tailwind-merge"

interface FormData {
  title: string
  price: number
  ingredient: TIngredient
  max: number
  recommendation: string
}

interface FoodInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: keyof FormData
  className?: string
  type?: string | "numeric"
  register: UseFormRegister<FormData>
  placeholder?: string
}

export function FoodInput({ id, className, type, register, placeholder, ...props }: FoodInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { key, target } = e
    const { value } = target as HTMLInputElement

    const decimalIndex = value.indexOf(".")

    if (value.length > 7) {
      e.preventDefault() // Prevent typing more then 7 characters (9999.99)
    }
    if (key === "." && decimalIndex !== -1) {
      e.preventDefault() // Prevent additional decimal points
    } else if (decimalIndex !== -1 && value.substring(decimalIndex).length > 2 && key !== "Backspace") {
      e.preventDefault() // Prevent typing more than two digits after the decimal point
    } else if (!/^\d*\.?\d*$/.test(value + key) && !["Backspace", "Delete", "Tab", "Enter"].includes(key)) {
      e.preventDefault() // Prevent typing non-numeric characters
    } else if (
      decimalIndex === -1 &&
      value.length === 4 &&
      key !== "." &&
      !["Backspace", "Delete", "Tab", "Enter"].includes(key)
    ) {
      e.preventDefault() // Prevent typing more than four digits before the decimal point e.g 99999
    }
  }

  return (
    <input
      className={twMerge("bg-transparent outline-none text-3xl text-title", className)}
      id={id}
      type={type}
      onKeyDown={type === "numeric" ? handleKeyDown : () => {}}
      {...register(id)}
      placeholder={placeholder}
      autoFocus
      {...props}
    />
  )
}
