<template>
  <div class="ma-0 pa-0">
    <!--Dialog Edit-->
    <v-dialog v-model="dialogEdit" width="800" persistent>
      <v-card v-if="itemEdit">
        <v-card-title
          class="headline white--text"
          style="background-color: #fca326"
          primary-title
          >{{ itemEdit.title }}</v-card-title
        >
        <v-row class="ma-0 mt-3">
          <v-col cols="10">
            <v-form ref="formEdit" @submit.prevent="validateEdit()">
              <v-text-field
                v-model="itemEdit.titleEdit"
                dense
                :label="
                  itemEdit.title === 'Edit Heuristic'
                    ? 'Title Heuristic'
                    : 'Title Question'
                "
                outlined
                class="mx-3"
                :rules="itemEdit.rule"
                autofocus
              ></v-text-field>
            </v-form>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="lighten-2"
            text
            @click="(dialogEdit = false), (itemEdit = null)"
            >Cancel</v-btn
          >
          <v-btn class="white--text" color="#fca326" @click="validateEdit()"
            >Ok</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--Dialog Create New Question-->
    <v-dialog v-model="dialogQuestion" width="800" persistent>
      <v-card v-if="newQuestion">
        <v-card-title
          class="headline white--text"
          style="background-color: #fca326"
          primary-title
          >New Question</v-card-title
        >
        <v-row class="ma-0 mt-3">
          <v-col cols="10">
            <v-form ref="formQuestion" @submit.prevent="addQuestion()">
              <v-text-field
                v-model="newQuestion.title"
                dense
                label="Title new question"
                outlined
                class="mx-2"
                :rules="questionRequired"
                autofocus
              ></v-text-field>
            </v-form>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="lighten-2" text @click="closeDialog('dialogQuestion')"
            >Cancel</v-btn
          >
          <v-btn class="white--text" color="#fca326" @click="addQuestion()"
            >Add</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--Card Create New Heuristic-->
    <v-dialog v-model="dialogHeuris" width="800" persistent
      ><v-card style="overflow: hidden">
        <v-card-title
          class="headline white--text"
          style="background-color: #fca326"
          primary-title
          >Creating a heuristic</v-card-title
        >
        <v-row justify="center">
          <v-col cols="10">
            <v-form ref="formHeuris" @keyup.native.enter="addHeuris()">
              <v-text-field
                v-model="heuris.title"
                dense
                label="Title your heuristic"
                outlined
                class="mx-2"
                :rules="nameRequired"
                autofocus
              ></v-text-field>

              <v-text-field
                v-model="heuris.questions[0].title"
                dense
                label="Title first question"
                outlined
                class="mx-2"
                :rules="questionRequired"
              ></v-text-field>
            </v-form>
          </v-col>
        </v-row>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="lighten-2" text @click="closeDialog('dialogHeuris')">Cancel</v-btn>
          <v-btn class="white--text" color="#fca326" @click="addHeuris()"
            >Add</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog" width="800" persistent> </v-dialog>

    <!-- Main -->
    <v-card style="background: #f5f7ff" elevation="0">
      <v-card-title class="subtitleView">Current Heuristics</v-card-title>
      <v-divider></v-divider>
      <v-row class="ma-0 pa-0" v-if="heuristics.length">
        <!--Heuristics List-->
        <v-col class="ma-0 pa-0" cols="3">
          <v-list dense height="560px" outlined>
            <v-subheader>Heuristics</v-subheader>
            <v-divider></v-divider>
            <v-list-item @click="dialogHeuris = true">
              <v-list-item-icon>
                <v-icon color="#fca326">mdi-plus</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title style="color: #fca326"
                  >Add new heuristic</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list dense height="470px" outlined class="list-scroll">
              <v-list-item-group v-model="itemSelect" color="#fca326">
                <v-list-item v-for="(item, i) in heuristics" :key="i">
                  <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-icon v-if="i == itemSelect">
                    <v-icon>mdi-chevron-right</v-icon>
                  </v-list-item-icon>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-list>
        </v-col>

        <v-divider vertical></v-divider>

        <!--Questions List-->
        <v-col class="ma-0 pa-0" cols="3" v-if="itemSelect != null">
          <v-list dense height="560px" outlined>
            <v-subheader>
              <v-clamp autoresize :max-lines="2"
                >{{ heuristics[itemSelect].title }} - Questions</v-clamp
              >
              <v-spacer></v-spacer>
              <v-menu v-model="menuHeuristics" offset-x>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list dense>
                  <!--Edit Heuris Flag -->
                  <v-list-item @click="editHeuris(heuristics[itemSelect])">
                    <v-list-item-icon>
                      <v-icon>mdi-pencil</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Edit heuristic</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="deleteHeuristic(itemSelect)">
                    <v-list-item-icon>
                      <v-icon>mdi-delete</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Delete heuristic</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-subheader>
            <v-divider></v-divider>
            <v-list-item @click="setupQuestion()">
              <v-list-item-icon>
                <v-icon color="#fca326">mdi-plus</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title style="color: #fca326"
                  >Add new question</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list dense height="470px" outlined class="list-scroll">
              <v-list-item-group v-model="questionSelect" color="#fca326">
                <v-list-item
                  v-for="(item, i) in heuristics[itemSelect].questions"
                  :key="i"
                >
                  <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-icon v-if="i == questionSelect">
                    <v-icon>mdi-chevron-right</v-icon>
                  </v-list-item-icon>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-list>
        </v-col>
        <v-divider vertical></v-divider>
        <!--Questions content-->
        <v-col class="ma-0 pa-0" v-if="questionSelect != null">
          <v-card height="560px" elevation="0">
            <v-subheader class="pa-2">
              {{ heuristics[itemSelect].questions[questionSelect].title }}
              <v-spacer></v-spacer>
              <v-menu v-model="menuQuestions" offset-x>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list dense>
                  <v-list-item
                    @click="
                      editQuestions(
                        heuristics[itemSelect].questions[questionSelect]
                      )
                    "
                  >
                    <v-list-item-icon>
                      <v-icon>mdi-pencil</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Edit question</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="deleteQuestion(questionSelect)">
                    <v-list-item-icon>
                      <v-icon>mdi-delete</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Delete question</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-subheader>
            <v-divider></v-divider>
            <v-row>
              <v-col>
                <v-data-table
                  height="350px"
                  :headers="headers"
                  :items="
                    heuristics[itemSelect].questions[questionSelect]
                      .descriptions
                  "
                  :items-per-page="5"
                >
                  <template v-slot:top>
                    <v-row class>
                      <v-col class="ml-2 mb-1 pa-4 pb-0">
                        <p class="subtitleView">Descriptions</p>
                      </v-col>
                      <v-col class="mr-2 mb-1 pb-0 pa-4">
                        <v-row justify="end" class="ma-0 pa-0">
                          <AddDescBtn
                            ref="descBtn"
                            @change="emitChange"
                            :question="
                              heuristics[itemSelect].questions[questionSelect]
                            "
                          />
                        </v-row>
                      </v-col>
                    </v-row>
                    <v-divider class="mb-4"></v-divider>
                  </template>

                  <template v-slot:item.actions="{ item }">
                    <!-- table actions -->
                    <v-row justify="end" class="pr-1">
                      <v-btn
                        icon
                        small
                        class="mr-2"
                        @click="editDescription(item)"
                      >
                        <v-icon small>mdi-pencil</v-icon>
                      </v-btn>
                      <v-btn icon small @click="deleteItem(item)">
                        <v-icon small>mdi-delete</v-icon>
                      </v-btn>
                    </v-row>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

      <v-row justify="center" v-else>
        <v-col class="ma-10" cols="10">
          <v-row justify="center" align="center">
            <p class="subtitleView">You don't have heuristic yet, start one.</p>
          </v-row>
          <v-row class="ma-4" justify="center" align="center">
            <v-btn @click="dialogHeuris = true" icon x-large color="grey">
              <v-icon size="100">mdi-plus-circle-outline</v-icon>
            </v-btn>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>


