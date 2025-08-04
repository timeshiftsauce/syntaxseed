<?php

namespace app\admin\model;

use think\Model;

/**
 * Timelines
 */
class Timelines extends Model
{
    // 表名
    protected $name = 'timelines';

    // 自动写入时间戳字段
    protected $autoWriteTimestamp = true;

    // 字段类型转换
    protected $type = [
        'technolog' => 'json',
        'skills'    => 'json',
    ];

    protected static function onBeforeInsert($model): void
    {
        $pk         = $model->getPk();
        $model->$pk = \app\common\library\SnowFlake::generateParticle();
    }

    public function getIdAttr($value): string
    {
        return (string)$value;
    }

    public function getTechnologAttr($value): array
    {
        return !$value ? [] : json_decode($value, true);
    }

    public function getSkillsAttr($value): array
    {
        return !$value ? [] : json_decode($value, true);
    }
}