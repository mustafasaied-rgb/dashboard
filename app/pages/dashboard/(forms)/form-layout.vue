<template>
  <div class="space-y-5 sm:space-y-6">
    <PageBreadcrumb pageTitle="Form Elements" />
    <div>
      
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})
const formData = reactive({}) as any
watch(
  formData,
  (formData) => {
    console.log('formData', formData)
  },
  { deep: true, immediate: true }
)
</script>

<style></style>
