import type { Comment } from '@/types';
import type { CommentRequest, MarkerRequest } from '@/types/requests';
import type { ApiResponse } from "@/types/response";

export class CommentMapper {

    static toRequest(documentId: string, comment: string, marker?: MarkerRequest | null, isResolved = false): CommentRequest {
        const request: CommentRequest = {
            documentId,
            comment,
            isResolved
        };

        if (marker) {
            request.marker = marker;
        }

        return request;
    }

    static fromResponse(response: ApiResponse<Comment>): Comment {

        return response.data;
    }
}