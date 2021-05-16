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
        <label for="foodName">Meal Name</label>
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
        name="Tastiness"
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
    <div class="meal-output" v-for="(data, i) in filtered" :key="i">
      <div class="meal-details">
        <h3 class="meal-details--title">{{ data.name }}</h3>
        <p>Tastiness: {{ data.rating }}</p>
        <p>Difficulty: {{ data.difficulty }}</p>
        <p>Notes: {{ data.notes }}</p>
        <template v-if="data.tags">
          <div class="tags-container">
            <div v-for="(tag, i) in data.tags" :key="i" class="tag active">
              {{ tag }}
            </div>
          </div>
        </template>
      </div>
      <div
        class="score-container"
        :style="`background-color:${scoreColour(
          data.rating - data.difficulty
        )}`"
      >
        <span class="score">{{ data.rating - data.difficulty }}</span>
        (Score)
      </div>
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
    const action = ref('')
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

    const scoreColour = (score: number) => {
      return score < -3 ? '#f8d7da' : score > 3 ? '#d4edda' : '#fff3cd'
    }

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

    return { state, addMeal, filtered, sorted, action, toggleTag, scoreColour }
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
  border: 1px solid transparent;
  transition: all ease 0.2s;
  &.active {
    background-color: var(--action-button-background);
    border: 1px solid rgb(31, 20, 51);
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

.meal-output {
  display: flex;
  margin: 2rem 0;
  background-color: var(--input-background);
  border-radius: calc(var(--border-radius) * 3);
  box-shadow: 0 0 1rem -0.7rem #000;
  .meal-details {
    flex: 7;
    padding: 1rem;
    &--title {
      margin: 0;
    }
    .tag {
      padding: 0.25rem 0.5rem;
    }
  }

  .score-container {
    display: flex;
    padding: 0.75rem;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    margin-left: auto;
    font-size: 0.75rem;
    flex: 1;
    border-radius: 0 calc(var(--border-radius) * 3)
      calc(var(--border-radius) * 3) 0;
    .score {
      font-size: 3rem;
      line-height: 3rem;
    }
  }
}
</style>
