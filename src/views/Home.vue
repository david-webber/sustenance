<template>
  <main>
    <h1>Sustenance</h1>
    <hr />

    <h3>Actions</h3>
    <div class="ctas">
      <button :disabled="action == 'addNew'" @click="action = 'addNew'">
        Add a Meal
      </button>
      <button>Find a Meal</button>
    </div>
    <form v-if="action == 'addNew'" @submit.prevent="addMeal">
      <hr />
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
      <RadioStars
        name="Difficulty"
        icon="😍,😃,😊,🙂,😐,🤨,😕,🙁,😠,🤬"
        @changed="(val) => (state.newMeal.difficulty = val)"
      />
      <RadioStars
        name="Rating"
        @changed="(val) => (state.newMeal.rating = val)"
      />
      <div>
        <label>Tags</label>
        <div class="tags-container">
          <button
            class="tag"
            @click.prevent="toggleTag(tag)"
            :class="{ active: state.newMeal.tags.includes(tag) }"
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
          v-model="state.newMeal.notes"
          name=""
          id=""
          cols="20"
          rows="5"
        ></textarea>
      </div>
      <button type="submit">Add Meal</button>
      <button @click.prevent="action = false">Cancel</button>
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
import { defineComponent, onMounted, computed, ref } from 'vue'
import global from '@/store/global'
import RadioStars from '@/components/RadioStars.vue'
// import { orderBy } from 'lodash'
import { Meal } from '@/types'

export default defineComponent({
  setup() {
    const { state, addMeal, loadExistingData } = global
    onMounted(loadExistingData)
    const action = ref(false)
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

    const toggleTag = (tag: string) => {
      state.newMeal.tags = state.newMeal.tags.includes(tag)
        ? state.newMeal.tags.filter((x) => x !== tag)
        : [...state.newMeal.tags, tag]
    }

    return { state, addMeal, filtered, sorted, action, toggleTag }
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
  border: 2px solid transparent;
  transition: all ease 0.2s;
  &.active {
    background-color: var(--action-button-background);
    border: 2px solid rgb(69, 39, 126);
  }
}
.ctas {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  button {
    flex: 1;
    width: 100%;
    min-width: 200px;
  }
}
</style>
