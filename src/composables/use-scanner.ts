import { createComponent, onMounted, ref } from "@vue/composition-api";
import Quagga from "@ericblade/quagga2";
import axios from "axios";
import { Openbd } from "@/types/openbd";

const BOOK_CODE = "978";
const quaggaConfig = {
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
};

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

export default function useScanner() {
  const resultCode = ref<string>("");
  const isbnCode = ref<string>("");
  const dialog = ref<boolean>(false);
  const loading = ref<boolean>(false);

  const showDialog = () => {
    return (dialog.value = true);
  };

  onMounted(() => {
    Quagga.init(quaggaConfig);

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
