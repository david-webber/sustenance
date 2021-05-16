import { reactive } from 'vue'
import { Meal } from '@/types'

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
    const existingDataString: string = localStorage.getItem('entries') || ''
    if (existingDataString) {
      state.storedData = JSON.parse(existingDataString)
    }
  },
  addMeal: () => {
    state.storedData.push(state.newMeal)
    localStorage.setItem('entries', JSON.stringify(state.storedData))
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
