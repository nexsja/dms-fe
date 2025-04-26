<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, inject } from 'vue';
import type { Marker, MarkerPosition } from "@/types";
import { useMarkers } from "@/composables/userMarkers.ts";

interface Props {
  pageNumber: number;
  documentId: string;
}

const props = defineProps<Props>()

const pdfComponent = inject('pdfComponentRef')

const { markers, activeMarker, addMarker, fetchMarkers } = useMarkers(pdfComponent);

const emit = defineEmits(['marker-resolved', 'marker-created']);

const selectedMarker = ref<Marker | null>(null);
const placingMarker = ref(false);
const newMarkerPosition = ref<MarkerPosition | null>(null);
const newMarkerComment = ref('');
const markersOverlay = ref(null);

const visibleMarkers = computed(() => {
  return markers.value.filter((marker: Marker) => marker.pageNumber === props.pageNumber);
});

const enableMarkerPlacement = () => {
  placingMarker.value = true;
  // Change cursor to indicate marking mode
  document.body.style.cursor = 'crosshair';
};

const cancelMarkerPlacement = () => {
  placingMarker.value = false;
  newMarkerPosition.value = null;
  newMarkerComment.value = '';
  // Reset cursor
  document.body.style.cursor = 'default';
};

const saveNewMarker = async () => {
  if (!newMarkerPosition.value || !newMarkerComment.value.trim()) {
    alert('Please add a comment and select a position.');
    return;
  }

  const newMarker = addMarker(props.documentId, props.pageNumber, newMarkerPosition.value, newMarkerComment.value);

  try {
    emit('marker-created', newMarker);
    cancelMarkerPlacement();
  } catch (error) {
    console.error('Error saving marker:', error);
    alert('Failed to save comment. Please try again.');
  }
};

const resolveMarker = async (marker: Marker) => {
  try {
    // In a real app, you would update this via API/store
    // Example: await pdfMarkersStore.resolveMarker(marker.id);

    // Update local state
    marker.isResolved = true;

    // Emit event for parent components
    emit('marker-resolved', marker.id);

    selectedMarker.value = null;
  } catch (error) {
    console.error('Error resolving marker:', error);
    alert('Failed to resolve comment. Please try again.');
  }
};

const getMarkerStyle = (marker: Marker) => {
  if (marker.pageNumber !== props.pageNumber) {
    return { display: 'none' };
  }

  return {
    left: `${marker.position.x}px`,
    top: `${marker.position.y}px`,
    opacity: marker.isResolved ? '0.5' : '1'
  };
};

const showMarkerDetails = (marker: Marker) => {
  selectedMarker.value = marker;
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};

const handleDocumentClick = (event) => {
  // Only process clicks if in marker placement mode
  if (!placingMarker.value) return;

  // Check if the click was inside the PDF viewer
  const pdfElement = pdfComponent.value?.$el;
  if (!pdfElement) return;

  const pdfRect = pdfElement.getBoundingClientRect();

  // Check if click is inside the PDF area
  if (
      event.clientX >= pdfRect.left &&
      event.clientX <= pdfRect.right &&
      event.clientY >= pdfRect.top &&
      event.clientY <= pdfRect.bottom
  ) {
    // Calculate coordinates relative to the PDF container
    const x = event.clientX - pdfRect.left;
    const y = event.clientY - pdfRect.top;

    newMarkerPosition.value = { x, y, pageNumber: currentPage.value };

    // Stop event propagation
    event.stopPropagation();
  }
};

// Lifecycle hooks
onMounted(() => {
  // Add click listener for marker placement
  document.addEventListener('click', handleDocumentClick);
});

onBeforeUnmount(() => {
  // Clean up event listener
  document.removeEventListener('click', handleDocumentClick);

  // Reset cursor just in case
  document.body.style.cursor = 'default';
});

onMounted(async() => {
  await fetchMarkers(props.documentId);
});
</script>

<template>
  <div class="markers-overlay" ref="markersOverlay">
    <div
        v-for="marker in visibleMarkers"
        :key="marker.id"
        class="comment-marker"
        :style="getMarkerStyle(marker)"
        @click.stop="showMarkerDetails(marker)"
    >
      <span class="marker-icon">💬</span>
    </div>
  </div>

  <!-- Add new marker button -->
  <button @click="enableMarkerPlacement" class="add-marker-btn">
    Add Comment
  </button>

  <!-- Marker details modal -->
  <div v-if="selectedMarker" class="marker-modal">
    <div class="modal-content">
      <h3>Comment</h3>
      <p>{{ selectedMarker.comment }}</p>
      <p><small>By: {{ selectedMarker.author.name }} on {{ formatDate(selectedMarker.createdAt) }}</small></p>
      <div class="modal-actions">
        <button @click="resolveMarker(selectedMarker)" v-if="!selectedMarker.isResolved">
          Resolve
        </button>
        <button @click="selectedMarker = null">Close</button>
      </div>
    </div>
  </div>

  <!-- New marker form modal -->
  <div v-if="placingMarker" class="marker-modal">
    <div class="modal-content">
      <h3>Add Comment</h3>
      <textarea v-model="newMarkerComment" placeholder="Enter your comment"></textarea>
      <div class="modal-actions">
        <button @click="saveNewMarker">Save</button>
        <button @click="cancelMarkerPlacement">Cancel</button>
      </div>
    </div>
  </div>
</template>

<style scoped>

.comment-marker {
  position: absolute;
  width: 30px;
  height: 30px;
  background-color: rgba(255, 204, 0, 0.8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  pointer-events: auto;
  z-index: 10;
  transition: transform 0.2s;
}

.comment-marker:hover {
  transform: scale(1.1);
}

.marker-icon {
  font-size: 16px;
}

.add-marker-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 10px 15px;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  z-index: 20;
}
.markers-overlay {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  width: 100%;
  height: 100%;
  z-index: 10;
}


.marker-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  width: 400px;
  max-width: 90%;
}

.modal-actions {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
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

textarea {
  width: 100%;
  height: 100px;
  margin-bottom: 10px;
  padding: 8px;
}
</style>