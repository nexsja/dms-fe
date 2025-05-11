import type { AxiosInstance } from "axios";
import type { ApiResponse } from "@/types/response";
import type { Document } from "@/types";

export class DocumentsService {
    private apiClient: AxiosInstance;

    constructor(apiClient: AxiosInstance) {
        this.apiClient = apiClient;
    }

    async fetchDocuments(): Promise<Document[]> {
        try {
            const response = await this.apiClient.get<ApiResponse<Document[]>>(
                `/api/documents`
            );

            return response.data.data;
        } catch (error) {
            console.error(`Error fetching comments: ${error}`);
            throw error;
        }
    }

    async fetchDocumentById(documentId: string): Promise<Document> {
        try {
            const response = await this.apiClient.get<ApiResponse<Document>>(
                `/api/documents/${documentId}`
            );

            return response.data.data;
        } catch (error) {
            console.error(`Error fetching comments: ${error}`);
            throw error;
        }
    }
}
