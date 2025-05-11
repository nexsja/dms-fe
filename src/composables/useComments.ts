import { ref } from 'vue'
import type { Comment } from "@/types";
import { useMutation, useQueryClient } from "vue-query";
import { CommentMapper } from  "@/mappers";
import type { CommentRequest } from "@/types/requests";
import { useAuth } from "@/composables/useAuth.ts";
import { CommentService } from "@/services/CommentsService.ts";


export function useComments() {

    const { apiClient } = useAuth();
    const commentService = new CommentService(apiClient);
    const queryClient = useQueryClient();

    const comments = ref<Comment[]>([]);

    async function fetchComments(documentId: string): Promise<Comment[]> {
        await queryClient.fetchQuery<Comment[]>({
            queryKey: [`comments-${documentId}`],
            queryFn: async () => await commentService.fetchComments(documentId)
        }).then((response: Comment[]) => {
            comments.value = response;
        });

        return comments.value
    }

    const createCommentMutation = useMutation({
        mutationFn: async (commentRequest: CommentRequest): Promise<Comment> => await commentService.createComment(commentRequest),
        onSuccess: (comment, variables) => {
            comments.value.push(comment)
        }
    });

    const resolveCommentMutation = useMutation({
        mutationFn: async () => {

        }
    });

    function resolveComment(comment: Comment) {

    }

    function addComment(
        documentId: string,
        comment: string,
        marker: { pageNumber: number, position: { x: number, y: number } } | null,
        parentId?: string | null
    ): string {

        const request = CommentMapper.toRequest(
            documentId,
            comment,
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
        addComment,
        resolveComment,
        fetchComments,
        getCommentsByDocumentId,
        getMarkersByPage,
        getUnresolvedComments
    }
}