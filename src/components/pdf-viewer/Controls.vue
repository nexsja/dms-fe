<script setup lang="ts">
interface Props {
  currentPage: number;
  pageCount: number;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:page']);

import { ref } from "vue";

const currentPage = ref(1);
const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    emit('update:page', currentPage.value);
  }
};

const nextPage = () => {
  if (currentPage.value < props.pageCount) {
    currentPage.value++;
    emit('update:page', currentPage.value);
  }
};
</script>

<template>
  <div class="pdf-controls">
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
</template>

<style scoped>
.pdf-controls {
  display: flex;
  position: fixed;
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