<template>
  <div>
    <div class="custom-title">Heuristics</div>
    <v-divider class="mb-10"></v-divider>

    <!-- Summary -->
    
      <div style="columns: 2; width: 100%; page-break-after: always; padding-left: 3%">
        <v-row dense v-for="(heuristic, index) in data" :key="index">
          <v-col>
            <a class="summary-item" :href="`#H${index}`"
              >{{ index + 1 }}. {{ heuristic.title }}</a
            >
            <v-row
              v-for="(question, i) in heuristic.questions"
              :key="i"
              justify="center"
              dense
            >
              <v-col cols="11">
                <a :href="`#H${index}-Q${i}`" class="py-1 summary-item">
                  {{ index + 1 }}.{{ i + 1 }}. {{ question.title }}
                </a>
                <v-row justify="center" dense>
                  <v-col cols="11">
                    <div
                      v-for="(description, j) in question.descriptions"
                      :key="j"
                    >
                      <a
                        :href="`#H${index}-Q${i}-D${j}`"
                        class="py-1 summary-item"
                      >
                        {{ index + 1 }}.{{ i + 1 }}.{{ j + 1 }}.
                        {{ description.title }}
                      </a>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </div>

    <!-- Heuris Content -->
    <v-row dense v-for="(heuristic, index) in data" :key="index">
      <v-col>
        <div :id="`H${index}`" class="heuris-title">
          {{ index + 1 }}. {{ heuristic.title }}
        </div>
        <v-row
          v-for="(question, i) in heuristic.questions"
          :key="i"
          justify="center"
          dense
        >
          <v-col cols="11">
            <div class="py-1 question-title" :id="`H${index}-Q${i}`">
              {{ index + 1 }}.{{ i + 1 }}. {{ question.title }}
            </div>
            <v-row justify="center" dense>
              <v-col cols="11">
                <div v-for="(description, j) in question.descriptions" :key="j">
                  <div class="py-1 desc-title" :id="`H${index}-Q${i}-D${j}`">
                    {{ index + 1 }}.{{ i + 1 }}.{{ j + 1 }}.
                    {{ description.title }}
                  </div>
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
      defult: [],
    },
  },
  components: {
    TextBox,
  },
};
</script>

<style>
.custom-title {
  font-size: 250%;
  font-weight: 350;
  text-align: justify;
  color: rgb(206, 206, 206);
}
.heuris-title {
  font-size: 130%;
  font-weight: 350;
  text-align: justify;
  color: black;
}
.question-title {
  font-size: 120%;
  font-weight: 350;
  text-align: justify;
  color: black;
}
.desc-title {
  font-size: 110%;
  font-weight: 350;
  text-align: justify;
  color: black;
}
.summary-item {
  text-transform: capitalize;
  color: black !important;
  font-size: 120%;
  text-decoration: none;
}
</style>