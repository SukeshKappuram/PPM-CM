// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  isDemoVersion: true,
  envName: 'qa',
  coreApiUrl: 'http://democafm.rynasolutions.com/CoreApi/api',
  amApiUrl: 'http://democafm.rynasolutions.com/AssetMgmtApi/api',
  ppmApiUrl: 'http://democafm.rynasolutions.com/PMApi/api',
  stockApiUrl: 'http://democafm.rynasolutions.com/StockApi/api',
  scheduledTaskApiUrl: 'http://democafm.rynasolutions.com/SchduledApi/api',
  reportApiUrl: 'http://democafm.rynasolutions.com/ReportApi/api',
  hrmsApiUrl: 'http://democafm.rynasolutions.com/HRMSMgmtApi/api',
  quoteApiUrl:'http://democafm.smrthub.com/QuoteMgmtApi/api',
  ver: '2'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
