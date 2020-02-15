<template>
  <v-app>
    <v-content>
      <h1>hello pwa</h1>
      <Camera></Camera>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Camera from "@/components/camera.vue";
import { createComponent, onMounted } from "@vue/composition-api";

export default createComponent({
  name: "App",
  components: { Camera },
  setup() {
    onMounted(() => {
      const video = document.querySelector("#js-video") as HTMLVideoElement;

      navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            facingMode: {
              exact: "environment"
            }
          }
        })
        .then(function(stream) {
          video.srcObject = stream;
          video.onloadedmetadata = function(e) {
            video.play();
          };
        })
        .catch(function(err) {
          alert("Error!!");
        });
    });
  }
});
</script>
