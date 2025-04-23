import { defineStore } from 'pinia';
import axios from 'axios';

const API_URL = import.meta.env.VITE_DOCUMENT_STORE_URL;

export const usePdfMarkersStore = defineStore('pdfMarkers', {
    state: () => ({
        markers: [],
        loading: false,
        error: null
    }),

    getters: {
        getMarkersByDocumentId: (state) => {
            return (documentId) => {
                return state.markers.filter(marker => marker.documentId === documentId);
            }
        },

        getMarkersByPage: (state) => {
            return (documentId, pageNumber) => {
                return state.markers.filter(
                    marker => marker.documentId === documentId && marker.pageNumber === pageNumber
                );
            }
        },

        getUnresolvedMarkers: (state) => {
            return (documentId) => {
                return state.markers.filter(
                    marker => marker.documentId === documentId && !marker.resolved
                );
            }
        }
    },

    actions: {
        async fetchMarkers(documentId) {
            this.loading = true;

            try {
                // Call your API to get markers
                const response = await axios.get(API_URL + `/api/documents/${documentId}/markers`);

                this.markers = response.data;
                this.error = null;
            } catch (error) {
                console.error('Error fetching markers:', error);
                this.error = 'Failed to load markers';
            } finally {
                this.loading = false;
            }
        },

        async createMarker(markerData) {
            this.loading = true;

            try {
                // Call your API to create a marker
                const response = await axios.post(
                    API_URL + `/api/documents/${markerData.documentId}/markers`,
                    markerData
                );

                this.markers.push(response.data);
                this.error = null;

                return response.data;
            } catch (error) {
                console.error('Error creating marker:', error);
                this.error = 'Failed to create marker';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async updateMarker(markerId, markerData) {
            this.loading = true;

            try {
                // Call your API to update a marker
                const response = await axios.put(API_URL + `/api/markers/${markerId}`, markerData);

                // Find and update the marker in the state
                const index = this.markers.findIndex(marker => marker.id === markerId);
                if (index !== -1) {
                    this.markers[index] = { ...this.markers[index], ...response.data };
                }

                this.error = null;
                return response.data;
            } catch (error) {
                console.error('Error updating marker:', error);
                this.error = 'Failed to update marker';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async resolveMarker(markerId) {
            return this.updateMarker(markerId, { resolved: true });
        },

        async deleteMarker(markerId) {
            this.loading = true;

            try {
                // Call your API to delete a marker
                await axios.delete(API_URL + `/api/markers/${markerId}`);

                // Remove the marker from the state
                this.markers = this.markers.filter(marker => marker.id !== markerId);
                this.error = null;
            } catch (error) {
                console.error('Error deleting marker:', error);
                this.error = 'Failed to delete marker';
                throw error;
            } finally {
                this.loading = false;
            }
        }
    }
});