<?php

namespace app\admin\controller\routine;

use ba\Random;
use Throwable;
use ba\Filesystem;
use PhpZip\ZipFile;
use think\facade\Db;
use ba\TableManager;
use app\common\controller\Backend;
use PhpZip\Exception\ZipException;
use think\db\exception\PDOException;
use modules\dataexport\library\ExportLib;
use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

/**
 * 导出任务管理
 *
 */
class Dataexport extends Backend
{
    /**
     * Dataexport模型对象
     * @var object
     * @phpstan-var \app\admin\model\routine\Dataexport
     */
    protected object $model;

    protected string|array $quickSearchField = ['name'];

    protected string|array $defaultSortField = 'id,desc';

    protected array $withJoinTable = ['admin'];

    protected string|array $preExcludeFields = ['createtime'];

    protected array $noNeedPermission = ['getFieldList', 'test', 'task', 'taskControl', 'taskZip'];

    protected string $saveDir;

    protected string $exportZipDir;

    public function initialize(): void
    {
        parent::initialize();
        $this->model        = new \app\admin\model\routine\Dataexport;
        $this->saveDir      = runtime_path() . 'export' . DIRECTORY_SEPARATOR;// 临时文件保存位置(每次开始任务时清空)
        $this->exportZipDir = root_path() . 'public' . DIRECTORY_SEPARATOR . 'export' . DIRECTORY_SEPARATOR;
    }

    /**
     * 测试导出
     * @throws Throwable
     */
    public function test(): void
    {
        if (!$this->auth->check('routine/dataexport/start')) {
            $this->error(__('You have no permission'), ['routeName' => 'admin'], 302);
        }
        $id     = $this->request->param($this->model->getPk());
        $row    = $this->model->find($id);
        $export = new ExportLib($id);

        $exportNumber = $row->export_number ?: $export->getCount();
        if (!$exportNumber) {
            $this->error('没有数据需要导出~');
        }

        try {

            $subtask = [
                [
                    'id'     => 1,
                    'status' => 0,// 状态:0=准备好,1=进行中,2=完成,3=失败
                    'min'    => 0,
                    'max'    => 10,
                    'sql'    => $export->getSql('test')
                ]
            ];

            // 测试sql
            Db::query($subtask[0]['sql']);

            $row->subtask = $subtask;
            $row->save();
        } catch (Throwable $e) {
            $this->error($e->getMessage());
        }

        $this->success('', [
            'taskId' => $id
        ]);
    }

    /**
     * 开始导出
     * @throws Throwable
     */
    public function start(): void
    {
        $id     = $this->request->param($this->model->getPk());
        $row    = $this->model->find($id);
        $export = new ExportLib($id);

        $exportNumber = $row->export_number ?: $export->getCount();
        $xlsMaxNumber = ($exportNumber >= $row->xls_max_number) ? $row->xls_max_number : $exportNumber;
        if (!$exportNumber) {
            $this->error('没有数据需要导出~');
        }

        try {

            $subtask      = [];
            $subtaskCount = ceil($exportNumber / $xlsMaxNumber);// 子任务数量
            for ($i = 0; $i < $subtaskCount; $i++) {
                $min         = $i * $xlsMaxNumber;
                $subtask[$i] = [
                    'id'     => $i,
                    'status' => 0,// 状态:0=准备好,1=进行中,2=完成,3=失败
                    'min'    => $min,
                    'max'    => $xlsMaxNumber,
                    'sql'    => $export->getSql('limit', [$min, $xlsMaxNumber])
                ];
            }

            // 测试sql
            Db::query($subtask[0]['sql']);

            if (!is_dir($this->exportZipDir)) {
                mkdir($this->exportZipDir, 0777, true);
            }

            if ($subtaskCount > 1) {
                // 清理任务临时文件目录
                if (!is_dir($this->saveDir . $id)) {
                    mkdir($this->saveDir . $id . DIRECTORY_SEPARATOR, 0777, true);
                } else {
                    Filesystem::delDir($this->saveDir . $id, false);
                }

                $row->lastprogress = 5;
            } else {
                $row->lastprogress = 0;
            }

            // 删除上次任务的zip包
            if ($row->lastfile) {
                $fileName = explode(DIRECTORY_SEPARATOR, Filesystem::fsFit($row->lastfile));
                if (file_exists($this->exportZipDir . end($fileName))) {
                    unlink($this->exportZipDir . end($fileName));
                }
                $row->lastfile = '';
            }
            $row->subtask        = $subtask;
            $row->lastexporttime = time();
            $row->save();
        } catch (Throwable $e) {
            $this->error($e->getMessage());
        }

        $this->success('导出任务初始化成功！', [
            'download' => $subtaskCount == 1,
            'subtask'  => $subtask,
            'id'       => $id
        ]);
    }

