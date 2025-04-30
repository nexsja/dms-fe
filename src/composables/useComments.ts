import { ref, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import type { Comment, Marker, MarkerPosition } from "@/types";
import { uuid } from "vue-uuid";
import { useAppState } from "@/stores/global.ts";
import { useQuery, useQueryClient } from "vue-query";

const API_URL = import.meta.env.VITE_DOCUMENT_STORE_URL;

interface CommentResponse {
    data: Comment[];
    status: string;
}

interface CommentRequest {

}

export function useComments(elementRef: Ref<HTMLElement | null>) {

    const queryClient = useQueryClient();

    const comments = ref<Comment[]>([])

    async function fetchComments(documentId: string) {
        const response = await queryClient.fetchQuery<CommentResponse>({
            queryKey: [`comments-${documentId}`],
            queryFn: async () => {
                const response = await fetch(API_URL + `/api/documents/${documentId}/comments`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.status}`);
                }
                return response.json();
            }
        });

        comments.value = response.data;
        return response.data;
    }

    const activeMarker = ref<number | null>(null)

    const appState = useAppState();

    function addComment(
        documentId: string,
        pageNumber: number,
        position: MarkerPosition,
        comment: string = ''
    ): string {

        const Marker: Marker = {
            id: uuid.v4(),
            pageNumber: pageNumber,
            position: position
        }
        const newComment: Comment = {
            id: uuid.v4(),
            documentId: documentId,
            marker: Marker,
            comment: comment,
            author: appState.user,
            createdAt: new Date().toDateString(),
            isResolved: false
        };

        comments.value.push(newComment)
        return newComment.id
    }

    function getCommentsByDocumentId(documentId: string) {
        return comments.value.filter(marker => marker.documentId === documentId);
    }

    function  getMarkersByPage(documentId: string, pageNumber: number) {
        return comments.value.filter(
            commant => commant.documentId === documentId && commant.marker?.pageNumber === pageNumber
        );
    }

    function getUnresolvedComments(documentId: string) {
        return comments.value.filter(
            marker => marker.documentId === documentId && !marker.isResolved
        );
    }

    return {
        comments,
        activeMarker,
        addComment,
        fetchComments,
        getCommentsByDocumentId,
        getMarkersByPage,
        getUnresolvedComments
    }
}