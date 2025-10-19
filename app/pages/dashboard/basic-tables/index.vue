<template>
  <div class="space-y-5 sm:space-y-6">
    <PageBreadcrumb page-title="Basic Tables" />
    <ComponentCard title="Basic Table 1">
      <BasicTableOne />
    </ComponentCard>
    <ComponentCard title="BaseTable">
      <BaseTableEx />
    </ComponentCard>
    <ComponentCard title="AdvancedBaseTable">
      <AdvancedBaseTableEx />
    </ComponentCard>
  </div>
</template>

<script setup lang="ts">
import BaseTableEx from './_components/BaseTableEx.vue'
import AdvancedBaseTableEx from './_components/AdvancedBaseTableEx.vue'
import BasicTableOne from './_components/BasicTableOne.vue'
definePageMeta({
  layout: 'dashboard'
})
</script>

<style></style>
