"use client"

import axios from "axios"
import { AddTitleForm } from "./components/AddTitleForm"
import { useAddFoodStore } from "./store/useAddFoodStore"
import { AddMaxIngredientsForm } from "./components/AddMaxIngredientsForm"
import { AddPriceForm } from "./components/AddPriceForm"
import { AddIngredientNameForm } from "./components/AddIngredientName"

export default function Home() {
  const { food, isFormFulfilled: isFormFulfilledd } = useAddFoodStore()

  async function resetForm() {
    const { isFormFulfilled, message } = isFormFulfilledd()
    if (isFormFulfilled) {
      await axios.post("/api/reset", { title: food.title })
    } else {
      console.log(17, "form is not fulfilled - ", message)
    }
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="w-full flex justify-between">
        <AddTitleForm />
        <AddPriceForm />
      </div>
      <div className="w-full flex flex-col gap-y-2">
        <AddMaxIngredientsForm ingredientIndex={0} />
        <AddIngredientNameForm ingredientIndex={0} />
      </div>
      <button className="bg-transparent px-4 py-2 border border-success" onClick={resetForm}>
        Add food
      </button>
    </div>
  )
}
