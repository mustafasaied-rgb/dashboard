<template>
  <div class="space-y-5 sm:space-y-6">
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <ComponentCard title="Primary Button">
      <div class="flex items-center gap-5">
        <Button size="sm" variant="primary"> Button Text </Button>
        <Button size="md" variant="primary"> Button Text </Button>
      </div>
    </ComponentCard>
    <ComponentCard title="Primary Button with Left Icon">
      <div class="flex items-center gap-5">
        <Button size="sm" variant="primary" :startIcon="BoxIcon"> Button Text </Button>
        <Button size="md" variant="primary" :startIcon="BoxIcon"> Button Text </Button>
      </div>
    </ComponentCard>
    <ComponentCard title="Primary Button with Right Icon">
      <div class="flex items-center gap-5">
        <Button size="sm" variant="primary" :endIcon="BoxIcon"> Button Text </Button>
        <Button size="md" variant="primary" :endIcon="BoxIcon"> Button Text </Button>
      </div>
    </ComponentCard>
    <ComponentCard title="Primary Button">
      <div class="flex items-center gap-5">
        <Button size="sm" variant="outline"> Button Text </Button>
        <Button size="md" variant="outline"> Button Text </Button>
      </div>
    </ComponentCard>
    <ComponentCard title="Primary Button with Left Icon">
      <div class="flex items-center gap-5">
        <Button size="sm" variant="outline" :startIcon="BoxIcon"> Button Text </Button>
        <Button size="md" variant="outline" :startIcon="BoxIcon"> Button Text </Button>
      </div>
    </ComponentCard>
    <ComponentCard title="Primary Button with Right Icon">
      <div class="flex items-center gap-5">
        <Button size="sm" variant="outline" :endIcon="BoxIcon"> Button Text </Button>
        <Button size="md" variant="outline" :endIcon="BoxIcon"> Button Text </Button>
      </div>
    </ComponentCard>
    <ComponentCard title="Primary Button with start and end  Icon slot">
      <div class="flex items-center gap-5">
        <Button size="sm" variant="outline">
          <template #start>
            <BoxIcon />
          </template>
          Button Text
        </Button>
        <Button size="sm" variant="outline">
          <template #end>
            <BoxIcon />
          </template>
          Button Text
        </Button>
      </div>
    </ComponentCard>
    <ComponentCard title="Primary Button with loading">
      <div class="flex items-center gap-5">
        <Button size="sm" variant="outline" loading> Button Text </Button>
      </div>
    </ComponentCard>
    <ComponentCard title="icon button">
      <div class="flex items-center gap-5">
        <Button rounded variant="outline" size="icon" class="bg-transparent">
          <BellIcon />
        </Button>
      </div>
    </ComponentCard>
    <ComponentCard title="none button">
      <div class="flex items-center gap-5">
        <Button variant="none" size="sm" class="!p-0">
          <template #start>
            <BoxIcon />
          </template>
          <span class="text-theme-sm me-1 block font-medium">Musharof</span>
        </Button>
      </div>
    </ComponentCard>
  </div>
</template>

<script setup lang="ts">
import { BoxIcon } from '~/components/icons'
definePageMeta({
  layout: 'dashboard'
})
const currentPageTitle = ref('Buttons')
</script>

<style></style>
