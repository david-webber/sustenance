<template>
  <main>
    <form @submit.prevent="update()">
      <div>
        <label for="foodName">Meal Name</label>
        <input
          id="foodName"
          type="text"
          required
          v-model="form.name"
          placeholder="Meal"
        />
      </div>

      <div>
        <label>Tags</label>
        <div class="tags-container">
          <button
            class="tag"
            @click.prevent="toggleTag(tag)"
            :class="{ active: form.tags.includes(tag) }"
            v-for="(tag, i) in state.availableTags"
            :key="i"
          >
            {{ tag }}
          </button>
        </div>
      </div>
      <div>
        <label for="">Notes</label
        ><textarea
          v-model="form.notes"
          name=""
          id=""
          cols="20"
          rows="5"
        ></textarea>
      </div>
      <button>Submit</button>
    </form>
  </main>
</template>

<script lang="ts">
import { reactive, computed, onMounted, defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getMeal, updateMeal } from '@/firebase'

import global from '@/store/global'

export default defineComponent({
  setup() {
    const { state } = global
    const router = useRouter()
    const route = useRoute()
    // const userId = computed(() => route.params.id.toString())
    //get the meal id from the url
    const mealId = computed(() => route.params.id.toString())
    //specificy the form as reactive elements
    const form = reactive({
      name: '',
      difficulty: 10,
      rating: 10,
      notes: '',
      tags: []
    })
    onMounted(async () => {
      console.log('testing')
      const meal = await getMeal(mealId.value)
      console.log(meal)
      form.name = meal && meal.name ? meal.name : ''
      form.difficulty = meal && meal.difficulty ? meal.difficulty : ''
      form.rating = meal && meal.rating ? meal.rating : ''
      form.notes = meal && meal.notes ? meal.notes : ''
      form.tags = meal && meal.tags ? meal.tags : ''
    })

    const update = async () => {
      await updateMeal(mealId.value, { ...form })
      router.push('/')
      form.name = ''
      form.difficulty = 10
      form.rating = 10
      form.notes = ''
      form.tags = []
    }

    return { update, form, state }
  }
})
</script>
