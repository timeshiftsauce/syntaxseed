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
                        :label="t('blog.user.status')"
                        type="switch"
                        v-model="baTable.form.items!.status"
                        prop="status"
                        :input-attr="{ content: { '0': t('blog.user.status 0'), '1': t('blog.user.status 1') } }"
                    />
                    <FormItem
                        :label="t('blog.user.name')"
                        type="string"
                        v-model="baTable.form.items!.name"
                        prop="name"
                        :placeholder="t('Please input field', { field: t('blog.user.name') })"
                    />
                    <FormItem
                        :label="t('blog.user.password')"
                        type="password"
                        v-model="baTable.form.items!.password"
                        prop="password"
                        :placeholder="t('Please input field', { field: t('blog.user.password') })"
                    />
                    <FormItem
                        :label="t('blog.user.phone')"
                        type="string"
                        v-model="baTable.form.items!.phone"
                        prop="phone"
                        :placeholder="t('Please input field', { field: t('blog.user.phone') })"
                    />
                    <FormItem
                        :label="t('blog.user.email')"
                        type="string"
                        v-model="baTable.form.items!.email"
                        prop="email"
                        :placeholder="t('Please input field', { field: t('blog.user.email') })"
                    />
                    <FormItem :label="t('blog.user.avator')" type="image" v-model="baTable.form.items!.avator" prop="avator" />
                    <FormItem
                        :label="t('blog.user.regist_time')"
                        type="datetime"
                        v-model="baTable.form.items!.regist_time"
                        prop="regist_time"
                        :placeholder="t('Please select field', { field: t('blog.user.regist_time') })"
                    />
                    <FormItem
                        :label="t('blog.user.last_login')"
                        type="datetime"
                        v-model="baTable.form.items!.last_login"
                        prop="last_login"
                        :placeholder="t('Please select field', { field: t('blog.user.last_login') })"
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
    name: [buildValidatorData({ name: 'required', title: t('blog.user.name') })],
    password: [
        buildValidatorData({ name: 'password', title: t('blog.user.password') }),
        buildValidatorData({ name: 'required', title: t('blog.user.password') }),
    ],
    phone: [buildValidatorData({ name: 'mobile', title: t('blog.user.phone') })],
    email: [buildValidatorData({ name: 'email', title: t('blog.user.email') })],
    regist_time: [buildValidatorData({ name: 'date', title: t('blog.user.regist_time') })],
    last_login: [buildValidatorData({ name: 'date', title: t('blog.user.last_login') })],
})
</script>

<style scoped lang="scss"></style>
