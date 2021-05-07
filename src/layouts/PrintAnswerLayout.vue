<template>
  <div>
    <div class="custom-title">Answers</div>
    <v-divider class="mb-5"></v-divider>

    {{ log() }}
    <v-row class="ma-0 pa-0">
      <v-col>
        <div>
          <h3>Statistics</h3>
          <v-row style="border-style: groove" justify="justify-ce">
            <v-col cols="6">
              Usability Percentage <br />
              Max<br />
              Min<br />
              Standard deviation
            </v-col>
            <v-col cols="6">
              {{ data.statistic.average }}%<br />
              {{ data.statistic.max }}<br />
              {{ data.statistic.min }}<br />
              {{ data.statistic.sd }}
            </v-col>
          </v-row>
        </div>
        <div>
          <h3>Evaluators Statistics</h3>
          <v-data-table
            :headers="data.evaluator.evaluatorTable.header"
            :items="data.evaluator.evaluatorTable.items"
            dense
            hide-default-footer
          >
          </v-data-table>
          <RadarChart
            :labels="data.evaluator.evaluatorGraphic.labels"
            :data="data.evaluator.evaluatorGraphic.data"
          />
        </div>
        <div>
          <h3>Heuristics Statistics</h3>
          <v-data-table
            :headers="data.heuristic.answersByEvaluator.header"
            :items="data.heuristic.answersByEvaluator.items"
            dense
            hide-default-footer
          >
          </v-data-table>
          <v-data-table
            :headers="data.heuristic.answersByHeuristic.header"
            :items="data.heuristic.answersByHeuristic.items"
            dense
            hide-default-footer
          >
          </v-data-table>
          <BarChart
            :labels="data.heuristic.heuristicGraphic.labels"
            :data="data.heuristic.heuristicGraphic.data"
            legend="Average"
          />
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import BarChart from "@/components/atoms/BarChart.vue";
import RadarChart from "@/components/atoms/RadarChart.vue";

export default {
  props: {
    data: {
      type: Object,
      require: true
    }
  },
  components: {
    BarChart,
    RadarChart
  },
  methods: {
    log() {
      console.log(this.data);
    }
  }
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