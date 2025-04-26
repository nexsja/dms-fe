<template>
  <div class="pdf-container">

    <PDFWrapper
      :pdfUrl="pdfUrl"
      :documentId="documentId"
    />

  </div>
</template>

<script setup lang="ts">
import PDFWrapper from "@/components/pdf-viewer/PDFWrapper.vue";

interface Props {
  pdfUrl: string;
  documentId: number | string;
}

defineProps<Props>();
</script>

<style scoped>
.pdf-container {
  position: relative;
  width: 100%;
  height: 800px;
  border: 1px solid #ccc;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>