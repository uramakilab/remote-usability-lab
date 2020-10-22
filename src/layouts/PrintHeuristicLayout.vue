<template>
  <div>
    <h2>Heuristics</h2>
    <v-divider></v-divider>
    <v-row dense v-for="(heuristic, index) in data" :key="index">
      <v-col>
        <h3 dense class="pa-1">{{ index + 1 }}. {{ heuristic.title }}</h3>
        <v-row
          v-for="(question, i) in heuristic.questions"
          :key="i"
          justify="center"
          dense
        >
          <v-col cols="11">
            <h4 class="py-1">
              {{ index + 1 }}.{{ i + 1 }}. {{ question.title }}
            </h4>
            <div v-for="(description, j) in question.descriptions" :key="j">
              <h5 class="py-1">
                {{ index + 1 }}.{{ i + 1 }}.{{ j + 1 }}. {{ description.title }}
              </h5>
              <TextBox
                class="mx-4"
                :text="description.text"
                :editable="false"
              ></TextBox>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import TextBox from "@/components/atoms/TextBox";

export default {
  props: {
    data: {
      type: Array,
      require: true,
      defult: []
    }
  },
  components: {
    TextBox
  }
};
</script>

<style>
</style>