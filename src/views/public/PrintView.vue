<template>
  <div style="padding: 5%">
    <div v-for="(item, index) in printObject" :key="index">
      <PrintCover
        style="page-break-after: always"
        v-if="item.type === 'cover'"
        :data="item.data"
        :summaryItems="summaryItems"
      />

      <PrintHeuristicLayout
        :id="item.type"
        style="page-break-after: always"
        v-if="item.type === 'heuristics'"
        :data="item.data"
      />

      <PrintOptionsLayout
        :id="item.type"
        v-if="item.type === 'options'"
        :data="item.data"
        style="page-break-after: always"
      />

      <PrintReportsLayout
        :id="item.type"
        v-if="item.type === 'reports'"
        :data="item.data"
        style="page-break-after: always"
      />

      <PrintAnswerLayout
        :id="item.type"
        v-if="item.type === 'answers'"
        :data="item.data"
      />
    </div>
  </div>
</template>

<script>
import PrintCover from "@/layouts/PrintCover.vue";
import PrintHeuristicLayout from "@/layouts/PrintHeuristicLayout.vue";
import PrintOptionsLayout from "@/layouts/PrintOptionsLayout.vue";
import PrintReportsLayout from "@/layouts/PrintReportsLayout.vue";
import PrintAnswerLayout from "@/layouts/PrintAnswerLayout.vue";

export default {
  components: {
    PrintCover,
    PrintHeuristicLayout,
    PrintOptionsLayout,
    PrintReportsLayout,
    PrintAnswerLayout,
  },
  computed: {
    printObject() {
      return window.objectPrint;
    },
    summaryItems() {
      let types = [];
      this.printObject.forEach((obj) => {
        types.push(obj.type);
      });
      types.splice(0, 1); //remove cover (always first item)

      return types;
    },
  },
  beforeMount() {
    // window.print();
  },
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