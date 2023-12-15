import { TFood } from "@/interfaces/TFood"
import { useCategories } from "@/store/useCategories"
import { create } from "zustand"

interface AddFoodStore {
  food: TFood
  setFood: (data: Partial<TFood>) => void
  addIngredient: () => void
  isFormEdited: () => boolean
  isFormFulfilled: () => { isFormFulfilled: boolean; message: string }
  resetForm: () => void
}

export const initialFoodState: TFood = {
  id: "",
  price_id: "",
  category: useCategories.getState().category,
  images: [],
  defaultPresentationView: 0,
  title: "",
  price: 0,
  ingredients: [
    {
      max: 0,
      name: "",
      image: {},
      isRemovable: false,
    },
  ],
}

const newIngredient = {
  max: 0,
  name: "",
  image: [],
  isRemovable: false,
}

type SetState = (fn: (prevState: AddFoodStore) => Partial<AddFoodStore>) => void
type GetState = () => AddFoodStore // get state required to use useAddFoodStore.getState()

export const useAddFoodStore = create<AddFoodStore>()(
  (set: SetState, get: GetState): AddFoodStore => ({
    food: initialFoodState, // TODO - test what will be if {...initialFoodState}
    setFood: data => {
      set(state => ({
        food: { ...state.food, ...data },
      }))
    },
    addIngredient: () => {
      set(state => ({
        food: {
          ...state.food,
          ingredients: [...state.food.ingredients, newIngredient],
        },
      }))
    },
    isFormEdited: () => {
      const { food } = useAddFoodStore.getState()
      return JSON.stringify(food) !== JSON.stringify(initialFoodState)
    },
    isFormFulfilled: () => {
      const { food } = useAddFoodStore.getState()
      if (!!!food.title) {
        return { isFormFulfilled: false, message: "No title" }
      }
      if (food.price <= 0) {
        return { isFormFulfilled: false, message: `Price is ${food.price}` }
      }
      if (food.ingredients[0]!.max === 0) {
        return { isFormFulfilled: false, message: `No max ingredients - ${food.ingredients[0]!.max}` }
      }
      if (!food.ingredients[0]!.name) {
        return { isFormFulfilled: false, message: "No ingredient name" }
      }
      return { isFormFulfilled: true, message: "form is fulfilled" }
    },
    resetForm: () => {
      set(() => ({
        food: initialFoodState,
      }))
    },
  }),
)
