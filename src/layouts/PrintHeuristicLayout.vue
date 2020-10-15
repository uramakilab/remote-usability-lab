<template>
  <div>
    <h1>Heuristics</h1>
    <v-divider></v-divider>
    <v-row dense v-for="(heuristic, index) in data" :key="index">
      <v-col>
        <h2 dense class="pa-1">{{ index + 1 }}. {{ heuristic.title }}</h2>
        <v-row
          v-for="(question, i) in heuristic.questions"
          :key="i"
          justify="center"
          dense
        >
          <v-col cols="11">
            <h3 class="py-1">
              {{ index + 1 }}.{{ i + 1 }}. {{ question.title }}
            </h3>
            <div v-for="(description, j) in question.descriptions" :key="j">
              <h4 class="py-1">
                {{ index + 1 }}.{{ i + 1 }}.{{ j + 1 }}. {{ description.title }}
              </h4>
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
      type: Object,
      require: true
    }
  },
  components: {
    TextBox
  }
};
</script>

<style>
</style>