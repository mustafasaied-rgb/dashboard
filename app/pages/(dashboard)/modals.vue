<template>
  <div class="space-y-5 sm:space-y-6">
    <PageBreadcrumb page-title="Modals" />
    <ComponentCard title="hideDefaultClose=false">
      <Button variant="solid" color="primary" @click="modal.open1 = true"> Open1 </Button>
      <BaseModal v-model="modal.open1" rounded>
        <template #header>
          <h4 class="text-title-sm mb-7 font-semibold text-gray-800 dark:text-white/90">
            Modal Heading1
          </h4>
        </template>
        <template #body>
          <div class="no-scrollbar max-h-[70svh] overflow-y-auto">
            <p class="text-sm leading-6 text-gray-500 dark:text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod est quis
              mauris lacinia pharetra. Sed a ligula ac odio condimentum aliquet a nec nulla. Aliquam
              bibendum ex sit amet ipsum rutrum feugiat ultrices enim quam.
            </p>
            <p class="mt-5 text-sm leading-6 text-gray-500 dark:text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod est quis
              mauris lacinia pharetra. Sed a ligula ac odio.
            </p>
            <p class="text-sm leading-6 text-gray-500 dark:text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod est quis
              mauris lacinia pharetra. Sed a ligula ac odio condimentum aliquet a nec nulla. Aliquam
              bibendum ex sit amet ipsum rutrum feugiat ultrices enim quam.
            </p>
            <p class="mt-5 text-sm leading-6 text-gray-500 dark:text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod est quis
              mauris lacinia pharetra. Sed a ligula ac odio.
            </p>
            <p class="text-sm leading-6 text-gray-500 dark:text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod est quis
              mauris lacinia pharetra. Sed a ligula ac odio condimentum aliquet a nec nulla. Aliquam
              bibendum ex sit amet ipsum rutrum feugiat ultrices enim quam.
            </p>
            <p class="mt-5 text-sm leading-6 text-gray-500 dark:text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod est quis
              mauris lacinia pharetra. Sed a ligula ac odio.
            </p>
            <p class="text-sm leading-6 text-gray-500 dark:text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod est quis
              mauris lacinia pharetra. Sed a ligula ac odio condimentum aliquet a nec nulla. Aliquam
              bibendum ex sit amet ipsum rutrum feugiat ultrices enim quam.
            </p>
            <p class="mt-5 text-sm leading-6 text-gray-500 dark:text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod est quis
              mauris lacinia pharetra. Sed a ligula ac odio.
            </p>
            <p class="text-sm leading-6 text-gray-500 dark:text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod est quis
              mauris lacinia pharetra. Sed a ligula ac odio condimentum aliquet a nec nulla. Aliquam
              bibendum ex sit amet ipsum rutrum feugiat ultrices enim quam.
            </p>
            <p class="mt-5 text-sm leading-6 text-gray-500 dark:text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod est quis
              mauris lacinia pharetra. Sed a ligula ac odio.
            </p>
            <p class="text-sm leading-6 text-gray-500 dark:text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod est quis
              mauris lacinia pharetra. Sed a ligula ac odio condimentum aliquet a nec nulla. Aliquam
              bibendum ex sit amet ipsum rutrum feugiat ultrices enim quam.
            </p>
            <p class="mt-5 text-sm leading-6 text-gray-500 dark:text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod est quis
              mauris lacinia pharetra. Sed a ligula ac odio.
            </p>
            <p class="text-sm leading-6 text-gray-500 dark:text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod est quis
              mauris lacinia pharetra. Sed a ligula ac odio condimentum aliquet a nec nulla. Aliquam
              bibendum ex sit amet ipsum rutrum feugiat ultrices enim quam.
            </p>
            <p class="mt-5 text-sm leading-6 text-gray-500 dark:text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod est quis
              mauris lacinia pharetra. Sed a ligula ac odio.
            </p>
            <p class="text-sm leading-6 text-gray-500 dark:text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod est quis
              mauris lacinia pharetra. Sed a ligula ac odio condimentum aliquet a nec nulla. Aliquam
              bibendum ex sit amet ipsum rutrum feugiat ultrices enim quam.
            </p>
            <p class="mt-5 text-sm leading-6 text-gray-500 dark:text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod est quis
              mauris lacinia pharetra. Sed a ligula ac odio.
            </p>
            <p class="text-sm leading-6 text-gray-500 dark:text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod est quis
              mauris lacinia pharetra. Sed a ligula ac odio condimentum aliquet a nec nulla. Aliquam
              bibendum ex sit amet ipsum rutrum feugiat ultrices enim quam.
            </p>
            <p class="mt-5 text-sm leading-6 text-gray-500 dark:text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod est quis
              mauris lacinia pharetra. Sed a ligula ac odio.
            </p>
          </div>
        </template>
        <template #footer="{ close }">
          <div class="mt-8 flex w-full items-center justify-end gap-3">
            <Button @click="close" variant="outline"> Close</Button>
            <Button variant="solid" color="primary"> Save Changes </Button>
          </div>
        </template>
      </BaseModal>
    </ComponentCard>
    <ComponentCard title="hideDefaultClose=true">
      <Button variant="solid" color="primary" @click="modal.open2 = true"> open2 </Button>

      <BaseModal v-model="modal.open2" rounded :hideDefaultClose="true">
        <template #header>
          <h4 class="text-title-sm mb-7 font-semibold text-gray-800 dark:text-white/90">
            Modal Heading2
          </h4>
        </template>
        <template #body>
          <div class="">
            <p class="text-sm leading-6 text-gray-500 dark:text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod est quis
              mauris lacinia pharetra. Sed a ligula ac odio condimentum aliquet a nec nulla. Aliquam
              bibendum ex sit amet ipsum rutrum feugiat ultrices enim quam.
            </p>
            <p class="mt-5 text-sm leading-6 text-gray-500 dark:text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod est quis
              mauris lacinia pharetra. Sed a ligula ac odio.
            </p>
          </div>
        </template>
        <template #footer="{ close }">
          <div class="mt-8 flex w-full items-center justify-end gap-3">
            <Button @click="close" variant="outline"> Close</Button>
            <Button variant="solid" color="primary"> Save Changes </Button>
          </div>
        </template>
      </BaseModal>
    </ComponentCard>
    <ComponentCard title="BaseModalStatus" class="flex justify-start gap-5">
      <BaseModalStatus status="success" BtnText="success" />
      <BaseModalStatus status="info" BtnText="info" />
      <BaseModalStatus status="warning" BtnText="warning" />
      <BaseModalStatus status="danger" BtnText="danger" />
    </ComponentCard>
    <ComponentCard title="AsyncModal" class="flex justify-start gap-5">
      <AsyncModal ref="modalRef" />
      <Button color="error" @click="onDelete">Open Modal</Button>
    </ComponentCard>
  </div>
</template>

<script setup lang="ts">
import AsyncModal from '@/components/ui/modals/AsyncModal.vue'



const modal = reactive({}) as any
// const onPageChange = (e) => {
//   console.log('onPageChange--->e', e)
// }
watch(modal, (modal) => console.log('modal', modal), { deep: true, immediate: true })

const modalRef = ref<InstanceType<typeof AsyncModal> | null>(null)
async function onDelete() {
  const res = await modalRef.value!.open({
    variant: 'danger',
    title: 'Delete item?',
    message: 'This action cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    showCancel: true
  })

  if (res.action === 'confirm') {
    console.log('✅ confirmed')
  } else {
    console.log('❌ cancelled/closed')
  }
}
</script>

<style></style>
