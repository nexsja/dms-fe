<script setup lang="ts">
import { ref, computed, onMounted, provide } from 'vue';
import { useDocuments } from "@/composables/useDocuments.js";
import { useComments } from "@/composables/useComments.ts";
import PDFWrapper from "@/components/pdf-viewer/PDFWrapper.vue";
import CommentTable from "@/components/pdf-viewer/CommentTable.vue";

interface Props {
  documentId: string;
}

const props = defineProps<Props>();
const baseUrl = window.location.origin;

const documentsApi = useDocuments();
const commentsApi = useComments();

const loading = ref(true);
const comments = ref<Comment[]>([]);

// Get document and markers data
const document = documentsApi.currentDocument;

const allMarkers = computed(() =>
    commentsApi.getCommentsByDocumentId(props.documentId)
);

// Calculate counts
const unresolvedCount = computed(() =>
    commentsApi.getUnresolvedComments(props.documentId).length
);
const resolvedCount = computed(() =>
    allMarkers.value.filter(marker => marker.isResolved).length
);

provide('comments', comments);
// Load document and markers on component creation
onMounted(async () => {
  try {

    await documentsApi.getDocumentById(props.documentId);
    await commentsApi.fetchComments(props.documentId).then((r) => {
      comments.value = r
    }).catch((err) => {
      console.log(err);
    })

  } catch (error) {
    console.error('Error loading document:', error);
  } finally {
    loading.value = false;
  }
});
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
      />

      <CommentTable :document-id="documentId" />

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