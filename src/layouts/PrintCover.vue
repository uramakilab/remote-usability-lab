<template>
  <div>
    <div class="custom-title">{{ data.title }}</div>
    <v-row justify="end" class="created-by"
      >Created by {{ data.admin.email }}</v-row
    >

    <div class="mt-5 description">{{ data.description }}</div>

    <div class="custom-title" style="margin-top: 5%">Summary</div>
    <div class="pl-1">
      <div v-for="(item, i) in summaryItems" :key="i">
        <a class="summary-item" :href="`#${item}`">{{ i + 1 }}.) {{ item }}</a>
      </div>
    </div>
    <!-- <a href="https://retlab.web.app" target="_blank"
      ><img
        style="max-height: 100px"
        src="@/assets/uramakiLogoRetLabPDF.png"
        alt="Uramaki Lab Logo, find us at retlab.web.app"
    /></a> -->
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      defult: () => {
        return {};
      },
    },
    summaryItems: {
      type: Array,
      default: () => [],
    },
  },
  created() {
    console.log("obj", this.data);
  },
};
</script>

<style scoped>
.custom-title {
  font-size: 250%;
  font-weight: 350;
  text-align: justify;
  color: black;
}
.created-by {
  font-size: 150%;
  font-weight: 300;
  text-align: justify;
  color: #7d7d7d;
}
.description {
  text-align: justify;
  font-weight: 300;
  color: black;
  font-size: 120%;
}
.summary-item {
  text-transform: capitalize;
  color: black;
  font-size: 120%;
  text-decoration: none;
}
</style>