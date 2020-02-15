<template>
  <div class="reader">
    <video id="js-video" class="reader-video" autoplay playsinline></video>
  </div>
</template>

<script>
export default {
  name: "camera"
};
</script>

<style scoped>
.reader {
  width: 100vw;
  height: 100%;
  position: relative;
}

.reader-video {
  background-color: #000;
  width: 100%;
  height: 100%;
  object-fit: fill;
}
</style>
