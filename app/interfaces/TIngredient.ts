import { ImageType } from "react-images-uploading"

export type TIngredient = {
  max: number
  name: string
  image: ImageType
  isRemovable: boolean
}[]
