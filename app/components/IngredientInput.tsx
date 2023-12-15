"use client"

import { UseFormRegister } from "react-hook-form"
import { ImageListType } from "react-images-uploading"
import { twMerge } from "tailwind-merge"

interface FormData {
  max: number
  name: string
  image: ImageListType
  isRemovable: boolean
}

interface FoodInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: keyof FormData
  className?: string
  type?: string | "numeric"
  register: UseFormRegister<FormData>
  placeholder?: string
}

export function IngredientInput({ id, className, type, register, placeholder, ...props }: FoodInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { key, target } = e
    const { value } = target as HTMLInputElement

    if (value.length >= 1 && !["Backspace", "Delete", "Tab", "Enter"].includes(key)) {
      e.preventDefault() // Prevent typing more than 1 character
    } else if (!/^[1-8]$/.test(key) && !["Backspace", "Delete", "Tab", "Enter"].includes(key)) {
      e.preventDefault() // Prevent typing non-allowed characters
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
      {...props}
    />
  )
}
