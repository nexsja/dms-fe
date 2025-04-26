import { ref, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import type { Marker, MarkerPosition } from "@/types";
import { uuid } from "vue-uuid";
import { useAppState } from "@/stores/global.ts";
import { useQuery, useQueryClient } from "vue-query";

const NAMESPACE = '567812345678-1234-5678-1234-5678';

const API_URL = import.meta.env.VITE_DOCUMENT_STORE_URL;

interface MarkerResponse {
    data: Marker[];
    status: string;
}

export function useMarkers(elementRef: Ref<HTMLElement | null>) {

    const queryClient = useQueryClient();

    const markers = ref<Marker[]>([])

    async function fetchMarkers(documentId: string) {
        const response = await queryClient.fetchQuery<MarkerResponse>({
            queryKey: [`markers-${documentId}`],
            queryFn: async () => {
                const response = await fetch(API_URL + `/api/documents/${documentId}/markers`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.status}`);
                }
                return response.json();
            }
        });

        markers.value = response.data;
        return response.data;
    }

    const activeMarker = ref<number | null>(null)

    const appState = useAppState();

    function addMarker(
        documentId: string,
        pageNumber: number,
        position: MarkerPosition,
        comment: string = ''
    ): string {
        const newMarker: Marker = {
            id: uuid.v5("MarkerId", NAMESPACE), // Use a proper ID generation in production
            documentId: documentId,
            pageNumber: pageNumber,
            position: position,
            comment: comment,
            author: appState.user,
            createdAt: new Date().toDateString(),
            isResolved: false
        };
        // markers.value.push(newMarker)
        return newMarker.id
    }

    function getMarkersByDocumentId(documentId: string) {
        return markers.value.filter(marker => marker.documentId === documentId);
    }

    function  getMarkersByPage(documentId: string, pageNumber: number) {
        return markers.value.filter(
            marker => marker.documentId === documentId && marker.pageNumber === pageNumber
        );
    }

    function getUnresolvedMarkers(documentId: string) {
        return markers.value.filter(
            marker => marker.documentId === documentId && !marker.isResolved
        );
    }

    return {
        markers,
        activeMarker,
        addMarker,
        fetchMarkers,
        getMarkersByDocumentId,
        getMarkersByPage,
        getUnresolvedMarkers
    }
}