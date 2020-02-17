<template>
  <v-app>
    <v-container>
      <v-content>
        <h1>Hello pwa</h1>
        <Camera />
      </v-content>
    </v-container>
  </v-app>
</template>

<script lang="ts">
import Camera from "@/components/camera.vue";
import { createComponent, onMounted } from "@vue/composition-api";

export default createComponent({
  name: "App",
  components: { Camera }
});
</script>
