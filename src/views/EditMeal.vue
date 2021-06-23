<template>
  <main>
    <meal-form action="update" :mealId="mealId" />
  </main>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import MealForm from '@/components/MealForm.vue'

export default defineComponent({
  components: { MealForm },
  setup() {
    const route = useRoute()
    //get the meal id from the url
    const mealId = computed(() => route.params.id.toString())

    return { mealId }
  }
})
</script>