    /**
     * 开始子任务
     * @throws Throwable
     */
    public function task(int $id, int $subId, bool $download): void
    {
        if (!$this->auth->check('routine/dataexport/start')) {
            $this->error(__('You have no permission'), ['routeName' => 'admin'], 302);
        }
        $row    = $this->model->find($id);
        $export = new ExportLib($id);

        if (isset($row->subtask[$subId]) && is_array($row->subtask[$subId])) {
            $subTask  = $row['subtask'][$subId];
            $taskName = $row['name'];
        } else {
            $this->error('导出子任务未找到，请重新开始！', ['subId' => $subId]);
        }

        set_time_limit(0);// 脚本执行时间限制
        ini_set('memory_limit', $row->memory_limit . 'M');// 脚本内存限制

        // 检查任务状态
        if (!$download) {
            if ($subTask['status'] == 1) {
                $this->error('此子任务正在执行中~', ['subId' => $subId]);
            } elseif ($subTask['status'] == 2) {
                if (file_exists($this->saveDir . $id . DIRECTORY_SEPARATOR . $subId . '.xlsx')) {
                    $this->error('此子任务已经处理过啦~', ['subId' => $subId]);
                }
            }
        }

        $spreadsheet = new Spreadsheet();
        $worksheet   = $spreadsheet->getActiveSheet();
        $worksheet->setTitle($taskName);

        // 设置表头
        $head      = $export->getXlsTitle();
        $headCount = count($head);
        for ($i = 0; $i < $headCount; $i++) {
            $worksheet->setCellValue([$i + 1, 1], $head[$i]);
        }

        // 写入数据
        try {
            $data = Db::query($subTask['sql']);
        } catch (PDOException $e) {
            $this->error('任务失败！', ['subId' => $subId, 'msg' => $e->getMessage()]);
        }
        $y      = 2;
        $fields = $export->getFields();
        foreach ($data as $rowKey => $row) {
            $i = 1;
            foreach ($fields as $key => $value) {
                $field = $value['field'];
                if ($value['discern'] == 'text') {
                    // 文本
                    $worksheet->setCellValueExplicit([$i, $y], ltrim((string)$row[$field], '='), DataType::TYPE_STRING);
                } elseif ($value['discern'] == 'int') {
                    // 数字
                    $worksheet->setCellValueExplicit([$i, $y], (int)$row[$field], DataType::TYPE_NUMERIC);
                } elseif ($value['discern'] == 'time') {
                    // 日期时间
                    if ($row[$field]) {
                        if (is_numeric($row[$field])) {
                            $excelDateValue = date('Y-m-d H:i:s', $row[$field]);
                        } else {
                            $excelDateValue = $row[$field];
                        }
                        $worksheet->setCellValue([$i, $y], $excelDateValue);
                    } else {
                        $worksheet->setCellValue([$i, $y], '-');
                    }
                } elseif ($value['discern'] == 'valuation') {
                    // 值替换
                    if (str_contains($row[$field], ',')) {
                        $fieldValueArr     = explode(',', $row[$field]);
                        $fieldValueTextArr = [];
                        foreach ($fieldValueArr as $item) {
                            if ($item) {
                                $fieldValueTextArr[] = $export->assignment($item, $value['comment']);
                            }
                        }
                        $fieldValue = implode(',', $fieldValueTextArr);
                    } else {
                        $fieldValue = $export->assignment($row[$field], $value['comment']);
                    }
                    $worksheet->setCellValueExplicit([$i, $y], (string)$fieldValue, DataType::TYPE_STRING);
                } elseif ($value['discern'] == 'city') {
                    // 省份城市
                    $fieldValue = '';
                    if ($row[$field]) {
                        $cityNames  = Db::name('area')->whereIn('id', $row[$field])->column('name');
                        $fieldValue = $cityNames ? implode(',', $cityNames) : '';
                    }
                    $worksheet->setCellValueExplicit([$i, $y], $fieldValue, DataType::TYPE_STRING);
                }

                $i++;
            }
            $y++;
            unset($data[$rowKey]); // 能节约一点内存
        }

        // xls文件处理
        if ($download) {
            // 直接下载
            ob_end_clean();

            $taskName = $id . '.' . $taskName . '.xlsx';
            $headers  = array_merge(request()->allowCrossDomainHeaders ?? [], [
                'Content-Type'                  => 'application/vnd.ms-excel',
                'Access-Control-Expose-Headers' => 'Content-Disposition',
                'Content-Disposition'           => "attachment;filename=$taskName",
                'Cache-Control'                 => 'no-cache',
            ]);

            foreach ($headers as $name => $val) {
                header($name . (!is_null($val) ? ':' . $val : ''));
            }

            $writer = new Xlsx($spreadsheet);
            $writer->save('php://output');
            $spreadsheet->disconnectWorksheets();
            unset($spreadsheet);
        } else {
            // 保存
            $writer = new Xlsx($spreadsheet);
            $writer->save($this->saveDir . $id . DIRECTORY_SEPARATOR . $subId . '.xlsx');

            $result = false;
            Db::startTrans();
            try {
                // 获取最新状态
                $row          = $this->model->find($id);
                $lastProgress = $row->lastprogress + round(92 / count($row->subtask), 2);
                $lastProgress = ($lastProgress > 100) ? 100 : $lastProgress;

                if (isset($row->subtask[$subId]) && is_array($row->subtask[$subId])) {
                    $subTaskTemp                   = $row->subtask;
                    $subTaskTemp[$subId]['status'] = 2;
                    $row->subtask                  = $subTaskTemp;
                    $row->lastprogress             = $lastProgress;
                    $row->save();
                    $result = true;
                }
                Db::commit();
            } catch (Throwable $e) {
                Db::rollback();
                $this->error('任务失败！', ['subId' => $subId, 'msg' => $e->getMessage()]);
            }
            $spreadsheet->disconnectWorksheets();
            unset($spreadsheet);
            if ($result) {
                $this->success('', [
                    'subId' => $subId,
                ]);
            } else {
                $this->error('', [
                    'subId' => $subId,
                ]);
            }
        }
    }

