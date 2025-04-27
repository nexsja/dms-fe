import { ref, type Ref, watch } from "vue";
import { useQuery, useQueryClient } from "vue-query";
import type { Document } from "@/types";

const API_URL = import.meta.env.VITE_DOCUMENT_STORE_URL;

// interface DocumentResponse {
//
// }

export function useDocuments(elementRef: Ref<HTMLElement | null>) {

    const queryClient = useQueryClient();

    const currentDocument = ref<Document | null>(null)

    const documents = ref<Document[]>([])

    async function fetchDocuments() {
        const { data: allDocuments }  = await useQuery<Document[]>({
            queryKey: [`documents-all`],
            queryFn: async () => {
                const response = await fetch(API_URL + `/api/documents`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.status}`);
                }
                return response.json();
            }
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
            queryFn: async () => {
                const response = await fetch(API_URL + `/api/documents/${documentId}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.status}`);
                }
                return response.json();
            }
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