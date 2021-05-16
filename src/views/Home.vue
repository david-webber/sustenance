<template>
  <main>
    <h1>Sustenance</h1>
    <hr />
    <form @submit.prevent="addMeal">
      <div>
        <label for="foodName">Meal</label>
        <input
          id="foodName"
          type="text"
          required
          v-model="state.newMeal.name"
          placeholder="Meal"
        />
      </div>
      <InputStars
        name="Difficulty"
        icon="😍,😃,😊,🙂,😐,🤨,😕,🙁,😠,🤬"
        @changed="(val) => (state.newMeal.difficulty = val)"
      />
      <InputStars
        name="Rating"
        @changed="(val) => (state.newMeal.rating = val)"
      />
      <div>
        <label>Tags</label>
        <input list="tags" />

        <datalist id="tags">
          <option
            v-for="(tag, i) in state.availableTags"
            :key="i"
            :value="tag"
          ></option>
        </datalist>
      </div>
      <div>
        <label for="">Notes</label
        ><textarea
          v-model="state.newMeal.notes"
          name=""
          id=""
          cols="20"
          rows="5"
        ></textarea>
      </div>
      <button type="submit">Add Meal</button>
    </form>

    <hr />
    <form>
      <label>Filter</label>
      <input type="text" v-model="state.filter" placeholder="Filter/ Search" />
      <label> Sort</label>
      <select name="Sort" id="" v-model="state.sort">
        <option selected disabled>Sort By</option>
        <option value="score-asc">Easy Tasty</option>
        <option value="scored-desc">Tricky Gross</option>
      </select>
    </form>
    <div v-for="(data, i) in filtered" :key="i">
      <pre>{{ data }}</pre>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from 'vue'
import global from '@/store/global'
import InputStars from '@/components/InputStars.vue'
// import { orderBy } from 'lodash'
import { Meal } from '@/types'

export default defineComponent({
  setup() {
    const { state, addMeal, loadExistingData } = global
    onMounted(loadExistingData)

    //filtered computed  property
    const filtered = computed(() => {
      if (!state.filter || state.filter.length < 2) {
        return sorted.value
      }
      //filter by name, no speaces, lowercase
      return sorted.value.filter((x: Meal) => {
        return x.name
          .split(' ')
          .join('')
          .toLowerCase()
          .includes(state.filter.split(' ').join('').toLowerCase())
      })
    })

    //sort highest rating, lowest difficulty
    const sorted = computed(() => {
      const cloned = [...state.storedData]
      // return orderBy(cloned, ['rating', 'difficulty'], ['desc', 'asc'])

      return cloned.sort((a, b) => {
        if (state.sort == 'score-asc') {
          return b.rating - b.difficulty - (a.rating - a.difficulty)
        } else {
          return b.difficulty - b.rating - (a.difficulty - a.rating)
        }
      })
    })

    return { state, addMeal, filtered, sorted }
  },
  components: {
    InputStars
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
</style>
