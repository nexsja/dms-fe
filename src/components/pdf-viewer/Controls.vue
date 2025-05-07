<script setup lang="ts">
import { useMainStore } from "@/stores/mainStore.ts";
import Button from 'primevue/button';
import { computed, reactive, ref, watch } from "vue";

interface Props {
  currentPage: number;
  pageCount: number;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:page', 'toggle-marker']);
const mainStore = useMainStore();

const markerEnabled = ref(mainStore.documentMarker)

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

const enableMarker = () => {
  const state = !markerEnabled.value;

  mainStore.toggleDocumentMarker(state);
  // Emit the new value after toggling
  emit('toggle-marker', state);
  markerEnabled.value = state;
};

mainStore.$subscribe((mutations, state) => {
  markerEnabled.value = state.documentMarker;
})

</script>

<template>
  <div class="pdf-controls">
    <div class="left-controls">
      <Button icon="pi pi-pencil" label="Mark" @click="enableMarker" :class="markerEnabled ? 'enabled' : ''" class="mark-btn" />

    </div>

    <div class="page-controls">
      <Button
          icon="pi pi-angle-left"
          @click="previousPage"
          :disabled="currentPage <= 1"
      />
      <span>Page {{ currentPage }} of {{ pageCount }}</span>
      <Button
          icon="pi pi-angle-right"
          @click="nextPage"
          :disabled="currentPage >= pageCount"
      />
      </div>

    <div class="right-controls">
      <!-- Space for future controls -->
    </div>
  </div>
</template>

<style scoped>
.pdf-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #f5f5f5;
  border-top: 1px solid #ddd;
}

.left-controls, .right-controls {
  width: 150px;
}

.page-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  flex: 1;
}

button {
  background-color: #3498db;
  color: white;
}

button:hover {
  background-color: #2980b9;
}

.mark-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  background-color: var(--mark-btn-color, #27ae60);

  &.enabled {
    background-color: #e74c3c;
  }
}

.mark-btn:hover {
  background-color: var(--mark-btn-hover-color, #219653);

  &.enabled {
    background-color: #c0392b;
  }
}

.pen-icon {
  font-size: 16px;
}
</style>