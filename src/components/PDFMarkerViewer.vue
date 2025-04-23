<template>
  <div class="pdf-container">
    <!-- PDF Viewer using vue3-pdfjs -->
    <div class="pdf-viewer-wrapper">
      <VuePdf
          ref="pdfComponent"
          :src="pdfUrl"
          :page="currentPage"
          @rendered="onPageRendered"
      />

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

    <!-- Markers overlay - positioned absolutely over the PDF -->
    <div class="markers-overlay" v-if="pdfLoaded" ref="markersOverlay">
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
    <button @click="enableMarkerPlacement" class="add-marker-btn" v-if="pdfLoaded">
      Add Comment
    </button>

    <!-- Marker details modal -->
    <div v-if="selectedMarker" class="marker-modal">
      <div class="modal-content">
        <h3>Comment</h3>
        <p>{{ selectedMarker.comment }}</p>
        <p><small>By: {{ selectedMarker.author }} on {{ formatDate(selectedMarker.createdAt) }}</small></p>
        <div class="modal-actions">
          <button @click="resolveMarker(selectedMarker)" v-if="!selectedMarker.resolved">
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { VuePdfPropsType } from 'vue3-pdfjs/components/vue-pdf/vue-pdf-props'; // Prop type definitions can also be imported
import { VuePdf, createLoadingTask } from 'vue3-pdfjs/esm';
import { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';

const props = defineProps({
  pdfUrl: {
    type: String,
    required: true
  },
  documentId: {
    type: [Number, String],
    required: true
  }
});

// References
const pdfComponent = ref(null);
const markersOverlay = ref(null);

// State
const pdfLoaded = ref(false);
const currentPage = ref(1);
const pageCount = ref(0);
const markers = ref([]);
const selectedMarker = ref(null);
const placingMarker = ref(false);
const newMarkerPosition = ref(null);
const newMarkerComment = ref('');
const pdfViewport = ref(null);

// Current user info (would normally come from authentication store)
const currentUser = {
  id: 'user123',
  name: 'John Doe'
};

// Computed
const visibleMarkers = computed(() => {
  return markers.value.filter(marker => marker.pageNumber === currentPage.value);
});

// Methods
const onPdfLoaded = (pdfDocument) => {
  pageCount.value = pdfDocument.numPages;
  pdfLoaded.value = true;
};

const onPageRendered = ({ page, canvas }) => {
  // Store the viewport for coordinate calculations
  pdfViewport.value = page.getViewport({ scale: 1 });

  // Adjust the markers overlay to match the PDF dimensions
  if (canvas && markersOverlay.value) {
    const pdfContainer = canvas.parentElement;
    if (pdfContainer) {
      const rect = pdfContainer.getBoundingClientRect();
      markersOverlay.value.style.width = `${rect.width}px`;
      markersOverlay.value.style.height = `${rect.height}px`;
    }
  }
};

const fetchMarkers = async () => {
  try {
    // In a real application, you would fetch markers from your API or store
    // Example using a store:
    // const markersStore = usePdfMarkersStore();
    // const fetchedMarkers = await markersStore.fetchMarkers(props.documentId);
    // markers.value = fetchedMarkers;

    // Mock data for demonstration
    markers.value = [
      {
        id: 1,
        documentId: props.documentId,
        pageNumber: 1,
        x: 100,
        y: 150,
        comment: 'Please review this section.',
        author: 'Jane Smith',
        createdAt: new Date(2023, 5, 15),
        resolved: false
      },
      {
        id: 2,
        documentId: props.documentId,
        pageNumber: 1,
        x: 300,
        y: 400,
        comment: 'This needs clarification.',
        author: 'Bob Johnson',
        createdAt: new Date(2023, 5, 16),
        resolved: false
      }
    ];
  } catch (error) {
    console.error('Error fetching markers:', error);
  }
};

const getMarkerStyle = (marker) => {
  if (marker.pageNumber !== this.currentPage) {
    return { display: 'none' };
  }

  return {
    left: `${marker.x}px`,
    top: `${marker.y}px`,
    opacity: marker.resolved ? '0.5' : '1'
  };
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

  // Create new marker object
  const newMarker = {
    id: Date.now(), // Use a proper ID generation in production
    documentId: props.documentId,
    pageNumber: newMarkerPosition.value.pageNumber,
    x: newMarkerPosition.value.x,
    y: newMarkerPosition.value.y,
    comment: newMarkerComment.value,
    author: currentUser.name,
    createdAt: new Date(),
    resolved: false
  };

  try {
    // In a real app, you would save this to your store/API
    // Example: await pdfMarkersStore.createMarker(newMarker);

    // Add to local state
    markers.value.push(newMarker);

    // Emit event for parent components
    emit('marker-added', newMarker);

    // Reset form
    cancelMarkerPlacement();
  } catch (error) {
    console.error('Error saving marker:', error);
    alert('Failed to save comment. Please try again.');
  }
};

const showMarkerDetails = (marker) => {
  selectedMarker.value = marker;
};

const resolveMarker = async (marker) => {
  try {
    // In a real app, you would update this via API/store
    // Example: await pdfMarkersStore.resolveMarker(marker.id);

    // Update local state
    marker.resolved = true;

    // Emit event for parent components
    emit('marker-resolved', marker.id);

    selectedMarker.value = null;
  } catch (error) {
    console.error('Error resolving marker:', error);
    alert('Failed to resolve comment. Please try again.');
  }
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

// Lifecycle hooks
onMounted(() => {
  const loadingTask = createLoadingTask(props.pdfUrl)
  loadingTask.promise.then((pdf: PDFDocumentProxy) => {
    pageCount.value = pdf.numPages
    pdfLoaded.value = true;
  })

  fetchMarkers();

  // Add click listener for marker placement
  document.addEventListener('click', handleDocumentClick);
});

onBeforeUnmount(() => {
  // Clean up event listener
  document.removeEventListener('click', handleDocumentClick);

  // Reset cursor just in case
  document.body.style.cursor = 'default';
});


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

.markers-overlay {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  width: 100%;
  height: 100%;
  z-index: 10;
}

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

textarea {
  width: 100%;
  height: 100px;
  margin-bottom: 10px;
  padding: 8px;
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