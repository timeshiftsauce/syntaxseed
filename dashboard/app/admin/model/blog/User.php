<?php

namespace app\admin\model\blog;

use think\Model;

/**
 * User
 */
class User extends Model
{
    // 表名
    protected $name = 'blog_user';

    // 自动写入时间戳字段
    protected $autoWriteTimestamp = false;

    // 字段类型转换
    protected $type = [
        'last_login' => 'timestamp:Y-m-d H:i:s',
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
}