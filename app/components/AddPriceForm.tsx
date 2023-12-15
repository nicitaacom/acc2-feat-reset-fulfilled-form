"use client"

import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"

import { useLoading } from "@/store/useLoading"
import { useAddFoodStore } from "@/store/useAddFoodStore"
import { twMerge } from "tailwind-merge"
import { FoodInput } from "@/components/FoodInput"
import { TIngredient } from "@/interfaces/TIngredient"
import { pusherClient } from "@/libs/pusher"

export interface FormData {
  title: string
  price: number
  ingredient: TIngredient
  max: number
  recommendation: string
}

export function AddPriceForm() {
  const { isLoading } = useLoading()
  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<HTMLDivElement>(null)
  const { food, setFood } = useAddFoodStore()

  const { handleSubmit, register, reset } = useForm<FormData>()

  useEffect(() => {
    pusherClient.subscribe("reset")
    console.log(31, "subscribe to reset channel")

    const resetHandler = () => {
      console.log(33, "reset")
      reset()
    }

    pusherClient.bind("reset:form", resetHandler)

    return () => {
      pusherClient.unsubscribe("tickets")
      pusherClient.unbind("reset:form", resetHandler)
    }
  }, [reset])

  useEffect(() => {
    const ref = inputRef.current
    // https://github.com/react-hook-form/react-hook-form/issues/11135
    if (inputRef.current) {
      inputRef.current.addEventListener("keydown", disableInput)
    }
    return () => ref?.removeEventListener("keydown", disableInput)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing])

  const enableInput = () => {
    setIsEditing(true)
  }

  const onSubmit = (data: FormData) => {
    setFood({ price: data.price })
    setIsEditing(false)
  }

  const disableInput = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.stopPropagation()
      setIsEditing(false)
    }
    if (event.key === "Enter") {
      const onSubmitForm = handleSubmit(onSubmit)
      onSubmitForm() // Call the onSubmit function directly
    }
  }

  return (
    <div
      className={twMerge(
        "w-full tablet:w-fit flex flex-row items-center overflow-hidden text-center tablet:text-end",
        isLoading && "opacity-50 cursor-default pointer-events-none",
      )}>
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <div ref={inputRef}>
          <FoodInput
            className="w-full text-center tablet:text-end font-bold flex justify-center placeholder:text-placeholder-color"
            id="price"
            type="numeric"
            register={register}
            onBlur={handleSubmit(onSubmit)}
            placeholder="Enter price"
          />
        </div>
      </form>
    </div>
  )
}
