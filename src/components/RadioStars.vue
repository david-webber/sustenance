<template>
  <div>
    <div>
      <div class="rating-label">
        <label :for="name">{{ name }}</label>
        <strong
          ><template v-if="selectedVal">{{ selectedVal }}</template> /
          {{ ratings }}</strong
        >
      </div>
      <div class="star_container">
        <div class="stars">
          <template v-for="i in ratings" :key="i">
            <input
              :id="`${name}${ratings + 1 - i}`"
              v-model="selectedVal"
              @change="(e) => $emit('changed', parseInt(e.target.value))"
              type="radio"
              required
              :name="name"
              :value="ratings + 1 - i"
            />
            <label
              :title="`${ratings + 1 - i} out of ${ratings}`"
              :for="`${name}${ratings + 1 - i}`"
              :style="`order: ${ratings + 1 - i}; color:${colour};`"
              :data-icon="icons[ratings - i] ? icons[ratings - i] : icons[0]"
              :data-colour="colour"
            >
              {{ 11 - i }} Stars</label
            >
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, toRefs, ref, watch } from 'vue'

export default defineComponent({
  props: {
    name: {
      type: String,
      default: ''
    },
    ratings: {
      type: Number,
      default: 10
    },
    icon: {
      type: String,
      default: '★'
    },
    colour: {
      type: String,
      default: 'orange'
    },
    current: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    const { current } = toRefs(props)
    let selectedVal = ref(current)
    const icons = computed(() => {
      return props.icon.split(',')
    })

    // expose to template
    return {
      icons,
      selectedVal
    }
  }
})
</script>

<style lang="scss" scoped>
.rating-label {
  display: flex;
  justify-content: space-between;
}
.star_container {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-pack: center;
  justify-content: center;
  -ms-flex-align: center;
  align-items: center;
}

.stars {
  display: -ms-flexbox;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  -ms-flex: 1;
  flex: 1;
  input {
    position: absolute;
    z-index: -1;
    opacity: 0;
    ~ label {
      opacity: 0.5;
      transition: all ease 0.3s;
    }
    &:checked ~ label {
      opacity: 1;
    }
    + label {
      font-size: 0;
      &:before {
        content: attr(data-icon);
        font-size: 5.3vw;
        margin-right: 1.3vw;
        @media screen and (min-width: 800px) {
          font-size: 3rem;
          margin-right: 0.5rem;
        }
      }
      &:hover {
        opacity: 1;
        & ~ label {
          opacity: 1;
        }
      }
    }
  }
}
</style>
