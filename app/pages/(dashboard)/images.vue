<template>
  <div>
    <PageBreadcrumb page-title="Images" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="BaseImg">
        <BaseImg src="/images/grid-image/image-01.png" class="w-full overflow-hidden rounded-xl" />
      </ComponentCard>
      <ComponentCard title="Responsive Image">
        <ResponsiveImage src="/images/grid-image/image-01.png" />
      </ComponentCard>
      <ComponentCard title="Image in 2 Grid (cols-2)">
        <ColumnImageGrid :srcs="images2" variant="cols-2" />
      </ComponentCard>
      <ComponentCard title="Image in 3 Grid (cols-3)">
        <ColumnImageGrid :srcs="images3" variant="cols-3" />
      </ComponentCard>
      <ComponentCard title="Image in n Grid (cols-n)">
        <ColumnImageGrid :srcs="images_n" variant="cols-n" />
      </ComponentCard>
    </div>
  </div>
</template>

<script setup>

const images2 = ['/images/grid-image/image-02.png', '/images/grid-image/image-03.png']
const images3 = [
  '/images/grid-image/image-04.png',
  '/images/grid-image/image-05.png',
  '/images/grid-image/image-06.png'
]
const images_n = [...images2, ...images3]
</script>

<style></style>
