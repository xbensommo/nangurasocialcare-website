<script setup>
import { ref, onMounted } from 'vue';
import ErrorPage from '@/components/ErrorPages.vue'

</script>

<template>
  <ErrorPage code="403" message="Forbidden" description="You are not authorized to access this page."/>
</template>