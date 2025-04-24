export interface Marker {
    id: string;
    documentId: number | string;
    pageNumber: number;
    position: MarkerPosition,
    comment: string;
    author: string;
    isResolved: boolean;
    createdAt: string;
}

export interface MarkerPosition {
    x: number;
    y: number;
}