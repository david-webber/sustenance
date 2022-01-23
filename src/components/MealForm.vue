<template>
  <form class="addMealForm" @submit.prevent="handleFormSubmission">
    <div>
      <label for="foodName">Meal Name</label>
      <input
        id="foodName"
        type="text"
        required
        v-model="name"
        placeholder="Meal"
      />
    </div>
    <RadioStars
      name="Difficulty"
      :current="difficulty"
      icon="😍,😃,😊,🙂,😐,🤨,😕,🙁,😠,🤬"
      @changed="(val) => (difficulty = val)"
    />
    <RadioStars
      name="Tastiness"
      :current="rating"
      @changed="(val) => (rating = val)"
    />
    <div>
      <label>Tags</label>
      <div class="tags-container">
        <button
          class="tag"
          :class="{ active: tags.includes(tag) }"
          v-for="(tag, i) in state.availableTags"
          @click.prevent="toggleTag(tag)"
          :key="i"
        >
          {{ tag }}
        </button>
      </div>
    </div>
    <div>
      <label for="">Notes</label
      ><textarea v-model="notes" name="" id="" cols="20" rows="5"></textarea>
    </div>
    <button type="submit">Add Meal</button>
  </form>
</template>

<script lang="ts">
import RadioStars from '@/components/RadioStars.vue'

import { defineComponent, reactive, toRefs, onMounted } from 'vue'
import { Meal } from '@/types'
import { useRouter } from 'vue-router'

import global from '@/store/global'

import { createMeal, updateMeal, getMeal } from '@/firebase'

export default defineComponent({
  props: {
    action: {
      type: String,
      default: ''
    },

    mealId: {
      type: String,
      default: ''
    }
  },
  setup(props: any) {
    const router = useRouter()
    const { state } = global
    const editingMeal = reactive({
      name: '',
      rating: 0,
      difficulty: 0,
      tags: [],
      notes: ''
    } as Meal)

    const toggleTag = (tag: string) => {
      editingMeal.tags = editingMeal.tags.includes(tag)
        ? editingMeal.tags.filter((x) => x !== tag)
        : [...editingMeal.tags, tag]
    }

    const handleFormSubmission = async function () {
      if (props.action == 'add') {
        await createMeal({ ...editingMeal })
        editingMeal.name = ''
        editingMeal.rating = 1
        editingMeal.difficulty = 1
        editingMeal.tags = []
        editingMeal.notes = ''
      } else {
        await updateMeal(props.mealId, { ...editingMeal })
        router.push('/')
      }
    }

    onMounted(async () => {
      if (props.mealId) {
        const savedMeal = await getMeal(props.mealId)

        // console.log(meal)
        editingMeal.name = savedMeal && savedMeal.name ? savedMeal.name : ''
        editingMeal.difficulty =
          savedMeal && savedMeal.difficulty ? parseInt(savedMeal.difficulty) : 0
        editingMeal.rating =
          savedMeal && savedMeal.rating ? parseInt(savedMeal.rating) : 0
        editingMeal.notes = savedMeal && savedMeal.notes ? savedMeal.notes : ''
        editingMeal.tags = savedMeal && savedMeal.tags ? savedMeal.tags : ''
      }
    })

    return { ...toRefs(editingMeal), state, toggleTag, handleFormSubmission }
  },
  components: {
    RadioStars
  }
})
</script>

<style lang="scss">
form {
  button[type='submit'] {
    width: 100%;
    font-weight: bold;
    font-size: 1.3rem;
  }
}
.addMealForm {
  border: 1px dotted var(--border-colour);
  padding: 1rem;
  border-radius: var(--border-radius);
}
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.tag {
  cursor: pointer;
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  background-color: rgba(55, 102, 231, 0.5);
  color: var(--action-button-color);
  border: 1px solid transparent;
  transition: all ease 0.2s;
  &.active {
    background-color: var(--action-button-background);
    border: 1px solid rgb(31, 20, 51);
  }
}
</style>
