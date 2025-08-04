<?php

namespace app\admin\model;

use think\Model;

/**
 * Comments
 */
class Comments extends Model
{
    // 表名
    protected $name = 'comments';

    // 自动写入时间戳字段
    protected $autoWriteTimestamp = true;


    public function getContentAttr($value): string
    {
        return !$value ? '' : htmlspecialchars_decode($value);
    }

    public function blog(): \think\model\relation\BelongsTo
    {
        return $this->belongsTo(\app\admin\model\Blogdetail::class, 'blog_id', 'id');
    }

    public function parent(): \think\model\relation\BelongsTo
    {
        return $this->belongsTo(\app\admin\model\Comments::class, 'parent_id', 'id');
    }
}