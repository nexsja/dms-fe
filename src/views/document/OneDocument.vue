<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useDocuments } from "@/composables/useDocuments.js";
import { useMarkers } from "@/composables/userMarkers.js";
import PDFWrapper from "@/components/pdf-viewer/PDFWrapper.vue";

interface Props {
  documentId: string;
}

const props = defineProps<Props>();

const baseUrl = window.location.origin;

const documentsApi = useDocuments();
const markersApi = useMarkers();
const loading = ref(true);

// Get document and markers data
const document = documentsApi.currentDocument;

const allMarkers = computed(() =>
    markersApi.getMarkersByDocumentId(props.documentId)
);

// Calculate counts
const unresolvedCount = computed(() =>
    markersApi.getUnresolvedMarkers(props.documentId).length
);
const resolvedCount = computed(() =>
    allMarkers.value.filter(marker => marker.isResolved).length
);

// Load document and markers on component creation
onMounted(async () => {
  try {

    await documentsApi.getDocumentById(props.documentId);

  } catch (error) {
    console.error('Error loading document:', error);
  } finally {
    loading.value = false;
  }
});

// Handler for new markers
const onMarkerAdded = async (markerData) => {
  try {
    await markersApi.createMarker(markerData);
    // Show success notification using your preferred notification system
  } catch (error) {
    console.error('Failed to add comment:', error);
    // Show error notification
  }
};

// Handler for resolving markers
const onMarkerResolved = async (markerId) => {
  try {
    await markersApi.resolveMarker(markerId);
    // Show success notification
  } catch (error) {
    console.error('Failed to resolve comment:', error);
    // Show error notification
  }
};
</script>

<template>
  <div class="document-viewer">
    <div v-if="loading" class="loading-indicator">
      <div class="spinner"></div>
      <p>Loading document...</p>
    </div>

    <template v-else>
      <div class="document-header">
        <h1>{{ document?.title }}</h1>
        <div class="document-stats">
          <span class="unresolved-count" v-if="unresolvedCount > 0">
            {{ unresolvedCount }} unresolved comments
          </span>
          <span class="resolved-count" v-if="resolvedCount > 0">
            {{ resolvedCount }} resolved
          </span>
        </div>
      </div>

      <!-- PDF Marker Viewer Component -->
      <PDFWrapper v-if="!loading"
          :pdf-url="`${baseUrl}/pdfs/${document.filename}`"
          :document-id="documentId"
          @marker-added="onMarkerAdded"
          @marker-resolved="onMarkerResolved"
      />
    </template>
  </div>
</template>

<style scoped>
.document-viewer {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.document-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.document-stats {
  display: flex;
  gap: 10px;
}

.unresolved-count {
  background-color: #e74c3c;
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 14px;
}

.resolved-count {
  background-color: #2ecc71;
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 14px;
}

.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #3498db;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.document-viewer {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.document-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.unresolved-count {
  background-color: #e74c3c;
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 14px;
}
</style>