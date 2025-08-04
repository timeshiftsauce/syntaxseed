<?php

namespace app\admin\model;

use think\Model;

/**
 * Project
 */
class Project extends Model
{
    // 表名
    protected $name = 'project';

    // 自动写入时间戳字段
    protected $autoWriteTimestamp = false;

    // 字段类型转换
    protected $type = [
        'features'  => 'json',
        'techStack' => 'json',
    ];

    protected static function onBeforeInsert($model): void
    {
        $pk         = $model->getPk();
        $model->$pk = \app\common\library\SnowFlake::generateParticle();
    }

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

    public function getIdAttr($value): string
    {
        return (string)$value;
    }

    public function getImagesAttr($value): array
    {
        if ($value === '' || $value === null) return [];
        if (!is_array($value)) {
            return explode(',', $value);
        }
        return $value;
    }

    public function setImagesAttr($value): string
    {
        return is_array($value) ? implode(',', $value) : $value;
    }

    public function getCheckboxAttr($value): array
    {
        if ($value === '' || $value === null) return [];
        if (!is_array($value)) {
            return explode(',', $value);
        }
        return $value;
    }

    public function setCheckboxAttr($value): string
    {
        return is_array($value) ? implode(',', $value) : $value;
    }

    public function getFeaturesAttr($value): array
    {
        return !$value ? [] : json_decode($value, true);
    }

    public function getTechStackAttr($value): array
    {
        return !$value ? [] : json_decode($value, true);
    }
}