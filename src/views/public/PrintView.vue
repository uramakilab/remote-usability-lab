<template>
  <div>
    <v-row v-for="(heuristic, index) in printObject.data" :key="index">
      <v-col>
        <v-card-title class="subtitleView">{{ heuristic.title }}</v-card-title>
        <v-divider class="mb-5"></v-divider>
        <v-row
          v-for="(question, i) in heuristic.questions"
          :key="i"
          justify="center"
        >
          <v-col cols="11">
            <p class="subtitleView">{{ i + 1 }}) {{ question.title }}</p>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  computed: {
    printObject() {
      return window.objectPrint;
    }
  },
  beforeMount() {
    window.print();
  }
};
</script>

<style>
@media print {
  #toolbar {
    display: none !important;
  }
}
</style>