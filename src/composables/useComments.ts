import { ref } from 'vue'
import type { Ref } from 'vue'
import type { Comment } from "@/types";
import { useAppState } from "@/stores/global.ts";
import { useMutation, useQuery, useQueryClient } from "vue-query";
import { CommentMapper } from  "@/mappers";
import type { CommentRequest } from "@/types/requests";
import type { ApiResponse } from "@/types/response";

const API_URL = import.meta.env.VITE_DOCUMENT_STORE_URL;



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

    const createCommentMutation = useMutation({
        mutationFn: async (commentRequest: CommentRequest): Promise<Comment> => {
            const response = await fetch(`${API_URL}/api/documents/${commentRequest.documentId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(commentRequest)
            });

            if (!response.ok) {
                throw new Error(`[${response.status}] Error creating comment: ${response.statusText}`);
            }

            const responseData: ApiResponse<Comment> = await response.json();
            return CommentMapper.fromResponse(responseData);
        },
        onSuccess: (data, variables) => {
            comments.value.push(data)
        }
    });

    function addComment(
        documentId: string,
        comment: string,
        authorId: string,
        marker: { pageNumber: number, position: { x: number, y: number } } | null
    ): string {

        const request = CommentMapper.toRequest(
            documentId,
            comment,
            authorId,
            marker
        );

        return createCommentMutation.mutateAsync(request);
    }

    function getCommentsByDocumentId(documentId: string) {
        return comments.value.filter(marker => marker.documentId === documentId);
    }

    function  getMarkersByPage(documentId: string, pageNumber: number) {
        return comments.value.filter(
            comment => comment.documentId === documentId && comment.marker?.pageNumber === pageNumber
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