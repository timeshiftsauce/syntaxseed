<?php

namespace app\admin\model\test;

use think\Model;

/**
 * Build
 */
class Build extends Model
{
    // 表名
    protected $name = 'test_build';

    // 自动写入时间戳字段
    protected $autoWriteTimestamp = true;

    protected static function onAfterInsert($model): void
    {
        if (is_null($model->weigh)) {
            $pk = $model->getPk();
            if (strlen($model[$pk]) >= 19) {
                $model->where($pk, $model[$pk])->update(['weigh' => $model->count()]);
            } else {
                $model->where($pk, $model[$pk])->update(['weigh' => $model[$pk]]);
            }
        }
    }

    public function getContentAttr($value): string
    {
        return !$value ? '' : htmlspecialchars_decode($value);
    }
}