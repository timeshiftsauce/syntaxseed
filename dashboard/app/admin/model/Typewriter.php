<?php

namespace app\admin\model;

use think\Model;

/**
 * Typewriter
 */
class Typewriter extends Model
{
    // 表名
    protected $name = 'typewriter';

    // 自动写入时间戳字段
    protected $autoWriteTimestamp = true;

}