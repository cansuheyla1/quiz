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
        <button @click="handleClickTwo()">İleri</button>
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
import api from '@/services/api'

export default {
  name: 'HomeView',
  setup() {
    const questions = ref([])
    const started = ref(false)
    const finished = ref(false)
    const selectedOption = ref(null)
    const score = ref(0)
    const currentIndex = ref(0)
    const answers = ref([]);

    const handleClick = () => {
      started.value = true
      selectedOption.value = null
      currentIndex.value = 0
      score.value = 0
    }
    const handleClickTwo = async () => {
      if (selectedOption.value == null) return;

      answers.value.push({
        id: questions.value[currentIndex.value].id,
        selected: selectedOption.value
      })
      if (currentIndex.value >= questions.value.length - 1) {
        try {
          const res = await api.post("/quiz/submit", answers.value);

          score.value = res.data.score;
          finished.value = true;
        } catch (err) {
          console.log(err);
        }
      } 
      else {
        currentIndex.value++;
      }

      selectedOption.value = null;
    }

    onMounted(() => {
      console.log("API BASE:", api.defaults.baseURL);
      api.get("/questions?count=10")
      .then(res => {questions.value = res.data
        console.log("questions response:", res.data);
      })
      .catch(err => console.log(err))
    })

    return {questions, started, finished, selectedOption, score, currentIndex, handleClick, handleClickTwo}
  }
}
</script>
