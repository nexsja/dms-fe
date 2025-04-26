export enum DocumentStatus {
    PENDING = 'Pending',
    APPROVED = 'Approved',
    DECLINED = 'Declined',
}

export interface Document {
    id: string;
    title: string;
    content: string;
    status: DocumentStatus;
    updatedDate: Date;
    createdAt: Date;
    updatedAt: Date;
    // tags: string[];
    // isPublic: boolean;
    // isArchived: boolean;
    filename: string;
    // thumbnailUrl: string;
}