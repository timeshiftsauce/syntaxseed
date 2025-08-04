<?php

namespace app\admin\model\tech;

use think\Model;

/**
 * Stack
 */
class Stack extends Model
{
    // 表名
    protected $name = 'tech_stack';

    // 自动写入时间戳字段
    protected $autoWriteTimestamp = true;
    protected $updateTime = false;

}