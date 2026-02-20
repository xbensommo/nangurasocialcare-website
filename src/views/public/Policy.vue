<template>
  <div class="p-8 bg-white rounded-[32px] border border-red-50">
    <h3 class="font-serif text-xl text-red-900 mb-2">Data Sovereignty</h3>
    <p class="text-xs text-gray-500 mb-6 leading-relaxed">
      In accordance with our privacy policy, you may request a full export of your clinical history or request the permanent closure of your file.
    </p>
    
    <div class="flex flex-col sm:flex-row gap-4">
      <button @click="exportData" class="flex-1 py-3 px-6 rounded-xl border border-gray-200 text-[10px] font-bold uppercase tracking-widest text-gray-600 hover:bg-gray-50 transition-all">
        <i class="fas fa-download mr-2"></i> Export My Data (JSON/PDF)
      </button>
      
      <button @click="requestClosure" class="flex-1 py-3 px-6 rounded-xl bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest hover:bg-red-100 transition-all">
        Request File Closure
      </button>
    </div>
  </div>
</template>

<script setup>
const exportData = () => {
  // Logic: Query Firestore for all 'session_notes' and 'bookings' for this UserUID
  // Generate a formatted PDF and trigger download
  alert("Your data package is being prepared and will be sent to your verified email.");
};

const requestClosure = () => {
  // Logic: Mark account as 'pending_deletion'. 
  // Practitioner receives a notification to conduct a final review before data wipe.
  confirm("This will initiate the permanent closure of your clinical file. This action cannot be undone. Proceed?");
};
</script>