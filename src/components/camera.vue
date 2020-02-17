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
import { createComponent, onMounted, ref } from "@vue/composition-api";
import Quagga from "@ericblade/quagga2";
import axios from "axios";
import { Openbd } from "@/types/openbd";

const BOOK_CODE = "978";

export default createComponent({
  name: "Camera",
  setup() {
    const resultCode = ref<string>("");
    const isbnCode = ref<string>("");
    const dialog = ref<boolean>(false);
    const loading = ref<boolean>(false);

    const showDialog = () => {
      return (dialog.value = true);
    };

    onMounted(() => {
      const calc = (isbn: string) => {
        const arrIsbn = isbn
          .toString()
          .split("")
          .map(num => parseInt(num));
        let remainder = 0;
        const checkDigit = arrIsbn.pop();

        arrIsbn.forEach((num, index) => {
          remainder += num * (index % 2 === 0 ? 1 : 3);
        });
        remainder %= 10;
        remainder = remainder === 0 ? 0 : 10 - remainder;

        return checkDigit === remainder;
      };

      const fetchBook = async (code: string) => {
        const baseUrl = "https://api.openbd.jp/v1/get";
        const params = {
          isbn: code
        };
        const res = await axios.get<Openbd[]>(baseUrl, { params: params });
        return res.data;
      };

      Quagga.init(
        {
          inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector("#js-camera") as HTMLElement,
            area: { top: "0%", right: "0%", left: "0%", bottom: "50%" },
            constraints: { facingMode: "environment" }
          },
          locator: {
            patchSize: "medium",
            halfSample: true
          },
          decoder: {
            readers: ["ean_reader"]
          },
          numOfWorkers: navigator.hardwareConcurrency || 4,
          locate: true
        },
        err => {
          if (err) {
            // TODO: error表示を追加
            return;
          }
        }
      );

      Quagga.onDetected(async success => {
        const code = success.codeResult.code;
        resultCode.value = code;
        if (calc(code) && code.substr(0, 3) === BOOK_CODE) {
          loading.value = true;
          dialog.value = true;
          const res = fetchBook(code);
          isbnCode.value = JSON.stringify(res);
          loading.value = false;
        }
      });
    });

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