<script>
import AddDescBtn from "@/components/atoms/AddDescBtn";
import VClamp from "vue-clamp";

export default {
  props: {
    heuristics: {
      type: Array,
      required: true,
      default: function () {
        return [];
      },
    },
  },
  components: {
    AddDescBtn,
    VClamp,
  },
  data: () => ({
    menuHeuristics: false,
    menuQuestions: false,
    itemSelect: null,
    questionSelect: null,
    itemEdit: null,
    newQuestion: null,
    heuris: null,
    headers: [
      {
        text: "Title",
        align: "start",
        value: "title",
      },
      { text: "Actions", value: "actions", align: "end", sortable: false },
    ],
    dialog: false,
    dialogEdit: false,
    dialogHeuris: false,
    dialogQuestion: false,
    editIndex: -1,
    nameRequired: [(v) => !!v || "Name is required"],
    questionRequired: [(v) => !!v || "Question has to be filled"],
  }),
  methods: {
    deleteHeuristic(item) {
      let config = confirm(
        `Are you sure delete the heuristic ${this.heuristics[item].title}?`
      );

      if (config) {
        this.heuristics.splice(item, 1);
        this.itemSelect = null;
        this.questionSelect = null;
      }
      this.menuQuestions = false;
      this.menuHeuristics = false;
    },
    deleteQuestion(item) {
      if (this.heuristics[this.itemSelect].questions.length > 1) {
        let config = confirm(
          `Are you sure delete the Question ${
            this.heuristics[this.itemSelect].questions[item].title
          }?`
        );

        if (config) {
          this.heuristics[this.itemSelect].questions.splice(item, 1);
          this.questionSelect = null;
          
          this.heuristics[this.itemSelect].total = this.heuristics[
            this.itemSelect
          ].questions.length;
        }
        this.emitChange();
      } else {
        alert("Sorry, but you can't delete all heuristics questions");
      }

      this.menuQuestions = false;
      this.menuHeuristics = false;
    },
    editHeuris(item) {
      this.itemEdit = {
        title: "Edit Heuristic",
        titleEdit: item.title,
        rule: this.nameRequired,
        id: item.id,
      };
      this.dialogEdit = true;
    },
    editQuestions(item) {
      this.itemEdit = {
        title: "Edit Question",
        titleEdit: item.title,
        rule: this.questionRequired,
      };
      this.dialogEdit = true;
    },
    editDescription(desc) {
      let ind = this.heuristics[this.itemSelect].questions[
        this.questionSelect
      ].descriptions.indexOf(desc);
      this.$refs.descBtn.editSetup(ind);
    },
    emitChange() {
      this.$emit("change");
      this.$forceUpdate();
    },
    setupQuestion() {
      this.newQuestion = {
        id:
          this.heuristics[this.itemSelect].questions[
            this.heuristics[this.itemSelect].questions.length - 1
          ].id + 1,
        title: "",
        descriptions: [],
      };
      this.dialogQuestion = true;
    },
    deleteItem(item) {
      this.heuristics[this.itemSelect].questions[
        this.questionSelect
      ].descriptions.splice(
        this.heuristics[this.itemSelect].questions[
          this.questionSelect
        ].descriptions.indexOf(item),
        1
      );
      this.emitChange();
    },
    addHeuris() {
      if (this.$refs.formHeuris.validate()) {
        this.dialogHeuris = false;

        this.heuristics.push(Object.assign({}, this.heuris));
        this.itemSelect = this.heuristics.length - 1;

        this.heuristics.total = this.totalQuestions;

        this.$refs.formHeuris.resetValidation();
        //this.$refs.formHeuris.reset();
        this.$emit("change");
      }
    },
    closeDialog(dialogName) {
      this[dialogName] = false;

      if (this.$refs.formHeuris) {
        this.$refs.formHeuris.resetValidation();
        this.$refs.formHeuris.reset();
      }
      if (this.$refs.formQuestion) {
        this.$refs.formQuestion.resetValidation();
        this.$refs.formQuestion.reset();
        this.newQuestion = null;
      }
    },
    addQuestion() {
      if (this.$refs.formQuestion.validate()) {
        this.dialogQuestion = false;

        this.heuristics[this.itemSelect].questions.push(this.newQuestion);
        this.newQuestion = null;

        this.heuristics[this.itemSelect].total = this.heuristics[
          this.itemSelect
        ].questions.length;

        this.$refs.formQuestion.resetValidation();
        this.$emit("change");
      }
    },
    validateEdit() {
      if (this.$refs.formEdit.validate()) {
        this.dialogEdit = false;

        if (this.itemEdit.title === "Edit Heuristic") {
          this.heuristics[this.itemSelect].title = this.itemEdit.titleEdit;
        } else {
          this.heuristics[this.itemSelect].questions[
            this.questionSelect
          ].title = this.itemEdit.titleEdit;
        }
        this.emitChange();
      }
    },
  },
  watch: {
    dialogHeuris() {
      if (!this.dialogHeuris && this.heuristics.length > 0 && !this.itemEdit) {
        this.heuris = {
          id: this.heuristics[this.heuristics.length - 1].id + 1,
          title: "",
          total: 0,
          questions: [
            {
              id: 0,
              title: "",
              descriptions: [],
            },
          ],
        };
        this.heuris.total = this.heuris.questions.length;
      }
      if (this.dialogHeuris) {
        //when dialog opens everything is reset
        if (this.$refs.formHeuris) {
          this.$refs.formHeuris.resetValidation();
          this.$refs.formHeuris.reset();
        }
      }
    },
    heuristics() {
      this.$emit("change");
    },
    itemSelect() {
      if (this.itemSelect != null) this.questionSelect = 0;
      else this.questionSelect = null;
    },
  },
  computed: {
    arrayQuestions() {
      let aux = [];
      let array = Array.from(this.heuristics[this.itemSelect].questions);
      array.forEach((el) => {
        aux.push(Object.assign({}, { id: el.id, res: "", com: "" }));
      });
      return aux;
    },
    totalQuestions() {
      let result = 0;
      this.heuristics.forEach((h) => {
        result += h.total;
      });
      return result;
    },
  },
  created() {
    if (this.heuristics.length) {
      this.heuris = {
        id: this.heuristics[this.heuristics.length - 1].id + 1,
        total: 0,
        title: "",
        questions: [
          {
            id: 0,
            title: "",
            descriptions: [],
          },
        ],
      };
    } else {
      this.heuris = {
        id: 0,
        total: 0,
        title: "",
        questions: [
          {
            id: 0,
            title: "",
            descriptions: [],
          },
        ],
      };
    }
    this.heuris.total = this.heuris.questions.length;
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