<template>
  <v-form ref="form">
    <v-row class="mt-4" justify="center">
      <v-col cols="10">
        <v-text-field
          prepend-inner-icon="mdi-link-variant"
          label="Form"
          :rules="googleLinkRules"
          v-model="postTest.form"
          outlined
          @input="$emit('change')"
          dense
        ></v-text-field>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
export default {
  props: {
    postTest: {
      type: Object,
      required: true
    },
    valIndex: {
      type: Number,
      required: true
    }
  },
  data: () => ({
    googleLinkRules: [
      v =>
        v == null ||
        v == "" ||
        v.indexOf("https://docs.google.com/forms/") == 0 ||
        v.indexOf("docs.google.com/forms/") == 0 ||
        "Google forms link required"
    ]
  }),
  watch: {
    "postTest.form"() {
      let valid = this.$refs.form.validate();
      this.$emit("valForm", valid, this.valIndex);
    }
  }
};
</script>