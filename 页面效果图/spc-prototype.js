(function () {
  'use strict';

  const pageMap = {
    '订单统计': '01-项目统计首页.html',
    '设备分析': '09-设备质量分析.html',
    '单板查询': '02-单板查询与结果追溯.html',
    '缺陷分析': '03-缺陷分析.html',
    '误报分析': '04-误报分析.html',
    '不良分析': '04A-不良导出.html',
    '二次复判统计': '06-二次复判统计.html',
    '品质预警': '13-品质预警.html',
    '告警规则详情': '13-品质预警.html',
    '设备管理': '08-设备与区域管理.html',
    '用户管理': '10-用户管理.html',
    '角色管理': '11-角色管理.html',
    '个人中心': '12-个人中心.html'
  };

  const choices = {
    '时间范围': ['最近 24 小时', '最近 7 天', '最近 30 天', '自定义时间范围'],
    '监控时间': ['最近 1 小时', '最近 24 小时', '最近 7 天'],
    '二次复判时间': ['今天', '最近 7 天', '最近 30 天', '自定义时间范围'],
    '设备': ['全部设备（12）', '区域A · AOI-01', '区域B · AOI-02', '区域C · AOI-03', '区域D · AOI-04'],
    '设备名称': ['全部设备（12）', 'AOI-01', 'AOI-02', 'AOI-03', 'AOI-04'],
    '设备SN': ['全部设备SN', 'SI1020E1112', 'SI1020E1148', 'SI1020E1186', 'SI1020E1206'],
    '检测结果': ['全部', '良好', '不良', '直通', '误报', '漏报'],
    '项目名称': ['全部项目', '3267504J2G_A面', '1-A', '329134S_P129', '155042F_P9'],
    '项目 / 程序': ['3267504J2G_A面', '1-A', '329134S_P129'],
    '分析维度': ['不良类型', '封装类型', '料号', '位号'],
    '位号': ['R118', 'D2', 'C56', '全部位号'],
    '检测项': ['X偏移（mm）', 'Y偏移（mm）', '角度（°）'],
    '控制图': ['I-MR', 'Xbar-R'],
    '复判工作站': ['全部工作站（4）', '复判站-01', '复判站-02', '复判站-03', '复判站-04'],
    '复判人员': ['全部人员', 'J20816 · 李明', 'J20542 · 王芳', 'J20911 · 陈杰'],
    '复判结果': ['全部结果', 'OK', 'NG'],
    '上传状态': ['全部状态', '正常', '延迟', '中断'],
    '数据类型': ['全部类型', 'MES JSON', '项目文件', 'NG图片'],
    '所属区域': ['全部区域', '区域A', '区域B', '区域C', '区域D', '未分配'],
    '设备状态': ['全部状态', '启用', '停用'],
    '状态': ['全部', '启用', '停用']
  };

  const menuPermissionTree = [
    { id: 'project-statistics', name: '订单统计', selected: true, features: ['查看与查询', '显示列', '导出所选', '查看订单明细'] },
    { id: 'device-quality', name: '设备分析', selected: true, features: ['查看与查询', '显示列', '导出所选', '查看设备明细', '查看本机 SPC'] },
    { id: 'board-query', name: '单板查询', selected: true, features: ['查看与查询', '导出所选'] },
    { id: 'defect-analysis', name: '缺陷分析', selected: true, features: ['查看与查询', '自定义列', '导出所选'] },
    { id: 'false-positive', name: '误报分析', features: ['查看与查询', '自定义列', '导出所选', '查看设备明细'] },
    { id: 'defect-analysis', name: '不良分析', features: ['查看与查询', '自定义列', '导出所选', '查看不良明细'] },
    { id: 'second-review', name: '二次复判统计', features: ['查看与查询', '自定义列', '导出所选', '查看人员工作量'] },
    { id: 'quality-alert', name: '品质预警', features: ['查看与查询', '新增规则', '编辑规则', '查看报警记录'] },
    { id: 'device-management', name: '设备管理', features: ['查看与查询', '新增设备', '区域管理', '查看本机 SPC', '编辑设备', '启停设备', '删除设备'] },
    { id: 'user-management', name: '用户管理', features: ['查看与查询', '新增用户', '编辑用户', '启停用户', '删除用户'] },
    { id: 'role-management', name: '角色管理', features: ['查看与查询', '新增角色', '编辑角色', '菜单权限', '启停角色', '删除角色'] },
    { id: 'personal-center', name: '个人中心', features: ['查看页面', '修改密码', '基本设置', '导出任务管理'] }
  ];

  const style = document.createElement('style');
  style.textContent = `
    :root{--proto-ease:cubic-bezier(.25,1,.5,1)}
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
    .proto-toast-stack{position:fixed;z-index:110;right:22px;top:78px;display:flex;flex-direction:column;gap:8px}.proto-toast{min-width:280px;max-width:420px;background:#fff;border:1px solid #dbe3ed;border-radius:7px;box-shadow:0 8px 18px rgba(16,42,76,.14);padding:11px 14px;display:flex;align-items:center;gap:9px;color:#334155;animation:proto-slide 220ms var(--proto-ease)}.proto-toast:before{content:'✓';width:20px;height:20px;border-radius:50%;display:grid;place-items:center;background:#eaf8f1;color:#168150;font-weight:700}.proto-toast.info:before{content:'i';background:#edf4ff;color:#2468e8}.proto-toast.error:before{content:'!';background:#fff0f0;color:#c43d3d}.mouth-context{display:inline-flex;align-items:center;height:24px;padding:0 9px;border-radius:4px;background:#edf4ff;color:#245fbf;font-weight:650}.quality-tabs{height:46px;display:flex;align-items:flex-end;gap:24px;border-bottom:1px solid #dce3ec;background:#fff;padding:0 18px;border-radius:8px 8px 0 0}.quality-tab{height:46px;border:0;border-bottom:2px solid transparent;background:transparent;color:#64748b;font-weight:600;padding:0 2px;cursor:pointer}.quality-tab.on{color:#2468e8;border-bottom-color:#3478f6}.quality-content{flex:1;min-height:0;display:flex;flex-direction:column;gap:14px}.quality-metrics{height:94px;background:#fff;border:1px solid #dce3ec;border-radius:8px;display:grid;grid-template-columns:repeat(6,minmax(0,1fr))}.quality-metric{padding:14px 16px;min-width:0}.quality-metric+.quality-metric{border-left:1px solid #e7ebf0}.quality-metric .metric-value{font-size:23px}.quality-grid{display:grid;grid-template-columns:minmax(0,1.45fr) minmax(0,1fr);gap:14px;height:250px}.quality-chart{min-width:0;background:#fff;border:1px solid #dce3ec;border-radius:8px;overflow:hidden}.quality-chart-body{height:calc(100% - 50px);min-width:0;padding:12px 16px;overflow:hidden}.quality-chart-body svg{display:block;width:100%;height:100%;max-width:100%;overflow:hidden}.quality-bars{display:flex;flex-direction:column;gap:13px;padding-top:3px}.quality-bar{display:grid;grid-template-columns:88px minmax(0,1fr) 54px;align-items:center;gap:10px;font-size:11px;color:#526176}.quality-bar-track{height:12px;border-radius:3px;background:#edf1f5;overflow:hidden}.quality-bar-fill{height:100%;background:#3478f6;border-radius:3px}.quality-guide{flex:1;display:grid;place-items:center;background:#fff;border:1px solid #dce3ec;border-radius:8px;text-align:center;color:#64748b;padding:32px}.quality-guide h3{margin:0 0 8px;color:#102a4c}.project-picks{display:flex;gap:8px;justify-content:center;margin-top:18px;flex-wrap:wrap}.project-pick{height:34px;padding:0 12px;border:1px solid #cfd8e4;border-radius:4px;background:#fff;color:#245fbf;cursor:pointer}.comparison-summary{display:flex;align-items:center;justify-content:space-between;background:#fff;border:1px solid #dce3ec;border-radius:8px;padding:12px 16px}.comparison-summary b{color:#102a4c}.device-link,.project-link{color:#245fbf;font-weight:650;cursor:pointer;text-decoration:none}.filters{flex-wrap:wrap!important;row-gap:12px!important}.filters>.field{flex:0 0 auto}.pager{gap:12px;overflow:hidden}.pager>:first-child{flex:0 1 auto;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.proto-pagination{display:flex;align-items:center;gap:4px;margin-left:auto;min-width:0;max-width:100%;flex:0 1 auto;color:#334155;white-space:nowrap}.proto-page-nav{width:30px;min-width:30px}.proto-page-number{width:auto;min-width:30px;padding:0 7px;font-variant-numeric:tabular-nums}.proto-page-nav,.proto-page-number{height:32px;border:1px solid transparent;border-radius:5px;background:#fff;color:#334155;display:grid;place-items:center;cursor:pointer}.proto-page-number.on{border-color:#3478f6;color:#2468e8;background:#edf4ff}.proto-page-nav:disabled{color:#a8b2c0;cursor:not-allowed}.proto-page-size{height:34px;min-width:96px;border:1px solid #cfd8e4;border-radius:5px;background:#fff;color:#334155;padding:0 28px 0 10px}.proto-page-jump{display:flex;align-items:center;gap:6px;white-space:nowrap}.proto-page-jump input{width:48px;height:34px;border:1px solid #cfd8e4;border-radius:5px;text-align:center;color:#334155}.proto-page-jump input:focus{outline:3px solid rgba(52,120,246,.2);border-color:#3478f6}body[data-page="device-quality"] .field.time{width:310px;flex:0 0 310px}body[data-page="device-quality"] .field.time .control{overflow:hidden;font-variant-numeric:tabular-nums}body[data-page="device-quality"] .field.time .control span{flex:0 0 auto}@media(max-width:1400px){.quality-metrics{grid-template-columns:repeat(3,1fr);height:154px}.quality-grid{height:220px}.filters:not(.board-filters){height:150px!important;flex-basis:150px!important;align-content:center!important}body[data-page="device-quality"] .field.time{width:285px;flex-basis:285px}body[data-page="device-quality"] .field.time .control{font-size:12px;padding:0 8px;gap:4px}body[data-page="device-quality"] .field.device{width:170px}body[data-page="device-quality"] .field.project{width:160px}}
    .proto-empty td{height:220px!important;text-align:center!important;color:#738196!important}.proto-empty td:before{content:'⌕';display:block;font-size:26px;color:#a0adbc;margin-bottom:8px}.proto-loading{opacity:.58;pointer-events:none}.proto-spinner{display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,.45);border-top-color:#fff;border-radius:50%;animation:proto-spin .7s linear infinite;margin-right:7px;vertical-align:-2px}.proto-tab-empty{height:100%;display:grid;place-items:center;color:#718095;text-align:center;padding:40px}.proto-tab-empty b{display:block;color:#334155;margin-bottom:7px}.proto-row-flash{animation:proto-flash 900ms var(--proto-ease)}
    .top-title h1,.title h1{margin:0!important;font-family:Inter,"Microsoft YaHei","PingFang SC",system-ui,sans-serif!important;font-size:22px!important;font-weight:700!important;line-height:1.3!important;color:#102a4c!important}.control{height:36px!important;padding:0 8px!important;font-family:Inter,"Microsoft YaHei","PingFang SC",system-ui,sans-serif!important;font-size:12px!important;font-weight:400!important;color:#334155!important;border-radius:4px!important}.btn{height:36px!important;padding:0 15px!important;font-family:Inter,"Microsoft YaHei","PingFang SC",system-ui,sans-serif!important;font-size:14px!important;font-weight:550!important;line-height:normal!important;border-radius:4px!important}.panel-title,.phead-title>b,.phead>b{font-family:Inter,"Microsoft YaHei","PingFang SC",system-ui,sans-serif!important;font-size:16px!important;font-weight:700!important;line-height:1.4!important;color:#102a4c!important}.data-table th,.table th,.dtable th{height:40px!important;padding:0 12px!important;font-size:12px!important;font-weight:650!important;color:#526176!important;border-bottom:1px solid #dce3ec!important;background:#f7f9fc!important}.data-table td,.table td,.dtable td{height:44px!important;padding:0 12px!important;font-family:Inter,"Microsoft YaHei","PingFang SC",system-ui,sans-serif!important;font-size:14px!important;line-height:normal!important;background-color:#fff}.data-table td:not(.project-name):not(.device-name),.table td:not(.pcb-id):not(.device-name),.dtable td{color:#334155}.pager{height:40px!important;min-height:40px!important;flex-basis:40px!important;padding:0 14px!important;font-size:12px!important}
    .charts>.panel{height:100%;min-height:0;overflow:hidden;display:flex;flex-direction:column}.charts>.panel>.panel-head{flex:0 0 auto}.charts>.panel>.chart-body{height:auto!important;flex:1;min-height:0;overflow:hidden}.charts>.panel>.chart-body>svg{display:block;width:100%;height:100%;max-width:100%;max-height:100%;overflow:hidden}
    .quality-bars{width:100%;height:100%;min-width:0;justify-content:center;overflow:hidden;padding-top:0}.quality-bar{width:100%;min-width:0;grid-template-columns:minmax(56px,88px) minmax(0,1fr) 54px}.quality-bar>span,.quality-bar>b{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.quality-bar>b{text-align:right}.quality-bar-track{width:100%;min-width:0}
    .proto-page-ellipsis{width:32px;height:32px;display:grid;place-items:center;color:#718095}.proto-time-field{width:310px!important;flex:0 0 310px!important;min-width:0!important}.proto-time-field .control{min-width:0!important;overflow:hidden!important;font-variant-numeric:tabular-nums;white-space:nowrap}.proto-time-field .control span{flex:0 0 auto}.chev{font-size:0!important;width:14px;height:14px;min-width:14px;margin-left:auto;position:relative;flex:0 0 14px}.chev:before{content:"";position:absolute;width:6px;height:6px;border-right:1.5px solid #718095;border-bottom:1.5px solid #718095;transform:rotate(45deg);top:2px;left:3px}.proto-history-title{padding:7px 10px 5px;color:#7a8798;font-size:11px}.proto-history-option{justify-content:flex-start}.proto-history-option:before{content:"";width:13px;height:13px;border:1.5px solid #8492a6;border-radius:50%;margin-right:8px}.proto-top-icon svg{width:18px;height:18px;display:block;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.proto-top-option{gap:9px}.proto-top-option svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.8}
    body[data-page="board-query"] .records .tablebox{overflow:auto!important;position:relative}.board-query-table{min-width:2850px!important;table-layout:fixed}.board-query-table th,.board-query-table td{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;position:relative}.board-query-table th:nth-child(1),.board-query-table td:nth-child(1){position:sticky;left:0;z-index:7;background:#fff}.board-query-table th:nth-child(2),.board-query-table td:nth-child(2){position:sticky;left:44px;z-index:7;background:#fff}.board-query-table th:nth-child(3),.board-query-table td:nth-child(3){position:sticky;left:104px;z-index:7;background:#fff;box-shadow:4px 0 8px rgba(32,54,82,.08)}.board-query-table th:nth-child(-n+3){background:#f7f9fc}.proto-column-resizer{position:absolute;right:-4px;top:0;width:8px;height:100%;cursor:col-resize;z-index:9}.proto-column-resizer:hover,.proto-column-resizer.dragging{background:rgba(52,120,246,.2)}.status-switch{height:28px;min-width:58px;padding:0 10px;border:1px solid #b9d7c6;border-radius:4px;background:#f2fbf6;color:#168150;cursor:pointer}.status-switch.off{border-color:#d7dee8;background:#f7f9fc;color:#718095}.op-link{border:0;background:transparent;color:#2468e8;padding:0 4px;cursor:pointer}.op-link.danger{color:#df4b4b}.op-link:disabled{color:#aab4c1;cursor:not-allowed}.proto-dark{background:#0f1724!important;color:#dbe5f2}.proto-dark .app,.proto-dark main,.proto-dark .main{background:#0f1724!important}.proto-dark .topbar,.proto-dark .top,.proto-dark .panel,.proto-dark .filters,.proto-dark .quality-tabs,.proto-dark .quality-metrics,.proto-dark .quality-chart,.proto-dark .comparison-summary,.proto-dark .summary,.proto-dark .records{background:#172235!important;border-color:#2c3b50!important}.proto-dark .top-title h1,.proto-dark .title h1,.proto-dark .panel-title,.proto-dark .quality-guide h3,.proto-dark .quality-metric .metric-value,.proto-dark th,.proto-dark td,.proto-dark label{color:#dbe5f2!important}.proto-dark .control,.proto-dark button,.proto-dark select,.proto-dark input,.proto-dark .proto-popover{background:#1c2a3d!important;color:#dbe5f2!important;border-color:#3a4a60!important}.proto-dark .data-table th,.proto-dark .table th{background:#1c2a3d!important}.proto-dark .data-table td,.proto-dark .table td{background:#172235!important;border-color:#27364a!important}.proto-dark .quality-bar-track{background:#2a3a4e}.proto-dark .gridline{stroke:#314157}.proto-dark .scope,.proto-dark .scope-line,.proto-dark .fresh,.proto-dark .panel-sub,.proto-dark .metric-label,.proto-dark .metric-foot{color:#9cacc0!important}
    @media(max-width:1400px){.proto-time-field{width:285px!important;flex-basis:285px!important}.proto-time-field .control{font-size:12px!important;padding:0 8px!important;gap:4px!important}}
    @keyframes proto-in{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:none}}@keyframes proto-fade{from{opacity:0}to{opacity:1}}@keyframes proto-rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}@keyframes proto-slide{from{opacity:0;transform:translateX(14px)}to{opacity:1;transform:none}}@keyframes proto-spin{to{transform:rotate(360deg)}}@keyframes proto-flash{0%,100%{background:transparent}35%{background:#edf4ff}}
    @media(prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;transition-duration:.01ms!important}}
  `;
  document.head.appendChild(style);

  const normalize = value => String(value || '').replace(/[\s·（）()]/g, '').toLowerCase();
  const getText = element => (element ? element.textContent.trim() : '');
  const valueSpan = control => Array.from(control.querySelectorAll('span:not(.chev)'))
    .filter(span => !/^[▣▦⌕]$/.test(getText(span)))
    .sort((a, b) => getText(b).length - getText(a).length)[0] || control.querySelector('span:not(.chev)');
  let currentPopover = null;
  let tabOriginal = null;
  let currentLanguage = 'zh';
  let currentTheme = 'light';
  const projectColumns = [
    { key: 'index', label: '序号', group: '基础信息' },
    { key: 'projectName', label: '项目名称', group: '基础信息' },
    { key: 'projectUuid', label: '项目UUID', group: '基础信息' },
    { key: 'deviceCount', label: '覆盖设备数', group: '基础信息' },
    { key: 'deviceNames', label: '覆盖设备名称', group: '基础信息' },
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
  const deviceColumns = [
    { key: 'index', label: '序号', group: '基础信息' },
    { key: 'deviceName', label: '设备名称', group: '基础信息' },
    { key: 'deviceSn', label: '设备SN', group: '基础信息' },
    { key: 'projectCount', label: '检测项目数', group: '基础信息' },
    ...projectColumns.filter(column => column.group !== '基础信息'),
    { key: 'lastDataTime', label: '最后数据时间', group: '基础信息' }
  ];
  const defaultDeviceColumnKeys = ['index', 'deviceName', 'deviceSn', 'projectCount', 'boardTotal', 'boardYield', 'boardDppm', 'boardFalseRate', 'boardPassRate', 'componentDppm', 'componentNgRate', 'lastDataTime'];
  let activeDeviceColumns = new Set(defaultDeviceColumnKeys);
  let currentMouth = 'review';
  let currentQualityTab = new URLSearchParams(location.search).get('tab') === 'project' ? 'project' : 'overview';
  let selectedComparisonProject = new URLSearchParams(location.search).get('project') || '';

  const projectSamples = [
    { name: '3267504J2G_A面', uuid: '6d7c21c8-9c32-4a10-a501-08e8fe634912', devices: ['AOI-01','AOI-03','AOI-04'], boardTotal: 60680, componentTotal: 5311420, original: { yield: 92.84, falseRate: 6.28, passRate: 92.84, componentNgRate: .194, componentFalseDppm: 1180, componentPassRate: 96.72 }, review: { yield: 98.76, falseRate: .86, passRate: 97.91, componentNgRate: .082, componentFalseDppm: 812, componentPassRate: 98.43 } },
    { name: '1-A', uuid: '9b40ccad-1ab6-4a21-b791-c3745d0348e2', devices: ['AOI-02','AOI-05'], boardTotal: 28412, componentTotal: 2193680, original: { yield: 91.86, falseRate: 7.12, passRate: 91.86, componentNgRate: .263, componentFalseDppm: 1410, componentPassRate: 95.84 }, review: { yield: 98.72, falseRate: 1.19, passRate: 96.86, componentNgRate: .186, componentFalseDppm: 1024, componentPassRate: 97.32 } },
    { name: '329134S_P129', uuid: 'c1a92c30-53c3-41f4-a031-3b84d623719e', devices: ['AOI-02','AOI-04','AOI-06'], boardTotal: 21596, componentTotal: 1746225, original: { yield: 90.18, falseRate: 8.36, passRate: 90.18, componentNgRate: .342, componentFalseDppm: 2050, componentPassRate: 94.18 }, review: { yield: 97.26, falseRate: 2.58, passRate: 95.70, componentNgRate: .278, componentFalseDppm: 1608, componentPassRate: 96.54 } },
    { name: '155042F_P9', uuid: '744876c1-7837-46e5-b96d-e8c1161ad904', devices: ['AOI-01'], boardTotal: 18340, componentTotal: 1492780, original: { yield: 94.15, falseRate: 4.31, passRate: 94.15, componentNgRate: .221, componentFalseDppm: 1210, componentPassRate: 96.40 }, review: { yield: 98.94, falseRate: .99, passRate: 97.61, componentNgRate: .171, componentFalseDppm: 932, componentPassRate: 98.02 } }
  ];
  const deviceSamples = [
    { name: 'AOI-01', sn: 'SI1020E1112', projectCount: 5, boardTotal: 34620, lastDataTime: '2026-08-04 14:32:56', original: { yield: 93.20, falseRate: 5.84, passRate: 93.20, componentNgRate: .208, componentFalseDppm: 1240, componentPassRate: 96.40 }, review: { yield: 99.12, falseRate: .74, passRate: 98.34, componentNgRate: .076, componentFalseDppm: 760, componentPassRate: 98.82 } },
    { name: 'AOI-03', sn: 'SI1020E1148', projectCount: 4, boardTotal: 29880, lastDataTime: '2026-08-04 14:10:12', original: { yield: 92.46, falseRate: 5.91, passRate: 92.46, componentNgRate: .217, componentFalseDppm: 1320, componentPassRate: 96.08 }, review: { yield: 98.86, falseRate: .92, passRate: 97.82, componentNgRate: .091, componentFalseDppm: 830, componentPassRate: 98.55 } },
    { name: 'AOI-02', sn: 'SI1020E1186', projectCount: 6, boardTotal: 32110, lastDataTime: '2026-08-04 13:58:22', original: { yield: 91.64, falseRate: 6.42, passRate: 91.64, componentNgRate: .238, componentFalseDppm: 1490, componentPassRate: 95.74 }, review: { yield: 98.62, falseRate: 1.14, passRate: 97.31, componentNgRate: .102, componentFalseDppm: 910, componentPassRate: 98.28 } },
    { name: 'AOI-04', sn: 'SI1020E1206', projectCount: 5, boardTotal: 27840, lastDataTime: '2026-08-04 12:58:16', original: { yield: 89.98, falseRate: 7.36, passRate: 89.98, componentNgRate: .284, componentFalseDppm: 1680, componentPassRate: 94.92 }, review: { yield: 96.91, falseRate: 2.74, passRate: 95.18, componentNgRate: .146, componentFalseDppm: 1210, componentPassRate: 97.44 } }
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

  function openHelp() {
    openModal('原型操作说明', `<p style="margin-top:0;line-height:1.7;color:#475569">这是 SPC 集中管理平台的可交互产品原型。你可以切换左侧页面、选择筛选条件、执行查询、切换统计口径和页签，并演示详情、导出、设备分配及补传操作。</p><div style="background:#f7f9fc;border-radius:6px;padding:12px;color:#64748b;font-size:12px;line-height:1.7">原型中的数据用于展示交互和页面结构，不代表现场真实生产数据。</div>`, '知道了');
  }

  const number = value => Math.round(value).toLocaleString('zh-CN');
  const pct = value => `${Number(value).toFixed(2)}%`;

  function statsFor(sample, mouth) {
    const source = sample[mouth];
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
    const widths = { index: 60, projectName: 170, projectUuid: 240, deviceCount: 110, deviceNames: 240, deviceName: 140, deviceSn: 150, projectCount: 110, lastDataTime: 170, componentSpecialNg: 190, componentSpecialFalse: 210, componentSpecialMiss: 210 };
    return widths[key] || (key.includes('Rate') ? 140 : 130);
  }

  function tableMarkup(columns, rows, tableAttribute) {
    const cols = columns.map(column => `<col data-column-key="${column.key}" style="width:${columnWidth(column.key)}px">`).join('');
    const heads = columns.map(column => `<th data-column-key="${column.key}" class="${column.group === '基础信息' ? '' : 'num'}">${column.label}</th>`).join('');
    const body = rows.map(row => `<tr>${columns.map(column => {
      const numeric = column.group === '基础信息' ? '' : 'num';
      if (column.key === 'projectName') return `<td data-column-key="projectName"><a href="#" class="project-link" data-project-uuid="${row.projectUuid}">${row.projectName}</a></td>`;
      if (column.key === 'deviceName') return `<td data-column-key="deviceName"><a href="#" class="device-link" data-device-name="${row.deviceName}">${row.deviceName}</a></td>`;
      return `<td data-column-key="${column.key}" class="${numeric}${column.key === 'projectUuid' ? ' uuid' : ''}">${row[column.key] ?? '—'}</td>`;
    }).join('')}</tr>`).join('');
    return `<colgroup>${cols}</colgroup><thead><tr>${heads}</tr></thead><tbody>${body}</tbody>`;
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
    const totalWidth = columns.reduce((sum, column) => {
      if (!visible.has(column.key)) return sum;
      const col = table.querySelector(`col[data-column-key="${column.key}"]`);
      return sum + (parseInt(col && col.style.width, 10) || 120);
    }, 0);
    const containerWidth = table.closest('.table-scroll')?.clientWidth || 0;
    table.style.width = totalWidth > containerWidth ? `${Math.max(totalWidth, 520)}px` : '100%';
    let stickyLeft = 0;
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
    const lockedKeys = isDevice ? new Set(['deviceName']) : new Set(['projectName']);
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

  function openGenericColumnManager() {
    const table = document.querySelector('.records table');
    if (!table || !table.tHead) return;
    const headers = Array.from(table.tHead.rows[0].cells).map((cell, index) => ({ index, label: getText(cell) })).filter(column => column.index > 0 && column.label);
    const active = new Set(headers.filter(column => getComputedStyle(table.tHead.rows[0].cells[column.index]).display !== 'none').map(column => String(column.index)));
    const lockedIndexes = new Set(document.body.dataset.page === 'board-query' ? headers.filter(column => column.label === 'PCB ID').map(column => column.index) : []);
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

  function setMetric(metric, label, value, foot, key) {
    if (!metric) return;
    if (key) metric.dataset.mouthKpi = key;
    metric.querySelector('.metric-label').innerHTML = label;
    metric.querySelector('.metric-value').innerHTML = value;
    metric.querySelector('.metric-foot').innerHTML = foot;
  }

  function renderProjectSummary(mouth = currentMouth) {
    const table = document.querySelector('[data-project-table]');
    if (!table) return;
    currentMouth = mouth;
    const mouthLabel = mouth === 'original' ? '原始判定' : '一次复判';
    ensureMouthContext(mouthLabel);
    const selectedDevice = new URLSearchParams(location.search).get('device') || '';
    const sourceProjects = selectedDevice ? projectSamples.filter(project => project.devices.includes(selectedDevice)) : projectSamples;
    const rows = sourceProjects.map((project, index) => ({ index: index + 1, projectName: project.name, projectUuid: project.uuid, deviceCount: `${selectedDevice ? 1 : project.devices.length} 台`, deviceNames: selectedDevice || project.devices.join('、'), ...statsFor(project, mouth) }));
    table.innerHTML = tableMarkup(projectColumns, rows, 'data-project-table');
    applyProjectColumns(activeProjectColumns);
    const metrics = document.querySelectorAll('.metrics .metric');
    const totalBoards = sourceProjects.reduce((sum, project) => sum + project.boardTotal, 0);
    const yieldValue = mouth === 'original' ? 92.84 : 98.76;
    const dppmValue = mouth === 'original' ? 71640 : 12418;
    const falseRate = mouth === 'original' ? 6.48 : 1.12;
    const componentDppm = mouth === 'original' ? 1947 : 1026;
    setMetric(metrics[0], 'PCB 检测数', `${number(totalBoards)}<small>块</small>`, selectedDevice ? `${selectedDevice} · ${sourceProjects.length} 个项目` : '覆盖 4 个项目 · 6 台设备');
    setMetric(metrics[1], `${mouthLabel}板卡良率 ⓘ`, `${yieldValue.toFixed(2)}<small>%</small>`, mouth === 'original' ? '一次复判后 <span class="up">+5.92 个百分点</span>' : '较原始判定 <span class="up">+5.92 个百分点</span>', 'boardYield');
    setMetric(metrics[2], `${mouthLabel}板卡 DPPM ⓘ`, number(dppmValue), mouth === 'original' ? '一次复判后下降 59,222' : '较原始判定下降 59,222');
    setMetric(metrics[3], '板卡误报率 ⓘ', `${falseRate.toFixed(2)}<small>%</small>`, mouth === 'original' ? '按一次复判结果识别原始误报' : '较原始判定下降 5.36 个百分点');
    setMetric(metrics[4], `${mouthLabel}器件 DPPM ⓘ`, number(componentDppm), mouth === 'original' ? '一次复判后下降 921' : '较原始判定下降 921');
    const panelSub = document.querySelector('.table-panel .panel-sub');
    if (panelSub) panelSub.textContent = `共 ${sourceProjects.length} 个项目`;
    if (selectedDevice) {
      const deviceControl = document.querySelector('.field.device .control');
      const target = valueSpan(deviceControl);
      if (target) target.textContent = selectedDevice;
      const scopeText = document.querySelector('.scope-note span:not(.mouth-context)');
      if (scopeText) scopeText.textContent = `${selectedDevice} · ${sourceProjects.length} 个项目`;
    }
    const legend = document.querySelector('.legend');
    if (legend) legend.innerHTML = mouth === 'original' ? '<span><i style="background:#3478f6"></i>原始判定（当前）</span><span><i style="background:#9bb0ce"></i>一次复判参照</span>' : '<span><i style="background:#9bb0ce"></i>原始判定参照</span><span><i style="background:#3478f6"></i>一次复判（当前）</span>';
    document.querySelectorAll('.line-original').forEach(line => { line.style.stroke = mouth === 'original' ? '#3478f6' : '#8ba3c7'; line.style.strokeWidth = mouth === 'original' ? '2.5' : '2'; });
    document.querySelectorAll('.line-review').forEach(line => { line.style.stroke = mouth === 'review' ? '#3478f6' : '#8ba3c7'; line.style.strokeWidth = mouth === 'review' ? '2.5' : '2'; });
    const comparisonValues = deviceSamples.map(device => device[mouth].yield);
    document.querySelectorAll('.charts section:nth-child(2) .bar-value').forEach((label, index) => { const value = comparisonValues[index % comparisonValues.length]; label.textContent = `${value.toFixed(2)}%`; });
    document.querySelectorAll('.charts section:nth-child(2) rect.bar-main,.charts section:nth-child(2) rect.bar-original,.charts section:nth-child(2) rect[fill="#d99014"]').forEach((bar, index) => { const value = comparisonValues[index % comparisonValues.length]; bar.setAttribute('width', String(Math.max(20, (value - 90) / 10 * 325))); });
  }

  function metricBlock(label, value, foot, key = '') {
    return `<div class="quality-metric" ${key ? `data-mouth-kpi="${key}"` : ''}><div class="metric-label">${label}</div><div class="metric-value">${value}</div><div class="metric-foot">${foot}</div></div>`;
  }

  function deviceOverviewRows(mouth) {
    return deviceSamples.map((device, index) => ({ index: index + 1, deviceName: device.name, deviceSn: device.sn, projectCount: device.projectCount, lastDataTime: device.lastDataTime, ...statsFor(device, mouth) }));
  }

  function renderDeviceOverview() {
    const content = document.querySelector('.quality-content');
    if (!content) return;
    const mouthLabel = currentMouth === 'original' ? '原始判定' : '一次复判';
    const avgYield = currentMouth === 'original' ? 91.82 : 98.38;
    const rows = deviceOverviewRows(currentMouth);
    const bars = deviceSamples.map(device => `<div class="quality-bar"><span>${device.name}</span><div class="quality-bar-track"><div class="quality-bar-fill" style="width:${device[currentMouth].yield}%"></div></div><b>${device[currentMouth].yield.toFixed(2)}%</b></div>`).join('');
    content.innerHTML = `
      <section class="quality-metrics">
        ${metricBlock('参与统计设备', '4<small>台</small>', '覆盖 4 个区域')}
        ${metricBlock('检测项目数', '8<small>个</small>', '按项目 UUID 去重')}
        ${metricBlock('板卡总数', '124,450<small>块</small>', '当前筛选范围')}
        ${metricBlock(`${mouthLabel}板卡良率`, `${avgYield.toFixed(2)}<small>%</small>`, currentMouth === 'original' ? '一次复判后 +6.56 个百分点' : '较原始判定 +6.56 个百分点', 'boardYield')}
        ${metricBlock(`${mouthLabel}器件 DPPM`, currentMouth === 'original' ? '2,368' : '1,042', currentMouth === 'original' ? '一次复判后下降 1,326' : '较原始判定下降 1,326')}
        ${metricBlock('需关注设备', '1<small>台</small>', 'AOI-04 低于整体水平')}
      </section>
      <section class="quality-grid">
        <div class="quality-chart"><div class="panel-head"><div><span class="panel-title">设备质量趋势</span><span class="panel-sub">${mouthLabel}主曲线</span></div><div class="legend"><span><i style="background:#3478f6"></i>${mouthLabel}</span><span><i style="background:#9bb0ce"></i>${currentMouth === 'original' ? '一次复判' : '原始判定'}参照</span></div></div><div class="quality-chart-body"><svg viewBox="0 0 700 165" preserveAspectRatio="none"><line x1="30" y1="35" x2="680" y2="35" class="gridline"/><line x1="30" y1="85" x2="680" y2="85" class="gridline"/><line x1="30" y1="135" x2="680" y2="135" class="gridline"/><path d="M35 ${currentMouth === 'original' ? 108 : 52} L135 ${currentMouth === 'original' ? 96 : 47} L235 ${currentMouth === 'original' ? 112 : 58} L335 ${currentMouth === 'original' ? 88 : 42} L435 ${currentMouth === 'original' ? 101 : 50} L535 ${currentMouth === 'original' ? 79 : 38} L675 ${currentMouth === 'original' ? 92 : 44}" fill="none" stroke="#3478f6" stroke-width="3"/><path d="M35 ${currentMouth === 'original' ? 52 : 108} L135 ${currentMouth === 'original' ? 47 : 96} L235 ${currentMouth === 'original' ? 58 : 112} L335 ${currentMouth === 'original' ? 42 : 88} L435 ${currentMouth === 'original' ? 50 : 101} L535 ${currentMouth === 'original' ? 38 : 79} L675 ${currentMouth === 'original' ? 44 : 92}" fill="none" stroke="#9bb0ce" stroke-width="2"/></svg></div></div>
        <div class="quality-chart"><div class="panel-head"><div><span class="panel-title">设备良率对比</span><span class="panel-sub">${mouthLabel}</span></div></div><div class="quality-chart-body"><div class="quality-bars">${bars}</div></div></div>
      </section>
      <section class="panel table-panel"><div class="panel-head"><div><span class="panel-title">设备明细</span><span class="panel-sub">共 ${rows.length} 台设备</span></div><div class="table-tools"><button class="link-btn">显示列</button><button class="btn">导出报表</button></div></div><div class="table-wrap"><div class="table-scroll"><table class="data-table" data-device-table>${tableMarkup(deviceColumns, rows, 'data-device-table')}</table></div><div class="pager"><span>共${rows.length}条</span>${paginationMarkup(rows.length)}</div></div></section>`;
    applyDeviceColumns(activeDeviceColumns);
  }

  function renderSameProjectComparison() {
    const content = document.querySelector('.quality-content');
    if (!content) return;
    if (!selectedComparisonProject) {
      content.innerHTML = `<section class="quality-guide" data-project-comparison><div><h3>请选择需要对比的项目</h3><p>同一项目在多台设备上的结果可直接比较，避免项目难度不同造成误判。</p><div class="project-picks">${projectSamples.map(project => `<button class="project-pick" data-project-pick="${project.uuid}">${project.name}</button>`).join('')}</div></div></section>`;
      return;
    }
    const project = projectSamples.find(item => item.uuid === selectedComparisonProject) || projectSamples[0];
    const related = project.devices.map((name, index) => {
      const base = deviceSamples.find(device => device.name === name) || deviceSamples[index % deviceSamples.length];
      const adjusted = { ...base, name, boardTotal: Math.round(project.boardTotal / project.devices.length * (1 + index * .04)), projectCount: 1 };
      return { index: index + 1, deviceName: name, deviceSn: base.sn, projectCount: 1, lastDataTime: base.lastDataTime, ...statsFor(adjusted, currentMouth) };
    });
    const mouthLabel = currentMouth === 'original' ? '原始判定' : '一次复判';
    const bars = related.map(row => `<div class="quality-bar"><span>${row.deviceName}</span><div class="quality-bar-track"><div class="quality-bar-fill" style="width:${parseFloat(row.boardYield)}%"></div></div><b>${row.boardYield}</b></div>`).join('');
    content.innerHTML = `<div data-project-comparison class="quality-content"><section class="comparison-summary"><div><b>${project.name}</b><span class="panel-sub">${project.uuid}</span></div><div>覆盖 ${project.devices.length} 台设备 · ${number(project.boardTotal)} 块板卡 · 当前口径：<b>${mouthLabel}</b></div></section><section class="quality-grid"><div class="quality-chart"><div class="panel-head"><span class="panel-title">同项目设备趋势</span><span class="panel-sub">${mouthLabel}主曲线</span></div><div class="quality-chart-body"><svg viewBox="0 0 700 165" preserveAspectRatio="none"><line x1="30" y1="35" x2="680" y2="35" class="gridline"/><line x1="30" y1="85" x2="680" y2="85" class="gridline"/><line x1="30" y1="135" x2="680" y2="135" class="gridline"/><path d="M35 92 L145 70 L255 84 L365 55 L475 68 L585 48 L675 60" fill="none" stroke="#3478f6" stroke-width="3"/></svg></div></div><div class="quality-chart"><div class="panel-head"><span class="panel-title">设备良率对比</span></div><div class="quality-chart-body"><div class="quality-bars">${bars}</div></div></div></section><section class="panel table-panel"><div class="panel-head"><div><span class="panel-title">设备对比明细</span><span class="panel-sub">同一项目口径</span></div><div class="table-tools"><button class="link-btn">显示列</button><button class="btn">导出报表</button></div></div><div class="table-wrap"><div class="table-scroll"><table class="data-table" data-device-table>${tableMarkup(deviceColumns, related, 'data-device-table')}</table></div></div></section></div>`;
    applyDeviceColumns(activeDeviceColumns);
  }

  function renderDeviceQuality() {
    document.querySelectorAll('.quality-tab').forEach(tab => tab.classList.toggle('on', tab.dataset.qualityTab === currentQualityTab));
    if (currentQualityTab === 'project') renderSameProjectComparison(); else renderDeviceOverview();
    normalizeChartScaling(document.querySelector('.quality-content') || document);
    normalizePagers(document.querySelector('.quality-content') || document);
  }

  function initializeDeviceQualityPage() {
    if (document.body.dataset.page !== 'device-quality') return;
    const main = document.querySelector('main');
    main.innerHTML = `<div class="scope-line"><div class="scope-note"><b>查询条件</b></div><div class="fresh"><span class="fresh-dot"></span>数据已更新至 2026-08-04 14:32:18</div></div><section class="filters"><div class="field time"><label>时间范围</label><div class="control"><span>▣</span><span>2026-08-01 00:00</span><span class="muted">至</span><span>2026-08-04 14:32</span></div></div><div class="field device"><label>设备名称</label><div class="control"><span>▦</span><span>全部设备（4）</span><span class="chev">⌄</span></div></div><div class="field project"><label>项目名称</label><div class="control"><span class="muted">⌕</span><span class="muted">全部项目</span></div></div><div class="field"><label>统计口径</label><div class="segmented"><div class="seg ${currentMouth === 'original' ? 'active' : ''}">原始判定</div><div class="seg ${currentMouth === 'review' ? 'active' : ''}">一次复判</div></div></div><div class="filter-actions"><button class="btn">重置</button><button class="btn primary">查询</button></div></section><div class="quality-tabs"><button class="quality-tab" data-quality-tab="overview">设备整体统计</button><button class="quality-tab" data-quality-tab="project">同项目设备对比</button></div><div class="quality-content"></div>`;
    document.querySelectorAll('.quality-tab').forEach(tab => { tab.onclick = () => { currentQualityTab = tab.dataset.qualityTab; renderDeviceQuality(); }; });
    renderDeviceQuality();
  }

  function setMouth(mouth) {
    currentMouth = mouth;
    if (document.body.dataset.page === 'device-quality') renderDeviceQuality(); else renderProjectSummary(mouth);
    toast(`统计口径已切换为${mouth === 'original' ? '原始判定' : '一次复判'}，页面数据已同步更新`, 'info');
  }

  function modalForAction(action) {
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
      openModal('菜单权限', `<div class="proto-checks"><label class="proto-check"><input type="checkbox" checked>项目统计</label><label class="proto-check"><input type="checkbox" checked>设备质量分析</label><label class="proto-check"><input type="checkbox" checked>单板查询</label><label class="proto-check"><input type="checkbox" checked>缺陷分析</label><label class="proto-check"><input type="checkbox" checked>误报分析</label><label class="proto-check"><input type="checkbox">平台管理</label></div>`, '保存权限', () => toast('菜单权限已更新'));
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
      if (document.querySelector('[data-project-table],[data-device-table]')) openProjectColumnManager();
      else openGenericColumnManager();
      return;
    }
    if (/自定义列/.test(action)) {
      openModal('自定义显示列', `<div class="proto-checks"><label class="proto-check"><input type="checkbox" checked>设备</label><label class="proto-check"><input type="checkbox" checked>项目</label><label class="proto-check"><input type="checkbox" checked>检测时间</label><label class="proto-check"><input type="checkbox" checked>判定结果</label><label class="proto-check"><input type="checkbox">复判人员</label><label class="proto-check"><input type="checkbox">图片状态</label></div>`, '应用列设置', () => toast('显示列已更新'));
    }
  }

  function confirmAction(title, message, onConfirm) {
    openModal(title, `<p style="margin:0;color:#475569;line-height:1.7">${message}</p>`, '确认', onConfirm);
  }

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
      const cells = row.querySelectorAll('td');
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

  function openAddDeviceModal() {
    const backdrop = openModal('新增设备', `<div class="proto-field"><label>设备IP</label><div class="proto-device-identify-row"><input data-device-ip inputmode="decimal" autocomplete="off" placeholder="例如：192.168.10.25"><button type="button" class="proto-device-identify-button" data-identify-device>识别设备</button></div><p class="proto-device-status" data-device-status>填写设备 IP 后识别设备信息</p></div><div class="proto-device-divider"></div><div class="proto-field"><label>设备SN</label><input data-device-sn readonly placeholder="识别后自动获取" aria-readonly="true"></div><div class="proto-field"><label>设备名称</label><input data-device-name readonly placeholder="识别后自动获取" aria-readonly="true"></div><div class="proto-field"><label>所属区域</label><select data-device-config disabled><option>区域A</option><option>区域B</option><option>区域C</option><option>区域D</option></select></div><div class="proto-field"><label>设备状态</label><select data-device-config disabled><option>启用</option><option>停用</option></select></div>`, '新增设备', modal => {
      const ip = modal.querySelector('[data-device-ip]').value.trim();
      if (modal.dataset.identifiedIp !== ip) { toast('请先识别当前设备 IP', 'error'); return false; }
      toast('设备已新增');
    });
    backdrop.querySelector('.proto-modal').classList.add('proto-device-modal');
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
        status.textContent = '设备识别成功，请完善所属区域和设备状态';
        configFields[0].focus();
      }, 650);
    });
    return backdrop;
  }

  function handleManagementAction(action, target) {
    const deviceModal = () => openModal('编辑设备', `<div class="proto-field"><label>设备SN</label><input value="SI1020E1112" readonly aria-readonly="true"></div><div class="proto-field"><label>设备名称</label><input value="AOI-01" readonly aria-readonly="true"></div><div class="proto-field"><label>设备IP</label><input value="192.168.10.21" placeholder="例如：192.168.10.21"></div><div class="proto-field"><label>所属区域</label><select><option>区域A</option><option>区域B</option><option>区域C</option><option>区域D</option></select></div><div class="proto-field"><label>设备状态</label><select><option>启用</option><option>停用</option></select></div>`, '保存修改', () => toast('设备信息已保存'));
    const userModal = editing => openModal(editing ? '编辑用户' : '新增用户', `<div class="proto-field"><label>用户名称</label><input value="${editing ? 'zhangsan' : ''}" placeholder="请输入用户名称"></div><div class="proto-field"><label>角色名称</label><select><option>质量工程师</option><option>生产主管</option><option>只读用户</option><option>平台管理员</option></select></div>${editing ? '' : '<div class="proto-field"><label>初始密码</label><input type="password" placeholder="请输入初始密码"></div>'}<div class="proto-field"><label>状态</label><select><option>启用</option><option>停用</option></select></div>`, editing ? '保存修改' : '新增用户', () => toast(editing ? '用户信息已保存' : '用户已新增'));
    const roleModal = editing => openModal(editing ? '编辑角色' : '新增角色', `<div class="proto-field"><label>角色名称</label><input value="${editing ? '质量工程师' : ''}" placeholder="请输入角色名称"></div><div class="proto-field"><label>角色说明</label><input value="${editing ? '负责质量数据分析和导出' : ''}" placeholder="请输入角色说明"></div><div class="proto-field"><label>状态</label><select><option>启用</option><option>停用</option></select></div>`, editing ? '保存修改' : '新增角色', () => toast(editing ? '角色信息已保存' : '角色已新增'));
    if (action === 'add-device') return openAddDeviceModal();
    if (action === 'edit-device') return deviceModal();
    if (action === 'import-device') return openModal('导入设备', '<div class="proto-field"><label>导入文件</label><input type="file" accept=".xlsx,.csv"></div><p style="color:#64748b;font-size:12px;line-height:1.7">支持 Excel 或 CSV 文件，导入字段包含设备SN、设备名称、设备IP、所属区域和设备状态。</p>', '开始导入', () => toast('设备导入任务已创建'));
    if (action === 'toggle-device') {
      const disabled = target.dataset.deviceStatus === 'disabled';
      if (!disabled) return confirmAction('确认停用设备', '停用后平台将不再接收该设备上传的数据，是否继续？', () => { target.dataset.deviceStatus = 'disabled'; target.textContent = '停用'; target.classList.add('off'); const del = target.closest('tr').querySelector('[data-proto-action="delete-device"]'); if (del) del.disabled = true; toast('设备已停用'); });
      target.dataset.deviceStatus = 'enabled'; target.textContent = '启用'; target.classList.remove('off'); const del = target.closest('tr').querySelector('[data-proto-action="delete-device"]'); if (del) del.disabled = false; return toast('设备已启用');
    }
    if (action === 'delete-device') return confirmAction('删除设备', '删除后不可恢复，是否删除当前设备？', () => { target.closest('tr').remove(); toast('设备已删除'); });
    if (action === 'manage-regions') return openRegionManager();
    if (action === 'add-user') return userModal(false);
    if (action === 'edit-user') return userModal(true);
    if (action === 'toggle-user') {
      const disabled = target.dataset.userStatus === 'disabled';
      if (!disabled) return confirmAction('确认停用账号', '停用后该账号将无法登录平台，是否继续？', () => { target.dataset.userStatus = 'disabled'; target.textContent = '停用'; target.classList.add('off'); toast('账号已停用'); });
      target.dataset.userStatus = 'enabled'; target.textContent = '启用'; target.classList.remove('off'); return toast('账号已启用');
    }
    if (action === 'delete-user') return confirmAction('删除用户', '删除后不可恢复，是否删除当前用户？', () => { target.closest('tr').remove(); toast('用户已删除'); });
    if (action === 'add-role') return roleModal(false);
    if (action === 'edit-role') return roleModal(true);
    if (action === 'toggle-role') {
      const disabled = target.dataset.roleStatus === 'disabled';
      if (!disabled) return confirmAction('确认停用角色', '停用后，使用该角色的账号将不能继续使用该角色权限，是否继续？', () => { target.dataset.roleStatus = 'disabled'; target.textContent = '停用'; target.classList.add('off'); toast('角色已停用'); });
      target.dataset.roleStatus = 'enabled'; target.textContent = '启用'; target.classList.remove('off'); return toast('角色已启用');
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
    const searchable = /PCB SN|条码|工单号|复判员|用户名|姓名|角色名称|角色编码/.test(label) || label === '项目名称' || (label === '设备名称' && !field.classList.contains('device'));
    if (searchable) {
      const openHistory = input => {
        const historyMap = {
          '项目名称': ['3267504J2G_A面', '1-A', '329134S_P129', '155042F_P9', 'A14-POWER'],
          '条码号': ['SY-A01-DEMO-02', 'SY-B02-SMT-1669', 'SY-C03-143873', 'SY-D04-155042F-01', 'SY-A03-SMT-4698'],
          '工单号': ['WO20260804001', 'WO20260804002', 'WO20260804003', 'WO20260804004', 'WO20260804005'],
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
        values.forEach(value => {
          const option = document.createElement('button');
          option.className = 'proto-option proto-history-option';
          option.textContent = value;
          option.onclick = event => {
            event.stopPropagation();
            input.value = value;
            control.dataset.selected = value;
            closePopover();
            input.focus();
          };
          pop.appendChild(option);
        });
        document.body.appendChild(pop);
        currentPopover = pop;
      };
      if (label === '项目名称') {
        control.innerHTML = '<span aria-hidden="true">⌕</span><input class="proto-search" aria-label="项目名称" placeholder="输入项目名称或项目UUID">';
      }
      control.addEventListener('click', event => {
        event.stopPropagation();
        const existingInput = control.querySelector('input');
        if (existingInput) { openHistory(existingInput); return; }
        const placeholderMap = { '项目名称': '输入项目名称或项目UUID', '条码号': '输入条码号', '工单号': '输入工单号', '复判员': '输入工号或姓名', '一次复判员': '输入工号或姓名', '用户名': '输入用户名', '姓名': '输入姓名', '角色名称': '输入角色名称', '角色编码': '输入角色编码' };
        const placeholder = placeholderMap[label] || (label.includes('设备') ? '输入设备名称或设备SN' : '输入完整或部分PCB标识');
        control.innerHTML = `<span aria-hidden="true">⌕</span><input class="proto-search" aria-label="${label}" placeholder="${placeholder}">`;
        const input = control.querySelector('input');
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
    let dateRange = null;
    document.querySelectorAll('.field').forEach(field => {
      const label = getText(field.querySelector('label'));
      const control = field.querySelector('.control');
      if (label === '时间范围' && control && control.dataset.start && control.dataset.end) {
        dateRange = [control.dataset.start.replace('T', ' '), control.dataset.end.replace('T', ' ')];
        return;
      }
      if (!/设备|项目|PCB|条码|工单|复判员|检测结果|复判工作站|复判人员|复判结果|上传状态|所属区域|设备状态/.test(label)) return;
      const input = field.querySelector('input');
      if (control && control.dataset.selectedValues) {
        let values = [];
        try { values = JSON.parse(control.dataset.selectedValues); } catch (_) { values = []; }
        if (values.length) filters.push(values.map(normalize));
        return;
      }
      const value = input ? input.value.trim() : (control && (control.dataset.selected || getText(valueSpan(control))));
      if (!value || /全部|输入/.test(value)) return;
      filters.push(normalize(value));
    });
    let visible = 0;
    rows.forEach(row => {
      const content = normalize(row.textContent);
      const detectedAt = (row.textContent.match(/\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}/) || [])[0];
      const matchesDate = !dateRange || (!!detectedAt && detectedAt >= dateRange[0] && detectedAt <= dateRange[1]);
      const match = matchesDate && filters.every(value => Array.isArray(value) ? value.some(item => content.includes(item)) : content.includes(value));
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
    const pagerSummary = table.closest('.records')?.querySelector('.pager > span:first-child');
    if (pagerSummary) pagerSummary.textContent = `共 ${visible} 条`;
    return visible;
  }

  function runQuery(button) {
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
    const table = document.querySelector('table');
    if (!table) { toast('当前页面没有可导出的明细', 'info'); return; }
    const rows = Array.from(table.rows).filter(row => getComputedStyle(row).display !== 'none');
    const csv = rows.map(row => Array.from(row.cells).filter(cell => getComputedStyle(cell).display !== 'none').map(cell => `"${cell.innerText.replace(/"/g, '""').trim()}"`).join(',')).join('\n');
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
    if (document.title.includes('检测结果详情')) {
      const body = document.querySelector('.detail-body');
      if (!body) return;
      if (!tabOriginal) tabOriginal = body.innerHTML;
      if (label === '缺陷器件') body.innerHTML = tabOriginal;
      else body.innerHTML = `<div class="proto-tab-empty" style="grid-column:1/-1"><div><b>${label}</b>该页签用于展示${label}相关信息，原型中已完成切换效果。</div></div>`;
    } else {
      const dimension = document.querySelector('.field.dimension .control span:not(.chev)');
      if (dimension) dimension.textContent = label;
      toast(`已切换至${label}分析`, 'info');
    }
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
    const projectItem = navItems.find(item => getText(item).includes('订单统计'));
    if (!projectItem) return;
    const item = document.createElement('div');
    const isCompactItem = projectItem.classList.contains('item');
    item.className = `${isCompactItem ? 'item' : 'nav-item'}${document.body.dataset.page === 'device-quality' ? ' active' : ''}`;
    item.innerHTML = `<span class="${isCompactItem ? 'ico' : 'nav-icon'}">◈</span>设备分析`;
    projectItem.insertAdjacentElement('afterend', item);
    if (document.body.dataset.page === 'device-quality') projectItem.classList.remove('active');
  }

  function normalizeOrderStatisticsNavigation() {
    document.querySelectorAll('.nav .nav-item,.nav .item').forEach(item => {
      if (getText(item).includes('项目统计')) item.innerHTML = item.innerHTML.replace('项目统计', '订单统计');
    });
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
      if (text.includes('数据上传监控')) item.remove();
    });
    const items = Array.from(nav.querySelectorAll('.nav-item,.item'));
    const secondReviewItem = items.find(item => getText(item).includes('二次复判统计'));
    const qualityAlertItem = items.find(item => getText(item).includes('品质预警'));
    if (secondReviewItem && qualityAlertItem) secondReviewItem.insertAdjacentElement('afterend', qualityAlertItem);
  }

  function ensureDefectAnalysisNavigation() {
    const nav = document.querySelector('.nav');
    const navItems = nav ? Array.from(nav.querySelectorAll('.nav-item,.item')) : [];
    if (!nav || navItems.some(item => getText(item).includes('不良分析'))) return;
    const falseAlarmItem = navItems.find(item => getText(item).includes('误报分析'));
    if (!falseAlarmItem) return;
    const item = document.createElement('div');
    const isCompactItem = falseAlarmItem.classList.contains('item');
    item.className = `${isCompactItem ? 'item' : 'nav-item'}${document.body.dataset.page === 'defect-analysis' ? ' active' : ''}`;
    item.innerHTML = `<span class="${isCompactItem ? 'ico' : 'nav-icon'}">⇩</span>不良分析`;
    falseAlarmItem.insertAdjacentElement('afterend', item);
    if (document.body.dataset.page === 'defect-analysis') falseAlarmItem.classList.remove('active');
  }

  function ensureQualityAlertNavigation() {
    const nav = document.querySelector('.nav');
    const navItems = nav ? Array.from(nav.querySelectorAll('.nav-item,.item')) : [];
    if (!nav || navItems.some(item => getText(item).includes('品质预警'))) return;
    const secondReviewItem = navItems.find(item => getText(item).includes('二次复判统计'));
    if (!secondReviewItem) return;
    const item = document.createElement('div');
    const isCompactItem = secondReviewItem.classList.contains('item');
    item.className = `${isCompactItem ? 'item' : 'nav-item'}${document.body.dataset.page === 'quality-alert' ? ' active' : ''}`;
    item.innerHTML = `<span class="${isCompactItem ? 'ico' : 'nav-icon'}">⚑</span>品质预警`;
    secondReviewItem.insertAdjacentElement('afterend', item);
    if (document.body.dataset.page === 'quality-alert') secondReviewItem.classList.remove('active');
  }

  function normalizeManagementNavigation() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    Array.from(nav.querySelectorAll('.nav-item,.item')).forEach(item => {
      const text = getText(item);
      if (text.includes('基础 SPC') || text.includes('用户管理') || text.includes('角色管理') || text.includes('个人中心') || text.includes('系统设置')) item.remove();
    });
    const items = Array.from(nav.querySelectorAll('.nav-item,.item'));
    const deviceItem = items.find(item => getText(item).includes('设备管理'));
    if (!deviceItem) return;
    const isCompactItem = deviceItem.classList.contains('item');
    const definitions = [
      { label:'用户管理', icon:'♙', page:'user-management' },
      { label:'角色管理', icon:'♧', page:'role-management' },
      { label:'个人中心', icon:'◎', page:'personal-center' }
    ];
    let anchor = deviceItem;
    definitions.forEach(definition => {
      const item = document.createElement('div');
      item.className = `${isCompactItem ? 'item' : 'nav-item'}${document.body.dataset.page === definition.page ? ' active' : ''}`;
      item.innerHTML = `<span class="${isCompactItem ? 'ico' : 'nav-icon'}">${definition.icon}</span>${definition.label}`;
      anchor.insertAdjacentElement('afterend', item);
      anchor = item;
    });
    if (definitions.some(definition => document.body.dataset.page === definition.page)) {
      nav.querySelectorAll('.nav-item.active,.item.active').forEach(item => {
        if (!definitions.some(definition => getText(item).includes(definition.label))) item.classList.remove('active');
      });
    }
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
    enhanceBoardQueryTable();
    normalizeOrderStatisticsNavigation();
    normalizeDeviceAnalysisNavigation();
    normalizeSharedNavigation();
    ensureQualityNavigation();
    ensureDefectAnalysisNavigation();
    ensureQualityAlertNavigation();
    normalizeManagementNavigation();
    initializeDeviceQualityPage();
    if (document.body.dataset.mouthPage === 'project') renderProjectSummary(currentMouth);
    normalizeTopActions();
    normalizeTimeFields();
    normalizeDropdownIcons();
    normalizeChartScaling();
    normalizePagers();
    initializeNavigation();
    document.querySelectorAll('.control').forEach(makeControlInteractive);
    document.querySelectorAll('.seg').forEach(seg => {
      seg.tabIndex = 0;
      seg.onclick = () => {
        const selectedClass = seg.parentElement.querySelector('.seg.active') ? 'active' : 'on';
        seg.parentElement.querySelectorAll('.seg').forEach(item => item.classList.remove('on', 'active'));
        seg.classList.add(selectedClass);
        if (document.body.dataset.mouthPage) setMouth(getText(seg).includes('原始') ? 'original' : 'review');
        else toast(`统计口径已切换为${getText(seg)}`, 'info');
      };
    });
    document.querySelectorAll('.tab').forEach(tab => { tab.tabIndex = 0; tab.onclick = () => handleTabs(tab); });
    document.querySelectorAll('.page').forEach(page => {
      page.tabIndex = 0;
      page.onclick = () => {
        if (/‹|›|…/.test(getText(page))) return;
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
      if (target.matches('[data-page-number]')) { event.preventDefault(); target.parentElement.querySelectorAll('[data-page-number]').forEach(item => item.classList.remove('on')); target.classList.add('on'); toast(`已切换到第 ${target.dataset.pageNumber} 页`, 'info'); return; }
      if (target.matches('[data-project-pick]')) { event.preventDefault(); selectedComparisonProject = target.dataset.projectPick; renderSameProjectComparison(); return; }
      if (target.matches('.project-link')) { event.preventDefault(); window.location.href = `01A-项目明细.html?project=${encodeURIComponent(target.dataset.projectUuid)}&name=${encodeURIComponent(getText(target))}`; return; }
      if (target.matches('.device-link')) { event.preventDefault(); window.location.href = `01-项目统计首页.html?device=${encodeURIComponent(target.dataset.deviceName)}`; return; }
      if (target.matches('.proto-language-btn')) { event.preventDefault(); openLanguageMenu(target); return; }
      if (target.matches('.proto-theme-btn')) { event.preventDefault(); openThemeMenu(target); return; }
      if (/^查询$|^分析$/.test(text)) { event.preventDefault(); runQuery(target); return; }
      if (/^重置$/.test(text)) { event.preventDefault(); window.location.reload(); return; }
      if (/^(数据导出|导出报表|导出图|导出明细|导出该页报表|导出所选)/.test(text)) { event.preventDefault(); exportTable(target); return; }
      if (/刷新状态/.test(text)) { event.preventDefault(); toast('设备上传状态已刷新'); document.querySelectorAll('tbody tr').forEach(row => row.classList.add('proto-row-flash')); return; }
      if (/自定义列|显示列|新增设备|立即分配|^分配$|^编辑$|管理区域|新增用户|编辑用户|分配角色|新增角色|编辑角色|菜单权限|数据权限|修改账号信息/.test(text)) { event.preventDefault(); modalForAction(text); return; }
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
      if (/查看明细|查看PCB|^详情$/.test(text) && target.getAttribute('href') === '#') { event.preventDefault(); window.location.href = '02A-检测结果详情.html'; return; }
      if (/查看全部|查看人员工作量|告警记录|任务明细|历史|记录/.test(text) && (!target.getAttribute('href') || target.getAttribute('href') === '#')) { event.preventDefault(); toast(`${text}已展开为演示状态`, 'info'); }
    });
    document.addEventListener('change', event => {
      if (event.target.matches('.proto-page-size')) toast(`分页数量已调整为${event.target.value}`, 'info');
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

  initializePage();
})();
