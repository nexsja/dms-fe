import { ref, type Ref, watch } from "vue";
import { useQuery, useQueryClient } from "vue-query";
import type { Document } from "@/types";
import { useAuth } from "@/composables/useAuth.ts";
import { CommentService } from "@/services/CommentsService.ts";
import { DocumentsService } from "@/services/DocumentsService.ts";

const API_URL = import.meta.env.VITE_DOCUMENT_STORE_URL;

// interface DocumentResponse {
//
// }

export function useDocuments(elementRef: Ref<HTMLElement | null>) {

    const queryClient = useQueryClient();

    const currentDocument = ref<Document | null>(null)

    const documents = ref<Document[]>([])

    const { apiClient } = useAuth();
    const documentsService = new DocumentsService(apiClient);

    async function fetchDocuments() {
        const { data: allDocuments }  = await useQuery<Document[]>({
            queryKey: [`documents-all`],
            queryFn: async () => await documentsService.fetchDocuments()
        });

        watch(allDocuments, (newDocuments) => {
            if (newDocuments) {
                documents.value = newDocuments;
            }
        }, { immediate: true });
    }

    async function getDocumentById(documentId: string) {
        const response = await queryClient.fetchQuery<Document>({
            queryKey: [`documents-${documentId}`],
            queryFn: async () => await documentsService.fetchDocumentById(documentId)
        });

        currentDocument.value = response;
        return response;
    }

    return {
        documents,
        currentDocument,
        fetchDocuments,
        getDocumentById,
    }
}