    /**
     * 任务控制器
     * @throws Throwable
     */
    public function taskControl(): void
    {
        if (!$this->auth->check('routine/dataexport/start')) {
            $this->error(__('You have no permission'), ['routeName' => 'admin'], 302);
        }
        $id  = $this->request->param($this->model->getPk());
        $row = $this->model->find($id);
        if (!$row) {
            $this->error('任务找不到啦~');
        }
        if (!isset($row->subtask) || !is_array($row->subtask)) {
            $this->error('子任务找不到啦，请重新开始任务~');
        }
        $row = $row->toArray();

        $currentPage = 0;
        $subtaskPage = [];
        foreach ($row['subtask'] as $value) {
            $value['status']             = 0;// 用户可能会刷新任务控制页面，js将重新确定状态
            $subtaskPage[$currentPage][] = $value;
            if (count($subtaskPage[$currentPage]) >= $row['concurrent_create_xls']) {
                $currentPage++;
            }
        }

        $subtaskCount            = is_array($row['subtask']) ? count($row['subtask']) : 0;
        $row['subtask_progress'] = round(92 / $subtaskCount, 2);
        $row['lastprogress']     = 5;

        $this->success('', [
            'task'        => $row,
            'subtaskPage' => $subtaskPage,
        ]);
    }

