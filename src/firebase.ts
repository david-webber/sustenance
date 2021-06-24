import firebase from 'firebase'
import { ref, onUnmounted } from 'vue'
import { Meal } from '@/types'

const config = {
  apiKey: process.env.VUE_APP_apiKey,
  authDomain: process.env.VUE_APP_authDomain,
  databaseURL: process.env.VUE_APP_databaseURL,
  projectId: process.env.VUE_APP_projectId,
  storageBucket: process.env.VUE_APP_storageBucket,
  messagingSenderId: process.env.VUE_APP_messagingSenderId,
  appId: process.env.VUE_APP_appId,
  measurementId: process.env.VUE_APP_measurementId
}

const firebaseApp = firebase.initializeApp(config)

const db = firebaseApp.firestore()
// const usersCollection = db.collection('users')
const mealsCollection = db.collection('meals')


//create meal function
export const createMeal = (meal: Meal) => {
  return mealsCollection.add(meal)
}

//get meal function
export const getMeal = async (id: string) => {
  const meal = await mealsCollection.doc(id).get()
  return meal.exists? meal.data() : null
}


//update meal function
export const updateMeal = (id:string, meal:Meal) => {
  return mealsCollection.doc(id).update(meal)
}

//delete meal function
export const deleteMeal = (id:string) => {
  return mealsCollection.doc(id).delete();
}

//TODO unsure on typings for below, temporary any
export const useLoadMeals = () => {
  const meals: any = ref([])
  const close = mealsCollection.onSnapshot((snapshot) => {
    //add the document id from firebase into the data
    meals.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  })
  onUnmounted(close)
  return meals
}

//not allowing registration at the moment, but keep this here for now as it works as barebones fn
// export const registerUser = (email:string,password:string) => {
//   firebaseApp
//   .auth()
//   .createUserWithEmailAndPassword(email, password)
// }

export const logUserIn = async (email:string,password:string) => {

  return await firebaseApp
  .auth()
  .signInWithEmailAndPassword(email, password)
  .then(rsp => {
    console.log(rsp);
    return rsp;
  })
  .catch(err => {
    return err
  });

}


