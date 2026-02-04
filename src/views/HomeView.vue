<template>
  <div class="home">
    <div class="start-page" v-if="!started && !finished">
      <h1>Quiz Uygulaması</h1>
      <p>{{ questions.length }} soru</p>
      <button @click="handleClick">Şimdi Başlayın</button>
    </div>

    <div class="question-page" v-else-if="started && !finished">
      <div v-if="questions.length">
        <h2>Soru {{ currentIndex+1}}</h2>
        <p>{{ questions[currentIndex].question }}</p>
        <div class="options" v-for="(option, index) in questions[currentIndex].options" :key="option">
          <input type="radio" name="selected" :value="index" v-model="selectedOption">  <!--radio çünkü tek cevap seçiliyor-->
          <label>{{ String.fromCharCode(65 + index) }}- {{ option }}</label>
        </div>
        <button @click="handleClickTwo(questions[currentIndex].answerIndex)">İleri</button>
      </div>
    </div>

    <div class="finish-page" v-if="finished && started">
      <h2>Tebrikler, quizi tamamladınız!</h2>
      <p>Puan: {{ score }}/{{ questions.length }}</p>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { ref, onMounted } from 'vue'
import axios from 'axios'

export default {
  name: 'HomeView',
  setup() {
    const questions = ref([])
    const started = ref(false)
    const finished = ref(false)
    const selectedOption = ref(null)
    const score = ref(0)
    const currentIndex = ref(0)


    const handleClick = () => {
      started.value = true
      selectedOption.value = null
      currentIndex.value = 0
      score.value = 0
    }
    const handleClickTwo = (answer) => {
      if (selectedOption.value == answer) score.value++
      if (currentIndex.value >= questions.value.length-1) finished.value = true
      else currentIndex.value++
      selectedOption.value = null
    }

    onMounted(() => {
      axios.get("http://localhost:3000/questions")
      .then(res => questions.value = res.data)
      .catch(err => console.log(err))
    })

    return {questions, started, finished, selectedOption, score, currentIndex, handleClick, handleClickTwo}
  }
}
</script>
