import { TCategories } from "@/store/useCategories"
import { ImageListType } from "react-images-uploading"
import { TIngredient } from "./TIngredient"

export type TFood = {
  id: string
  price_id: string
  category: TCategories
  images: ImageListType
  defaultPresentationView: number
  title: string
  price: number
  ingredients: Partial<TIngredient>
  recommendation?: string
}
