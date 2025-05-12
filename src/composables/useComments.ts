import { ref } from 'vue'
import type { Comment } from "@/types";
import { useMutation, useQueryClient } from "vue-query";
import { CommentMapper } from "@/mappers";
import type { CommentRequest } from "@/types/requests";
import { useAuth } from "@/composables/useAuth.ts";
import { CommentService } from "@/services/CommentsService.ts";

type MutationParams = {
    documentId: string,
    commentId: string
}

// Persist comments across components
const comments = ref<Comment[]>([]);

export function useComments() {

    const { apiClient } = useAuth();
    const commentService = new CommentService(apiClient);
    const queryClient = useQueryClient();

    async function fetchComments(documentId: string): Promise<Comment[]> {
        await queryClient.fetchQuery<Comment[]>({
            queryKey: [`comments-${documentId}`],
            queryFn: async () => await commentService.fetchComments(documentId)
        }).then((response: Comment[]) => {
            comments.value = response;
        });

        return comments.value
    }

    const resolveCommentMutation = useMutation({
        mutationFn: async (params: MutationParams): Promise<Comment> =>
            await commentService.resolveComment(params.documentId, params.commentId),
        onSuccess: (_, params: MutationParams) => {
            const { commentId, documentId } = params;
            const comment = comments.value.find(c => c.id === commentId);
            if (comment) {
                comment.isResolved = true;
            }

            if (documentId) {
                queryClient.invalidateQueries([`comments-${documentId}`]);
            }
        }
    });

    function resolveComment(comment: Comment) {
        return resolveCommentMutation.mutateAsync({ commentId: comment.id, documentId: comment.documentId });
    }

    const createCommentMutation = useMutation({
        mutationFn: async (commentRequest: CommentRequest): Promise<Comment> => await commentService.createComment(commentRequest),
        onSuccess: (comment, variables) => {
            comments.value.push(comment)
        }
    });

    function addComment(
        documentId: string,
        comment: string,
        marker: { pageNumber: number, position: { x: number, y: number } } | null,
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
            comment => comment.documentId === documentId && !comment.isResolved
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