<template>
  <div class="space-y-3">
    <div 
      @click="triggerInput"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      :class="[
        'relative border-2 border-dashed transition-all p-6 text-center cursor-pointer overflow-hidden',
        isDragging ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' : 'border-white/10 bg-white/[0.02] hover:border-white/20',
        modelValue ? 'border-success/40' : ''
      ]"
    >
      <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileSelect" />

      <div v-if="uploading" class="absolute inset-0 bg-secondary/80 flex flex-col items-center justify-center z-10">
        <div class="w-1/2 h-1 bg-white/10 overflow-hidden">
          <div class="h-full bg-primary transition-all duration-300" :style="{ width: `${progress}%` }"></div>
        </div>
        <span class="text-[8px] font-bold uppercase tracking-widest mt-2 text-white">{{ progress }}% Uploaded</span>
      </div>

      <div v-if="modelValue" class="group relative">
        <img :src="modelValue" class="h-20 w-auto mx-auto object-cover border border-white/10" />
        <div class="absolute inset-0 bg-danger/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <span class="text-[8px] font-bold text-white uppercase">Replace Image</span>
        </div>
      </div>
      
      <div v-else class="py-2">
        <i class="fa fa-cloud-arrow-up text-xl text-[var(--color-neutral)] mb-2 opacity-30"></i>
        <p class="text-[9px] uppercase font-bold text-[var(--color-neutral)] tracking-widest">
          Drop Asset or <span class="text-primary">Browse</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { storage } from '@/firebase';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { toast } from 'vue-sonner';

const props = defineProps(['modelValue', 'collection', 'fieldKey']);
const emit = defineEmits(['update:modelValue']);

const isDragging = ref(false);
const uploading = ref(false);
const progress = ref(0);
const fileInput = ref(null);

const triggerInput = () => fileInput.value.click();

const upload = async (file) => {
  if (!file) return;
  
  uploading.value = true;
  const path = `uploads/${props.collection}/${Date.now()}_${file.name}`;
  const sRef = storageRef(storage, path);
  const uploadTask = uploadBytesResumable(sRef, file);

  uploadTask.on('state_changed', 
    (snapshot) => {
      progress.value = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
    }, 
    (error) => {
      toast.error("Upload Failed", { description: error.message });
      uploading.value = false;
    }, 
    async () => {
      const url = await getDownloadURL(uploadTask.snapshot.ref);
      emit('update:modelValue', url);
      uploading.value = false;
      toast.success("Asset Synchronized", { description: "Remote URL generated." });
    }
  );
};

const handleFileSelect = (e) => upload(e.target.files[0]);
const handleDrop = (e) => {
  isDragging.value = false;
  upload(e.dataTransfer.files[0]);
};
</script>