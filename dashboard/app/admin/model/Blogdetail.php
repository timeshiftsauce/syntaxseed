<?php

namespace app\admin\model;

use think\Model;

/**
 * Blogdetail
 */
class Blogdetail extends Model
{
    // 表名
    protected $name = 'blogdetail';

    // 自动写入时间戳字段
    protected $autoWriteTimestamp = true;
    protected $updateTime = false;

    // 字段类型转换
    protected $type = [
        'tags' => 'json',
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

    public function getContentAttr($value): string
    {
        return !$value ? '' : htmlspecialchars_decode($value);
    }

    public function getTagsAttr($value): array
    {
        return !$value ? [] : json_decode($value, true);
    }
}