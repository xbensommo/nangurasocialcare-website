<template>
  <div class="space-y-3">
    <div 
      @click="triggerInput"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      :class="[
        'relative border-2 border-dashed transition-all p-8 text-center cursor-pointer group',
        isDragging ? 'border-primary bg-primary/5' : 'border-white/10 bg-white/[0.02] hover:border-white/20',
        modelValue ? 'border-primary/40' : ''
      ]"
    >
      <input type="file" ref="fileInput" class="hidden" @change="handleFileSelect" />

      <div v-if="uploading" class="absolute inset-0 bg-secondary/90 flex flex-col items-center justify-center z-20 backdrop-blur-sm">
        <i class="fa fa-spinner fa-spin text-primary mb-4"></i>
        <span class="text-[9px] font-bold uppercase tracking-[0.3em] text-white">{{ progress }}% SYNCING</span>
      </div>

      <div v-if="modelValue" class="relative z-10 animate-reveal">
        <img v-if="isImage" :src="modelValue" class="h-32 w-auto mx-auto object-cover border border-white/10" />
        
        <video v-else-if="isVideo" class="h-32 w-auto mx-auto border border-white/10" controls>
          <source :src="modelValue" />
        </video>

        <div v-else class="flex flex-col items-center py-4">
          <i class="fa fa-file-pdf text-3xl text-primary mb-2"></i>
          <span class="text-[8px] font-mono text-white/50 break-all px-4">{{ fileName }}</span>
        </div>

        <button 
          @click.stop="removeAsset" 
          class="absolute -top-4 -right-4 w-8 h-8 bg-danger text-white flex items-center justify-center hover:scale-110 transition-transform shadow-xl"
        >
          <i class="fa fa-xmark text-xs"></i>
        </button>
      </div>
      
      <div v-else class="py-4">
        <div class="flex justify-center gap-4 mb-3 opacity-20 group-hover:opacity-100 transition-opacity">
          <i class="fa fa-image"></i>
          <i class="fa fa-file-video"></i>
          <i class="fa fa-file-lines"></i>
        </div>
        <p class="text-[9px] uppercase font-bold text-[var(--color-neutral)] tracking-[0.2em]">
          Registry Asset <span class="text-primary">Requirement</span>
        </p>
        <p class="text-[7px] text-white/20 uppercase mt-1">Images, MP4, or PDF (Max 50MB)</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { storage } from '@/firebase';
import { ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { toast } from 'vue-sonner';

const props = defineProps(['modelValue', 'collection']);
const emit = defineEmits(['update:modelValue']);

const isDragging = ref(false);
const uploading = ref(false);
const progress = ref(0);
const fileInput = ref(null);

// Detect content types from the URL or local file
const isImage = computed(() => props.modelValue?.match(/\.(jpeg|jpg|gif|png|webp)/i) || props.modelValue?.includes('image'));
const isVideo = computed(() => props.modelValue?.match(/\.(mp4|webm|ogg)/i) || props.modelValue?.includes('video'));
const fileName = computed(() => props.modelValue?.split('/').pop().split('?')[0]);

const triggerInput = () => fileInput.value.click();

const upload = async (file) => {
  if (!file) return;
  if (file.size > 50 * 1024 * 1024) return toast.error("File too large", { description: "Maximum allowed size is 50MB" });

  uploading.value = true;
  const path = `registry/${props.collection}/${Date.now()}_${file.name}`;
  const sRef = storageRef(storage, path);
  const uploadTask = uploadBytesResumable(sRef, file);

  uploadTask.on('state_changed', 
    (snap) => progress.value = Math.round((snap.bytesTransferred / snap.totalBytes) * 100),
    (err) => { toast.error("Upload Aborted"); uploading.value = false; },
    async () => {
      const url = await getDownloadURL(uploadTask.snapshot.ref);
      emit('update:modelValue', url);
      uploading.value = false;
      toast.success("Asset Verified");
    }
  );
};

const removeAsset = async () => {
  if (!confirm("Permanently delete this asset from storage?")) return;
  
  try {
    // Attempt to delete from Firebase Storage if it's a URL
    const sRef = storageRef(storage, props.modelValue);
    await deleteObject(sRef);
    emit('update:modelValue', null);
    toast.info("Asset Removed");
  } catch (e) {
    // If it fails (e.g. not a storage URL), just clear the state
    emit('update:modelValue', null);
  }
};

const handleFileSelect = (e) => upload(e.target.files[0]);
const handleDrop = (e) => { isDragging.value = false; upload(e.dataTransfer.files[0]); };
</script>