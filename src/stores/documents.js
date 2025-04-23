import { defineStore } from 'pinia';
import axios from 'axios';

const API_URL = import.meta.env.VITE_DOCUMENT_STORE_URL;

export const useDocumentsStore = defineStore('documents', {
    state: () => ({
        documents: [],
        currentDocument: null,
        loading: false,
        error: null
    }),

    getters: {
        getOneDocument: (state) => {
            return (documentId) => state.documents.find((document) => document.id === documentId);
        }
    },

    actions: {
        async fetchDocuments() {
            this.loading = true;

            try {
                const response = await axios.get(API_URL + '/api/documents');
                this.documents = response.data
                this.error = null;
            } catch (error) {
                console.error('Error fetching documents:', error);
                this.error = 'Failed to load documents';
            } finally {
                this.loading = false;
            }
        },

        async fetchDocument(documentId) {
            this.loading = true;

            try {
                const response = await axios.get(API_URL + `/api/documents/${documentId}`);
                this.currentDocument = response.data;

                this.error = null;
            } catch (error) {
                console.error('Error fetching document:', error);
                this.error = 'Failed to load document';
                throw error;
            } finally {
                this.loading = false;
            }
        }
    }
});