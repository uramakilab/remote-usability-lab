<template>
  <div>
    <PrintHeuristicLayout
      v-if="printObject.type === 'heuristic'"
      :data="printObject.data"
    />
  </div>
</template>

<script>
import PrintHeuristicLayout from "@/layouts/PrintHeuristicLayout.vue";

export default {
  components: {
    PrintHeuristicLayout
  },
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
  @page {
    size: auto;
    margin-top: 1px;
  }
}
</style>