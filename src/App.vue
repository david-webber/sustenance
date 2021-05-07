<template>
  <main>
    <form @submit.prevent="addEntry">
      <div>
        <label for="foodName">foodName</label>
        <input
          id="foodName"
          type="text"
          required
          v-model="newMeal.name"
          placeholder="foodName"
        />
      </div>
      <div>
        <label for="Rating">Rating</label>
        <select id="Rating" required v-model="newMeal.rating">
          <option disabled selected>Rating</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>
      <div>
        <label for="Difficulty">Difficulty</label>
        <select id="Difficulty" required v-model="newMeal.difficulty">
          <option disabled selected>Difficulty</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>
      <div><label for="">Notes</label><textarea v-model="newMeal.notes" name="" id="" cols="20" rows="5"></textarea></div>
      <button type="submit">Add</button>
    </form>

    <hr />

    <template v-if="storedData">
  <div v-for="(data, i) in storedData" :key="i">
    <pre>{{ data }}</pre>
  </div>
    </template>
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";

interface Meal {
  name: string,
  rating: number,
  difficulty: number,
  notes: string,
}

export default defineComponent({
  name: "App",

  data() {
    return {
      newMeal: {
        name: "",
        rating: 1,
        difficulty: 1,
        notes: ""
      } as Meal,
      storedData: [] as Meal[],
    };
  },
  mounted() {
    const existingDataString = localStorage.getItem("entries") || "";
    this.storedData = JSON.parse(existingDataString);
  },
  methods: {
    addEntry() {
      this.storedData.push(this.newMeal);
      localStorage.setItem('entries',JSON.stringify(this.storedData));

    },
  },
});
</script>

<style lang="scss">
@import './main-auto.css';

form{
  button[type="submit"]{
    width:100%;
  }
}
</style>
