<!-- components/DashboardView.vue -->
<template>
  <div class="dashboard-container">
    <div class="flex justify-content-between align-items-center mb-4">
      <h2 class="text-xl font-medium text-slate-700 m-0">Documents</h2>
      <Button label="Upload Document" icon="pi pi-upload" @click="openUploadDialog" />

      <DocumentUploadDialog
          v-model:visible="displayUploadDialog"
          @close="handleDialogClose"
          :onUploadComplete="handleUploadComplete"
      />
    </div>

    <DataTable :value="documents"
               :paginator="true"
               :rows="5"
               :rowsPerPageOptions="[5, 10, 20]"
               stripedRows
               :rowHover="true"
               responsiveLayout="scroll"
               class="datatable-sm"
               v-model:filters="filters"
               filterDisplay="menu"
               :loading="loading">

      <Column field="filename" header="Filename" :sortable="true">
        <template #filter="{ filterModel, filterCallback }">
          <InputText v-model="filterModel.value" @input="filterCallback()" placeholder="Search by name" class="p-column-filter" />
        </template>
      </Column>

      <Column field="status" header="Status" :sortable="true">
        <template #body="slotProps">
          <Tag :severity="getStatusSeverity(slotProps.data.status)"
               :value="slotProps.data.status" />
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <Dropdown v-model="filterModel.value"
                    @change="filterCallback()"
                    :options="statuses"
                    placeholder="Select a Status"
                    class="p-column-filter"
                    showClear />
        </template>
      </Column>

      <Column field="uploadedDate" header="Uploaded Date" :sortable="true">
        <template #body="slotProps">
          {{ formatDate(slotProps.data.uploadedDate) }}
        </template>
      </Column>

      <Column header="Actions" :exportable="false">
        <template #body="slotProps">
          <div class="flex gap-2">
            <Button icon="pi pi-eye"
                    @click="$emit('viewDocument', slotProps.data)"
                    class="p-button-rounded p-button-text"
                    tooltip="View" />
            <Button icon="pi pi-download"
                    class="p-button-rounded p-button-text p-button-success"
                    tooltip="Download" />
            <Button icon="pi pi-trash"
                    class="p-button-rounded p-button-text p-button-danger"
                    tooltip="Delete" />
          </div>
        </template>
      </Column>

      <template #empty>
        <div class="text-center p-4">
          <i class="pi pi-file text-5xl text-slate-300"></i>
          <p class="mt-2 text-slate-500">No documents found.</p>
        </div>
      </template>

      <template #header>
        <div class="flex justify-content-between align-items-center">
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="globalFilterValue" placeholder="Search all documents..." @input="onGlobalFilterChange" />
          </span>
          <Button icon="pi pi-refresh" @click="refreshData" class="p-button-outlined" />
        </div>
      </template>
    </DataTable>

    <div class="text-sm text-right mt-2 text-slate-500">
      Showing {{ documents.length }} documents
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Tag from 'primevue/tag';
import Dropdown from 'primevue/dropdown';
import DocumentUploadDialog from '@/components/DocumentUpload.vue';

// Emits
const emit = defineEmits(['viewDocument']);

// Component registration
const components = {
  DataTable,
  Column,
  Button,
  InputText,
  Tag,
  Dropdown,
  DocumentUploadDialog
};

// Data
const documents = ref([]);
const loading = ref(true);
const statuses = ref(['Pending Review', 'Approved', 'Declined']);
const globalFilterValue = ref('');

// Filters
const filters = ref({
  global: { value: null, matchMode: 'contains' },
  filename: { value: null, matchMode: 'startsWith' },
  status: { value: null, matchMode: 'equals' }
});

// Methods
const getStatusSeverity = (status) => {
  switch (status) {
    case 'Pending Review':
      return 'warning';
    case 'Approved':
      return 'success';
    case 'Declined':
      return 'danger';
    default:
      return 'info';
  }
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

const onGlobalFilterChange = () => {
  filters.value.global.value = globalFilterValue.value;
};

const refreshData = () => {
  loading.value = true;
  // Simulate API call delay
  setTimeout(() => {
    loading.value = false;
  }, 500);
};

const displayUploadDialog = ref(false);

const openUploadDialog = () => {
  displayUploadDialog.value = true;
};

const handleDialogClose = () => {
  console.log('Upload dialog was closed');
  // Additional cleanup logic if needed
};

const handleUploadComplete = (file) => {
  console.log('File uploaded:', file);
  // Process the uploaded file
};

// Fetch mock data
const fetchDocuments = () => {
  // Simulate API call
  setTimeout(() => {
    documents.value = [
      {
        id: 1,
        filename: 'Report_Q1.pdf',
        status: 'Pending Review',
        uploadedDate: '2025-04-14'
      },
      {
        id: 2,
        filename: 'Proposal_v2.pdf',
        status: 'Approved',
        uploadedDate: '2025-04-13'
      },
      {
        id: 3,
        filename: 'Contract_draft.pdf',
        status: 'Declined',
        uploadedDate: '2025-04-12'
      },
      {
        id: 4,
        filename: 'Marketing_Plan.pdf',
        status: 'Approved',
        uploadedDate: '2025-04-10'
      },
      {
        id: 5,
        filename: 'Budget_Forecast.pdf',
        status: 'Pending Review',
        uploadedDate: '2025-04-08'
      },
      {
        id: 6,
        filename: 'Meeting_Minutes.pdf',
        status: 'Approved',
        uploadedDate: '2025-04-05'
      }
    ];
    loading.value = false;
  }, 1000);
};

// Lifecycle
onMounted(() => {
  fetchDocuments();
});
</script>

<style scoped>
.dashboard-container {
  animation: fadeIn 0.5s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>