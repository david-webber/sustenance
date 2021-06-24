<template>
  <h3>Please login to continue</h3>
  <form action="" @submit.prevent="submitForm">
    <label>Email</label>
    <input
      required
      name="email"
      v-model="email"
      placeholder="email"
      type="email"
    />
    <label>Password</label>
    <input
      required
      name="password"
      v-model="password"
      placeholder="password"
      type="password"
    />

    <button type="submit">Login</button>
  </form>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'
import { logUserIn } from '@/firebase'
import { useRouter } from 'vue-router'
import global from '@/store/global'

export default defineComponent({
  setup() {
    const email = ref('sustenance@david-webber.co.uk')
    const password = ref()
    const { state } = global
    const router = useRouter()

    const submitForm = async function () {
      const loggedIn = await logUserIn(email.value, password.value)
      if (loggedIn.user) {
        console.log('logged in', loggedIn)
        console.log(loggedIn.user)
        state.user.loggedIn = true
        state.user.data = loggedIn.user
        router.push('/')
      } else {
        alert('incorrect credentials')
      }
    }

    return { email, password, submitForm }
  }
})
</script>
<style lang="scss" scoped>
h3 {
  margin: 2rem 0;
}
form {
  background-color: rgba(255, 255, 255, 0.02);
  padding: 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border-colour);
  input {
    margin-bottom: 1rem;
  }
  button {
    margin-top: 1rem;
  }
}
</style>
