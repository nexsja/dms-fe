import type { User } from "@/types/User.ts";

export interface Marker {
    id: string;
    documentId: string;
    pageNumber: number;
    position: MarkerPosition,
    comment: string;
    author: User;
    isResolved: boolean;
    createdAt: string;
}

export interface MarkerPosition {
    x: number;
    y: number;
}