    /**
     * 任务ZIP
     * @throws Throwable
     */
    public function taskZip(): void
    {
        if (!$this->auth->check('routine/dataexport/start')) {
            $this->error(__('You have no permission'), ['routeName' => 'admin'], 302);
        }
        $id  = $this->request->param($this->model->getPk());
        $row = $this->model->find($id);
        if (!$row) {
            $this->error(__('Record not found'));
        }
        if (!isset($row->subtask) || !is_array($row->subtask)) {
            $this->error('打包失败，任务找不到啦~');
        }
        if ($row->lastfile) {
            $this->success('', ['file' => $row->lastfile]);
        }

        foreach ($row->subtask as $subtask) {
            if (!file_exists($this->saveDir . $id . DIRECTORY_SEPARATOR . $subtask['id'] . '.xlsx')) {
                $this->error('子任务未处理完毕！');
            }
        }
        $taskDir = $this->saveDir . $id . DIRECTORY_SEPARATOR;// 导出任务的临时文件目录
        $zipName = $id . '.export_' . Random::build() . '.zip';
        $zipUrl  = '//' . request()->host() . '/export/' . $zipName;// 绝对地址,以便各处直接点击下载
        $zipName = $this->exportZipDir . $zipName;

        $zip = new ZipFile();
        try {
            $dh = opendir($taskDir);
            while ($file = readdir($dh)) {
                if ($file != "." && $file != "..") {
                    $fullPath = $taskDir . $file;
                    if (!is_dir($fullPath)) {
                        $zip->addFile($fullPath, $file);
                    }
                }
            }
            closedir($dh);
            $zip->saveAsFile($zipName);

            Filesystem::delDir($taskDir);
        } catch (ZipException $e) {
            $this->error('打包失败：' . $e->getMessage());
        } finally {
            $zip->close();
        }

        $row->lastfile     = $zipUrl;
        $row->lastprogress = 100;
        $row->save();
        $this->success('', ['url' => $zipUrl]);
    }

    /**
     * 添加
     * @throws Throwable
     */
    public function add(): void
    {
        if ($this->request->isPost()) {
            $data = $this->request->post();
            if (!$data) {
                $this->error(__('Parameter %s can not be empty', ['']));
            }

            $data             = $this->excludeFields($data);
            $data['admin_id'] = $this->auth->id;

            $result = false;
            Db::startTrans();
            try {
                // 模型验证
                if ($this->modelValidate) {
                    $validate = str_replace("\\model\\", "\\validate\\", get_class($this->model));
                    if (class_exists($validate)) {
                        $validate = new $validate;
                        if ($this->modelSceneValidate) $validate->scene('add');
                        $validate->check($data);
                    }
                }
                $result = $this->model->save($data);
                Db::commit();
            } catch (Throwable $e) {
                Db::rollback();
                $this->error($e->getMessage());
            }
            if ($result !== false) {
                $this->success(__('Added successfully'));
            } else {
                $this->error(__('No rows were added'));
            }
        }

        $this->success('', [
            'tables' => $this->getTableList(),
        ]);
    }

