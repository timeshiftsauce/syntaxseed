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
                        :label="t('project.weigh')"
                        type="number"
                        v-model="baTable.form.items!.weigh"
                        prop="weigh"
                        :input-attr="{ step: 1 }"
                        :placeholder="t('Please input field', { field: t('project.weigh') })"
                    />
                    <FormItem
                        :label="t('project.title')"
                        type="string"
                        v-model="baTable.form.items!.title"
                        prop="title"
                        :placeholder="t('Please input field', { field: t('project.title') })"
                    />
                    <FormItem
                        :label="t('project.description')"
                        type="textarea"
                        v-model="baTable.form.items!.description"
                        prop="description"
                        :input-attr="{ rows: 3 }"
                        @keyup.enter.stop=""
                        @keyup.ctrl.enter="baTable.onSubmit(formRef)"
                        :placeholder="t('Please input field', { field: t('project.description') })"
                    />
                    <FormItem :label="t('project.images')" type="images" v-model="baTable.form.items!.images" prop="images" />
                    <FormItem
                        :label="t('project.category')"
                        type="string"
                        v-model="baTable.form.items!.category"
                        prop="category"
                        :placeholder="t('Please input field', { field: t('project.category') })"
                    />
                    <FormItem
                        :label="t('project.checkbox')"
                        type="checkbox"
                        v-model="baTable.form.items!.checkbox"
                        prop="checkbox"
                        :input-attr="{
                            content: {
                                opt0: t('project.checkbox opt0'),
                                opt1: t('project.checkbox opt1'),
                                opt2: t('project.checkbox opt2'),
                                opt3: t('project.checkbox opt3'),
                                opt4: t('project.checkbox opt4'),
                                opt5: t('project.checkbox opt5'),
                                opt6: t('project.checkbox opt6'),
                                opt7: t('project.checkbox opt7'),
                                opt8: t('project.checkbox opt8'),
                                opt9: t('project.checkbox opt9'),
                                opt10: t('project.checkbox opt10'),
                                opt11: t('project.checkbox opt11'),
                                opt12: t('project.checkbox opt12'),
                                opt13: t('project.checkbox opt13'),
                                opt14: t('project.checkbox opt14'),
                                opt15: t('project.checkbox opt15'),
                                opt16: t('project.checkbox opt16'),
                                opt17: t('project.checkbox opt17'),
                                opt18: t('project.checkbox opt18'),
                            },
                        }"
                        :placeholder="t('Please select field', { field: t('project.checkbox') })"
                    />
                    <FormItem
                        :label="t('project.features')"
                        type="array"
                        v-model="baTable.form.items!.features"
                        prop="features"
                        :placeholder="t('Please input field', { field: t('project.features') })"
                    />
                    <FormItem
                        :label="t('project.techStack')"
                        type="array"
                        v-model="baTable.form.items!.techStack"
                        prop="techStack"
                        :placeholder="t('Please input field', { field: t('project.techStack') })"
                    />
                    <FormItem
                        :label="t('project.demoUrl')"
                        type="string"
                        v-model="baTable.form.items!.demoUrl"
                        prop="demoUrl"
                        :placeholder="t('Please input field', { field: t('project.demoUrl') })"
                    />
                    <FormItem
                        :label="t('project.codeUrl')"
                        type="string"
                        v-model="baTable.form.items!.codeUrl"
                        prop="codeUrl"
                        :placeholder="t('Please input field', { field: t('project.codeUrl') })"
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
    title: [buildValidatorData({ name: 'required', title: t('project.title') })],
    description: [buildValidatorData({ name: 'required', title: t('project.description') })],
    images: [buildValidatorData({ name: 'required', title: t('project.images') })],
    category: [buildValidatorData({ name: 'required', title: t('project.category') })],
    codeUrl: [buildValidatorData({ name: 'url', title: t('project.codeUrl') })],
})
</script>

<style scoped lang="scss"></style>
