export interface MarkerRequest {
    pageNumber: number;
    position: {
        x: number,
        y: number
    }
}

export interface CommentRequest {
    documentId: string;
    comment: string;
    authorId: string;
    isResolved?: boolean;
    marker?: MarkerRequest | null;
}
