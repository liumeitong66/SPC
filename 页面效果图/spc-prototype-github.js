(function () {
  'use strict';

  const pageMap = {
    '项目统计': '01-项目统计首页.html',
    '设备分析': '09-设备质量分析.html',
    '单板查询': '02-单板查询与结果追溯.html',
    '缺陷分析': '03-缺陷分析.html',
    '误报分析': '04-误报分析.html',
    '不良分析': '04A-不良导出.html',
    '告警分析': '13-品质预警.html',
    '告警管理': '14-告警管理.html',
    '告警规则详情': '13A-告警规则详情.html',
    '设备运行监控': '07-数据上传监控.html',
    '设备管理': '08-设备与区域管理.html',
    '用户管理': '10-用户管理.html',
    '角色管理': '11-角色管理.html',
    '个人中心': '12-个人中心.html'
  };

  const choices = {
    '时间范围': ['最近 24 小时', '最近 7 天', '最近 30 天', '自定义时间范围'],
    '监控时间': ['最近 1 小时', '最近 24 小时', '最近 7 天'],
    '设备': ['全部设备（12）', '区域A · AOI-01', '区域B · AOI-02', '区域C · AOI-03', '区域D · AOI-04'],
    '设备名称': ['全部设备（4）', 'AOI-01', 'AOI-02', 'AOI-03', 'AOI-04'],
    '设备SN': ['全部设备SN', 'SI1020E1112', 'SI1020E1148', 'SI1020E1186', 'SI1020E1206', 'SI1020E1238', 'SI1020E1262', 'SI1020E1284', 'SI1020E1308', 'SI1020E1326', 'SI1020E1342', 'SI1020E1365', 'SI1020E1388'],
    '检测结果': ['全部', '良好', '不良', '直通', '误报', '漏报'],
    '模板名称': ['全部模板', '3267504J2G_A面', '1-A', '329134S_P129', '155042F_P9'],
    '项目 / 程序': ['3267504J2G_A面', '1-A', '329134S_P129'],
    '分析维度': ['不良类型', '封装类型', '料号', '位号'],
    '位号': ['R118', 'D2', 'C56', '全部位号'],
    '检测项': ['X偏移（mm）', 'Y偏移（mm）', '角度（°）'],
    '控制图': ['I-MR', 'Xbar-R'],
    '上传状态': ['全部状态', '正常', '延迟', '中断'],
    '连接状态': ['全部状态', '已连接', '未连接', '未监控'],
    '传输状态': ['全部状态', '正常', '延迟', '中断', '未监控'],
    '记录类型': ['全部类型', '连接变化', '传输异常', '数据缺失', '补传任务', '人工操作'],
    '处理结果': ['全部结果', '待处理', '处理中', '成功', '部分成功', '失败', '无需处理'],
    '数据类型': ['全部类型', 'MES JSON', '项目文件', 'NG图片'],
    '所属区域': ['全部区域', '区域A', '区域B', '区域C', '区域D', '未分配'],
    '设备状态': ['全部状态', '启用', '停用'],
    '启用状态': ['全部状态', '启用', '停用'],
    '状态': ['全部', '启用', '停用']
  };

  const menuPermissionTree = [
    { id: 'project-statistics', name: '项目统计', selected: true, features: ['查看与查询', '显示列', '导出所选', '查看项目明细'] },
    { id: 'device-quality', name: '设备分析', selected: true, features: ['查看与查询', '显示列', '导出所选', '查看设备明细', '查看本机 SPC'] },
    { id: 'board-query', name: '单板查询', selected: true, features: ['查看与查询', '导出所选'] },
    { id: 'defect-analysis', name: '缺陷分析', selected: true, features: ['查看与查询', '自定义列', '导出所选'] },
    { id: 'false-positive', name: '误报分析', features: ['查看与查询', '自定义列', '导出所选', '查看设备明细'] },
    { id: 'defect-analysis-machine', name: '不良分析', features: ['查看与查询', '自定义列', '导出所选', '查看不良明细'] },
    { id: 'alert-analysis', name: '告警分析', selected: true, features: ['查看与查询', '查看报警记录'] },
    { id: 'alert-management', name: '告警管理', features: ['查看与查询', '新增规则', '编辑规则', '启停规则', '删除规则'] },
    { id: 'device-runtime-monitor', name: '设备运行监控', features: ['查看与查询', '查看运行记录', '重新连接', '断开连接', '补传', '诊断'] },
    { id: 'device-management', name: '设备管理', features: ['查看与查询', '新增设备', '区域管理', '查看本机 SPC', '编辑设备', '启停设备', '删除设备'] },
    { id: 'user-management', name: '用户管理', features: ['查看与查询', '新增用户', '编辑用户', '启停用户', '删除用户'] },
    { id: 'role-management', name: '角色管理', features: ['查看与查询', '新增角色', '编辑角色', '菜单权限', '启停角色', '删除角色'] },
    { id: 'personal-center', name: '个人中心', features: ['查看页面', '修改密码', '基本设置', '导出任务管理'] }
  ];

  const style = document.createElement('style');
  style.textContent = `
    .nav-item[href="12-个人中心.html"],.nav .item[href="12-个人中心.html"]{display:none!important}
    .account-menu-wrap{position:relative;display:flex;align-items:center;min-width:0}.account-menu-wrap .account-entry{min-height:34px;margin-left:6px;padding:0 2px 0 12px;border:0;border-left:1px solid var(--line,#dfe5ec);display:flex;align-items:center;gap:8px;background:transparent;color:var(--text,#475569);text-decoration:none;white-space:nowrap;cursor:pointer}.account-menu-wrap .account-entry:hover,.account-menu-wrap .account-entry:focus{text-decoration:none;color:var(--blue,#3478f6)}.account-menu-wrap .account-entry:focus-visible{outline:2px solid rgba(52,120,246,.35);outline-offset:2px;border-radius:4px}.account-menu-wrap .account-chevron{width:14px;height:14px;margin-left:2px;position:relative;flex:0 0 14px;font-size:0;color:#8090a5;transition:transform .18s}.account-menu-wrap .account-chevron:before{content:"";position:absolute;width:6px;height:6px;border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;transform:rotate(45deg);top:2px;left:3px}.account-menu-wrap.open .account-chevron{transform:rotate(180deg)}.account-menu{position:absolute;z-index:1150;right:0;top:calc(100% + 8px);width:224px;max-width:calc(100vw - 24px);padding:6px;border:1px solid #d9e1eb;border-radius:6px;background:#fff;box-shadow:0 10px 28px rgba(15,32,54,.16)}.account-menu[hidden]{display:none}.account-menu-summary{padding:10px 10px 9px;border-bottom:1px solid #edf0f4}.account-menu-summary-row{display:flex;align-items:center;justify-content:space-between;gap:14px;line-height:22px}.account-menu-summary-row+.account-menu-summary-row{margin-top:2px}.account-menu-summary-row span{color:#7a8798;font-size:12px}.account-menu-summary-row b{max-width:128px;overflow:hidden;text-overflow:ellipsis;color:#263a55;font-size:12px;font-weight:650;white-space:nowrap}.account-menu-actions{padding-top:5px}.account-menu-action{width:100%;height:36px;padding:0 10px;border:0;border-radius:4px;display:flex;align-items:center;background:transparent;color:#334155;text-decoration:none;font-size:13px;text-align:left;cursor:pointer}.account-menu-action:hover,.account-menu-action:focus{background:#f2f6fc;color:var(--blue,#3478f6);text-decoration:none;outline:0}.account-menu-action.danger{color:#d14343}.account-menu-action.danger:hover,.account-menu-action.danger:focus{background:#fff3f3;color:#c93636}
    .sidebar-account{position:relative;flex:0 0 auto;padding:10px 12px 12px;border-top:1px solid rgba(255,255,255,.08)}.sidebar-account .account-menu-wrap{width:100%}.sidebar-account .account-entry{width:100%;min-height:46px;margin:0;padding:6px 8px;border:0;border-radius:5px;color:#bdc8d7;gap:10px}.sidebar-account .account-entry:hover,.sidebar-account .account-entry:focus{background:rgba(255,255,255,.06);color:#fff}.sidebar-account .account-avatar{background:#344965;color:#fff}.sidebar-account .account-copy{min-width:0}.sidebar-account .account-copy b{color:#fff}.sidebar-account .account-copy small{display:block;color:#8496ad}.sidebar-account .account-chevron{margin-left:auto;color:#8fa4bf}.sidebar-account .account-chevron:before{top:5px;transform:rotate(225deg)}.sidebar-account .account-menu-wrap.open .account-chevron{transform:rotate(180deg)}.sidebar-account .account-menu{left:0;right:auto;top:auto;bottom:calc(100% + 8px);width:100%;max-width:100%;max-height:min(320px,calc(100vh - 92px));overflow-y:auto;box-sizing:border-box}
    :root{--proto-ease:cubic-bezier(.25,1,.5,1)}
    .proto-required{margin-left:3px;color:#d34747;font-style:normal}.proto-field textarea{width:100%;min-height:72px;max-height:120px;resize:vertical;border:1px solid #cfd8e4;border-radius:4px;padding:9px 10px;background:#fff;color:#334155;font:inherit;line-height:1.5}.proto-field textarea:focus{outline:3px solid rgba(52,120,246,.16);border-color:#6ea0ff}.proto-field .is-invalid{border-color:#d34747!important;box-shadow:0 0 0 2px rgba(211,71,71,.1)}
    .control,.seg,.tab,.nav-item,.item,.page,.link,.link-btn,.action,.action-link,.detail-link,.view-link,.history,.iconbtn,.icon-btn{cursor:pointer}
    .control:focus-visible,.seg:focus-visible,.tab:focus-visible,.nav-item:focus-visible,.item:focus-visible,.page:focus-visible,a:focus-visible,button:focus-visible{outline:3px solid rgba(52,120,246,.28)!important;outline-offset:2px}
    .control:hover{border-color:#8eabe0!important;background:#fbfdff!important}.tab,.seg,.page,.control,button,a{transition:background-color 160ms var(--proto-ease),border-color 160ms var(--proto-ease),color 160ms var(--proto-ease),opacity 160ms var(--proto-ease)}
    .proto-popover{position:fixed;z-index:80;width:260px;max-height:280px;overflow:auto;background:#fff;border:1px solid #d7e0eb;border-radius:7px;box-shadow:0 8px 20px rgba(16,42,76,.16);padding:6px;animation:proto-in 180ms var(--proto-ease)}
    .proto-option{width:100%;height:36px;border:0;border-radius:4px;background:#fff;text-align:left;padding:0 10px;color:#334155;display:flex;align-items:center;justify-content:space-between;cursor:pointer}.proto-option:hover,.proto-option[aria-selected=true]{background:#edf4ff;color:#2468e8}.proto-option[aria-selected=true]:after{content:'✓';font-weight:700}
    .proto-search{width:100%;height:34px;border:0;outline:0;background:transparent;color:#26384e;font:inherit;min-width:0}.proto-search::placeholder{color:#8a98a9}
    .proto-multi-option{justify-content:flex-start;gap:9px}.proto-multi-option:before{content:'';width:15px;height:15px;flex:0 0 15px;border:1px solid #a9b7c8;border-radius:3px;background:#fff}.proto-multi-option[aria-selected=true]:before{content:'✓';display:grid;place-items:center;background:#3478f6;border-color:#3478f6;color:#fff;font-size:11px}.proto-multi-option[aria-selected=true]:after{content:none}.proto-popover-foot{position:sticky;bottom:-6px;margin:6px -6px -6px;padding:8px;border-top:1px solid #e4e9f0;background:#fff;display:flex;justify-content:flex-end;gap:8px}.proto-popover-foot button{height:30px;padding:0 12px;border-radius:4px;border:1px solid #cfd8e4;background:#fff;color:#475569}.proto-popover-foot .primary{border-color:#3478f6;background:#3478f6;color:#fff}.proto-time-popover{width:min(520px,calc(100vw - 24px));padding:12px}.proto-time-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.proto-time-grid label{display:block;color:#59687b;font-size:12px;font-weight:600}.proto-time-grid input{width:100%;height:38px;margin-top:6px;border:1px solid #cfd8e4;border-radius:4px;padding:0 9px;color:#334155;background:#fff}
    .proto-backdrop{position:fixed;inset:0;z-index:90;background:rgba(12,24,42,.32);display:grid;place-items:center;animation:proto-fade 180ms var(--proto-ease)}
    .proto-modal{width:min(520px,calc(100vw - 40px));max-height:calc(100vh - 48px);overflow:auto;background:#fff;border-radius:10px;box-shadow:0 18px 42px rgba(16,42,76,.2);animation:proto-rise 220ms var(--proto-ease)}
    .proto-modal-head{height:54px;padding:0 18px;border-bottom:1px solid #e6ebf1;display:flex;align-items:center;justify-content:space-between}.proto-modal-head h3{margin:0;color:#102a4c;font-size:17px}.proto-close{width:32px;height:32px;border:0;background:#fff;border-radius:4px;color:#64748b;cursor:pointer;font-size:18px}
    .proto-modal-body{padding:18px}.proto-modal-foot{height:62px;padding:0 18px;border-top:1px solid #e6ebf1;display:flex;align-items:center;justify-content:flex-end;gap:8px}.proto-field{margin-bottom:14px}.proto-field label{display:block;font-size:12px;color:#59687b;font-weight:600;margin-bottom:6px}.proto-field input,.proto-field select{width:100%;height:38px;border:1px solid #cfd8e4;border-radius:4px;padding:0 10px;background:#fff;color:#334155}.proto-checks{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.proto-check{height:38px;border:1px solid #e0e6ed;border-radius:5px;display:flex;align-items:center;gap:8px;padding:0 10px}.proto-primary,.proto-secondary{height:36px;padding:0 15px;border-radius:4px;font-weight:600;cursor:pointer}.proto-primary{border:1px solid #3478f6;background:#3478f6;color:#fff}.proto-secondary{border:1px solid #cfd8e4;background:#fff;color:#475569}.proto-column-modal{width:min(860px,calc(100vw - 40px))}.proto-column-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.proto-column-note{font-size:12px;color:#64748b}.proto-column-actions{display:flex;gap:6px}.proto-column-actions button{height:30px;padding:0 10px;border:1px solid #cfd8e4;border-radius:4px;background:#fff;color:#475569;cursor:pointer}.proto-column-actions button:hover{border-color:#3478f6;color:#2468e8}.proto-column-groups{display:flex;flex-direction:column;gap:16px}.proto-column-group h4{margin:0 0 8px;color:#334155;font-size:13px}.proto-column-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.proto-column-option{height:36px;border:1px solid #e0e6ed;border-radius:5px;display:flex;align-items:center;gap:8px;padding:0 10px;color:#475569;min-width:0}.proto-column-option span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.proto-column-option:has(input:checked){background:#f2f7ff;border-color:#a9c7fb;color:#245fbf}.proto-region-modal{width:min(680px,calc(100vw - 40px))}.proto-region-summary{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-bottom:16px}.proto-region-metric{padding:11px 14px;border-radius:7px;background:#f4f7fb;color:#64748b;font-size:12px}.proto-region-metric b{display:block;margin-top:3px;color:#17365f;font-size:20px}.proto-region-table{border:1px solid #e1e7ef;border-radius:7px;overflow:hidden}.proto-region-head,.proto-region-row{display:grid;grid-template-columns:minmax(220px,1fr) 140px 96px;align-items:center;gap:14px}.proto-region-head{height:38px;padding:0 14px;background:#f5f7fa;color:#718096;font-size:12px}.proto-region-row{min-height:52px;padding:6px 14px;border-top:1px solid #edf1f5}.proto-region-row input{width:100%;height:36px;border:1px solid #cfd8e4;border-radius:4px;padding:0 10px;background:#fff;color:#334155}.proto-region-row input:focus{outline:3px solid rgba(52,120,246,.16);border-color:#6ea0ff}.proto-region-count{color:#475569}.proto-region-count b{color:#2468e8}.proto-region-operation{text-align:right}.proto-region-delete{border:0;background:transparent;color:#df4a4a;font-weight:600;cursor:pointer}.proto-region-delete:disabled{color:#b7c0cb;cursor:not-allowed}.proto-region-add{width:100%;margin-top:14px;border-style:dashed}.proto-region-hint{margin:10px 0 0;color:#8491a3;font-size:12px}.proto-permission-modal{width:min(760px,calc(100vw - 40px));overflow:hidden}.proto-permission-modal .proto-modal-body{padding:0;overflow:hidden}.proto-permission-toolbar{height:54px;padding:0 18px;border-bottom:1px solid #e7ecf2;display:flex;align-items:center;justify-content:space-between;gap:12px}.proto-permission-summary{color:#64748b;font-size:12px}.proto-permission-summary b{color:#2468e8;font-size:16px}.proto-permission-tools{display:flex;gap:6px}.proto-permission-tools button{height:30px;padding:0 10px;border:1px solid #cfd8e4;border-radius:4px;background:#fff;color:#475569;cursor:pointer}.proto-permission-tools button:hover{border-color:#3478f6;color:#2468e8}.proto-permission-tree{max-height:min(560px,calc(100vh - 220px));overflow:auto;padding:12px 18px 18px}.proto-permission-group{border:1px solid #e0e6ed;border-radius:7px;overflow:hidden}.proto-permission-group+.proto-permission-group{margin-top:8px}.proto-permission-root{height:46px;padding:0 12px;display:flex;align-items:center;gap:10px;background:#f7f9fc}.proto-permission-root input,.proto-permission-leaf input{width:15px;height:15px;accent-color:#3478f6;flex:0 0 15px}.proto-permission-root-name{font-weight:650;color:#334155}.proto-permission-count{margin-left:auto;color:#7a8798;font-size:12px}.proto-permission-toggle{width:28px;height:28px;border:0;background:transparent;color:#718095;cursor:pointer;position:relative;font-size:0}.proto-permission-toggle:before{content:"";position:absolute;width:7px;height:7px;border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;transform:rotate(45deg);top:7px;left:9px;transition:transform 160ms var(--proto-ease)}.proto-permission-group.is-collapsed .proto-permission-toggle:before{transform:rotate(-45deg);top:9px;left:7px}.proto-permission-children{padding:8px 12px 10px 48px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px 14px;border-top:1px solid #e7ecf2}.proto-permission-group.is-collapsed .proto-permission-children{display:none}.proto-permission-leaf{min-height:34px;padding:0 9px;border-radius:5px;display:flex;align-items:center;gap:8px;color:#526176}.proto-permission-leaf:hover{background:#f2f7ff}.proto-dark .proto-permission-root,.proto-dark .proto-permission-toolbar{background:#1c2a3d!important}.proto-dark .proto-permission-group,.proto-dark .proto-permission-children,.proto-dark .proto-permission-toolbar{border-color:#2c3b50!important}@media(max-width:900px){.proto-column-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:620px){.proto-region-head,.proto-region-row{grid-template-columns:minmax(130px,1fr) 82px 64px;gap:8px}.proto-region-head,.proto-region-row{padding-left:10px;padding-right:10px}.proto-region-summary{gap:8px}.proto-permission-toolbar{height:auto;min-height:54px;padding-top:10px;padding-bottom:10px;align-items:flex-start;flex-direction:column}.proto-permission-children{grid-template-columns:1fr;padding-left:40px}.proto-permission-tree{max-height:calc(100vh - 250px)}}
    .proto-device-modal{width:min(600px,calc(100vw - 40px))}.proto-device-identify-row{display:flex;align-items:center;gap:8px}.proto-device-identify-row input{flex:1;min-width:0}.proto-device-identify-button{height:38px;flex:0 0 auto;padding:0 14px;border:1px solid #3478f6;border-radius:4px;background:#fff;color:#2468e8;font-weight:600;cursor:pointer}.proto-device-identify-button:hover{background:#f2f7ff}.proto-device-identify-button:disabled{border-color:#d7dee8;background:#f5f7fa;color:#9aa6b5;cursor:not-allowed}.proto-device-identify-button .proto-spinner{width:14px;height:14px;margin-right:6px;border-color:#bed1f5;border-top-color:#3478f6;vertical-align:-2px}.proto-device-status{min-height:18px;margin:6px 0 0;font-size:12px;color:#7a8798}.proto-device-status.is-loading{color:#526176}.proto-device-status.is-success{color:#26845b}.proto-device-status.is-error{color:#c23d3d}.proto-field input[readonly]{background:#f5f7fa;color:#59687b;cursor:default}.proto-field select:disabled,.proto-primary:disabled{background:#edf1f5;border-color:#d7dee8;color:#a2adba;cursor:not-allowed}.proto-device-divider{height:1px;margin:2px 0 14px;background:#edf1f5}@media(max-width:520px){.proto-device-identify-row{align-items:stretch;flex-direction:column}.proto-device-identify-button{width:100%}}
    .proto-toast-stack{position:fixed;z-index:110;right:22px;top:78px;display:flex;flex-direction:column;gap:8px}.proto-toast{min-width:280px;max-width:420px;background:#fff;border:1px solid #dbe3ed;border-radius:7px;box-shadow:0 8px 18px rgba(16,42,76,.14);padding:11px 14px;display:flex;align-items:center;gap:9px;color:#334155;animation:proto-slide 220ms var(--proto-ease)}.proto-toast:before{content:'✓';width:20px;height:20px;border-radius:50%;display:grid;place-items:center;background:#eaf8f1;color:#168150;font-weight:700}.proto-toast.info:before{content:'i';background:#edf4ff;color:#2468e8}.proto-toast.error:before{content:'!';background:#fff0f0;color:#c43d3d}.mouth-context{display:inline-flex;align-items:center;height:24px;padding:0 9px;border-radius:4px;background:#edf4ff;color:#245fbf;font-weight:650}.quality-tabs{height:46px;display:flex;align-items:flex-end;gap:24px;border-bottom:1px solid #dce3ec;background:#fff;padding:0 18px;border-radius:8px 8px 0 0}.quality-tab{height:46px;border:0;border-bottom:2px solid transparent;background:transparent;color:#64748b;font-weight:600;padding:0 2px;cursor:pointer}.quality-tab.on{color:#2468e8;border-bottom-color:#3478f6}.quality-content{flex:1;min-height:0;display:flex;flex-direction:column;gap:14px}.quality-metrics{height:94px;background:#fff;border:1px solid #dce3ec;border-radius:8px;display:grid;grid-template-columns:repeat(6,minmax(0,1fr))}.quality-metric{padding:14px 16px;min-width:0}.quality-metric+.quality-metric{border-left:1px solid #e7ebf0}.quality-metric .metric-value{font-size:23px}.quality-grid{display:grid;grid-template-columns:minmax(0,1.45fr) minmax(0,1fr);gap:14px;height:250px}.quality-chart{min-width:0;background:#fff;border:1px solid #dce3ec;border-radius:8px;overflow:hidden}.quality-chart-body{height:calc(100% - 50px);min-width:0;padding:12px 16px;overflow:hidden}.quality-chart-body svg{display:block;width:100%;height:100%;max-width:100%;overflow:hidden}.quality-bars{display:flex;flex-direction:column;gap:13px;padding-top:3px}.quality-bar{display:grid;grid-template-columns:88px minmax(0,1fr) 54px;align-items:center;gap:10px;font-size:11px;color:#526176}.quality-bar-track{height:12px;border-radius:3px;background:#edf1f5;overflow:hidden}.quality-bar-fill{height:100%;background:#3478f6;border-radius:3px}.quality-guide{flex:1;display:grid;place-items:center;background:#fff;border:1px solid #dce3ec;border-radius:8px;text-align:center;color:#64748b;padding:32px}.quality-guide h3{margin:0 0 8px;color:#102a4c}.project-picks{display:flex;gap:8px;justify-content:center;margin-top:18px;flex-wrap:wrap}.project-pick{height:34px;padding:0 12px;border:1px solid #cfd8e4;border-radius:4px;background:#fff;color:#245fbf;cursor:pointer}.comparison-summary{display:flex;align-items:center;justify-content:space-between;background:#fff;border:1px solid #dce3ec;border-radius:8px;padding:12px 16px}.comparison-summary b{color:#102a4c}.device-link,.project-link{color:#245fbf;font-weight:650;cursor:pointer;text-decoration:none}.device-link:after{content:'↗';margin-left:5px;font-size:10px;font-weight:500}.device-link:hover{text-decoration:underline}.filters{flex-wrap:wrap!important;row-gap:12px!important}.filters>.field{flex:0 0 auto}.pager{gap:12px;overflow:hidden}.pager>:first-child{flex:0 1 auto;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.proto-pagination{display:flex;align-items:center;gap:4px;margin-left:auto;min-width:0;max-width:100%;flex:0 1 auto;color:#334155;white-space:nowrap}.proto-page-nav{width:30px;min-width:30px}.proto-page-number{width:auto;min-width:30px;padding:0 7px;font-variant-numeric:tabular-nums}.proto-page-nav,.proto-page-number{height:32px;border:1px solid transparent;border-radius:5px;background:#fff;color:#334155;display:grid;place-items:center;cursor:pointer}.proto-page-number.on{border-color:#3478f6;color:#2468e8;background:#edf4ff}.proto-page-nav:disabled{color:#a8b2c0;cursor:not-allowed}.proto-page-size{height:34px;min-width:96px;border:1px solid #cfd8e4;border-radius:5px;background:#fff;color:#334155;padding:0 28px 0 10px}.proto-page-jump{display:flex;align-items:center;gap:6px;white-space:nowrap}.proto-page-jump input{width:48px;height:34px;border:1px solid #cfd8e4;border-radius:5px;text-align:center;color:#334155}.proto-page-jump input:focus{outline:3px solid rgba(52,120,246,.2);border-color:#3478f6}body[data-page="device-quality"] .field.time{width:310px;flex:0 0 310px}body[data-page="device-quality"] .field.time .control{overflow:hidden;font-variant-numeric:tabular-nums}body[data-page="device-quality"] .field.time .control span{flex:0 0 auto}@media(max-width:1400px){.quality-metrics{grid-template-columns:repeat(3,1fr);height:154px}.quality-grid{height:220px}.filters:not(.board-filters){height:150px!important;flex-basis:150px!important;align-content:center!important}body[data-page="device-quality"] .field.time{width:285px;flex-basis:285px}body[data-page="device-quality"] .field.time .control{font-size:12px;padding:0 8px;gap:4px}body[data-page="device-quality"] .field.device{width:170px}body[data-page="device-quality"] .field.project{width:160px}}
    .proto-org-node-modal{overflow:visible}.proto-org-node-modal .proto-modal-body{overflow:visible}.proto-org-picker{position:relative}.proto-org-trigger{width:100%;height:38px;padding:0 10px;border:1px solid #cfd8e4;border-radius:4px;background:#fff;color:#334155;text-align:left;display:flex;align-items:center;justify-content:space-between;gap:8px;cursor:pointer;appearance:none}.proto-org-trigger>span:last-child{width:14px;min-width:14px;display:grid;place-items:center;margin-left:auto;color:#64748b;font-size:0}.proto-org-trigger>span:last-child:before{content:"";width:6px;height:6px;margin-top:-3px;border-right:1px solid currentColor;border-bottom:1px solid currentColor;transform:rotate(45deg)}.proto-device-modal select[data-device-enabled],.proto-device-modal select[data-edit-device-enabled]{height:38px;padding:0 34px 0 10px;border:1px solid #cfd8e4;border-radius:4px;background-color:#fff;background-image:linear-gradient(45deg,transparent 50%,#64748b 50%),linear-gradient(135deg,#64748b 50%,transparent 50%);background-position:calc(100% - 14px) 15px,calc(100% - 10px) 15px;background-size:4px 4px,4px 4px;background-repeat:no-repeat;color:#334155;appearance:none;cursor:pointer}.proto-device-modal select[data-device-enabled]:disabled,.proto-device-modal select[data-edit-device-enabled]:disabled{background-color:#edf1f5;border-color:#d7dee8;color:#a2adba;cursor:not-allowed}.proto-org-trigger>span:first-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.proto-org-trigger.is-placeholder{color:#8a98a9}.proto-org-trigger:disabled{background:#edf1f5;border-color:#d7dee8;color:#a2adba;cursor:not-allowed}.proto-org-tree{position:absolute;left:0;right:0;top:calc(100% + 4px);z-index:40;max-height:220px;padding:4px;border:1px solid #cfd8e4;border-radius:4px;background:#fff;box-shadow:0 10px 24px rgba(16,42,76,.18);overflow-y:auto}.proto-org-tree[hidden],.proto-org-children[hidden]{display:none}.proto-org-row{min-height:32px;display:flex;align-items:center}.proto-org-toggle{width:24px;height:30px;flex:0 0 24px;border:0;background:transparent;color:#64748b;cursor:pointer}.proto-org-toggle:disabled{visibility:hidden}.proto-org-choice{min-width:0;flex:1;height:30px;padding:0 8px;border:0;border-radius:3px;background:transparent;color:#334155;text-align:left;cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.proto-org-choice:hover,.proto-org-choice.is-selected{background:#edf4ff;color:#2468e8}.proto-empty td{height:220px!important;text-align:center!important;color:#738196!important}.proto-empty td:before{content:'⌕';display:block;font-size:26px;color:#a0adbc;margin-bottom:8px}.proto-loading{opacity:.58;pointer-events:none}.proto-spinner{display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,.45);border-top-color:#fff;border-radius:50%;animation:proto-spin .7s linear infinite;margin-right:7px;vertical-align:-2px}.proto-tab-empty{height:100%;display:grid;place-items:center;color:#718095;text-align:center;padding:40px}.proto-tab-empty b{display:block;color:#334155;margin-bottom:7px}.proto-row-flash{animation:proto-flash 900ms var(--proto-ease)}
    .top-title h1,.title h1{margin:0!important;font-family:Inter,"Microsoft YaHei","PingFang SC",system-ui,sans-serif!important;font-size:22px!important;font-weight:700!important;line-height:1.3!important;color:#102a4c!important}.control{height:36px!important;padding:0 8px!important;font-family:Inter,"Microsoft YaHei","PingFang SC",system-ui,sans-serif!important;font-size:12px!important;font-weight:400!important;color:#334155!important;border-radius:4px!important}.btn{height:36px!important;padding:0 15px!important;font-family:Inter,"Microsoft YaHei","PingFang SC",system-ui,sans-serif!important;font-size:14px!important;font-weight:550!important;line-height:normal!important;border-radius:4px!important}.panel-title,.phead-title>b,.phead>b{font-family:Inter,"Microsoft YaHei","PingFang SC",system-ui,sans-serif!important;font-size:16px!important;font-weight:700!important;line-height:1.4!important;color:#102a4c!important}.data-table th,.table th,.dtable th{height:40px!important;padding:0 12px!important;font-size:12px!important;font-weight:650!important;color:#526176!important;border-bottom:1px solid #dce3ec!important;background:#f7f9fc!important}.data-table td,.table td,.dtable td{height:44px!important;padding:0 12px!important;font-family:Inter,"Microsoft YaHei","PingFang SC",system-ui,sans-serif!important;font-size:14px!important;line-height:normal!important;background-color:#fff}.data-table td:not(.project-name):not(.device-name),.table td:not(.pcb-id):not(.device-name),.dtable td{color:#334155}.pager{height:40px!important;min-height:40px!important;flex-basis:40px!important;padding:0 14px!important;font-size:12px!important}
    .charts>.panel{height:100%;min-height:0;overflow:hidden;display:flex;flex-direction:column}.charts>.panel>.panel-head{flex:0 0 auto}.charts>.panel>.chart-body{height:auto!important;flex:1;min-height:0;overflow:hidden}.charts>.panel>.chart-body>svg{display:block;width:100%;height:100%;max-width:100%;max-height:100%;overflow:hidden}
    .quality-bars{width:100%;height:100%;min-width:0;justify-content:center;overflow:hidden;padding-top:0}.quality-bar{width:100%;min-width:0;grid-template-columns:minmax(56px,88px) minmax(0,1fr) 54px}.quality-bar>span,.quality-bar>b{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.quality-bar>b{text-align:right}.quality-bar-track{width:100%;min-width:0}body[data-page="device-quality"] .quality-mouth-toolbar{min-height:58px;padding:10px 16px;background:#fff;border:1px solid #dce3ec;border-radius:8px;display:flex;align-items:center;gap:16px;flex:0 0 auto}body[data-page="device-quality"] .quality-mouth-label{color:#59687b;font-size:12px;font-weight:650}body[data-page="device-quality"] .quality-mouth-toolbar .seg{cursor:pointer}body[data-page="device-quality"] .quality-mouth-toolbar .seg:focus-visible{outline:2px solid #3478f6;outline-offset:1px}body[data-page="device-quality"] .quality-metrics{grid-template-columns:repeat(5,minmax(0,1fr))}body[data-page="device-quality"] .quality-filter{min-height:76px;flex:0 0 auto}body[data-page="device-quality"] .table-panel{flex:1;min-height:250px}body[data-page="device-quality"] .device-select-cell{width:44px;min-width:44px;text-align:center!important;position:sticky!important;left:0!important;z-index:6!important;background:#fff}body[data-page="device-quality"] th.device-select-cell{background:#f7f9fc}body[data-page="device-quality"] .device-row-check,body[data-page="device-quality"] .device-select-all{width:15px;height:15px;accent-color:#3478f6;cursor:pointer}body[data-page="device-quality"] .device-export:disabled{background:#f5f7fa;border-color:#d7dee8;color:#a2adba;cursor:not-allowed}body[data-page="device-quality"] .proto-sort-button{width:100%;height:40px;margin:0;padding:0;border:0;background:transparent;color:inherit;font:inherit;font-weight:inherit;display:inline-flex;align-items:center;justify-content:flex-end;gap:5px;white-space:nowrap;cursor:pointer}body[data-page="device-quality"] th:not(.num) .proto-sort-button{justify-content:flex-start}body[data-page="device-quality"] .proto-sort-button i{width:12px;color:#9aa7b7;font-size:12px;font-style:normal;text-align:center}body[data-page="device-quality"] th[aria-sort="ascending"] .proto-sort-button,body[data-page="device-quality"] th[aria-sort="descending"] .proto-sort-button{color:#2468e8}body[data-page="device-quality"] th[aria-sort="ascending"] .proto-sort-button i,body[data-page="device-quality"] th[aria-sort="descending"] .proto-sort-button i{color:#2468e8}@media(max-width:1400px){body[data-page="device-quality"] .quality-metrics{grid-template-columns:repeat(3,minmax(0,1fr));height:154px}}@media(max-width:700px){body[data-page="device-quality"] .quality-mouth-toolbar{align-items:flex-start;flex-direction:column;gap:7px}body[data-page="device-quality"] .quality-filter{align-content:flex-start!important;height:auto!important;max-height:240px;overflow:auto}body[data-page="device-quality"] .quality-filter .field{width:100%!important;flex-basis:auto!important}body[data-page="device-quality"] .quality-filter .filter-actions{width:100%;margin-left:0;justify-content:flex-end}}
    .device-project-value{display:inline-flex;max-width:100%;align-items:center;gap:5px;color:#334155;cursor:help;outline:0}.device-project-value-text{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.device-project-value-count{flex:0 0 auto;color:#2468e8;font-size:12px}.device-project-value:focus-visible{outline:2px solid #3478f6;outline-offset:2px;border-radius:2px}.proto-device-project-tooltip{position:fixed;z-index:120;width:max-content;min-width:280px;max-width:min(520px,calc(100vw - 24px));max-height:min(360px,calc(100vh - 24px));overflow:auto;padding:12px 14px;border:1px solid #d7e0eb;border-radius:7px;background:#17233a;color:#fff;box-shadow:0 10px 24px rgba(15,23,42,.24);font-size:12px;line-height:1.55;pointer-events:none}.proto-device-project-tooltip b{display:block;margin-bottom:7px;color:#dceaff;font-size:12px}.proto-device-project-tooltip span{display:block;max-width:490px;overflow-wrap:anywhere}.proto-device-project-tooltip span+span{margin-top:5px;padding-top:5px;border-top:1px solid rgba(255,255,255,.12)}
    .proto-page-ellipsis{width:32px;height:32px;display:grid;place-items:center;color:#718095}.proto-time-field{width:310px!important;flex:0 0 310px!important;min-width:0!important}.proto-time-field .control{min-width:0!important;overflow:hidden!important;font-variant-numeric:tabular-nums;white-space:nowrap}.proto-time-field .control span{flex:0 0 auto}.chev{font-size:0!important;width:14px;height:14px;min-width:14px;margin-left:auto;position:relative;flex:0 0 14px}.chev:before{content:"";position:absolute;width:6px;height:6px;border-right:1.5px solid #718095;border-bottom:1.5px solid #718095;transform:rotate(45deg);top:2px;left:3px}.proto-history-title{padding:7px 10px 5px;color:#7a8798;font-size:11px}.proto-history-option{justify-content:flex-start}.proto-history-option:before{content:"";width:13px;height:13px;border:1.5px solid #8492a6;border-radius:50%;margin-right:8px}.proto-top-icon svg{width:18px;height:18px;display:block;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.proto-top-option{gap:9px}.proto-top-option svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.8}
    .select-cell{width:44px!important;min-width:44px!important;max-width:44px!important;text-align:center!important;padding:0!important}.select-row-check,.select-all-check{width:15px;height:15px;margin:0;vertical-align:middle;accent-color:#3478f6;cursor:pointer}.select-export:disabled{background:#f5f7fa!important;border-color:#d7dee8!important;color:#a2adba!important;cursor:not-allowed!important}.select-export-table th.select-cell{background:#f7f9fc!important}.select-export-table td.select-cell{background:#fff!important}.data-table [data-column-key="projectUuid"]{display:none!important}
    body[data-page="board-query"] .records .tablebox{overflow:auto!important;position:relative}.board-query-table{width:100%!important;min-width:1474px!important;table-layout:fixed}.board-query-table th,.board-query-table td{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;position:relative}.board-query-table th:nth-child(1),.board-query-table td:nth-child(1){position:sticky;left:0;z-index:7;background:#fff}.board-query-table th:nth-child(2),.board-query-table td:nth-child(2){position:sticky;left:44px;z-index:7;background:#fff}.board-query-table th:nth-child(3),.board-query-table td:nth-child(3){position:sticky;left:104px;z-index:7;background:#fff;box-shadow:4px 0 8px rgba(32,54,82,.08)}.board-query-table th:nth-child(-n+3){background:#f7f9fc}.proto-column-resizer{position:absolute;right:-4px;top:0;width:8px;height:100%;cursor:col-resize;z-index:9}.proto-column-resizer:hover,.proto-column-resizer.dragging{background:rgba(52,120,246,.2)}.status-switch{height:28px;min-width:58px;padding:0 10px;border:1px solid #b9d7c6;border-radius:4px;background:#f2fbf6;color:#168150;cursor:pointer}.status-switch.off{border-color:#d7dee8;background:#f7f9fc;color:#718095}.op-link{border:0;background:transparent;color:#2468e8;padding:0 4px;cursor:pointer}.op-link.danger{color:#df4b4b}.op-link:disabled{color:#aab4c1;cursor:not-allowed}.proto-dark{background:#0f1724!important;color:#dbe5f2}.proto-dark .app,.proto-dark main,.proto-dark .main{background:#0f1724!important}.proto-dark .topbar,.proto-dark .top,.proto-dark .panel,.proto-dark .filters,.proto-dark .quality-tabs,.proto-dark .quality-metrics,.proto-dark .quality-chart,.proto-dark .comparison-summary,.proto-dark .summary,.proto-dark .records,.proto-dark .project-mouth-toolbar,.proto-dark .metric-group{background:#172235!important;border-color:#2c3b50!important}.proto-dark .metric-group-title{background:#1c2a3d!important;border-color:#2c3b50!important;color:#dbe5f2!important}.proto-dark .top-title h1,.proto-dark .title h1,.proto-dark .panel-title,.proto-dark .quality-guide h3,.proto-dark .quality-metric .metric-value,.proto-dark th,.proto-dark td,.proto-dark label{color:#dbe5f2!important}.proto-dark .control,.proto-dark button,.proto-dark select,.proto-dark input,.proto-dark .proto-popover{background:#1c2a3d!important;color:#dbe5f2!important;border-color:#3a4a60!important}.proto-dark .data-table th,.proto-dark .table th{background:#1c2a3d!important}.proto-dark .data-table td,.proto-dark .table td{background:#172235!important;border-color:#27364a!important}.proto-dark .quality-bar-track{background:#2a3a4e}.proto-dark .gridline{stroke:#314157}.proto-dark .scope,.proto-dark .scope-line,.proto-dark .fresh,.proto-dark .panel-sub,.proto-dark .metric-label,.proto-dark .metric-foot{color:#9cacc0!important}
    @media(max-width:1400px){.proto-time-field{width:285px!important;flex-basis:285px!important}.proto-time-field .control{font-size:12px!important;padding:0 8px!important;gap:4px!important}}
    @keyframes proto-in{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:none}}@keyframes proto-fade{from{opacity:0}to{opacity:1}}@keyframes proto-rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}@keyframes proto-slide{from{opacity:0;transform:translateX(14px)}to{opacity:1;transform:none}}@keyframes proto-spin{to{transform:rotate(360deg)}}@keyframes proto-flash{0%,100%{background:transparent}35%{background:#edf4ff}}
    @media(prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;transition-duration:.01ms!important}}
  `;
  document.head.appendChild(style);
  const deviceChartStyle = document.createElement('style');
  deviceChartStyle.textContent = `
    body[data-page="device-quality"] main{min-width:0;overflow-x:hidden!important;overflow-y:auto!important}
    body[data-page="device-quality"] .quality-content{min-width:0;overflow:visible}
    body[data-page="device-quality"] .comparison-switch{display:flex;align-items:center;border:1px solid #d5deea;border-radius:4px;padding:2px;background:#f7f9fc}
    body[data-page="device-quality"] .comparison-tab{height:25px;border:0;border-radius:3px;background:transparent;color:#64748b;padding:0 8px;cursor:pointer;font-size:12px}
    body[data-page="device-quality"] .comparison-tab.is-active{background:#fff;color:#2468e8;box-shadow:0 1px 2px rgba(16,42,76,.12);font-weight:650}
    body[data-page="device-quality"] .comparison-grid,body[data-page="device-quality"] .device-chart-grid{stroke:#e7edf4;stroke-width:1}
    body[data-page="device-quality"] .comparison-bar-track{fill:#edf1f5}
    body[data-page="device-quality"] .comparison-bar{fill:#3478f6}
    body[data-page="device-quality"] .comparison-bar:hover{fill:#2468e8}
    body[data-page="device-quality"] .comparison-axis,body[data-page="device-quality"] .comparison-label,body[data-page="device-quality"] .device-chart-axis{fill:#748398;font-size:10px}
    body[data-page="device-quality"] .comparison-value{fill:#1f3552;font-size:9px;font-weight:650}
    body[data-page="device-quality"] .comparison-label{text-anchor:middle}
    body[data-page="device-quality"] .comparison-label.project-label{text-anchor:end}
    body[data-page="device-quality"] .device-horizontal-value{text-anchor:end}
    body[data-page="device-quality"] .device-quality-charts .phead{min-width:0}
    body[data-page="device-quality"] .device-quality-charts .phead .phead-title{min-width:0}
    body[data-page="device-quality"] .chart-head-actions{margin-left:auto;min-width:0;display:flex;align-items:center;justify-content:flex-end;gap:8px}
    body[data-page="device-quality"] .chart-period-picker{display:flex;align-items:center;border:1px solid #d5deea;border-radius:4px;padding:2px;background:#f7f9fc;white-space:nowrap}
    body[data-page="device-quality"] .chart-period{height:25px;border:0;border-radius:3px;background:transparent;color:#64748b;padding:0 7px;cursor:pointer;font-size:12px;white-space:nowrap}
    body[data-page="device-quality"] .chart-period.is-active{background:#fff;color:#2468e8;box-shadow:0 1px 2px rgba(16,42,76,.12);font-weight:650}
    .comparison-date-range{display:flex;align-items:center;gap:5px;flex:0 0 auto;white-space:nowrap}
    .comparison-date-range input{width:106px;height:29px;border:1px solid #d5deea;border-radius:4px;background:#fff;color:#526176;padding:0 6px;font:inherit;font-size:11px}
    body[data-page="device-quality"] .device-trend-date-range{display:flex;align-items:center;gap:5px;white-space:nowrap}
    body[data-page="device-quality"] .device-trend-date-range input{width:106px;height:29px;border:1px solid #d5deea;border-radius:4px;background:#fff;color:#526176;padding:0 6px;font:inherit;font-size:11px}
    body[data-page="device-quality"] .device-trend-date-range.is-hidden{display:none}
    body[data-page="device-quality"] [data-device-trend] .comparison-switch{flex:0 0 auto;white-space:nowrap}
    body[data-page="device-quality"] .device-quality-charts .quality-chart{display:flex;flex-direction:column}
    body[data-page="device-quality"] .device-quality-charts .quality-chart-body{height:auto;flex:1;min-height:0}
    body[data-page="device-quality"] [data-comparison-chart].is-device-horizontal,body[data-page="device-quality"] .comparison-modal-chart.is-device-horizontal{overflow-x:hidden;overflow-y:auto;scrollbar-gutter:stable;padding-right:6px}
    body[data-page="device-quality"] .is-device-horizontal .comparison-chart-scroll-content{width:100%;min-height:100%}
    body[data-page="device-quality"] .is-device-horizontal .comparison-chart-scroll-content svg{display:block;width:100%;height:100%;min-height:0;overflow:hidden}
    body[data-page="device-quality"] [data-comparison-panel] .phead{height:auto;min-height:82px;flex-wrap:wrap;padding-top:7px;padding-bottom:7px}
    body[data-page="device-quality"] [data-comparison-panel] .chart-head-actions{width:100%;justify-content:flex-end;flex-wrap:wrap}
    body[data-page="device-quality"] .device-quality-charts .phead .legend{min-width:0;gap:10px;white-space:nowrap}
    body[data-page="device-quality"] .device-yield-trend{padding:10px 14px}
    body[data-page="device-quality"] .device-yield-trend svg{width:100%;height:100%;display:block}
    body[data-page="device-quality"] .table-panel .quality-filter{height:auto!important;min-height:76px;flex:0 0 auto;border:0;border-bottom:1px solid #e8edf2;border-radius:0;padding:14px 16px}
    body[data-page="device-quality"] .table-panel .table-wrap{height:calc(100% - 126px)}
    .proto-comparison-modal{width:min(960px,calc(100vw - 40px))!important}.comparison-modal-toolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.comparison-modal-toolbar .comparison-modal-note{margin-left:auto;white-space:nowrap}
    @media(max-width:1180px){body[data-page="device-quality"] [data-device-trend] .phead{height:auto;min-height:50px;flex-wrap:wrap;padding-top:7px;padding-bottom:7px}body[data-page="device-quality"] .chart-head-actions{gap:5px}body[data-page="device-quality"] .chart-period{padding:0 5px;font-size:11px}body[data-page="device-quality"] .device-quality-charts .phead .legend{gap:6px;font-size:10px}body[data-page="device-quality"] .device-trend-date-range input,.comparison-date-range input{width:102px}}
    @media(max-width:900px){body[data-page="device-quality"] .quality-grid{height:auto;grid-template-columns:1fr}body[data-page="device-quality"] .quality-chart{min-height:250px}body[data-page="device-quality"] .chart-head-actions{flex-wrap:wrap}body[data-page="device-quality"] [data-device-trend] .chart-head-actions{width:100%;justify-content:flex-start}body[data-page="device-quality"] .table-panel .table-wrap{height:420px}.comparison-modal-toolbar{align-items:flex-start;flex-wrap:wrap}}
    body[data-page="device-quality"] [data-comparison-panel] .phead{height:50px;min-height:50px;flex-wrap:nowrap;padding-top:0;padding-bottom:0;gap:5px}body[data-page="device-quality"] [data-comparison-panel] .phead-title{flex:0 0 auto}body[data-page="device-quality"] [data-comparison-panel] .chart-head-actions{width:auto;flex:1;gap:4px;flex-wrap:nowrap}body[data-page="device-quality"] [data-comparison-panel] .chart-time-range input{width:102px}body[data-page="device-quality"] [data-comparison-panel] .chart-period-select{width:96px;flex-basis:96px}body[data-page="device-quality"] [data-comparison-panel] .comparison-switch{flex:0 0 auto}body[data-page="device-quality"] [data-comparison-panel] .comparison-tab{padding:0 5px;font-size:11px;white-space:nowrap}body[data-page="device-quality"] [data-comparison-panel] .link{padding:0 2px;font-size:11px;flex:0 0 auto;white-space:nowrap}@media(max-width:1500px){body[data-page="device-quality"] .quality-grid{grid-template-columns:minmax(0,1.08fr) minmax(550px,1fr)}}@media(max-width:1180px){body[data-page="device-quality"] .quality-grid{height:auto;grid-template-columns:1fr}body[data-page="device-quality"] .quality-chart{min-height:230px}}
  `;
  deviceChartStyle.textContent += `
    body[data-page="device-quality"] .chart-device-config{height:28px;padding:0 9px;border:1px solid #b8cdf2;border-radius:4px;background:#fff;color:#2468e8;white-space:nowrap;cursor:pointer;font-size:11px}
    .proto-chart-device-modal{width:min(680px,calc(100vw - 40px))!important}.proto-chart-device-tools{display:flex;align-items:center;gap:10px;margin-bottom:12px}.proto-chart-device-search{flex:1;height:36px;border:1px solid #cfd8e4;border-radius:4px;padding:0 10px;color:#334155}.proto-chart-device-note{color:#64748b;font-size:12px;white-space:nowrap}.proto-chart-device-list{max-height:min(420px,calc(100vh - 270px));overflow:auto;border:1px solid #e0e6ed;border-radius:6px}.proto-chart-device-row{height:46px;padding:0 12px;display:grid;grid-template-columns:24px minmax(100px,1fr) minmax(130px,1.3fr) 80px;align-items:center;gap:8px;border-bottom:1px solid #edf1f5;color:#475569}.proto-chart-device-row:last-child{border-bottom:0}.proto-chart-device-row:hover{background:#f7faff}.proto-chart-device-row input{width:15px;height:15px;accent-color:#3478f6}.proto-chart-device-row b{color:#263a55}.proto-chart-device-row span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.proto-chart-device-area{color:#718095;text-align:right}.proto-chart-device-empty{height:100px;display:grid;place-items:center;color:#8491a3}
    body[data-page="device-quality"] .quality-grid{display:flex;flex-wrap:wrap;align-items:stretch;gap:14px;height:auto;min-height:250px}body[data-page="device-quality"] .quality-grid>[data-custom-chart]{flex:0 0 auto;width:var(--quality-component-width,calc(50% - 7px));max-width:100%}body[data-page="device-quality"] .quality-metrics{display:flex;flex-wrap:wrap;height:auto;min-height:94px}body[data-page="device-quality"] .quality-metrics>[data-custom-metric]{flex:0 0 auto;width:var(--quality-component-width,20%);max-width:100%}.quality-page-edit-button{height:30px;margin-left:auto;padding:0 11px;border:1px solid #b8cdf2;border-radius:4px;background:#fff;color:#2468e8;font-size:12px;cursor:pointer}.quality-page-editor-open [data-quality-page-edit]{display:none}.quality-page-editor-open .app{margin-right:440px}.quality-page-editor-open .quality-content{min-width:760px}.quality-page-editor-open [data-custom-chart]{min-height:250px;cursor:pointer;position:relative}.quality-page-editor-open [data-custom-chart]:hover{box-shadow:0 0 0 2px rgba(52,120,246,.18)}.quality-page-editor-open [data-custom-chart].is-editor-selected{box-shadow:0 0 0 2px #3478f6}.quality-page-editor-open [data-custom-chart].is-editor-selected:after{content:'正在配置';position:absolute;z-index:5;right:32px;bottom:8px;padding:3px 7px;border-radius:3px;background:#3478f6;color:#fff;font-size:10px}.quality-editor-bar{min-height:48px;padding:8px 12px;display:flex;align-items:center;gap:8px;border:1px solid #bcd0f2;border-radius:8px;background:#f4f8ff}.quality-editor-bar b{color:#17365f}.quality-editor-bar span{color:#64748b;font-size:12px}.quality-editor-bar-actions{margin-left:auto;display:flex;gap:7px}.quality-editor-bar button{height:32px;padding:0 11px;border:1px solid #cbd6e4;border-radius:4px;background:#fff;color:#475569;cursor:pointer}.quality-editor-bar button.primary{border-color:#3478f6;background:#3478f6;color:#fff}.quality-config-drawer{position:fixed;z-index:85;right:0;top:0;width:440px;height:100vh;display:flex;flex-direction:column;background:#fff;border-left:1px solid #d9e2ed;box-shadow:-10px 0 28px rgba(16,42,76,.12)}.quality-config-drawer-head{height:64px;padding:0 18px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #e6ebf1}.quality-config-drawer-head h3{margin:0;color:#102a4c;font-size:17px}.quality-config-drawer-close{width:32px;height:32px;border:0;border-radius:4px;background:#fff;color:#64748b;font-size:19px;cursor:pointer}.quality-config-drawer-body{flex:1;overflow:auto;padding:16px 18px}.quality-config-section{padding-bottom:16px;margin-bottom:16px;border-bottom:1px solid #edf1f5}.quality-config-section:last-child{border-bottom:0}.quality-config-section h4{margin:0 0 12px;color:#263a55;font-size:13px}.quality-config-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.quality-config-field{min-width:0}.quality-config-field.full{grid-column:1/-1}.quality-config-field label{display:block;margin-bottom:6px;color:#64748b;font-size:12px}.quality-config-field input,.quality-config-field select{width:100%;height:38px;padding:0 10px;border:1px solid #cfd8e4;border-radius:4px;background:#fff;color:#334155}.quality-config-check{height:36px;display:flex;align-items:center;gap:8px;color:#475569;font-size:12px}.quality-config-check input{width:15px;height:15px;accent-color:#3478f6}.quality-config-drawer-foot{height:64px;padding:0 18px;display:flex;align-items:center;justify-content:flex-end;gap:8px;border-top:1px solid #e6ebf1}.quality-config-drawer-foot button{height:36px;padding:0 14px;border:1px solid #cfd8e4;border-radius:4px;background:#fff;color:#475569}.quality-config-drawer-foot .primary{border-color:#3478f6;background:#3478f6;color:#fff}.quality-custom-placeholder{height:100%;min-height:190px;display:grid;place-items:center;color:#718095;text-align:center;background:linear-gradient(180deg,#fff,#f8faff)}.quality-custom-placeholder b{display:block;margin-bottom:7px;color:#245fbf}.quality-custom-placeholder small{display:block;margin-top:5px;color:#8a98a9}
    .quality-page-editor-open [data-custom-metric]{cursor:pointer;position:relative}.quality-page-editor-open [data-custom-metric]:hover{background:#f7faff}.quality-page-editor-open [data-custom-metric].is-editor-selected{box-shadow:inset 0 0 0 2px #3478f6;background:#f5f9ff}.quality-page-editor-open [data-custom-metric].is-editor-selected:after{content:'正在配置';position:absolute;right:32px;bottom:8px;padding:2px 6px;border-radius:3px;background:#3478f6;color:#fff;font-size:10px}.quality-component-tools{position:absolute;z-index:12;top:6px;right:7px;display:flex;align-items:center;gap:5px}.quality-component-drag{width:28px;height:26px;border:0!important;background:transparent!important;color:#8a98a9!important;cursor:grab!important;font-size:16px;line-height:1}.quality-component-drag:active{cursor:grabbing!important}.quality-component-more{width:28px;height:28px!important;padding:0!important;border:1px solid #d3dce8!important;border-radius:5px!important;background:#fff!important;color:#526176!important;font-size:17px}.quality-component-menu{position:absolute;z-index:20;right:0;top:33px;width:104px;padding:4px;border:1px solid #d9e1eb;border-radius:6px;background:#fff;box-shadow:0 8px 20px rgba(29,52,82,.16)}.quality-component-menu[hidden]{display:none}.quality-component-menu button{width:100%;height:32px!important;padding:0 10px!important;border:0!important;background:#fff!important;color:#334155!important;text-align:left}.quality-component-menu button:hover{background:#f2f6fc!important}.quality-component-menu button[data-component-delete]{color:#d14343!important}.quality-component-resize{position:absolute;z-index:13;right:0;bottom:0;width:28px;height:28px;border:0;background:transparent;cursor:nwse-resize;touch-action:none}.quality-component-resize:after{content:"";position:absolute;right:5px;bottom:5px;width:10px;height:10px;border-right:2px solid #5f83b5;border-bottom:2px solid #5f83b5}.quality-component-resizing{user-select:none;cursor:nwse-resize!important}.quality-component-resizing iframe{pointer-events:none}.quality-component-dragging{opacity:.45}.quality-component-drop-before{box-shadow:inset 3px 0 #3478f6!important}.quality-page-editor-open [data-custom-chart]>.phead{padding-right:72px}.quality-page-preview .quality-config-drawer,.quality-page-preview .quality-component-tools,.quality-page-preview .quality-component-resize{display:none}.quality-page-preview .app{margin-right:0}.quality-page-preview [data-custom-chart],.quality-page-preview [data-custom-metric]{cursor:default}.quality-page-preview [data-custom-chart].is-editor-selected,.quality-page-preview [data-custom-metric].is-editor-selected{box-shadow:none;background:inherit}.quality-page-preview [data-custom-chart].is-editor-selected:after,.quality-page-preview [data-custom-metric].is-editor-selected:after{display:none}.quality-metric-tabs{height:48px;margin:-16px -18px 18px;padding:0 18px;display:flex;gap:28px;border-bottom:1px solid #e4e9f0}.quality-metric-tab{height:48px;padding:0;border:0;border-bottom:3px solid transparent;background:#fff;color:#334155;font-size:14px}.quality-metric-tab.is-active{color:#2468e8;border-bottom-color:#3478f6}.quality-metric-panel[hidden],.quality-font-custom-fields[hidden],.quality-trend-fields[hidden]{display:none}.quality-metric-divider{height:1px;margin:18px 0;background:#e7ecf2}.quality-segment-control{height:38px;padding:3px;border:1px solid #cfd8e4;border-radius:5px;display:grid;grid-template-columns:1fr 1fr;gap:3px}.quality-segment-control button{border:0;border-radius:4px;background:#fff;color:#475569}.quality-segment-control button.is-active{background:#eaf1ff;color:#2468e8}.quality-color-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:12px;border-radius:7px;background:#f7f9fc}.quality-trend-toggle{grid-column:1/-1;height:34px;display:flex;align-items:center;gap:8px;color:#24364f}.quality-trend-toggle input{width:16px;height:16px;accent-color:#3478f6}.quality-trend-fields{grid-column:1/-1;padding:12px;border-radius:7px;background:#f7f9fc;display:grid;gap:12px}.quality-filter-control{display:flex!important;align-items:center;justify-content:space-between;color:#334155}.quality-filter-link{color:#2468e8;font-size:12px}.quality-component-picker{width:min(620px,calc(100vw - 40px));max-height:min(760px,calc(100vh - 40px));display:flex;flex-direction:column}.quality-component-picker .proto-modal-body{overflow:auto;padding:16px 20px 20px}.quality-component-search{width:100%;height:38px;border:1px solid #cfd8e4;border-radius:6px;padding:0 12px;color:#334155}.quality-component-group{padding:16px 0;border-bottom:1px solid #e6ebf1}.quality-component-group:last-child{border-bottom:0}.quality-component-group h4{margin:0 0 12px;color:#64748b;font-size:13px;font-weight:500}.quality-component-options{display:grid;grid-template-columns:repeat(5,1fr);gap:12px 8px}.quality-component-option{min-width:0;padding:8px 4px;border:1px solid transparent;border-radius:6px;background:#fff;text-align:center;color:#334155;cursor:pointer}.quality-component-option:hover{border-color:#b9cef4;background:#f4f8ff;color:#2468e8}.quality-component-icon{width:46px;height:40px;margin:0 auto 7px;display:grid;place-items:center;border:1px solid #dbe3ed;border-radius:7px;background:#fff;color:#4d82f3;font-size:21px;font-weight:700}.quality-component-option span{display:block;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .quality-segment-control.quality-segment-three{grid-template-columns:repeat(3,1fr)}.quality-config-field label.quality-config-check{height:36px;margin:0;display:flex;align-items:center;gap:8px;color:#475569;font-size:12px}.quality-component-option .quality-component-icon{display:grid}.quality-source-picker{position:relative}.quality-source-trigger{width:100%;height:38px;padding:0 10px;border:1px solid #cfd8e4;border-radius:4px;background:#fff;color:#334155;display:flex;align-items:center;justify-content:space-between;text-align:left}.quality-source-trigger:after{content:'⌄';color:#718095}.quality-source-menu{position:absolute;z-index:30;left:0;right:0;top:43px;padding:6px;border:1px solid #d6dee8;border-radius:6px;background:#fff;box-shadow:0 8px 20px rgba(29,52,82,.15)}.quality-source-menu[hidden],.quality-custom-time-range[hidden]{display:none}.quality-source-option{height:34px;padding:0 8px;display:flex;align-items:center;gap:8px;border-radius:4px;color:#475569}.quality-source-option:hover{background:#f3f7fd}.quality-source-option input{width:15px;height:15px;accent-color:#3478f6}.quality-custom-time-range{display:grid;grid-template-columns:1fr 1fr;gap:10px}.quality-custom-time-range input{width:100%;height:38px;padding:0 8px;border:1px solid #cfd8e4;border-radius:4px;color:#334155}.quality-chart-option-box[hidden],.quality-config-check[hidden],.quality-config-field[hidden]{display:none}.quality-exclusive-checks{grid-column:1/-1;min-height:38px;padding:0 8px;display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:16px;border-radius:4px}.quality-exclusive-checks .quality-config-check{height:38px;margin:0;padding:0;white-space:nowrap}.quality-chart-option-box{grid-column:1/-1;padding:12px;border-radius:7px;background:#f7f9fc;display:grid;gap:12px}.quality-chart-check-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px 12px}.quality-chart-switch-row{grid-column:1/-1;min-height:38px;display:flex;align-items:center;justify-content:space-between;color:#334155}.quality-switch{position:relative;width:36px;height:20px}.quality-switch input{position:absolute;opacity:0}.quality-switch span{position:absolute;inset:0;border-radius:12px;background:#cbd3dd}.quality-switch span:after{content:'';position:absolute;width:16px;height:16px;left:2px;top:2px;border-radius:50%;background:#fff;transition:transform .16s}.quality-switch input:checked+span{background:#3478f6}.quality-switch input:checked+span:after{transform:translateX(16px)}.quality-theme-preview{display:flex;align-items:center;gap:3px}.quality-theme-preview i{width:22px;height:20px;display:block}.quality-theme-preview i:nth-child(1){background:#3478f6}.quality-theme-preview i:nth-child(2){background:#63a0ff}.quality-theme-preview i:nth-child(3){background:#76c7b7}.quality-theme-preview i:nth-child(4){background:#f2b56b}.quality-theme-preview i:nth-child(5){background:#9b8bea}.quality-chart-accordions{margin:-2px 0}.quality-chart-accordion{border-bottom:1px solid #e4e9f0}.quality-chart-accordion summary{height:58px;padding:0 4px;display:flex;align-items:center;justify-content:space-between;color:#263a55;font-size:14px;cursor:pointer;list-style:none}.quality-chart-accordion summary::-webkit-details-marker{display:none}.quality-chart-accordion summary:after{content:"";width:8px;height:8px;margin-right:6px;border-right:2px solid #6b7787;border-bottom:2px solid #6b7787;transform:rotate(45deg);transition:transform .16s}.quality-chart-accordion[open] summary:after{transform:rotate(225deg)}.quality-chart-accordion-body{padding:2px 4px 18px;display:grid;gap:14px}.quality-text-format{height:38px;padding:0 5px;border:1px solid #cfd8e4;border-radius:5px;display:flex;align-items:center;justify-content:space-between}.quality-text-format button{min-width:34px;height:30px;padding:0 5px;border:0;background:#fff;color:#26313f;font-size:15px}.quality-chart-subtitle{display:flex;align-items:center;justify-content:space-between;color:#334155}.quality-chart-subtitle button{border:0;background:#fff;color:#2468e8;cursor:pointer}.quality-chart-accordion-body>.quality-chart-option-box{padding:12px}.quality-chart-accordion-body input:not([type="checkbox"]){width:100%;height:38px;padding:0 10px;border:1px solid #cfd8e4;border-radius:4px;color:#334155}@media(max-width:1180px){.quality-page-editor-open .app{margin-right:380px}.quality-config-drawer{width:380px}.quality-page-editor-open .quality-content{min-width:680px}}
  `;
  document.head.appendChild(deviceChartStyle);

  const normalize = value => String(value || '').replace(/[\s·（）()]/g, '').toLowerCase();
  const getText = element => (element ? element.textContent.trim() : '');
  const valueSpan = control => Array.from(control.querySelectorAll('span:not(.chev)'))
    .filter(span => !/^[▣▦⌕]$/.test(getText(span)))
    .sort((a, b) => getText(b).length - getText(a).length)[0] || control.querySelector('span:not(.chev)');
  let currentPopover = null;
  let currentLanguage = 'zh';
  let currentTheme = 'light';
  const projectColumns = [
    { key: 'index', label: '序号', group: '基础信息' },
    { key: 'projectName', label: '模板名称', group: '基础信息' },
    { key: 'deviceCount', label: '覆盖设备数', group: '基础信息' },
    { key: 'deviceNames', label: '检测设备SN', group: '基础信息' },
    { key: 'boardTotal', label: '板卡总数', group: '板卡指标' },
    { key: 'boardGood', label: '板卡良品总数', group: '板卡指标' },
    { key: 'boardDppm', label: '板卡DPPM', group: '板卡指标' },
    { key: 'boardYield', label: '板卡良率（%）', group: '板卡指标' },
    { key: 'boardNg', label: '板卡不良总数', group: '板卡指标' },
    { key: 'boardNgRate', label: '板卡不良率（%）', group: '板卡指标' },
    { key: 'boardFalse', label: '板卡误报总数', group: '板卡指标' },
    { key: 'boardFalseRate', label: '板卡误报率（%）', group: '板卡指标' },
    { key: 'boardPass', label: '板卡直通总数', group: '板卡指标' },
    { key: 'boardPassRate', label: '板卡直通率（%）', group: '板卡指标' },
    { key: 'componentTotal', label: '器件总数', group: '器件指标' },
    { key: 'componentOk', label: '器件OK总数', group: '器件指标' },
    { key: 'componentDppm', label: '器件DPPM', group: '器件指标' },
    { key: 'componentFalseDppm', label: '器件误报DPPM', group: '器件指标' },
    { key: 'componentOkRate', label: '器件OK率（%）', group: '器件指标' },
    { key: 'componentNg', label: '器件NG总数', group: '器件指标' },
    { key: 'componentNgRate', label: '器件NG率（%）', group: '器件指标' },
    { key: 'componentSpecialNg', label: '器件NG数（特殊缺陷）', group: '器件指标' },
    { key: 'componentPass', label: '器件直通总数', group: '器件指标' },
    { key: 'componentPassRate', label: '器件直通率（%）', group: '器件指标' },
    { key: 'componentFalse', label: '器件误报数', group: '器件指标' },
    { key: 'componentSpecialFalse', label: '器件误报数（特殊缺陷）', group: '器件指标' },
    { key: 'componentMiss', label: '器件漏报数', group: '器件指标' },
    { key: 'componentSpecialMiss', label: '器件漏报数（特殊缺陷）', group: '器件指标' }
  ];
  let activeProjectColumns = new Set(projectColumns.map(column => column.key));
  const deviceMetricColumns = projectColumns
    .filter(column => column.group !== '基础信息' && column.key !== 'boardGood')
    .flatMap(column => column.key === 'boardYield'
      ? [projectColumns.find(item => item.key === 'boardGood'), column]
      : [column]);
  const deviceColumns = [
    { key: 'index', label: '序号', group: '基础信息' },
    { key: 'deviceName', label: '设备名称', group: '基础信息' },
    { key: 'deviceSn', label: '设备SN', group: '基础信息' },
    { key: 'projectCount', label: '检测模板数', group: '基础信息' },
    ...deviceMetricColumns,
    { key: 'lastDataTime', label: '最后接收数据时间', group: '基础信息' }
  ];
  const defaultDeviceColumnKeys = ['index', 'deviceName', 'deviceSn', 'projectCount', 'boardTotal', 'boardDppm', 'boardGood', 'boardYield', 'boardFalseRate', 'boardPassRate', 'componentDppm', 'componentNgRate', 'lastDataTime'];
  const deviceSortableColumnKeys = new Set(['projectCount', 'boardTotal', 'boardGood', 'boardFalseRate']);
  let activeDeviceColumns = new Set(defaultDeviceColumnKeys);
  let currentMouth = 'review';
  let currentComparisonType = 'device';
  let currentTrendPeriod = 'day';
  let currentComparisonPeriod = '7d';
  let comparisonDateRange = { start: '2026-07-29', end: '2026-08-04' };
  let currentProjectTrendMode = 'day';
  let selectedChartDevices = ['AOI-01', 'AOI-03', 'AOI-02', 'AOI-05', 'AOI-06'];

  const projectSamples = [
    { name: '3267504J2G_A面', uuid: '6d7c21c8-9c32-4a10-a501-08e8fe634912', devices: ['AOI-01','AOI-03','AOI-04'], boardTotal: 60680, componentTotal: 5311420, original: { yield: 92.84, falseRate: 6.28, passRate: 92.84, componentNgRate: .194, componentFalseDppm: 1180, componentPassRate: 96.72 }, review: { yield: 98.76, falseRate: .86, passRate: 97.91, componentNgRate: .082, componentFalseDppm: 812, componentPassRate: 98.43 } },
    { name: '1-A', uuid: '9b40ccad-1ab6-4a21-b791-c3745d0348e2', devices: ['AOI-02','AOI-05'], boardTotal: 28412, componentTotal: 2193680, original: { yield: 91.86, falseRate: 7.12, passRate: 91.86, componentNgRate: .263, componentFalseDppm: 1410, componentPassRate: 95.84 }, review: { yield: 98.72, falseRate: 1.19, passRate: 96.86, componentNgRate: .186, componentFalseDppm: 1024, componentPassRate: 97.32 } },
    { name: '329134S_P129', uuid: 'c1a92c30-53c3-41f4-a031-3b84d623719e', devices: ['AOI-02','AOI-04','AOI-06'], boardTotal: 21596, componentTotal: 1746225, original: { yield: 90.18, falseRate: 8.36, passRate: 90.18, componentNgRate: .342, componentFalseDppm: 2050, componentPassRate: 94.18 }, review: { yield: 97.26, falseRate: 2.58, passRate: 95.70, componentNgRate: .278, componentFalseDppm: 1608, componentPassRate: 96.54 } },
    { name: '155042F_P9', uuid: '744876c1-7837-46e5-b96d-e8c1161ad904', devices: ['AOI-01'], boardTotal: 18340, componentTotal: 1492780, original: { yield: 94.15, falseRate: 4.31, passRate: 94.15, componentNgRate: .221, componentFalseDppm: 1210, componentPassRate: 96.40 }, review: { yield: 98.94, falseRate: .99, passRate: 97.61, componentNgRate: .171, componentFalseDppm: 932, componentPassRate: 98.02 } }
  ];
  const comparisonProjects = [
    ...projectSamples,
    { name: 'SMT2407301669-T', original: { yield: 93.62 }, review: { yield: 99.04 } },
    { name: 'A14-POWER', original: { yield: 93.31 }, review: { yield: 98.88 } },
    { name: '202608-NPI-02', original: { yield: 92.17 }, review: { yield: 98.41 } },
    { name: 'JLC_AOI_DEMO', original: { yield: 91.72 }, review: { yield: 98.16 } },
    { name: 'AOI04-BATCH', original: { yield: 91.23 }, review: { yield: 97.82 } },
    { name: 'D04-NPI', original: { yield: 90.74 }, review: { yield: 97.48 } },
    { name: 'AOI02-MAIN', original: { yield: 90.31 }, review: { yield: 97.15 } },
    { name: 'B02-TEST', original: { yield: 89.86 }, review: { yield: 96.78 } }
  ];
  const deviceSamples = [
    { name: 'AOI-01', ip: '192.168.10.21', sn: 'SI1020E1112', projects: [{ name: '3267504J2G_A面', uuid: '6d7c21c8-9c32-4a10-a501-08e8fe634912' }, { name: '155042F_P9', uuid: '744876c1-7837-46e5-b96d-e8c1161ad904' }, { name: 'JLC_AOI_DEMO', uuid: '08db6715-a4d8-4bc2-9f31-a844b7964371' }, { name: '20260804_NPI', uuid: '75095fee-19a5-46d7-9df1-9d21bc370b26' }, { name: '0804-FPC', uuid: 'f2f6c57b-d486-428d-82b5-c29297b28666' }], boardTotal: 34620, lastDataTime: '2026-08-04 14:32:56', original: { yield: 93.20, falseRate: 5.84, passRate: 93.20, componentNgRate: .208, componentFalseDppm: 1240, componentPassRate: 96.40 }, review: { yield: 99.12, falseRate: .74, passRate: 98.34, componentNgRate: .076, componentFalseDppm: 760, componentPassRate: 98.82 } },
    { name: 'AOI-03', ip: '192.168.10.23', sn: 'SI1020E1148', projects: [{ name: '3267504J2G_A面', uuid: '6d7c21c8-9c32-4a10-a501-08e8fe634912' }, { name: '329134S_P129', uuid: 'c1a92c30-53c3-41f4-a031-3b84d623719e' }, { name: 'SMT2407301669-T', uuid: '7a80f109-ac09-456a-bcbf-4d5a519725da' }, { name: 'JLC_AOI_DEMO', uuid: '08db6715-a4d8-4bc2-9f31-a844b7964371' }], boardTotal: 29880, lastDataTime: '2026-08-04 14:10:12', original: { yield: 92.46, falseRate: 5.91, passRate: 92.46, componentNgRate: .217, componentFalseDppm: 1320, componentPassRate: 96.08 }, review: { yield: 98.86, falseRate: .92, passRate: 97.82, componentNgRate: .091, componentFalseDppm: 830, componentPassRate: 98.55 } },
    { name: 'AOI-02', ip: '192.168.10.22', sn: 'SI1020E1186', projects: [{ name: '1-A', uuid: '9b40ccad-1ab6-4a21-b791-c3745d0348e2' }, { name: '329134S_P129', uuid: 'c1a92c30-53c3-41f4-a031-3b84d623719e' }, { name: '155042F_P9', uuid: '744876c1-7837-46e5-b96d-e8c1161ad904' }, { name: 'AOI02-MAIN', uuid: 'b69e4f79-e85a-4d97-8a15-e9d4afc1d107' }, { name: '202608-NPI-02', uuid: 'd93cdcab-4632-4b13-b231-17df27c2d7ed' }, { name: 'B02-TEST', uuid: '772089b4-ad35-468b-9aad-593088823fef' }], boardTotal: 32110, lastDataTime: '2026-08-04 13:58:22', original: { yield: 91.64, falseRate: 6.42, passRate: 91.64, componentNgRate: .238, componentFalseDppm: 1490, componentPassRate: 95.74 }, review: { yield: 98.62, falseRate: 1.14, passRate: 97.31, componentNgRate: .102, componentFalseDppm: 910, componentPassRate: 98.28 } },
    { name: 'AOI-04', ip: '192.168.10.24', sn: 'SI1020E1206', projects: [{ name: '3267504J2G_A面', uuid: '6d7c21c8-9c32-4a10-a501-08e8fe634912' }, { name: '329134S_P129', uuid: 'c1a92c30-53c3-41f4-a031-3b84d623719e' }, { name: '155042F_P9', uuid: '744876c1-7837-46e5-b96d-e8c1161ad904' }, { name: 'AOI04-BATCH', uuid: '0de70c26-1af1-4f74-a99b-dedb34fc61f8' }, { name: 'D04-NPI', uuid: 'dfafc738-a76c-4f1f-9caf-7ca0ab05dc90' }], boardTotal: 27840, lastDataTime: '2026-08-04 12:58:16', original: { yield: 89.98, falseRate: 7.36, passRate: 89.98, componentNgRate: .284, componentFalseDppm: 1680, componentPassRate: 94.92 }, review: { yield: 96.91, falseRate: 2.74, passRate: 95.18, componentNgRate: .146, componentFalseDppm: 1210, componentPassRate: 97.44 } }
  ];
  const comparisonDevices = [
    { name: 'AOI-01', area: '区域A', original: { yield: 93.20 }, review: { yield: 99.12 } },
    { name: 'AOI-03', area: '区域C', original: { yield: 92.46 }, review: { yield: 98.86 } },
    { name: 'AOI-02', area: '区域B', original: { yield: 91.64 }, review: { yield: 98.62 } },
    { name: 'AOI-05', area: '区域B', original: { yield: 91.38 }, review: { yield: 98.30 } },
    { name: 'AOI-06', area: '区域C', original: { yield: 91.10 }, review: { yield: 98.08 } },
    { name: 'AOI-07', area: '区域A', original: { yield: 90.92 }, review: { yield: 97.95 } },
    { name: 'AOI-08', area: '区域D', original: { yield: 90.74 }, review: { yield: 97.72 } },
    { name: 'AOI-09', area: '区域A', original: { yield: 90.51 }, review: { yield: 97.58 } },
    { name: 'AOI-10', area: '区域B', original: { yield: 90.28 }, review: { yield: 97.31 } },
    { name: 'AOI-11', area: '区域C', original: { yield: 90.05 }, review: { yield: 97.10 } },
    { name: 'AOI-04', area: '区域D', original: { yield: 89.98 }, review: { yield: 96.91 } },
    { name: 'AOI-12', area: '区域D', original: { yield: 89.72 }, review: { yield: 96.63 } }
  ];
  const additionalDeviceTemplates = [
    { name: 'SMT2407301669-T', uuid: '7a80f109-ac09-456a-bcbf-4d5a519725da' },
    { name: 'JLC_AOI_DEMO', uuid: '08db6715-a4d8-4bc2-9f31-a844b7964371' },
    { name: '202608-NPI-02', uuid: 'd93cdcab-4632-4b13-b231-17df27c2d7ed' }
  ];
  comparisonDevices.filter(device => !deviceSamples.some(sample => sample.name === device.name)).forEach((device, index) => {
    const sequence = Number(device.name.split('-')[1]);
    const boardTotal = 23860 - index * 820;
    deviceSamples.push({
      name: device.name,
      ip: `192.168.10.${24 + sequence}`,
      sn: `SI1020E${1238 + index * 22}`,
      projects: additionalDeviceTemplates.slice(0, 2 + index % 2),
      boardTotal,
      lastDataTime: `2026-08-04 ${String(12 - Math.floor(index / 2)).padStart(2, '0')}:${String(48 - index * 3).padStart(2, '0')}:18`,
      original: { yield: device.original.yield, falseRate: Math.max(3.2, 99 - device.original.yield), passRate: device.original.yield, componentNgRate: .22 + index * .008, componentFalseDppm: 1520 + index * 55, componentPassRate: 95.8 - index * .11 },
      review: { yield: device.review.yield, falseRate: Math.max(.45, 99.2 - device.review.yield), passRate: Math.max(94, device.review.yield - 1.1), componentNgRate: .10 + index * .006, componentFalseDppm: 880 + index * 48, componentPassRate: 98.3 - index * .08 }
    });
  });
  const comparisonAreas = [
    { name: '区域A', original: { yield: 92.31 }, review: { yield: 98.22 } },
    { name: '区域B', original: { yield: 91.10 }, review: { yield: 97.99 } },
    { name: '区域C', original: { yield: 91.20 }, review: { yield: 98.01 } },
    { name: '区域D', original: { yield: 90.15 }, review: { yield: 97.09 } }
  ];

  function closePopover() {
    if (currentPopover) currentPopover.remove();
    currentPopover = null;
  }

  function toast(message, type = 'success') {
    let stack = document.querySelector('.proto-toast-stack');
    if (!stack) {
      stack = document.createElement('div');
      stack.className = 'proto-toast-stack';
      stack.setAttribute('aria-live', 'polite');
      document.body.appendChild(stack);
    }
    const item = document.createElement('div');
    item.className = `proto-toast ${type}`;
    item.textContent = message;
    stack.appendChild(item);
    setTimeout(() => item.remove(), 2600);
  }

  function openLocalSpc() {
    toast('跳转至本机 SPC', 'info');
  }

  function closeDeviceProjectTooltip() {
    document.querySelector('.proto-device-project-tooltip')?.remove();
  }

  function showDeviceProjectTooltip(target) {
    closeDeviceProjectTooltip();
    let values = [];
    try { values = JSON.parse(decodeURIComponent(target.dataset.projectValues || '[]')); } catch (error) { values = []; }
    if (!values.length) return;
    const tooltip = document.createElement('div');
    tooltip.className = 'proto-device-project-tooltip';
    tooltip.setAttribute('role', 'tooltip');
    const title = document.createElement('b');
    title.textContent = `${target.dataset.projectLabel || '全部内容'}（${values.length}）`;
    tooltip.appendChild(title);
    values.forEach((value, index) => {
      const item = document.createElement('span');
      item.textContent = `${index + 1}. ${value}`;
      tooltip.appendChild(item);
    });
    document.body.appendChild(tooltip);
    const rect = target.getBoundingClientRect();
    const gap = 8;
    const left = Math.min(Math.max(gap, rect.left), window.innerWidth - tooltip.offsetWidth - gap);
    const below = rect.bottom + gap;
    const top = below + tooltip.offsetHeight <= window.innerHeight - gap ? below : Math.max(gap, rect.top - tooltip.offsetHeight - gap);
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }

  function openModal(title, bodyHtml, confirmLabel = '保存设置', onConfirm) {
    const backdrop = document.createElement('div');
    backdrop.className = 'proto-backdrop';
    backdrop.innerHTML = `<section class="proto-modal" role="dialog" aria-modal="true" aria-label="${title}"><header class="proto-modal-head"><h3>${title}</h3><button class="proto-close" aria-label="关闭">×</button></header><div class="proto-modal-body">${bodyHtml}</div><footer class="proto-modal-foot"><button class="proto-secondary" data-close>取消</button><button class="proto-primary" data-confirm>${confirmLabel}</button></footer></section>`;
    document.body.appendChild(backdrop);
    const close = () => backdrop.remove();
    backdrop.querySelector('.proto-close').onclick = close;
    backdrop.querySelector('[data-close]').onclick = close;
    backdrop.addEventListener('click', event => { if (event.target === backdrop) close(); });
    backdrop.querySelector('[data-confirm]').onclick = () => {
      if (onConfirm && onConfirm(backdrop) === false) return;
      close();
    };
    const focusable = backdrop.querySelector('input,select,button');
    if (focusable) focusable.focus();
    return backdrop;
  }

  function initializeAccountMenu() {
    document.querySelectorAll('.nav-item[href="12-个人中心.html"],.nav .item[href="12-个人中心.html"]').forEach(item => item.remove());

    const entry = document.querySelector('.account-entry');
    const sidebar = document.querySelector('.sidebar');
    if (!entry || !sidebar || entry.closest('.sidebar-account')) return;

    const accountName = getText(entry.querySelector('.account-copy b')) || 'admin';
    const roleName = getText(entry.querySelector('.account-copy small')) || '平台管理员';
    const wrap = document.createElement('div');
    wrap.className = 'account-menu-wrap';
    entry.parentNode.insertBefore(wrap, entry);
    wrap.appendChild(entry);
    const sidebarAccount = document.createElement('div');
    sidebarAccount.className = 'sidebar-account';
    sidebarAccount.setAttribute('aria-label', '当前账号');
    sidebarAccount.appendChild(wrap);
    sidebar.appendChild(sidebarAccount);

    entry.setAttribute('role', 'button');
    entry.setAttribute('aria-haspopup', 'menu');
    entry.setAttribute('aria-expanded', 'false');
    entry.setAttribute('title', '账号菜单');

    const menu = document.createElement('div');
    menu.className = 'account-menu';
    menu.setAttribute('role', 'menu');
    menu.setAttribute('aria-label', '账号菜单');
    menu.hidden = true;
    menu.innerHTML = `<div class="account-menu-summary"><div class="account-menu-summary-row"><span>账号名称</span><b>${accountName}</b></div><div class="account-menu-summary-row"><span>角色名称</span><b>${roleName}</b></div></div><div class="account-menu-actions"><a class="account-menu-action" href="12-个人中心.html" role="menuitem">个人中心</a><button class="account-menu-action danger" type="button" role="menuitem" data-account-logout>退出登录</button></div>`;
    wrap.appendChild(menu);

    const setOpen = open => {
      menu.hidden = !open;
      wrap.classList.toggle('open', open);
      entry.setAttribute('aria-expanded', open ? 'true' : 'false');
    };

    entry.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      setOpen(menu.hidden);
    });
    entry.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      setOpen(menu.hidden);
    });
    menu.querySelector('[data-account-logout]').addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      openModal('退出登录', '<p style="margin:0;color:#475569;line-height:1.7">确认退出当前账号吗？</p>', '退出登录', () => toast('已退出登录', 'info'));
    });
    document.addEventListener('click', event => {
      if (!wrap.contains(event.target)) setOpen(false);
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') setOpen(false);
    });
  }

  function openHelp() {
    openModal('原型操作说明', `<p style="margin-top:0;line-height:1.7;color:#475569">这是 SPC 集中管理平台的可交互产品原型。你可以切换左侧页面、选择筛选条件、执行查询、切换统计口径和页签，并演示详情、导出、设备分配及补传操作。</p><div style="background:#f7f9fc;border-radius:6px;padding:12px;color:#64748b;font-size:12px;line-height:1.7">原型中的数据用于展示交互和页面结构，不代表现场真实生产数据。</div>`, '知道了');
  }

  const number = value => Math.round(value).toLocaleString('zh-CN');
  const pct = value => `${Number(value).toFixed(2)}%`;

  function mouthLabel(mouth) {
    return mouth === 'original' ? '机器判定' : mouth === 'second' ? '最终复判' : '一次复判';
  }

  function mouthData(sample, mouth) {
    const sourceMouth = mouth;
    if (sourceMouth !== 'second') return sample[sourceMouth] || null;
    const review = sample.review;
    if (!review) return null;
    return {
      yield: Math.min(99.95, review.yield + .28),
      falseRate: Math.max(.12, review.falseRate - .18),
      passRate: Math.min(99.8, review.passRate + .34),
      componentNgRate: Math.max(.025, review.componentNgRate - .018),
      componentFalseDppm: Math.max(120, review.componentFalseDppm - 135),
      componentPassRate: Math.min(99.8, review.componentPassRate + .31)
    };
  }

  function statsFor(sample, mouth) {
    const source = mouthData(sample, mouth);
    if (!source) return null;
    const componentTotal = sample.componentTotal || sample.boardTotal * 82;
    const boardGood = Math.round(sample.boardTotal * source.yield / 100);
    const boardNg = sample.boardTotal - boardGood;
    const boardFalse = Math.round(sample.boardTotal * source.falseRate / 100);
    const boardPass = Math.round(sample.boardTotal * source.passRate / 100);
    const componentNg = Math.round(componentTotal * source.componentNgRate / 100);
    const componentFalse = Math.round(componentTotal * source.componentFalseDppm / 1000000);
    const componentPass = Math.round(componentTotal * source.componentPassRate / 100);
    return {
      boardTotal: number(sample.boardTotal), boardGood: number(boardGood), boardDppm: number(boardNg / sample.boardTotal * 1000000), boardYield: pct(source.yield), boardNg: number(boardNg), boardNgRate: pct(100 - source.yield), boardFalse: number(boardFalse), boardFalseRate: pct(source.falseRate), boardPass: number(boardPass), boardPassRate: pct(source.passRate),
      componentTotal: number(componentTotal), componentOk: number(componentTotal - componentNg), componentDppm: number(componentNg / componentTotal * 1000000), componentFalseDppm: number(source.componentFalseDppm), componentOkRate: pct(100 - source.componentNgRate), componentNg: number(componentNg), componentNgRate: pct(source.componentNgRate), componentSpecialNg: number(componentNg * .034), componentPass: number(componentPass), componentPassRate: pct(source.componentPassRate), componentFalse: number(componentFalse), componentSpecialFalse: number(componentFalse * .031), componentMiss: number(Math.max(3, componentNg * .008)), componentSpecialMiss: number(Math.max(1, componentNg * .001))
    };
  }

  function columnWidth(key) {
    const widths = { index: 60, projectName: 170, projectUuid: 240, projectNames: 210, projectUuids: 290, deviceCount: 110, deviceNames: 240, deviceName: 140, deviceSn: 150, projectCount: 110, lastDataTime: 170, componentSpecialNg: 190, componentSpecialFalse: 210, componentSpecialMiss: 210 };
    return widths[key] || (key.includes('Rate') ? 140 : 130);
  }

  function deviceProjectValueMarkup(values, label) {
    const list = Array.isArray(values) ? values : [];
    if (!list.length) return '—';
    const encodedValues = encodeURIComponent(JSON.stringify(list));
    return `<span class="device-project-value" tabindex="0" data-project-values="${encodedValues}" data-project-label="${label}" aria-label="${label}，共 ${list.length} 个"><span class="device-project-value-text">${list[0]}</span>${list.length > 1 ? `<span class="device-project-value-count">等${list.length}个</span>` : ''}</span>`;
  }

  function tableMarkup(columns, rows, tableAttribute) {
    const selectable = tableAttribute === 'data-device-table';
    const cols = columns.map(column => `<col data-column-key="${column.key}" style="width:${columnWidth(column.key)}px">`).join('');
    const heads = columns.map(column => {
      const sortable = selectable && deviceSortableColumnKeys.has(column.key);
      const label = sortable
        ? `<button type="button" class="proto-sort-button" data-device-sort="${column.key}" title="按${column.label}从高到低排序" aria-label="${column.label}，点击按从高到低排序"><span>${column.label}</span><i aria-hidden="true">↕</i></button>`
        : column.label;
      return `<th data-column-key="${column.key}" class="${column.group === '基础信息' ? '' : 'num'}"${sortable ? ' aria-sort="none"' : ''}>${label}</th>`;
    }).join('');
    const body = rows.map(row => `<tr data-device-row="${row.deviceSn || row.index}">${selectable ? `<td class="device-select-cell"><input class="device-row-check" type="checkbox" aria-label="选择设备 ${row.deviceName}"></td>` : ''}${columns.map(column => {
      const numeric = column.group === '基础信息' ? '' : 'num';
      if (selectable && column.key === 'projectNames') return `<td data-column-key="projectNames">${deviceProjectValueMarkup(row.projectNames, '全部模板名称')}</td>`;
      if (column.key === 'projectName') return `<td data-column-key="projectName"><a href="#" class="project-link" data-project-uuid="${row.projectUuid}">${row.projectName}</a></td>`;
      if (column.key === 'deviceName') return `<td data-column-key="deviceName"><a href="#" class="device-link" data-device-name="${row.deviceName}" title="点击后提示跳转至本机 SPC">${row.deviceName}</a></td>`;
      return `<td data-column-key="${column.key}" class="${numeric}${column.key === 'projectUuid' ? ' uuid' : ''}">${row[column.key] ?? '—'}</td>`;
    }).join('')}</tr>`).join('');
    return `<colgroup>${selectable ? '<col style="width:44px">' : ''}${cols}</colgroup><thead><tr>${selectable ? '<th class="device-select-cell"><input class="device-select-all" type="checkbox" aria-label="全选设备"></th>' : ''}${heads}</tr></thead><tbody>${body}</tbody>`;
  }

  function paginationMarkup(total, current = 1, pageSize = 10) {
    const pageCount = Math.max(1, Math.ceil(total / pageSize));
    const clampedCurrent = Math.min(Math.max(1, current), pageCount);
    let visiblePages;
    if (pageCount <= 7) {
      visiblePages = Array.from({ length: pageCount }, (_, index) => index + 1);
    } else if (clampedCurrent <= 4) {
      visiblePages = [1, 2, 3, 4, 5, 'right-gap', pageCount];
    } else if (clampedCurrent >= pageCount - 3) {
      visiblePages = [1, 'left-gap', pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1, pageCount];
    } else {
      visiblePages = [1, 'left-gap', clampedCurrent - 1, clampedCurrent, clampedCurrent + 1, 'right-gap', pageCount];
    }
    const pages = visiblePages.map(page => typeof page === 'number'
      ? `<button class="proto-page-number ${page === clampedCurrent ? 'on' : ''}" data-page-number="${page}">${page}</button>`
      : '<span class="proto-page-ellipsis">…</span>').join('');
    return `<div class="proto-pagination"><button class="proto-page-nav" aria-label="上一页" ${clampedCurrent <= 1 ? 'disabled' : ''}>‹</button>${pages}<button class="proto-page-nav" aria-label="下一页" ${clampedCurrent >= pageCount ? 'disabled' : ''}>›</button><select class="proto-page-size" aria-label="每页条数"><option selected>10 条/页</option><option>20 条/页</option><option>50 条/页</option></select><label class="proto-page-jump">跳至<input inputmode="numeric" aria-label="跳转页码">页</label></div>`;
  }

  function pagerTotal(pager) {
    const text = getText(pager);
    const match = text.match(/共\s*([\d,]+)\s*(?:条|项|个|台|块)/) || text.match(/总计[:：]?\s*([\d,]+)/);
    if (match) return parseInt(match[1].replace(/,/g, ''), 10);
    const table = pager.closest('section')?.querySelector('table');
    return table?.tBodies?.[0]?.rows?.length || 0;
  }

  function normalizePagers(root = document) {
    root.querySelectorAll('.pager').forEach(pager => {
      const total = pagerTotal(pager);
      let summary = pager.querySelector(':scope > span');
      if (!summary) {
        summary = document.createElement('span');
        pager.prepend(summary);
      }
      summary.textContent = `共${number(total)}条`;
      pager.querySelectorAll(':scope > .pages,:scope > .proto-pagination,:scope > span:not(:first-child)').forEach(element => element.remove());
      pager.insertAdjacentHTML('beforeend', paginationMarkup(total));
    });
  }

  function ensureGlobalDataTimestamp(root = document) {
    const header = root.querySelector('.top,.topbar');
    if (!header) return;
    const source = Array.from(root.querySelectorAll('.fresh')).find(item => /数据.*(?:更新|更新时间)/.test(getText(item)));
    const text = (source && getText(source).match(/数据.*?(?:更新至|更新时间[:：]?)\s*[\d-]+\s*[\d:]+/)?.[0]) || '数据已更新至 2026-08-04 14:32:18';
    let timestamp = header.querySelector('.proto-global-fresh');
    if (!timestamp) {
      timestamp = document.createElement('div');
      timestamp.className = 'proto-global-fresh';
      const actions = header.querySelector('.top-actions');
      if (actions) header.insertBefore(timestamp, actions); else header.appendChild(timestamp);
    }
    timestamp.innerHTML = `<i></i><span>${text}</span>`;
    if (source && source !== timestamp) {
      const scope = source.closest('.scope,.scope-line');
      source.remove();
      if (scope && !getText(scope).trim()) scope.remove();
    }
    if (!document.getElementById('proto-global-fresh-style')) {
      const style = document.createElement('style');
      style.id = 'proto-global-fresh-style';
      style.textContent = '.proto-global-fresh{height:32px;margin-left:auto;margin-right:12px;display:flex;align-items:center;gap:7px;color:#64748b;font-size:12px;white-space:nowrap}.proto-global-fresh i{width:8px;height:8px;border-radius:50%;background:#20a464;box-shadow:0 0 0 3px rgba(32,164,100,.12)}';
      document.head.appendChild(style);
    }
  }

  function normalizeTimeFields(root = document) {
    root.querySelectorAll('.field').forEach(field => {
      const label = getText(field.querySelector('label'));
      if (/时间/.test(label) && field.querySelector('.control')) field.classList.add('proto-time-field');
    });
  }

  function normalizeDropdownIcons(root = document) {
    root.querySelectorAll('.control .chev').forEach(icon => {
      icon.textContent = '';
      icon.setAttribute('aria-hidden', 'true');
    });
  }

  function normalizeChartScaling(root = document) {
    root.querySelectorAll('svg[preserveAspectRatio="none"]').forEach(svg => {
      svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      svg.style.maxWidth = '100%';
      svg.style.maxHeight = '100%';
    });
  }

  function applyColumns(table, columns, keys, stickyCount) {
    if (!table) return;
    const visible = new Set(keys);
    table.querySelectorAll('[data-column-key]').forEach(element => {
      const shown = visible.has(element.dataset.columnKey);
      element.hidden = !shown;
      element.style.display = shown ? '' : 'none';
    });
    const selectionWidth = table.matches('[data-device-table]') || table.classList.contains('select-export-table') ? 44 : 0;
    const totalWidth = selectionWidth + columns.reduce((sum, column) => {
      if (!visible.has(column.key)) return sum;
      const col = table.querySelector(`col[data-column-key="${column.key}"]`);
      return sum + (parseInt(col && col.style.width, 10) || 120);
    }, 0);
    const containerWidth = table.closest('.table-scroll')?.clientWidth || 0;
    table.style.width = totalWidth > containerWidth ? `${Math.max(totalWidth, 520)}px` : '100%';
    let stickyLeft = selectionWidth;
    columns.slice(0, stickyCount).forEach(column => {
      if (!visible.has(column.key)) return;
      const cells = table.querySelectorAll(`th[data-column-key="${column.key}"],td[data-column-key="${column.key}"]`);
      cells.forEach(cell => { cell.style.left = `${stickyLeft}px`; });
      const header = table.querySelector(`th[data-column-key="${column.key}"]`);
      stickyLeft += header ? header.getBoundingClientRect().width : columnWidth(column.key);
    });
  }

  function applyProjectColumns(keys) {
    const table = document.querySelector('[data-project-table]');
    applyColumns(table, projectColumns, keys, 3);
    activeProjectColumns = new Set(keys);
  }

  function applyDeviceColumns(keys) {
    const table = document.querySelector('[data-device-table]');
    applyColumns(table, deviceColumns, keys, 3);
    activeDeviceColumns = new Set(keys);
  }

  function openProjectColumnManager() {
    const isDevice = !!document.querySelector('[data-device-table]');
    const columns = isDevice ? deviceColumns : projectColumns;
    const activeColumns = isDevice ? activeDeviceColumns : activeProjectColumns;
    const defaultColumns = isDevice ? new Set(defaultDeviceColumnKeys) : new Set(projectColumns.map(column => column.key));
    const lockedKeys = isDevice ? new Set(['deviceName', 'deviceSn']) : new Set(['projectName']);
    const groups = ['基础信息', '板卡指标', '器件指标'];
    const groupHtml = groups.map(group => `<section class="proto-column-group"><h4>${group}</h4><div class="proto-column-grid">${columns.filter(column => column.group === group).map(column => `<label class="proto-column-option" ${lockedKeys.has(column.key) ? `title="${column.label}为必选字段"` : ''}><input type="checkbox" value="${column.key}" ${activeColumns.has(column.key) || lockedKeys.has(column.key) ? 'checked' : ''} ${lockedKeys.has(column.key) ? 'disabled data-column-locked="true"' : ''}><span title="${column.label}">${column.label}${lockedKeys.has(column.key) ? '（必选）' : ''}</span></label>`).join('')}</div></section>`).join('');
    const backdrop = openModal('显示列', `<div class="proto-column-toolbar"><span class="proto-column-note">已选择 <b data-column-count>${activeColumns.size}</b> / ${columns.length} 列</span><div class="proto-column-actions"><button type="button" data-column-action="all">全选</button><button type="button" data-column-action="none">取消全选</button><button type="button" data-column-action="default">恢复默认</button></div></div><div class="proto-column-groups">${groupHtml}</div>`, '应用列设置', modal => {
      const keys = Array.from(new Set([...lockedKeys, ...Array.from(modal.querySelectorAll('.proto-column-option input:checked')).map(input => input.value)]));
      if (!keys.length) { toast('请至少保留一个显示字段', 'error'); return false; }
      if (isDevice) applyDeviceColumns(keys); else applyProjectColumns(keys);
      toast(`显示列已更新，当前显示 ${keys.length} 列`);
    });
    backdrop.querySelector('.proto-modal').classList.add('proto-column-modal');
    const inputs = Array.from(backdrop.querySelectorAll('.proto-column-option input'));
    const updateCount = () => { backdrop.querySelector('[data-column-count]').textContent = inputs.filter(input => input.checked).length; };
    inputs.forEach(input => input.addEventListener('change', updateCount));
    backdrop.querySelectorAll('[data-column-action]').forEach(button => {
      button.onclick = () => {
        if (button.dataset.columnAction === 'default') inputs.forEach(input => { input.checked = defaultColumns.has(input.value) || lockedKeys.has(input.value); });
        else {
          const checked = button.dataset.columnAction === 'all';
          inputs.forEach(input => { input.checked = lockedKeys.has(input.value) || checked; });
        }
        updateCount();
      };
    });
  }

  function openGenericColumnManager(source) {
    const table = source?.closest('.table-panel,.records,.detail-panel,.component-panel')?.querySelector('table') || document.querySelector('.records table');
    if (!table || !table.tHead) return;
    const headers = Array.from(table.tHead.rows[0].cells).map((cell, index) => ({ index, label: getText(cell) })).filter(column => column.index > 0 && column.label);
    const active = new Set(headers.filter(column => getComputedStyle(table.tHead.rows[0].cells[column.index]).display !== 'none').map(column => String(column.index)));
    const page = document.body.dataset.page;
    const lockedIndexes = new Set(headers.filter(column => {
      if (page === 'board-query') return column.label === '板边条码' || column.label === '操作';
      if (page === 'defect-analysis') return column.label === '模板名称' || column.label === '板边条码';
      return false;
    }).map(column => column.index));
    const options = headers.map(column => `<label class="proto-column-option"><input type="checkbox" value="${column.index}" ${(active.has(String(column.index)) || lockedIndexes.has(column.index)) ? 'checked' : ''} ${lockedIndexes.has(column.index) ? 'disabled' : ''}><span title="${column.label}">${column.label}${lockedIndexes.has(column.index) ? '（必选）' : ''}</span></label>`).join('');
    const backdrop = openModal('显示列', `<div class="proto-column-toolbar"><span class="proto-column-note">已选择 <b data-column-count>${active.size}</b> / ${headers.length} 列</span><div class="proto-column-actions"><button type="button" data-column-action="all">全选</button><button type="button" data-column-action="none">取消全选</button><button type="button" data-column-action="default">恢复默认</button></div></div><section class="proto-column-group"><h4>列表字段</h4><div class="proto-column-grid">${options}</div></section>`, '应用列设置', modal => {
      const selected = new Set(Array.from(modal.querySelectorAll('.proto-column-option input:checked')).map(input => Number(input.value)));
      lockedIndexes.forEach(index => selected.add(index));
      if (!selected.size) { toast('请至少保留一个显示字段', 'error'); return false; }
      Array.from(table.rows).forEach(row => Array.from(row.cells).forEach((cell, index) => { if (index > 0) cell.style.display = selected.has(index) ? '' : 'none'; }));
      Array.from(table.querySelectorAll('colgroup col')).forEach((column, index) => { if (index > 0) column.style.display = selected.has(index) ? '' : 'none'; });
      toast(`显示列已更新，当前显示 ${selected.size} 列`);
    });
    backdrop.querySelector('.proto-modal').classList.add('proto-column-modal');
    const inputs = Array.from(backdrop.querySelectorAll('.proto-column-option input'));
    const updateCount = () => { backdrop.querySelector('[data-column-count]').textContent = inputs.filter(input => input.checked).length; };
    inputs.forEach(input => input.addEventListener('change', updateCount));
    backdrop.querySelectorAll('[data-column-action]').forEach(button => {
      button.onclick = () => {
        const checked = button.dataset.columnAction !== 'none';
        inputs.forEach(input => { input.checked = input.disabled || checked; });
        updateCount();
      };
    });
  }

  function ensureMouthContext(label) {
    const scope = document.querySelector('.scope-note');
    if (!scope) return;
    let context = scope.querySelector('.mouth-context');
    if (!context) {
      context = document.createElement('span');
      context.className = 'mouth-context';
      scope.appendChild(context);
    }
    context.textContent = `当前口径：${label}`;
  }

  function setMetric(metric, label, value, foot = '', key) {
    if (!metric) return;
    if (key) metric.dataset.mouthKpi = key;
    metric.querySelector('.metric-label').innerHTML = label;
    metric.querySelector('.metric-value').innerHTML = value;
    const footElement = metric.querySelector('.metric-foot');
    if (footElement) footElement.innerHTML = foot;
  }

  function comparisonDataset(type = currentComparisonType) {
    if (type === 'project') return comparisonProjects;
    return type === 'area' ? comparisonAreas : comparisonDevices;
  }

  function comparisonPeriodAdjustment(index) {
    if (currentComparisonPeriod === 'custom') {
      const start = new Date(`${comparisonDateRange.start}T00:00:00`);
      const end = new Date(`${comparisonDateRange.end}T00:00:00`);
      const days = Math.max(1, Math.round((end - start) / 86400000) + 1);
      const base = Math.min(.55, Math.max(.04, days * .012));
      return -base * (.72 + (index % 5) * .07);
    }
    const adjustments = {
      '7d': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      month: [-.18, -.12, -.22, -.16, -.24, -.15, -.19, -.21, -.17, -.23, -.14, -.20],
      halfYear: [-.42, -.35, -.48, -.31, -.44, -.39, -.33, -.46, -.37, -.41, -.29, -.45]
    };
    return (adjustments[currentComparisonPeriod] || adjustments['7d'])[index] || 0;
  }

  function comparisonDateRangeForPeriod(period) {
    const ranges = {
      '7d': { start: '2026-07-29', end: '2026-08-04' },
      month: { start: '2026-07-05', end: '2026-08-04' },
      halfYear: { start: '2026-02-05', end: '2026-08-04' }
    };
    return ranges[period] || comparisonDateRange;
  }

  function comparisonDateRangeMarkup() {
    return `<div class="chart-time-range comparison-date-range" data-comparison-date-range role="group" aria-label="良率对比时间范围"><input type="date" value="${comparisonDateRange.start}" data-comparison-date="start" aria-label="开始时间"><span>至</span><input type="date" value="${comparisonDateRange.end}" data-comparison-date="end" aria-label="结束时间"></div>`;
  }

  function syncComparisonControls(root = document) {
    root.querySelectorAll('select[data-chart-period-context="comparison"]').forEach(select => { select.value = currentComparisonPeriod; });
    root.querySelectorAll('[data-comparison-date]').forEach(input => {
      input.value = comparisonDateRange[input.dataset.comparisonDate];
    });
  }

  function setComparisonPeriod(period) {
    currentComparisonPeriod = period;
    comparisonDateRange = comparisonDateRangeForPeriod(period);
    syncComparisonControls(document);
  }

  function initializeComparisonDateRange(root, onChange) {
    root.querySelectorAll('[data-comparison-date]').forEach(input => {
      input.onchange = () => {
        const range = input.closest('[data-comparison-date-range]');
        const start = range?.querySelector('[data-comparison-date="start"]')?.value;
        const end = range?.querySelector('[data-comparison-date="end"]')?.value;
        if (!start || !end || start > end) {
          syncComparisonControls(document);
          return;
        }
        comparisonDateRange = { start, end };
        currentComparisonPeriod = 'custom';
        syncComparisonControls(document);
        onChange();
      };
    });
  }

  function comparisonChartMarkup(type = currentComparisonType, showAll = false) {
    const data = comparisonDataset(type)
      .map((item, index) => {
        const source = mouthData(item, currentMouth);
        return source ? { ...item, value: Math.max(88, source.yield + comparisonPeriodAdjustment(index)) } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.value - a.value);
    const items = showAll ? data : data.slice(0, 10);
    if (type === 'project') {
      const width = 560;
      const rowHeight = 32;
      const margin = { top: 14, right: 48, bottom: 26, left: 150 };
      const height = margin.top + margin.bottom + rowHeight * items.length;
      const plotWidth = width - margin.left - margin.right;
      const minimum = 88;
      const maximum = 100;
      const x = value => margin.left + (value - minimum) / (maximum - minimum) * plotWidth;
      const ticks = [88, 91, 94, 97, 100];
      const grid = ticks.map(value => `<line class="comparison-grid" x1="${x(value)}" y1="${margin.top}" x2="${x(value)}" y2="${height - margin.bottom}"/><text class="comparison-axis" x="${x(value)}" y="${height - 8}" text-anchor="middle">${value}%</text>`).join('');
      const bars = items.map((item, index) => {
        const centerY = margin.top + rowHeight * index + rowHeight / 2;
        const endX = x(item.value);
        const barWidth = Math.max(2, endX - x(minimum));
        return `<g><title>模板 ${item.name}：${item.value.toFixed(2)}%</title><text class="comparison-label project-label" x="${margin.left - 8}" y="${centerY + 3}">${item.name}</text><rect class="comparison-bar-track" x="${x(minimum)}" y="${centerY - 7}" width="${plotWidth}" height="14" rx="3"/><rect class="comparison-bar" x="${x(minimum)}" y="${centerY - 7}" width="${barWidth.toFixed(1)}" height="14" rx="3"/><text class="comparison-value" x="${Math.min(width - 20, endX + 23).toFixed(1)}" y="${centerY + 3}">${item.value.toFixed(2)}%</text></g>`;
      }).join('');
      const contentHeight = Math.max(height, showAll ? 400 : 360);
      return `<div class="comparison-chart-scroll-content" style="height:${contentHeight}px"><svg viewBox="0 0 ${width} ${height}" role="img" aria-label="模板良率${showAll ? '全部' : '排名前10名'}，按${currentMouth === 'original' ? '机器判定' : currentMouth === 'second' ? '最终复判' : '一次复判'}口径降序展示">${grid}${bars}</svg></div>`;
    }
    if ((type === 'device' || type === 'area') && document.body.dataset.page === 'device-quality') {
      const width = 560;
      const rowHeight = 32;
      const margin = { top: 14, right: 52, bottom: 26, left: 148 };
      const height = margin.top + margin.bottom + rowHeight * items.length;
      const plotWidth = width - margin.left - margin.right;
      const minimum = 88;
      const maximum = 100;
      const x = value => margin.left + (value - minimum) / (maximum - minimum) * plotWidth;
      const ticks = [88, 91, 94, 97, 100];
      const grid = ticks.map(value => `<line class="comparison-grid" x1="${x(value)}" y1="${margin.top}" x2="${x(value)}" y2="${height - margin.bottom}"/><text class="comparison-axis" x="${x(value)}" y="${height - 8}" text-anchor="middle">${value}%</text>`).join('');
      const bars = items.map((item, index) => {
        const centerY = margin.top + rowHeight * index + rowHeight / 2;
        const endX = x(item.value);
        const barWidth = Math.max(2, endX - x(minimum));
        const label = type === 'area' ? item.name : `${item.area} · ${item.name}`;
        return `<g><title>${label}：${item.value.toFixed(2)}%</title><text class="comparison-label project-label" x="${margin.left - 8}" y="${centerY + 3}">${label}</text><rect class="comparison-bar-track" x="${x(minimum)}" y="${centerY - 7}" width="${plotWidth}" height="14" rx="3"/><rect class="comparison-bar" x="${x(minimum)}" y="${centerY - 7}" width="${barWidth.toFixed(1)}" height="14" rx="3"/><text class="comparison-value device-horizontal-value" x="${width - 8}" y="${centerY + 3}">${item.value.toFixed(2)}%</text></g>`;
      }).join('');
      const contentHeight = type === 'area' ? Math.max(height, showAll ? 320 : 180) : Math.max(height, showAll ? 400 : 360);
      const dimensionLabel = type === 'area' ? '区域' : '设备';
      return `<div class="comparison-chart-scroll-content" style="height:${contentHeight}px"><svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${dimensionLabel}良率${showAll ? '全部' : '排名前10名'}，按${currentMouth === 'original' ? '机器判定' : currentMouth === 'second' ? '最终复判' : '一次复判'}口径降序展示">${grid}${bars}</svg></div>`;
    }
    const width = showAll ? 900 : 560;
    const height = showAll ? 330 : 220;
    const margin = { top: 24, right: 16, bottom: showAll ? 54 : 45, left: 38 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;
    const step = plotWidth / Math.max(items.length, 1);
    const barWidth = Math.min(showAll ? 38 : 26, step * .58);
    const minimum = 88;
    const maximum = 100;
    const y = value => margin.top + (maximum - value) / (maximum - minimum) * plotHeight;
    const ticks = [88, 94, 100];
    const grid = ticks.map(value => `<line class="comparison-grid" x1="${margin.left}" y1="${y(value)}" x2="${width - margin.right}" y2="${y(value)}"/><text class="comparison-axis" x="${margin.left - 6}" y="${y(value) + 3}" text-anchor="end">${value}%</text>`).join('');
    const bars = items.map((item, index) => {
      const center = margin.left + step * index + step / 2;
      const top = y(item.value);
      const barHeight = Math.max(2, margin.top + plotHeight - top);
      const label = item.name;
      const detail = type === 'device' ? `${item.area} · ${item.name}` : item.name;
      const labelMarkup = `<text class="comparison-label" x="${center.toFixed(1)}" y="${height - 18}">${label}</text>`;
      return `<g><title>${detail}：${item.value.toFixed(2)}%</title><rect class="comparison-bar" x="${(center - barWidth / 2).toFixed(1)}" y="${top.toFixed(1)}" width="${barWidth.toFixed(1)}" height="${barHeight.toFixed(1)}" rx="3"/><text class="comparison-value" x="${center.toFixed(1)}" y="${Math.max(12, top - 6).toFixed(1)}">${item.value.toFixed(2)}%</text>${labelMarkup}</g>`;
    }).join('');
    const dimensionLabel = type === 'area' ? '区域' : type === 'project' ? '模板' : '设备';
    return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${dimensionLabel}良率排名前10名，按${currentMouth === 'original' ? '机器判定' : currentMouth === 'second' ? '最终复判' : '一次复判'}口径降序展示">${grid}<line class="comparison-grid" x1="${margin.left}" y1="${margin.top + plotHeight}" x2="${width - margin.right}" y2="${margin.top + plotHeight}"/>${bars}</svg>`;
  }

  function renderProjectComparison(type = currentComparisonType) {
    const panel = document.querySelector('[data-comparison-panel]');
    if (!panel) return;
    currentComparisonType = type;
    panel.querySelectorAll('[data-comparison-type]').forEach(button => {
      const active = button.dataset.comparisonType === type;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', String(active));
    });
    const chart = panel.querySelector('[data-comparison-chart]');
    if (chart) {
      chart.classList.toggle('is-horizontal', type === 'project');
      chart.classList.toggle('is-device-horizontal', (type === 'device' || type === 'area') && document.body.dataset.page === 'device-quality');
      chart.innerHTML = comparisonChartMarkup(type, false);
    }
  }

  function openProjectComparisonModal() {
    const comparisonPanel = document.querySelector('[data-comparison-panel]');
    const isProjectScope = comparisonPanel?.dataset.comparisonScope === 'project';
    const dimensionSwitch = isProjectScope ? '' : '<div class="comparison-switch" role="tablist" aria-label="全部良率对比维度"><button class="comparison-tab" type="button" data-modal-comparison-type="device">设备</button><button class="comparison-tab" type="button" data-modal-comparison-type="area">区域</button></div>';
    const body = `<div class="comparison-modal-toolbar">${comparisonDateRangeMarkup()}${chartPeriodSelect('comparison', currentComparisonPeriod)}${dimensionSwitch}<span class="comparison-modal-note" data-comparison-count></span></div><div class="comparison-modal-chart" data-modal-comparison-chart></div>`;
    const backdrop = openModal('全部良率对比', body, '关闭');
    backdrop.querySelector('.proto-modal').classList.add('proto-comparison-modal');
    backdrop.querySelector('[data-close]').remove();
    let modalType = isProjectScope ? 'project' : currentComparisonType;
    const draw = () => {
      backdrop.querySelectorAll('[data-modal-comparison-type]').forEach(button => {
        const active = button.dataset.modalComparisonType === modalType;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-selected', String(active));
      });
      const data = comparisonDataset(modalType);
      const dimensionLabel = modalType === 'area' ? '区域' : modalType === 'project' ? '模板' : '设备';
      backdrop.querySelector('[data-comparison-count]').textContent = `共 ${data.length} 个${dimensionLabel} · 按良率降序`;
      const modalChart = backdrop.querySelector('[data-modal-comparison-chart]');
      modalChart.classList.toggle('is-horizontal', modalType === 'project');
      modalChart.classList.toggle('is-device-horizontal', (modalType === 'device' || modalType === 'area') && document.body.dataset.page === 'device-quality');
      modalChart.innerHTML = comparisonChartMarkup(modalType, true);
    };
    backdrop.querySelectorAll('[data-modal-comparison-type]').forEach(button => {
      button.onclick = () => { modalType = button.dataset.modalComparisonType; draw(); };
    });
    backdrop.querySelectorAll('select[data-chart-period-context="comparison"]').forEach(select => {
      select.onchange = () => {
        setComparisonPeriod(select.value);
        const projectPanel = document.querySelector('[data-comparison-panel]');
        if (projectPanel) renderProjectComparison(currentComparisonType);
        draw();
      };
    });
    initializeComparisonDateRange(backdrop, () => {
      const projectPanel = document.querySelector('[data-comparison-panel]');
      if (projectPanel) renderProjectComparison(currentComparisonType);
      draw();
    });
    syncComparisonControls(backdrop);
    draw();
  }

  function initializeProjectComparison() {
    const panel = document.querySelector('[data-comparison-panel]');
    if (!panel || panel.dataset.comparisonEnhanced) return;
    panel.dataset.comparisonEnhanced = 'true';
    if (panel.dataset.comparisonScope === 'project') currentComparisonType = 'project';
    panel.querySelectorAll('[data-comparison-type]').forEach(button => {
      button.onclick = () => renderProjectComparison(button.dataset.comparisonType);
    });
    panel.querySelectorAll('select[data-chart-period-context="comparison"]').forEach(select => {
      select.onchange = () => {
        setComparisonPeriod(select.value);
        renderProjectComparison(currentComparisonType);
      };
    });
    initializeComparisonDateRange(panel, () => renderProjectComparison(currentComparisonType));
    syncComparisonControls(panel);
    const allButton = panel.querySelector('[data-comparison-all]');
    if (allButton) allButton.onclick = openProjectComparisonModal;
    renderProjectComparison(currentComparisonType);
  }

  function projectTrendDataset(mode = currentProjectTrendMode) {
    const dataset = mode === 'month'
      ? {
        labels: ['03月', '04月', '05月', '06月', '07月', '08月'],
        original: [91.2, 91.8, 92.1, 91.7, 92.4, 92.8],
        review: [97.2, 97.6, 97.9, 97.5, 98.1, 98.4],
        second: [97.5, 97.9, 98.2, 97.8, 98.4, 98.7]
      }
      : {
      labels: ['07-29', '07-30', '07-31', '08-01', '08-02', '08-03', '08-04'],
      original: [91.4, 91.8, 91.2, 92.0, 91.6, 92.2, 92.8],
      review: [97.4, 97.8, 97.2, 98.0, 97.6, 98.2, 98.5],
      second: [97.7, 98.1, 97.5, 98.3, 97.9, 98.5, 98.8]
    };
    return dataset;
  }

  function projectTrendMarkup(mode = currentProjectTrendMode) {
    const data = projectTrendDataset(mode);
    const width = 860;
    const height = 220;
    const margin = { top: 18, right: 18, bottom: 34, left: 44 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;
    const x = index => margin.left + (plotWidth / Math.max(1, data.labels.length - 1)) * index;
    const y = value => margin.top + (100 - value) / 12 * plotHeight;
    const ticks = [88, 91, 94, 97, 100];
    const grid = ticks.map(value => `<line class="gridline" x1="${margin.left}" y1="${y(value)}" x2="${width - margin.right}" y2="${y(value)}"/><text class="axis" x="${margin.left - 8}" y="${y(value) + 3}" text-anchor="end">${value}%</text>`).join('');
    const path = values => values.map((value, index) => `${index ? 'L' : 'M'}${x(index).toFixed(1)} ${y(value).toFixed(1)}`).join(' ');
    const dots = (values, className, label) => values.map((value, index) => `<circle class="dot ${className}" cx="${x(index).toFixed(1)}" cy="${y(value).toFixed(1)}" r="3"><title>${data.labels[index]} ${label}：${value.toFixed(2)}%</title></circle>`).join('');
    const labels = data.labels.map((label, index) => `<text class="axis" x="${x(index).toFixed(1)}" y="${height - 10}" text-anchor="middle">${label}</text>`).join('');
    return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${mode === 'day' ? '按天最近7天' : '按月最近6个月'}质量趋势，包含机器判定、一次复判与最终复判">${grid}<path class="line-original" d="${path(data.original)}"/><path class="line-review" d="${path(data.review)}"/><path class="line-second" d="${path(data.second)}"/>${dots(data.original, 'trend-original-dot', '机器判定')}${dots(data.review, 'trend-review-dot', '一次复判')}${dots(data.second, 'trend-second-dot', '最终复判')}${labels}</svg>`;
  }

  function renderProjectTrend(mode = currentProjectTrendMode) {
    const panel = document.querySelector('[data-project-trend]');
    if (!panel) return;
    currentProjectTrendMode = mode;
    panel.querySelectorAll('[data-project-trend-mode]').forEach(button => {
      const active = button.dataset.projectTrendMode === mode;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', String(active));
    });
    const range = panel.querySelector('[data-project-trend-range]');
    if (range) range.classList.toggle('is-hidden', mode === 'month');
    const chart = panel.querySelector('[data-project-trend-chart]');
    if (chart) chart.innerHTML = projectTrendMarkup(mode);
  }

  function initializeProjectTrend() {
    const panel = document.querySelector('[data-project-trend]');
    if (!panel || panel.dataset.trendEnhanced) return;
    panel.dataset.trendEnhanced = 'true';
    panel.querySelectorAll('[data-project-trend-mode]').forEach(button => {
      button.onclick = () => renderProjectTrend(button.dataset.projectTrendMode);
    });
    panel.querySelectorAll('input[type="date"]').forEach(input => {
      input.onchange = () => renderProjectTrend('day');
    });
    renderProjectTrend('day');
  }

  function initializeProjectCellTooltips() {
    const table = document.querySelector('[data-project-table]');
    if (!table || table.dataset.cellTooltipEnhanced) return;
    table.dataset.cellTooltipEnhanced = 'true';

    if (!document.getElementById('proto-cell-tooltip-style')) {
      const tooltipStyle = document.createElement('style');
      tooltipStyle.id = 'proto-cell-tooltip-style';
      tooltipStyle.textContent = '.proto-cell-tooltip{position:fixed;z-index:1250;width:max-content;max-width:min(520px,calc(100vw - 24px));max-height:min(240px,calc(100vh - 24px));overflow:auto;padding:9px 12px;border:1px solid #263a55;border-radius:5px;background:#17233a;color:#fff;box-shadow:0 8px 24px rgba(15,23,42,.24);font-size:12px;line-height:1.6;overflow-wrap:anywhere;white-space:normal;pointer-events:none}';
      document.head.appendChild(tooltipStyle);
    }

    let tooltip = null;
    let activeCell = null;
    const close = () => {
      if (activeCell) activeCell.removeAttribute('aria-describedby');
      if (tooltip) tooltip.remove();
      tooltip = null;
      activeCell = null;
    };
    const isTruncated = cell => cell.scrollWidth > cell.clientWidth + 1;
    const refreshTargets = () => {
      table.querySelectorAll('tbody td').forEach(cell => {
        if (isTruncated(cell)) cell.tabIndex = 0;
        else cell.removeAttribute('tabindex');
      });
    };
    const show = cell => {
      if (!cell || !isTruncated(cell)) { close(); return; }
      const text = getText(cell);
      if (!text) { close(); return; }
      close();
      tooltip = document.createElement('div');
      tooltip.className = 'proto-cell-tooltip';
      tooltip.id = 'proto-cell-tooltip';
      tooltip.setAttribute('role', 'tooltip');
      tooltip.textContent = text;
      document.body.appendChild(tooltip);
      activeCell = cell;
      cell.setAttribute('aria-describedby', tooltip.id);
      const rect = cell.getBoundingClientRect();
      const gap = 8;
      const left = Math.min(Math.max(gap, rect.left), window.innerWidth - tooltip.offsetWidth - gap);
      const below = rect.bottom + gap;
      const top = below + tooltip.offsetHeight <= window.innerHeight - gap ? below : Math.max(gap, rect.top - tooltip.offsetHeight - gap);
      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
    };

    table.addEventListener('mouseover', event => {
      const cell = event.target.closest('tbody td');
      if (cell && table.contains(cell)) show(cell);
    });
    table.addEventListener('mouseout', event => {
      const cell = event.target.closest('tbody td');
      if (cell && !cell.contains(event.relatedTarget)) close();
    });
    table.addEventListener('focusin', event => show(event.target.closest('tbody td')));
    table.addEventListener('focusout', close);
    table.addEventListener('scroll', close, true);
    window.addEventListener('resize', () => { close(); refreshTargets(); });
    new MutationObserver(() => requestAnimationFrame(refreshTargets)).observe(table, { childList: true, subtree: true });
    requestAnimationFrame(refreshTargets);
  }

  function summarizeProjectMetrics(projects, mouth) {
    const summary = projects.reduce((result, project) => {
      const source = mouthData(project, mouth);
      if (!source) return result;
      const boardTotal = project.boardTotal;
      const componentTotal = project.componentTotal;
      result.boardTotal += boardTotal;
      result.boardGood += boardTotal * source.yield / 100;
      result.boardFalse += boardTotal * source.falseRate / 100;
      result.boardPass += boardTotal * source.passRate / 100;
      result.componentTotal += componentTotal;
      result.componentNg += componentTotal * source.componentNgRate / 100;
      result.componentFalse += componentTotal * source.componentFalseDppm / 1000000;
      result.componentPass += componentTotal * source.componentPassRate / 100;
      return result;
    }, { boardTotal: 0, boardGood: 0, boardFalse: 0, boardPass: 0, componentTotal: 0, componentNg: 0, componentFalse: 0, componentPass: 0 });
    const boardNg = Math.max(0, summary.boardTotal - summary.boardGood);
    return {
      ...summary,
      boardYield: summary.boardTotal ? summary.boardGood / summary.boardTotal * 100 : 0,
      boardDppm: summary.boardTotal ? boardNg / summary.boardTotal * 1000000 : 0,
      boardNgRate: summary.boardTotal ? boardNg / summary.boardTotal * 100 : 0,
      boardFalseRate: summary.boardTotal ? summary.boardFalse / summary.boardTotal * 100 : 0,
      boardPassRate: summary.boardTotal ? summary.boardPass / summary.boardTotal * 100 : 0,
      boardDetectionNgRate: summary.boardTotal ? (summary.boardTotal - summary.boardPass) / summary.boardTotal * 100 : 0,
      componentOkRate: summary.componentTotal ? (summary.componentTotal - summary.componentNg) / summary.componentTotal * 100 : 0,
      componentDppm: summary.componentTotal ? summary.componentNg / summary.componentTotal * 1000000 : 0,
      componentNgRate: summary.componentTotal ? summary.componentNg / summary.componentTotal * 100 : 0,
      componentFalseDppm: summary.componentTotal ? summary.componentFalse / summary.componentTotal * 1000000 : 0,
      componentFalseRate: summary.componentTotal ? summary.componentFalse / summary.componentTotal * 100 : 0,
      componentPassRate: summary.componentTotal ? summary.componentPass / summary.componentTotal * 100 : 0,
      componentDetectionNgRate: summary.componentTotal ? (summary.componentTotal - summary.componentPass) / summary.componentTotal * 100 : 0
    };
  }

  function renderProjectSummary(mouth = currentMouth) {
    const table = document.querySelector('[data-project-table]');
    if (!table) return;
    currentMouth = mouth;
    const selectedDevice = new URLSearchParams(location.search).get('device') || '';
    const sourceProjects = selectedDevice ? projectSamples.filter(project => project.devices.includes(selectedDevice)) : projectSamples;
    const prototypeDeviceSn = { 'AOI-01': 'SI1020E1112', 'AOI-02': 'SI1020E1186', 'AOI-03': 'SI1020E1148', 'AOI-04': 'SI1020E1206', 'AOI-05': 'SI1020E1238', 'AOI-06': 'SI1020E1262', 'AOI-07': 'SI1020E1284', 'AOI-08': 'SI1020E1308', 'AOI-09': 'SI1020E1326', 'AOI-10': 'SI1020E1342', 'AOI-11': 'SI1020E1365', 'AOI-12': 'SI1020E1388' };
    const deviceSn = name => deviceSamples.find(device => device.name === name)?.sn || prototypeDeviceSn[name] || name;
    const statisticalProjects = sourceProjects.filter(project => mouthData(project, mouth));
    const rows = statisticalProjects.map((project, index) => ({ index: index + 1, projectName: project.name, projectUuid: project.uuid, deviceCount: `${selectedDevice ? 1 : project.devices.length} 台`, deviceNames: selectedDevice ? deviceSn(selectedDevice) : project.devices.map(deviceSn).join('、'), ...statsFor(project, mouth) }));
    table.innerHTML = tableMarkup(projectColumns, rows, 'data-project-table');
    delete table.dataset.selectExportEnhanced;
    const exportButton = table.closest('.table-panel')?.querySelector('.table-tools .btn');
    if (exportButton) enhanceSelectableTable(table, exportButton);
    applyProjectColumns(activeProjectColumns);
    const boardMetrics = document.querySelectorAll('[data-metric-group="board"] .metric');
    const componentMetrics = document.querySelectorAll('[data-metric-group="component"] .metric');
    const summary = summarizeProjectMetrics(statisticalProjects, mouth);
    const isMachineMouth = mouth === 'original';
    setMetric(boardMetrics[0], 'PCB 检测数', `${number(summary.boardTotal)}<small>块</small>`);
    setMetric(boardMetrics[1], isMachineMouth ? '板卡直通率 ⓘ' : '板卡误报率 ⓘ', `${(isMachineMouth ? summary.boardPassRate : summary.boardFalseRate).toFixed(2)}<small>%</small>`);
    setMetric(boardMetrics[2], '板卡 NG 率 ⓘ', `${summary.boardDetectionNgRate.toFixed(2)}<small>%</small>`);
    setMetric(boardMetrics[3], '板卡不良率 ⓘ', `${summary.boardNgRate.toFixed(2)}<small>%</small>`);
    setMetric(componentMetrics[0], '器件检测数', `${number(summary.componentTotal)}<small>个</small>`);
    setMetric(componentMetrics[1], isMachineMouth ? '器件直通率 ⓘ' : '器件误报率 ⓘ', `${(isMachineMouth ? summary.componentPassRate : summary.componentFalseRate).toFixed(2)}<small>%</small>`);
    setMetric(componentMetrics[2], '器件 NG 率 ⓘ', `${summary.componentDetectionNgRate.toFixed(2)}<small>%</small>`);
    setMetric(componentMetrics[3], '器件不良率 ⓘ', `${summary.componentNgRate.toFixed(2)}<small>%</small>`);
    const panelSub = document.querySelector('.table-panel .panel-sub');
    if (panelSub) panelSub.textContent = `共 ${statisticalProjects.length} 个项目`;
    if (selectedDevice) {
      const deviceControl = document.querySelector('.field.device .control');
      const target = valueSpan(deviceControl);
      if (target) target.textContent = selectedDevice;
    }
    const legend = document.querySelector('[data-project-trend] .legend');
    if (legend) legend.innerHTML = [['original', '机器判定', '#8ba3c7'], ['review', '一次复判', '#9bb0ce'], ['second', '最终复判', '#36a878']].map(([key, label, color]) => `<span><i style="background:${key === mouth ? '#3478f6' : color}"></i>${label}</span>`).join('');
    document.querySelectorAll('.line-original').forEach(line => { line.style.stroke = mouth === 'original' ? '#3478f6' : '#8ba3c7'; line.style.strokeWidth = mouth === 'original' ? '2.5' : '2'; });
    document.querySelectorAll('.line-review').forEach(line => { line.style.stroke = mouth === 'review' ? '#3478f6' : '#9bb0ce'; line.style.strokeWidth = mouth === 'review' ? '2.5' : '2'; });
    document.querySelectorAll('.line-second').forEach(line => { line.style.stroke = mouth === 'second' ? '#3478f6' : '#36a878'; line.style.strokeWidth = mouth === 'second' ? '2.5' : '2'; });
    renderProjectComparison(currentComparisonType);
  }

  function metricBlock(label, value, foot, key = '') {
    return `<div class="quality-metric" data-custom-metric="${key || 'metric'}"><div class="metric-label">${label}</div><div class="metric-value">${value}</div></div>`;
  }

  function deviceOverviewRows(mouth) {
    return deviceSamples.map(device => {
      const stats = statsFor(device, mouth);
      return stats ? { deviceName: device.name, ip: device.ip, deviceSn: device.sn, projectCount: device.projects.length, projectNames: device.projects.map(project => project.name), projectUuids: device.projects.map(project => project.uuid), lastDataTime: device.lastDataTime, ...stats } : null;
    }).filter(Boolean).map((device, index) => ({ index: index + 1, ...device }));
  }

  function deviceQualityFilters() {
    return `<section class="filters quality-filter"><div class="field time"><label>时间范围</label><div class="control"><span>▣</span><span>2026-08-01 00:00</span><span class="muted">至</span><span>2026-08-04 14:32</span></div></div><div class="field device device-search"><label>设备名称/SN</label><div class="control"><span aria-hidden="true">⌕</span><input class="proto-search" aria-label="设备名称/SN" placeholder="请输入设备名称或SN"></div></div><div class="filter-actions"><button class="btn">重置</button><button class="btn primary">查询</button></div></section>`;
  }

  function chartPeriodSelect(context, selected) {
    const options = [['7d', '最近7天'], ['month', '最近1个月'], ['halfYear', '最近半年']];
    return `<select class="chart-period-select" data-chart-period-context="${context}" aria-label="快捷时间">${options.map(([value, label]) => `<option value="${value}"${value === selected ? ' selected' : ''}>${label}</option>`).join('')}<option value="custom"${selected === 'custom' ? ' selected' : ''} disabled>自定义</option></select>`;
  }

  function deviceQualityMouthToolbar() {
    return `<section class="quality-mouth-toolbar"><span class="quality-mouth-label">统计口径</span><div class="segmented"><div class="seg ${currentMouth === 'original' ? 'active' : ''}" data-mouth="original">机器判定</div><div class="seg ${currentMouth === 'review' ? 'active' : ''}" data-mouth="review">一次复判</div><div class="seg ${currentMouth === 'second' ? 'active' : ''}" data-mouth="second">最终复判</div></div><button type="button" class="quality-page-edit-button" data-quality-page-edit>编辑页面</button></section>`;
  }

  function deviceTrendDataset(mode = currentTrendPeriod) {
    const labels = mode === 'month'
      ? ['03月', '04月', '05月', '06月', '07月', '08月']
      : ['07-26', '07-27', '07-28', '07-29', '07-30', '07-31', '08-01', '08-02', '08-03', '08-04'];
    const colors = ['#3478f6', '#36a878', '#d99014', '#8b6fd6', '#e15b64', '#28a6b8', '#6e86a6', '#c76bba', '#61a84b', '#e08342'];
    const waves = mode === 'month' ? [-.38, -.24, -.31, -.18, -.12, 0] : [-.28, -.12, -.22, -.08, -.18, .02, -.14, .06, -.09, 0];
    const series = selectedChartDevices.map((name, seriesIndex) => {
      const device = comparisonDevices.find(item => item.name === name);
      const source = device && mouthData(device, currentMouth);
      const base = source?.yield ?? 98;
      return { label: name, color: colors[seriesIndex % colors.length], values: labels.map((_, index) => Math.min(99.95, Math.max(88, base + waves[index % waves.length] + ((seriesIndex % 3) - 1) * .03))) };
    });
    const dataset = { labels, series };
    if (mode === 'day') {
      const panel = document.querySelector('[data-device-trend]');
      const inputs = panel?.querySelectorAll('[data-device-trend-range] input');
      const start = inputs?.[0]?.value || '2026-07-26';
      const end = inputs?.[1]?.value || '2026-08-04';
      const first = new Date(`${start}T00:00:00`);
      const last = new Date(`${end}T00:00:00`);
      if (first <= last) {
        const labels = [];
        for (let date = new Date(first); date <= last && labels.length < 366; date.setDate(date.getDate() + 1)) labels.push(`${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`);
        if (labels.length) {
          dataset.labels = labels;
          dataset.series.forEach((item, seriesIndex) => { item.values = labels.map((_, index) => item.values[index % item.values.length]); });
        }
      }
    }
    return dataset;
  }

  function deviceYieldTrendChart(mode = currentTrendPeriod) {
    const dataset = deviceTrendDataset(mode);
    const dates = dataset.labels;
    const devices = selectedChartDevices.map(name => deviceSamples.find(device => device.name === name)).filter(Boolean);
    const width = 680, height = 210, left = 78, right = 12, top = 10, bottom = 28;
    const rowHeight = (height - top - bottom) / Math.max(1, devices.length);
    const columnWidth = (width - left - right) / Math.max(1, dates.length);
    const loads = devices.flatMap((device, deviceIndex) => dates.map((_, dateIndex) => Math.max(80, Math.round(device.boardTotal / dates.length * (.82 + ((dateIndex * 3 + deviceIndex * 2) % 7) * .055)))));
    const maximum = Math.max(...loads, 1);
    let cursor = 0;
    const cells = devices.map((device, deviceIndex) => {
      const y = top + deviceIndex * rowHeight;
      const label = `<text class="device-chart-axis" x="${left - 8}" y="${y + rowHeight / 2 + 3}" text-anchor="end">${device.name}</text>`;
      const row = dates.map((date, dateIndex) => {
        const value = loads[cursor++];
        const opacity = (.18 + value / maximum * .75).toFixed(2);
        return `<rect x="${left + dateIndex * columnWidth + 1}" y="${y + 2}" width="${Math.max(2, columnWidth - 3)}" height="${Math.max(8, rowHeight - 4)}" rx="2" fill="#3478f6" fill-opacity="${opacity}"><title>${device.name} · ${date}：检测 ${value.toLocaleString()} 块 PCB</title></rect>`;
      }).join('');
      return label + row;
    }).join('');
    const labelStep = Math.max(1, Math.ceil(dates.length / 7));
    const dateLabels = dates.map((date, index) => index % labelStep === 0 || index === dates.length - 1 ? `<text class="device-chart-axis" x="${left + index * columnWidth + columnWidth / 2}" y="${height - 8}" text-anchor="middle">${date}</text>` : '').join('');
    return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="所选设备按${mode === 'month' ? '月' : '天'}的PCB检测负载分布">${cells}${dateLabels}</svg>`;
  }

  function renderDeviceTrend(mode = currentTrendPeriod, root = document) {
    currentTrendPeriod = mode;
    const panel = root.querySelector('[data-device-trend]') || document.querySelector('[data-device-trend]');
    if (!panel) return;
    panel.querySelectorAll('[data-device-trend-mode]').forEach(button => {
      const active = button.dataset.deviceTrendMode === mode;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    panel.querySelector('[data-device-trend-range]')?.classList.toggle('is-hidden', mode === 'month');
    const chart = panel.querySelector('.device-yield-trend');
    if (chart) chart.innerHTML = deviceYieldTrendChart(mode);
  }

  function initializeDeviceTrendControls(root = document) {
    const panel = root.querySelector('[data-device-trend]');
    if (!panel) return;
    panel.querySelectorAll('[data-device-trend-mode]').forEach(button => {
      button.onclick = () => renderDeviceTrend(button.dataset.deviceTrendMode, root);
    });
    panel.querySelectorAll('[data-device-trend-range] input').forEach(input => {
      input.onchange = () => renderDeviceTrend('day', root);
    });
    renderDeviceTrend(currentTrendPeriod, root);
  }

  function openChartDeviceConfig() {
    const rows = comparisonDevices.map((device, index) => {
      const sample = deviceSamples.find(item => item.name === device.name);
      const sn = sample?.sn || `SI1020E${String(1238 + index * 22).padStart(4, '0')}`;
      return `<label class="proto-chart-device-row" data-chart-device-row><input type="checkbox" value="${device.name}"${selectedChartDevices.includes(device.name) ? ' checked' : ''}><b>${device.name}</b><span>${sn}</span><span class="proto-chart-device-area">${device.area}</span></label>`;
    }).join('');
    const body = `<div class="proto-chart-device-tools"><input class="proto-chart-device-search" data-chart-device-search placeholder="搜索设备名称或SN"><span class="proto-chart-device-note" data-chart-device-note>已选 ${selectedChartDevices.length}/10 台</span></div><div class="proto-chart-device-list">${rows}<div class="proto-chart-device-empty" hidden>未找到匹配设备</div></div>`;
    const backdrop = openModal('配置图表展示设备', body, '保存配置', modal => {
      const checked = Array.from(modal.querySelectorAll('[data-chart-device-row] input:checked')).map(input => input.value);
      if (!checked.length) { toast('请至少选择 1 台设备', 'error'); return false; }
      if (checked.length > 10) { toast('图表最多展示 10 台设备', 'error'); return false; }
      selectedChartDevices = checked;
      renderDeviceOverview();
      normalizeChartScaling(document.querySelector('.quality-content') || document);
      toast(`图表已更新为 ${checked.length} 台设备`, 'info');
    });
    backdrop.querySelector('.proto-modal').classList.add('proto-chart-device-modal');
    const note = backdrop.querySelector('[data-chart-device-note]');
    const checkboxes = Array.from(backdrop.querySelectorAll('[data-chart-device-row] input'));
    const update = changed => {
      const count = checkboxes.filter(input => input.checked).length;
      if (count > 10 && changed) changed.checked = false;
      const finalCount = checkboxes.filter(input => input.checked).length;
      note.textContent = `已选 ${finalCount}/10 台`;
      if (count > 10) toast('图表最多展示 10 台设备', 'error');
    };
    checkboxes.forEach(input => input.onchange = () => update(input));
    backdrop.querySelector('[data-chart-device-search]').oninput = event => {
      const keyword = normalize(event.target.value);
      let visible = 0;
      backdrop.querySelectorAll('[data-chart-device-row]').forEach(row => {
        const match = !keyword || normalize(row.textContent).includes(keyword);
        row.hidden = !match;
        if (match) visible += 1;
      });
      backdrop.querySelector('.proto-chart-device-empty').hidden = visible > 0;
    };
  }

  function deviceQualityCharts() {
    return `<section class="quality-grid device-quality-charts">
      <section class="quality-chart" data-device-trend data-custom-chart data-chart-kind="heatmap"><div class="phead"><div class="phead-title"><b>设备检测负载分布</b></div><div class="chart-head-actions"><div class="device-trend-date-range" data-device-trend-range><input type="date" value="2026-07-26" aria-label="开始时间"><span>至</span><input type="date" value="2026-08-04" aria-label="结束时间"></div><div class="comparison-switch" role="tablist" aria-label="检测负载统计周期"><button class="comparison-tab" type="button" data-device-trend-mode="day">按天</button><button class="comparison-tab" type="button" data-device-trend-mode="month">按月</button></div><button type="button" class="chart-device-config" data-chart-device-config>配置设备</button></div></div><div class="quality-chart-body device-yield-trend">${deviceYieldTrendChart()}</div></section>
      <section class="quality-chart" data-comparison-panel data-custom-chart data-chart-kind="horizontalBar"><div class="phead"><div class="phead-title"><b>良率对比</b></div><div class="chart-head-actions">${comparisonDateRangeMarkup()}${chartPeriodSelect('comparison', currentComparisonPeriod)}<div class="comparison-switch" role="tablist" aria-label="良率对比维度"><button type="button" class="comparison-tab" data-comparison-type="device">设备</button><button type="button" class="comparison-tab" data-comparison-type="area">区域</button></div><button type="button" class="link" data-comparison-all>查看全部</button></div></div><div class="quality-chart-body" data-comparison-chart></div></section>
    </section>`;
  }

  function initializeDeviceSelection(root = document) {
    const table = root.querySelector('[data-device-table]');
    if (!table) return;
    const selectAll = table.querySelector('.device-select-all');
    const checks = Array.from(table.querySelectorAll('.device-row-check'));
    const exportButton = table.closest('.table-panel')?.querySelector('.device-export');
    if (!selectAll || !exportButton) return;
    const update = () => {
      const selected = checks.filter(check => check.checked).length;
      selectAll.checked = selected > 0 && selected === checks.length;
      selectAll.indeterminate = selected > 0 && selected < checks.length;
      exportButton.disabled = selected === 0;
      exportButton.textContent = selected ? `导出所选（${selected}）` : '导出所选';
    };
    selectAll.addEventListener('change', () => { checks.forEach(check => { check.checked = selectAll.checked; }); update(); });
    checks.forEach(check => check.addEventListener('change', update));
    update();
  }

  function initializeDeviceTableSorting(root = document) {
    const table = root.querySelector('[data-device-table]');
    if (!table || table.dataset.sortEnhanced) return;
    table.dataset.sortEnhanced = 'true';
    const tbody = table.tBodies[0];
    if (!tbody) return;
    const rows = Array.from(tbody.rows);
    rows.forEach((row, index) => { row.dataset.originalOrder = String(index); });
    const numericValue = cell => {
      const text = (cell?.textContent || '').trim();
      if (!text || text === '—') return Number.NEGATIVE_INFINITY;
      const value = Number(text.replace(/,/g, '').replace(/%/g, ''));
      return Number.isFinite(value) ? value : Number.NEGATIVE_INFINITY;
    };
    table.querySelectorAll('[data-device-sort]').forEach(button => {
      button.addEventListener('click', () => {
        const key = button.dataset.deviceSort;
        const header = button.closest('th');
        const nextDirection = header.getAttribute('aria-sort') === 'descending' ? 'ascending' : 'descending';
        table.querySelectorAll('th[aria-sort]').forEach(th => {
          th.setAttribute('aria-sort', 'none');
          const sortButton = th.querySelector('[data-device-sort]');
          if (!sortButton) return;
          sortButton.querySelector('i').textContent = '↕';
          sortButton.title = `按${sortButton.querySelector('span').textContent}从高到低排序`;
          sortButton.setAttribute('aria-label', `${sortButton.querySelector('span').textContent}，点击按从高到低排序`);
        });
        header.setAttribute('aria-sort', nextDirection);
        button.querySelector('i').textContent = nextDirection === 'descending' ? '↓' : '↑';
        const nextAction = nextDirection === 'descending' ? '从低到高' : '从高到低';
        button.title = `按${button.querySelector('span').textContent}${nextAction}排序`;
        button.setAttribute('aria-label', `${button.querySelector('span').textContent}，点击按${nextAction}排序`);
        const direction = nextDirection === 'descending' ? -1 : 1;
        rows.sort((left, right) => {
          const difference = numericValue(left.querySelector(`[data-column-key="${key}"]`)) - numericValue(right.querySelector(`[data-column-key="${key}"]`));
          return difference ? difference * direction : Number(left.dataset.originalOrder) - Number(right.dataset.originalOrder);
        }).forEach((row, index) => {
          const indexCell = row.querySelector('[data-column-key="index"]');
          if (indexCell) indexCell.textContent = String(index + 1);
          tbody.appendChild(row);
        });
      });
    });
  }

  let qualityEditorSelectedChart = null;
  let qualityEditorSelectedMetric = null;

  const metricCardConfigs = {
    participatingDevices: { description: '参与统计设备', table: '设备管理底表', source: '设备数据管理', range: '存在历史检测数据的全部设备', aggregation: '设备ID去重计数', precision: '整数', format: '数字（千分位）' },
    templateCount: { description: '检测模板数', table: 'PCB检测记录', source: '检测数据管理', range: '跟随页面筛选', aggregation: '模板ID去重计数', precision: '整数', format: '数字（千分位）' },
    pcbTotal: { description: '检测 PCB 总数', table: 'PCB检测记录', source: '检测数据管理', range: '跟随页面筛选', aggregation: '检测记录总数', precision: '整数', format: '数字（千分位）' },
    boardNgRate: { description: '板卡不良率', table: 'PCB检测记录', source: '检测数据管理', range: '跟随页面筛选', aggregation: '不良PCB数 / 检测PCB数', precision: '2位小数', format: '百分比' },
    componentDppm: { description: '器件 DPPM', table: '器件检测明细', source: '检测数据管理', range: '跟随页面筛选', aggregation: '器件不良数 / 器件检测数 × 1,000,000', precision: '整数', format: '数字（千分位）' }
  };

  function metricCardConfigMarkup(config) {
    return `<div class="quality-metric-tabs" role="tablist"><button type="button" class="quality-metric-tab is-active" data-metric-tab="base">基础配置</button><button type="button" class="quality-metric-tab" data-metric-tab="custom">自定义配置</button></div>
      <div class="quality-metric-panel" data-metric-panel="base"><div class="quality-config-grid"><div class="quality-config-field full"><label>标题</label><input data-metric-description value="${config.description}"></div><div class="quality-config-field full"><label>数据源</label><div class="quality-source-picker"><button type="button" class="quality-source-trigger" data-source-trigger>${config.source}</button><div class="quality-source-menu" data-source-menu hidden><label class="quality-source-option"><input type="checkbox" value="检测数据管理" ${config.source === '检测数据管理' ? 'checked' : ''}>检测数据管理</label><label class="quality-source-option"><input type="checkbox" value="设备数据管理" ${config.source === '设备数据管理' ? 'checked' : ''}>设备数据管理</label><label class="quality-source-option"><input type="checkbox" value="检测模板管理" ${config.source === '检测模板管理' ? 'checked' : ''}>检测模板管理</label></div></div></div><div class="quality-config-field full"><label>数据范围</label><div class="quality-config-field"><div class="quality-config-field"><div class="quality-filter-control" style="height:38px;padding:0 10px;border:1px solid #cfd8e4;border-radius:4px"><span>${config.range}</span><span class="quality-filter-link">筛选</span></div></div></div></div><div class="quality-config-field full"><label>统计方式</label><select><option>${config.aggregation}</option></select></div><label class="quality-trend-toggle"><input type="checkbox" data-metric-trend checked>趋势图</label><div class="quality-trend-fields" data-metric-trend-fields><div class="quality-config-field full"><label>时间依据</label><select><option>检测时间</option><option>最后接收数据时间</option><option>创建时间</option></select></div><div class="quality-config-field full"><label>时间范围</label><select data-metric-time-range><option>本周</option><option>本月</option><option>本季度</option><option>本周至今</option><option selected>本月至今</option><option>本季度至今</option><option>上周</option><option>上月</option><option>上季度</option><option>最近7天</option><option>最近14天</option><option>最近30天</option><option>最近3个月</option><option>最近半年</option><option value="custom">自定义范围</option></select></div><div class="quality-custom-time-range" data-custom-time-range hidden><div class="quality-config-field"><label>开始时间</label><input type="datetime-local" value="2026-08-01T00:00"></div><div class="quality-config-field"><label>结束时间</label><input type="datetime-local" value="2026-08-04T14:32"></div></div></div></div></div>
      <div class="quality-metric-panel" data-metric-panel="custom" hidden><div class="quality-config-grid"><div class="quality-config-field full"><label>背景颜色</label><select><option>默认</option><option>浅蓝</option><option>白色</option></select></div><div class="quality-config-field full"><label>文字颜色</label><select><option>默认</option><option>深色</option><option>蓝色</option></select></div><div class="quality-config-field full"><label>字体字号</label><div class="quality-segment-control" data-font-mode><button type="button" class="is-active" data-font-mode-value="adaptive">自适应</button><button type="button" data-font-mode-value="custom">自定义</button></div></div><div class="quality-color-row quality-font-custom-fields" style="grid-column:1/-1" hidden><div class="quality-config-field"><label>数据说明字号</label><select><option>12</option><option>14</option><option>16</option></select></div><div class="quality-config-field"><label>数字字号</label><select><option>22</option><option>24</option><option>28</option><option>36</option></select></div></div><div class="quality-config-field full"><label>小数精度</label><select><option>${config.precision}</option><option>1位小数</option><option>2位小数</option></select></div><div class="quality-config-field full"><label>数字格式</label><select><option>${config.format}</option><option>普通数字</option><option>百分比</option></select></div><div class="quality-config-field full"><label>宽度</label><div class="quality-segment-control"><button type="button" class="is-active">默认宽度</button><button type="button">填充容器</button></div></div><div class="quality-config-field full"><label>高度</label><div class="quality-segment-control"><button type="button" class="is-active">默认高度</button><button type="button">填充容器</button></div></div></div></div>`;
  }

  function selectQualityEditorMetric(metric) {
    if (!metric) return;
    document.querySelectorAll('[data-custom-chart]').forEach(item => item.classList.remove('is-editor-selected'));
    document.querySelectorAll('[data-custom-metric]').forEach(item => item.classList.toggle('is-editor-selected', item === metric));
    qualityEditorSelectedChart = null;
    qualityEditorSelectedMetric = metric;
    const drawer = document.querySelector('[data-quality-config-drawer]');
    if (!drawer) return;
    drawer.dataset.mode = 'metric';
    drawer.querySelector('.quality-config-drawer-head h3').textContent = '指标卡';
    const config = metricCardConfigs[metric.dataset.customMetric] || metricCardConfigs.pcbTotal;
    drawer.querySelector('.quality-config-drawer-body').innerHTML = metricCardConfigMarkup(config);
    const restoreButton = drawer.querySelector('[data-quality-restore]');
    const previewButton = drawer.querySelector('[data-quality-preview]');
    if (restoreButton) restoreButton.hidden = true;
    if (previewButton) previewButton.hidden = true;
    const save = drawer.querySelector('[data-quality-chart-save]');
    save.textContent = '保存';
    save.onclick = () => {
      const description = drawer.querySelector('[data-metric-description]').value.trim();
      if (description) metric.querySelector('.metric-label').textContent = description;
      toast('指标卡配置已保存');
    };
    drawer.querySelectorAll('[data-metric-tab]').forEach(tab => tab.onclick = () => {
      drawer.querySelectorAll('[data-metric-tab]').forEach(item => item.classList.toggle('is-active', item === tab));
      drawer.querySelectorAll('[data-metric-panel]').forEach(panel => { panel.hidden = panel.dataset.metricPanel !== tab.dataset.metricTab; });
    });
    drawer.querySelectorAll('.quality-segment-control button').forEach(button => button.onclick = () => {
      button.parentElement.querySelectorAll('button').forEach(item => item.classList.toggle('is-active', item === button));
      if (button.dataset.fontModeValue) {
        const customFields = drawer.querySelector('.quality-font-custom-fields');
        if (customFields) customFields.hidden = button.dataset.fontModeValue !== 'custom';
      }
    });
    const trendToggle = drawer.querySelector('[data-metric-trend]');
    if (trendToggle) trendToggle.onchange = () => {
      const fields = drawer.querySelector('[data-metric-trend-fields]');
      if (fields) fields.hidden = !trendToggle.checked;
    };
    const timeRange = drawer.querySelector('[data-metric-time-range]');
    if (timeRange) timeRange.onchange = () => {
      const customRange = drawer.querySelector('[data-custom-time-range]');
      if (customRange) customRange.hidden = timeRange.value !== 'custom';
    };
    const sourceTrigger = drawer.querySelector('[data-source-trigger]');
    const sourceMenu = drawer.querySelector('[data-source-menu]');
    if (sourceTrigger && sourceMenu) {
      sourceTrigger.onclick = event => {
        event.stopPropagation();
        sourceMenu.hidden = !sourceMenu.hidden;
      };
      sourceMenu.onclick = event => event.stopPropagation();
      sourceMenu.querySelectorAll('input[type="checkbox"]').forEach(checkbox => checkbox.onchange = () => {
        const selected = Array.from(sourceMenu.querySelectorAll('input:checked')).map(input => input.value);
        if (!selected.length) {
          checkbox.checked = true;
          return;
        }
        sourceTrigger.textContent = selected.length === 1 ? selected[0] : `已选择 ${selected.length} 个数据源`;
      });
      drawer.onclick = event => {
        if (!event.target.closest('.quality-source-picker')) sourceMenu.hidden = true;
      };
    }
  }

  function qualityEditorDrawerMarkup() {
    return `<aside class="quality-config-drawer" data-quality-config-drawer><header class="quality-config-drawer-head"><h3>柱状图</h3><button class="quality-config-drawer-close" type="button" data-quality-editor-exit aria-label="关闭">×</button></header><div class="quality-config-drawer-body"><div class="quality-metric-tabs" role="tablist"><button type="button" class="quality-metric-tab is-active" data-chart-tab="base">基础配置</button><button type="button" class="quality-metric-tab" data-chart-tab="custom">自定义配置</button></div>
      <div class="quality-metric-panel" data-chart-panel="base"><section class="quality-config-section"><div class="quality-config-grid"><div class="quality-config-field full" data-quality-title-field><label>标题</label><input data-quality-config="name" value="设备检测负载分布"></div><div class="quality-config-field full"><label>图表类型</label><select data-quality-config="type"><option value="bar">柱状图</option><option value="horizontalBar">条形图</option><option value="line">折线图</option><option value="area">面积图</option><option value="pie">饼图</option><option value="donut">环形图</option><option value="combo">组合图</option><option value="radar">雷达图</option><option value="scatter">散点图</option><option value="funnel">漏斗图</option><option value="wordCloud">词云</option><option value="heatmap">热力图</option><option value="table">表格</option><option value="kanban">看板</option><option value="calendar">日历</option><option value="gantt">甘特图</option><option value="gallery">画册</option><option value="pivot">透视表</option><option value="text">文本</option><option value="button">按钮</option><option value="ranking">排行榜</option><option value="progress">进度图</option><option value="countdown">倒计时</option><option value="slicer">切片器</option><option value="layout">组合布局</option></select></div></div></section>
      <section class="quality-config-section"><h4 data-quality-dimension-heading>横轴（类别）</h4><div class="quality-config-grid"><div class="quality-config-field full"><select data-quality-config="dimension"><option>设备</option><option>第二级位置</option><option>模板ID</option><option>检测日期</option><option>班次</option><option>判定结果</option></select></div><div class="quality-exclusive-checks"><label class="quality-config-check"><input type="checkbox" data-quality-multi-split>多选项拆分统计</label><label class="quality-config-check"><input type="checkbox" data-quality-summary-category checked>汇总相同的类别</label></div><div class="quality-chart-option-box" data-quality-axis-sort><div class="quality-config-field full"><label>排序依据</label><div class="quality-segment-control quality-segment-three"><button type="button" class="is-active">横轴值</button><button type="button">纵轴值</button><button type="button">记录顺序</button></div></div><div class="quality-config-field full"><label>排序规则</label><div class="quality-segment-control"><button type="button">正序</button><button type="button" class="is-active">倒序</button></div></div></div></div></section>
      <section class="quality-config-section"><h4 data-quality-measure-heading>纵轴（字段）</h4><div class="quality-config-grid"><div class="quality-config-field full"><select data-quality-config="measure"><option>检测PCB数</option><option>PCB良率</option><option>PCB不良率</option><option>器件DPPM</option><option>平均检测耗时</option><option>误报率</option></select></div><label class="quality-config-check full" data-quality-group-toggle><input type="checkbox" data-quality-group checked>分组聚合</label><div class="quality-chart-option-box" data-quality-group-fields><div class="quality-config-field full"><label>分组依据</label><select><option>检测模板ID</option><option>判定结果</option><option>班次</option><option>第二级位置</option></select></div><div class="quality-config-field full"><label>排序依据</label><div class="quality-segment-control"><button type="button" class="is-active">字段值</button><button type="button">记录顺序</button></div></div><div class="quality-config-field full"><label>排序规则</label><div class="quality-segment-control"><button type="button">正序</button><button type="button" class="is-active">倒序</button></div></div></div></div></section>
      <section class="quality-config-section"><div class="quality-config-grid"><div class="quality-config-field full" data-quality-chart-style><label>柱状图样式</label><select><option>普通柱状图</option><option>堆积柱状图</option><option>百分比堆积柱状图</option></select></div><div class="quality-config-field full"><label>主题色</label><div class="quality-source-trigger"><span class="quality-theme-preview"><i></i><i></i><i></i><i></i><i></i></span><span>默认</span></div></div><label class="quality-config-check full"><input type="checkbox">渐变填充</label><div class="quality-config-field full"><label>图表选项</label><div class="quality-chart-check-grid"><label class="quality-config-check"><input type="checkbox" data-quality-config="legend" checked>图例</label><label class="quality-config-check"><input type="checkbox" data-quality-config="label" checked>数据标签</label><label class="quality-config-check"><input type="checkbox" checked>坐标轴</label><label class="quality-config-check"><input type="checkbox" checked>网格线</label></div></div><div class="quality-chart-switch-row"><span>切换行/列</span><label class="quality-switch"><input type="checkbox"><span></span></label></div><div class="quality-config-field full"><label>空单元格显示为</label><select><option>空</option><option>零</option></select></div></div></section></div>
      <div class="quality-metric-panel" data-chart-panel="custom" hidden>${qualityChartCustomMarkup()}</div>
    </div><footer class="quality-config-drawer-foot"><button type="button" class="primary" data-quality-chart-save>保存</button></footer></aside>`;
  }

  function qualityTextFormatMarkup() {
    return `<div class="quality-text-format"><button type="button">12⌄</button><button type="button"><u>A</u>⌄</button><button type="button"><b>B</b></button><button type="button"><s>S</s></button><button type="button"><i>I</i></button><button type="button"><u>U</u></button></div>`;
  }

  function qualityChartCustomMarkup() {
    return `<div class="quality-chart-accordions">
      <details class="quality-chart-accordion"><summary>背景与标题</summary><div class="quality-chart-accordion-body"><div class="quality-config-field"><label>背景颜色</label><select><option>默认</option><option>白色</option><option>透明</option></select></div><div class="quality-config-field"><label>标题样式</label><select><option>默认</option><option>突出</option><option>隐藏</option></select></div></div></details>
      <details class="quality-chart-accordion"><summary>尺寸</summary><div class="quality-chart-accordion-body"><div class="quality-config-field"><label>宽度</label><div class="quality-segment-control"><button type="button" class="is-active">默认宽度</button><button type="button">填充容器</button></div></div><div class="quality-config-field"><label>高度</label><div class="quality-segment-control"><button type="button" class="is-active">默认高度</button><button type="button">填充容器</button></div></div></div></details>
      <details class="quality-chart-accordion"><summary>组件字体样式</summary><div class="quality-chart-accordion-body"><div class="quality-config-field"><label>字体颜色</label><select><option>默认</option><option>深色</option><option>浅色</option></select></div><div class="quality-config-field"><label>字号</label><select><option>10</option><option selected>12</option><option>14</option><option>16</option></select></div></div></details>
      <details class="quality-chart-accordion"><summary>轴标题</summary><div class="quality-chart-accordion-body"><div class="quality-config-field"><label>选择轴</label><select><option>横轴</option><option>纵轴</option></select></div><div class="quality-config-field"><label>标题内容</label><input placeholder="请输入标题"></div><div class="quality-config-field"><label>文本格式</label>${qualityTextFormatMarkup()}</div></div></details>
      <details class="quality-chart-accordion"><summary>系列</summary><div class="quality-chart-accordion-body"><div class="quality-config-field"><label>选择系列</label><select data-quality-series-select><option>检测PCB数</option><option>PCB良率</option><option>PCB不良率</option><option>器件DPPM</option></select></div><label class="quality-config-check"><input type="checkbox" data-quality-custom-series-name>自定义显示名称</label><div class="quality-config-field" data-quality-series-name hidden><input value="检测PCB数" placeholder="请输入显示名称"></div><div class="quality-chart-subtitle"><span>系列样式</span></div><div class="quality-chart-option-box"><div class="quality-config-grid"><div class="quality-config-field"><label>填充色</label><select><option>默认</option></select></div><div class="quality-config-field"><label>填充色不透明度</label><select><option>100%</option><option>80%</option><option>60%</option></select></div><div class="quality-config-field"><label>边框色</label><select><option>默认</option></select></div><div class="quality-config-field"><label>边框不透明度</label><select><option>100%</option><option>80%</option></select></div><div class="quality-config-field"><label>边框线</label><select><option>实线</option><option>虚线</option></select></div><div class="quality-config-field"><label>边框粗细</label><select><option>默认</option><option>1</option><option>2</option></select></div><div class="quality-config-field full"><label>绘制轴</label><select><option>左轴</option><option>右轴</option></select></div></div></div><div class="quality-chart-subtitle"><span>数据点格式</span><button type="button">＋ 添加数据点</button></div><label class="quality-config-check"><input type="checkbox" data-quality-data-label checked>显示数据标签</label><div class="quality-chart-option-box" data-quality-data-label-fields><div class="quality-config-field"><label>标签位置</label><select><option>默认</option><option>顶部</option><option>内部</option></select></div><div class="quality-config-field"><label>标签内容</label><select><option>值</option><option>系列名</option><option>占比</option></select></div><div class="quality-config-field"><label>文本格式</label>${qualityTextFormatMarkup()}</div></div></div></details>
      <details class="quality-chart-accordion"><summary>图例</summary><div class="quality-chart-accordion-body"><div class="quality-config-field"><label>图例位置</label><select><option>顶部</option><option>底部</option><option>左侧</option><option>右侧</option></select></div><div class="quality-config-field"><label>文本格式</label>${qualityTextFormatMarkup()}</div></div></details>
      <details class="quality-chart-accordion"><summary>横轴</summary><div class="quality-chart-accordion-body"><label class="quality-config-check"><input type="checkbox" checked>显示标签</label><div class="quality-chart-option-box"><div class="quality-config-field"><label>标签角度</label><select><option>默认</option><option>横排</option><option>45°</option><option>竖排</option></select></div><div class="quality-config-field"><label>文本格式</label>${qualityTextFormatMarkup()}</div></div><label class="quality-config-check"><input type="checkbox">显示轴线</label></div></details>
      <details class="quality-chart-accordion"><summary>纵轴</summary><div class="quality-chart-accordion-body"><label class="quality-config-check"><input type="checkbox" checked>显示标签</label><div class="quality-chart-option-box"><div class="quality-config-field"><label>标签角度</label><select><option>横排</option><option>默认</option><option>45°</option></select></div><div class="quality-config-field"><label>文本格式</label>${qualityTextFormatMarkup()}</div></div><label class="quality-config-check"><input type="checkbox">显示轴线</label><div class="quality-config-field"><label>轴范围</label><div class="quality-config-grid"><input placeholder="最小值：默认"><input placeholder="最大值：默认"></div></div></div></details>
      <details class="quality-chart-accordion"><summary>网格线与刻度标记</summary><div class="quality-chart-accordion-body"><div class="quality-config-field"><label>设置对象</label><select><option>横轴</option><option>纵轴</option></select></div><label class="quality-config-check"><input type="checkbox">主网格</label></div></details>
    </div>`;
  }

  function isHorizontalBarKind(kind) {
    return ['horizontalBar', 'horizontalBarStacked', 'horizontalBarPercent'].includes(kind);
  }

  function configureQualityChartDrawer(drawer, kind, chart = qualityEditorSelectedChart) {
    if (!drawer) return;
    const typeSelect = drawer.querySelector('[data-quality-config="type"]');
    if (!typeSelect) return;
    drawer._fullChartTypeOptions ||= typeSelect.innerHTML;
    const horizontal = isHorizontalBarKind(kind);
    typeSelect.innerHTML = horizontal
      ? '<option value="horizontalBar">基础条形图</option><option value="horizontalBarStacked">堆积条形图</option><option value="horizontalBarPercent">百分比堆积条形图</option>'
      : drawer._fullChartTypeOptions;
    typeSelect.value = kind;
    const dimensionHeading = drawer.querySelector('[data-quality-dimension-heading]');
    const measureHeading = drawer.querySelector('[data-quality-measure-heading]');
    if (dimensionHeading) dimensionHeading.textContent = horizontal ? '纵轴（类别）' : '横轴（类别）';
    if (measureHeading) measureHeading.textContent = horizontal ? '横轴（字段）' : '纵轴（字段）';
    const axisSortButtons = drawer.querySelectorAll('[data-quality-axis-sort] .quality-segment-three button');
    if (axisSortButtons[0]) axisSortButtons[0].textContent = horizontal ? '纵轴值' : '横轴值';
    if (axisSortButtons[1]) axisSortButtons[1].textContent = horizontal ? '横轴值' : '纵轴值';
    const styleField = drawer.querySelector('[data-quality-chart-style]');
    if (styleField) styleField.hidden = horizontal;
    const titleField = drawer.querySelector('[data-quality-title-field]');
    let titleToggle = drawer.querySelector('[data-quality-show-title]');
    if (horizontal && titleField && !titleToggle) {
      titleField.insertAdjacentHTML('beforeend', '<label class="quality-config-check quality-title-toggle"><input type="checkbox" data-quality-show-title checked>显示标题</label>');
      titleToggle = drawer.querySelector('[data-quality-show-title]');
    }
    if (!horizontal && titleToggle) {
      titleToggle.closest('.quality-title-toggle')?.remove();
      titleToggle = null;
    }
    if (titleToggle) {
      titleToggle.checked = chart?.dataset.showTitle !== 'false';
      titleToggle.onchange = previewQualityEditorChart;
    }
    const drawerTitle = drawer.querySelector('.quality-config-drawer-head h3');
    if (drawerTitle && horizontal) drawerTitle.textContent = '条形图';
  }

  function selectQualityEditorChart(chart) {
    if (!chart) return;
    document.querySelectorAll('[data-custom-chart]').forEach(item => item.classList.toggle('is-editor-selected', item === chart));
    qualityEditorSelectedChart = chart;
    qualityEditorSelectedMetric = null;
    const drawer = document.querySelector('[data-quality-config-drawer]');
    if (!drawer) return;
    document.querySelectorAll('[data-custom-metric]').forEach(item => item.classList.remove('is-editor-selected'));
    if (drawer.dataset.mode === 'metric') {
      drawer.dataset.mode = 'chart';
      drawer.querySelector('.quality-config-drawer-body').innerHTML = drawer._chartBodyHtml;
      const restoreButton = drawer.querySelector('[data-quality-restore]');
      const previewButton = drawer.querySelector('[data-quality-preview]');
      if (restoreButton) restoreButton.hidden = false;
      if (previewButton) previewButton.hidden = false;
      drawer.querySelector('[data-quality-chart-save]').textContent = '保存';
      bindQualityChartDrawer(drawer);
    }
    const chartKind = chart.dataset.chartKind || 'bar';
    configureQualityChartDrawer(drawer, chartKind, chart);
    const typeLabels = { bar: '柱状图', horizontalBar: '条形图', horizontalBarStacked: '条形图', horizontalBarPercent: '条形图', line: '折线图', area: '面积图', pie: '饼图', donut: '环形图', combo: '组合图', radar: '雷达图', scatter: '散点图', funnel: '漏斗图', wordCloud: '词云', heatmap: '热力图', table: '表格', kanban: '看板', calendar: '日历', gantt: '甘特图', gallery: '画册', pivot: '透视表', text: '文本', button: '按钮', ranking: '排行榜', progress: '进度图', countdown: '倒计时', slicer: '切片器', layout: '组合布局' };
    drawer.querySelector('.quality-config-drawer-head h3').textContent = typeLabels[chartKind] || '柱状图';
    drawer.querySelector('[data-quality-config="name"]').value = getText(chart.querySelector('.phead-title b')) || '未命名图表';
    drawer.querySelector('[data-quality-config="type"]').value = chartKind;
    chart.dataset.dimension ||= chart.hasAttribute('data-comparison-panel') ? '设备' : '检测日期';
    chart.dataset.measure ||= chart.hasAttribute('data-comparison-panel') ? 'PCB良率' : '检测PCB数';
    chart.dataset.originalDimension ||= chart.dataset.dimension;
    chart.dataset.originalMeasure ||= chart.dataset.measure;
    drawer.querySelector('[data-quality-config="dimension"]').value = chart.dataset.dimension;
    drawer.querySelector('[data-quality-config="measure"]').value = chart.dataset.measure;
  }

  function previewQualityEditorChart() {
    const chart = qualityEditorSelectedChart;
    const drawer = document.querySelector('[data-quality-config-drawer]');
    if (!chart || !drawer) return;
    const name = drawer.querySelector('[data-quality-config="name"]').value.trim() || '未命名图表';
    const type = drawer.querySelector('[data-quality-config="type"]').value;
    const dimension = drawer.querySelector('[data-quality-config="dimension"]').value;
    const measure = drawer.querySelector('[data-quality-config="measure"]').value;
    const title = chart.querySelector('.phead-title b');
    const showTitleToggle = drawer.querySelector('[data-quality-show-title]');
    const showTitle = showTitleToggle ? showTitleToggle.checked : true;
    if (title) {
      title.textContent = name;
      title.hidden = !showTitle;
    }
    chart.dataset.chartKind = type;
    chart.dataset.dimension = dimension;
    chart.dataset.measure = measure;
    chart.dataset.showTitle = String(showTitle);
    const drawerTitle = drawer.querySelector('.quality-config-drawer-head h3');
    const typeTitles = { bar: '柱状图', horizontalBar: '条形图', horizontalBarStacked: '条形图', horizontalBarPercent: '条形图', line: '折线图', area: '面积图', pie: '饼图', donut: '环形图', combo: '组合图', radar: '雷达图', scatter: '散点图', funnel: '漏斗图', wordCloud: '词云', heatmap: '热力图', table: '表格', kanban: '看板', calendar: '日历', gantt: '甘特图', gallery: '画册', pivot: '透视表', text: '文本', button: '按钮', ranking: '排行榜', progress: '进度图', countdown: '倒计时', slicer: '切片器', layout: '组合布局' };
    if (drawerTitle) drawerTitle.textContent = typeTitles[type] || '柱状图';
    if (chart.dataset.editorCreated === 'true' || type !== chart.dataset.originalKind || dimension !== chart.dataset.originalDimension || measure !== chart.dataset.originalMeasure) {
      const labels = { bar: '柱状图', line: '折线图', horizontalBar: '基础条形图', horizontalBarStacked: '堆积条形图', horizontalBarPercent: '百分比堆积条形图', area: '面积图', pie: '饼图', donut: '环形图', combo: '组合图', radar: '雷达图', scatter: '散点图', funnel: '漏斗图', wordCloud: '词云', heatmap: '热力图', table: '表格', kanban: '看板', calendar: '日历', gantt: '甘特图', gallery: '画册', pivot: '透视表', text: '文本', button: '按钮', ranking: '排行榜', progress: '进度图', countdown: '倒计时', slicer: '切片器', layout: '组合布局' };
      chart.querySelector('.quality-chart-body').innerHTML = `<div class="quality-custom-placeholder"><div><b>${labels[type]}</b>${dimension} × ${measure}<small>预览已按当前配置同步更新</small></div></div>`;
    }
  }

  function bindQualityChartDrawer(drawer) {
    drawer.querySelector('[data-quality-config="name"]').oninput = previewQualityEditorChart;
    drawer.querySelectorAll('select[data-quality-config]').forEach(select => select.onchange = () => {
      if (select.dataset.qualityConfig === 'type') configureQualityChartDrawer(drawer, select.value);
      previewQualityEditorChart();
    });
    drawer.querySelectorAll('.quality-segment-control button').forEach(button => button.onclick = () => {
      button.parentElement.querySelectorAll('button').forEach(item => item.classList.toggle('is-active', item === button));
    });
    drawer.querySelectorAll('[data-chart-tab]').forEach(tab => tab.onclick = () => {
      drawer.querySelectorAll('[data-chart-tab]').forEach(item => item.classList.toggle('is-active', item === tab));
      drawer.querySelectorAll('[data-chart-panel]').forEach(panel => { panel.hidden = panel.dataset.chartPanel !== tab.dataset.chartTab; });
    });
    const multiSplit = drawer.querySelector('[data-quality-multi-split]');
    const summaryCategory = drawer.querySelector('[data-quality-summary-category]');
    const groupToggleWrap = drawer.querySelector('[data-quality-group-toggle]');
    const groupToggle = drawer.querySelector('[data-quality-group]');
    const updateGroupVisibility = () => {
      const fields = drawer.querySelector('[data-quality-group-fields]');
      if (groupToggleWrap && summaryCategory) groupToggleWrap.hidden = !summaryCategory.checked;
      if (fields && groupToggle && summaryCategory) fields.hidden = !summaryCategory.checked || !groupToggle.checked;
    };
    if (multiSplit) multiSplit.onchange = () => {
      if (multiSplit.checked && summaryCategory) summaryCategory.checked = false;
      updateGroupVisibility();
    };
    if (summaryCategory) summaryCategory.onchange = () => {
      if (summaryCategory.checked && multiSplit) multiSplit.checked = false;
      updateGroupVisibility();
    };
    if (groupToggle) groupToggle.onchange = updateGroupVisibility;
    updateGroupVisibility();
    const customSeriesName = drawer.querySelector('[data-quality-custom-series-name]');
    const seriesNameField = drawer.querySelector('[data-quality-series-name]');
    const seriesSelect = drawer.querySelector('[data-quality-series-select]');
    if (customSeriesName && seriesNameField) customSeriesName.onchange = () => {
      seriesNameField.hidden = !customSeriesName.checked;
      if (customSeriesName.checked) seriesNameField.querySelector('input')?.focus();
    };
    if (seriesSelect && seriesNameField) seriesSelect.onchange = () => {
      const input = seriesNameField.querySelector('input');
      if (input && !customSeriesName?.checked) input.value = seriesSelect.value;
    };
    const dataLabelToggle = drawer.querySelector('[data-quality-data-label]');
    const dataLabelFields = drawer.querySelector('[data-quality-data-label-fields]');
    if (dataLabelToggle && dataLabelFields) dataLabelToggle.onchange = () => {
      dataLabelFields.hidden = !dataLabelToggle.checked;
    };
    const previewButton = drawer.querySelector('[data-quality-preview]');
    if (previewButton) previewButton.onclick = () => { previewQualityEditorChart(); toast('预览已更新', 'info'); };
    drawer.querySelector('[data-quality-chart-save]').onclick = () => {
      previewQualityEditorChart();
      if (qualityEditorSelectedChart) {
        qualityEditorSelectedChart.dataset.originalKind = qualityEditorSelectedChart.dataset.chartKind;
        qualityEditorSelectedChart.dataset.originalDimension = qualityEditorSelectedChart.dataset.dimension;
        qualityEditorSelectedChart.dataset.originalMeasure = qualityEditorSelectedChart.dataset.measure;
        qualityEditorSelectedChart.dataset.originalShowTitle = qualityEditorSelectedChart.dataset.showTitle;
        qualityEditorSelectedChart._qualityOriginalBody = qualityEditorSelectedChart.querySelector('.quality-chart-body')?.innerHTML || '';
        qualityEditorSelectedChart._qualityOriginalTitle = getText(qualityEditorSelectedChart.querySelector('.phead-title b'));
      }
      toast('图表配置已保存');
    };
    const restoreButton = drawer.querySelector('[data-quality-restore]');
    if (restoreButton) restoreButton.onclick = () => {
      const chart = qualityEditorSelectedChart;
      if (chart) {
        chart.dataset.chartKind = chart.dataset.originalKind;
        chart.dataset.dimension = chart.dataset.originalDimension;
        chart.dataset.measure = chart.dataset.originalMeasure;
        chart.dataset.showTitle = chart.dataset.originalShowTitle || 'true';
        chart.querySelector('.phead-title b').textContent = chart._qualityOriginalTitle;
        chart.querySelector('.phead-title b').hidden = chart.dataset.showTitle === 'false';
        chart.querySelector('.quality-chart-body').innerHTML = chart._qualityOriginalBody;
        selectQualityEditorChart(chart);
      }
      toast('已恢复上次保存配置', 'info');
    };
  }

  function addQualityComponentControls(component) {
    if (!component || component.querySelector(':scope > .quality-component-tools')) return;
    component.insertAdjacentHTML('beforeend', `<div class="quality-component-tools"><button type="button" class="quality-component-drag" draggable="true" title="拖动调整位置" aria-label="拖动调整位置">⠿</button><button type="button" class="quality-component-more" aria-label="组件操作">⋮</button><div class="quality-component-menu" hidden><button type="button" data-component-config>配置</button><button type="button" data-component-delete>删除</button></div></div><button type="button" class="quality-component-resize" title="拖动调整宽度和高度" aria-label="拖动调整宽度和高度"></button>`);
    const tools = component.querySelector(':scope > .quality-component-tools');
    const more = tools.querySelector('.quality-component-more');
    const menu = tools.querySelector('.quality-component-menu');
    const drag = tools.querySelector('.quality-component-drag');
    const resize = component.querySelector(':scope > .quality-component-resize');
    more.onclick = event => {
      event.stopPropagation();
      document.querySelectorAll('.quality-component-menu').forEach(item => { if (item !== menu) item.hidden = true; });
      menu.hidden = !menu.hidden;
    };
    tools.querySelector('[data-component-config]').onclick = event => {
      event.stopPropagation();
      menu.hidden = true;
      if (component.matches('[data-custom-metric]')) selectQualityEditorMetric(component);
      else selectQualityEditorChart(component);
    };
    tools.querySelector('[data-component-delete]').onclick = event => {
      event.stopPropagation();
      menu.hidden = true;
      if (qualityEditorSelectedChart === component || qualityEditorSelectedMetric === component) {
        qualityEditorSelectedChart = null;
        qualityEditorSelectedMetric = null;
      }
      component.remove();
      toast('组件已删除');
    };
    drag.addEventListener('click', event => event.stopPropagation());
    resize.addEventListener('click', event => event.stopPropagation());
    resize.addEventListener('pointerdown', event => {
      event.preventDefault();
      event.stopPropagation();
      const parent = component.parentElement;
      if (!parent) return;
      const startRect = component.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();
      const minimumHeight = component.matches('[data-custom-metric]') ? 82 : 180;
      const minimumWidth = Math.min(parentRect.width, component.matches('[data-custom-metric]') ? 150 : 280);
      const startX = event.clientX;
      const startY = event.clientY;
      document.body.classList.add('quality-component-resizing');
      resize.setPointerCapture?.(event.pointerId);
      const move = moveEvent => {
        const desiredWidth = Math.max(minimumWidth, Math.min(parentRect.width, startRect.width + moveEvent.clientX - startX));
        const desiredHeight = Math.max(minimumHeight, startRect.height + moveEvent.clientY - startY);
        component.style.removeProperty('grid-column');
        component.style.setProperty('--quality-component-width', `${Math.round(desiredWidth)}px`);
        component.style.setProperty('width', `${Math.round(desiredWidth)}px`, 'important');
        component.style.setProperty('flex', '0 0 auto', 'important');
        component.style.setProperty('height', `${Math.round(desiredHeight)}px`, 'important');
      };
      const finish = () => {
        document.body.classList.remove('quality-component-resizing');
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', finish);
        window.removeEventListener('pointercancel', finish);
      };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', finish);
      window.addEventListener('pointercancel', finish);
    });
    drag.addEventListener('dragstart', event => {
      event.stopPropagation();
      component.classList.add('quality-component-dragging');
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', 'quality-component');
    });
    drag.addEventListener('dragend', () => {
      component.classList.remove('quality-component-dragging');
      document.querySelectorAll('.quality-component-drop-before').forEach(item => item.classList.remove('quality-component-drop-before'));
    });
    component.addEventListener('dragover', event => {
      const dragging = document.querySelector('.quality-component-dragging');
      if (!dragging || dragging === component || dragging.parentElement !== component.parentElement) return;
      event.preventDefault();
      component.classList.add('quality-component-drop-before');
    });
    component.addEventListener('dragleave', () => component.classList.remove('quality-component-drop-before'));
    component.addEventListener('drop', event => {
      const dragging = document.querySelector('.quality-component-dragging');
      component.classList.remove('quality-component-drop-before');
      if (!dragging || dragging === component || dragging.parentElement !== component.parentElement) return;
      event.preventDefault();
      component.parentElement.insertBefore(dragging, component);
    });
  }

  const qualityComponentGroups = [
    { title: '图表', items: [['metric', '指标卡', '123'], ['bar', '柱状图', '▥'], ['line', '折线图', '〽'], ['horizontalBar', '条形图', '▰'], ['area', '面积图', '⌁'], ['pie', '饼图', '◔'], ['donut', '环形图', '◎'], ['combo', '组合图', '▥'], ['radar', '雷达图', '◇'], ['scatter', '散点图', '⠿'], ['funnel', '漏斗图', '▽'], ['wordCloud', '词云', '☁']] },
    { title: '视图', items: [['table', '表格', '▦'], ['kanban', '看板', '▣'], ['calendar', '日历', '▦'], ['gantt', '甘特图', '▤'], ['gallery', '画册', '▧']] },
    { title: '其他', items: [['pivot', '透视表', '▦'], ['text', '文本', 'T'], ['button', '按钮', '＋'], ['ranking', '排行榜', '↟'], ['progress', '进度图', '▰'], ['countdown', '倒计时', '◷'], ['slicer', '切片器', '▽'], ['layout', '组合布局', '▦']] }
  ];

  function createQualityEditorComponent(type, label) {
    const content = document.querySelector('.quality-content');
    if (!content) return;
    if (type === 'metric') {
      const metrics = content.querySelector('.quality-metrics');
      if (!metrics) return;
      const metric = document.createElement('div');
      metric.className = 'quality-metric';
      metric.dataset.customMetric = 'pcbTotal';
      metric.dataset.editorCreated = 'true';
      metric.innerHTML = '<div class="metric-label">未命名指标</div><div class="metric-value">0</div>';
      metrics.appendChild(metric);
      metric.addEventListener('click', event => { if (!event.target.closest('button')) selectQualityEditorMetric(metric); });
      addQualityComponentControls(metric);
      selectQualityEditorMetric(metric);
      return;
    }
    const grid = content.querySelector('.quality-grid');
    if (!grid) return;
    const chart = document.createElement('section');
    chart.className = 'quality-chart';
    chart.dataset.customChart = '';
    chart.dataset.chartKind = type;
    chart.dataset.originalKind = type;
    chart.dataset.showTitle = 'true';
    chart.dataset.originalShowTitle = 'true';
    chart.dataset.editorCreated = 'true';
    chart.innerHTML = `<div class="phead"><div class="phead-title"><b>未命名${label}</b></div></div><div class="quality-chart-body"><div class="quality-custom-placeholder"><div><b>${label}</b>请在右侧配置数据与展示方式</div></div></div>`;
    grid.appendChild(chart);
    chart.addEventListener('click', event => { if (!event.target.closest('button,input,select')) selectQualityEditorChart(chart); });
    addQualityComponentControls(chart);
    selectQualityEditorChart(chart);
  }

  function openQualityComponentPicker() {
    document.querySelector('[data-quality-component-picker]')?.remove();
    const backdrop = document.createElement('div');
    backdrop.className = 'proto-backdrop';
    backdrop.dataset.qualityComponentPicker = '';
    const groups = qualityComponentGroups.map(group => `<section class="quality-component-group"><h4>${group.title}</h4><div class="quality-component-options">${group.items.map(item => `<button type="button" class="quality-component-option" data-component-type="${item[0]}" data-component-label="${item[1]}"><span class="quality-component-icon">${item[2]}</span><span>${item[1]}</span></button>`).join('')}</div></section>`).join('');
    backdrop.innerHTML = `<section class="proto-modal quality-component-picker" role="dialog" aria-modal="true" aria-label="添加组件"><header class="proto-modal-head"><h3>添加组件</h3><button type="button" class="proto-close" aria-label="关闭">×</button></header><div class="proto-modal-body"><input class="quality-component-search" data-component-search placeholder="搜索组件"><div data-component-groups>${groups}</div></div></section>`;
    document.body.appendChild(backdrop);
    const close = () => backdrop.remove();
    backdrop.querySelector('.proto-close').onclick = close;
    backdrop.addEventListener('click', event => { if (event.target === backdrop) close(); });
    backdrop.querySelector('[data-component-search]').oninput = event => {
      const keyword = event.target.value.trim().toLowerCase();
      backdrop.querySelectorAll('.quality-component-option').forEach(option => { option.hidden = keyword && !option.dataset.componentLabel.toLowerCase().includes(keyword); });
      backdrop.querySelectorAll('.quality-component-group').forEach(group => { group.hidden = !group.querySelector('.quality-component-option:not([hidden])'); });
    };
    backdrop.querySelectorAll('.quality-component-option').forEach(option => option.onclick = () => {
      const type = option.dataset.componentType;
      const label = option.dataset.componentLabel;
      close();
      createQualityEditorComponent(type, label);
    });
    backdrop.querySelector('[data-component-search]').focus();
  }

  function closeQualityPageEditor() {
    if (document._qualityMenuCloser) {
      document.removeEventListener('click', document._qualityMenuCloser);
      delete document._qualityMenuCloser;
    }
    document.body.classList.remove('quality-page-editor-open', 'quality-page-preview');
    document.querySelector('[data-quality-config-drawer]')?.remove();
    document.querySelector('[data-quality-editor-bar]')?.remove();
    document.querySelectorAll('.quality-component-tools').forEach(tools => tools.remove());
    document.querySelectorAll('.quality-component-resize').forEach(handle => handle.remove());
    document.querySelectorAll('[data-custom-chart]').forEach(chart => chart.classList.remove('is-editor-selected'));
    document.querySelectorAll('[data-custom-metric]').forEach(metric => metric.classList.remove('is-editor-selected'));
    qualityEditorSelectedChart = null;
    qualityEditorSelectedMetric = null;
  }

  function openQualityPageEditor() {
    if (document.querySelector('[data-quality-config-drawer]')) return;
    const content = document.querySelector('.quality-content');
    const grid = content?.querySelector('.quality-grid');
    if (!content || !grid) return;
    document.body.classList.add('quality-page-editor-open');
    content.insertAdjacentHTML('afterbegin', `<section class="quality-editor-bar" data-quality-editor-bar><div><b>编辑设备分析页面</b><span>　点击组件右上角菜单进行配置，拖动手柄可调整位置</span></div><div class="quality-editor-bar-actions"><button type="button" data-quality-add-chart>添加组件</button><button type="button" data-quality-reset-page>恢复默认</button><button type="button" data-quality-preview-page>页面预览</button><button type="button" class="primary" data-quality-publish>完成编辑</button></div></section>`);
    document.body.insertAdjacentHTML('beforeend', qualityEditorDrawerMarkup());
    const drawer = document.querySelector('[data-quality-config-drawer]');
    drawer.dataset.mode = 'chart';
    drawer._chartBodyHtml = drawer.querySelector('.quality-config-drawer-body').innerHTML;
    content.querySelectorAll('[data-custom-chart]').forEach(chart => {
      chart.dataset.originalKind = chart.dataset.chartKind || 'bar';
      chart.dataset.showTitle ||= 'true';
      chart.dataset.originalShowTitle = chart.dataset.showTitle;
      chart._qualityOriginalBody = chart.querySelector('.quality-chart-body')?.innerHTML || '';
      chart._qualityOriginalTitle = getText(chart.querySelector('.phead-title b'));
      chart.addEventListener('click', event => { if (!event.target.closest('button,input,select')) selectQualityEditorChart(chart); });
      addQualityComponentControls(chart);
    });
    content.querySelectorAll('[data-custom-metric]').forEach(metric => {
      metric.addEventListener('click', event => { if (!event.target.closest('button')) selectQualityEditorMetric(metric); });
      addQualityComponentControls(metric);
    });
    document.querySelectorAll('[data-quality-editor-exit]').forEach(button => button.onclick = closeQualityPageEditor);
    content.querySelector('[data-quality-reset-page]').onclick = () => {
      closeQualityPageEditor();
      renderDeviceQuality();
      openQualityPageEditor();
      toast('页面已恢复默认');
    };
    content.querySelector('[data-quality-add-chart]').onclick = openQualityComponentPicker;
    content.querySelector('[data-quality-preview-page]').onclick = event => {
      const previewing = document.body.classList.toggle('quality-page-preview');
      event.currentTarget.textContent = previewing ? '返回编辑' : '页面预览';
    };
    content.querySelector('[data-quality-publish]').onclick = () => {
      closeQualityPageEditor();
      toast('页面编辑已完成');
    };
    document._qualityMenuCloser = event => {
      if (!event.target.closest('.quality-component-tools')) document.querySelectorAll('.quality-component-menu').forEach(menu => { menu.hidden = true; });
    };
    document.addEventListener('click', document._qualityMenuCloser);
    bindQualityChartDrawer(drawer);
    selectQualityEditorChart(content.querySelector('[data-custom-chart]'));
  }

  function selectableRows(table) {
    return Array.from(table.tBodies[0]?.rows || []).filter(row => !row.classList.contains('proto-empty') && !row.classList.contains('empty-row'));
  }

  function updateSelectableExport(table) {
    const exportButton = table._selectExportButton;
    const selectAll = table.querySelector('.select-all-check');
    if (!exportButton || !selectAll) return;
    const visibleChecks = selectableRows(table)
      .filter(row => getComputedStyle(row).display !== 'none')
      .map(row => row.querySelector('.select-row-check'))
      .filter(Boolean);
    const selected = visibleChecks.filter(check => check.checked).length;
    selectAll.checked = visibleChecks.length > 0 && selected === visibleChecks.length;
    selectAll.indeterminate = selected > 0 && selected < visibleChecks.length;
    exportButton.disabled = selected === 0;
    exportButton.textContent = selected ? `导出所选（${selected}）` : '导出所选';
  }

  function prepareSelectableRows(table) {
    const boardTable = table.classList.contains('board-query-table');
    selectableRows(table).forEach((row, index) => {
      let cell = row.querySelector('.select-cell');
      if (!cell) {
        cell = boardTable ? row.cells[0] : row.insertCell(0);
        cell.className = 'select-cell';
      }
      if (!cell.querySelector('.select-row-check')) cell.innerHTML = `<input class="select-row-check" type="checkbox" aria-label="选择第 ${index + 1} 条记录">`;
    });
  }

  function enhanceSelectableTable(table, exportButton) {
    if (!table || !table.tHead || !table.tBodies.length || table.dataset.selectExportEnhanced) return;
    table.dataset.selectExportEnhanced = 'true';
    table.classList.add('select-export-table');
    exportButton.classList.add('select-export');
    exportButton.dataset.selectExport = 'true';
    exportButton.disabled = true;
    exportButton.textContent = '导出所选';
    table._selectExportButton = exportButton;

    const boardTable = table.classList.contains('board-query-table');
    const headerRow = table.tHead.rows[0];
    let headerCell = boardTable ? headerRow.cells[0] : null;
    if (!headerCell) {
      const colgroup = table.querySelector('colgroup');
      if (colgroup) {
        const col = document.createElement('col');
        col.style.width = '44px';
        colgroup.insertBefore(col, colgroup.firstChild);
      }
      headerCell = document.createElement('th');
      headerRow.insertBefore(headerCell, headerRow.firstChild);
    }
    headerCell.className = 'select-cell';
    headerCell.innerHTML = '<input class="select-all-check" type="checkbox" aria-label="全选当前页">';
    prepareSelectableRows(table);

    const selectAll = headerCell.querySelector('.select-all-check');
    selectAll.addEventListener('change', () => {
      selectableRows(table).filter(row => getComputedStyle(row).display !== 'none').forEach(row => {
        const check = row.querySelector('.select-row-check');
        if (check) check.checked = selectAll.checked;
      });
      updateSelectableExport(table);
    });
    table.addEventListener('change', event => {
      if (event.target.matches('.select-row-check')) updateSelectableExport(table);
    });
    new MutationObserver(() => {
      table.tBodies[0].querySelectorAll('.proto-empty,.empty-row').forEach(row => {
        if (row.cells[0]) row.cells[0].colSpan = table.tHead.rows[0].cells.length;
      });
      prepareSelectableRows(table);
      updateSelectableExport(table);
    }).observe(table.tBodies[0], { childList: true });
    updateSelectableExport(table);
  }

  function enhanceSelectableExports(root = document) {
    root.querySelectorAll('button').forEach(button => {
      if (button.matches('.device-export,[data-select-export]')) return;
      if (!/^(导出报表|导出明细|导出设备明细|导出监控记录|导出该页报表)$/.test(getText(button))) return;
      const panel = button.closest('.table-panel,.records,.detail-panel,.component-panel');
      const table = panel && panel.querySelector('table');
      if (table) enhanceSelectableTable(table, button);
    });
  }

  function resetSelectableExports(root = document) {
    root.querySelectorAll('.select-row-check,.device-row-check').forEach(check => { check.checked = false; });
    root.querySelectorAll('.select-all-check,.device-select-all').forEach(check => { check.checked = false; check.indeterminate = false; });
    root.querySelectorAll('table[data-select-export-enhanced]').forEach(updateSelectableExport);
    const deviceTable = root.querySelector('[data-device-table]');
    if (deviceTable) {
      const button = deviceTable.closest('.table-panel')?.querySelector('.device-export');
      if (button) { button.disabled = true; button.textContent = '导出所选'; }
    }
  }

  function renderDeviceOverview() {
    const content = document.querySelector('.quality-content');
    if (!content) return;
    const label = mouthLabel(currentMouth);
    const sourceMouth = currentMouth;
    const avgYield = sourceMouth === 'original' ? 91.82 : sourceMouth === 'second' ? 98.91 : 98.38;
    const avgNgRate = 100 - avgYield;
    const rows = deviceOverviewRows(currentMouth);
    const participatingDevices = deviceSamples.filter(device => Number(device.boardTotal) > 0);
    const templateIds = new Set(participatingDevices.flatMap(device => device.projects.map(project => project.uuid)).filter(Boolean));
    const pcbTotal = participatingDevices.reduce((sum, device) => sum + Number(device.boardTotal || 0), 0);
    content.innerHTML = `${deviceQualityMouthToolbar(participatingDevices.length)}
      <section class="quality-metrics">
        ${metricBlock('<span title="统计周期内有历史检测数据的全部设备，包含当前停用设备">参与统计设备 ⓘ</span>', `${participatingDevices.length}<small>台</small>`, '', 'participatingDevices')}
        ${metricBlock('<span title="按照模板 ID 去重计算">检测模板数 ⓘ</span>', `${templateIds.size}<small>个</small>`, '', 'templateCount')}
        ${metricBlock('检测 PCB 总数', `${number(pcbTotal)}<small>块</small>`, '', 'pcbTotal')}
        ${metricBlock(`${label}板卡不良率`, `${avgNgRate.toFixed(2)}<small>%</small>`, '', 'boardNgRate')}
        ${metricBlock(`${label}器件 DPPM`, sourceMouth === 'original' ? '2,368' : sourceMouth === 'second' ? '884' : '1,042', '', 'componentDppm')}
      </section>
      ${deviceQualityCharts()}${deviceQualityFilters()}<section class="panel table-panel"><div class="panel-head"><div><span class="panel-title">设备明细</span></div><div class="table-tools"><button class="link-btn">显示列</button><button class="btn device-export" disabled>导出所选</button></div></div><div class="table-wrap"><div class="table-scroll"><table class="data-table" data-device-table>${tableMarkup(deviceColumns, rows, 'data-device-table')}</table></div><div class="pager"><span>共${rows.length}条</span>${paginationMarkup(rows.length)}</div></div></section>`;
    applyDeviceColumns(activeDeviceColumns);
    initializeDeviceSelection(content);
    initializeDeviceTableSorting(content);
    content.querySelectorAll('.control').forEach(makeControlInteractive);
    content.querySelectorAll('[data-mouth]').forEach(seg => { seg.tabIndex = 0; seg.onclick = () => setMouth(seg.dataset.mouth); });
    initializeDeviceTrendControls(content);
    initializeProjectComparison();
    content.querySelector('[data-chart-device-config]')?.addEventListener('click', openChartDeviceConfig);
    content.querySelector('[data-quality-page-edit]')?.addEventListener('click', openQualityPageEditor);
  }

  function renderDeviceQuality() {
    renderDeviceOverview();
    normalizeChartScaling(document.querySelector('.quality-content') || document);
    normalizePagers(document.querySelector('.quality-content') || document);
  }

  function initializeDeviceQualityPage() {
    if (document.body.dataset.page !== 'device-quality') return;
    const main = document.querySelector('main');
    main.innerHTML = `<div class="quality-content"></div>`;
    renderDeviceQuality();
  }

  function setMouth(mouth) {
    currentMouth = mouth;
    if (document.body.dataset.page === 'device-quality') renderDeviceQuality(); else renderProjectSummary(mouth);
    const label = document.body.dataset.mouthPage === 'project' && mouth === 'original' ? '机器判定' : mouthLabel(mouth);
    toast(`统计口径已切换为${label}，页面数据已同步更新`, 'info');
  }

  function modalForAction(action, source) {
    if (/新增用户|编辑用户/.test(action)) {
      const editing = action.includes('编辑');
      openModal(editing ? '编辑用户' : '新增用户', `<div class="proto-field"><label>用户名</label><input value="${editing ? 'zhangsan' : ''}" placeholder="请输入用户名"></div><div class="proto-field"><label>姓名</label><input value="${editing ? '张三' : ''}" placeholder="请输入姓名"></div><div class="proto-field"><label>手机号</label><input value="${editing ? '13620861742' : ''}" placeholder="请输入手机号"></div><div class="proto-field"><label>邮箱</label><input value="${editing ? 'zhangsan@factory.com' : ''}" placeholder="请输入邮箱"></div><div class="proto-field"><label>所属角色</label><select><option>质量工程师</option><option>生产主管</option><option>只读用户</option><option>平台管理员</option></select></div>`, editing ? '保存修改' : '创建用户', () => toast(editing ? '用户信息已更新' : '用户已创建'));
      return;
    }
    if (/分配角色/.test(action)) {
      openModal('分配角色', `<div class="proto-field"><label>用户</label><input value="zhangsan · 张三" disabled></div><div class="proto-checks"><label class="proto-check"><input type="checkbox" checked>质量工程师</label><label class="proto-check"><input type="checkbox">生产主管</label><label class="proto-check"><input type="checkbox">只读用户</label><label class="proto-check"><input type="checkbox">平台管理员</label></div>`, '保存角色', () => toast('用户角色已更新'));
      return;
    }
    if (/新增角色|编辑角色/.test(action)) {
      const editing = action.includes('编辑');
      openModal(editing ? '编辑角色' : '新增角色', `<div class="proto-field"><label>角色名称</label><input value="${editing ? '质量工程师' : ''}" placeholder="请输入角色名称"></div><div class="proto-field"><label>角色编码</label><input value="${editing ? 'QUALITY_ENGINEER' : ''}" placeholder="请输入角色编码"></div><div class="proto-field"><label>角色说明</label><input value="${editing ? '负责 AOI 质量分析与统计查询' : ''}" placeholder="请输入角色说明"></div>`, editing ? '保存修改' : '创建角色', () => toast(editing ? '角色信息已更新' : '角色已创建'));
      return;
    }
    if (/菜单权限/.test(action)) {
      openModal('菜单权限', `<div class="proto-checks"><label class="proto-check"><input type="checkbox" checked>项目统计</label><label class="proto-check"><input type="checkbox" checked>设备分析</label><label class="proto-check"><input type="checkbox" checked>单板查询</label><label class="proto-check"><input type="checkbox" checked>缺陷分析</label><label class="proto-check"><input type="checkbox" checked>误报分析</label><label class="proto-check"><input type="checkbox">平台管理</label></div>`, '保存权限', () => toast('菜单权限已更新'));
      return;
    }
    if (/数据权限/.test(action)) {
      openModal('数据权限', `<div class="proto-field"><label>权限范围</label><select><option>指定区域和设备</option><option>全部区域、全部设备</option><option>仅本人创建的数据</option></select></div><div class="proto-checks"><label class="proto-check"><input type="checkbox" checked>区域A</label><label class="proto-check"><input type="checkbox" checked>区域B</label><label class="proto-check"><input type="checkbox">区域C</label><label class="proto-check"><input type="checkbox">区域D</label></div>`, '保存权限', () => toast('数据权限已更新'));
      return;
    }
    if (/修改账号信息/.test(action)) {
      openModal('修改账号信息', `<div class="proto-field"><label>姓名</label><input value="系统管理员"></div><div class="proto-field"><label>手机号</label><input value="13866286628"></div><div class="proto-field"><label>邮箱</label><input value="admin@aoi-spc.com"></div>`, '保存修改', () => toast('账号信息已更新'));
      return;
    }
    if (/新增设备/.test(action)) {
      openModal('新增设备', `<div class="proto-field"><label>设备SN</label><input value="SI1020E1301"></div><div class="proto-field"><label>设备名称</label><input value="AOI-05"></div><div class="proto-field"><label>所属区域</label><select><option>区域A</option><option>区域B</option><option>区域C</option><option>区域D</option></select></div>`, '新增设备', () => toast('设备 AOI-05 已加入设备列表'));
      return;
    }
    if (/分配|编辑/.test(action)) {
      openModal(action.includes('分配') ? '分配设备区域' : '编辑设备', `<div class="proto-field"><label>设备</label><input value="待命名设备 · SI1020E1288" disabled></div><div class="proto-field"><label>设备名称</label><input value="AOI-05"></div><div class="proto-field"><label>所属区域</label><select><option>区域A</option><option>区域B</option><option>区域C</option><option>区域D</option></select></div><div style="font-size:12px;color:#718095;line-height:1.6">区域变更只影响生效后的新数据，历史数据仍保留原区域。</div>`, '保存分配', () => toast('设备区域已更新，历史数据归属保持不变'));
      return;
    }
    if (/管理区域/.test(action)) {
      openModal('管理区域', `<div class="proto-checks"><label class="proto-check"><input type="checkbox" checked>区域A</label><label class="proto-check"><input type="checkbox" checked>区域B</label><label class="proto-check"><input type="checkbox" checked>区域C</label><label class="proto-check"><input type="checkbox" checked>区域D</label></div>`, '保存区域', () => toast('区域设置已保存'));
      return;
    }
    if (/显示列/.test(action)) {
      if (document.body.dataset.page === 'board-query') return;
      if (document.querySelector('[data-project-table],[data-device-table]')) openProjectColumnManager();
      else openGenericColumnManager(source);
      return;
    }
    if (/自定义列/.test(action)) {
      openModal('自定义显示列', `<div class="proto-checks"><label class="proto-check"><input type="checkbox" checked>设备</label><label class="proto-check"><input type="checkbox" checked>项目</label><label class="proto-check"><input type="checkbox" checked>检测时间</label><label class="proto-check"><input type="checkbox" checked>判定结果</label><label class="proto-check"><input type="checkbox">复判人员</label><label class="proto-check"><input type="checkbox">图片状态</label></div>`, '应用列设置', () => toast('显示列已更新'));
    }
  }

  function confirmAction(title, message, onConfirm) {
    openModal(title, `<p style="margin:0;color:#475569;line-height:1.7">${message}</p>`, '确认', onConfirm);
  }

  window.SPCPrototype = Object.assign(window.SPCPrototype || {}, {
    openModal,
    confirmAction,
    toast,
    bindDeviceOrganizationSelector
  });

  function updateRegionSummary(backdrop) {
    const rows = Array.from(backdrop.querySelectorAll('[data-region-row]'));
    const linkedDevices = rows.reduce((total, row) => total + Number(row.dataset.deviceCount || 0), 0);
    const regionTotal = backdrop.querySelector('[data-region-total]');
    const deviceTotal = backdrop.querySelector('[data-region-device-total]');
    if (regionTotal) regionTotal.textContent = rows.length;
    if (deviceTotal) deviceTotal.textContent = `${linkedDevices} 台`;
  }

  function regionRow(name, deviceCount) {
    const count = Number(deviceCount || 0);
    return `<div class="proto-region-row" data-region-row data-device-count="${count}"><input value="${name}" data-region aria-label="区域名称"><span class="proto-region-count"><b>${count}</b> 台</span><span class="proto-region-operation"><button class="proto-region-delete" type="button" data-region-delete${count > 0 ? ' disabled' : ''}>删除</button></span></div>`;
  }

  function openRegionManager() {
    const deviceCounts = new Map();
    document.querySelectorAll('.records tbody tr:not(.proto-empty)').forEach(row => {
      const region = getText(row.cells[3]);
      if (region) deviceCounts.set(region, (deviceCounts.get(region) || 0) + 1);
    });
    const regions = ['区域A', '区域B', '区域C', '区域D'];
    const rows = regions.map(name => regionRow(name, deviceCounts.get(name) || 0)).join('');
    const backdrop = openModal('区域管理', `<div class="proto-region-summary"><div class="proto-region-metric">区域总数<b data-region-total>${regions.length}</b></div><div class="proto-region-metric">已关联设备<b data-region-device-total>${Array.from(deviceCounts.values()).reduce((sum, count) => sum + count, 0)} 台</b></div></div><div class="proto-region-table"><div class="proto-region-head"><span>区域名称</span><span>关联设备</span><span class="proto-region-operation">操作</span></div><div class="proto-region-list">${rows}</div></div><button class="proto-secondary proto-region-add" type="button" data-add-region>＋ 新增区域</button><p class="proto-region-hint">仅关联设备为 0 台的区域可以删除。</p>`, '保存', modal => {
      const inputs = Array.from(modal.querySelectorAll('[data-region]'));
      const names = inputs.map(input => input.value.trim());
      if (!names.length) { toast('请至少保留一个区域', 'error'); return false; }
      if (names.some(name => !name)) { toast('区域名称不能为空', 'error'); return false; }
      if (new Set(names).size !== names.length) { toast('区域名称不能重复', 'error'); return false; }
      toast('区域设置已保存');
    });
    backdrop.querySelector('.proto-modal').classList.add('proto-region-modal');
    return backdrop;
  }

  function updatePermissionTree(backdrop) {
    let selectedTotal = 0;
    backdrop.querySelectorAll('[data-permission-group]').forEach(group => {
      const parent = group.querySelector('[data-permission-parent]');
      const children = Array.from(group.querySelectorAll('[data-permission-leaf]'));
      const selected = children.filter(child => child.checked).length;
      parent.checked = selected === children.length;
      parent.indeterminate = selected > 0 && selected < children.length;
      const count = group.querySelector('[data-permission-count]');
      if (count) count.textContent = `${selected}/${children.length}`;
      selectedTotal += selected;
    });
    const selectedLabel = backdrop.querySelector('[data-permission-selected]');
    if (selectedLabel) selectedLabel.textContent = selectedTotal;
    const selectAll = backdrop.querySelector('[data-permission-select-all]');
    const leaves = Array.from(backdrop.querySelectorAll('[data-permission-leaf]'));
    if (selectAll) selectAll.textContent = leaves.every(leaf => leaf.checked) ? '取消全选' : '全选';
    return selectedTotal;
  }

  function openMenuPermissionTree() {
    const groups = menuPermissionTree.map(menu => `<section class="proto-permission-group" data-permission-group data-menu-id="${menu.id}"><div class="proto-permission-root"><button type="button" class="proto-permission-toggle" data-permission-toggle aria-label="展开或收起${menu.name}"></button><input type="checkbox" data-permission-parent aria-label="${menu.name}"${menu.selected ? ' checked' : ''}><span class="proto-permission-root-name">${menu.name}</span><span class="proto-permission-count" data-permission-count>${menu.selected ? menu.features.length : 0}/${menu.features.length}</span></div><div class="proto-permission-children">${menu.features.map((feature, index) => `<label class="proto-permission-leaf"><input type="checkbox" data-permission-leaf value="${menu.id}:${index}"${menu.selected ? ' checked' : ''}><span>${feature}</span></label>`).join('')}</div></section>`).join('');
    const initialSelected = menuPermissionTree.filter(menu => menu.selected).reduce((total, menu) => total + menu.features.length, 0);
    const backdrop = openModal('菜单权限', `<div class="proto-permission-toolbar"><div class="proto-permission-summary">已选 <b data-permission-selected>${initialSelected}</b> 项功能权限</div><div class="proto-permission-tools"><button type="button" data-permission-select-all>全选</button><button type="button" data-permission-expand-all>全部展开</button><button type="button" data-permission-collapse-all>全部收起</button></div></div><div class="proto-permission-tree">${groups}</div>`, '保存权限', modal => {
      if (!modal.querySelector('[data-permission-leaf]:checked')) { toast('请至少选择一项功能权限', 'error'); return false; }
      toast('菜单权限已保存');
    });
    backdrop.querySelector('.proto-modal').classList.add('proto-permission-modal');
    backdrop.addEventListener('change', event => {
      const parent = event.target.closest('[data-permission-parent]');
      if (parent) {
        const group = parent.closest('[data-permission-group]');
        group.querySelectorAll('[data-permission-leaf]').forEach(child => { child.checked = parent.checked; });
        parent.indeterminate = false;
        updatePermissionTree(backdrop);
        return;
      }
      if (event.target.matches('[data-permission-leaf]')) updatePermissionTree(backdrop);
    });
    backdrop.addEventListener('click', event => {
      const toggle = event.target.closest('[data-permission-toggle]');
      if (toggle) { toggle.closest('[data-permission-group]').classList.toggle('is-collapsed'); return; }
      if (event.target.closest('[data-permission-expand-all]')) { backdrop.querySelectorAll('[data-permission-group]').forEach(group => group.classList.remove('is-collapsed')); return; }
      if (event.target.closest('[data-permission-collapse-all]')) { backdrop.querySelectorAll('[data-permission-group]').forEach(group => group.classList.add('is-collapsed')); return; }
      if (event.target.closest('[data-permission-select-all]')) {
        const leaves = Array.from(backdrop.querySelectorAll('[data-permission-leaf]'));
        const checked = !leaves.every(leaf => leaf.checked);
        leaves.forEach(leaf => { leaf.checked = checked; });
        updatePermissionTree(backdrop);
      }
    });
    updatePermissionTree(backdrop);
    return backdrop;
  }

  function isValidDeviceIp(value) {
    const parts = value.trim().split('.');
    return parts.length === 4 && parts.every(part => /^\d{1,3}$/.test(part) && Number(part) >= 0 && Number(part) <= 255 && String(Number(part)) === part);
  }

  function deviceAlreadyExists(ip) {
    return Array.from(document.querySelectorAll('.records tbody tr')).some(row => {
      const cells = Array.from(row.querySelectorAll('td')).filter(cell => !cell.classList.contains('sequence-cell'));
      return cells.length > 2 && getText(cells[2]) === ip;
    });
  }

  function mockDeviceForIp(ip) {
    const known = {
      '192.168.10.25': { sn: 'SI1020E1301', name: 'AOI-05' },
      '192.168.10.26': { sn: 'SI1020E1302', name: 'AOI-06' }
    };
    if (known[ip]) return known[ip];
    const parts = ip.split('.').map(Number);
    const seed = parts.reduce((total, part, index) => total + part * (index + 3), 0);
    return { sn: `SI1020E${String(1300 + seed % 700).padStart(4, '0')}`, name: `AOI-${String(5 + seed % 95).padStart(2, '0')}` };
  }

  function validateRequiredDeviceFields(modal) {
    const requiredFields = Array.from(modal.querySelectorAll('[data-device-required]'));
    requiredFields.forEach(field => {
      field.classList.remove('is-invalid');
      field.closest('.proto-field')?.querySelector('[data-device-org-trigger]')?.classList.remove('is-invalid');
    });
    const firstEmpty = requiredFields.find(field => !String(field.value || '').trim());
    if (!firstEmpty) return true;
    firstEmpty.classList.add('is-invalid');
    if (firstEmpty.type === 'hidden') firstEmpty.closest('.proto-field')?.querySelector('[data-device-org-trigger]')?.classList.add('is-invalid');
    const label = firstEmpty.closest('.proto-field')?.querySelector('label')?.textContent.replace('*', '').trim() || '必填字段';
    toast(`请填写${label}`, 'error');
    (firstEmpty.type === 'hidden' ? firstEmpty.closest('.proto-field')?.querySelector('[data-device-org-trigger]') : firstEmpty)?.focus();
    return false;
  }

  function bindDeviceOrganizationSelector(backdrop, allowedIds) {
    const input = backdrop.querySelector('[data-device-org-node]');
    const trigger = backdrop.querySelector('[data-device-org-trigger]');
    const tree = backdrop.querySelector('[data-device-org-tree]');
    if (!input || !trigger || !tree) return () => {};
    const allowed = allowedIds ? new Set(allowedIds) : null;
    const options = (typeof window.getSPCDeviceOrganizationOptions === 'function' ? window.getSPCDeviceOrganizationOptions() : []).filter(item => !allowed || allowed.has(item.id));
    const byId = new Map(options.map(item => [item.id, item]));
    const label = trigger.querySelector('span');
    const setSelection = id => {
      const item = byId.get(id);
      input.value = item ? item.id : '';
      label.textContent = item ? item.path : '请选择设备所在位置';
      trigger.title = item ? item.path : '';
      trigger.classList.toggle('is-placeholder', !item);
      tree.querySelectorAll('[data-org-choice]').forEach(choice => choice.classList.toggle('is-selected', choice.dataset.orgChoice === id));
      let ancestor = item && byId.get(item.parentId);
      while (ancestor) {
        const branch = Array.from(tree.querySelectorAll('[data-org-children-for]')).find(element => element.dataset.orgChildrenFor === ancestor.id);
        if (branch) { branch.hidden = false; branch.previousElementSibling?.querySelector('.proto-org-toggle')?.replaceChildren('▾'); }
        ancestor = byId.get(ancestor.parentId);
      }
    };
    const makeBranch = (item, depth) => {
      const wrapper = document.createElement('div');
      const row = document.createElement('div');
      row.className = 'proto-org-row';
      row.style.paddingLeft = `${depth * 16}px`;
      const descendants = options.filter(option => option.parentId === item.id);
      const toggle = document.createElement('button');
      toggle.type = 'button'; toggle.className = 'proto-org-toggle';
      toggle.textContent = depth > 0 ? '▸' : '▾'; toggle.disabled = !descendants.length;
      const choice = document.createElement('button');
      choice.type = 'button'; choice.className = 'proto-org-choice';
      choice.dataset.orgChoice = item.id; choice.textContent = item.name;
      row.append(toggle, choice); wrapper.append(row);
      const children = document.createElement('div');
      children.dataset.orgChildrenFor = item.id;
      children.hidden = depth > 0;
      descendants.forEach(child => children.append(makeBranch(child, depth + 1)));
      wrapper.append(children);
      toggle.addEventListener('click', () => { children.hidden = !children.hidden; toggle.textContent = children.hidden ? '▸' : '▾'; });
      choice.addEventListener('click', () => { setSelection(item.id); tree.hidden = true; trigger.setAttribute('aria-expanded', 'false'); });
      return wrapper;
    };
    tree.replaceChildren(...options.filter(item => !item.parentId).map(item => makeBranch(item, 0)));
    trigger.addEventListener('click', () => {
      if (trigger.disabled) return;
      tree.hidden = !tree.hidden;
      trigger.setAttribute('aria-expanded', String(!tree.hidden));
    });
    backdrop.addEventListener('click', event => {
      if (!event.target.closest('.proto-org-picker')) { tree.hidden = true; trigger.setAttribute('aria-expanded', 'false'); }
    });
    setSelection('');
    return setSelection;
  }

  function openAddDeviceModal() {
    const backdrop = openModal('新增设备', `<div class="proto-field"><label>设备IP<em class="proto-required">*</em></label><div class="proto-device-identify-row"><input data-device-ip data-device-required inputmode="decimal" autocomplete="off" placeholder="例如：192.168.10.25"><button type="button" class="proto-device-identify-button" data-identify-device>识别设备</button></div><p class="proto-device-status" data-device-status>填写设备 IP 后识别设备信息</p></div><div class="proto-device-divider"></div><div class="proto-field"><label>设备SN<em class="proto-required">*</em></label><input data-device-sn data-device-required readonly placeholder="识别后自动获取" aria-readonly="true"></div><div class="proto-field"><label>设备名称<em class="proto-required">*</em></label><input data-device-name data-device-required readonly placeholder="识别后自动获取" aria-readonly="true"></div><div class="proto-field"><label>设备所在位置<em class="proto-required">*</em></label><div class="proto-org-picker"><input type="hidden" data-device-org-node data-device-required><button class="proto-org-trigger is-placeholder" type="button" data-device-org-trigger data-device-config aria-expanded="false" disabled><span>请选择设备所在位置</span><span aria-hidden="true">⌄</span></button><div class="proto-org-tree" data-device-org-tree role="tree" hidden></div></div></div><div class="proto-field"><label>启用状态<em class="proto-required">*</em></label><select data-device-enabled data-device-config data-device-required disabled><option>启用</option><option>停用</option></select></div><div class="proto-field"><label>备注</label><textarea data-device-config disabled placeholder="请输入备注（选填）"></textarea></div>`, '新增设备', modal => {
      if (!validateRequiredDeviceFields(modal)) return false;
      const ip = modal.querySelector('[data-device-ip]').value.trim();
      if (modal.dataset.identifiedIp !== ip) { toast('请先识别当前设备 IP', 'error'); return false; }
      if (typeof window.addSPCDeviceToOrganization === 'function' && !window.addSPCDeviceToOrganization({ ip, sn: modal.querySelector('[data-device-sn]').value.trim(), name: modal.querySelector('[data-device-name]').value.trim(), nodeId: modal.querySelector('[data-device-org-node]').value, enabled: modal.querySelector('[data-device-enabled]').value === '启用' })) return false;
      toast('设备已新增');
    });
    backdrop.querySelector('.proto-modal').classList.add('proto-device-modal');
    bindDeviceOrganizationSelector(backdrop);
    const ipInput = backdrop.querySelector('[data-device-ip]');
    const identifyButton = backdrop.querySelector('[data-identify-device]');
    const status = backdrop.querySelector('[data-device-status]');
    const snInput = backdrop.querySelector('[data-device-sn]');
    const nameInput = backdrop.querySelector('[data-device-name]');
    const configFields = Array.from(backdrop.querySelectorAll('[data-device-config]'));
    const confirmButton = backdrop.querySelector('[data-confirm]');
    confirmButton.disabled = true;

    const resetIdentification = () => {
      delete backdrop.dataset.identifiedIp;
      snInput.value = '';
      nameInput.value = '';
      configFields.forEach(field => { field.disabled = true; });
      backdrop.querySelector('[data-device-org-tree]').hidden = true;
      confirmButton.disabled = true;
      status.className = 'proto-device-status';
      status.textContent = ipInput.value.trim() ? 'IP 已变更，请重新识别设备信息' : '填写设备 IP 后识别设备信息';
    };

    ipInput.addEventListener('input', resetIdentification);
    ipInput.addEventListener('keydown', event => {
      if (event.key === 'Enter') { event.preventDefault(); identifyButton.click(); }
    });
    identifyButton.addEventListener('click', () => {
      const ip = ipInput.value.trim();
      resetIdentification();
      if (!isValidDeviceIp(ip)) {
        status.classList.add('is-error');
        status.textContent = '请输入正确的 IPv4 地址，例如：192.168.10.25';
        toast('设备 IP 格式不正确', 'error');
        ipInput.focus();
        return;
      }
      if (deviceAlreadyExists(ip)) {
        status.classList.add('is-error');
        status.textContent = '该 IP 对应的设备已存在，无需重复新增';
        toast('该设备已存在', 'error');
        return;
      }
      identifyButton.disabled = true;
      identifyButton.innerHTML = '<span class="proto-spinner"></span>识别中';
      status.classList.add('is-loading');
      status.textContent = '正在连接设备并获取基础信息…';
      setTimeout(() => {
        if (!backdrop.isConnected) return;
        const currentIp = ipInput.value.trim();
        identifyButton.disabled = false;
        identifyButton.textContent = '重新识别';
        if (currentIp !== ip) return resetIdentification();
        const device = mockDeviceForIp(ip);
        snInput.value = device.sn;
        nameInput.value = device.name;
        backdrop.dataset.identifiedIp = ip;
        configFields.forEach(field => { field.disabled = false; });
        confirmButton.disabled = false;
        status.className = 'proto-device-status is-success';
        status.textContent = '设备识别成功，请选择设备所在位置并设置启用状态';
        configFields[0].focus();
      }, 650);
    });
    return backdrop;
  }

  function handleManagementAction(action, target) {
    const deviceModal = () => {
      const row = target.closest('tr');
      const cells = Array.from(row?.cells || []).filter(cell => !cell.classList.contains('sequence-cell'));
      const backdrop = openModal('编辑设备', `<div class="proto-field"><label>设备IP<em class="proto-required">*</em></label><input data-edit-device-ip data-device-required placeholder="例如：192.168.10.21"></div><div class="proto-field"><label>设备SN<em class="proto-required">*</em></label><input data-edit-device-sn data-device-required readonly aria-readonly="true"></div><div class="proto-field"><label>设备名称<em class="proto-required">*</em></label><input data-edit-device-name data-device-required readonly aria-readonly="true"></div><div class="proto-field"><label>设备所在位置<em class="proto-required">*</em></label><div class="proto-org-picker"><input type="hidden" data-device-org-node data-device-required><button class="proto-org-trigger is-placeholder" type="button" data-device-org-trigger aria-expanded="false"><span>请选择设备所在位置</span><span aria-hidden="true">⌄</span></button><div class="proto-org-tree" data-device-org-tree role="tree" hidden></div></div></div><div class="proto-field"><label>启用状态<em class="proto-required">*</em></label><select data-edit-device-enabled data-device-required><option>启用</option><option>停用</option></select></div><div class="proto-field"><label>备注</label><textarea placeholder="请输入备注（选填）"></textarea></div>`, '保存修改', modal => {
        if (!validateRequiredDeviceFields(modal)) return false;
        if (typeof window.moveSPCDeviceToOrganization === 'function' && !window.moveSPCDeviceToOrganization(row, modal.querySelector('[data-device-org-node]').value)) return false;
        const ip = modal.querySelector('[data-edit-device-ip]').value.trim();
        if (cells[2]) { cells[2].textContent = ip; cells[2].title = ip; }
        toast('设备信息已保存');
      });
      const setOrganization = bindDeviceOrganizationSelector(backdrop);
      backdrop.querySelector('[data-edit-device-ip]').value = getText(cells[2]);
      backdrop.querySelector('[data-edit-device-sn]').value = getText(cells[1]);
      backdrop.querySelector('[data-edit-device-name]').value = getText(cells[0]);
      setOrganization(row?.dataset.orgLeaf || '');
      backdrop.querySelector('[data-edit-device-enabled]').value = row?.querySelector('[data-device-status]')?.dataset.deviceStatus === 'disabled' ? '停用' : '启用';
      return backdrop;
    };
    const userModal = editing => openModal(editing ? '编辑用户' : '新增用户', `<div class="proto-field"><label>用户名称</label><input value="${editing ? 'zhangsan' : ''}" placeholder="请输入用户名称"></div><div class="proto-field"><label>角色名称</label><select><option>质量工程师</option><option>生产主管</option><option>只读用户</option><option>平台管理员</option></select></div>${editing ? '' : '<div class="proto-field"><label>初始密码</label><input type="password" placeholder="请输入初始密码"></div>'}<div class="proto-field"><label>状态</label><select><option>启用</option><option>停用</option></select></div>`, editing ? '保存修改' : '新增用户', () => toast(editing ? '用户信息已保存' : '用户已新增'));
    const roleModal = editing => openModal(editing ? '编辑角色' : '新增角色', `<div class="proto-field"><label>角色名称</label><input value="${editing ? '质量工程师' : ''}" placeholder="请输入角色名称"></div><div class="proto-field"><label>角色说明</label><input value="${editing ? '负责质量数据分析和导出' : ''}" placeholder="请输入角色说明"></div><div class="proto-field"><label>状态</label><select><option>启用</option><option>停用</option></select></div>`, editing ? '保存修改' : '新增角色', () => toast(editing ? '角色信息已保存' : '角色已新增'));
    if (action === 'open-local-spc') {
      return openLocalSpc();
    }
    if (action === 'add-device') return openAddDeviceModal();
    if (action === 'edit-device') return deviceModal();
    if (action === 'toggle-device') {
      const disabled = target.dataset.deviceStatus === 'disabled';
      const row = target.closest('tr');
      const setObservedState = (selector, text, className) => {
        const cell = row && row.querySelector(selector);
        if (!cell) return;
        cell.textContent = text;
        cell.className = `runtime-status${className ? ` ${className}` : ''}`;
      };
      if (!disabled) return confirmAction('确认停用设备', '停用后平台将不再接收该设备上传的数据，是否继续？', () => {
        target.dataset.deviceStatus = 'disabled';
        target.textContent = '停用';
        target.classList.add('off');
        setObservedState('[data-device-connection-status]', '未连接', '');
        setObservedState('[data-device-transmission-status]', '未监控', 'is-unmonitored');
        const del = row && row.querySelector('[data-proto-action="delete-device"]');
        if (del) del.disabled = false;
        toast('设备已停用');
      });
      target.dataset.deviceStatus = 'enabled';
      target.textContent = '启用';
      target.classList.remove('off');
      setObservedState('[data-device-connection-status]', '未知', '');
      setObservedState('[data-device-transmission-status]', '未知', '');
      const del = row && row.querySelector('[data-proto-action="delete-device"]');
      if (del) del.disabled = true;
      return toast('设备已启用，等待状态更新');
    }
    if (action === 'delete-device') return confirmAction('删除设备', '删除后不可恢复，是否删除当前设备？', () => { target.closest('tr').remove(); toast('设备已删除'); });
    if (action === 'manage-regions') return openRegionManager();
    if (action === 'add-user') return userModal(false);
    if (action === 'edit-user') return userModal(true);
    if (action === 'toggle-user') {
      const disabled = target.dataset.userStatus === 'disabled';
      if (!disabled) return confirmAction('确认停用账号', '停用后该账号将无法登录平台，是否继续？', () => { target.dataset.userStatus = 'disabled'; target.textContent = '停用'; target.classList.add('off'); const del = target.closest('tr').querySelector('[data-proto-action="delete-user"]'); if (del) del.disabled = false; toast('账号已停用'); });
      target.dataset.userStatus = 'enabled'; target.textContent = '启用'; target.classList.remove('off'); const del = target.closest('tr').querySelector('[data-proto-action="delete-user"]'); if (del) del.disabled = true; return toast('账号已启用');
    }
    if (action === 'delete-user') return confirmAction('删除用户', '删除后不可恢复，是否删除当前用户？', () => { target.closest('tr').remove(); toast('用户已删除'); });
    if (action === 'add-role') return roleModal(false);
    if (action === 'edit-role') return roleModal(true);
    if (action === 'toggle-role') {
      const disabled = target.dataset.roleStatus === 'disabled';
      if (!disabled) return confirmAction('确认停用角色', '停用后，使用该角色的账号将不能继续使用该角色权限，是否继续？', () => { target.dataset.roleStatus = 'disabled'; target.textContent = '停用'; target.classList.add('off'); const del = target.closest('tr').querySelector('[data-proto-action="delete-role"]'); if (del) del.disabled = false; toast('角色已停用'); });
      target.dataset.roleStatus = 'enabled'; target.textContent = '启用'; target.classList.remove('off'); const del = target.closest('tr').querySelector('[data-proto-action="delete-role"]'); if (del) del.disabled = true; return toast('角色已启用');
    }
    if (action === 'delete-role') return confirmAction('删除角色', '删除后不可恢复，是否删除当前角色？', () => { target.closest('tr').remove(); toast('角色已删除'); });
    if (action === 'menu-permissions') return openMenuPermissionTree();
  }

  function enhanceBoardQueryTable() {
    if (document.body.dataset.page !== 'board-query') return;
    const table = document.querySelector('.records .table');
    if (!table || table.dataset.enhanced) return;
    table.dataset.enhanced = 'true';
    table.classList.add('board-query-table');
    table.querySelectorAll('th,td').forEach(cell => { const value = getText(cell); if (value) cell.title = value; });
    Array.from(table.tHead.rows[0].cells).forEach((header, index) => {
      if (index < 2) return;
      const grip = document.createElement('span');
      grip.className = 'proto-column-resizer';
      grip.title = '拖动调整列宽';
      grip.addEventListener('pointerdown', event => {
        event.preventDefault();
        const startX = event.clientX;
        const startWidth = header.getBoundingClientRect().width;
        const cells = Array.from(table.rows).map(row => row.cells[index]).filter(Boolean);
        grip.classList.add('dragging');
        const move = moveEvent => { const width = Math.max(90, startWidth + moveEvent.clientX - startX); cells.forEach(cell => { cell.style.width = `${width}px`; cell.style.minWidth = `${width}px`; cell.style.maxWidth = `${width}px`; }); };
        const up = () => { grip.classList.remove('dragging'); document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', up); };
        document.addEventListener('pointermove', move); document.addEventListener('pointerup', up);
      });
      header.appendChild(grip);
    });
  }

  function makeControlInteractive(control) {
    const field = control.closest('.field');
    const label = getText(field && field.querySelector('label'));
    if (control.dataset.customHistory === 'true') return;
    control.setAttribute('role', 'button');
    control.tabIndex = 0;
    control.dataset.label = label;
    if (label === '时间范围') {
      const openTimeRange = () => {
        closePopover();
        const rect = control.getBoundingClientRect();
        const pop = document.createElement('div');
        pop.className = 'proto-popover proto-time-popover';
        pop.style.left = `${Math.max(12, Math.min(rect.left, window.innerWidth - 532))}px`;
        pop.style.top = `${Math.min(rect.bottom + 5, window.innerHeight - 190)}px`;
        const start = control.dataset.start || '2026-08-01T00:00';
        const end = control.dataset.end || '2026-08-04T14:32';
        pop.innerHTML = `<div class="proto-time-grid"><label>开始时间<input class="proto-time-start" type="datetime-local" step="60" value="${start}"></label><label>结束时间<input class="proto-time-end" type="datetime-local" step="60" value="${end}"></label></div><div class="proto-popover-foot"><button type="button" data-time-cancel>取消</button><button type="button" class="primary" data-time-apply>确定</button></div>`;
        pop.querySelector('[data-time-cancel]').onclick = event => { event.stopPropagation(); closePopover(); };
        pop.querySelector('[data-time-apply]').onclick = event => {
          event.stopPropagation();
          const nextStart = pop.querySelector('.proto-time-start').value;
          const nextEnd = pop.querySelector('.proto-time-end').value;
          if (!nextStart || !nextEnd || nextStart > nextEnd) { toast('请选择有效的开始和结束时间', 'error'); return; }
          control.dataset.start = nextStart;
          control.dataset.end = nextEnd;
          const format = value => value.replace('T', ' ');
          control.innerHTML = `<span aria-hidden="true">▣</span><span>${format(nextStart)}</span><span class="placeholder">至</span><span>${format(nextEnd)}</span>`;
          closePopover();
          toast('时间范围已更新，精确到分钟', 'info');
        };
        document.body.appendChild(pop);
        currentPopover = pop;
      };
      control.addEventListener('click', event => { event.stopPropagation(); openTimeRange(); });
      control.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openTimeRange(); } });
      return;
    }
    if (field.classList.contains('multi-select') && choices[label]) {
      const openMulti = () => {
        closePopover();
        const rect = control.getBoundingClientRect();
        const pop = document.createElement('div');
        pop.className = 'proto-popover proto-multi-popover';
        pop.style.left = `${Math.min(rect.left, window.innerWidth - 276)}px`;
        pop.style.top = `${Math.min(rect.bottom + 5, window.innerHeight - 290)}px`;
        pop.style.width = `${Math.max(200, rect.width)}px`;
        let selected = [];
        try { selected = JSON.parse(control.dataset.selectedValues || '[]'); } catch (_) { selected = []; }
        const selectedSet = new Set(selected);
        choices[label].slice(1).forEach(value => {
          const option = document.createElement('button');
          option.className = 'proto-option proto-multi-option';
          option.textContent = value;
          option.setAttribute('aria-selected', selectedSet.has(value) ? 'true' : 'false');
          option.onclick = event => {
            event.stopPropagation();
            if (selectedSet.has(value)) selectedSet.delete(value); else selectedSet.add(value);
            option.setAttribute('aria-selected', selectedSet.has(value) ? 'true' : 'false');
          };
          pop.appendChild(option);
        });
        const foot = document.createElement('div');
        foot.className = 'proto-popover-foot';
        foot.innerHTML = '<button type="button" data-multi-clear>清空</button><button type="button" class="primary" data-multi-apply>确定</button>';
        foot.querySelector('[data-multi-clear]').onclick = event => { event.stopPropagation(); selectedSet.clear(); pop.querySelectorAll('.proto-multi-option').forEach(option => option.setAttribute('aria-selected', 'false')); };
        foot.querySelector('[data-multi-apply]').onclick = event => {
          event.stopPropagation();
          const values = Array.from(selectedSet);
          control.dataset.selectedValues = JSON.stringify(values);
          control.dataset.selected = values.join(',');
          const target = valueSpan(control);
          if (target) target.textContent = values.length ? (values.length === 1 ? values[0] : `已选 ${values.length} 项`) : choices[label][0];
          closePopover();
          toast(`${label}已选择 ${values.length || '全部'} 项`, 'info');
        };
        pop.appendChild(foot);
        document.body.appendChild(pop);
        currentPopover = pop;
      };
      control.addEventListener('click', event => { event.stopPropagation(); openMulti(); });
      control.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openMulti(); } });
      return;
    }
    const searchable = /PCB SN|条码|复判员|用户名|姓名|角色名称|角色编码/.test(label) || label === '模板名称' || (label === '设备名称' && (!field.classList.contains('device') || field.classList.contains('device-search')));
    if (searchable) {
      const openHistory = input => {
        const historyMap = {
          '模板名称': ['3267504J2G_A面', '1-A', '329134S_P129', '155042F_P9', 'A14-POWER'],
          '设备名称': ['AOI-01', 'AOI-02', 'AOI-03', 'AOI-04', 'AOI-05'],
          '条码号': ['SY-A01-DEMO-02', 'SY-B02-SMT-1669', 'SY-C03-143873', 'SY-D04-155042F-01', 'SY-A03-SMT-4698'],
          '一次复判员': ['J20678 · 张三', 'J20542 · 王芳', 'J20911 · 陈杰', 'J20816 · 李明', 'J20436 · 刘敏']
        };
        const values = historyMap[label];
        if (!values) return;
        closePopover();
        const rect = control.getBoundingClientRect();
        const pop = document.createElement('div');
        pop.className = 'proto-popover proto-history-popover';
        pop.style.left = `${Math.min(rect.left, window.innerWidth - 276)}px`;
        pop.style.top = `${Math.min(rect.bottom + 5, window.innerHeight - 290)}px`;
        pop.style.width = `${Math.max(220, rect.width)}px`;
        pop.innerHTML = '<div class="proto-history-title">最近搜索</div>';
        const query = normalize(input.value);
        values.filter(value => !query || normalize(value).includes(query)).slice(0, 5).forEach(value => {
          const option = document.createElement('button');
          option.className = 'proto-option proto-history-option';
          option.textContent = value;
          option.onclick = event => {
            event.stopPropagation();
            input.value = value;
            control.dataset.selected = value;
            closePopover();
            input.focus();
            if (label === '模板名称') toast(`已按模板名称 ${value} 查询`, 'info');
            if (label === '设备名称') toast(`已选择历史设备 ${value}`, 'info');
          };
          pop.appendChild(option);
        });
        document.body.appendChild(pop);
        currentPopover = pop;
      };
      if (label === '模板名称') {
        control.innerHTML = '<span aria-hidden="true">⌕</span><input class="proto-search" aria-label="模板名称" placeholder="输入模板名称">';
      }
      const bindHistoryInput = input => {
        if (!input || input.dataset.historyBound) return;
        input.dataset.historyBound = 'true';
        input.addEventListener('input', event => { event.stopPropagation(); openHistory(input); });
        input.addEventListener('focus', () => openHistory(input));
      };
      bindHistoryInput(control.querySelector('input'));
      control.addEventListener('click', event => {
        event.stopPropagation();
        const existingInput = control.querySelector('input');
        if (existingInput) { bindHistoryInput(existingInput); openHistory(existingInput); return; }
        const placeholderMap = { '模板名称': '输入模板名称', '设备名称': '输入设备名称', '条码号': '输入条码号', '复判员': '输入工号或姓名', '一次复判员': '输入工号或姓名', '用户名': '输入用户名', '姓名': '输入姓名', '角色名称': '输入角色名称', '角色编码': '输入角色编码' };
        const placeholder = placeholderMap[label] || (label.includes('设备') ? '输入设备名称或设备SN' : '输入完整或部分PCB标识');
        control.innerHTML = `<span aria-hidden="true">⌕</span><input class="proto-search" aria-label="${label}" placeholder="${placeholder}">`;
        const input = control.querySelector('input');
        bindHistoryInput(input);
        input.focus();
        openHistory(input);
      });
      return;
    }
    if (!choices[label]) return;
    const open = () => {
      closePopover();
      const rect = control.getBoundingClientRect();
      const pop = document.createElement('div');
      pop.className = 'proto-popover';
      pop.style.left = `${Math.min(rect.left, window.innerWidth - 276)}px`;
      pop.style.top = `${Math.min(rect.bottom + 5, window.innerHeight - 290)}px`;
      pop.style.width = `${Math.max(180, rect.width)}px`;
      const current = getText(valueSpan(control));
      choices[label].forEach(value => {
        const option = document.createElement('button');
        option.className = 'proto-option';
        option.textContent = value;
        option.setAttribute('aria-selected', normalize(current).includes(normalize(value)) ? 'true' : 'false');
        option.onclick = event => {
          event.stopPropagation();
          const target = valueSpan(control);
          if (target) target.textContent = value;
          control.dataset.selected = value;
          closePopover();
          toast(`${label}已选择：${value}`, 'info');
        };
        pop.appendChild(option);
      });
      document.body.appendChild(pop);
      currentPopover = pop;
    };
    control.addEventListener('click', event => { event.stopPropagation(); open(); });
    control.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); } });
  }

  function filterRows() {
    const table = document.querySelector('table');
    if (!table || !table.tBodies.length) return 0;
    const rows = Array.from(table.tBodies[0].rows).filter(row => !row.classList.contains('proto-empty'));
    const filters = [];
    let deviceNameFilter = '';
    let deviceSnFilter = '';
    let dateRange = null;
    document.querySelectorAll('.field').forEach(field => {
      const label = getText(field.querySelector('label'));
      const control = field.querySelector('.control');
      if (label === '时间范围' && control && control.dataset.start && control.dataset.end) {
        dateRange = [control.dataset.start.replace('T', ' '), control.dataset.end.replace('T', ' ')];
        return;
      }
      if (!/设备|项目|PCB|条码|工单|复判员|检测结果|复判工作站|复判人员|复判结果|上传状态|所属区域|设备状态|启用状态|连接状态|传输状态|记录类型|处理结果/.test(label)) return;
      const input = field.querySelector('input');
      if (control && control.dataset.selectedValues) {
        let values = [];
        try { values = JSON.parse(control.dataset.selectedValues); } catch (_) { values = []; }
        if (values.length) filters.push(values.map(normalize));
        return;
      }
      const value = input ? input.value.trim() : (control && (control.dataset.selected || getText(valueSpan(control))));
      if (!value || /全部|输入/.test(value)) return;
      if (label === '设备名称' && field.classList.contains('device-search')) {
        deviceNameFilter = normalize(value);
        return;
      }
      if (label === '设备名称/SN' && field.classList.contains('device-search')) {
        deviceNameFilter = normalize(value);
        deviceSnFilter = normalize(value);
        return;
      }
      if (label === '设备SN' && field.classList.contains('device-search')) {
        deviceSnFilter = normalize(value);
        return;
      }
      filters.push(normalize(value));
    });
    const deviceNameColumnIndex = Array.from(table.tHead?.rows[0]?.cells || []).findIndex(cell => getText(cell) === '设备名称');
    const deviceSnColumnIndex = Array.from(table.tHead?.rows[0]?.cells || []).findIndex(cell => getText(cell) === '设备SN');
    let visible = 0;
    rows.forEach(row => {
      const content = normalize(row.textContent);
      const detectedAt = (row.textContent.match(/\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}/) || [])[0];
      const matchesDate = !dateRange || (!!detectedAt && detectedAt >= dateRange[0] && detectedAt <= dateRange[1]);
      const combinedDeviceFilter = deviceNameFilter && deviceNameFilter === deviceSnFilter;
      const matchesDeviceName = !deviceNameFilter || (deviceNameColumnIndex >= 0 && normalize(row.cells[deviceNameColumnIndex]?.textContent).includes(deviceNameFilter));
      const matchesDeviceSn = !deviceSnFilter || (deviceSnColumnIndex >= 0 && normalize(row.cells[deviceSnColumnIndex]?.textContent).includes(deviceSnFilter));
      const match = matchesDate && (combinedDeviceFilter ? (matchesDeviceName || matchesDeviceSn) : (matchesDeviceName && matchesDeviceSn)) && filters.every(value => Array.isArray(value) ? value.some(item => content.includes(item)) : content.includes(value));
      row.style.display = match ? '' : 'none';
      if (match) visible += 1;
    });
    const oldEmpty = table.tBodies[0].querySelector('.proto-empty');
    if (oldEmpty) oldEmpty.remove();
    if (!visible) {
      const empty = table.tBodies[0].insertRow();
      empty.className = 'proto-empty';
      const cell = empty.insertCell();
      cell.colSpan = table.tHead ? table.tHead.rows[0].cells.length : 8;
      cell.innerHTML = '没有符合当前筛选条件的数据<br><small>请调整设备、项目或结果条件后重新查询</small>';
    }
    const pagerSummary = table.closest('.records,.table-panel')?.querySelector('.pager > span:first-child');
    if (pagerSummary) pagerSummary.textContent = `共 ${visible} 条`;
    return visible;
  }

  function runQuery(button) {
    resetSelectableExports();
    const original = button.innerHTML;
    button.classList.add('proto-loading');
    button.innerHTML = `<span class="proto-spinner"></span>${/分析/.test(button.textContent) ? '分析中' : '查询中'}`;
    setTimeout(() => {
      const count = filterRows();
      button.classList.remove('proto-loading');
      button.innerHTML = original;
      toast(count ? `查询完成，当前列表显示 ${count} 条演示数据` : '当前条件下暂无数据', count ? 'success' : 'info');
    }, 520);
  }

  function exportTable(button) {
    const table = button.closest('.table-panel,.records,.detail-panel,.component-panel')?.querySelector('table') || document.querySelector('table');
    if (!table) { toast('当前页面没有可导出的明细', 'info'); return; }
    const selectionExport = button.matches('.device-export,.select-export');
    const selectedRows = Array.from(table.querySelectorAll('tbody tr')).filter(row => getComputedStyle(row).display !== 'none' && row.querySelector('.device-row-check:checked,.select-row-check:checked'));
    if (selectionExport && !selectedRows.length) { toast('请先选择需要导出的记录', 'info'); return; }
    const rows = selectionExport ? [table.tHead.rows[0], ...selectedRows] : Array.from(table.rows).filter(row => getComputedStyle(row).display !== 'none');
    const csv = rows.map(row => Array.from(row.cells).filter(cell => !cell.classList.contains('device-select-cell') && !cell.classList.contains('select-cell') && getComputedStyle(cell).display !== 'none').map(cell => `"${cell.innerText.replace(/"/g, '""').trim()}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const action = getText(button);
    link.download = `${document.title}-${action || '导出'}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    toast(`${action || '导出'}任务已生成，可在个人中心查看`);
  }

  function handleTabs(tab) {
    const group = tab.parentElement;
    group.querySelectorAll('.tab').forEach(item => item.classList.remove('on'));
    tab.classList.add('on');
    const label = getText(tab).replace(/（.*?）/g, '');
    const dimension = document.querySelector('.field.dimension .control span:not(.chev)');
    if (dimension) dimension.textContent = label;
    toast(`已切换至${label}分析`, 'info');
  }

  function initializeNavigation() {
    document.querySelectorAll('.nav-item,.item').forEach(item => {
      const label = Object.keys(pageMap).find(key => getText(item).includes(key));
      if (!label) return;
      item.tabIndex = 0;
      item.setAttribute('role', 'link');
      const navigate = () => { window.location.href = pageMap[label]; };
      item.onclick = navigate;
      item.onkeydown = event => { if (event.key === 'Enter') navigate(); };
    });
  }

  function ensureQualityNavigation() {
    const nav = document.querySelector('.nav');
    const navItems = nav ? Array.from(nav.querySelectorAll('.nav-item,.item')) : [];
    if (!nav || navItems.some(item => getText(item).includes('设备分析'))) return;
    const projectItem = navItems.find(item => getText(item).includes('项目统计'));
    if (!projectItem) return;
    const item = document.createElement('div');
    const isCompactItem = projectItem.classList.contains('item');
    item.className = `${isCompactItem ? 'item' : 'nav-item'}${document.body.dataset.page === 'device-quality' ? ' active' : ''}`;
    item.innerHTML = `<span class="${isCompactItem ? 'ico' : 'nav-icon'}">◈</span>设备分析`;
    projectItem.insertAdjacentElement('afterend', item);
    if (document.body.dataset.page === 'device-quality') projectItem.classList.remove('active');
  }

  function normalizeDeviceAnalysisNavigation() {
    document.querySelectorAll('.nav .nav-item,.nav .item').forEach(item => {
      if (getText(item).includes('设备质量分析')) item.innerHTML = item.innerHTML.replace('设备质量分析', '设备分析');
    });
  }

  function normalizeSharedNavigation() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    Array.from(nav.querySelectorAll('.nav-item,.item')).forEach(item => {
      const text = getText(item);
      if (text.includes('不良导出')) item.innerHTML = item.innerHTML.replace('不良导出', '不良分析');
      if (text.includes('数据上传监控')) item.innerHTML = item.innerHTML.replace('数据上传监控', '设备运行监控');
    });
  }

  function ensureRuntimeMonitorNavigation() {
    const nav = document.querySelector('.nav');
    const navItems = nav ? Array.from(nav.querySelectorAll('.nav-item,.item')) : [];
    if (!nav) return;
    const existing = navItems.find(item => getText(item).includes('设备运行监控'));
    if (existing) {
      existing.classList.toggle('active', document.body.dataset.page === 'device-runtime-monitor');
      return;
    }
    const deviceItem = navItems.find(item => getText(item).includes('设备管理'));
    if (!deviceItem) return;
    const item = document.createElement('a');
    item.className = deviceItem.className;
    item.classList.remove('active');
    if (document.body.dataset.page === 'device-runtime-monitor') item.classList.add('active');
    item.href = '07-数据上传监控.html';
    item.style.textDecoration = 'none';
    const deviceIcon = deviceItem.querySelector('.ico,.nav-icon');
    const iconClass = deviceIcon ? deviceIcon.className : 'ico nav-icon';
    item.innerHTML = `<span class="${iconClass}">▧</span>设备运行监控`;
    deviceItem.insertAdjacentElement('beforebegin', item);
  }

  function ensureDefectAnalysisNavigation() {
    const nav = document.querySelector('.nav');
    const navItems = nav ? Array.from(nav.querySelectorAll('.nav-item,.item')) : [];
    if (!nav || navItems.some(item => getText(item).includes('不良分析'))) return;
    const falseAlarmItem = navItems.find(item => getText(item).includes('误报分析'));
    if (!falseAlarmItem) return;
    const item = document.createElement('div');
    const isCompactItem = falseAlarmItem.classList.contains('item');
    item.className = `${isCompactItem ? 'item' : 'nav-item'}${document.body.dataset.page === 'defect-analysis-machine' ? ' active' : ''}`;
    item.innerHTML = `<span class="${isCompactItem ? 'ico' : 'nav-icon'}">⇩</span>不良分析`;
    falseAlarmItem.insertAdjacentElement('afterend', item);
    if (document.body.dataset.page === 'defect-analysis-machine') falseAlarmItem.classList.remove('active');
  }

  function normalizeRequestedNavigation() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    const labels = ['项目统计','设备分析','缺陷分析','误报分析','告警分析','单板查询','设备运行监控','设备管理','告警管理','用户管理','角色管理'];
    const routes = {'项目统计':'01-项目统计首页.html','设备分析':'09-设备质量分析.html','缺陷分析':'03-缺陷分析.html','误报分析':'04-误报分析.html','告警分析':'13-品质预警.html','单板查询':'02-单板查询与结果追溯.html','设备运行监控':'07-数据上传监控.html','设备管理':'08-设备与区域管理.html','告警管理':'14-告警管理.html','用户管理':'10-用户管理.html','角色管理':'11-角色管理.html'};
    const items = Array.from(nav.children).filter(item => item.matches('.nav-item,.item'));
    const groups = Array.from(nav.children).filter(item => item.classList.contains('group'));
    const find = label => items.find(item => label === '项目统计' ? /项目统计|项目统计|项目统计/.test(getText(item)) : getText(item).includes(label));
    const makeGroup = (name, fallback) => groups.find(item => getText(item).includes(name)) || Object.assign(document.createElement('div'), {className:'group nav-label', textContent:fallback});
    const dataGroup = makeGroup('数据管理', '数据管理');
    const systemGroup = makeGroup('系统管理', '系统管理');
    const ordered = labels.map(label => {
      let item = find(label);
      if (!item) {
        item = document.createElement('a');
        item.className = items.find(candidate => candidate.matches('a'))?.className || 'item nav-item';
        item.classList.remove('active');
        const iconClass = nav.querySelector('.ico,.nav-icon')?.className || 'ico nav-icon';
        item.innerHTML = `<span class="${iconClass}">${label === '设备运行监控' ? '▧' : '◉'}</span>${label}`;
      }
      if (label === '项目统计') item.innerHTML = item.innerHTML.replace(/项目统计|项目统计/, '项目统计');
      if (label === '设备运行监控') item.classList.toggle('active', document.body.dataset.page === 'device-runtime-monitor');
      item.href = routes[label];
      return item;
    });
    nav.replaceChildren(...ordered.slice(0,5), dataGroup, ...ordered.slice(5,9), systemGroup, ...ordered.slice(9));
  }
  function openTopMenu(button, items) {
    closePopover();
    const rect = button.getBoundingClientRect();
    const pop = document.createElement('div');
    pop.className = 'proto-popover proto-top-popover';
    pop.style.width = '156px';
    pop.style.left = `${Math.min(rect.right - 156, window.innerWidth - 172)}px`;
    pop.style.top = `${rect.bottom + 6}px`;
    items.forEach(item => {
      const option = document.createElement('button');
      option.className = 'proto-option proto-top-option';
      option.innerHTML = `${item.icon || ''}<span>${item.label}</span>`;
      option.setAttribute('aria-selected', item.selected ? 'true' : 'false');
      option.onclick = event => {
        event.stopPropagation();
        item.action();
        closePopover();
      };
      pop.appendChild(option);
    });
    document.body.appendChild(pop);
    currentPopover = pop;
  }

  function normalizeTopActions() {
    const buttons = document.querySelectorAll('.top-actions .icon-btn,.top-actions .iconbtn');
    if (buttons[0]) {
      buttons[0].classList.add('proto-top-icon', 'proto-language-btn');
      buttons[0].setAttribute('aria-label', '选择语言');
      buttons[0].innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18M12 3c2.5 2.6 3.7 5.6 3.7 9S14.5 18.4 12 21M12 3C9.5 5.6 8.3 8.6 8.3 12S9.5 18.4 12 21"></path></svg>';
    }
    if (buttons[1]) {
      buttons[1].classList.add('proto-top-icon', 'proto-theme-btn');
      buttons[1].setAttribute('aria-label', '页面外观');
      buttons[1].innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path></svg>';
    }
  }

  function removeTitleExplanations() {
    document.querySelectorAll('.top .title > span').forEach(item => item.remove());
  }

  function removeVisibleProjectUuidColumns() {
    document.querySelectorAll('table').forEach(table => {
      const headers = Array.from(table.querySelectorAll('thead th'));
      const columnIndex = headers.findIndex(header => header.hasAttribute('data-internal-project-id') || /项目\s*UUID/i.test(getText(header)));
      if (columnIndex < 0) return;
      table.querySelectorAll('tr').forEach(row => row.children[columnIndex]?.remove());
      table.querySelectorAll('colgroup col')[columnIndex]?.remove();
    });
  }

  function openLanguageMenu(button) {
    const languageIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"></circle><path d="M4 12h16"></path></svg>';
    openTopMenu(button, [
      { label: '中文', icon: languageIcon, selected: currentLanguage === 'zh', action: () => { currentLanguage = 'zh'; document.documentElement.lang = 'zh-CN'; toast('界面语言已切换为中文', 'info'); } },
      { label: 'English', icon: languageIcon, selected: currentLanguage === 'en', action: () => { currentLanguage = 'en'; document.documentElement.lang = 'en'; toast('Language preference switched to English', 'info'); } }
    ]);
  }

  function openThemeMenu(button) {
    const lightIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 3v2M12 19v2M3 12h2M19 12h2"></path></svg>';
    const darkIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 15.3A8 8 0 0 1 8.7 4a8 8 0 1 0 11.3 11.3Z"></path></svg>';
    openTopMenu(button, [
      { label: '浅色模式', icon: lightIcon, selected: currentTheme === 'light', action: () => { currentTheme = 'light'; document.body.classList.remove('proto-dark'); toast('已切换为浅色模式', 'info'); } },
      { label: '深色模式', icon: darkIcon, selected: currentTheme === 'dark', action: () => { currentTheme = 'dark'; document.body.classList.add('proto-dark'); toast('已切换为深色模式', 'info'); } }
    ]);
  }

  function initializePage() {
    removeVisibleProjectUuidColumns();
    enhanceBoardQueryTable();
    normalizeDeviceAnalysisNavigation();
    normalizeSharedNavigation();
    ensureRuntimeMonitorNavigation();
    ensureQualityNavigation();
    ensureDefectAnalysisNavigation();
    normalizeRequestedNavigation();
    initializeDeviceQualityPage();
    if (document.body.dataset.mouthPage === 'project') { currentMouth = 'original'; renderProjectSummary(currentMouth); initializeProjectTrend(); initializeProjectComparison(); initializeProjectCellTooltips(); }
    removeTitleExplanations();
    normalizeTopActions();
    initializeAccountMenu();
    ensureGlobalDataTimestamp();
    normalizeTimeFields();
    normalizeDropdownIcons();
    normalizeChartScaling();
    normalizePagers();
    enhanceSelectableExports();
    initializeNavigation();
    document.querySelectorAll('.control').forEach(makeControlInteractive);
    document.querySelectorAll('.seg').forEach(seg => {
      seg.tabIndex = 0;
      seg.onclick = () => {
        const selectedClass = seg.parentElement.querySelector('.seg.active') ? 'active' : 'on';
        seg.parentElement.querySelectorAll('.seg').forEach(item => item.classList.remove('on', 'active'));
        seg.classList.add(selectedClass);
        if (document.body.dataset.mouthPage) setMouth(seg.dataset.mouth || (getText(seg).includes('算法') || getText(seg).includes('原始') ? 'original' : getText(seg).includes('二次') ? 'second' : 'review'));
        else toast(`统计口径已切换为${getText(seg)}`, 'info');
      };
    });
    document.querySelectorAll('.tab').forEach(tab => { tab.tabIndex = 0; tab.onclick = () => handleTabs(tab); });
    initializeAlertRuleInteractions();
    document.querySelectorAll('.page').forEach(page => {
      page.tabIndex = 0;
      page.onclick = () => {
        if (/‹|›|…/.test(getText(page))) return;
        resetSelectableExports();
        const selectedClass = page.parentElement.querySelector('.page.active') ? 'active' : 'on';
        page.parentElement.querySelectorAll('.page').forEach(item => item.classList.remove('on', 'active'));
        page.classList.add(selectedClass);
        toast(`已切换到第 ${getText(page)} 页`, 'info');
      };
    });

    document.addEventListener('click', event => {
      if (!event.target.closest('.proto-popover')) closePopover();
      const regionDelete = event.target.closest('[data-region-delete]');
      if (regionDelete) {
        const row = regionDelete.closest('[data-region-row]');
        if (row && Number(row.dataset.deviceCount || 0) === 0) {
          const backdrop = row.closest('.proto-backdrop');
          row.remove();
          if (backdrop) updateRegionSummary(backdrop);
          toast('区域已移除，保存后生效', 'info');
        }
        return;
      }
      const addRegion = event.target.closest('[data-add-region]');
      if (addRegion) {
        const backdrop = addRegion.closest('.proto-backdrop');
        const list = backdrop && backdrop.querySelector('.proto-region-list');
        if (list) {
          const existingNames = Array.from(backdrop.querySelectorAll('[data-region]')).map(input => input.value.trim());
          let index = 1;
          let name = '新区域';
          while (existingNames.includes(name)) name = `新区域${++index}`;
          list.insertAdjacentHTML('beforeend', regionRow(name, 0));
          updateRegionSummary(backdrop);
          const inputs = list.querySelectorAll('[data-region]');
          const input = inputs[inputs.length - 1];
          if (input) { input.focus(); input.select(); }
        }
        return;
      }
      const target = event.target.closest('button,a');
      if (!target || target.closest('.proto-modal')) return;
      if (target.dataset && target.dataset.protoAction) {
        event.preventDefault();
        handleManagementAction(target.dataset.protoAction, target);
        return;
      }
      const text = getText(target);
      if (target.matches('[data-page-number]')) { event.preventDefault(); resetSelectableExports(); target.parentElement.querySelectorAll('[data-page-number]').forEach(item => item.classList.remove('on')); target.classList.add('on'); toast(`已切换到第 ${target.dataset.pageNumber} 页`, 'info'); return; }
      if (target.matches('.project-link')) { event.preventDefault(); window.location.href = `01A-项目明细.html?project=${encodeURIComponent(target.dataset.projectUuid)}&name=${encodeURIComponent(getText(target))}`; return; }
      if (target.matches('.device-link')) {
        event.preventDefault();
        const deviceName = target.dataset.deviceName || getText(target);
        if (document.body.dataset.page === 'device-quality') { openLocalSpc(); return; }
        window.location.href = `01-项目统计首页.html?device=${encodeURIComponent(deviceName)}`;
        return;
      }
      if (target.matches('.proto-language-btn')) { event.preventDefault(); openLanguageMenu(target); return; }
      if (target.matches('.proto-theme-btn')) { event.preventDefault(); openThemeMenu(target); return; }
      if (/^查询$|^分析$/.test(text)) { event.preventDefault(); runQuery(target); return; }
      if (/^重置$/.test(text)) { event.preventDefault(); window.location.reload(); return; }
      if (/^(数据导出|导出报表|导出图|导出明细|导出设备明细|导出监控记录|导出该页报表|导出所选)/.test(text)) { event.preventDefault(); exportTable(target); return; }
      if (/刷新状态/.test(text)) { event.preventDefault(); toast('设备上传状态已刷新'); document.querySelectorAll('tbody tr').forEach(row => row.classList.add('proto-row-flash')); return; }
      if (/自定义列|显示列|新增设备|立即分配|^分配$|^编辑$|管理区域|新增用户|编辑用户|分配角色|新增角色|菜单权限|数据权限|修改账号信息/.test(text)) { event.preventDefault(); modalForAction(text, target); return; }
      if (/^(启用|停用)$/.test(text)) { event.preventDefault(); toast(`账号状态已${text}`); return; }
      if (/刷新任务/.test(text)) { event.preventDefault(); toast('导出任务状态已刷新'); return; }
      if (/补传/.test(text)) {
        event.preventDefault();
        openModal('补传设备数据', '<p style="margin-top:0;color:#475569">将重新上传区域B · AOI-02队列中的246条数据。重复结果会自动跳过，不会重复统计。</p>', '开始补传', () => {
          toast('补传任务已开始，共 246 条数据');
          const row = target.closest('tr');
          if (row) row.classList.add('proto-row-flash');
        });
        return;
      }
      if (/诊断/.test(text)) { event.preventDefault(); openModal('设备连接诊断', '<div style="line-height:1.9;color:#475569">设备：区域D · AOI-04<br>最后连接：2026-08-04 12:58:16<br>诊断结果：设备端上传服务无响应<br>建议操作：检查设备网络和本地上传服务。</div>', '重新检测', () => toast('已发起重新检测', 'info')); return; }
      if (/查看计算说明/.test(text)) { event.preventDefault(); openModal('过程能力计算说明', '<div style="line-height:1.8;color:#475569">Cp、Cpk只对具备连续测量值、单位及规格上下限的检测项计算。控制界限根据当前查询样本动态计算，仅用于分析，不作为正式报警依据。</div>', '知道了'); return; }
      if (/查看图片/.test(text)) { event.preventDefault(); const row = target.closest('tr'); if (row) { row.parentElement.querySelectorAll('tr').forEach(item => item.classList.remove('on')); row.classList.add('on'); } toast('已切换右侧器件图像', 'info'); return; }
      if (/查看原图/.test(text)) { event.preventDefault(); openModal('器件原图', '<div style="height:320px;border-radius:6px;background:linear-gradient(135deg,#d8d2b9,#bdb59b 52%,#7c745f);display:grid;place-items:center;color:#fff"><strong style="padding:8px 12px;background:rgba(16,27,45,.78);border-radius:4px">D2 · RGB 原图</strong></div>', '关闭图片'); return; }
      if (/查看明细|查看PCB|^详情$/.test(text) && target.getAttribute('href') === '#') { event.preventDefault(); window.location.href = '02B-单板记录详情.html'; return; }
      if (/查看全部|查看人员工作量|告警记录|任务明细|历史|记录/.test(text) && (!target.getAttribute('href') || target.getAttribute('href') === '#')) { event.preventDefault(); toast(`${text}已展开为演示状态`, 'info'); }
    });
    document.addEventListener('change', event => {
      if (event.target.matches('.proto-page-size')) toast(`分页数量已调整为${event.target.value}`, 'info');
    });
    document.addEventListener('mouseover', event => {
      const target = event.target.closest('.device-project-value');
      if (target && !target.contains(event.relatedTarget)) showDeviceProjectTooltip(target);
    });
    document.addEventListener('mouseout', event => {
      const target = event.target.closest('.device-project-value');
      if (target && !target.contains(event.relatedTarget)) closeDeviceProjectTooltip();
    });
    document.addEventListener('focusin', event => {
      const target = event.target.closest('.device-project-value');
      if (target) showDeviceProjectTooltip(target);
    });
    document.addEventListener('focusout', event => {
      if (event.target.closest('.device-project-value')) closeDeviceProjectTooltip();
    });
    document.addEventListener('keydown', event => {
      if (event.target.matches('.proto-page-jump input') && event.key === 'Enter') {
        const pageNumber = Math.max(1, parseInt(event.target.value, 10) || 1);
        event.target.value = pageNumber;
        toast(`已跳转到第 ${pageNumber} 页`, 'info');
      }
    });
    document.querySelectorAll('.factory').forEach(factory => {
      factory.tabIndex = 0;
      factory.style.cursor = 'pointer';
      factory.onclick = () => toast('当前厂房：珠海厂房', 'info');
    });
  }

  function initializeAlertRuleInteractions() {
    document.querySelectorAll('[data-alert-action]').forEach(button => {
      button.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        const row = button.closest('.alert-rule-row');
        if (!row) return;
        const action = button.dataset.alertAction;
        if (action === 'toggle') {
          const enabled = row.dataset.ruleStatus === 'enabled';
          row.dataset.ruleStatus = enabled ? 'disabled' : 'enabled';
          button.classList.toggle('on', !enabled);
          button.setAttribute('aria-label', enabled ? '停用规则' : '启用规则');
          const state = row.querySelector('.state');
          if (state) { state.textContent = enabled ? '停用' : '启用'; state.classList.toggle('off', enabled); }
          toast(enabled ? '规则已停用' : '规则已启用', 'info');
          return;
        }
        if (row.dataset.ruleStatus === 'enabled') {
          toast('请先停用规则，再执行编辑或删除操作', 'info');
          return;
        }
        const ruleName = getText(row.querySelector('.rule-name'));
        const detailLink = row.querySelector('a[href*="13A-告警规则详情.html"]');
        const ruleId = detailLink ? new URL(detailLink.href, window.location.href).searchParams.get('rule') : '';
        if (action === 'edit') {
          window.location.href = `13B-新增告警规则.html?mode=edit&rule=${encodeURIComponent(ruleId || '')}`;
          return;
        }
        openModal('删除告警规则', `<p style="margin:0;color:#475569">确认删除告警规则“${ruleName}”吗？</p>`, '删除', () => {
          row.remove();
          toast('告警规则已删除', 'info');
        });
      });
    });
    document.querySelectorAll('[data-alert-save]').forEach(button => {
      button.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        toast('告警规则已保存', 'info');
      });
    });
  }

  function initializeListSequences() {
    const tableSelectors = {
      'device-management': '.records .table',
      'alert-management': '.table-panel .tbl',
      'user-management': '.records .table',
      'role-management': '.records .table'
    };
    const selector = tableSelectors[document.body.dataset.page];
    const table = selector ? document.querySelector(selector) : null;
    if (!table) return;

    const headerRow = table.querySelector('thead tr');
    if (headerRow && !headerRow.querySelector('.sequence-cell')) {
      const header = document.createElement('th');
      header.className = 'sequence-cell';
      header.textContent = '序号';
      headerRow.prepend(header);
    }

    const tbody = table.tBodies[0];
    if (!tbody) return;
    function renderSequence() {
      let sequence = 0;
      Array.from(tbody.rows).forEach(row => {
        let cell = row.querySelector(':scope > .sequence-cell');
        if (!cell) {
          cell = document.createElement('td');
          cell.className = 'sequence-cell';
          row.prepend(cell);
        }
        const visible = row.style.display !== 'none';
        cell.textContent = visible ? String(++sequence) : '';
      });
    }
    renderSequence();
    new MutationObserver(renderSequence).observe(tbody, {
      childList: true,
      attributes: true,
      attributeFilter: ['style']
    });
  }

  initializeListSequences();
  initializePage();
})();


