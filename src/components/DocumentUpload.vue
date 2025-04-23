<template>
  <Dialog :visible="visible"
          header="Upload New Document"
          :style="{ width: '450px' }"
          :modal="true"
          @update:visible="updateVisibility">
    <FileUpload mode="basic"
                name="document"
                :multiple="false"
                accept=".pdf"
                :maxFileSize="5000000"
                @upload="onUpload"
                :auto="true"
                chooseLabel="Select PDF File"
                class="w-full" />
    <p class="mt-3 text-sm text-slate-500">Maximum file size: 5MB. Accepted format: PDF.</p>
    <template #footer>
      <Button label="Cancel" icon="pi pi-times" @click="closeDialog"
              class="p-button-text" />
    </template>
  </Dialog>
</template>

<script setup>
defineOptions({
  name: 'DocumentUploadDialog'
});

import Button from 'primevue/button';
import FileUpload from 'primevue/fileupload';
import Dialog from 'primevue/dialog';

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  onUploadComplete: {
    type: Function,
    default: () => {}
  }
});

const emit = defineEmits(['update:visible', 'close']);

const closeDialog = () => {
  emit('update:visible', false);
  emit('close');
};

const updateVisibility = (value) => {
  emit('update:visible', value);
  if (!value) {
    emit('close');
  }
};

const onUpload = (event) => {
  // Handle the upload logic
  if (event.files && event.files.length > 0) {
    props.onUploadComplete(event.files[0]);
    closeDialog();
  }
};
</script>