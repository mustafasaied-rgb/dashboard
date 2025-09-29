import type { InjectionKey } from 'vue'
import { type FormCtx } from '~/modules/custom-form/components/AppForm.vue'

export const FKEY: InjectionKey<FormCtx> = Symbol('app-form')
