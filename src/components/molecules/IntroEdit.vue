<template>
  <IntroComp
    :colors="['#d128c9', '#9a1aab']"
    :title="'Edit Test'"
    :image="'IntroEdit.svg'"
    :main="'Create and customize your tasks and heuristics for your research needs.'"
    :link="'Get started!'"
    @linkClicked="closeIntro()"
    :items="items"
    @callFunc="callFunc"
  ></IntroComp>
</template>

<script>
import IntroComp from "@/components/atoms/IntrosComponent";

export default {
  data: () => ({}),
  components: {
    IntroComp,
  },
  methods: {
    goToDoc() {
      this.$router.push("/edit/documentation").catch(() => {});
    },
    closeIntro() {
      this.$emit("closeIntro");
    },
    callFunc(func) {
      this[func](); //call item function
    },
  },
  computed: {
    items() {
      return [
        {
          iconColor: "#D128C9",
          icon: "mdi-file-document",
          title: "Read documentation",
          subtitle:
            "Click to access the documentation on how to use the edit page.",
          func: "goToDoc",
        },
      ];
    },
  },
};
</script>