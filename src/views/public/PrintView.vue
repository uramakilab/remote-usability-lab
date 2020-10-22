<template>
  <div>
    <div v-for="(item, index) in printObject" :key="index">
      <PrintHeuristicLayout
        v-if="item.type === 'heuristic'"
        :data="item.data"
      />
      <PrintOptionsLayout v-if="item.type === 'options'" :data="item.data" />
      <PrintReportsLayout v-if="item.type === 'reports'" :data="item.data" />
      <PrintAnswerLayout v-if="item.type === 'answers'" :data="item.data" />
    </div>
  </div>
</template>

<script>
import PrintHeuristicLayout from "@/layouts/PrintHeuristicLayout.vue";
import PrintOptionsLayout from "@/layouts/PrintOptionsLayout.vue";
import PrintReportsLayout from "@/layouts/PrintReportsLayout.vue";
import PrintAnswerLayout from "@/layouts/PrintAnswerLayout.vue";

export default {
  components: {
    PrintHeuristicLayout,
    PrintOptionsLayout,
    PrintReportsLayout,
    PrintAnswerLayout
  },
  computed: {
    printObject() {
      return window.objectPrint;
    }
  },
  beforeMount() {
    //window.print();
  }
};
</script>

<style>
@media print {
  #toolbar {
    display: none !important;
  }
  @page {
    margin: 10px;
    padding: 10px;
    display: flex;
  }
}
</style>