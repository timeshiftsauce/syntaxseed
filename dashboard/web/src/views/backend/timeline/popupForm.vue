<template>
    <!-- 对话框表单 -->
    <!-- 建议使用 Prettier 格式化代码 -->
    <!-- el-form 内可以混用 el-form-item、FormItem、ba-input 等输入组件 -->
    <el-dialog
        class="ba-operate-dialog"
        :close-on-click-modal="false"
        :model-value="['Add', 'Edit'].includes(baTable.form.operate!)"
        @close="baTable.toggleForm"
        width="50%"
    >
        <template #header>
            <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']" v-zoom="'.ba-operate-dialog'">
                {{ baTable.form.operate ? t(baTable.form.operate) : '' }}
            </div>
        </template>
        <el-scrollbar v-loading="baTable.form.loading" class="ba-table-form-scrollbar">
            <div
                class="ba-operate-form"
                :class="'ba-' + baTable.form.operate + '-form'"
                :style="config.layout.shrink ? '' : 'width: calc(100% - ' + baTable.form.labelWidth! / 2 + 'px)'"
            >
                <el-form
                    v-if="!baTable.form.loading"
                    ref="formRef"
                    @submit.prevent=""
                    @keyup.enter="baTable.onSubmit(formRef)"
                    :model="baTable.form.items"
                    :label-position="config.layout.shrink ? 'top' : 'right'"
                    :label-width="baTable.form.labelWidth + 'px'"
                    :rules="rules"
                >
                    <FormItem
                        :label="t('timeline.year')"
                        type="year"
                        v-model="baTable.form.items!.year"
                        prop="year"
                        :placeholder="t('Please select field', { field: t('timeline.year') })"
                    />
                    <FormItem
                        :label="t('timeline.title')"
                        type="string"
                        v-model="baTable.form.items!.title"
                        prop="title"
                        :placeholder="t('Please input field', { field: t('timeline.title') })"
                    />
                    <FormItem
                        :label="t('timeline.data')"
                        type="string"
                        v-model="baTable.form.items!.data"
                        prop="data"
                        :placeholder="t('Please input field', { field: t('timeline.data') })"
                    />
                    <FormItem
                        :label="t('timeline.description')"
                        type="string"
                        v-model="baTable.form.items!.description"
                        prop="description"
                        :placeholder="t('Please input field', { field: t('timeline.description') })"
                    />
                    <FormItem
                        :label="t('timeline.technolog')"
                        type="array"
                        v-model="baTable.form.items!.technolog"
                        prop="technolog"
                        :placeholder="t('Please input field', { field: t('timeline.technolog') })"
                    />
                    <FormItem
                        :label="t('timeline.skills')"
                        type="array"
                        v-model="baTable.form.items!.skills"
                        prop="skills"
                        :placeholder="t('Please input field', { field: t('timeline.skills') })"
                    />
                    <FormItem :label="t('timeline.image')" type="image" v-model="baTable.form.items!.image" prop="image" />
                    <FormItem
                        :label="t('timeline.string')"
                        type="string"
                        v-model="baTable.form.items!.string"
                        prop="string"
                        :placeholder="t('Please input field', { field: t('timeline.string') })"
                    />
                </el-form>
            </div>
        </el-scrollbar>
        <template #footer>
            <div :style="'width: calc(100% - ' + baTable.form.labelWidth! / 1.8 + 'px)'">
                <el-button @click="baTable.toggleForm()">{{ t('Cancel') }}</el-button>
                <el-button v-blur :loading="baTable.form.submitLoading" @click="baTable.onSubmit(formRef)" type="primary">
                    {{ baTable.form.operateIds && baTable.form.operateIds.length > 1 ? t('Save and edit next item') : t('Save') }}
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import type { FormItemRule } from 'element-plus'
import { inject, reactive, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import FormItem from '/@/components/formItem/index.vue'
import { useConfig } from '/@/stores/config'
import type baTableClass from '/@/utils/baTable'
import { buildValidatorData } from '/@/utils/validate'

const config = useConfig()
const formRef = useTemplateRef('formRef')
const baTable = inject('baTable') as baTableClass

const { t } = useI18n()

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
    update_time: [buildValidatorData({ name: 'date', title: t('timeline.update_time') })],
    create_time: [buildValidatorData({ name: 'date', title: t('timeline.create_time') })],
    year: [buildValidatorData({ name: 'date', title: t('timeline.year') })],
    string: [buildValidatorData({ name: 'url', title: t('timeline.string') })],
})
</script>

<style scoped lang="scss"></style>
