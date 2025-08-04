

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for ba_admin
-- ----------------------------
DROP TABLE IF EXISTS `ba_admin`;
CREATE TABLE `ba_admin`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `username` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '用户名',
  `nickname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '昵称',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '头像',
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '邮箱',
  `mobile` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '手机',
  `login_failure` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '登录失败次数',
  `last_login_time` bigint UNSIGNED NULL DEFAULT NULL COMMENT '上次登录时间',
  `last_login_ip` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '上次登录IP',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '密码',
  `salt` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '密码盐（废弃待删）',
  `motto` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '签名',
  `status` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '状态:enable=启用,disable=禁用',
  `update_time` bigint UNSIGNED NULL DEFAULT NULL COMMENT '更新时间',
  `create_time` bigint UNSIGNED NULL DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '管理员表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ba_admin
-- ----------------------------
INSERT INTO `ba_admin` VALUES (1, 'admin', 'Admin', '', 'sqj@shiqianjiang.cn', '18888888888', 0, 1753940380, '127.0.0.1', '$2y$10$IT2lklfxdMHJ.T97y8JebulhCPoUpyeukjDNirum9qQ6.7ie1wjXa', '', '', 'enable', 1753940380, 1752721021);

-- ----------------------------
-- Table structure for ba_admin_group
-- ----------------------------
DROP TABLE IF EXISTS `ba_admin_group`;
CREATE TABLE `ba_admin_group`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `pid` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '上级分组',
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '组名',
  `rules` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '权限规则ID',
  `status` tinyint UNSIGNED NOT NULL DEFAULT 1 COMMENT '状态:0=禁用,1=启用',
  `update_time` bigint UNSIGNED NULL DEFAULT NULL COMMENT '更新时间',
  `create_time` bigint UNSIGNED NULL DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '管理分组表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ba_admin_group
-- ----------------------------
INSERT INTO `ba_admin_group` VALUES (1, 0, '超级管理组', '*', 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_group` VALUES (2, 1, '一级管理员', '1,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,77,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,89', 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_group` VALUES (3, 2, '二级管理员', '21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43', 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_group` VALUES (4, 3, '三级管理员', '1,89,142,129,115,109,91,141,127,128,114,108,90', 1, 1753095910, 1752721021);

-- ----------------------------
-- Table structure for ba_admin_group_access
-- ----------------------------
DROP TABLE IF EXISTS `ba_admin_group_access`;
CREATE TABLE `ba_admin_group_access`  (
  `uid` int UNSIGNED NOT NULL COMMENT '管理员ID',
  `group_id` int UNSIGNED NOT NULL COMMENT '分组ID',
  INDEX `uid`(`uid` ASC) USING BTREE,
  INDEX `group_id`(`group_id` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '管理分组映射表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ba_admin_group_access
-- ----------------------------
INSERT INTO `ba_admin_group_access` VALUES (1, 1);
INSERT INTO `ba_admin_group_access` VALUES (2, 4);

-- ----------------------------
-- Table structure for ba_admin_log
-- ----------------------------
DROP TABLE IF EXISTS `ba_admin_log`;
CREATE TABLE `ba_admin_log`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `admin_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '管理员ID',
  `username` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '管理员用户名',
  `url` varchar(1500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '操作Url',
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '日志标题',
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '请求数据',
  `ip` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'IP',
  `useragent` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'User-Agent',
  `create_time` bigint UNSIGNED NULL DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 623 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '管理员日志表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ba_admin_log
-- ----------------------------

-- ----------------------------
-- Table structure for ba_admin_rule
-- ----------------------------
DROP TABLE IF EXISTS `ba_admin_rule`;
CREATE TABLE `ba_admin_rule`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `pid` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '上级菜单',
  `type` enum('menu_dir','menu','button') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'menu' COMMENT '类型:menu_dir=菜单目录,menu=菜单项,button=页面按钮',
  `title` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '标题',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '规则名称',
  `path` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '路由路径',
  `icon` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '图标',
  `menu_type` enum('tab','link','iframe') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '菜单类型:tab=选项卡,link=链接,iframe=Iframe',
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'Url',
  `component` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '组件路径',
  `keepalive` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '缓存:0=关闭,1=开启',
  `extend` enum('none','add_rules_only','add_menu_only') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'none' COMMENT '扩展属性:none=无,add_rules_only=只添加为路由,add_menu_only=只添加为菜单',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '备注',
  `weigh` int NOT NULL DEFAULT 0 COMMENT '权重',
  `status` tinyint UNSIGNED NOT NULL DEFAULT 1 COMMENT '状态:0=禁用,1=启用',
  `update_time` bigint UNSIGNED NULL DEFAULT NULL COMMENT '更新时间',
  `create_time` bigint UNSIGNED NULL DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `pid`(`pid` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 180 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '菜单和权限规则表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ba_admin_rule
-- ----------------------------
INSERT INTO `ba_admin_rule` VALUES (1, 0, 'menu', '控制台', 'dashboard', 'dashboard', 'fa fa-dashboard', 'tab', '', '/src/views/backend/dashboard.vue', 1, 'none', 'Remark lang', 999, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (2, 0, 'menu_dir', '权限管理', 'auth', 'auth', 'fa fa-group', NULL, '', '', 0, 'none', '', 100, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (3, 2, 'menu', '角色组管理', 'auth/group', 'auth/group', 'fa fa-group', 'tab', '', '/src/views/backend/auth/group/index.vue', 1, 'none', 'Remark lang', 99, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (4, 3, 'button', '查看', 'auth/group/index', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (5, 3, 'button', '添加', 'auth/group/add', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (6, 3, 'button', '编辑', 'auth/group/edit', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (7, 3, 'button', '删除', 'auth/group/del', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (8, 2, 'menu', '管理员管理', 'auth/admin', 'auth/admin', 'el-icon-UserFilled', 'tab', '', '/src/views/backend/auth/admin/index.vue', 1, 'none', '', 98, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (9, 8, 'button', '查看', 'auth/admin/index', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (10, 8, 'button', '添加', 'auth/admin/add', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (11, 8, 'button', '编辑', 'auth/admin/edit', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (12, 8, 'button', '删除', 'auth/admin/del', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (13, 2, 'menu', '菜单规则管理', 'auth/rule', 'auth/rule', 'el-icon-Grid', 'tab', '', '/src/views/backend/auth/rule/index.vue', 1, 'none', '', 97, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (14, 13, 'button', '查看', 'auth/rule/index', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (15, 13, 'button', '添加', 'auth/rule/add', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (16, 13, 'button', '编辑', 'auth/rule/edit', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (17, 13, 'button', '删除', 'auth/rule/del', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (18, 13, 'button', '快速排序', 'auth/rule/sortable', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (19, 2, 'menu', '管理员日志管理', 'auth/adminLog', 'auth/adminLog', 'el-icon-List', 'tab', '', '/src/views/backend/auth/adminLog/index.vue', 1, 'none', '', 96, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (20, 19, 'button', '查看', 'auth/adminLog/index', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (21, 0, 'menu_dir', '会员管理', 'user', 'user', 'fa fa-drivers-license', NULL, '', '', 0, 'none', '', 95, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (22, 21, 'menu', '会员管理', 'user/user', 'user/user', 'fa fa-user', 'tab', '', '/src/views/backend/user/user/index.vue', 1, 'none', '', 94, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (23, 22, 'button', '查看', 'user/user/index', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (24, 22, 'button', '添加', 'user/user/add', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (25, 22, 'button', '编辑', 'user/user/edit', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (26, 22, 'button', '删除', 'user/user/del', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (27, 21, 'menu', '会员分组管理', 'user/group', 'user/group', 'fa fa-group', 'tab', '', '/src/views/backend/user/group/index.vue', 1, 'none', '', 93, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (28, 27, 'button', '查看', 'user/group/index', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (29, 27, 'button', '添加', 'user/group/add', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (30, 27, 'button', '编辑', 'user/group/edit', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (31, 27, 'button', '删除', 'user/group/del', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (32, 21, 'menu', '会员规则管理', 'user/rule', 'user/rule', 'fa fa-th-list', 'tab', '', '/src/views/backend/user/rule/index.vue', 1, 'none', '', 92, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (33, 32, 'button', '查看', 'user/rule/index', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (34, 32, 'button', '添加', 'user/rule/add', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (35, 32, 'button', '编辑', 'user/rule/edit', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (36, 32, 'button', '删除', 'user/rule/del', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (37, 32, 'button', '快速排序', 'user/rule/sortable', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (38, 21, 'menu', '会员余额管理', 'user/moneyLog', 'user/moneyLog', 'el-icon-Money', 'tab', '', '/src/views/backend/user/moneyLog/index.vue', 1, 'none', '', 91, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (39, 38, 'button', '查看', 'user/moneyLog/index', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (40, 38, 'button', '添加', 'user/moneyLog/add', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (41, 21, 'menu', '会员积分管理', 'user/scoreLog', 'user/scoreLog', 'el-icon-Discount', 'tab', '', '/src/views/backend/user/scoreLog/index.vue', 1, 'none', '', 90, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (42, 41, 'button', '查看', 'user/scoreLog/index', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (43, 41, 'button', '添加', 'user/scoreLog/add', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (44, 0, 'menu_dir', '常规管理', 'routine', 'routine', 'fa fa-cogs', NULL, '', '', 0, 'none', '', 89, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (45, 44, 'menu', '系统配置', 'routine/config', 'routine/config', 'el-icon-Tools', 'tab', '', '/src/views/backend/routine/config/index.vue', 1, 'none', '', 88, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (46, 45, 'button', '查看', 'routine/config/index', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (47, 45, 'button', '编辑', 'routine/config/edit', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (48, 44, 'menu', '附件管理', 'routine/attachment', 'routine/attachment', 'fa fa-folder', 'tab', '', '/src/views/backend/routine/attachment/index.vue', 1, 'none', 'Remark lang', 87, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (49, 48, 'button', '查看', 'routine/attachment/index', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (50, 48, 'button', '编辑', 'routine/attachment/edit', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (51, 48, 'button', '删除', 'routine/attachment/del', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (52, 44, 'menu', '个人资料', 'routine/adminInfo', 'routine/adminInfo', 'fa fa-user', 'tab', '', '/src/views/backend/routine/adminInfo.vue', 1, 'none', '', 86, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (53, 52, 'button', '查看', 'routine/adminInfo/index', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (54, 52, 'button', '编辑', 'routine/adminInfo/edit', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (55, 0, 'menu_dir', '数据安全管理', 'security', 'security', 'fa fa-shield', NULL, '', '', 0, 'none', '', 85, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (56, 55, 'menu', '数据回收站', 'security/dataRecycleLog', 'security/dataRecycleLog', 'fa fa-database', 'tab', '', '/src/views/backend/security/dataRecycleLog/index.vue', 1, 'none', '', 84, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (57, 56, 'button', '查看', 'security/dataRecycleLog/index', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (58, 56, 'button', '删除', 'security/dataRecycleLog/del', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (59, 56, 'button', '还原', 'security/dataRecycleLog/restore', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (60, 56, 'button', '查看详情', 'security/dataRecycleLog/info', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (61, 55, 'menu', '敏感数据修改记录', 'security/sensitiveDataLog', 'security/sensitiveDataLog', 'fa fa-expeditedssl', 'tab', '', '/src/views/backend/security/sensitiveDataLog/index.vue', 1, 'none', '', 83, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (62, 61, 'button', '查看', 'security/sensitiveDataLog/index', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (63, 61, 'button', '删除', 'security/sensitiveDataLog/del', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (64, 61, 'button', '回滚', 'security/sensitiveDataLog/rollback', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (65, 61, 'button', '查看详情', 'security/sensitiveDataLog/info', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (66, 55, 'menu', '数据回收规则管理', 'security/dataRecycle', 'security/dataRecycle', 'fa fa-database', 'tab', '', '/src/views/backend/security/dataRecycle/index.vue', 1, 'none', 'Remark lang', 82, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (67, 66, 'button', '查看', 'security/dataRecycle/index', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (68, 66, 'button', '添加', 'security/dataRecycle/add', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (69, 66, 'button', '编辑', 'security/dataRecycle/edit', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (70, 66, 'button', '删除', 'security/dataRecycle/del', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (71, 55, 'menu', '敏感字段规则管理', 'security/sensitiveData', 'security/sensitiveData', 'fa fa-expeditedssl', 'tab', '', '/src/views/backend/security/sensitiveData/index.vue', 1, 'none', 'Remark lang', 81, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (72, 71, 'button', '查看', 'security/sensitiveData/index', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (73, 71, 'button', '添加', 'security/sensitiveData/add', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (74, 71, 'button', '编辑', 'security/sensitiveData/edit', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (75, 71, 'button', '删除', 'security/sensitiveData/del', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (76, 0, 'menu', 'BuildAdmin', 'buildadmin', 'buildadmin', 'local-logo', 'link', 'https://doc.buildadmin.com', '', 0, 'none', '', 0, 0, 1752988125, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (77, 45, 'button', '添加', 'routine/config/add', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (78, 0, 'menu', '模块市场', 'moduleStore/moduleStore', 'moduleStore', 'el-icon-GoodsFilled', 'tab', '', '/src/views/backend/module/index.vue', 1, 'none', '', 86, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (79, 78, 'button', '查看', 'moduleStore/moduleStore/index', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (80, 78, 'button', '安装', 'moduleStore/moduleStore/install', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (81, 78, 'button', '调整状态', 'moduleStore/moduleStore/changeState', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (82, 78, 'button', '卸载', 'moduleStore/moduleStore/uninstall', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (83, 78, 'button', '更新', 'moduleStore/moduleStore/update', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (84, 0, 'menu', 'CRUD代码生成', 'crud/crud', 'crud/crud', 'fa fa-code', 'tab', '', '/src/views/backend/crud/index.vue', 1, 'none', '', 80, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (85, 84, 'button', '查看', 'crud/crud/index', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (86, 84, 'button', '生成', 'crud/crud/generate', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (87, 84, 'button', '删除', 'crud/crud/delete', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (88, 45, 'button', '删除', 'routine/config/del', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721021, 1752721021);
INSERT INTO `ba_admin_rule` VALUES (89, 1, 'button', '查看', 'dashboard/index', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721023, 1752721023);
INSERT INTO `ba_admin_rule` VALUES (90, 0, 'menu', 'typewritertexts', 'typewritertexts', 'typewritertexts', 'el-icon-MagicStick', 'tab', '', '/src/views/backend/typewritertexts/index.vue', 1, 'none', '', 0, 1, 1752988174, 1752721612);
INSERT INTO `ba_admin_rule` VALUES (91, 90, 'button', '查看', 'typewritertexts/index', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721612, 1752721612);
INSERT INTO `ba_admin_rule` VALUES (92, 90, 'button', '添加', 'typewritertexts/add', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721612, 1752721612);
INSERT INTO `ba_admin_rule` VALUES (93, 90, 'button', '编辑', 'typewritertexts/edit', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721612, 1752721612);
INSERT INTO `ba_admin_rule` VALUES (94, 90, 'button', '删除', 'typewritertexts/del', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721612, 1752721612);
INSERT INTO `ba_admin_rule` VALUES (95, 90, 'button', '快速排序', 'typewritertexts/sortable', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752721612, 1752721612);
INSERT INTO `ba_admin_rule` VALUES (108, 0, 'menu', '时间轴', 'timeline', 'timeline', 'fa fa-product-hunt', 'tab', '', '/src/views/backend/timeline/index.vue', 1, 'none', '', 0, 1, 1752988284, 1752725835);
INSERT INTO `ba_admin_rule` VALUES (109, 108, 'button', '查看', 'timeline/index', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752725835, 1752725835);
INSERT INTO `ba_admin_rule` VALUES (110, 108, 'button', '添加', 'timeline/add', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752725835, 1752725835);
INSERT INTO `ba_admin_rule` VALUES (111, 108, 'button', '编辑', 'timeline/edit', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752725835, 1752725835);
INSERT INTO `ba_admin_rule` VALUES (112, 108, 'button', '删除', 'timeline/del', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752725835, 1752725835);
INSERT INTO `ba_admin_rule` VALUES (113, 108, 'button', '快速排序', 'timeline/sortable', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752725835, 1752725835);
INSERT INTO `ba_admin_rule` VALUES (114, 0, 'menu', '我的项目列管理', 'project', 'project', 'el-icon-Box', 'tab', '', '/src/views/backend/project/index.vue', 1, 'none', '', 0, 1, 1752988246, 1752741987);
INSERT INTO `ba_admin_rule` VALUES (115, 114, 'button', '查看', 'project/index', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752741987, 1752741987);
INSERT INTO `ba_admin_rule` VALUES (116, 114, 'button', '添加', 'project/add', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752741987, 1752741987);
INSERT INTO `ba_admin_rule` VALUES (117, 114, 'button', '编辑', 'project/edit', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752741987, 1752741987);
INSERT INTO `ba_admin_rule` VALUES (118, 114, 'button', '删除', 'project/del', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752741987, 1752741987);
INSERT INTO `ba_admin_rule` VALUES (119, 114, 'button', '快速排序', 'project/sortable', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752741987, 1752741987);
INSERT INTO `ba_admin_rule` VALUES (127, 0, 'menu_dir', 'tech', 'tech', 'tech', 'el-icon-DataAnalysis', NULL, '', '', 0, 'none', '', 0, 1, 1752988231, 1752749263);
INSERT INTO `ba_admin_rule` VALUES (128, 127, 'menu', '技术栈_技术云图', 'tech/stack', 'tech/stack', '', 'tab', '', '/src/views/backend/tech/stack/index.vue', 1, 'none', '', 0, 1, 1752749263, 1752749263);
INSERT INTO `ba_admin_rule` VALUES (129, 128, 'button', '查看', 'tech/stack/index', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752749263, 1752749263);
INSERT INTO `ba_admin_rule` VALUES (130, 128, 'button', '添加', 'tech/stack/add', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752749263, 1752749263);
INSERT INTO `ba_admin_rule` VALUES (131, 128, 'button', '编辑', 'tech/stack/edit', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752749263, 1752749263);
INSERT INTO `ba_admin_rule` VALUES (132, 128, 'button', '删除', 'tech/stack/del', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752749263, 1752749263);
INSERT INTO `ba_admin_rule` VALUES (133, 128, 'button', '快速排序', 'tech/stack/sortable', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752749263, 1752749263);
INSERT INTO `ba_admin_rule` VALUES (134, 44, 'menu', '数据导出管理', 'routine/dataexport', 'routine/dataexport', 'fa fa-cloud-download', 'tab', '', '/src/views/backend/routine/dataexport/index.vue', 1, 'none', '', 0, 1, 1752751722, 1752751722);
INSERT INTO `ba_admin_rule` VALUES (135, 134, 'button', '查看', 'routine/dataexport/index', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752751722, 1752751722);
INSERT INTO `ba_admin_rule` VALUES (136, 134, 'button', '添加', 'routine/dataexport/add', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752751722, 1752751722);
INSERT INTO `ba_admin_rule` VALUES (137, 134, 'button', '编辑', 'routine/dataexport/edit', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752751722, 1752751722);
INSERT INTO `ba_admin_rule` VALUES (138, 134, 'button', '删除', 'routine/dataexport/del', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752751722, 1752751722);
INSERT INTO `ba_admin_rule` VALUES (139, 134, 'button', '执行任务', 'routine/dataexport/start', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752751722, 1752751722);
INSERT INTO `ba_admin_rule` VALUES (140, 44, 'menu', '导出任务控制', 'routine/dataexport/taskControl', 'routine/dataexport/taskControl/:id', 'fa fa-cloud-download', 'tab', '', '/src/views/backend/routine/dataexport/taskControl.vue', 1, 'add_rules_only', '', 0, 1, 1752751722, 1752751722);
INSERT INTO `ba_admin_rule` VALUES (141, 0, 'menu', '博客文章', 'blogdetail', 'blogdetail', 'el-icon-Management', 'tab', '', '/src/views/backend/blogdetail/index.vue', 1, 'none', '', 0, 1, 1752988200, 1752755159);
INSERT INTO `ba_admin_rule` VALUES (142, 141, 'button', '查看', 'blogdetail/index', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752755159, 1752755159);
INSERT INTO `ba_admin_rule` VALUES (143, 141, 'button', '添加', 'blogdetail/add', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752755159, 1752755159);
INSERT INTO `ba_admin_rule` VALUES (144, 141, 'button', '编辑', 'blogdetail/edit', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752755159, 1752755159);
INSERT INTO `ba_admin_rule` VALUES (145, 141, 'button', '删除', 'blogdetail/del', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752755159, 1752755159);
INSERT INTO `ba_admin_rule` VALUES (146, 141, 'button', '快速排序', 'blogdetail/sortable', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1752755159, 1752755159);
INSERT INTO `ba_admin_rule` VALUES (153, 0, 'menu', '博客评论管理', 'comments', 'comments', '', 'tab', '', '/src/views/backend/comments/index.vue', 1, 'none', '', 0, 1, 1753266520, 1753266520);
INSERT INTO `ba_admin_rule` VALUES (154, 153, 'button', '查看', 'comments/index', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1753266520, 1753266520);
INSERT INTO `ba_admin_rule` VALUES (155, 153, 'button', '添加', 'comments/add', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1753266520, 1753266520);
INSERT INTO `ba_admin_rule` VALUES (156, 153, 'button', '编辑', 'comments/edit', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1753266520, 1753266520);
INSERT INTO `ba_admin_rule` VALUES (157, 153, 'button', '删除', 'comments/del', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1753266521, 1753266521);
INSERT INTO `ba_admin_rule` VALUES (158, 153, 'button', '快速排序', 'comments/sortable', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1753266521, 1753266521);
INSERT INTO `ba_admin_rule` VALUES (173, 0, 'menu_dir', 'blog', 'blog', 'blog', '', NULL, '', '', 0, 'none', '', 0, 1, 1753689780, 1753689780);
INSERT INTO `ba_admin_rule` VALUES (174, 173, 'menu', '博客用户', 'blog/user', 'blog/user', '', 'tab', '', '/src/views/backend/blog/user/index.vue', 1, 'none', '', 0, 1, 1753689780, 1753689780);
INSERT INTO `ba_admin_rule` VALUES (175, 174, 'button', '查看', 'blog/user/index', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1753689780, 1753689780);
INSERT INTO `ba_admin_rule` VALUES (176, 174, 'button', '添加', 'blog/user/add', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1753689780, 1753689780);
INSERT INTO `ba_admin_rule` VALUES (177, 174, 'button', '编辑', 'blog/user/edit', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1753689780, 1753689780);
INSERT INTO `ba_admin_rule` VALUES (178, 174, 'button', '删除', 'blog/user/del', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1753689781, 1753689781);
INSERT INTO `ba_admin_rule` VALUES (179, 174, 'button', '快速排序', 'blog/user/sortable', '', '', NULL, '', '', 0, 'none', '', 0, 1, 1753689781, 1753689781);

-- ----------------------------
-- Table structure for ba_area
-- ----------------------------
DROP TABLE IF EXISTS `ba_area`;
CREATE TABLE `ba_area`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `pid` int UNSIGNED NULL DEFAULT NULL COMMENT '父id',
  `shortname` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '简称',
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '名称',
  `mergename` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '全称',
  `level` tinyint UNSIGNED NULL DEFAULT NULL COMMENT '层级:1=省,2=市,3=区/县',
  `pinyin` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '拼音',
  `code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '长途区号',
  `zip` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '邮编',
  `first` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '首字母',
  `lng` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '经度',
  `lat` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '纬度',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `pid`(`pid` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '省份地区表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ba_area
-- ----------------------------

-- ----------------------------
-- Table structure for ba_attachment
-- ----------------------------
DROP TABLE IF EXISTS `ba_attachment`;
CREATE TABLE `ba_attachment`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `topic` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '细目',
  `admin_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '上传管理员ID',
  `user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '上传用户ID',
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '物理路径',
  `width` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '宽度',
  `height` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '高度',
  `name` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '原始名称',
  `size` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '大小',
  `mimetype` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'mime类型',
  `quote` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '上传(引用)次数',
  `storage` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '存储方式',
  `sha1` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'sha1编码',
  `create_time` bigint UNSIGNED NULL DEFAULT NULL COMMENT '创建时间',
  `last_upload_time` bigint UNSIGNED NULL DEFAULT NULL COMMENT '最后上传时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 58 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '附件表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ba_attachment
-- ----------------------------

-- ----------------------------
-- Table structure for ba_blog_user
-- ----------------------------
DROP TABLE IF EXISTS `ba_blog_user`;
CREATE TABLE `ba_blog_user`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `status` tinyint UNSIGNED NOT NULL DEFAULT 1 COMMENT '状态:0=禁用,1=启用',
  `name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '用户名',
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '密码',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '电话',
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '邮箱',
  `avator` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '头像',
  `regist_time` bigint UNSIGNED NULL DEFAULT NULL COMMENT '注册时间',
  `last_login` bigint UNSIGNED NULL DEFAULT NULL COMMENT '最后登录时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '博客用户' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ba_blog_user
-- ----------------------------
-- ----------------------------
-- Table structure for ba_blogdetail
-- ----------------------------
DROP TABLE IF EXISTS `ba_blogdetail`;
CREATE TABLE `ba_blogdetail`  (
  `id` bigint UNSIGNED NOT NULL COMMENT 'ID',
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '标题',
  `excerpt` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '简介',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '内容',
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '图片',
  `tags` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT 'tags',
  `readTime` int NOT NULL COMMENT '阅读时间建议',
  `create_time` bigint UNSIGNED NULL DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '博客文章' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ba_blogdetail
-- ----------------------------
INSERT INTO `ba_blogdetail` VALUES (4948294198039154688, 'Vue3组合式API的实践心得', 'Vue 3的组合式API（Composition API）是Vue.js框架的一次重大革新，它为代码组织和逻辑复用提供了全新的方式。在本文中，我将分享我使用组合式API的实践经验和一些最佳实践。', '<p><br></p><h2 style=\"text-align: start;\">为什么选择组合式API？</h2><p style=\"text-align: start;\">在Vue 2中，我们主要使用选项式API（Options API）来组织代码，将代码分散在data、methods、computed等不同选项中。这种方式在小型组件中工作良好，但在大型组件中，相关逻辑会被分散在不同的选项中，导致代码难以理解和维护。</p><p style=\"text-align: start;\">组合式API通过setup函数将相关逻辑组合在一起，使代码更加清晰和易于维护。此外，它还提供了更好的TypeScript支持和更灵活的逻辑复用方式。</p><h2 style=\"text-align: start;\">基本用法示例</h2><pre style=\"text-align: left; line-height: 1.5;\"><code class=\"language-javascript\" style=\"text-align: left;\">\n          import { ref, computed, onMounted } from \'vue\'\n          \n          export default {\n            setup() {\n              // 响应式状态\n              const count = ref(0)\n              \n              // 计算属性\n              const doubleCount = computed(() =&gt; count.value * 2)\n              \n              // 方法\n              const increment = () =&gt; {\n                count.value++\n              }\n              \n              // 生命周期钩子\n              onMounted(() =&gt; {\n                console.log(\'组件已挂载\')\n              })\n              \n              // 返回需要暴露给模板的内容\n              return {\n                count,\n                doubleCount,\n                increment\n              }\n            }\n          }\n          </code></pre><h2 style=\"text-align: start;\">逻辑复用：组合函数</h2><p style=\"text-align: start;\">组合式API的一个主要优势是能够将逻辑提取到独立的函数中，这些函数被称为\"组合函数\"（Composables）。这使得我们可以在不同组件之间复用逻辑，而不需要使用混入（mixins）或高阶组件（HOC）等复杂模式。</p><p style=\"text-align: start;\">以下是一个简单的组合函数示例，用于管理计数器状态：</p><p><br></p>', '/storage/default/20250718/PixPin_2025-07-faebbb626cb22db1b11040a724adb8b2437e205a.png', '[{\"key\":\"\",\"value\":\"vue3\"},{\"key\":\"\",\"value\":\"router\"}]', 22, 1752756043);
INSERT INTO `ba_blogdetail` VALUES (4948584391799476224, 'Tailwind CSS：一种实用的CSS方法论', '探讨Tailwind CSS的优势和使用技巧，以及如何在项目中高效地使用它来构建响应式界面。', '<p><span style=\"color: rgb(75, 85, 99); background-color: rgb(255, 255, 255); font-size: medium;\">探讨Tailwind CSS的优势和使用技巧，以及如何在项目中高效地使用它来构建响应式界面。</span><img src=\"https://oss.shiqianjiang.cn/storage/default/20250718/PixPin_2025-06-0a7571e4df81377f38cb18577ea562b92fa1a3e6.png\" alt=\"\" data-href=\"https://oss.shiqianjiang.cn/storage/default/20250718/PixPin_2025-06-0a7571e4df81377f38cb18577ea562b92fa1a3e6.png\" width=\"\" height=\"\" style=\"\"/></p>', '/storage/default/20250718/PixPin_2025-06-aa70dde6263f4c229aaf5bd3091e5c7c87592d6a.png', '[{\"key\":\"\",\"value\":\"Tailwind CSS\"},{\"key\":\"\",\"value\":\"前端开发\"},{\"key\":\"\",\"value\":\"vue\"},{\"key\":\"\",\"value\":\"nodejs\"}]', 23, 1752825231);
INSERT INTO `ba_blogdetail` VALUES (4948589405523677184, '我的编程学习路线图', '分享我作为高中生是如何规划自己的编程学习路线，以及在这个过程中的经验和教训。', '<h1>标题</h1><h3 style=\"line-height: 1.5;\">aaa<span style=\"font-size: 24px;\">ssss</span><span style=\"font-size: 15px;\">aas</span></h3><pre><code class=\"language-markdown\">### aaa</code></pre><p><br></p>', '/storage/default/20250718/PixPin_2025-06-25da3a6ab06c7fb4abe612df77d9f1f959aeaac9.png', '[{\"key\":\"\",\"value\":\"学习经历\"},{\"key\":\"\",\"value\":\"个人成长\"}]', 3, 1752826426);
INSERT INTO `ba_blogdetail` VALUES (4948615701855211520, 'abc', 'aaasss', '<p><img src=\"https://oss.shiqianjiang.cn/storage/default/20250718/PixPin_2025-07-faebbb626cb22db1b11040a724adb8b2437e205a.png\" alt=\"\" data-href=\"https://oss.shiqianjiang.cn/storage/default/20250718/PixPin_2025-07-faebbb626cb22db1b11040a724adb8b2437e205a.png\" width=\"\" height=\"\" style=\"\"/></p>', '/storage/default/20250718/PixPin_2025-07-e27f11bf0dfc005236c6539daf11be107bff19ad.png', '[]', 2, 1752832696);
INSERT INTO `ba_blogdetail` VALUES (4948677990411145216, 'NodeJS 跨域资源共享教程（CROS）', 'CORS(跨域资源共享)是现代Web开发中常见的需求，本教程将展示如何在Node.js应用中实现CORS。', '<h2><span style=\"color: rgb(9, 109, 217);\">1. 基本概念</span></h2><p>CORS是一种机制，它允许运行在一个域上的Web应用访问另一个域上的资源。出于安全原因，浏览器默认禁止跨域请求。</p><h2><span style=\"color: rgb(9, 109, 217);\">2. 创建基本Node.js服务器</span></h2><p>首先创建一个简单的Express服务器：</p><pre><code class=\"language-javascript\">const express = require(\'express\');\nconst app = express();\nconst port = 3000;\n\napp.get(\'/\', (req, res) =&gt; {\n  res.send(\'Hello World!\');\n});\n\napp.listen(port, () =&gt; {\n  console.log(`Server running at http://localhost:${port}`);\n});</code></pre><h2><span style=\"color: rgb(9, 109, 217);\">3. 添加CORS支持</span></h2><h3>方法一：使用cors中间件（推荐）</h3><p>安装cors包：<br><code> npm install cors </code></p><p>然后修改服务器代码：<br></p><pre><code class=\"language-javascript\">const express = require(\'express\');\nconst cors = require(\'cors\');\nconst app = express();\nconst port = 3000;\n\n// 启用所有CORS请求\napp.use(cors());\n\napp.get(\'/\', (req, res) =&gt; {\n  res.send(\'Hello World with CORS!\');\n});\n\napp.listen(port, () =&gt; {\n  console.log(`Server running at http://localhost:${port}`);\n});\n</code></pre><h2><span style=\"color: rgb(9, 109, 217);\">4. 配置特定域名的CORS</span></h2><p><br></p><p>如果你只想允许特定域名访问：</p><pre><code class=\"language-javascript\">const corsOptions = {\n  origin: \'http://example.com\',\n  optionsSuccessStatus: 200 // 一些旧浏览器会需要\n};\n\napp.use(cors(corsOptions));</code></pre><p>或者手动设置：</p><pre><code class=\"language-javascript\">\napp.use((req, res, next) =&gt; {\n  const allowedOrigins = [\'http://example.com\', \'http://localhost:8080\'];\n  const origin = req.headers.origin;\n  \n  if (allowedOrigins.includes(origin)) {\n    res.header(\'Access-Control-Allow-Origin\', origin);\n  }\n  \n  res.header(\'Access-Control-Allow-Methods\', \'GET, POST, PUT, DELETE\');\n  res.header(\'Access-Control-Allow-Headers\', \'Content-Type, Authorization\');\n  next();\n});\n</code></pre><h2><span style=\"color: rgb(9, 109, 217);\">5. 处理预检请求(Preflight)</span></h2><p><br></p><p>对于复杂请求(如Content-Type为application/json的POST请求)，浏览器会先发送OPTIONS请求(预检请求)。cors中间件会自动处理，如果手动实现：</p><p><br></p><pre><code class=\"language-javascript\">app.options(\'*\', (req, res) =&gt; {\n  res.header(\'Access-Control-Allow-Origin\', \'*\');\n  res.header(\'Access-Control-Allow-Methods\', \'GET, POST, PUT, DELETE\');\n  res.header(\'Access-Control-Allow-Headers\', \'Content-Type, Authorization\');\n  res.sendStatus(200);\n});</code></pre><h2><span style=\"color: rgb(9, 109, 217);\">6. 测试CORS<br></span></h2><p>创建一个简单的HTML文件来测试：</p><pre><code class=\"language-html\">\n&lt;!DOCTYPE html&gt;\n&lt;html&gt;\n&lt;head&gt;\n    &lt;title&gt;CORS Test&lt;/title&gt;\n    cleanXss\n        fetch(\'http://localhost:3000\')\n            .then(response =&gt; response.text())\n            .then(data =&gt; console.log(data))\n            .catch(error =&gt; console.error(\'Error:\', error));\n    cleanXss\n&lt;/head&gt;\n&lt;body&gt;\n    &lt;h1&gt;CORS Test Page&lt;/h1&gt;\n    &lt;p&gt;Check console for results&lt;/p&gt;\n&lt;/body&gt;\n&lt;/html&gt;\n</code></pre><p>在不同的域或端口打开此文件，查看控制台输出。<br></p><h2><span style=\"color: rgb(9, 109, 217);\">7. 生产环境注意事项<br></span></h2><p>在生产环境中：</p><p><br></p><ul><li>不要使用<code> Access-Control-Allow-Origin: * </code></li><li>明确指定允许的域名</li><li> 考虑添加其他安全头部</li><li>可能需要处理凭据(cookies, HTTP认证)<br></li></ul><pre><code class=\"language-javascript\">const corsOptions = {\n  origin: \'https://yourproductiondomain.com\',\n  credentials: true,\n  optionsSuccessStatus: 200\n};\n\napp.use(cors(corsOptions));\n</code></pre><p>这就是Node.js中实现CORS的基本方法。根据你的具体需求，可以进一步定制CORS配置。</p>', '/storage/default/20250718/10000814092925eea8bccc06c19081eeb93ca37c808fee4e32.gif', '[{\"key\":\"\",\"value\":\"nodejs\"},{\"key\":\"\",\"value\":\"express\"},{\"key\":\"\",\"value\":\"教程\"},{\"key\":\"\",\"value\":\"cros\"}]', 60, 1752847547);
INSERT INTO `ba_blogdetail` VALUES (4950034838343127040, 'Node.js 依赖注入(DI)与控制反转(IoC)通俗讲解', '通俗讲nodejs依赖注入和ioc控制反转', '<p># Node.js 依赖注入(DI)与控制反转(IoC)通俗讲解<br><br>## 什么是控制反转(IoC)<br><br>想象你平时泡咖啡：<br>- **传统方式**：你自己去买咖啡豆、磨粉、烧水、冲泡（控制权在你）<br>- **IoC方式**：去咖啡店说\"我要一杯拿铁\"，店员帮你搞定一切（控制权在咖啡店）<br><br>IoC就是把创建和管理对象的控制权从你的代码中\"反转\"给外部容器。<br><br>## 什么是依赖注入(DI)<br><br>这是实现IoC的一种方式。比如：<br><br>```javascript<br>// 没有DI的写法 - 直接在类内部创建依赖<br>class UserService {<br> &nbsp;constructor() {<br> &nbsp; &nbsp;this.db = new Database(); // 直接创建依赖<br> &nbsp;}<br>}<br><img src=\"https://oss.shiqianjiang.cn/storage/default/20250723/mmexport1744732a2f8406e483442888d29521de63ca4f98bc085a2.jpeg\" alt=\"\" data-href=\"https://oss.shiqianjiang.cn/storage/default/20250723/mmexport1744732a2f8406e483442888d29521de63ca4f98bc085a2.jpeg\" width=\"\" height=\"\" style=\"\"/><br>// 使用DI的写法 - 依赖从外部\"注入\"<br>class UserService {<br> &nbsp;constructor(db) { &nbsp;// 依赖通过参数传入<br> &nbsp; &nbsp;this.db = db;<br> &nbsp;}<br>}<br>```<br><br>## Node.js 中为什么需要它们<br><br>1. **解耦**：类不直接创建依赖，更容易替换实现<br>2. **可测试**：测试时可以轻松注入模拟对象<br>3. **可维护**：依赖关系清晰可见<br><br>## 简单实现例子<br><br>```javascript<br>// 容器简单实现<br>class Container {<br> &nbsp;constructor() {<br> &nbsp; &nbsp;this.services = {};<br> &nbsp;}<br><br> &nbsp;register(name, callback) {<br> &nbsp; &nbsp;this.services[name] = callback;<br> &nbsp;}<br><br> &nbsp;get(name) {<br> &nbsp; &nbsp;if (!this.services[name]) {<br> &nbsp; &nbsp; &nbsp;throw new Error(`Service ${name} not found`);<br> &nbsp; &nbsp;}<br> &nbsp; &nbsp;return this.services[name](this);<br> &nbsp;}<br>}<br><br>// 使用示例<br>const container = new Container();<br><br>// 注册服务<br>container.register(\'db\', () =&gt; new Database());<br>container.register(\'userService\', (c) =&gt; new UserService(c.get(\'db\')));<br><br>// 获取服务<br>const userService = container.get(\'userService\');<br>```<br><br>## 常用库<br><br>- **Awilix**：流行的DI容器<br>- **InversifyJS**：功能强大的IoC容器<br>- **NestJS框架**：内置DI系统<br><br>## 通俗总结<br><br>- **IoC**：把\"谁创建谁\"的控制权交给外部管理<br>- **DI**：\"你需要什么，我提供给你\"而不是\"你自己去拿\"<br>- **好处**：代码更灵活、更易测试、更易维护<br><br>就像点外卖(IoC)和自己做饭的区别，外卖把\"怎么做饭\"的控制权反转给了餐厅，你只需要说\"我要什么\"(依赖注入)。</p>', '/storage/default/20250722/100008130101677e40442c743904c769920f70e624c0ffe23c.jpg', '[{\"key\":\"\",\"value\":\"nodejs\"},{\"key\":\"\",\"value\":\"学习经历\"}]', 8, 1753171044);
INSERT INTO `ba_blogdetail` VALUES (4950475669365592064, 'teest', 'test', '[toc]\n[结尾](#end)\n# UI修复设计文档\n\n## 概述\n\n本设计文档详细说明了如何解决首页和整体布局中的UI问题，包括按钮悬停状态优化、布局一致性改进、移动端响应式设计增强和导航栏空间适配。设计遵循现有的设计系统和技术栈。\n\n## 架构\n\n### 样式架构\n\n- **CSS方法论**: 继续使用Tailwind CSS + 自定义CSS的混合方法\n- **响应式策略**: Mobile-first设计，使用Tailwind的响应式断点\n- **主题支持**: 保持现有的亮色/暗色主题切换功能\n- **组件样式**: 使用scoped CSS确保样式隔离\n\n### 布局架构\n\n- **容器系统**: 统一使用`container mx-auto px-4`进行内容约束\n- **导航栏集成**: 实现全局导航栏空间管理\n- **视口管理**: 确保所有内容在视口范围内正确显示\n\n## 组件和接口\n\n### 1. 项目卡片悬停状态优化\n\n#### 当前问题分析\n\n```css\n/* 当前问题：悬停时文字被背景遮盖 */\n.project-link {\n  @apply text-primary dark:text-code-accent;\n  /* 悬停时背景高亮导致文字不可见 */\n}\n```\n\n#### 解决方案设计\n\n```css\n/* 新的悬停状态设计 */\n.project-link {\n  @apply text-primary dark:text-code-accent font-semibold;\n  @apply hover:text-white dark:hover:text-white transition-colors;\n  @apply relative z-10; /* 确保文字在最上层 */\n}\n\n.project-link::before {\n  @apply absolute inset-0 bg-primary dark:bg-code-accent rounded-md;\n  @apply opacity-0 hover:opacity-100 transition-opacity duration-300;\n  @apply -z-10; /* 背景在文字下方 */\n  content: \'\';\n}\n```\n\n### 2. 按钮布局统一化\n\n#### 设计原则\n\n- 所有主要操作按钮使用相同的基础类\n- 保持一致的内边距、外边距和对齐方式\n- 统一的悬停效果和过渡动画\n\n#### 按钮组件设计\n\n```css\n/* 统一的现代按钮样式 */\n.modern-btn {\n  @apply inline-flex items-center justify-center px-8 py-4 rounded-full;\n  @apply font-semibold text-base transition-all duration-300;\n  @apply transform hover:scale-105 active:scale-95;\n  @apply shadow-lg hover:shadow-xl;\n  @apply relative overflow-hidden;\n}\n\n.modern-btn-primary {\n  @apply bg-gradient-to-r from-primary to-teal-500;\n  @apply text-white hover:from-teal-500 hover:to-primary;\n  @apply border-2 border-transparent;\n}\n\n.modern-btn-outline {\n  @apply bg-transparent border-2 border-primary dark:border-code-accent;\n  @apply text-primary dark:text-code-accent;\n  @apply hover:bg-primary hover:text-white;\n  @apply dark:hover:bg-code-accent dark:hover:text-gray-900;\n}\n```\n\n### 3. 移动端响应式设计\n\n#### 断点策略\n\n- **xs**: &lt; 640px (手机竖屏)\n- **sm**: 640px - 768px (手机横屏/小平板)\n- **md**: 768px - 1024px (平板)\n- **lg**: 1024px+ (桌面)\n\n#### 移动端优化设计\n\n```css\n/* 移动端项目卡片优化 */\n@media (max-width: 640px) {\n  .project-card-container {\n    @apply mx-2; /* 减少边距 */\n  }\n\n  .card-modern {\n    @apply hover:transform-none; /* 移动端禁用悬停变换 */\n  }\n\n  .tech-tag {\n    @apply text-xs px-2 py-1; /* 更小的标签 */\n  }\n\n  .action-btn {\n    @apply w-12 h-12 text-sm; /* 适合触摸的按钮大小 */\n  }\n}\n\n/* 移动端统计数据优化 */\n@media (max-width: 640px) {\n  .stats-item {\n    @apply text-center;\n  }\n\n  .stats-item .text-2xl {\n    @apply text-xl; /* 减小字体大小 */\n  }\n}\n```\n\n### 4. 导航栏空间管理\n\n#### 全局布局设计\n\n```css\n/* 全局导航栏空间管理 */\n.main-content {\n  @apply pt-16 md:pt-20; /* 为导航栏预留空间 */\n}\n\n/* 如果导航栏是固定定位 */\n.navbar-fixed {\n  @apply fixed top-0 left-0 right-0 z-50;\n  @apply h-16 md:h-20; /* 定义导航栏高度 */\n}\n\n/* 英雄区特殊处理 */\n.hero-section {\n  @apply min-h-screen;\n  /* 确保英雄区从导航栏下方开始 */\n  min-height: calc(100vh - 4rem); /* 减去导航栏高度 */\n}\n\n@media (min-width: 768px) {\n  .hero-section {\n    min-height: calc(100vh - 5rem);\n  }\n}\n```\n\n### 5. 视口溢出修复\n\n#### 容器约束设计\n\n```css\n/* 全局容器约束 */\n.container {\n  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;\n}\n\n/* 防止元素溢出 */\n.overflow-safe {\n  @apply max-w-full overflow-hidden;\n}\n\n/* 响应式图片 */\n.responsive-img {\n  @apply max-w-full h-auto;\n}\n\n/* 响应式文本 */\n.responsive-text {\n  @apply break-words hyphens-auto;\n}\n```\n\n## 数据模型\n\n### 响应式断点配置\n\n```javascript\nconst breakpoints = {\n  xs: \'0px\',\n  sm: \'640px\',\n  md: \'768px\',\n  lg: \'1024px\',\n  xl: \'1280px\',\n  \'2xl\': \'1536px\'\n};\n```\n\n### 导航栏配置\n\n```javascript\nconst navbarConfig = {\n  height: {\n    mobile: \'4rem\',    // 64px\n    desktop: \'5rem\'    // 80px\n  },\n  position: \'fixed\',\n  zIndex: 50\n};\n```\n\n## 错误处理\n\n### CSS回退策略\n\n```css\n/* 渐进增强的CSS */\n.modern-btn {\n  /* 基础样式 */\n  padding: 1rem 2rem;\n  border-radius: 0.5rem;\n\n  /* 现代浏览器增强 */\n  @supports (backdrop-filter: blur(10px)) {\n    @apply backdrop-blur-sm;\n  }\n\n  /* 动画回退 */\n  @media (prefers-reduced-motion: reduce) {\n    @apply transition-none;\n  }\n}\n```\n\n### 响应式图片错误处理\n\n```css\n.project-image {\n  @apply w-full h-56 object-cover bg-gray-200 dark:bg-gray-800;\n}\n\n.project-image::before {\n  content: \'图片加载中...\';\n  @apply absolute inset-0 flex items-center justify-center;\n  @apply text-gray-500 dark:text-gray-400;\n}\n```\n\n## 测试策略\n\n### 视觉回归测试\n\n- 在不同屏幕尺寸下截图对比\n- 验证按钮悬停状态的可访问性\n- 检查导航栏空间在所有页面的一致性\n\n### 响应式测试\n\n- 测试断点：320px, 375px, 768px, 1024px, 1440px\n- 验证触摸目标大小（最小44px）\n- 检查水平滚动条的出现\n\n### 可访问性测试\n\n- 颜色对比度检查（WCAG 2.1 AA标准）\n- 键盘导航测试\n- 屏幕阅读器兼容性测试\n\n### 性能测试\n\n- CSS文件大小优化\n- 动画性能监控\n- 移动设备性能测试\n\n## 实现优先级\n\n### 高优先级\n\n1. 项目卡片悬停状态修复\n2. 导航栏空间适配\n3. 视口溢出问题修复\n\n### 中优先级\n\n1. 按钮布局统一化\n2. 移动端基础适配\n\n### 低优先级\n\n1. 高级动画效果优化\n2. 性能微调\n3. 额外的响应式增强\n\n## 兼容性考虑\n\n### 浏览器支持\n\n- Chrome 90+\n- Firefox 88+\n- Safari 14+\n- Edge 90+\n\n### 设备支持\n\n- iPhone SE (375px) 及以上\n- Android 设备 (360px) 及以上\n- iPad (768px) 及以上\n- 桌面设备 (1024px) 及以上\n# 设计文档：博客详情页面\n\n## 概述\n\n博客详情页面是SyntaxSeed平台的核心功能之一，用于展示完整的博客文章内容。该页面将以美观、易读的方式呈现文章内容，并提供相关导航和交互功能，增强用户阅读体验。设计将遵循项目的设计系统，确保与整体风格一致，同时优化移动端和桌面端的显示效果。\n\n## 架构\n\n博客详情页面将采用Vue 3的Composition API实现，遵循组件化设计原则。页面将分为以下几个主要部分：\n\n1. **页面容器**：负责整体布局和状态管理\n2. **文章头部**：显示标题、封面图、元信息（日期、阅读时间、标签等）\n3. **文章内容**：显示格式化的文章正文\n4. **文章导航**：提供上一篇/下一篇文章的导航\n5. **评论区域**：显示和提交评论的功能区\n\n页面将使用Vue Router获取文章ID参数，通过API获取文章详情数据，并在组件中进行渲染。\n\n## 组件和接口\n\n### 主要组件\n\n1. **BlogDetailView**：页面主容器组件\n   - 负责获取和管理文章数据\n   - 处理加载状态和错误状态\n   - 协调子组件的渲染\n\n2. **ArticleHeader**：文章头部组件\n   - 显示文章标题、封面图\n   - 显示发布日期、阅读时间、标签等元信息\n   - 提供分享功能\n\n3. **ArticleContent**：文章内容组件\n   - 渲染HTML格式的文章内容\n   - 处理代码高亮\n   - 处理图片查看功能\n\n4. **ArticleNavigation**：文章导航组件\n   - 显示上一篇/下一篇文章的链接\n   - 处理导航交互\n\n5. **CommentSection**：评论区组件\n   - 显示评论列表\n   - 提供评论提交表单\n   - 处理评论分页\n\n### 接口定义\n\n1. **获取文章详情**\n\n   - 已有API：`getBlogDetail(id)`\n\n   - 返回数据结构：\n\n     ```typescript\n     interface BlogDetail {\n       id: number | string;\n       title: string;\n       excerpt: string;\n       content: string;\n       image: string;\n       tags: string[];\n       readTime: number;\n       create_time: number;\n       prevPost?: {\n         id: string | number;\n         title: string;\n       };\n       nextPost?: {\n         id: string | number;\n         title: string;\n       };\n     }\n     ```\n\n2. **获取文章评论**（需要后端实现）\n\n   - API：`getComments(blogId, page, limit)`\n\n   - 返回数据结构：\n\n     ```typescript\n     interface CommentsResponse {\n       data: Comment[];\n       total: number;\n       page: number;\n       limit: number;\n     }\n     \n     interface Comment {\n       id: number | string;\n       author: string;\n       content: string;\n       create_time: number;\n       avatar?: string;\n     }\n     ```\n\n3. **提交评论**（需要后端实现）\n\n   - API：`submitComment(blogId, commentData)`\n\n   - 请求数据结构：\n\n     ```typescript\n     interface CommentSubmission {\n       author: string;\n       content: string;\n       email: string; // 用于头像和通知\n       website?: string; // 可选，用户个人网站\n       blog_id: string; // 文章id\n       parent_id?: string; // 可选，回复的评论ID\n     }\n     ```\n\n## 数据模型\n\n### 文章详情模型\n\n```typescript\ninterface BlogDetail {\n  id: string;\n  title: string;\n  excerpt: string;\n  content: string;\n  image: string;\n  tags: string[];\n  readTime: number;\n  create_time: number;\n  prevPost?: {\n    id: string | number;\n    title: string;\n  };\n  nextPost?: {\n    id: string | number;\n    title: string;\n  };\n}\n```\n\n### 评论模型\n\n```typescript\ninterface Comment {\n  id: string;\n  author: string;\n  content: string;\n  create_time: number;\n  avatar?: string;\n  website?: string; // 用户个人网站\n  parent_id?: string; // 父评论ID，用于回复功能\n  replies?: Comment[]; // 回复列表\n}\n```\n\n### 页面状态模型\n\n```typescript\ninterface PageState {\n  loading: boolean;\n  error: string | null;\n  blog: BlogDetail | null;\n  comments: {\n    data: Comment[];\n    loading: boolean;\n    error: string | null;\n    page: number;\n    limit: number;\n    total: number;\n  };\n}\n```\n\n## 错误处理\n\n1. **文章加载失败**\n   - 显示友好的错误提示\n   - 提供重试按钮\n   - 记录错误日志\n\n2. **评论加载失败**\n   - 显示独立的错误提示\n   - 不影响文章内容的显示\n   - 提供重试按钮\n\n3. **评论提交失败**\n   - 保留用户输入的内容\n   - 显示具体的错误原因\n   - 提供重试选项\n\n## 测试策略\n\n1. **单元测试**\n   - 测试各组件的渲染逻辑\n   - 测试数据处理函数\n   - 测试错误处理逻辑\n\n2. **集成测试**\n   - 测试组件间的交互\n   - 测试API调用和数据流\n   - 测试路由参数处理\n\n3. **端到端测试**\n   - 测试完整的用户流程\n   - 测试不同设备和屏幕尺寸的响应式布局\n   - 测试无障碍功能\n\n## 页面布局设计\n\n### 桌面端布局\n\n```\n+-----------------------------------------------+\n|                 导航栏/头部                    |\n+-----------------------------------------------+\n|                                               |\n|  +-------------------------------------------+  |\n|  |              文章封面图（可选）            |  |\n|  +-------------------------------------------+  |\n|                                               |\n|  +-------------------------------------------+  |\n|  |                文章标题                    |  |\n|  +-------------------------------------------+  |\n|                                               |\n|  +-------------------------------------------+  |\n|  |    发布日期 | 阅读时间 | 标签              |  |\n|  +-------------------------------------------+  |\n|                                               |\n|  +-------------------------------------------+  |\n|  |                                           |  |\n|  |                文章内容                    |  |\n|  |                                           |  |\n|  |                                           |  |\n|  +-------------------------------------------+  |\n|                                               |\n|  +-------------------------------------------+  |\n|  |        上一篇         |        下一篇      |  |\n|  +-------------------------------------------+  |\n|                                               |\n|  +-------------------------------------------+  |\n|  |                评论区                      |  |\n|  |  +-------------------------------------+  |  |\n|  |  |            评论表单                 |  |  |\n|  |  +-------------------------------------+  |  |\n|  |                                           |  |\n|  |  +-------------------------------------+  |  |\n|  |  |            评论列表                 |  |  |\n|  |  +-------------------------------------+  |  |\n|  +-------------------------------------------+  |\n|                                               |\n+-----------------------------------------------+\n|                  页脚                         |\n+-----------------------------------------------+\n```\n\n### 移动端布局\n\n```\n+----------------------------+\n|          导航栏/头部        |\n+----------------------------+\n|                            |\n|  +------------------------+  |\n|  |       文章封面图       |  |\n|  +------------------------+  |\n|                            |\n|  +------------------------+  |\n|  |        文章标题        |  |\n|  +------------------------+  |\n|                            |\n|  +------------------------+  |\n|  |  发布日期 | 阅读时间   |  |\n|  +------------------------+  |\n|                            |\n|  +------------------------+  |\n|  |        标签列表        |  |\n|  +------------------------+  |\n|                            |\n|  +------------------------+  |\n|  |                        |  |\n|  |       文章内容         |  |\n|  |                        |  |\n|  |                        |  |\n|  +------------------------+  |\n|                            |\n|  +------------------------+  |\n|  |  上一篇   |   下一篇   |  |\n|  +------------------------+  |\n|                            |\n|  +------------------------+  |\n|  |        评论区          |  |\n|  |  +------------------+  |  |\n|  |  |     评论表单     |  |  |\n|  |  +------------------+  |  |\n|  |                        |  |\n|  |  +------------------+  |  |\n|  |  |     评论列表     |  |  |\n|  |  +------------------+  |  |\n|  +------------------------+  |\n|                            |\n+----------------------------+\n|           页脚             |\n+----------------------------+\n```\n\n## 交互设计\n\n1. **文章内容交互**\n   - 代码块：提供复制代码按钮\n   - 图片：点击可放大查看\n   - 链接：悬停时显示提示\n\n2. **评论区交互**\n   - 评论表单：\n     - 实时验证输入（名称、邮箱、内容）\n     - 提供名称、邮箱、网站和评论内容的输入字段\n     - 支持Markdown或基本HTML格式化\n     - 显示字数统计和剩余字符数\n   - 提交按钮：\n     - 显示加载状态和动画效果\n     - 提交成功后显示成功反馈\n   - 评论列表：\n     - 支持分页加载更多\n     - 显示用户头像（基于邮箱的Gravatar）\n     - 如有网站链接，用户名可点击跳转\n     - 每条评论提供回复按钮\n     - 回复表单可内嵌在评论下方\n     - 回复内容以树形结构显示，有明显的层级视觉区分\n\n3. **导航交互**\n   - 上一篇/下一篇：悬停时显示文章标题预览\n   - 返回列表：提供返回博客列表的链接\n\n## 无障碍设计\n\n1. **键盘导航**\n   - 所有交互元素可通过Tab键访问\n   - 提供清晰的焦点样式\n\n2. **屏幕阅读器支持**\n   - 使用适当的ARIA标签\n   - 确保内容结构合理\n\n3. **减少动画**\n   - 尊重用户的减少动画偏好\n   - 提供无动画的替代方案\n\n## 性能优化\n\n1. **图片优化**\n   - 使用懒加载技术\n   - 根据设备提供适当尺寸的图片\n\n2. **代码分割**\n   - 将Prism.js等大型库进行按需加载\n   - 使用动态导入减少初始加载时间\n\n3. **缓存策略**\n   - 缓存已加载的文章数据\n   - 实现预加载上一篇/下一篇文章\n\n## 视\n\n觉设计指南\n\n为了确保博客详情页面具有现代科技感的风格，同时保持良好的可读性和用户体验，我们将遵循以下视觉设计指南：\n\n### 整体风格\n\n1. **现代科技感**\n\n   - 使用几何形状和线条创建科技感\n   - 应用微妙的渐变效果增强深度感\n   - 采用简洁、精确的排版强调技术性\n   - 使用适当的动效增强交互体验\n\n2. **色彩方案**\n\n   - 主要使用项目定义的色彩变量：\n\n     ```css\n     --color-primary-light: #F0F7FF;    /* 浅色模式背景 */\n     --color-primary-dark: #0A192F;     /* 深色模式背景 */\n     --color-accent-teal: #2A9D8F;      /* 交互元素 */\n     --color-accent-cyan: #64FFDA;      /* 高亮、代码语法 */\n     ```\n\n   - 添加科技感辅助色：\n\n     ```css\n     --color-tech-blue: #0066FF;        /* 科技蓝，用于强调 */\n     --color-tech-purple: #6E57E0;      /* 科技紫，用于装饰元素 */\n     --color-tech-glow: rgba(100, 255, 218, 0.15); /* 霓虹光效 */\n     ```\n\n3. **排版处理**\n\n   - 文章标题：大号字体，粗体，可应用微妙的渐变效果\n   - 文章内容：优先可读性，适当行高和段落间距\n   - 代码块：使用等宽字体，添加语法高亮和行号\n   - 引用和强调：使用边框和背景色区分\n\n### 元素设计\n\n1. **卡片和容器**\n   - 使用微妙的阴影效果创造层次感\n   - 应用半透明背景和模糊效果（backdrop-filter）\n   - 边角适当圆润（8-12px圆角）\n   - 边框可使用渐变色或微妙发光效果\n\n2. **按钮和交互元素**\n   - 悬停时添加微妙的缩放和发光效果\n   - 使用图标+文字组合增强可识别性\n   - 状态变化时应用平滑过渡动画\n   - 强调按钮可使用渐变背景\n\n3. **装饰元素**\n   - 添加抽象几何形状作为背景装饰\n   - 使用网格或点阵图案增强科技感\n   - 应用微妙的粒子或光效动画\n   - 在关键区域使用强调线条或边框\n\n### 响应式设计考量\n\n1. **桌面端增强**\n   - 使用更复杂的布局和动效\n   - 添加悬停状态的交互反馈\n   - 可展示更多装饰性元素\n\n2. **移动端优化**\n   - 简化视觉元素，专注于内容\n   - 增大触摸目标，优化操作体验\n   - 减少装饰元素，保留核心视觉特征\n\n### 动效指南\n\n1. **微交互**\n   - 按钮点击：轻微缩放+波纹效果\n   - 表单输入：边框颜色变化+微妙发光\n   - 卡片悬停：轻微上浮+阴影增强\n\n2. **页面过渡**\n   - 内容加载：渐显+轻微上移\n   - 页面切换：平滑淡入淡出\n   - 模态框：缩放+透明度变化\n\n3. **装饰动效**\n   - 背景元素：缓慢漂浮或旋转\n   - 强调元素：呼吸效果（透明度或大小变化）\n   - 加载状态：科技感进度条或脉冲效果\n\n&lt;h1 id=”end”&gt;end&lt;/h1&gt;\n&lt;br/&gt;\n', '/storage/default/20250723/mmexport1744732a2f8406e483442888d29521de63ca4f98bc085a2.jpeg', '[]', 1, 1753276147);
INSERT INTO `ba_blogdetail` VALUES (4951410454212644864, 'nodejs实现单点登录', '在Node.js中实现完整的单点登录（SSO）系统，通常采用OAuth 2.0/OpenID Connect协议。以下是详细实现方案：', '在Node.js中实现完整的单点登录（SSO）系统，通常采用OAuth 2.0/OpenID Connect协议。以下是详细实现方案：\n\n---\n\n### 一、SSO核心组件\n1. **身份提供者 (IdP)**: 中央认证服务器（如Keycloak/Auth0/自建OIDC）\n2. **服务提供者 (SP)**: 多个应用系统（如App1, App2）\n\n---\n\n### 二、实现步骤（使用OIDC协议）\n\n#### 1. 搭建OIDC认证服务器（IdP）\n**推荐方案：使用Keycloak**（Java开发，但可通过Docker部署）\n```bash\ndocker run -p 8080:8080 \\\n  -e KEYCLOAK_ADMIN=admin \\\n  -e KEYCLOAK_ADMIN_PASSWORD=admin \\\n  quay.io/keycloak/keycloak:21.1.1 start-dev\n```\n\n#### 2. 创建Node.js客户端应用（SP）\n安装依赖：\n```bash\nnpm install express express-session openid-client dotenv\n```\n\n#### 3. 核心代码实现\n\n**环境变量 (.env)**\n```env\nOIDC_ISSUER=http://localhost:8080/realms/master\nCLIENT_ID=nodejs-app\nCLIENT_SECRET=xxxxxxxxxx\nREDIRECT_URI=http://localhost:3000/auth/callback\nPOST_LOGOUT_REDIRECT_URI=http://localhost:3000\n```\n\n**主应用文件 (app.js)**\n```javascript\nconst express = require(\'express\');\nconst session = require(\'express-session\');\nconst { Issuer, Strategy } = require(\'openid-client\');\nconst dotenv = require(\'dotenv\');\ndotenv.config();\n\nconst app = express();\napp.use(session({\n  secret: \'supersecret\',\n  resave: false,\n  saveUninitialized: true\n}));\n\n// 1. 发现OIDC配置\nasync function setupClient() {\n  const issuer = await Issuer.discover(process.env.OIDC_ISSUER);\n  return new issuer.Client({\n    client_id: process.env.CLIENT_ID,\n    client_secret: process.env.CLIENT_SECRET,\n    redirect_uris: [process.env.REDIRECT_URI],\n    post_logout_redirect_uris: [process.env.POST_LOGOUT_REDIRECT_URI],\n    response_types: [\'code\'],\n  });\n}\n\n// 2. 初始化路由\nsetupClient().then(client => {\n  // 登录路由\n  app.get(\'/login\', (req, res) => {\n    const url = client.authorizationUrl({\n      scope: \'openid profile email\',\n      state: Math.random().toString(36).substring(7),\n      nonce: Math.random().toString(36).substring(7)\n    });\n    res.redirect(url);\n  });\n\n  // 回调路由\n  app.get(\'/auth/callback\', async (req, res) => {\n    try {\n      const params = client.callbackParams(req);\n      const tokenSet = await client.callback(process.env.REDIRECT_URI, params, { state: req.query.state });\n      req.session.tokenSet = tokenSet;\n      req.session.user = tokenSet.claims();\n      res.redirect(\'/\');\n    } catch (err) {\n      res.status(500).send(err.message);\n    }\n  });\n\n  // 受保护路由\n  app.get(\'/\', (req, res) => {\n    if (req.session.user) {\n      res.send(`\n        <h1>SSO Demo</h1>\n        <p>Hello ${req.session.user.name}!</p>\n        <a href=\"/logout\">Logout</a>\n      `);\n    } else {\n      res.send(\'<a href=\"/login\">Login</a>\');\n    }\n  });\n\n  // 登出路由\n  app.get(\'/logout\', (req, res) => {\n    const logoutUrl = client.endSessionUrl({\n      id_token_hint: req.session.tokenSet?.id_token,\n      post_logout_redirect_uri: process.env.POST_LOGOUT_REDIRECT_URI\n    });\n    req.session.destroy();\n    res.redirect(logoutUrl);\n  });\n\n  app.listen(3000, () => console.log(\'App running on http://localhost:3000\'));\n});\n```\n\n---\n\n### 三、Keycloak配置步骤\n1. 访问 `http://localhost:8080` 登录管理控制台\n2. 创建新Realm（或使用master）\n3. 创建Client：\n   - Client ID: `nodejs-app`\n   - Root URL: `http://localhost:3000`\n   - Valid Redirect URIs: `http://localhost:3000/*`\n4. 在Credentials标签页生成Client Secret\n\n---\n\n### 四、多应用SSO集成\n1. **在同一个Realm中创建多个Client** (app1, app2)\n2. **共享会话Cookie**：\n   - 所有应用使用相同顶级域名 (e.g., .example.com)\n   - 统一session配置：\n     ```javascript\n     app.use(session({\n       secret: \'shared-secret\',\n       cookie: { domain: \'.example.com\', maxAge: 24 * 60 * 60 * 1000 }\n     }));\n     ```\n\n---\n\n### 五、会话管理流程\n```mermaid\nsequenceDiagram\n    participant User\n    participant App1\n    participant IdP(Keycloak)\n    participant App2\n\n    User->>App1: 访问受保护资源\n    App1->>User: 302重定向到IdP\n    User->>IdP: 登录界面\n    IdP->>User: 认证成功，返回授权码\n    User->>App1: 携带授权码回调\n    App1->>IdP: 用授权码换取令牌\n    IdP->>App1: 返回ID/Access Token\n    App1->>User: 建立会话，展示内容\n\n    User->>App2: 访问另一个应用\n    App2->>IdP: 检查现有会话\n    IdP->>App2: 返回已有登录状态\n    App2->>User: 直接展示内容\n```\n\n---\n\n### 六、增强安全措施\n1. **PKCE验证**（防止授权码劫持）：\n   ```javascript\n   const verifier = generators.codeVerifier();\n   // 存储verifier到session\n   const challenge = generators.codeChallenge(verifier);\n\n   client.authorizationUrl({\n     code_challenge: challenge,\n     code_challenge_method: \'S256\'\n   });\n   ```\n2. **Token验证**：\n   ```javascript\n   const user = await client.userinfo(accessToken);\n   ```\n3. **HTTPS强制**（生产环境必需）\n4. **CSRF保护**：使用state参数\n\n---\n\n### 七、生产环境建议\n1. **使用专业IdP**：Auth0, Okta, AWS Cognito\n2. **持久化会话存储**：Redis/MongoDB\n3. **集群部署**：使用代理保持会话亲和性\n4. **监控审计**：记录登录事件\n5. **多因素认证**：在IdP端配置MFA\n\n---\n\n通过此方案，用户只需登录一次即可访问所有接入SSO的系统，登出时全局会话销毁。完整示例代码可在[GitHub SSO示例仓库](https://github.com/example/nodejs-sso-demo)获取。', '/storage/default/20250726/1744732390905da9b6eef713899b0cddc8fb466181fce24a64b59.jpeg', '[{\"key\":\"\",\"value\":\"nodejs\"},{\"key\":\"\",\"value\":\"express\"}]', 2, 1753499017);
INSERT INTO `ba_blogdetail` VALUES (4951773566208053248, '寻找两个正序数组的中位数 | 二分查找高效解法', '给定两个大小分别为m和n的正序（升序）数组nums1和nums2。请你找出并返回这两个正序数组的中位数且算法的时间复杂度应为O(log(m + n))', '\n# 寻找两个正序数组的中位数 | 二分查找高效解法\n\n## 问题描述\n\n给定两个大小分别为 `m` 和 `n` 的正序（升序）数组 `nums1` 和 `nums2`。请你找出并返回这两个正序数组的**中位数**，且算法的时间复杂度应为 **O(log(m + n))**。\n\n**示例：**\n```plaintext\n输入：nums1 = [1,3], nums2 = [2]\n输出：2.0\n\n输入：nums1 = [1,2], nums2 = [3,4]\n输出：2.5\n```\n\n## 中位数定义\n- **奇数长度**：中间那个数\n- **偶数长度**：中间两个数的平均值\n\n## 暴力解法（不推荐）\n直接合并数组后排序，时间复杂度 O((m+n)log(m+n))，无法满足题目要求。\n\n## 最优解法：二分查找\n时间复杂度 O(log(min(m,n)))\n\n### 核心思想\n1. **虚拟合并**：不实际合并数组，通过指针划分左右两部分\n2. **二分切分**：在较短数组上二分查找切分点\n3. **边界处理**：确保左半部分 ≤ 右半部分\n\n### 算法步骤\n1. 确保 nums1 是较短的数组（减少计算量）\n2. 计算左半部分总长度 totalLeft = (m+n+1)//2\n3. 在 nums1 上二分查找切分点 i：\n   - 初始范围 left=0， right=m\n   - 计算 nums2 的切分点 j = totalLeft - i\n   - 调整切分点直到满足 nums1[i-1] &lt;= nums2[j] 且 nums2[j-1] &lt;= nums1[i]\n4. 处理边界情况后计算中位数\n\n### JavaScript 实现\n```javascript\nfunction findMedianSortedArrays(nums1, nums2) {\n    // 确保 nums1 是较短的数组\n    if (nums1.length &gt; nums2.length) {\n        [nums1, nums2] = [nums2, nums1];\n    }\n    \n    const m = nums1.length;\n    const n = nums2.length;\n    const totalLeft = Math.floor((m + n + 1) / 2);\n    \n    let left = 0;\n    let right = m;\n    \n    while (left &lt; right) {\n        const i = left + Math.floor((right - left) / 2);\n        const j = totalLeft - i;\n        \n        if (nums1[i] &lt; nums2[j - 1]) {\n            left = i + 1;\n        } else {\n            right = i;\n        }\n    }\n    \n    const i = left;\n    const j = totalLeft - i;\n    \n    const nums1LeftMax = i === 0 ? -Infinity : nums1[i - 1];\n    const nums1RightMin = i === m ? Infinity : nums1[i];\n    const nums2LeftMax = j === 0 ? -Infinity : nums2[j - 1];\n    const nums2RightMin = j === n ? Infinity : nums2[j];\n    \n    if ((m + n) % 2 === 1) {\n        return Math.max(nums1LeftMax, nums2LeftMax);\n    } else {\n        return (Math.max(nums1LeftMax, nums2LeftMax) + Math.min(nums1RightMin, nums2RightMin)) / 2;\n    }\n}\n```\n\n### 复杂度分析\n- 时间复杂度：O(log(min(m,n)))\n- 空间复杂度：O(1)\n\n## 示例解析\n**示例1：nums1 = [1,3], nums2 = [2]**\n1. 虚拟合并：[1,2,3]\n2. 中位数：2（奇数长度）\n\n**示例2：nums1 = [1,2], nums2 = [3,4]**\n1. 虚拟合并：[1,2,3,4]\n2. 中位数：(2+3)/2 = 2.5（偶数长度）\n\n## 关键点总结\n1. **短数组优先**：只在较短数组上二分查找\n2. **边界处理**：使用 Infinity 处理数组越界\n3. **切分条件**：确保左半部分 ≤ 右半部分\n\n## 扩展思考\n- 如何修改算法处理多个数组的情况？\n- 如果数组未排序，最优解法是什么？\n\n---\n\n&gt; 掌握了这个算法，你就攻克了LeetCode第4题的hard难度！建议动手实现并调试几个测试用例加深理解。\n```\n\n这个Markdown文档包含：\n1. 清晰的问题描述和示例\n2. 暴力解法的说明（作为对比）\n3. 最优解法的详细解释\n4. 完整可运行的代码实现\n5. 复杂度分析和示例演算\n6. 关键点总结和扩展思考\n\n可以直接复制到支持Markdown的博客平台使用，代码部分有语法高亮，数学表达式清晰，层次结构分明。', '/storage/default/20250726/1744732390905da9b6eef713899b0cddc8fb466181fce24a64b59.jpeg', '[{\"key\":\"\",\"value\":\"leetcode\"},{\"key\":\"\",\"value\":\"js\"}]', 10, 1753585589);
INSERT INTO `ba_blogdetail` VALUES (4952695916202037248, 'Docker 安装 Mailcow 自建域名邮箱（2025 最新版）', '电子邮箱（Email）是一种通过互联网进行数字信息交换的通信方式。与早期需要双方同时在线的即时通信不同，现代电子邮件允许异步收发，极大提高了沟通效率。', '\n适用系统：任何可安装 Docker 的 Linux x86_64 发行版\n\n预计耗时：30  45 min\n\n---\n\n1. 什么是电子邮箱？\n\n电子邮箱（Email）是一种通过互联网进行数字信息交换的通信方式。与早期需要双方同时在线的即时通信不同，现代电子邮件允许异步收发，极大提高了沟通效率。\n\n目前国内主流免费邮箱：\n\n- 网易：@163.com / @126.com  \n- 腾讯：@qq.com / @foxmail.com  \n\n国外主流：\n\n- Google：@gmail.com  \n- Microsoft：@outlook.com / @hotmail.com  \n- Yahoo：@yahoo.com  \n\n---\n\n2. 为什么要自建邮箱？\n\n维度	自建邮箱	免费邮箱	企业邮箱	\n隐私性	⭐⭐⭐⭐⭐	⭐	⭐⭐	\n可控性	⭐⭐⭐⭐⭐	⭐	⭐⭐	\n维护难度	⭐⭐	⭐⭐⭐⭐⭐	⭐⭐⭐	\n长期成本	¥¥	0	¥¥¥	\n数据风险	低	极高	高	\n\n隐性成本：  \n- 第三方随时可能关停服务或泄露数据  \n- 无法自主备份与迁移  \n- 受政策、法规、公司策略影响大  \n\n自建邮箱的优势：\n\n- 数据 100 % 自主掌控  \n- 域名、服务器可自由迁移  \n- 可按需扩容、定制反垃圾策略  \n- 支持任意子域名、别名、Catch-All  \n\n---\n\n3. 准备工作\n\n3.1 域名\n\n建议使用国际通用顶级域：\n\n- `.com` `.net` `.org`  \n- 避免小众国别域（随时可能被政策影响）\n\n3.2 服务器\n\n资源	官方最低	推荐配置	\nCPU	1 GHz	2 vCPU+	\n内存	6 GB + 1 GB Swap	8 GB	\n硬盘	20 GB 系统盘	40 GB+（含邮件）	\n系统	x86_64 Linux	Debian 12 / Ubuntu 24.04	\n\n网络要求：\n\n- 25、465、587、143、993、995、4190、80、443 端口入站开放  \n- 出站 25 端口需向 VPS 商家申请解封（DigitalOcean、Hetzner、Vultr 等均支持工单解封）  \n- 设置 PTR（反向解析）为 `mail.yourdomain.com`  \n\n---\n\n4. 安装 Docker 与 Docker Compose\n\n```bash\n# 4.1 一键官方脚本\ncurl -fsSL https://get.docker.com -o get-docker.sh\nsudo sh get-docker.sh\n\n# 4.2 验证版本\ndocker --version          # ≥ 24.x\ndocker compose version    # ≥ v2.x\n```\n\n> 国内机器可使用阿里云镜像加速：\n\n`sudo sh get-docker.sh --mirror Aliyun`\n\n---\n\n5. DNS 解析（示例：example.com）\n\n主机记录	类型	值	\nmail	A	192.0.2.25	\nmail	AAAA	2001:db8::25	\n@	MX	10 mail.example.com.	\n@	TXT	\"v=spf1 mx all\"	\ndmarc	TXT	\"v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s;\"	\nautodiscover	CNAME	mail.example.com.	\nautoconfig	CNAME	mail.example.com.	\n\n---\n\n6. 安装 Mailcow\n\n```bash\n# 6.1 获取源码\nsudo apt update && sudo apt install -y git\ncd /opt\nsudo git clone https://github.com/mailcow/mailcow-dockerized\ncd mailcow-dockerized\n\n# 6.2 生成配置（FQDN 填写 mail.example.com）\nsudo bash generate_config.sh\n\n# 6.3 按需编辑\nsudo nano mailcow.conf\n# 推荐修改：\n#   - TZ=Asia/Shanghai\n#   - SKIP_CLAMD=y （内存 &lt; 8 GB 时关闭杀毒）\n\n# 6.4 启动\nsudo docker compose pull\nsudo docker compose up -d\n```\n\n浏览器访问 `https://mail.example.com`\n\n默认账号：`admin`\n\n默认密码：`moohoo`\n\n首次登录立即修改密码并开启 2FA！\n\n---\n\n7. 配置域名 & 邮箱\n\n7.1 添加域名\n\n1. 登录后台 → Configuration → Mail Setup → Domains → +Add domain  \n2. 填写域名 `example.com`，提交  \n3. 如需立即启用 Webmail，勾选 “Add domain and restart SOGo”\n\n7.2 开启 DKIM\n\nConfiguration → ARC/DKIM keys → 选择域名 → 2048 bit → Add\n\n生成的 TXT 记录类似：\n\n```\ndkim._domainkey.example.com TXT \"v=DKIM1;k=rsa;t=s;s=email;p=MIIBIjANBgkqh...\"\n```\n\n&gt; DNS 超 255 字符需拆分为两条 TXT，见官方文档。\n\n7.3 添加用户\n\nMailboxes → +Add mailbox → 填写邮箱、密码、配额 → Save\n\n---\n\n8. 收发测试\n\n- 收信： 用任意外部邮箱给 `test@example.com` 发信，查看是否正常到达。  \n- 发信： 登录 SOGo（`https://mail.example.com/SOGo/`）给 [mail-tester.com](https://mail-tester.com) 发信，得分 10/10 即合格。\n\n---\n\n9. 更新 & 备份\n\n9.1 更新 Mailcow\n\n```bash\ncd /opt/mailcow-dockerized\nsudo ./update.sh\n# 再次执行\nsudo ./update.sh\n```\n\n9.2 定时备份\n\n```bash\n# 每天 3:05 全量备份到 /opt/backup\nsudo crontab -e\n# 添加：\n5 3 * * * cd /opt/mailcow-dockerized && \\\nMAILCOW_BACKUP_LOCATION=/opt/backup \\\n./helper-scripts/backup_and_restore.sh backup all\n```\n\n可同步到远程：\n\n`rsync -avz --delete /opt/backup root@backup-server:/mailcow`\n\n---\n\n10. 迁移服务器\n\n方案一：直接复制 Docker 卷（最快）\n\n```bash\n# 新旧机器均需安装 rsync\nsudo apt install rsync -y\n\n# 旧机器\nsudo systemctl stop docker\nrsync -aHhP --numeric-ids --delete \\\n  /opt/mailcow-dockerized/ root@new:/opt/mailcow-dockerized\nrsync -aHhP --numeric-ids --delete \\\n  /var/lib/docker/volumes/ root@new:/var/lib/docker/volumes\n\n# 新机器\nsudo systemctl restart docker\ncd /opt/mailcow-dockerized\nsudo docker compose pull\nsudo docker compose up -d\n```\n\n方案二：官方备份脚本（最稳）\n\n```bash\n# 旧机器\ncd /opt/mailcow-dockerized\nsudo ./helper-scripts/backup_and_restore.sh backup all\nrsync -avz /opt/backup root@new:/opt\n\n# 新机器全新安装后\nsudo ./helper-scripts/backup_and_restore.sh restore\n```\n\n---\n\n11. FAQ\n\n问题	解决	\n25 端口被封	向 VPS 商家发工单解封，或使用邮件中继（Mailgun、SendGrid）	\n收到延迟高	检查 PTR、DKIM、SPF、DMARC 是否全部正确	\n内存不足	关闭 ClamAV（SKIP_CLAMD=y）或加 Swap	\n升级失败	`git stash && ./update.sh` 再 `git stash pop`	\n\n---\n\n12. 结语\n\n至此，一个完全由你掌控、隐私安全、功能完整的自建邮箱系统就搭建完成了。你可以继续：\n\n- 配置 Catch-All 地址  \n- 开启 Sieve 高级过滤  \n- 集成 Nextcloud 统一认证  \n- 使用 Fail2ban 增强安全  \n\nEnjoy your own mail 🐄💌', '/storage/default/20250726/mmexport1744732294debb64f9808e635eaa778085e7be5528a1423.png', '[]', 10, 1753805495);

-- ----------------------------
-- Table structure for ba_captcha
-- ----------------------------
DROP TABLE IF EXISTS `ba_captcha`;
CREATE TABLE `ba_captcha`  (
  `key` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '验证码Key',
  `code` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '验证码(加密后)',
  `captcha` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '验证码数据',
  `create_time` bigint UNSIGNED NULL DEFAULT NULL COMMENT '创建时间',
  `expire_time` bigint UNSIGNED NULL DEFAULT NULL COMMENT '过期时间',
  PRIMARY KEY (`key`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '验证码表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ba_captcha
-- ----------------------------

-- ----------------------------
-- Table structure for ba_comments
-- ----------------------------
DROP TABLE IF EXISTS `ba_comments`;
CREATE TABLE `ba_comments`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'id',
  `blog_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '关联的博客文章ID',
  `author` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '评论作者名称',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '评论内容',
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '评论创建时间',
  `update_time` timestamp NULL DEFAULT NULL COMMENT '评论更新时间',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '作者头像URL',
  `website` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '作者网站URL',
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '作者邮箱，用于头像和通知',
  `parent_id` bigint UNSIGNED NULL DEFAULT NULL COMMENT '父评论ID，用于回复功能',
  `status` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '状态:0=禁用,1=启用',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 105 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '博客评论表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ba_comments
-- ----------------------------

-- ----------------------------
-- Table structure for ba_config
-- ----------------------------
DROP TABLE IF EXISTS `ba_config`;
CREATE TABLE `ba_config`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '变量名',
  `group` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '分组',
  `title` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '变量标题',
  `tip` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '变量描述',
  `type` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '变量输入组件类型',
  `value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '变量值',
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '字典数据',
  `rule` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '验证规则',
  `extend` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '扩展属性',
  `allow_del` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '允许删除:0=否,1=是',
  `weigh` int NOT NULL DEFAULT 0 COMMENT '权重',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `name`(`name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 290 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '系统配置' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ba_config
-- ----------------------------
INSERT INTO `ba_config` VALUES (1, 'config_group', 'basics', 'Config group', '', 'array', '[{\"key\":\"basics\",\"value\":\"Basics\"},{\"key\":\"mail\",\"value\":\"Mail\"},{\"key\":\"config_quick_entrance\",\"value\":\"Config Quick entrance\"},{\"key\":\"upload\",\"value\":\"\\u4e0a\\u4f20\\u914d\\u7f6e\"},{\"key\":\"website\",\"value\":\"\\u7f51\\u7ad9\\u8bbe\\u7f6e\"}]', NULL, 'required', '', 0, -1);
INSERT INTO `ba_config` VALUES (2, 'site_name', 'basics', 'Site Name', '', 'string', 'SyntaxSeed', NULL, 'required', '', 0, 99);
INSERT INTO `ba_config` VALUES (3, 'record_number', 'basics', 'Record number', '域名备案号', 'string', '闽ICP备xxxx号-1', NULL, '', '', 0, 0);
INSERT INTO `ba_config` VALUES (4, 'version', 'basics', 'Version number', '系统版本号', 'string', 'v1.0.0', NULL, 'required', '', 0, 0);
INSERT INTO `ba_config` VALUES (5, 'time_zone', 'basics', 'time zone', '', 'string', 'Asia/Shanghai', NULL, 'required', '', 0, 0);
INSERT INTO `ba_config` VALUES (6, 'no_access_ip', 'basics', 'No access ip', '禁止访问站点的ip列表,一行一个', 'textarea', '', NULL, '', '', 0, 0);
INSERT INTO `ba_config` VALUES (7, 'smtp_server', 'mail', 'smtp server', '', 'string', 'smtp.qq.com', NULL, '', '', 0, 9);
INSERT INTO `ba_config` VALUES (8, 'smtp_port', 'mail', 'smtp port', '', 'string', '465', NULL, '', '', 0, 8);
INSERT INTO `ba_config` VALUES (9, 'smtp_user', 'mail', 'smtp user', '', 'string', NULL, NULL, '', '', 0, 7);
INSERT INTO `ba_config` VALUES (10, 'smtp_pass', 'mail', 'smtp pass', '', 'string', NULL, NULL, '', '', 0, 6);
INSERT INTO `ba_config` VALUES (11, 'smtp_verification', 'mail', 'smtp verification', '', 'select', 'SSL', '{\"SSL\":\"SSL\",\"TLS\":\"TLS\"}', '', '', 0, 5);
INSERT INTO `ba_config` VALUES (12, 'smtp_sender_mail', 'mail', 'smtp sender mail', '', 'string', NULL, NULL, 'email', '', 0, 4);
INSERT INTO `ba_config` VALUES (13, 'config_quick_entrance', 'config_quick_entrance', 'Config Quick entrance', '', 'array', '[{\"key\":\"\\u6570\\u636e\\u56de\\u6536\\u89c4\\u5219\\u914d\\u7f6e\",\"value\":\"security\\/dataRecycle\"},{\"key\":\"\\u654f\\u611f\\u6570\\u636e\\u89c4\\u5219\\u914d\\u7f6e\",\"value\":\"security\\/sensitiveData\"}]', NULL, '', '', 0, 0);
INSERT INTO `ba_config` VALUES (14, 'backend_entrance', 'basics', 'Backend entrance', '', 'string', '/admin', NULL, 'required', '', 0, 1);
INSERT INTO `ba_config` VALUES (15, 'minTitle', 'basics', '网站小标题', '', 'string', '欢迎来到我的个人博客，我会在这里分享我的成长经历，记录我的编程之旅，分享技术心得，展示项目作品，追踪成长轨迹。', NULL, 'required', '', 1, 98);
INSERT INTO `ba_config` VALUES (16, 'title', 'basics', '网站标题', '标题‘^’分割高亮', 'string', '时迁酱^欢迎来到我的小宇宙', NULL, 'required', '', 1, 97);
INSERT INTO `ba_config` VALUES (17, 'link', 'basics', '链接', '', 'array', '[{\"key\":\"Github^pi pi-github\",\"value\":\"https:\\/\\/github.com\\/timeshiftsauce\"},{\"key\":\"\\u90ae\\u7bb1^pi pi-envelope\",\"value\":\"mailto:sqj@shiqianjiang.cn\"},{\"key\":\"Bilibili^ci icon-bilibili\",\"value\":\"https:\\/\\/space.bilibili.com\\/696709986\"}]', NULL, '', '', 1, 80);
INSERT INTO `ba_config` VALUES (60, 'Introduction', 'basics', '个人介绍', '', 'editor', '<h2>👐我是谁？</h2><blockquote>时迁酱（2008 - 2025? ）没挂！！！😤算起来今年2025年才16岁呐，写这篇文章就是想让大家看看我这个“小屁孩”是怎么掉进代码坑的！💩</blockquote><p style=\"text-indent: 2em; text-align: start;\">我来自福建厦门，现在还是个苦哈哈的高中生。要说我跟编程的孽缘，那得回到<strong>2019年冬天</strong>，小学四年级刚毕业那会儿。谁能想到，一场<strong>疫情</strong>，延迟开学，竟成了我命运的转折点？刚开始嘛，跟所有人一样，宅家就是打游戏打到天昏地暗。直到……我在网上瞎逛，看到了<strong>Search（应该是Scratch？小学生嘛😅）</strong> 的视频！那些花花绿绿的积木块，居然能变出会动的小人、好玩的游戏？我脑子里“叮”的一声：<strong>“哇靠！我也要让大家玩我做的游戏！”☝️</strong></p><h2 style=\"text-align: start;\">😭个人经历 （混）</h2><p style=\"text-indent: 2em; text-align: start;\">理想很丰满，现实嘛……骨感得硌牙。那时候，<strong>电脑？没有！专属手机？做梦！💀</strong> 寒假回老家，百无聊赖，心里那点编程的小火苗又“噌”地冒出来了。没电脑搞Scratch？行！我<strong>拿我妈的手机搜“编程”</strong>！结果，一个叫<strong>“编程猫”</strong>的APP跳了出来，还是个图形化编程的！我那会儿啥也不懂，就觉得：“嘿！手机也能玩？试试就试试！” 谁想到，这玩意儿居然成了我敲开代码大门的<strong>第一块砖头</strong>！</p><p style=\"text-align: start;\">刚开始？完全就是<strong>懵圈状态</stron```language\n\n```\ng>！那些积木块是啥？怎么拼？一脸茫然，瞎点乱撞🤣。后来，我学会了“绝招”——<strong>偷师学艺！</strong> 没错，就是跑去研究别人做的热门作品，像拆乐高一样研究里面的“伪代码”（其实就是积木块怎么搭的）。就这么硬啃，嘿！还真让我捣鼓出了一个<strong>自己的聊天室</strong>！虽然简陋，但发出去那一刻，看到有人玩、有人夸，甚至有了<strong>几个小粉丝</strong>……那种<strong>成就感，简直炸裂！</strong> 心里美得冒泡：<span style=\"color: rgb(247, 89, 171);\"><strong>“编程，也太TM酷了吧！”</strong></span></p><p style=\"text-align: start;\"><img src=\"https://oss.shiqianjiang.cn/storage/default/20250721/image19b56c1de0442d68a44aaa9a5a136b126347537f.png\" alt=\"\" data-href=\"https://oss.shiqianjiang.cn/storage/default/20250721/image19b56c1de0442d68a44aaa9a5a136b126347537f.png\" width=\"\" height=\"\" style=\"\"></p><p style=\"text-align: start;\">可惜好景不长。回到厦门，手机被“没收”，我和编程的“热恋期”被迫中断。那感觉，像丢了心爱的玩具，空落落的。转机出现在我的<strong>英语成绩扑街</strong>之后……大人们一合计，给我买了个<strong>“学习平板”</strong>。我还记得那配置：<strong>1G运存 + 64G储存</strong>，卡得跟PPT似的！微信都能闪退...😭但对我来说，这就是<strong>救命稻草，是重返战场的“诺曼底登陆舰”啊！</strong></p><p style=\"text-align: start;\">就在这台“老爷机”上，我迎来了编程路上的<strong>第一个“高光时刻”</strong>——做出了<strong>《扫雷游戏》！</strong> 对当时的我来说，设计扫雷的逻辑？那可是<strong>史诗级的大工程！</strong> 头发估计都薅掉了几根。结果你猜怎么着？这游戏<strong>上了APP首页推荐！</strong> 我的天！那种感觉，比考了年级第一还爽一百倍！信心爆棚的我，开始疯狂参加平台的各种活动：节日主题、创作大赛……<strong>拿奖拿到手软！</strong> 一等奖、二等奖、三等奖都拿过，周边奖品（学习用品啥的）多到能开个小文具店了。那段时间，我真觉得：<strong>“啊！这就是人生的意义吧！”</strong></p><h3 style=\"text-align: start;\"><strong>《 转机</strong></h3><p style=\"text-align: start;\">后来，《红蓝配对》、《吃豆人》都上了推荐，巅峰之作是《我是小小电学家》，又双叒叕上了首页！感觉人生到达了巅峰！可惜……<strong>小学毕业，成绩不理想</strong>，我被“发配”到漳州读<strong>寄宿学校</strong>了。周末才能摸到手机，编程猫的缘分，就这么<strong>戛然而止</strong>，心里那叫一个<strong>憋屈和不舍</strong>。</p><p style=\"text-align: start;\">不过，《我是小小电学家》还带来了一个意外之喜——居然有采访机会！结果……<strong>人在寄宿，周末才拿到手机，完美错过！</strong> 气得我直拍大腿！周末拿到手机，我想着不能浪费，开始琢磨<strong>学Python</strong>。机缘巧合，我妈朋友搬家，淘汰了一台旧电脑送给我！<strong>人生第一台电脑啊！</strong> 虽然旧，但捧着它，我感觉拥有了全世界！靠着之前编程猫奖品里的Python书，吭哧吭哧学了一阵子。</p><p style=\"text-align: start;\"><img src=\"https://oss.shiqianjiang.cn/storage/default/20250721/imageb8a16423841d2648a772ed3474696c3d192678b2.png\" alt=\"\" data-href=\"https://oss.shiqianjiang.cn/storage/default/20250721/imageb8a16423841d2648a772ed3474696c3d192678b2.png\" width=\"\" height=\"\" style=\"\">这时，编程猫新出的<strong>Coco编辑器</strong>又吸引了我的注意。它有个超酷的功能——可以用<strong>JavaScript写自定义控件（拓展模块）</strong>！图形化？好像已经不太能满足我了。这个JS模块功能像钩子一样勾住了我，开始疯狂探索。也就在这东摸西找的过程中，我在网上刷视频，遇到了改变我方向的<strong>人生导师——@康文昌！</strong> 他的视频《<strong>你的第一行代码</strong>》像一道光，瞬间照亮了我！<strong>“前端开发？就它了！”</strong> 感觉找到了“组织”，一头扎了进去。</p><h2 style=\"text-align: start;\">🤔我的想法规划</h2><p style=\"text-indent: 2em; text-align: start;\">现在嘛？还在高中“挣扎”，但代码已经是我生命里不可或缺的一部分了。心里痒痒的，想学的东西堆成了山：<strong>Nuxt.js, React, Java, Go, NestJS……</strong> 恨不得一天有48小时！2008年10月出生的我，今年才16岁，路还长着呢。回看这一路：从手机APP的积木块，到卡顿平板上的扫雷，再到错过采访的遗憾，最后遇见康老师一头扎进前端……跌跌撞撞，起起落落，但那份因为一行代码运行成功、一个作品被人喜爱而带来的<strong>纯粹快乐和成就感，始终没变。</strong></p><p style=\"text-align: start;\"><br></p><p style=\"text-align: start;\">未来会怎样？谁知道呢！也许会成为很牛的程序员，也许会遇到新的挑战，也或许一事无成。但我知道，只要心里那份对创造的渴望还在，<strong>代码的世界，就永远会为我亮着一盏欢迎的灯。</strong></p><hr/><p style=\"text-align: start;\"><strong>呐，这就是我，时迁酱，一个还在成长的“小码农”的故事。</strong> 😉，祝大家一年31536000秒都是开开心心的</p><p style=\"text-align: right;\"> Last write on 2025-7-21</p>', NULL, 'editorRequired', '', 1, 40);
INSERT INTO `ba_config` VALUES (283, 'upload_mode', 'upload', '存储方式', '', 'select', 'alioss', '{\"local\":\"本地磁盘存储\",\"alioss\":\"阿里云对象存储OSS\"}', 'required', '', 0, 99);
INSERT INTO `ba_config` VALUES (284, 'upload_bucket', 'upload', 'Bucket名称', '请在阿里云对象存储控制台查询', 'string', '<name>', NULL, '', '', 0, 98);
INSERT INTO `ba_config` VALUES (285, 'upload_access_id', 'upload', 'AccessKey ID', '请在阿里云个人中心查询', 'string', '<id>', NULL, '', '', 0, 97);
INSERT INTO `ba_config` VALUES (286, 'upload_secret_key', 'upload', 'AccessKey Secret', '请在阿里云个人中心查询', 'string', '<key>', NULL, '', '', 0, 96);
INSERT INTO `ba_config` VALUES (287, 'upload_url', 'upload', '存储区域', '请选择存储区域', 'select', 'oss-cn-shenzhen', '{\"oss-cn-hangzhou\":\"华东1（杭州） oss-cn-hangzhou\",\"oss-cn-shanghai\":\"华东2（上海） oss-cn-shanghai\",\"oss-cn-nanjing\":\"华东5（南京本地地域） oss-cn-nanjing\",\"oss-cn-fuzhou\":\"华东6（福州本地地域） oss-cn-fuzhou\",\"oss-cn-qingdao\":\"华北1（青岛） oss-cn-qingdao\",\"oss-cn-beijing\":\"华北2（北京） oss-cn-beijing\",\"oss-cn-zhangjiakou\":\"华北 3（张家口） oss-cn-zhangjiakou\",\"oss-cn-huhehaote\":\"华北5（呼和浩特） oss-cn-huhehaote\",\"oss-cn-wulanchabu\":\"华北6（乌兰察布） oss-cn-wulanchabu\",\"oss-cn-shenzhen\":\"华南1（深圳） oss-cn-shenzhen\",\"oss-cn-heyuan\":\"华南2（河源） oss-cn-heyuan\",\"oss-cn-guangzhou\":\"华南3（广州） oss-cn-guangzhou\",\"oss-cn-chengdu\":\"西南1（成都） oss-cn-chengdu\",\"oss-cn-hongkong\":\"中国（香港） oss-cn-hongkong\",\"oss-us-west-1\":\"美国（硅谷） oss-us-west-1\",\"oss-us-east-1\":\"美国（弗吉尼亚） oss-us-east-1\",\"oss-ap-northeast-1\":\"日本（东京） oss-ap-northeast-1\",\"oss-ap-northeast-2\":\"韩国（首尔） oss-ap-northeast-2\",\"oss-ap-southeast-1\":\"新加坡 oss-ap-southeast-1\",\"oss-ap-southeast-2\":\"澳大利亚（悉尼） oss-ap-southeast-2\",\"oss-ap-southeast-3\":\"马来西亚（吉隆坡） oss-ap-southeast-3\",\"oss-ap-southeast-5\":\"印度尼西亚（雅加达） oss-ap-southeast-5\",\"oss-ap-southeast-6\":\"菲律宾（马尼拉） oss-ap-southeast-6\",\"oss-ap-southeast-7\":\"泰国（曼谷） oss-ap-southeast-7\",\"oss-ap-south-1\":\"印度（孟买） oss-ap-south-1\",\"oss-eu-central-1\":\"德国（法兰克福） oss-eu-central-1\",\"oss-eu-west-1\":\"英国（伦敦） oss-eu-west-1\",\"oss-me-east-1\":\"阿联酋（迪拜） oss-me-east-1\",\"oss-cn-hzjbp\":\"华东1金融云 oss-cn-hzjbp\",\"oss-cn-shanghai-finance-1\":\"华东2金融云 oss-cn-shanghai-finance-1\",\"oss-cn-beijing-finance-1\":\"华北2金融云 oss-cn-beijing-finance-1\",\"oss-cn-shenzhen-finance-1\":\"华南1金融云 oss-cn-shenzhen-finance-1\",\"oss-cn-hzfinance\":\"杭州金融云公网 oss-cn-hzfinance\",\"oss-cn-shanghai-finance-1-pub\":\"上海金融云公网 oss-cn-shanghai-finance-1-pub\",\"oss-cn-szfinance\":\"深圳金融云公网 oss-cn-szfinance\",\"oss-cn-beijing-finance-1-pub\":\"北京金融云公网 oss-cn-beijing-finance-1-pub\"}', '', '', 0, 95);
INSERT INTO `ba_config` VALUES (288, 'upload_cdn_url', 'upload', 'CDN地址', '请输入阿里云对象存储的CDN加速域名，以http(s)://开头，比如：https://example.com', 'string', 'https://oss.xxxx.cn', NULL, '', '', 0, 94);

-- ----------------------------
-- Table structure for ba_crud_log
-- ----------------------------
DROP TABLE IF EXISTS `ba_crud_log`;
CREATE TABLE `ba_crud_log`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `table_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '数据表名',
  `comment` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '注释',
  `table` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '数据表数据',
  `fields` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '字段数据',
  `sync` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '同步记录',
  `status` enum('delete','success','error','start') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'start' COMMENT '状态:delete=已删除,success=成功,error=失败,start=生成中',
  `connection` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '数据库连接配置标识',
  `create_time` bigint UNSIGNED NULL DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 39 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = 'CRUD记录表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ba_crud_log
-- ----------------------------

-- ----------------------------
-- Table structure for ba_dataexport
-- ----------------------------
DROP TABLE IF EXISTS `ba_dataexport`;
CREATE TABLE `ba_dataexport`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `admin_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '导出人',
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '' COMMENT '任务名称',
  `main_table` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '' COMMENT '数据源表',
  `field_config` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '字段配置',
  `join_table` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '关联表配置',
  `where_field` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '筛选规则',
  `order_field` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '排序规则',
  `xls_max_number` int UNSIGNED NOT NULL DEFAULT 10000 COMMENT '单个xls最大记录数',
  `concurrent_create_xls` tinyint UNSIGNED NOT NULL DEFAULT 3 COMMENT '并发创建xls',
  `memory_limit` smallint UNSIGNED NOT NULL DEFAULT 128 COMMENT '脚本内存限制(MB)',
  `export_number` int UNSIGNED NULL DEFAULT NULL COMMENT '导出记录数',
  `subtask` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '子任务资料',
  `lastprogress` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '上次导出进度',
  `lastfile` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '' COMMENT '上次导出文件',
  `lastexporttime` int UNSIGNED NULL DEFAULT NULL COMMENT '上次导出时间',
  `createtime` int UNSIGNED NULL DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '导出任务表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ba_dataexport
-- ----------------------------
INSERT INTO `ba_dataexport` VALUES (1, 1, '1', 'typewritertexts', '[{\"name\":\"id\",\"discern\":\"int\",\"title\":\"ID\",\"comment\":\"\"},{\"name\":\"create_time\",\"discern\":\"time\",\"title\":\"创建时间\",\"comment\":\"\"},{\"name\":\"update_time\",\"discern\":\"time\",\"title\":\"修改时间\",\"comment\":\"\"},{\"name\":\"name\",\"discern\":\"text\",\"title\":\"字符串\",\"comment\":\"\"}]', '[]', '[]', NULL, 10000, 3, 128, NULL, '[{\"id\":0,\"status\":0,\"min\":0,\"max\":6,\"sql\":\"SELECT typewritertexts.id as typewritertexts_id,typewritertexts.create_time as typewritertexts_create_time,typewritertexts.update_time as typewritertexts_update_time,typewritertexts.name as typewritertexts_name FROM `ba_typewritertexts` `typewritertexts` LIMIT 0,6\"}]', 0, '', 1752751934, 1752751918);

-- ----------------------------
-- Table structure for ba_migrations
-- ----------------------------
DROP TABLE IF EXISTS `ba_migrations`;
CREATE TABLE `ba_migrations`  (
  `version` bigint NOT NULL,
  `migration_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `start_time` timestamp NULL DEFAULT NULL,
  `end_time` timestamp NULL DEFAULT NULL,
  `breakpoint` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`version`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ba_migrations
-- ----------------------------
INSERT INTO `ba_migrations` VALUES (20230620180908, 'Install', '2025-07-17 10:56:59', '2025-07-17 10:57:01', 0);
INSERT INTO `ba_migrations` VALUES (20230620180916, 'InstallData', '2025-07-17 10:57:01', '2025-07-17 10:57:01', 0);
INSERT INTO `ba_migrations` VALUES (20230622221507, 'Version200', '2025-07-17 10:57:01', '2025-07-17 10:57:03', 0);
INSERT INTO `ba_migrations` VALUES (20230719211338, 'Version201', '2025-07-17 10:57:03', '2025-07-17 10:57:03', 0);
INSERT INTO `ba_migrations` VALUES (20230905060702, 'Version202', '2025-07-17 10:57:03', '2025-07-17 10:57:03', 0);
INSERT INTO `ba_migrations` VALUES (20231112093414, 'Version205', '2025-07-17 10:57:03', '2025-07-17 10:57:03', 0);
INSERT INTO `ba_migrations` VALUES (20231229043002, 'Version206', '2025-07-17 10:57:03', '2025-07-17 10:57:03', 0);
INSERT INTO `ba_migrations` VALUES (20250412134127, 'Version222', '2025-07-17 10:57:03', '2025-07-17 10:57:05', 0);

-- ----------------------------
-- Table structure for ba_project
-- ----------------------------
DROP TABLE IF EXISTS `ba_project`;
CREATE TABLE `ba_project`  (
  `weigh` int NULL DEFAULT NULL COMMENT '权重',
  `id` bigint UNSIGNED NOT NULL COMMENT 'ID',
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '标题/项目',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '内容/介绍',
  `images` varchar(1500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '项目图',
  `category` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '全栈应用' COMMENT '分类',
  `checkbox` set('opt0','opt1','opt2','opt3','opt4','opt5','opt6','opt7','opt8','opt9','opt10','opt11','opt12','opt13','opt14','opt15','opt16','opt17','opt18') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '技术标签:opt0=HTML,opt1=CSS,opt2=JavaScript,opt3=React,opt4=Vue,opt5=Nodejs,opt6=Java,opt7=Python,opt8=php,opt9=pinia,opt10=vite,opt11=NestJS,opt12=TypeScript,opt13=OBS,opt14=electron,opt15=JQ,opt16=Express,opt17=SASS/LESS,opt18=Webpack',
  `features` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '项目特点',
  `techStack` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '技术栈',
  `demoUrl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '项目地址',
  `codeUrl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '代码仓库地址',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '我的项目列表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ba_project
-- ----------------------------
INSERT INTO `ba_project` VALUES (8, 4948237527648571392, 'SyntaxSeed - 开发者成长日志 | 技术分析博客', '一个面向高中生开发者的简约高端技术博客，展示网站开发历程和技术分析。', '/storage/default/20250718/PixPin_2025-07-faebbb626cb22db1b11040a724adb8b2437e205a.png,/storage/default/20250718/PixPin_2025-07-5e7eaf090e5c88597f7d2b860659d92cbc51e245.png,/storage/default/20250718/Defaultd3f3587ea2c8ee370d72c2501cab8ca432cd616e.jpg', '全栈应用', 'opt4,opt5,opt16', '[{\"key\":\"\",\"value\":\"响应式设计，适配各种设备屏幕\"},{\"key\":\"\",\"value\":\"暗黑\\/明亮模式切换\"},{\"key\":\"\",\"value\":\"博客文章阅读和分类\"},{\"key\":\"\",\"value\":\"项目展示和筛选\"},{\"key\":\"\",\"value\":\"成长时间轴\"},{\"key\":\"\",\"value\":\"技术栈展示\"},{\"key\":\"\",\"value\":\"3D卡片翻转效果\"},{\"key\":\"\",\"value\":\"波浪背景动画\"}]', '[{\"key\":\"\",\"value\":\"Vue 3\"},{\"key\":\"\",\"value\":\"Vite\"},{\"key\":\"\",\"value\":\"Tailwind CSS\"},{\"key\":\"\",\"value\":\"PrimeVue\"},{\"key\":\"\",\"value\":\"Framer Motion\"},{\"key\":\"\",\"value\":\"Prism.js\"},{\"key\":\"\",\"value\":\"NodeJS\"}]', 'https://shiqianjiang.cn/', 'https://gitee.com/sqjcode/syntaxseed/tree/master/');
INSERT INTO `ba_project` VALUES (5, 4948693097501429760, '侨聊社区', '校园墙app和web端', '/storage/default/20250718/100008310152c78f75abe70d063e488c40bffbd56f5e913ae4.jpg', '全栈应用', 'opt0,opt1,opt2,opt4,opt6,opt17', '[{\"key\":\"\",\"value\":\"uniapp开发\"},{\"key\":\"\",\"value\":\"3端支持\"},{\"key\":\"\",\"value\":\"功能齐全\"}]', '[{\"key\":\"\",\"value\":\"java\"},{\"key\":\"\",\"value\":\"uniapp\"}]', 'https://oss.shiqianjiang.cn', '');

-- ----------------------------
-- Table structure for ba_security_data_recycle
-- ----------------------------
DROP TABLE IF EXISTS `ba_security_data_recycle`;
CREATE TABLE `ba_security_data_recycle`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '规则名称',
  `controller` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '控制器',
  `controller_as` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '控制器别名',
  `data_table` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '对应数据表',
  `connection` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '数据库连接配置标识',
  `primary_key` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '数据表主键',
  `status` tinyint UNSIGNED NOT NULL DEFAULT 1 COMMENT '状态:0=禁用,1=启用',
  `update_time` bigint UNSIGNED NULL DEFAULT NULL COMMENT '更新时间',
  `create_time` bigint UNSIGNED NULL DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '回收规则表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ba_security_data_recycle
-- ----------------------------
INSERT INTO `ba_security_data_recycle` VALUES (1, '管理员', 'auth/Admin.php', 'auth/admin', 'admin', '', 'id', 1, 1752721021, 1752721021);
INSERT INTO `ba_security_data_recycle` VALUES (2, '管理员日志', 'auth/AdminLog.php', 'auth/adminlog', 'admin_log', '', 'id', 1, 1752721021, 1752721021);
INSERT INTO `ba_security_data_recycle` VALUES (3, '菜单规则', 'auth/Menu.php', 'auth/menu', 'menu_rule', '', 'id', 1, 1752721021, 1752721021);
INSERT INTO `ba_security_data_recycle` VALUES (4, '系统配置项', 'routine/Config.php', 'routine/config', 'config', '', 'id', 1, 1752721021, 1752721021);
INSERT INTO `ba_security_data_recycle` VALUES (5, '会员', 'user/User.php', 'user/user', 'user', '', 'id', 1, 1752721021, 1752721021);
INSERT INTO `ba_security_data_recycle` VALUES (6, '数据回收规则', 'security/DataRecycle.php', 'security/datarecycle', 'security_data_recycle', '', 'id', 1, 1752721021, 1752721021);

-- ----------------------------
-- Table structure for ba_security_data_recycle_log
-- ----------------------------
DROP TABLE IF EXISTS `ba_security_data_recycle_log`;
CREATE TABLE `ba_security_data_recycle_log`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `admin_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '操作管理员',
  `recycle_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '回收规则ID',
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '回收的数据',
  `data_table` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '数据表',
  `connection` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '数据库连接配置标识',
  `primary_key` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '数据表主键',
  `is_restore` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否已还原:0=否,1=是',
  `ip` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '操作者IP',
  `useragent` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'User-Agent',
  `create_time` bigint UNSIGNED NULL DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '数据回收记录表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ba_security_data_recycle_log
-- ----------------------------

-- ----------------------------
-- Table structure for ba_security_sensitive_data
-- ----------------------------
DROP TABLE IF EXISTS `ba_security_sensitive_data`;
CREATE TABLE `ba_security_sensitive_data`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '规则名称',
  `controller` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '控制器',
  `controller_as` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '控制器别名',
  `data_table` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '对应数据表',
  `connection` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '数据库连接配置标识',
  `primary_key` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '数据表主键',
  `data_fields` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '敏感数据字段',
  `status` tinyint UNSIGNED NOT NULL DEFAULT 1 COMMENT '状态:0=禁用,1=启用',
  `update_time` bigint UNSIGNED NULL DEFAULT NULL COMMENT '更新时间',
  `create_time` bigint UNSIGNED NULL DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '敏感数据规则表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ba_security_sensitive_data
-- ----------------------------
INSERT INTO `ba_security_sensitive_data` VALUES (1, '管理员数据', 'auth/Admin.php', 'auth/admin', 'admin', '', 'id', '{\"username\":\"用户名\",\"mobile\":\"手机\",\"password\":\"密码\",\"status\":\"状态\"}', 1, 1752721021, 1752721021);
INSERT INTO `ba_security_sensitive_data` VALUES (2, '会员数据', 'user/User.php', 'user/user', 'user', '', 'id', '{\"username\":\"用户名\",\"mobile\":\"手机号\",\"password\":\"密码\",\"status\":\"状态\",\"email\":\"邮箱地址\"}', 1, 1752721021, 1752721021);
INSERT INTO `ba_security_sensitive_data` VALUES (3, '管理员权限', 'auth/Group.php', 'auth/group', 'admin_group', '', 'id', '{\"rules\":\"权限规则ID\"}', 1, 1752721021, 1752721021);

-- ----------------------------
-- Table structure for ba_security_sensitive_data_log
-- ----------------------------
DROP TABLE IF EXISTS `ba_security_sensitive_data_log`;
CREATE TABLE `ba_security_sensitive_data_log`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `admin_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '操作管理员',
  `sensitive_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '敏感数据规则ID',
  `data_table` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '数据表',
  `connection` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '数据库连接配置标识',
  `primary_key` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '数据表主键',
  `data_field` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '被修改字段',
  `data_comment` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '被修改项',
  `id_value` int NOT NULL DEFAULT 0 COMMENT '被修改项主键值',
  `before` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '修改前',
  `after` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '修改后',
  `ip` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '操作者IP',
  `useragent` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'User-Agent',
  `is_rollback` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否已回滚:0=否,1=是',
  `create_time` bigint UNSIGNED NULL DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '敏感数据修改记录' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ba_security_sensitive_data_log
-- ----------------------------
INSERT INTO `ba_security_sensitive_data_log` VALUES (1, 1, 3, 'admin_group', '', 'id', 'rules', '权限规则ID', 4, '55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75', NULL, '47.96.72.224', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 0, 1753095810);
INSERT INTO `ba_security_sensitive_data_log` VALUES (2, 1, 3, 'admin_group', '', 'id', 'rules', '权限规则ID', 4, '1,89,55,56,60,59,58,57,61,65,64,63,62,66,70,69,68,67,71,75,74,73,72,142,129,115,109,91,141,127,128,114,108,90', NULL, '47.96.72.224', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 0, 1753095910);

-- ----------------------------
-- Table structure for ba_tech_stack
-- ----------------------------
DROP TABLE IF EXISTS `ba_tech_stack`;
CREATE TABLE `ba_tech_stack`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `status` tinyint UNSIGNED NOT NULL DEFAULT 1 COMMENT '状态:0=禁用,1=启用',
  `create_time` bigint UNSIGNED NULL DEFAULT NULL COMMENT '创建时间',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '技术名称',
  `level` int NULL DEFAULT NULL COMMENT '掌握度',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '技术栈_技术云图' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ba_tech_stack
-- ----------------------------
INSERT INTO `ba_tech_stack` VALUES (1, 1, 1752749297, 'HTML5', 90);
INSERT INTO `ba_tech_stack` VALUES (2, 1, 1752749312, 'CSS3', 85);
INSERT INTO `ba_tech_stack` VALUES (3, 1, 1752749325, 'JavaScript', 80);
INSERT INTO `ba_tech_stack` VALUES (4, 1, 1752749345, 'TypeScript', 50);
INSERT INTO `ba_tech_stack` VALUES (5, 1, 1752749375, 'Vue.js', 86);
INSERT INTO `ba_tech_stack` VALUES (6, 1, 1752749397, 'Node.js', 66);
INSERT INTO `ba_tech_stack` VALUES (7, 1, 1752749415, 'MySql', 70);
INSERT INTO `ba_tech_stack` VALUES (8, 1, 1752749432, 'Git', 70);
INSERT INTO `ba_tech_stack` VALUES (9, 1, 1752749445, 'Sass', 70);
INSERT INTO `ba_tech_stack` VALUES (10, 1, 1752749459, 'Express', 70);
INSERT INTO `ba_tech_stack` VALUES (11, 1, 1752749484, 'RESTful API', 50);
INSERT INTO `ba_tech_stack` VALUES (12, 1, 1752818907, 'Router', 80);
INSERT INTO `ba_tech_stack` VALUES (13, 1, 1752852716, 'UniApp', 88);

-- ----------------------------
-- Table structure for ba_test_build
-- ----------------------------
DROP TABLE IF EXISTS `ba_test_build`;
CREATE TABLE `ba_test_build`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '标题',
  `keyword_rows` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '关键词',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '内容',
  `views` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '浏览量',
  `likes` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '有帮助数',
  `dislikes` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '无帮助数',
  `note_textarea` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '备注',
  `status` tinyint UNSIGNED NOT NULL DEFAULT 1 COMMENT '状态:0=禁用,1=启用',
  `weigh` int NOT NULL DEFAULT 0 COMMENT '权重',
  `update_time` bigint UNSIGNED NULL DEFAULT NULL COMMENT '更新时间',
  `create_time` bigint UNSIGNED NULL DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '知识库表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ba_test_build
-- ----------------------------

-- ----------------------------
-- Table structure for ba_timeline
-- ----------------------------
DROP TABLE IF EXISTS `ba_timeline`;
CREATE TABLE `ba_timeline`  (
  `id` bigint UNSIGNED NOT NULL COMMENT 'ID',
  `update_time` bigint UNSIGNED NULL DEFAULT NULL COMMENT '修改时间',
  `create_time` bigint UNSIGNED NULL DEFAULT NULL COMMENT '创建时间',
  `year` year NULL DEFAULT NULL COMMENT '年份',
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '标题',
  `data` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '日期范围',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '内容',
  `technolog` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '标签',
  `skills` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '技巧',
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '图片',
  `string` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '链接',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '时间轴' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ba_timeline
-- ----------------------------
INSERT INTO `ba_timeline` VALUES (4948168092124450816, 1752728155, 1752725977, 2023, '全栈应用开发', '2023年7月 - 至今', '开始学习全栈开发，掌握了MERN技术栈（MongoDB、Express、React、Node.js），并完成了第一个完整的全栈应用。', '[{\"key\":\"\",\"value\":\"React\"},{\"key\":\"\",\"value\":\"Node.js\"},{\"key\":\"\",\"value\":\"MongoDB\"},{\"key\":\"\",\"value\":\"Express\"},{\"key\":\"\",\"value\":\"JWT\"}]', '[{\"key\":\"React\",\"value\":\"75\"},{\"key\":\"Node.js\",\"value\":\"65\"},{\"key\":\"MongoDB\",\"value\":\"60\"}]', '/storage/default/20250717/174473239094772c611bf83d95117fcc517555dac97ef81fb902f.jpeg', '');
INSERT INTO `ba_timeline` VALUES (4948700055994372096, 1752853401, 1752852807, 2019, '开始入手图形化编程', '2019年1月-2021年11月', '当时懵懵懂懂 初识编程对此感兴趣想要做一个自己的游戏，最后收获了许多知识，也得到了图形化社区（编程猫）的奖品：抱枕 书包 鼠标 周边娃偶等。未来可期', '[{\"key\":\"\",\"value\":\"图形化编程\"},{\"key\":\"\",\"value\":\"初识编程\"},{\"key\":\"\",\"value\":\"编程猫\"},{\"key\":\"\",\"value\":\"社区大佬\"}]', '[{\"key\":\"图形化编程\",\"value\":\"98\"},{\"key\":\"逻辑能力\",\"value\":\"80\"},{\"key\":\"Python\",\"value\":\"40\"}]', '/storage/default/20250718/1000083104955e7598f84478faf797bd43479daa0a3a1e0dc9.png', 'https://shequ.codemao.cn/user/6776013');
INSERT INTO `ba_timeline` VALUES (4948703936262443008, 1752853733, 1752853733, 2022, '迷茫乱撞入手Python 后退坑 再入js', '2022年1月至2022年7月', '图形化退坑后想要有一个真正的编程作品 开始迷茫前行 后面发现Python流行就开始学习 后面又被Coco（编程猫旗下 开发安卓app的）吸引。里面有一个自定义控件是通过JavaScript编写 从此开始了新的火花', '[{\"key\":\"\",\"value\":\"Python\"},{\"key\":\"\",\"value\":\"迷茫\"},{\"key\":\"\",\"value\":\"Coco 编辑器\"},{\"key\":\"\",\"value\":\"自定义控件\"},{\"key\":\"\",\"value\":\"JavaScript\"}]', '[{\"key\":\"JavaScript\",\"value\":\"10\"},{\"key\":\"Python\",\"value\":\"72\"}]', '', '');

-- ----------------------------
-- Table structure for ba_token
-- ----------------------------
DROP TABLE IF EXISTS `ba_token`;
CREATE TABLE `ba_token`  (
  `token` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'Token',
  `type` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '类型',
  `user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '用户ID',
  `create_time` bigint UNSIGNED NULL DEFAULT NULL COMMENT '创建时间',
  `expire_time` bigint UNSIGNED NULL DEFAULT NULL COMMENT '过期时间',
  PRIMARY KEY (`token`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '用户Token表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ba_token
-- ----------------------------
-- ----------------------------
-- Table structure for ba_typewritertexts
-- ----------------------------
DROP TABLE IF EXISTS `ba_typewritertexts`;
CREATE TABLE `ba_typewritertexts`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `create_time` bigint UNSIGNED NULL DEFAULT NULL COMMENT '创建时间',
  `update_time` bigint UNSIGNED NULL DEFAULT NULL COMMENT '修改时间',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '字符串',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 18 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ba_typewritertexts
-- ----------------------------
INSERT INTO `ba_typewritertexts` VALUES (12, NULL, NULL, '热爱编程 💻');
INSERT INTO `ba_typewritertexts` VALUES (13, NULL, NULL, '热爱钻研 📚');
INSERT INTO `ba_typewritertexts` VALUES (14, NULL, NULL, '热爱分享 🌟');
INSERT INTO `ba_typewritertexts` VALUES (15, NULL, NULL, '前端开发者 🚀');
INSERT INTO `ba_typewritertexts` VALUES (16, NULL, NULL, '全栈探索者 🔍');
INSERT INTO `ba_typewritertexts` VALUES (17, 1752722364, 1752722392, '善于思考💖');

-- ----------------------------
-- Table structure for ba_user
-- ----------------------------
DROP TABLE IF EXISTS `ba_user`;
CREATE TABLE `ba_user`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `group_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '分组ID',
  `username` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '用户名',
  `nickname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '昵称',
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '邮箱',
  `mobile` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '手机',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '头像',
  `gender` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '性别:0=未知,1=男,2=女',
  `birthday` date NULL DEFAULT NULL COMMENT '生日',
  `money` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '余额',
  `score` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '积分',
  `last_login_time` bigint UNSIGNED NULL DEFAULT NULL COMMENT '上次登录时间',
  `last_login_ip` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '上次登录IP',
  `login_failure` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '登录失败次数',
  `join_ip` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '加入IP',
  `join_time` bigint UNSIGNED NULL DEFAULT NULL COMMENT '加入时间',
  `motto` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '签名',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '密码',
  `salt` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '密码盐（废弃待删）',
  `status` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '状态:enable=启用,disable=禁用',
  `update_time` bigint UNSIGNED NULL DEFAULT NULL COMMENT '更新时间',
  `create_time` bigint UNSIGNED NULL DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '会员表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ba_user
-- ----------------------------
INSERT INTO `ba_user` VALUES (1, 1, 'user', 'User', '18888888888@qq.com', '18888888888', '', 2, '2025-07-17', 0, 0, NULL, '', 0, '', NULL, '', '$2y$10$7sSt1sfqZWCK..KcRMilJetBZGZ9WG8tR97.tfP3qRNzyHWnVtD6S', '', 'enable', 1752721021, 1752721021);

-- ----------------------------
-- Table structure for ba_user_group
-- ----------------------------
DROP TABLE IF EXISTS `ba_user_group`;
CREATE TABLE `ba_user_group`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '组名',
  `rules` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '权限节点',
  `status` tinyint UNSIGNED NOT NULL DEFAULT 1 COMMENT '状态:0=禁用,1=启用',
  `update_time` bigint UNSIGNED NULL DEFAULT NULL COMMENT '更新时间',
  `create_time` bigint UNSIGNED NULL DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '会员组表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ba_user_group
-- ----------------------------
INSERT INTO `ba_user_group` VALUES (1, '默认分组', '*', 1, 1752721021, 1752721021);
INSERT INTO `ba_user_group` VALUES (2, 'syntaxseed', '*', 1, 1753521842, 1753521842);

-- ----------------------------
-- Table structure for ba_user_money_log
-- ----------------------------
DROP TABLE IF EXISTS `ba_user_money_log`;
CREATE TABLE `ba_user_money_log`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '会员ID',
  `money` int NOT NULL DEFAULT 0 COMMENT '变更余额',
  `before` int NOT NULL DEFAULT 0 COMMENT '变更前余额',
  `after` int NOT NULL DEFAULT 0 COMMENT '变更后余额',
  `memo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '备注',
  `create_time` bigint UNSIGNED NULL DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '会员余额变动表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ba_user_money_log
-- ----------------------------

-- ----------------------------
-- Table structure for ba_user_rule
-- ----------------------------
DROP TABLE IF EXISTS `ba_user_rule`;
CREATE TABLE `ba_user_rule`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `pid` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '上级菜单',
  `type` enum('route','menu_dir','menu','nav_user_menu','nav','button') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'menu' COMMENT '类型:route=路由,menu_dir=菜单目录,menu=菜单项,nav_user_menu=顶栏会员菜单下拉项,nav=顶栏菜单项,button=页面按钮',
  `title` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '标题',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '规则名称',
  `path` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '路由路径',
  `icon` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '图标',
  `menu_type` enum('tab','link','iframe') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'tab' COMMENT '菜单类型:tab=选项卡,link=链接,iframe=Iframe',
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'Url',
  `component` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '组件路径',
  `no_login_valid` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '未登录有效:0=否,1=是',
  `extend` enum('none','add_rules_only','add_menu_only') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'none' COMMENT '扩展属性:none=无,add_rules_only=只添加为路由,add_menu_only=只添加为菜单',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '备注',
  `weigh` int NOT NULL DEFAULT 0 COMMENT '权重',
  `status` tinyint UNSIGNED NOT NULL DEFAULT 1 COMMENT '状态:0=禁用,1=启用',
  `update_time` bigint UNSIGNED NULL DEFAULT NULL COMMENT '更新时间',
  `create_time` bigint UNSIGNED NULL DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `pid`(`pid` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '会员菜单权限规则表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ba_user_rule
-- ----------------------------
INSERT INTO `ba_user_rule` VALUES (1, 0, 'menu_dir', '我的账户', 'account', 'account', 'fa fa-user-circle', 'tab', '', '', 0, 'none', '', 98, 1, 1752721021, 1752721021);
INSERT INTO `ba_user_rule` VALUES (2, 1, 'menu', '账户概览', 'account/overview', 'account/overview', 'fa fa-home', 'tab', '', '/src/views/frontend/user/account/overview.vue', 0, 'none', '', 99, 1, 1752721021, 1752721021);
INSERT INTO `ba_user_rule` VALUES (3, 1, 'menu', '个人资料', 'account/profile', 'account/profile', 'fa fa-user-circle-o', 'tab', '', '/src/views/frontend/user/account/profile.vue', 0, 'none', '', 98, 1, 1752721021, 1752721021);
INSERT INTO `ba_user_rule` VALUES (4, 1, 'menu', '修改密码', 'account/changePassword', 'account/changePassword', 'fa fa-shield', 'tab', '', '/src/views/frontend/user/account/changePassword.vue', 0, 'none', '', 97, 1, 1752721021, 1752721021);
INSERT INTO `ba_user_rule` VALUES (5, 1, 'menu', '积分记录', 'account/integral', 'account/integral', 'fa fa-tag', 'tab', '', '/src/views/frontend/user/account/integral.vue', 0, 'none', '', 96, 1, 1752721021, 1752721021);
INSERT INTO `ba_user_rule` VALUES (6, 1, 'menu', '余额记录', 'account/balance', 'account/balance', 'fa fa-money', 'tab', '', '/src/views/frontend/user/account/balance.vue', 0, 'none', '', 95, 1, 1752721021, 1752721021);

-- ----------------------------
-- Table structure for ba_user_score_log
-- ----------------------------
DROP TABLE IF EXISTS `ba_user_score_log`;
CREATE TABLE `ba_user_score_log`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '会员ID',
  `score` int NOT NULL DEFAULT 0 COMMENT '变更积分',
  `before` int NOT NULL DEFAULT 0 COMMENT '变更前积分',
  `after` int NOT NULL DEFAULT 0 COMMENT '变更后积分',
  `memo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '备注',
  `create_time` bigint UNSIGNED NULL DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '会员积分变动表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ba_user_score_log
-- ----------------------------

-- ----------------------------
-- Table structure for typewritertexts
-- ----------------------------
DROP TABLE IF EXISTS `typewritertexts`;
CREATE TABLE `typewritertexts`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of typewritertexts
-- ----------------------------
INSERT INTO `typewritertexts` VALUES (1, '2025-07-16 19:41:37', '2025-07-16 19:41:37', '热爱编程 💻');
INSERT INTO `typewritertexts` VALUES (2, '2025-07-16 19:41:37', '2025-07-16 19:41:37', '热爱钻研 📚');
INSERT INTO `typewritertexts` VALUES (3, '2025-07-16 19:41:37', '2025-07-16 19:41:37', '热爱分享 🌟');
INSERT INTO `typewritertexts` VALUES (4, '2025-07-16 19:41:37', '2025-07-16 19:41:37', '前端开发者 🚀');
INSERT INTO `typewritertexts` VALUES (5, '2025-07-16 19:41:37', '2025-07-16 19:41:37', '全栈探索者 🔍');

SET FOREIGN_KEY_CHECKS = 1;
