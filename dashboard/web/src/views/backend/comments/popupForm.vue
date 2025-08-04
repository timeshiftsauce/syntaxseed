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
                        :label="t('comments.blog_id')"
                        type="remoteSelect"
                        v-model="baTable.form.items!.blog_id"
                        prop="blog_id"
                        :input-attr="{ pk: 'blogdetail.id', field: 'title', remoteUrl: '/admin/Blogdetail/index' }"
                        :placeholder="t('Please select field', { field: t('comments.blog_id') })"
                    />
                    <FormItem
                        :label="t('comments.author')"
                        type="string"
                        v-model="baTable.form.items!.author"
                        prop="author"
                        :placeholder="t('Please input field', { field: t('comments.author') })"
                    />
                    <FormItem
                        :label="t('comments.content')"
                        type="editor"
                        v-model="baTable.form.items!.content"
                        prop="content"
                        @keyup.enter.stop=""
                        @keyup.ctrl.enter="baTable.onSubmit(formRef)"
                        :placeholder="t('Please input field', { field: t('comments.content') })"
                    />
                    <FormItem :label="t('comments.avatar')" type="image" v-model="baTable.form.items!.avatar" prop="avatar" />
                    <FormItem
                        :label="t('comments.website')"
                        type="string"
                        v-model="baTable.form.items!.website"
                        prop="website"
                        :placeholder="t('Please input field', { field: t('comments.website') })"
                    />
                    <FormItem
                        :label="t('comments.email')"
                        type="string"
                        v-model="baTable.form.items!.email"
                        prop="email"
                        :placeholder="t('Please input field', { field: t('comments.email') })"
                    />
                    <FormItem
                        :label="t('comments.parent_id')"
                        type="remoteSelect"
                        v-model="baTable.form.items!.parent_id"
                        prop="parent_id"
                        :input-attr="{ pk: 'comments.id', field: 'id', remoteUrl: '/admin/Comments/index' }"
                        :placeholder="t('Please select field', { field: t('comments.parent_id') })"
                    />
                    <FormItem
                        :label="t('comments.status')"
                        type="switch"
                        v-model="baTable.form.items!.status"
                        prop="status"
                        :input-attr="{ content: { '0': t('comments.status 0'), '1': t('comments.status 1') } }"
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
    content: [buildValidatorData({ name: 'editorRequired', title: t('comments.content') })],
    create_time: [buildValidatorData({ name: 'date', title: t('comments.create_time') })],
    update_time: [buildValidatorData({ name: 'date', title: t('comments.update_time') })],
})
</script>

<style scoped lang="scss"></style>
