"use client"

import { useEffect, useRef, useState } from "react"
import { twMerge } from "tailwind-merge"
import { useForm } from "react-hook-form"

import { IngredientInput } from "@/components/IngredientInput"
import { useLoading } from "@/store/useLoading"
import { useAddFoodStore } from "@/store/useAddFoodStore"
import { ImageListType } from "react-images-uploading"
import { pusherClient } from "@/libs/pusher"

interface FormData {
  max: number
  name: string
  image: ImageListType
  isRemovable: boolean
}

export function AddIngredientNameForm({ ingredientIndex }: { ingredientIndex: number }) {
  const { isLoading } = useLoading()
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
  }, [])

  const onSubmit = (data: FormData) => {
    console.log(55, "food- ", food)
    const updatedIngredients = [...food.ingredients]
    updatedIngredients[ingredientIndex] = {
      ...updatedIngredients[ingredientIndex]!,
      name: data.name,
    }
    console.log(61, "updated ingredients - ", updatedIngredients)
    setFood({ ingredients: updatedIngredients })
    console.log(62, "food- ", food)
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
        "w-full flex flex-row justify-center",
        isLoading && "opacity-50 cursor-default pointer-events-none",
      )}>
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full" ref={inputRef}>
          <IngredientInput
            className="min-w-[132px] w-full text-center text-2xl font-bold"
            id="name"
            register={register}
            onBlur={handleSubmit(onSubmit)}
          />
        </div>
      </form>
    </div>
  )
}
