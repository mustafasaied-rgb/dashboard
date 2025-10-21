<template>
  <div class="space-y-5 sm:space-y-6">
    <PageBreadcrumb page-title="Basic Tables" />
    <ComponentCard collapsible title="Basic Table 1">
      <BasicTableOne />
    </ComponentCard>
    <ComponentCard collapsible title="BaseTable">
      <BaseTableEx />
    </ComponentCard>
    <ComponentCard collapsible title="AdvancedBaseTable">
      <AdvancedBaseTableEx />
    </ComponentCard>
    <ComponentCard title="AdvancedBaseTableServerEx">
      <AdvancedBaseTableServerEx />
    </ComponentCard>
  </div>
</template>

<script setup lang="ts">
import BaseTableEx from './_components/BaseTableEx.vue'
import AdvancedBaseTableServerEx from './_components/AdvancedBaseTableServerEx.vue'
import AdvancedBaseTableEx from './_components/AdvancedBaseTableEx.vue'
import BasicTableOne from './_components/BasicTableOne.vue'

</script>

<style></style>
