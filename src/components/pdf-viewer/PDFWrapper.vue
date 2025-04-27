<script setup lang="ts">
import { onMounted, provide, ref } from "vue";
import Markers from "@/components/pdf-viewer/Markers.vue";
import { createLoadingTask } from "vue3-pdfjs";
import type { PDFDocumentProxy } from "pdfjs-dist";

interface Props {
  pdfUrl: string;
  documentId: string;
}

const props = defineProps<Props>();

const currentPage = ref(1);
const pdfLoaded = ref(false);
const pageCount = ref(0);

const pdfComponent = ref(null)

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < pageCount.value) {
    currentPage.value++;
  }
};

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

      <VuePdf
          ref="pdfComponent"
          :src="pdfUrl"
          :page="currentPage"
          :key="currentPage"
      />
      <Markers :key="currentPage" :page-number="currentPage" :document-id="documentId">
      </Markers>

      <!-- Navigation controls -->
      <div class="pdf-controls" v-if="pdfLoaded">
        <button
            @click="previousPage"
            :disabled="currentPage <= 1">
          Previous
        </button>
        <span>Page {{ currentPage }} of {{ pageCount }}</span>
        <button
            @click="nextPage"
            :disabled="currentPage >= pageCount">
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
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