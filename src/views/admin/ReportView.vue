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

        <!-- Generate PDF Tab -->
        <div v-else-if="tab == 1" class="ma-0 pa-0">
          <v-card style="background: #f5f7ff" elevation="0">
            <v-card-title class="subtitleView"
              >Select content to print:
            </v-card-title>

            <v-divider class="mb-0"></v-divider>

            <!-- List -->
            <v-card>
              <v-row class="ma-0 pa-0">
                <v-col class="ma-0 pa-0" cols="3">
                  <v-subheader class="pa-2">Contents</v-subheader>
                  <v-divider></v-divider>
                  <v-list dense height="470px" class="list-scroll ma-0 pa-0">
                    <v-list-item-group v-model="itemSelected" color="#fca326">
                      <v-list-item v-for="(item, i) in listItems" :key="i">
                        <v-list-item-content>
                          <v-list-item-title>{{
                            item.title
                          }}</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-icon v-if="i == itemSelected">
                          <v-icon>mdi-chevron-right</v-icon>
                        </v-list-item-icon>
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>
                </v-col>

                <v-divider vertical></v-divider>

                <!--List content-->
                <v-col class="ma-0 pa-0" v-if="itemSelected != null">
                  <v-subheader class="pa-2">{{
                    listItems[itemSelected].title
                  }}</v-subheader>
                  <v-divider></v-divider>
                  <v-treeview
                    v-if="itemSelected == 0"
                    selectable
                    :items="items"
                  ></v-treeview>
                </v-col>
              </v-row>
            </v-card>
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
    Snackbar,
  },
  data: () => ({
    headers: [
      { text: "Evaluator", value: "email" },
      { text: "Last Update", value: "log.date" },
      { text: "Progress", value: "progress", justify: "center" },
      { text: "Status", value: "log.status" },
      { text: "More", value: "more", justify: "end" },
    ],
    loading: true,
    dialog: false,
    loadingBtn: false,
    report: null,
    tab: 0,
    itemSelected: null,
    listItems: [
      {
        title: "Test",
        icon: "mdi-file-document-edit",
        id: 0,
      },
      {
        title: "Answers",
        icon: "mdi-order-bool-ascending-variant",
        id: 1,
      },
      {
        title: "Analytics",
        icon: "mdi-chart-bar",
        id: 2,
      },
      {
        title: "Cooperators",
        icon: "mdi-account-group",
        id: 3,
      },
    ],
  }),
  methods: {
    removeReport(report) {
      this.$store
        .dispatch("removeReport", {
          docId: this.id,
          element: {
            id: report.uid,
          },
          param: "reports",
        })
        .then(() => {
          this.$store.commit("setSuccess", "Report successfully deleted");
          this.loadingBtn = false;
          this.dialog = false;
        })
        .catch((err) => {
          this.$store.commit("setError", err);
        });
    },
    goToCoops() {
      this.$emit("goToCoops");
    },
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
              children: heuristics.map((h) => {
                return {
                  id: id++,
                  name: h.title,
                  children: h.questions.map((q) => {
                    return {
                      id: id++,
                      name: q.title,
                      children: q.descriptions.map((d) => {
                        return {
                          id: id++,
                          name: d.title,
                          icon: "description",
                        };
                      }),
                      icon: "question",
                    };
                  }),
                };
              }),
            });
          }
          if (options) {
            items.push({
              id: id++,
              name: "Options",
              children: options.map((op) => {
                return {
                  id: id++,
                  name: `${op.text} - value: ${op.value}`,
                };
              }),
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
              children: tasks.map((task) => {
                return {
                  id: id++,
                  name: task.name,
                  children: Object.entries(task).map((item) => {
                    return {
                      id: id++,
                      name: `${item[0]}: ${item[1]}`,
                      icon: "item",
                    };
                  }),
                  icon: "question",
                };
              }),
            });
          }
          if (preTest) {
            items.push({
              id: id++,
              name: "Pre Test",
              children: Object.entries(preTest).map((item) => {
                return {
                  id: id++,
                  name: `${item[0]}: ${item[1]}`,
                  icon: "item",
                };
              }),
            });
          }
          if (postTest) {
            items.push({
              id: id++,
              name: "Post Test",
              children: Object.entries(postTest).map((item) => {
                return {
                  id: id++,
                  name: `${item[0]}: ${item[1]}`,
                  icon: "item",
                };
              }),
            });
          }
        }
      }

      return items;
    },
  },
  watch: {
    reports() {
      if (Object.keys(this.reports).length) this.loading = false;
    },
    itemSelected() {
      console.log("Item", this.itemSelected);
    },
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
        id: this.$store.getters.user.myTests.find((test) => {
          return test.reports == this.id;
        }).id,
      });
    }
    if (!this.$store.getters.users) this.$store.dispatch("getUsers", {});
  },
};
</script>

<style scoped>
.subtitleView {
  font-family: Roboto;
  font-style: normal;
  font-weight: 200;
  font-size: 18.1818px;
  align-items: flex-end;
  color: #000000;
  margin-bottom: 4px;
  padding-bottom: 2px;
}
.list-scroll {
  overflow: auto;
}
.list-scroll::-webkit-scrollbar {
  width: 5px;
}
/* Track */
.list-scroll::-webkit-scrollbar-track {
  background: none;
}
/* Handle */
.list-scroll::-webkit-scrollbar-thumb {
  background: #ffcd86;
  border-radius: 4px;
}
/* Handle on hover */
.list-scroll::-webkit-scrollbar-thumb:hover {
  background: #fca326;
  /* background: #515069; */
}
</style>
