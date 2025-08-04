<?php

namespace app\admin\controller\tech;

use app\common\controller\Backend;

/**
 * 技术栈_技术云图
 */
class Stack extends Backend
{
    /**
     * Stack模型对象
     * @var object
     * @phpstan-var \app\admin\model\tech\Stack
     */
    protected object $model;

    protected array|string $preExcludeFields = ['id', 'create_time'];

    protected string|array $quickSearchField = ['id'];

    public function initialize(): void
    {
        parent::initialize();
        $this->model = new \app\admin\model\tech\Stack();
    }


    /**
     * 若需重写查看、编辑、删除等方法，请复制 @see \app\admin\library\traits\Backend 中对应的方法至此进行重写
     */
}