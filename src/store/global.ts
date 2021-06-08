import { reactive } from 'vue'
import { Meal } from '@/types'
import { useLoadMeals, createMeal } from '@/firebase'

const state = reactive({
  count: 1,
  filter: '',
  sort: 'score-asc',
  newMeal: {
    name: '',
    rating: 1,
    difficulty: 1,
    tags: [],
    notes: ''
  } as Meal,
  availableTags: ['Healthy', 'Unhealthy', 'Pasta', 'Rice', 'Potato', 'Bread'],
  storedData: [] as Meal[]
})

const actions = {
  loadExistingData: () => {

    state.storedData = useLoadMeals()
  },
  addMeal: async () => {

    await createMeal({ ...state.newMeal })

    state.newMeal = {
      name: '',
      rating: 1,
      difficulty: 1,
      tags: [],
      notes: ''
    } as Meal
  }
}

export default { state, ...actions }
