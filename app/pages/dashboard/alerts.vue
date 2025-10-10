<template>
  <div>
    <PageBreadcrumb page-title="Alerts" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="Success Alert">
        <Alert
          variant="success"
          title="Success Message"
          message="Be cautious when performing this action."
          :showLink="true"
          linkHref="/"
          linkText="Learn more"
        />
        <Alert
          variant="success"
          title="Success Message"
          message="Be cautious when performing this action."
          :showLink="false"
        />
      </ComponentCard>
      <ComponentCard title="Warning Alert">
        <Alert
          variant="warning"
          title="Warning  Message"
          message="Be cautious when performing this action."
          :showLink="true"
          linkHref="/"
          linkText="Learn more"
        />
        <Alert
          variant="warning"
          title="Warning Message Message"
          message="Be cautious when performing this action."
          :showLink="false"
        />
      </ComponentCard>
      <ComponentCard title="Error Alert">
        <Alert
          variant="error"
          title="Error  Message"
          message="Be cautious when performing this action."
          :showLink="true"
          linkHref="/"
          linkText="Learn more"
        />
        <Alert
          variant="error"
          title="Error Message Message"
          message="Be cautious when performing this action."
          :showLink="false"
        />
      </ComponentCard>
      <ComponentCard title="Info Alert">
        <Alert
          variant="info"
          title="Info  Message"
          message="Be cautious when performing this action."
          :showLink="true"
          linkHref="/"
          linkText="Learn more"
        />
        <Alert
          variant="info"
          title="Info Message Message"
          message="Be cautious when performing this action."
          :showLink="false"
        />
      </ComponentCard>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard'
})
const images2 = ['/images/grid-image/image-02.png', '/images/grid-image/image-03.png']
const images3 = [
  '/images/grid-image/image-04.png',
  '/images/grid-image/image-05.png',
  '/images/grid-image/image-06.png'
]
const images_n = [...images2, ...images3]
</script>

<style></style>
