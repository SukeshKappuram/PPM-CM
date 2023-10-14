export enum Navigate {
  LOGIN = 'Login',
  HOME = '/GetDashBoard',
  ERROR = 'Error',
  VIEW_ASSETS = 'asset-register/Activity/GetAsset',
  EDIT_ASSET = 'asset-register/Activity/EditAsset',
  CREATE_ASSET = 'asset-register/Activity/CreateAsset',
  EDIT_AUDIT = 'asset-register/Condition-Records/CreateConditionalAudit',
  EDIT_INSTRUCTION = 'pm/task-instructions/edit',
  EDIT_QUESTION = 'pm/ppm-hseq/edit',
  VIEW_SCHEDULE = 'pm/ppm-scheduler/view',
  CREATE_SCHEDULE = 'pm/ppm-scheduler/create',
  CREATE_SCHEDULETASK = 'pm/ppm-scheduler/create',
  VIEW_SCHEDULE_GRID = 'pm/ppm-scheduler/scheduler',

  PPM_LOG_CREATE = 'pm/ppm-log/create',
  REACTIVE_LOG_CREATE = 'reactive/create',
  CORRECTIVE_LOG_CREATE = 'feedback/create',

  PPM_LOG_COPY = 'pm/ppm-log/create/copy',
  REACTIVE_LOG_COPY = 'reactive/create/copy',
  CORRECTIVE_LOG_COPY = 'feedback/create/copy',

  PPM_LOG = 'pm/ppm-log/edit/',
  REACTIVE_LOG = 'reactive/edit/',
  CORRECTIVE_LOG = 'feedback/edit/',
  SCHEDULED_LOG = 'scheduled-tasks/task/edit/',

  PPM_CALLS = 'pm/ppm-log/',
  REACTIVE_CALLS = 'reactive/',
  CORRECTIVE_CALLS = 'feedback/',
  SCHEDULE_TASKS = 'scheduler-task/',

  CREATE_HSEQ = 'pm/ppm-hseq/create',
  CREATE_TASK = 'pm/task-instructions/create',
  VIEW_TI_GRID = 'pm/task-instructions/instructions',
  VIEW_HSEQ_GRID = 'pm/ppm-hseq/grid',
  PPM_PLANNER_GRID = 'pm/ppm-planner/planner',
  PPM_ISSUER_GRID = '/pm/ppm-issuer/issuer',

  VIEW_CA_GRID = 'asset-register/Condition-Records/GetConditionalAudit',
  VIEW_ACCESS_ROLES = 'core/user-management/access-roles',
  CREATE_STOCK ='stock-management/Stock/newstock',
  EDIT_STOCK ='stock-management/Stock/editstock',
  VIEW_STOCK_GRID = 'stock-management/Stock/stockdetails',
  VIEW_GRN_GRID= 'procurement/grn/grn-details-grid',
  VIEW_STOCKISSUE_GRID= 'stock-management/Stock/newstockissuegrid',

  CREATE_ST_SCHEDULE = 'scheduled-tasks/scheduler/create',
  VIEW_ST_SCHEDULE ='scheduled-tasks/scheduler/view',
  OPEN_ST_SCHEDULE = 'scheduled-tasks/st-log/open',

  CREATE_UT_SCHEDULE = 'unit-pm/scheduler/create',
  VIEW_UT_SCHEDULE ='unit-pm/scheduler/view',
  OPEN_UT_SCHEDULE = 'unit-pm/scheduler-task/OpenWo',

  RESOURCE_MAN_POWER = 'core/administration/edit/Manpower',

  VIEW_MR = 'procurement/edit-mr',
  VIEW_MR_GRID = 'procurement/mr-grid'
}
