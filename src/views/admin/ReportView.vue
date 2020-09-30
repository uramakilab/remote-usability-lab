<template>
  <div>
    <Snackbar />

    <!-- Delete Alert Dialog -->
    <v-dialog v-model="dialog" width="600" persistent>
      <v-card>
        <v-card-title class="headline error white--text" primary-title
          >Are you sure you want to delete this report?</v-card-title
        >

        <v-card-text>{{ dialogText }}</v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="grey lighten-3" text @click="dialog = false"
            >Cancel</v-btn
          >
          <v-btn
            class="red white--text ml-1"
            :loading="loadingBtn"
            text
            @click="removeReport(report), (loadingBtn = true)"
            >Delete</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-overlay class="text-center" v-model="loading">
      <v-progress-circular
        indeterminate
        color="#fca326"
        size="50"
      ></v-progress-circular>
      <div class="white-text mt-3">Loading Reports</div>
    </v-overlay>

    <Intro
      v-if="reports.reports.length == 0 && !loading"
      @goToCoops="goToCoops()"
    />
    <ShowInfo title="Reports" v-else>
      <!-- Main Tabs -->
      <v-tabs
        slot="top"
        background-color="transparent"
        color="#FCA326"
        class="pb-0 mb-0"
        v-model="tab"
      >
        <v-tab @click="tab = 0">Evaluators Status</v-tab>
        <v-tab @click="tab = 1">Generate PDF Report </v-tab>
      </v-tabs>

      <div slot="content" class="ma-0 pa-0">
        <div v-if="tab == 0">
          <v-data-table
            style="background: #f5f7ff"
            :headers="headers"
            :items="reports.reports"
            :items-per-page="10"
            height="420px"
            dense
          >
            <template v-slot:item.more="{ item }">
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="(dialog = true), (report = item)">
                    <v-list-item-title>Remove Report</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>

            <template v-slot:item.progress="{ item }">
              <div>{{ item.log.progress }}%</div>
            </template>
          </v-data-table>
        </div>
        <div v-else-if="tab == 1">
          <v-card style="background: #f5f7ff;">
            <v-card-title class="subtitleView"
              >Select content to print:
            </v-card-title>

            <v-divider></v-divider>

            <v-row justify="space-around">
              <v-col cols="10">
                <v-treeview selectable :items="items"></v-treeview>
              </v-col>
            </v-row>
          </v-card>
        </div>
      </div>
    </ShowInfo>
  </div>
</template>

<script>
import ShowInfo from "@/components/organisms/ShowInfo";
import Intro from "@/components/molecules/IntroReports";
import Snackbar from "@/components/atoms/Snackbar";

export default {
  props: ["id"],
  components: {
    ShowInfo,
    Intro,
    Snackbar
  },
  data: () => ({
    headers: [
      { text: "Evaluator", value: "email" },
      { text: "Last Update", value: "log.date" },
      { text: "Progress", value: "progress", justify: "center" },
      { text: "Status", value: "log.status" },
      { text: "More", value: "more", justify: "end" }
    ],
    loading: true,
    dialog: false,
    loadingBtn: false,
    report: null,
    tab: 0
  }),
  methods: {
    removeReport(report) {
      this.$store
        .dispatch("removeReport", {
          docId: this.id,
          element: {
            id: report.uid
          },
          param: "reports"
        })
        .then(() => {
          this.$store.commit("setSuccess", "Report successfully deleted");
          this.loadingBtn = false;
          this.dialog = false;
        })
        .catch(err => {
          this.$store.commit("setError", err);
        });
    },
    goToCoops() {
      this.$emit("goToCoops");
    }
  },
  computed: {
    reports() {
      return this.$store.getters.reports || Object.assign({}, { reports: [] });
    },
    dialogText() {
      return (
        "Are you sure you want to delete " +
        (this.report !== null ? this.report.email : "") +
        `'s report? This action can't be undone`
      );
    },
    test() {
      return this.$store.getters.test;
    },
    items() {
      let items = [];

      if (this.test) {
        let test = this.test;
        if (test.type == "Heuristics") {
          let id = 0;
          let heuristics = test.heuristics;
          let options = test.options;
          if (heuristics) {
            items.push({
              id: id++,
              name: "Heuristics",
              children: heuristics.map(h => {
                return {
                  id: id++,
                  name: h.title,
                  children: h.questions.map(q => {
                    return {
                      id: id++,
                      name: q.title,
                      children: q.descriptions.map(d => {
                        return {
                          id: id++,
                          name: d.title,
                          icon: "description"
                        };
                      }),
                      icon: "question"
                    };
                  })
                };
              })
            });
          }
          if (options) {
            items.push({
              id: id++,
              name: "Options",
              children: options.map(op => {
                return {
                  id: id++,
                  name: `${op.text} - value: ${op.value}`
                };
              })
            });
          }
        } else if (test.type == "User") {
          let id = 0;
          let tasks = test.tasks;
          let preTest = test.preTest;
          let postTest = test.postTest;
          if (tasks) {
            items.push({
              id: id++,
              name: "Tasks",
              children: tasks.map(task => {
                return {
                  id: id++,
                  name: task.name,
                  children: Object.entries(task).map(item => {
                    return {
                      id: id++,
                      name: `${item[0]}: ${item[1]}`,
                      icon: "item"
                    };
                  }),
                  icon: "question"
                };
              })
            });
          }
          if (preTest) {
            items.push({
              id: id++,
              name: "Pre Test",
              children: Object.entries(preTest).map(item => {
                return {
                  id: id++,
                  name: `${item[0]}: ${item[1]}`,
                  icon: "item"
                };
              })
            });
          }
          if (postTest) {
            items.push({
              id: id++,
              name: "Post Test",
              children: Object.entries(postTest).map(item => {
                return {
                  id: id++,
                  name: `${item[0]}: ${item[1]}`,
                  icon: "item"
                };
              })
            });
          }
        }
      }

      return items;
    }
  },
  watch: {
    reports() {
      if (Object.keys(this.reports).length) this.loading = false;
    }
  },
  created() {
    if (!this.$store.getters.reports) {
      this.$store.dispatch("getReports", { id: this.id });
    } else if (this.$store.getters.reports.id !== this.id)
      this.$store.dispatch("getReports", { id: this.id });
    else {
      this.loading = false;
    }

    if (!this.$store.test && this.id !== null && this.id !== undefined) {
      this.$store.dispatch("getTest", {
        id: this.$store.getters.user.myTests.find(test => {
          return test.reports == this.id;
        }).id
      });
    }
    if (!this.$store.getters.users) this.$store.dispatch("getUsers", {});
  }
};
</script>

<style scoped>
.subtitleView {
  font-family: Roboto;
  font-style: normal;
  font-weight: 200;
  font-size: 18.1818px;
  line-height: 21px;
  align-items: flex-end;
  color: #000000;
  margin-bottom: 0px;
  padding-bottom: 0px;
}
</style>
