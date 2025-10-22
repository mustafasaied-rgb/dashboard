<template>
  <div class="space-y-5 sm:space-y-6">
    <PageBreadcrumb :pageTitle="t('formElements.pageTitle')" />
    <div>
      <BaseForm ref="formRef" @submit.prevent="handleSubmit">
        <div class="space-y-5">
          <BaseInput
            required
            v-model="formData.email"
            :label="t('formElements.emailLable')"
            :placeholder="'info@mail.com'"
            :rules="[rules.required, rules.email]"
          />
          <!-- Password -->
          <BaseInput
            required
            v-model="formData.password"
            :label="t('formElements.passwordLabel')"
            type="password"
            revealable
            :placeholder="t('formElements.passwordPlaceholder')"
            :rules="[rules.required]"
          />
          <BaseSelect
            name="companySize"
            required
            v-model="formData.companySize"
            :label="t('formElements.companySizeLabel')"
            :placeholder="t('formElements.companySizePlaceholder')"
            :options="[
              { label: '1–10', value: '1-10' },
              { label: '11–50', value: '11-50' },
              { label: '51–200', value: '51-200' },
              { label: '200+', value: '200+' }
            ]"
            :rules="[rules.required]"
          />
          <BaseCombobox
            name="skills"
            v-model="formData.skills"
            :label="t('formElements.skillsLabel')"
            :placeholder="t('formElements.skillsPlaceholder')"
            :options="skills"
            required
            :rules="[rules.required]"
          />
          <BaseFileInput
            required
            name="attachments"
            v-model="formData.attachments"
            :label="t('formElements.attachmentsLabel')"
            :placeholder="t('formElements.attachmentsPlaceholder')"
            multiple
            :rules="[rules.required, rules.maxFiles(3), rules.maxFileSize(10)]"
          />
          <BaseRadioGroup
            name="notify"
            v-model="formData.notify"
            :label="t('formElements.notificationsLabel')"
            :rules="[rules.required]"
          >
            <template #default="{ nameProp, modelValue, onChange, onBlur }">
              <BaseRadio
                :name="nameProp"
                :modelValue="modelValue"
                :value="true"
                :label="t('formElements.enabled')"
                @update:modelValue="onChange"
                @blur="onBlur"
              />
              <BaseRadio
                :name="nameProp"
                :modelValue="modelValue"
                :value="false"
                :label="t('formElements.disabled')"
                @update:modelValue="onChange"
                @blur="onBlur"
              />
            </template>
          </BaseRadioGroup>
          <BaseCopyInput v-model="formData.CopyText" :label="t('formElements.copyTextLabel')" />
          <BasePhoneInput v-model="formData.phone" :label="t('formElements.phone')" />
          <BaseDatePicker
            name="startDate"
            v-model="formData.startDate"
            :label="t('formElements.startDateLabel')"
            :placeholder="t('formElements.startDatePlaceholder')"
            required
            :rules="[rules.required]"
            :config="{ minDate: 'today' }"
          />

          <!-- End Date -->
          <BaseDatePicker
            name="endDate"
            v-model="formData.endDate"
            :label="t('formElements.endDateLabel')"
            :placeholder="t('formElements.endDatePlaceholder')"
            :rules="[
              rules.required,
              (v: string | number | Date) =>
                new Date(v) > new Date(formData.startDate) || t('validation.endDateAfterStart')
            ]"
          />

          <!-- Time Picker -->
          <BaseTimePicker
            name="meetingTime"
            v-model="formData.meetingTime"
            :label="t('formElements.meetingTimeLabel')"
            :placeholder="t('formElements.meetingTimePlaceholder')"
            :rules="[rules.required]"
            :config="{ time_24hr: false }"
          />

          <!-- Date Range Picker -->
          <BaseDatePicker
            name="range"
            v-model="formData.range"
            :label="t('formElements.dateRangeLabel')"
            :placeholder="t('formElements.dateRangePlaceholder')"
            mode="range"
            :rules="[rules.required]"
          />
          <BaseTextarea
            name="notes"
            v-model="formData.notes"
            :label="t('formElements.notesLabel')"
            :placeholder="t('formElements.notesPlaceholder')"
            :rows="5"
            :rules="[rules.required, rules.minLength(10)]"
          />
          <ClientOnly>
            <BaseDropzone
              name="photos"
              v-model="formData.photos"
              :label="t('formElements.eventPhotosLabel')"
              :rules="[rules.required, rules.maxFiles(5)]"
              :maxFiles="5"
              accept="image/*"
              :placeholder="t('formElements.dropzonePlaceholder')"
              :hint="t('formElements.dropzoneHint')"
            />
          </ClientOnly>
          <!-- Checkbox -->
          <div class="flex items-center justify-between">
            <BaseCheckbox v-model="formData.keepLoggedIn" :label="t('formElements.keepMeLoggedIn')" />

            <NuxtLink
              to="/reset-password"
              class="text-brand-500 hover:text-brand-600 dark:text-brand-400 text-sm"
            >
              {{ t('formElements.forgotPassword') }}
            </NuxtLink>
          </div>
          <!-- Button -->
          <div>
            <Button
              type="submit"
              color="primary"
              class="bg-brand-500 shadow-theme-xs hover:bg-brand-600 flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-medium text-white transition"
            >
              {{ t('common.signIn') }}
            </Button>
          </div>
        </div>
      </BaseForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseDropzone from '~/modules/form-elements/components/base/with-vaildation-wrapper/BaseDropzone.vue'
import type { AppFormExpose } from '~/modules/form-elements/components/base/with-vaildation-wrapper/BaseForm.vue'
import { useInputRules } from '~/modules/form-elements/composables/useInputRules'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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
