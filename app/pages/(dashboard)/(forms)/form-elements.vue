<template>
  <div class="space-y-5 sm:space-y-6">
    <PageBreadcrumb pageTitle="Form Elements" />
    <div class="space-y-6">
      <ComponentCard title="Base" class="space-y-6">
        <ComponentCard collapsible title="BaseInput" class="space-y-6">
          <ComponentCard title="Text input">
            <BaseInput v-model="formData.input" label="Input" />
          </ComponentCard>
          <ComponentCard title="Input with placeholder" class="space-y-6">
            <BaseInput
              v-model="formData.inputWithPlaceholder"
              label="Input with Placeholder"
              placeholder="info@gmail.com"
            />
            <BaseInput
              v-model="formData.inputWithPlaceholder"
              label="Input with Placeholder"
              placeholder="info@gmail.com"
              disabled
            />
          </ComponentCard>
          <ComponentCard title="Password with reveal toggle">
            <BaseInput
              v-model="formData.password"
              label="Password Input"
              type="password"
              revealable
              placeholder="Enter your password"
            />
          </ComponentCard>
          <ComponentCard title="Input with icon section at start (with left border block)">
            <BaseInput
              v-model="formData.cardNumber"
              label="Input with Payment"
              placeholder="Card number"
              size="sm"
              isBordered
            >
              <template #start>
                <!-- your card brand SVG -->
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="6.25" cy="10" r="5.625" fill="#E80B26" />
                  <circle cx="13.75" cy="10" r="5.625" fill="#F59D31" />
                  <path
                    d="M10 14.1924C11.1508 13.1625 11.875 11.6657 11.875 9.99979C11.875 8.33383 11.1508 6.8371 10 5.80713C8.84918 6.8371 8.125 8.33383 8.125 9.99979C8.125 11.6657 8.84918 13.1625 10 14.1924Z"
                    fill="#FC6020"
                  />
                </svg>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="6.25" cy="10" r="5.625" fill="#E80B26" />
                  <circle cx="13.75" cy="10" r="5.625" fill="#F59D31" />
                  <path
                    d="M10 14.1924C11.1508 13.1625 11.875 11.6657 11.875 9.99979C11.875 8.33383 11.1508 6.8371 10 5.80713C8.84918 6.8371 8.125 8.33383 8.125 9.99979C8.125 11.6657 8.84918 13.1625 10 14.1924Z"
                    fill="#FC6020"
                  />
                </svg>
              </template>
            </BaseInput>
          </ComponentCard>
          <ComponentCard title="Success state with end icon + helper">
            <BaseInput
              v-model="formData.successEmail"
              label="Email"
              status="success"
              message="This is a success message."
              isBordered
            >
              <template #end>
                <!-- check icon -->
                <SuccessStateIcon />
                <SuccessStateIcon />
                <SuccessStateIcon />
              </template>
            </BaseInput>
          </ComponentCard>
          <ComponentCard title="Success state with end icon + helper">
            <BaseInput
              v-model="formData.errorEmail"
              label="Email"
              status="error"
              message="This is an error message."
            >
              <template #end>
                <!-- error icon -->
                <ErrorStateIcon />
              </template>
            </BaseInput>
          </ComponentCard>
        </ComponentCard>
        <ComponentCard collapsible title="BaseTextarea" class="space-y-6">
          <BaseTextarea
            v-model="formData.normalDescription"
            label="Description"
            placeholder="Enter a description..."
          />

          <!-- Disabled Textarea -->
          <BaseTextarea
            v-model="formData.disabledDescription"
            label="Description"
            :disabled="true"
          />

          <!-- Error State Textarea -->
          <BaseTextarea
            v-model="formData.errorDescription"
            label="Description"
            status="error"
            message="Please enter a message in the textarea."
          />
        </ComponentCard>
        <ComponentCard collapsible title="BaseSelect" class="space-y-6">
          <BaseSelect
            v-model="formData.singleSelect"
            label="Select Input"
            placeholder="Select Option"
            :options="[
              { label: 'Marketing', value: 'marketing' },
              { label: 'Template', value: 'template' },
              { label: 'Development', value: 'development' }
            ]"
          />

          <BaseSelect
            v-model="formData.disabledSelect"
            label="Disabled Select"
            :disabled="true"
            :options="[
              { label: 'Marketing', value: 'marketing' },
              { label: 'Template', value: 'template' },
              { label: 'Development', value: 'development' }
            ]"
          />

          <BaseSelect
            v-model="formData.errorSelect"
            label="Error State"
            status="error"
            message="Please select an option."
            :options="[
              { label: 'Marketing', value: { marketing: 55555 } },
              { label: 'Template', value: 'template' },
              { label: 'Development', value: 'development' }
            ]"
          />
        </ComponentCard>
        <ComponentCard collapsible title="BaseCheckbox" class="flex flex-wrap items-center gap-8">
          <!-- Default -->
          <BaseCheckbox indeterminate v-model="formData.checkboxOne" />
          <!-- Checked -->
          <BaseCheckbox v-model="formData.checkboxTwo" label="Checked" />
          <!-- Disabled -->
          <BaseCheckbox v-model="formData.checkboxThree" label="Disabled" :disabled="true" />
        </ComponentCard>
        <ComponentCard collapsible title="BaseCheckbox" class="flex flex-wrap items-center gap-8">
          <BaseRadio v-model="formData.choice" name="demo" value="default"> Default </BaseRadio>

          <BaseRadio v-model="formData.choice" name="demo" value="secondary"> Secondary </BaseRadio>

          <BaseRadio
            v-model="formData.choice"
            name="demo"
            value="disabled-secondary"
            :disabled="true"
          >
            Disabled Secondary
          </BaseRadio>
        </ComponentCard>
        <ComponentCard collapsible title="BaseSwitch" class="space-y-6">
          <div class="mb-6 flex flex-wrap items-center gap-6 sm:gap-8">
            <BaseSwitch v-model="formData.s1">Default</BaseSwitch>
            <BaseSwitch v-model="formData.s2">Checked</BaseSwitch>
            <BaseSwitch v-model="formData.s3" :disabled="true">Disabled</BaseSwitch>
          </div>

          <div class="flex flex-wrap items-center gap-6 sm:gap-8">
            <BaseSwitch size="sm" v-model="formData.s4">Default</BaseSwitch>
            <BaseSwitch size="sm" v-model="formData.s5">Checked</BaseSwitch>
            <BaseSwitch size="sm" v-model="formData.s6" :disabled="true">Disabled</BaseSwitch>
            <BaseSwitch v-model="formData.s7">
              <template #thumb>
                <svg class="m-1 h-3 w-3 text-gray-600" viewBox="0 0 12 12" fill="currentColor">
                  <circle cx="6" cy="6" r="6" />
                </svg>
              </template>
              With icon
            </BaseSwitch>
          </div>
        </ComponentCard>
        <ComponentCard collapsible title="BaseDatePicker" class="space-y-6">
          <BaseDatePicker
            v-model="formData.date"
            label="Date Picker Input"
            placeholder="Select date"
            status="default"
            :config="{ minDate: 'today' }"
          />
          <BaseDatePicker
            v-model="formData.range"
            label="Date Picker Input Range"
            placeholder="Select Range date"
            status="default"
            mode="range"
            :config="{ minDate: 'today' }"
          />
          <BaseTimePicker
            v-model="formData.time"
            label="Time Select Input"
            placeholder="Select time"
            status="default"
            :config="{ minuteIncrement: 5 }"
          />
        </ComponentCard>
        <ComponentCard collapsible title="BaseCombobox" class="space-y-6">
          <BaseCombobox
            v-model="formData.categories"
            label="multiple  - returnObject=false - Categories"
            placeholder="Select items..."
            :options="opts"
            size="md"
            variant="outlined"
          />
          <BaseCombobox
            v-model="formData.categoriesObj"
            returnObject
            label="multiple - returnObject=true - categoriesObj "
            placeholder="Select items..."
            :options="opts1"
            size="md"
            variant="outlined"
          />
          <BaseCombobox
            v-model="formData.categorie1"
            mode="single"
            label="single - returnObject=false - categorie1"
            placeholder="Select items..."
            :options="opts1"
            size="md"
            variant="outlined"
          />
          <BaseCombobox
            v-model="formData.categorie2"
            returnObject
            mode="single"
            label="single - returnObject=true - categorie2"
            placeholder="Select items..."
            :options="opts1"
            size="md"
            variant="outlined"
          />

          <!-- With custom chip -->
          <BaseCombobox
            v-model="formData.categories"
            label="With custom chip"
            :options="opts"
            class="mt-4"
          >
            <template #tag="{ option }">
              <span
                class="bg-brand-50 text-brand-700 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs"
              >
                {{ option.label }}
                <button
                  class="opacity-70 hover:opacity-100"
                  @click.stop="$emit('remove', option.value)"
                >
                  ✕
                </button>
              </span>
            </template>
          </BaseCombobox>
        </ComponentCard>
        <ComponentCard collapsible title="BaseCombobox" class="space-y-6">
          <BaseFileInput
            id="upload"
            label="Attachments"
            v-model="formData.files"
            placeholder="Select file(s)…"
            buttonLabel="Upload"
          />
        </ComponentCard>
        <ComponentCard collapsible defaultOpen title="BaseDropzone" class="space-y-6">
          <ClientOnly>
            <BaseDropzone
              v-model="formData.files"
              label="Upload images"
              accept="image/*,.svg"
              :multiple="true"
              :maxFiles="8"
              :maxSizeMB="32"
              @error="(e, file) => console.warn('invalid', file)"
              @added="(f) => console.log('added', f.name)"
              @removed="(f) => console.log('removed', f.name)"
            />
          </ClientOnly>
        </ComponentCard>
        <ComponentCard collapsible defaultOpen title="UploadFilesWithPreview" class="space-y-6">
          <ClientOnly>
            <UploadFilesWithPreview :disabled="false" :maxFiles="2" v-model="formData.images" />
          </ClientOnly>
        </ComponentCard>
      </ComponentCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseDropzone from '~/modules/form-elements/components/base/with-vaildation-wrapper/BaseDropzone.vue'

const opts = ['hello', 'template', 'development', 'development1']
const opts1 = [
  { label: 'Marketing', value: 'marketing' },
  { label: 'Template', value: 'template' },
  { label: 'Development', value: 'development' },
  { label: 'Development1', value: 'development1' },
  { label: 'Development2', value: 'development2' },
  { label: 'Development3', value: 'development3' },
  { label: 'Development4', value: 'development4' }
]

const formData = reactive({
  // categories: [opts[0]],
  // categoriesObj: [opts[0], opts[2], opts[3]]
  categorie1: null,
  categorie2: null
}) as any
watch(
  formData,
  (formData) => {
    console.log('formData', formData)
  },
  { deep: true, immediate: true }
)
</script>

<style></style>
