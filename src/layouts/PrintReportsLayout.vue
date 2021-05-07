<template>
  <div>
    <div class="custom-title">Reports</div>
    <v-divider></v-divider>
    
    <v-row class="ma-0 pa-0">
      <v-data-table 
        :headers="headers"
        :items="data" 
        dense 
        hide-default-footer
      >
        <template v-slot:item.progress="{ item }">
          <div>{{ item.log.progress }}%</div>
        </template>
      </v-data-table>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      require: true,
      defult: []
    }
  },
  data: () => ({
    headers: [
      { text: "Evaluator", value: "email" },
      { text: "Last Update", value: "log.date" },
      { text: "Progress", value: "progress", justify: "center" },
      { text: "Status", value: "log.status" }
    ]
  })
};
</script>

<style>
.custom-title {
  font-size: 250%;
  font-weight: 350;
  text-align: justify;
  color: black;
}
</style>