"use client"

import { useEffect, useRef, useState } from "react"
import { twMerge } from "tailwind-merge"
import { useForm } from "react-hook-form"
import { ImageListType } from "react-images-uploading"

import { IngredientInput } from "@/components/IngredientInput"
import { useLoading } from "@/store/useLoading"
import { useAddFoodStore } from "@/store/useAddFoodStore"
import { pusherClient } from "@/libs/pusher"

interface FormData {
  max: number
  name: string
  image: ImageListType
  isRemovable: boolean
}

export function AddMaxIngredientsForm({ ingredientIndex }: { ingredientIndex: number }) {
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
    console.log(55, "data - ", data)
    const updatedIngredients = [...food.ingredients]
    updatedIngredients[ingredientIndex] = {
      ...updatedIngredients[ingredientIndex]!,
      max: data.max,
    }
    setFood({ ingredients: updatedIngredients })
    console.log(61, "updated ingredients - ", updatedIngredients)
    console.log(61, "food - ", food)
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
        "w-full laptop:w-fit flex flex-row justify-center items-center ml-8 tablet:ml-0",
        isLoading && "opacity-50 cursor-default pointer-events-none",
      )}>
      <p>max:&nbsp;</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div ref={inputRef}>
          <IngredientInput
            className="w-[64px] tablet:w-[32px] text-[16px]"
            id="max"
            type="numeric"
            register={register}
            onBlur={handleSubmit(onSubmit)}
          />
        </div>
      </form>
    </div>
  )
}
