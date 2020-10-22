<template>
  <div>
    <h2 class=" mx-0 px-0 .rounded-t-xl" style="border-style: groove">
      Options
    </h2>
    <v-divider></v-divider>
    <v-row class="ma-2 px-2" justify="start">
      <v-simple-table dense class=".rounded-sm" style="border-style: groove">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">
                Options
              </th>
              <th class="text-left">
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in data" :key="index">
              <td>{{ item.text }}</td>
              <td>{{ item.value === null ? "-" : item.value }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      require: true,
      defult: []
    }
  }
};
</script>

<style>
</style>