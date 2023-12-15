"use client"

import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"

import { useLoading } from "@/store/useLoading"
import { FoodInput } from "@/components/FoodInput"
import { twMerge } from "tailwind-merge"
import { useAddFoodStore } from "@/store/useAddFoodStore"
import { TIngredient } from "@/interfaces/TIngredient"
import { pusherClient } from "@/libs/pusher"

export interface FormData {
  title: string
  price: number
  ingredient: TIngredient
  max: number
  recommendation: string
}

export function AddTitleForm() {
  const { isLoading } = useLoading()
  const inputRef = useRef<HTMLDivElement>(null)
  const { food, setFood, resetForm } = useAddFoodStore()

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
  }, [])

  const onSubmit = (data: FormData) => {
    setFood({ title: data.title })
  }

  const disableInput = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.stopPropagation()
    }
    if (event.key === "Enter") {
      console.log(71, "enter pressed")

      const onSubmitForm = handleSubmit(onSubmit)
      onSubmitForm() // Call the onSubmit function directly
    }
  }

  return (
    <div
      className={twMerge(
        "flex flex-row text-center tablet:text-start",
        isLoading && "opacity-50 cursor-default pointer-events-none",
      )}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div ref={inputRef}>
          <FoodInput
            className="w-full font-bold text-center tablet:text-start placeholder:text-placeholder-color"
            id="title"
            register={register}
            onBlur={handleSubmit(onSubmit)}
            placeholder="Enter title"
          />
        </div>
      </form>
    </div>
  )
}
