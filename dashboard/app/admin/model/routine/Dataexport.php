<?php

namespace app\admin\model\routine;

use think\Model;
use think\model\relation\BelongsTo;
use modules\dataexport\library\ExportLib;

/**
 * Dataexport
 */
class Dataexport extends Model
{
    // 表名
    protected $name = 'dataexport';

    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    protected $createTime = 'createtime';
    protected $updateTime = false;

    protected $type = [
        'lastexporttime' => 'timestamp:Y-m-d H:i:s',
        'join_table'     => 'array',
        'field_config'   => 'array',
        'order_field'    => 'array',
        'subtask'        => 'array',
    ];

    public function getWhereFieldAttr($value)
    {
        // 存量任务信息的操作符号转换
        $whereField = json_decode($value, true);
        if ($whereField) {
            foreach ($whereField as &$item) {
                if ($item['operator']) {
                    $item['operator'] = ExportLib::getAliasByOperator($item['operator']);
                } else {
                    unset($item);
                }
            }
        }
        return $whereField;
    }

    public function setWhereFieldAttr($value): string
    {
        return json_encode($value);
    }

    public function admin(): BelongsTo
    {
        return $this->belongsTo(\app\admin\model\Admin::class, 'admin_id', 'id');
    }
}