    /**
     * 编辑
     * @throws Throwable
     */
    public function edit(): void
    {
        $id  = $this->request->param($this->model->getPk());
        $row = $this->model->find($id);
        if (!$row) {
            $this->error(__('Record not found'));
        }

        $dataLimitAdminIds = $this->getDataLimitAdminIds();
        if ($dataLimitAdminIds && !in_array($row[$this->dataLimitField], $dataLimitAdminIds)) {
            $this->error(__('You have no permission'));
        }

        if ($this->request->isPost()) {
            $data = $this->request->post();
            if (!$data) {
                $this->error(__('Parameter %s can not be empty', ['']));
            }

            $data   = $this->excludeFields($data);
            $result = false;
            Db::startTrans();
            try {
                // 模型验证
                if ($this->modelValidate) {
                    $validate = str_replace("\\model\\", "\\validate\\", get_class($this->model));
                    if (class_exists($validate)) {
                        $validate = new $validate;
                        if ($this->modelSceneValidate) $validate->scene('edit');
                        $validate->check($data);
                    }
                }
                $result = $row->save($data);
                Db::commit();
            } catch (Throwable $e) {
                Db::rollback();
                $this->error($e->getMessage());
            }
            if ($result !== false) {
                $this->success(__('Update successful'));
            } else {
                $this->error(__('No rows updated'));
            }

        }

        $this->success('', [
            'row'    => $row,
            'tables' => $this->getTableList(),
        ]);
    }

    /**
     * 查看
     * @throws Throwable
     */
    public function index(): void
    {
        // 如果是select则转发到select方法,若select未重写,其实还是继续执行index
        if ($this->request->param('select')) {
            $this->select();
        }

        list($where, $alias, $limit, $order) = $this->queryBuilder();
        $res = $this->model
            ->withJoin($this->withJoinTable, $this->withJoinType)
            ->alias($alias)
            ->where($where)
            ->order($order)
            ->visible(['admin' => ['nickname']])
            ->paginate($limit);

        $this->success('', [
            'list'   => $res->items(),
            'total'  => $res->total(),
            'remark' => get_route_remark(),
        ]);
    }

    protected function getTableList(): array
    {
        $tablePrefix     = config('database.connections.mysql.prefix');
        $outExcludeTable = [
            // 功能表
            'area',
            'config',
            'token',
            'captcha',
            'admin_group_access',
        ];

        $outTables = [];
        $tables    = TableManager::getTableList();
        $pattern   = '/^' . $tablePrefix . '/i';
        foreach ($tables as $table => $tableComment) {
            $table = preg_replace($pattern, '', $table);
            if (!in_array($table, $outExcludeTable)) {
                $outTables[$table] = $tableComment;
            }
        }
        return $outTables;
    }

    public function getFieldList($table = null): void
    {
        if (!$table) {
            $this->error(__('Parameter error'));
        }

        // 字段类型识别
        $dataTypeInt = [
            'tinyint',
            'int',
            'smallint',
            'mediumint',
            'integer',
            'bigint'
        ];

        $fieldList = TableManager::getTableColumns($table);

        $fields = [];
        foreach ($fieldList as $key => $item) {
            $discern = 'text'; // 文本
            if (in_array($item['DATA_TYPE'], $dataTypeInt)) {
                $discern = 'int'; // 数字
            }
            if (preg_match("/time$|datetime$/i", $key)) {
                $discern = 'time'; // 日期时间
            }
            if (preg_match("/switch$|toggle$/i", $key)) {
                $discern    = 'valuation';// 赋值
                $commentVal = '0=关闭,1=开启';
            }
            if (str_contains($key, 'city')) {
                $discern = 'city'; // 省份城市
            }

            $comment = str_replace('，', ',', $item['COLUMN_COMMENT']);
            $comment = str_replace(['(多选)', '(单选)', '（多选）', '（单选）'], '', $comment);
            if (stripos($comment, ':') !== false && stripos($comment, ',') && stripos($comment, '=') !== false) {
                list($fieldName, $commentVal) = explode(':', $comment);
                $discern = 'valuation';// 赋值
            }

            $fields[$key] = [
                'name'    => $key,
                'discern' => $discern,
                'title'   => $fieldName ?? ($item['COLUMN_COMMENT'] ?: $key),
                'comment' => $commentVal ?? '',
            ];
            unset($commentVal, $fieldName);
        }

        $this->success('', [
            'fields' => $fields,
        ]);
    }
}