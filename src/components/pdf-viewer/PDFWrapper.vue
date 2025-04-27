<script setup lang="ts">
import { onMounted, provide, ref } from "vue";
import Markers from "@/components/pdf-viewer/Markers.vue";
import { createLoadingTask } from "vue3-pdfjs";
import type { PDFDocumentProxy } from "pdfjs-dist";
import Controls from "@/components/pdf-viewer/Controls.vue";

interface Props {
  pdfUrl: string;
  documentId: string;
}

const props = defineProps<Props>();

const currentPage = ref(1);
const pdfLoaded = ref(false);
const pageCount = ref(0);
const pdfComponent = ref(null)

const onPageUpdate = (page: number) => {
  currentPage.value = page;
}

onMounted(() => {
  const loadingTask = createLoadingTask(props.pdfUrl)
  loadingTask.promise.then((pdf: PDFDocumentProxy) => {
    pageCount.value = pdf.numPages
    pdfLoaded.value = true;
  })
});
provide('pdfComponentRef', pdfComponent)
</script>

<template>
  <div class="pdf-container">
    <!-- PDF Viewer using vue3-pdfjs -->
    <div class="pdf-viewer-wrapper">

      <Controls :current-page="currentPage" :page-count="pageCount" @update:page="onPageUpdate" />

      <VuePdf
          ref="pdfComponent"
          :src="pdfUrl"
          :page="currentPage"
          :key="currentPage"
      />

      <Markers :key="currentPage" :page-number="currentPage" :document-id="documentId" />
      <Controls :current-page="currentPage" :page-count="pageCount" @update:page="onPageUpdate" />
    </div>
  </div>
</template>

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
.pdf-viewer-wrapper {
  flex: 1;
  position: relative;
  overflow: auto;
}

.pdf-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  background: #f5f5f5;
  border-top: 1px solid #ddd;
  gap: 15px;
}
button {
  padding: 8px 15px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #2980b9;
}
</style>