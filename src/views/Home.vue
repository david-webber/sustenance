<template>
  <main>
    <h1>Sustenance</h1>
    <br />
    <div class="ctas">
      <button @click="action != 'addNew' ? (action = 'addNew') : (action = '')">
        <template v-if="action == 'addNew'"> Cancel </template>
        <template v-else> Add a Meal </template>
      </button>
    </div>
    <MealForm v-if="action == 'addNew'" action="add" />

    <br />
    <h3>Your Meals</h3>
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
    <div
      class="meal-output"
      v-for="data in filtered"
      :key="data.id"
      :ref="data.id"
    >
      <div class="meal-details">
        <h3 class="meal-details--title">
          {{ data.name
          }}<span class="edit-link" title="Edit meal"
            ><router-link :to="`/edit/${data.id}`">🖍</router-link></span
          >
        </h3>
        <p>Tastiness: {{ data.rating }}</p>
        <p>Difficulty: {{ data.difficulty }}</p>
        <p v-if="data.notes">Notes: {{ data.notes }}</p>
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
import MealForm from '@/components/MealForm.vue'
// import * as Hammer from 'hammerjs'

// import { orderBy } from 'lodash'
import { Meal } from '@/types'

export default defineComponent({
  setup() {
    const { state, addMeal, loadExistingData } = global
    onMounted(() => {
      loadExistingData()

      // const mealCard = ref([])
      // console.log(mealCard)
      // console.log(Hammer)
    })
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

    return {
      state,
      addMeal,
      filtered,
      sorted,
      action,

      scoreColour
    }
  },
  components: {
    MealForm
  }
})
</script>

<style lang="scss">
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
  position: relative;
  .edit-link {
    a {
      color: inherit;
      text-decoration: none;
      opacity: 0.75;
      &:hover {
        // filter: invert(1);
        opacity: 1;
      }
    }
    margin-left: 0.5rem;
  }
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
    color: #333;
    border-radius: 0 calc(var(--border-radius) * 3)
      calc(var(--border-radius) * 3) 0;
    .score {
      font-size: 3rem;
      line-height: 3rem;
    }
  }
}
</style>
