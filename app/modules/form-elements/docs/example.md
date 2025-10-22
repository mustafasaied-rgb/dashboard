# Example usage

```vue
<template>
  <div>
    <div class="mb-5 sm:mb-8">
      <h1
        class="text-title-sm sm:text-title-md mb-2 font-semibold text-gray-800 dark:text-white/90"
      >
        Sign In
      </h1>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Enter your email and password to sign in!
      </p>
    </div>
    <div>
      <div class="relative border-t border-gray-200 py-2.5 dark:border-gray-800"></div>
      <BaseForm ref="formRef" @submit.prevent="handleSubmit">
        <div class="space-y-5">
          <BaseInput
            required
            v-model="formData.email"
            label="Email"
            placeholder="info@gmail.com"
            :rules="[rules.required, rules.email]"
          />
          <BaseInput
            required
            v-model="formData.password"
            label="Password"
            type="password"
            revealable
            placeholder="Enter your password"
            :rules="[rules.required]"
          />
          <BaseCheckbox v-model="formData.keepLoggedIn" label="Keep me logged in" />
          <Button type="submit" class="w-full" color="primary"> Sign In </Button>
        </div>
      </BaseForm>
      <!-- <div class="mt-5">
        <p class="text-center text-sm font-normal text-gray-700 sm:text-start dark:text-gray-400">
          Don't have an account?
          <nuxt-link
            to="/auth/signup"
            class="text-brand-500 hover:text-brand-600 dark:text-brand-400"
            >Sign Up</nuxt-link
          >
        </p>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AppFormExpose } from '~/components/ui/form/base-with-vaildation/VBaseForm.vue'
import { useInputRules } from '~/modules/form-elements/composables/useInputRules'
definePageMeta({
  layout: 'auth-layout'
})
const rules = useInputRules()

const formRef = ref<AppFormExpose | null>(null)
const formData = reactive({
  email: '',
  password: '',
  keepLoggedIn: false
})
const handleSubmit = async () => {
  const res = await formRef.value?.validate()
  if (!res?.valid) return formRef.value?.focusFirstInvalid(res?.firstInvalidEl || null)
  console.log('handleSubmit--->formData', formData)
}
</script>

<style></style>
```
