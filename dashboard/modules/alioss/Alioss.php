<?php

namespace modules\alioss;

use Throwable;
use think\App;
use ba\Filesystem;
use think\facade\Cache;
use think\facade\Event;
use app\common\model\Config;
use app\admin\library\module\Server;

class Alioss
{
    private string $uid = 'alioss';

    /**
     * @throws Throwable
     */
    public function AppInit(): void
    {
        // 上传配置初始化
        Event::listen('uploadConfigInit', function (App $app) {
            $uploadConfig = get_sys_config('', 'upload');
            if ($uploadConfig['upload_mode'] == 'alioss' && empty($app->request->upload)) {
                $bucketUrl    = 'https://' . $uploadConfig['upload_bucket'] . '.' . $uploadConfig['upload_url'] . '.aliyuncs.com';
                $upload       = \think\facade\Config::get('upload');
                $maxSize      = Filesystem::fileUnitToByte($upload['max_size']);
                $conditions[] = ['content-length-range', 0, $maxSize];
                $expire       = time() + 3600;
                $policy       = base64_encode(json_encode([
                    'expiration' => date('Y-m-d\TH:i:s.Z\Z', $expire),
                    'conditions' => $conditions,
                ]));
                $signature    = base64_encode(hash_hmac('sha1', $policy, $uploadConfig['upload_secret_key'], true));

                $app->request->upload = [
                    'cdn'    => $uploadConfig['upload_cdn_url'] ?: $bucketUrl,
                    'mode'   => $uploadConfig['upload_mode'],
                    'url'    => $bucketUrl,
                    'params' => [
                        'OSSAccessKeyId' => $uploadConfig['upload_access_id'],
                        'policy'         => $policy,
                        'Signature'      => $signature,
                        'Expires'        => $expire,
                    ]
                ];
            }
        });
    }

    /**
     * @throws Throwable
     */
    public function enable(): void
    {
        Config::addConfigGroup('upload', '上传配置');
        if (!Config::where('name', 'upload_mode')->value('id')) {
            // 配置数据曾在禁用时被删除
            Server::importSql(root_path() . 'modules' . DIRECTORY_SEPARATOR . $this->uid . DIRECTORY_SEPARATOR);
        }

        // 恢复缓存中的配置数据
        $config = Cache::pull($this->uid . '-module-config');
        if ($config) {
            $config = json_decode($config, true);
            foreach ($config as $item) {
                Config::where('name', $item['name'])->update([
                    'value' => $item['value']
                ]);
            }
        }
    }

    /**
     * @throws Throwable
     */
    public function disable(): void
    {
        $config = Config::whereIn('name', ['upload_mode', 'upload_bucket', 'upload_access_id', 'upload_secret_key', 'upload_url', 'upload_cdn_url'])->select();

        // 备份配置到缓存
        if (!$config->isEmpty()) {
            $configData = $config->toArray();
            Cache::set($this->uid . '-module-config', json_encode($configData), 3600);
        }

        foreach ($config as $item) {
            $item->delete();
        }
        Config::removeConfigGroup('upload');
    }
}