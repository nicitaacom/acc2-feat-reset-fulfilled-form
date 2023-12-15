import { create } from "zustand"

export type TCategories = "Main dishes" | "Deserts" | "Drinks"

interface CategoriesStore {
  category: TCategories
  setCategory: <T extends TCategories>(category: T) => void
}

export const useCategories = create<CategoriesStore>()(set => ({
  category: "Main dishes",
  setCategory: category => {
    set(() => ({
      category: category,
    }))
  },
}))
