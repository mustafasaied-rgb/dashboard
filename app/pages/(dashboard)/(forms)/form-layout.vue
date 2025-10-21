 
<template>
  <div class="space-y-5 sm:space-y-6">
    <PageBreadcrumb pageTitle="Form Elements" />
    <div>
      <VBaseForm ref="formRef" @submit.prevent="handleSubmit">
        <div class="space-y-5">
          <VBaseInput
            required
            v-model="formData.email"
            label="Email"
            placeholder="info@gmail.com"
            :rules="[rules.required, rules.email]"
          />
          <!-- Password -->
          <VBaseInput
            required
            v-model="formData.password"
            label="Password"
            type="password"
            revealable
            placeholder="Enter your password"
            :rules="[rules.required]"
          />
          <VBaseSelect
            name="companySize"
            required
            v-model="formData.companySize"
            label="Company size"
            placeholder="—"
            :options="[
              { label: '1–10', value: '1-10' },
              { label: '11–50', value: '11-50' },
              { label: '51–200', value: '51-200' },
              { label: '200+', value: '200+' }
            ]"
            :rules="[rules.required]"
          />
          <VBaseCombobox
            name="skills"
            v-model="formData.skills"
            label="Skills"
            placeholder="Select skills"
            :options="skills"
            required
            :rules="[rules.required]"
          />
          <VBaseFileInput
            required
            name="attachments"
            v-model="formData.attachments"
            label="Attachments"
            placeholder="Attach supporting files"
            multiple
            :rules="[rules.required, rules.maxFiles(3), rules.maxFileSize(10)]"
          />
          <VBaseRadioGroup
            name="notify"
            v-model="formData.notify"
            label="Notifications"
            :rules="[rules.required]"
          >
            <template #default="{ nameProp, modelValue, onChange, onBlur }">
              <BaseRadio
                :name="nameProp"
                :modelValue="modelValue"
                :value="true"
                label="Enabled"
                @update:modelValue="onChange"
                @blur="onBlur"
              />
              <BaseRadio
                :name="nameProp"
                :modelValue="modelValue"
                :value="false"
                label="Disabled"
                @update:modelValue="onChange"
                @blur="onBlur"
              />
            </template>
          </VBaseRadioGroup>
          <BaseCopyInput v-model="formData.CopyText" label="CopyText" />
          <BasePhoneInput v-model="formData.phone" label="phone" />
          <VBaseDatePicker
            name="startDate"
            v-model="formData.startDate"
            label="Start Date"
            placeholder="Select start date"
            required
            :rules="[rules.required]"
            :config="{ minDate: 'today' }"
          />

          <!-- End Date -->
          <VBaseDatePicker
            name="endDate"
            v-model="formData.endDate"
            label="End Date"
            placeholder="Select end date"
            :rules="[
              rules.required,
              (v: string | number | Date) =>
                new Date(v) > new Date(formData.startDate) || 'End date must be after start date'
            ]"
          />

          <!-- Time Picker -->
          <VBaseTimePicker
            name="meetingTime"
            v-model="formData.meetingTime"
            label="Meeting Time"
            placeholder="Select time"
            :rules="[rules.required]"
            :config="{ time_24hr: false }"
          />

          <!-- Date Range Picker -->
          <VBaseDatePicker
            name="range"
            v-model="formData.range"
            label="Date Range"
            placeholder="Select date range"
            mode="range"
            :rules="[rules.required]"
          />
          <VBaseTextarea
            name="notes"
            v-model="formData.notes"
            label="Notes"
            placeholder="Add any notes"
            :rows="5"
            :rules="[rules.required, rules.minLength(10)]"
          />
          <ClientOnly>
            <VBaseDropzone
              name="photos"
              v-model="formData.photos"
              label="Event Photos"
              :rules="[rules.required, rules.maxFiles(5)]"
              :maxFiles="5"
              accept="image/*"
            />
          </ClientOnly>
          <!-- Checkbox -->
          <div class="flex items-center justify-between">
            <BaseCheckbox v-model="formData.keepLoggedIn" label="Keep me logged in" />

            <NuxtLink
              to="/reset-password"
              class="text-brand-500 hover:text-brand-600 dark:text-brand-400 text-sm"
            >
              Forgot password?
            </NuxtLink>
          </div>
          <!-- Button -->
          <div>
            <Button
              type="submit"
              color="primary"
              class="bg-brand-500 shadow-theme-xs hover:bg-brand-600 flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-medium text-white transition"
            >
              Sign In
            </Button>
          </div>
        </div>
      </VBaseForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AppFormExpose } from '~/components/ui/form/base-with-vaildation/VBaseForm.vue'
import { useInputRules } from '~/validation/useInputRules'

const skills = ['Vue', 'React', 'Angular', 'TypeScript', 'TailwindCSS']

const formRef = ref<AppFormExpose | null>(null)
const rules = useInputRules()
const formData = reactive({
  email: '',
  password: '',
  keepLoggedIn: false,
  CopyText: 'fsdsdffdsdfsdsffds'
}) as any
const handleSubmit = async () => {
  const res = await formRef.value?.validate()
  if (!res?.valid) return formRef.value?.focusFirstInvalid(res?.firstInvalidEl || null)
  console.log('handleSubmit--->formData', formData)
}
watch(
  formData,
  (formData) => {
    console.log('formData', formData)
  },
  { deep: true, immediate: true }
)
</script>

<style></style>

 
