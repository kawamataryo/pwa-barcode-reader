<template>
  <div class="reader">
    <p>(debug) {{ resultCode }}</p>
    <v-btn @click="showDialog()">scan code</v-btn>
    <v-card>
      <v-card-text>
        <div class="text-center" v-if="loading">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
        <div v-else>
          {{ isbnCode }}
        </div>
      </v-card-text>
    </v-card>
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title><h1 class="headline">Scan barcode</h1></v-card-title>
        <v-card-text>
          <div id="js-camera" class="camera-area"></div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { createComponent } from "@vue/composition-api";
import { useScanner } from "@/composables/use-scanner";

export default createComponent({
  name: "Camera",
  setup() {
    const { resultCode, isbnCode, dialog, loading, showDialog } = useScanner();

    return {
      resultCode,
      isbnCode,
      dialog,
      loading,
      showDialog
    };
  }
});
</script>

<style scoped lang="scss">
.camera-area {
  overflow: hidden;
  height: 450px;
  width: 100%;
  background-color: #ccc;
  /**
   * 指定したDIV配下にvideoとcanvasが追加される
   * 4:3になるため、margin-topで調整
   */
  video,
  canvas {
    height: 450px;
    width: 100%;
  }
}
</style>
