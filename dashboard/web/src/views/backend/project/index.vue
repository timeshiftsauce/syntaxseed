<template>
    <div class="default-main ba-table-box">
        <el-alert class="ba-table-alert" v-if="baTable.table.remark" :title="baTable.table.remark" type="info" show-icon />

        <!-- 表格顶部菜单 -->
        <!-- 自定义按钮请使用插槽，甚至公共搜索也可以使用具名插槽渲染，参见文档 -->
        <TableHeader
            :buttons="['refresh', 'add', 'edit', 'delete', 'comSearch', 'quickSearch', 'columnDisplay']"
            :quick-search-placeholder="t('Quick search placeholder', { fields: t('project.quick Search Fields') })"
        ></TableHeader>

        <!-- 表格 -->
        <!-- 表格列有多种自定义渲染方式，比如自定义组件、具名插槽等，参见文档 -->
        <!-- 要使用 el-table 组件原有的属性，直接加在 Table 标签上即可 -->
        <Table ref="tableRef"></Table>

        <!-- 表单 -->
        <PopupForm />
    </div>
</template>

<script setup lang="ts">
import { onMounted, provide, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import PopupForm from './popupForm.vue'
import { baTableApi } from '/@/api/common'
import { defaultOptButtons } from '/@/components/table'
import TableHeader from '/@/components/table/header/index.vue'
import Table from '/@/components/table/index.vue'
import baTableClass from '/@/utils/baTable'

defineOptions({
    name: 'project',
})

const { t } = useI18n()
const tableRef = useTemplateRef('tableRef')
const optButtons: OptButton[] = defaultOptButtons(['weigh-sort', 'edit', 'delete'])

/**
 * baTable 内包含了表格的所有数据且数据具备响应性，然后通过 provide 注入给了后代组件
 */
const baTable = new baTableClass(
    new baTableApi('/admin/Project/'),
    {
        pk: 'id',
        column: [
            { type: 'selection', align: 'center', operator: false },
            { label: t('project.weigh'), prop: 'weigh', align: 'center', operator: 'RANGE', sortable: 'custom' },
            { label: t('project.id'), prop: 'id', align: 'center', width: 180, operator: 'RANGE', sortable: 'custom' },
            { label: t('project.title'), prop: 'title', align: 'center', operatorPlaceholder: t('Fuzzy query'), operator: 'LIKE', sortable: false },
            { label: t('project.images'), prop: 'images', align: 'center', render: 'images', operator: false },
            {
                label: t('project.category'),
                prop: 'category',
                align: 'center',
                operatorPlaceholder: t('Fuzzy query'),
                render: 'tag',
                operator: 'LIKE',
                sortable: false,
                replaceValue: {},
            },
            {
                label: t('project.checkbox'),
                prop: 'checkbox',
                align: 'center',
                render: 'tags',
                operator: 'FIND_IN_SET',
                sortable: false,
                replaceValue: {
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
            },
            {
                label: t('project.demoUrl'),
                prop: 'demoUrl',
                align: 'center',
                operatorPlaceholder: t('Fuzzy query'),
                render: 'url',
                operator: 'LIKE',
                sortable: false,
            },
            {
                label: t('project.codeUrl'),
                prop: 'codeUrl',
                align: 'center',
                operatorPlaceholder: t('Fuzzy query'),
                render: 'url',
                operator: 'LIKE',
                sortable: false,
            },
            { label: t('Operate'), align: 'center', width: 140, render: 'buttons', buttons: optButtons, operator: false },
        ],
        dblClickNotEditColumn: [undefined],
        defaultOrder: { prop: 'weigh', order: 'desc' },
    },
    {
        defaultItems: { category: '全栈应用', features: [], techStack: [] },
    }
)

provide('baTable', baTable)

onMounted(() => {
    baTable.table.ref = tableRef.value
    baTable.mount()
    baTable.getData()?.then(() => {
        baTable.initSort()
        baTable.dragSort()
    })
})
</script>

<style scoped lang="scss"></style>
