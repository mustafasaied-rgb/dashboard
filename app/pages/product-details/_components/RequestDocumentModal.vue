<template>
  <BaseModal
    :open="open"
    @update:open="$emit('update:open', $event)"
    containerClass="w-full !h-auto  text-black lg:max-w-[500px] 3xl:!max-w-[639px] "
    headerClass="lg:px-[40px] px-[27px]"
    bodyClass=""
    footerClass="lg:px-[40px] px-[27px]"
    form-mode
    :showOutsideCloseBtn="false"
    :onConfirm="submit"
  >
    <template #header>
      <h3 :class="['text-[30px] font-[300] leading-[100%] lg:max-w-[312px] rtl:lg:max-w-[350px]']">
        {{ $t('leave_your_contacts_to_receive_all_the_files_on_the_project') }}
      </h3>
    </template>
    <div
      class="h-[70vh] max-h-[500px] overflow-y-auto px-[27px] pt-[19px] lg:h-fit lg:max-h-[80vh] lg:px-[40px] lg:pt-[32px]"
    >
      <div class="grid grid-cols-1 gap-x-[16px] gap-y-[12px] lg:grid-cols-2 lg:gap-y-[17px]">
        <CfBaseInput
          size="xl"
          id="email"
          v-model="formData.email"
          :label="$t('email')"
          type="email"
          required
          labelPlacement="inside"
          placeholder="you@example.com"
        />
        <CfBaseInput
          size="xl"
          id="phone"
          v-model="formData.phone"
          :label="$t('phone')"
          type="tel"
          inputmode="numeric"
          maxlength="20"
          pattern="^\+?[0-9]{1,20}$"
          title="Digits only, optionally starting with +. Up to 20 digits."
          required
          labelPlacement="inside"
        />
        <CfBaseInput
          size="xl"
          id="name"
          v-model="formData.name"
          :label="$t('name')"
          required
          type="text"
          labelPlacement="inside"
        />
        <CfBaseInput
          size="xl"
          id="positionInCompany"
          v-model="formData.positionInCompany"
          :label="$t('position_in_the_company')"
          required
          type="text"
          labelPlacement="inside"
        />
        <CfBaseInput
          size="xl"
          class="lg:col-span-2"
          required
          id="CompanyName"
          v-model="formData.companyName"
          :label="$t('company_name')"
          type="text"
          labelPlacement="inside"
        />
      </div>
      <div
        class="mb-[22.1px] mt-[24.5px] flex flex-col items-center gap-[16.32px] lg:mb-[25px] lg:mt-[38px] lg:gap-[17px]"
      >
        <button
          type="submit"
          :disabled="!canSubmit"
          :class="[
            'w-full max-w-[275px] rounded-3xl bg-[#0D1667] pb-[18.3px] pt-[17.2px] text-center text-[30px] font-[300] leading-[105%] tracking-[0.3px] text-white lg:pb-[19px] lg:pt-[18px]',
            'disabled:bg-[#DADADA]'
          ]"
        >
          {{ $t('get_the_files') }} {{ isLoading ? '...' : '' }}
        </button>
        <p class="text-center text-[16px] font-[300] leading-[18px] text-[#64696D]">
          {{ $t('by_submitting_your_data_you_agree') }}
          <br />
          {{ $t('to_the') }}
          <NuxtLink :to="`/${privacyPolicyPage?.slug}`" class="inline text-[#0D1667] no-underline">
            {{ privacyPolicyPage?.[`title_${locale}`] }}
          </NuxtLink>
          &
          <NuxtLink
            :to="`/${termsAndConditionsPage?.slug}`"
            class="inline text-[#0D1667] no-underline"
          >
            {{ termsAndConditionsPage?.[`title_${locale}`] }}
          </NuxtLink>
        </p>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
const props = defineProps({
  open: { type: Boolean },
  itemId: { type: [String, Number] }
})
const emits = defineEmits(['update:open'])
const { locale } = useI18n()
const { $toast } = useNuxtApp()
const { getPage } = usePages()
const privacyPolicyPage = getPage('privacy-policy')
const termsAndConditionsPage = getPage('terms-and-conditions')

type FormData = {
  email: string
  phone: string
  name: string
  positionInCompany: string
  companyName: string
}
const formData = reactive<FormData>({
  email: '',
  phone: '',
  name: '',
  positionInCompany: '',
  companyName: ''
})
const isLoading = ref(false)

const canSubmit = computed(() =>
  (Object.keys(formData) as (keyof FormData)[]).every((k) => !!formData[k])
)
const resetFormData = () =>
  (Object.keys(formData) as (keyof FormData)[]).forEach((k) => (formData[k] = ''))
const { apiFetch } = useApi()
async function submit() {
  if (isLoading.value) return
  isLoading.value = true

  const payload = {
    item_id: props?.itemId,
    full_name: formData?.name,
    email: formData?.email,
    phone: formData?.phone,
    position: formData?.positionInCompany,
    company_name: formData?.companyName
  }

  try {
    const response = await apiFetch('/website/home/request-files', {
      method: 'POST',
      body: payload
    })
    $toast.success(response?.message, { duration: 4000 })
    emits('update:open', false)
    resetFormData()
  } catch (err) {
    console.error(err)
    useHandleErrorMsg(err)
  } finally {
    isLoading.value = false
  }
}
watch(
  () => props.open,
  (val) => {
    val && resetFormData()
  }
)
</script>
