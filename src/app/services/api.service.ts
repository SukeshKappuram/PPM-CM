import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ApiEndpoints } from './../models/enums/api-endpoints.enum';
import { IAssetData } from '../models/interfaces/IAssetData';
import { IGridData } from './../models/interfaces/IGridData';
import { Injectable } from '@angular/core';
import { MasterComponentTypes } from '../models/enums/MasterComponentTypes.enum';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private httpClient: HttpClient) {}


  //#region Quotation
  // GetResourcesData(resourceId: string):Observable<any> {
  //   return this.httpClient.get(`${environment.quoteApiUrl}/Quotation/GetResources?resourceId=`+resourceId);
  // }

  GetProjectMasterPriceList(projectId: any):Observable<any> {
    var qryString = projectId === null || projectId === undefined ? '' : `?projectId=${projectId}`;
    return this.httpClient.get(`${environment.quoteApiUrl}/Quotation/GetProjectMasterPriceList${qryString}`);
  }

  GetWorkOrdersData(resourceId: string):Observable<any> {
    return this.httpClient.get(`${environment.quoteApiUrl}/Quotation/GetWorkOrders?resourceId=`+resourceId);
  }

  GetResourceBuildings(resourceId: string):Observable<any> {
    return this.httpClient.get(`${environment.quoteApiUrl}/Quotation/GetBuildingsByResourceId?resourceId=`+resourceId);
  }

  GetQuotationsByFilter(accountId:any, projectId:any, buildingId: any, fromDate: any, toDate: any, status:any, keyword:any ):Observable<IGridData> {
    var qryString = `accountId=${accountId}&fromDate=${fromDate}&toDate=${toDate}`;

    if(projectId !== null && projectId !== undefined) {  qryString =  `${qryString}&projectId=${projectId}`; }
    if(buildingId !== null && buildingId !== undefined) {  qryString =  `${qryString}&buildingId=${buildingId}`; }
    if(keyword !== null && keyword !== undefined && keyword.trim() !== '') {  qryString =  `${qryString}&searchKeyword=${keyword.trim()}`; }
    if(status !== null && status !== undefined) {  qryString =  `${qryString}&status=${status}`; }

    return this.httpClient.get<IGridData>(`${environment.quoteApiUrl}/Quotation/GetQuotations?${qryString}`);
  }

  GetQuotationsDashboardByFilter(accountId:any, projectId:any, buildingId: any, selDate: any, rType: any ):Observable<IGridData> {
    var qryString = `accountId=${accountId}&selDate=${selDate}&rType=${rType}`;
    if(projectId !== null && projectId !== undefined) {  qryString =  `${qryString}&projectId=${projectId}`; }
    if(buildingId !== null && buildingId !== undefined) {  qryString =  `${qryString}&buildingId=${buildingId}`; }
    return this.httpClient.get<IGridData>(`${environment.quoteApiUrl}/Quotation/GetQuotationDashboard/?${qryString}`);
  }

  GetQuotationById(id: any):Observable<any> {
    var qryString = `id=${id}`;
    return this.httpClient.get<IGridData>(`${environment.quoteApiUrl}/Quotation/GetQuotation?${qryString}`);
  }

  GetQuotationByUUID(id: any):Observable<any> {
    var qryString = `uuid=${id}`;
    return this.httpClient.get<IGridData>(`${environment.quoteApiUrl}/Public/GetQuotation?${qryString}`);
  }

  GetCustomerInfoByBuildingUnit(buildingId: any, unitId: any ):Observable<any> {
    return this.httpClient.get<IGridData>(`${environment.quoteApiUrl}/Quotation/GetCustomerByBuildingUnit/${buildingId}/${unitId}`);
  }

  AddUpdateQuotation(quotation: any): Observable<any> {
    return this.httpClient.post<any>(`${environment.quoteApiUrl}/Quotation/AddUpdateQuotation`, quotation);
  }

  GetAuditListByQuotationId(quotationId: string):Observable<any> {
    return this.httpClient.get(`${environment.quoteApiUrl}/Quotation/GetAuditListByQuotationId/`+ quotationId);
  }

  GetQuotationMasterData(userName: string):Observable<any> {
    return this.httpClient.get(`${environment.quoteApiUrl}/Quotation/GetMasterData?userName=`+ userName);
  }

  GetMasterItemById(id: any):Observable<any> {
    return this.httpClient.get(`${environment.quoteApiUrl}/Quotation/GetMasterItemById?id=`+id);
  }

  AddUpdateMasterItem(masterPrice: any): Observable<any> {
    return this.httpClient.post<any>(`${environment.quoteApiUrl}/Quotation/AddUpdateMasterItem`, masterPrice);
  }

  GetValuesList( ):Observable<any> {
    return this.httpClient.get(`${environment.quoteApiUrl}/Quotation/GetValuesList`);
  }

  GetValueListById(id: any):Observable<any> {
    return this.httpClient.get(`${environment.quoteApiUrl}/Quotation/GetValueListById?id=`+id);
  }

  AddOrUpdateValueList(valuelist: any): Observable<any> {
    return this.httpClient.post<any>(`${environment.quoteApiUrl}/Quotation/AddOrUpdateValueList`, valuelist);
  }

  AddUpdateCustomer(customer: any): Observable<any> {
    return this.httpClient.post<any>(`${environment.quoteApiUrl}/Quotation/AddOrUpdateCustomer`, customer);
  }

  AddUpdateQuoteAuditLog(audit: any): Observable<any> {
    return this.httpClient.post<any>(`${environment.quoteApiUrl}/Quotation/AddOrUpdateAuditLog`, audit);
  }

  AddUpdateQuotePublicLog(audit: any): Observable<any> {
    return this.httpClient.post<any>(`${environment.quoteApiUrl}/Public/AddOrUpdateAuditLog`, audit);
  }

  GetQuotationFile(quotationId: any): Observable<any> {
    var qryString = `linkId=${quotationId}&linkGroupId=2&attachmentGroup=2`;
    return this.httpClient.get<any>(`${environment.quoteApiUrl}/Common/GetAttachments?${qryString}`);
  }

  GetQuotationFileBase64Content(quotationId: any): Observable<any> {
    var qryString = `linkId=${quotationId}&linkGroupId=2&attachmentGroup=2`;
    return this.httpClient.get<any>(`${environment.quoteApiUrl}/Common/GetAttachmentsBase64?${qryString}`);
  }

  GetTaxInvoice(qString:any): Observable<any> {
    return this.httpClient.post<any>(`${environment.quoteApiUrl}/Quotation/GetTaxInvoice`,qString);
  }

  GetCustomersByAccountId(accountId: any): Observable<any> {
    return this.httpClient.get<any>(`${environment.quoteApiUrl}/Quotation/GetCustomers?accountId=${accountId}`);
  }

  GetQuotationSettings(accountId: any): Observable<any> {
    return this.httpClient.get<any>(`${environment.quoteApiUrl}/Quotation/GetSettings?accountId=${accountId}`);
  }

  AddOrUpdateQuoteSetting(setting: any): Observable<any> {
    return this.httpClient.post<any>(`${environment.quoteApiUrl}/Quotation/AddOrUpdateSetting`, setting);
  }

  SendEmail(qString: any): Observable<any> {
    return this.httpClient.post<any>(`${environment.quoteApiUrl}/Quotation/SendEmail`,qString);
  }

  GetEmailListByQuotationId(id: number): Observable<any> {
    return this.httpClient.get<any>(`${environment.quoteApiUrl}/Quotation/GetEmailListByQuotationId?quotationId=${id}`);
  }

  //#endregion


  /** Common */

  downloadImgFile(fileDetails: any): Observable<any> {
    return this.httpClient.post<any>(
      `${environment.coreApiUrl}/Common/DownLoadFile`,
      fileDetails,
      { responseType: 'blob' as 'json' }
    );
  }

  GetCommonDocuments(
    path: string,
    api: ApiEndpoints = ApiEndpoints.COREAPI
  ): Observable<any> {
    return this.httpClient.get<any>(`${environment[api]}/${path}`);
  }

  UploadCommonDocs(
    path: string,
    documentModels: any[],
    api: ApiEndpoints = ApiEndpoints.COREAPI
  ) {
    const uploadData = new FormData();
    for (let i = 0; i < documentModels.length; i++) {
      uploadData.append('attachments[' + i + '].id', documentModels[i].id);
      uploadData.append(
        'attachments[' + i + '].linkId',
        documentModels[i].linkId
      );
      uploadData.append(
        'attachments[' + i + '].linkGroupId',
        documentModels[i].linkGroupId
      );
      uploadData.append(
        'attachments[' + i + '].title',
        documentModels[i].title
      );
      uploadData.append(
        'attachments[' + i + '].subTitle',
        documentModels[i].subtitle
      );
      uploadData.append('attachments[' + i + '].file', documentModels[i].file);
      uploadData.append(
        'attachments[' + i + '].attachmentGroup',
        documentModels[i].attachmentGroup
      );
    }
    return this.httpClient.post<any>(`${environment[api]}/${path}`, uploadData);
  }

  UploadCommonImages(
    path: string,
    imageModels: any[],
    api: ApiEndpoints = ApiEndpoints.COREAPI
  ) {
    const uploadData = new FormData();
    for (let i = 0; i < imageModels.length; i++) {
      uploadData.append('attachments[' + i + '].id', imageModels[i].id);
      uploadData.append('attachments[' + i + '].linkId', imageModels[i].linkId);
      uploadData.append(
        'attachments[' + i + '].linkGroupId',
        imageModels[i].linkGroupId
      );
      uploadData.append(
        'attachments[' + i + '].resourceUrl',
        imageModels[i].imageUrl
      );
      uploadData.append('attachments[' + i + '].file', imageModels[i].file);
      uploadData.append(
        'attachments[' + i + '].attachmentGroup',
        imageModels[i].attachmentGroup
      );
    }
    return this.httpClient.post<any>(`${environment[api]}/${path}`, uploadData);
  }

  DeleteCommonAttachment(
    path: string,
    doc?: any,
    api: ApiEndpoints = ApiEndpoints.COREAPI
  ) {
    return this.httpClient.post<any>(`${environment[api]}/${path}`, doc);
  }

  getFilterGridData(
    filterType: any,
    api: ApiEndpoints = ApiEndpoints.PPMAPI
  ): Observable<any> {
    return this.httpClient.get<any>(
      `${environment[api]}/Common/GetGridFilterEntities/${filterType}`
    );
  }

  /**
   * Get all menu items
   * @
   **/

  GetAllMenuItems(isStaticCall: boolean = false): Observable<any> {
    if (!isStaticCall) {
      return this.httpClient.post<any>(
        `${environment.coreApiUrl}/Common/GetMenu`,
        null
      );
    }
    return this.httpClient.get<any[]>('assets/temp/MenuItems.json');
  }

  GetAccountDetails(): Observable<any> {
    return this.httpClient.get<any>(
      `${environment.coreApiUrl}/Account/GetAccounts`
    );
  }

  GetBatchDataByFilter(path: string, data: any): Observable<any> {
    return this.httpClient.get<any>(`${environment.stockApiUrl}/${path}`, data);
  }

  /**
   * Asset List
   **/

  GetAssetList(
    path: string,
    api: ApiEndpoints = ApiEndpoints.AMAPI
  ): Observable<IGridData> {
    return this.httpClient.get<any>(`${environment[api]}/${path}`);
  }

  AddOrUpdateAsset(
    path: string,
    asset: any,
    api: ApiEndpoints = ApiEndpoints.AMAPI
  ): Observable<any> {
    return this.httpClient.post<any>(`${environment[api]}/${path}`, asset);
  }

  AddOrUpdateParameterLink(
    path: string,
    data: any,
    api: ApiEndpoints = ApiEndpoints.AMAPI
  ): Observable<any> {
    if (api === ApiEndpoints.STOCKAPI) {
      return this.httpClient.post<any>(
        `${environment[api]}/${path}?subGroupId=${
          data.subGroupId
        }&&parameterIds=${[...new Set(data.parameterIds)].toString()}`,
        null
      );
    } else {
      return this.httpClient.post<any>(
        `${environment[api]}/${path}?subSystemId=${
          data.subSystemId
        }&&parameterIds=${[...new Set(data.parameterIds)].toString()}`,
        null
      );
    }
  }

  DeleteAsset(
    path: string,
    id: number,
    api: ApiEndpoints = ApiEndpoints.AMAPI
  ): Observable<any> {
    return this.httpClient.delete<any>(`${environment[api]}/${path}/${id}`);
  }

  GetMasterData(path: string): Observable<any> {
    return this.httpClient.get<any>(`${environment.amApiUrl}/${path}`);
  }

  /**
   * Conditional Audit
   **/

  GetAllConditionalAudits(path: string): Observable<IGridData> {
    return this.httpClient.get<any>(`${environment.amApiUrl}/${path}`);
  }

  DeleteAudit(path: string): Observable<any> {
    return this.httpClient.post<any>(`${environment.amApiUrl}/${path}`, null);
  }

  SaveAuditDetails(path: string, auditDetails: any): Observable<any> {
    const uploadData = new FormData();
    uploadData.append('id', auditDetails.id);
    uploadData.append('condAuditId', auditDetails.condAuditId);
    uploadData.append('auditDate', auditDetails.auditDate);
    uploadData.append('categoryId', auditDetails.categoryId);
    uploadData.append('remarks', auditDetails.remarks);
    uploadData.append('exactLocations', auditDetails.exactLocations);
    uploadData.append('beforeFile', auditDetails.beforeFile);
    uploadData.append('afterFile', auditDetails.afterFile);
    uploadData.append('beforeImageUrl', auditDetails.beforeImageUrl);
    uploadData.append('afterImageUrl', auditDetails.afterImageUrl);
    uploadData.append('resourceId', auditDetails.actionBy);
    uploadData.append('actionTaken', auditDetails.actionTaken);
    uploadData.append('status', auditDetails.status);
    return this.httpClient.post<any>(
      `${environment.amApiUrl}/${path}`,
      uploadData
    );
  }

  UpdateAuditStatus(path: string): Observable<any> {
    return this.httpClient.post<any>(`${environment.amApiUrl}/${path}`, null);
  }

  /**
   * Asset
   **/

  GetAssetDetails(path: string, data: any): Observable<IGridData> {
    return this.httpClient.post<any>(`${environment.amApiUrl}/${path}`, data);
  }

  GetAssetData(path: string): Observable<IGridData> {
    return this.httpClient.post<any>(`${environment.amApiUrl}/${path}`, null);
  }

  GetAssetById(
    path: string,
    params: any,
    api: ApiEndpoints = ApiEndpoints.AMAPI
  ): Observable<IAssetData> {
    return this.httpClient.post<IAssetData>(`${environment[api]}/${path}`, {
      params
    });
  }

  SaveAsset(path: string, asset: any): Observable<any> {
    return this.httpClient.post<any>(`${environment.amApiUrl}/${path}`, asset);
  }

  UpdateAssetStatus(path: string): Observable<any> {
    return this.httpClient.post<any>(`${environment.amApiUrl}/${path}`, null);
  }

  DeleteDoc(path: string, doc?: any) {
    return this.httpClient.delete<any>(`${environment.amApiUrl}/${path}`, {
      body: doc
    });
  }

  DeleteIdentification(
    path: string,
    identity?: any,
    api: ApiEndpoints = ApiEndpoints.AMAPI
  ) {
    return this.httpClient.post<any>(`${environment[api]}/${path}`, identity);
  }

  UploadDocs(path: string, documentModels: any[], assetId: number) {
    const uploadData = new FormData();
    for (let i = 0; i < documentModels.length; i++) {
      uploadData.append('documentModels[' + i + '].id', documentModels[i].id);
      uploadData.append(
        'documentModels[' + i + '].assetId',
        documentModels[i].assetId
      );
      uploadData.append(
        'documentModels[' + i + '].file',
        documentModels[i].file
      );
    }
    return this.httpClient.post<any>(
      `${environment.amApiUrl}/${path}`,
      uploadData,
      {
        reportProgress: true,
        responseType: 'json'
      }
    );
  }

  UploadStockIdentifications(
    path: string,
    identifications: any,
    api: ApiEndpoints = ApiEndpoints.STOCKAPI
  ) {
    const uploadData = new FormData();
    for (let i = 0; i < identifications.length; i++) {
      uploadData.append('identifications[' + i + '].id', identifications[i].id);
      uploadData.append(
        'identifications[' + i + '].stockId',
        identifications[i].stockId
      );
      uploadData.append(
        'identifications[' + i + '].type',
        identifications[i].type
      );
      uploadData.append(
        'identifications[' + i + '].file',
        identifications[i].file
      );
      uploadData.append(
        'identifications[' + i + '].clientCode',
        identifications[i].clientCode
      );
      uploadData.append(
        'identifications[' + i + '].imageUrl',
        identifications[i].imageUrl
      );
      uploadData.append(
        'identifications[' + i + '].isDefault',
        identifications[i].isDefault
      );
    }
    return this.httpClient.post<any>(
      `${environment[api]}/${path}`,
      uploadData,
      {
        reportProgress: true,
        responseType: 'json'
      }
    );
  }

  UploadIdDocs(
    path: string,
    identifications: any,
    api: ApiEndpoints = ApiEndpoints.AMAPI
  ) {
    const uploadData = new FormData();
    for (let i = 0; i < identifications.length; i++) {
      uploadData.append('identifications[' + i + '].id', identifications[i].id);
      uploadData.append(
        'identifications[' + i + '].assetId',
        identifications[i].assetId
      );
      uploadData.append(
        'identifications[' + i + '].type',
        identifications[i].type
      );
      uploadData.append(
        'identifications[' + i + '].file',
        identifications[i].file
      );
      uploadData.append(
        'identifications[' + i + '].clientCode',
        identifications[i].clientCode
      );
      uploadData.append(
        'identifications[' + i + '].imageUrl',
        identifications[i].imageUrl
      );
      uploadData.append(
        'identifications[' + i + '].isDefault',
        identifications[i].isDefault
      );
    }
    return this.httpClient.post<any>(
      `${environment[api]}/${path}`,
      uploadData,
      {
        reportProgress: true,
        responseType: 'json'
      }
    );
  }

  GetDocuments(path: string): Observable<any> {
    return this.httpClient.get<any>(`${environment.amApiUrl}/${path}`);
  }

  /**
   * PPM
   **/

  AddPpm(path: string, data: any): Observable<any> {
    return this.httpClient.post<any>(`${environment.ppmApiUrl}/${path}`, data);
  }

  UpdatePPMStatus(
    path: string,
    data: any,
    api: ApiEndpoints = ApiEndpoints.PPMAPI
  ): Observable<any> {
    return this.httpClient.post<any>(`${environment[api]}/${path}`, data);
  }

  GetDataByFilter(
    path: string,
    data: any,
    api: ApiEndpoints = ApiEndpoints.PPMAPI
  ): Observable<any> {
    return this.httpClient.post<any>(`${environment[api]}/${path}`, data);
  }

  /**
   * PPM Task Instructions
   **/

  GetTaskInstructions(): Observable<IGridData> {
    return this.httpClient.get<IGridData>(
      `${environment.ppmApiUrl}/TaskInstructions/GetAllTaskInstructions`
    );
  }

  GetTaskInstructionById(id: number): Observable<any> {
    return this.httpClient.get<any>(
      `${environment.ppmApiUrl}/TaskInstructions/GetTaskInstructionDataById?taskInstructionId=${id}`
    );
  }

  DeleteTaskInstructionById(path: string, id: number): Observable<any> {
    return this.httpClient.delete<any>(
      `${environment.ppmApiUrl}/${path}/${id}`
    );
  }

  /**
   * PPM Task Scheduler
   **/

  GetSchedulerById(
    path: string,
    api: ApiEndpoints = ApiEndpoints.PPMAPI
  ): Observable<any> {
    return this.httpClient.get<any>(`${environment[api]}/${path}`);
  }

  GetAssetForScheduler(path: string, id: number): Observable<any> {
    return this.httpClient.get<any>(
      `${environment.ppmApiUrl}/${path}/${id}`
    );
  }

  GetTaskByProjectId(id: number): Observable<any> {
    return this.httpClient.get<any>(
      `${environment.ppmApiUrl}/Scheduler/GetTasksAndResourcesByProject/${id}`
    );
  }

  /**
   * PPM Task Issuer
   **/

  GetOrUpdateIssuerData(
    path: string,
    data: any,
    api: ApiEndpoints = ApiEndpoints.PPMAPI
  ): Observable<any> {
    return this.httpClient.post<any>(`${environment[api]}/${path}`, data);
  }

  /**
   * PPM HSEQ
   **/

  GetHSEQuestions(path: string): Observable<any> {
    return this.httpClient.get<any>(`${environment.ppmApiUrl}/${path}`);
  }

  AddOrUpdateHSEQuestions(path: string, data: any): Observable<any> {
    return this.httpClient.post<any>(`${environment.ppmApiUrl}/${path}`, data);
  }

  DeleteQuestion(path: string): Observable<any> {
    return this.httpClient.delete<any>(`${environment.ppmApiUrl}/${path}`);
  }

  /**
   * PPM Feedback
   **/

  ValidateFeedBackLink(path: string): Observable<any> {
    return this.httpClient.post<any>(`${environment.ppmApiUrl}/${path}`, null);
  }

  /**
   * PPM Log
   **/

  GetLog(
    path: string,
    filterData: any,
    api: ApiEndpoints = ApiEndpoints.PPMAPI
  ): Observable<any> {
    return this.httpClient.post<any>(`${environment[api]}/${path}`, filterData);
  }

  GetTaskLog(
    path: string,
    api: ApiEndpoints = ApiEndpoints.PPMAPI
  ): Observable<any> {
    return this.httpClient.get<any>(`${environment[api]}/${path}`);
  }

  AddOrUpdateTaskLog(
    path: any,
    data: any | any[],
    api: ApiEndpoints = ApiEndpoints.PPMAPI,
    isFormData: boolean = false
  ): Observable<any> {
    if (isFormData) {
      const objData = new FormData();
      objData.append('taskId', data?.taskId);
      objData.append('taskLogId', '0');
      objData.append('rating', data?.rating);
      objData.append('comments', data?.comments);
      return this.httpClient.post<any>(`${environment[api]}/${path}`, objData);
    }
    return this.httpClient.post<any>(`${environment[api]}/${path}`, data);
  }

  ExportTaskLog(path: any, exportDetails: any): Observable<any> {
    const httpOptions = {
      responseType: 'blob' as 'json'
    };
    return this.httpClient.post<any>(
      `${environment.reportApiUrl}/${path}`,
      exportDetails,
      httpOptions
    );
  }

  GetSubTasksData(id: number): Observable<any> {
    return this.httpClient.get<any>(
      `${environment.ppmApiUrl}/TaskLogOperations/GetSubTasksData/${id}`
    );
  }
  AddOrUpdateSubTaskData(
    path: any,
    data: any,
    api: ApiEndpoints = ApiEndpoints.PPMAPI
  ): Observable<any> {
    return this.httpClient.post<any>(`${environment[api]}/${path}`, data);
  }

  deleteSubTask(
    id: number,
    api: ApiEndpoints = ApiEndpoints.PPMAPI
  ): Observable<any> {
    return this.httpClient.post<any>(
      `${environment[api]}/TaskLogOperations/AddOrUpdateSubTaskData/${id}`,
      null
    );
  }

  GetTaskLogAttachments(path: string): Observable<any> {
    return this.httpClient.get<any>(`${environment.ppmApiUrl}/${path}`);
  }

  AddOrUpdateTaskLogAttachments(
    path: string,
    attachments: any[],
    api: ApiEndpoints = ApiEndpoints.PPMAPI
  ): Observable<any> {
    const uploadData = new FormData();
    for (let i = 0; i < attachments.length; i++) {
      let type = attachments[i].type === 'Img' ? 'images' : 'documents';
      uploadData.append(type + '[' + i + '].id', attachments[i].id);
      uploadData.append(
        type + '[' + i + '].taskLogId',
        attachments[i].taskLogId
      );
      uploadData.append(type + '[' + i + '].fileName', attachments[i].fileName);
      uploadData.append(type + '[' + i + '].file', attachments[i].file);
      uploadData.append(
        type + '[' + i + '].attachmentType',
        attachments[i].type
      );
      uploadData.append(
        type + '[' + i + '].resourceUrl',
        attachments[i].resourceUrl
      );
      uploadData.append(
        type + '[' + i + '].extension',
        attachments[i].extension
      );
      if (attachments[i].type === 'Img') {
        uploadData.append(
          type + '[' + i + '].isBeforeImage',
          attachments[i].isBeforeImage
        );
      }
    }
    return this.httpClient.post<any>(`${environment[api]}/${path}`, uploadData);
  }

  DeleteTaskLogAttachments(
    path: string,
    attachment: any,
    api: ApiEndpoints = ApiEndpoints.PPMAPI
  ): Observable<any> {
    return this.httpClient.post<any>(`${environment[api]}/${path}`, attachment);
  }

  AddOrUpdateChecklistData(
    path: any,
    checklist: any,
    api: ApiEndpoints = ApiEndpoints.PPMAPI
  ): Observable<any> {
    const checkListData = new FormData();
    for (let i = 0; i < checklist.length; i++) {
      checkListData.append(
        'questionAnswers[' + i + '].taskLogId',
        checklist[i].taskLogId
      );
      checkListData.append(
        'questionAnswers[' + i + '].isCheckListItem',
        checklist[i].isCheckListItem
      );
      checkListData.append(
        'questionAnswers[' + i + '].linkId',
        checklist[i].linkId
      );
      checkListData.append(
        'questionAnswers[' + i + '].answerId',
        checklist[i].answerId
      );
      checkListData.append(
        'questionAnswers[' + i + '].comments',
        checklist[i].comments
      );
      checkListData.append(
        'questionAnswers[' + i + '].imageUrl',
        checklist[i].imageUrl
      );
      checkListData.append(
        'questionAnswers[' + i + '].file',
        checklist[i].file
      );
    }
    return this.httpClient.post<any>(
      `${environment[api]}/${path}`,
      checkListData
    );
  }

  DeleteTaskLogResourceById(
    taskLogId: any,
    resourceId: any,
    api: ApiEndpoints = ApiEndpoints.PPMAPI
  ): Observable<any> {
    return this.httpClient.post<any>(
      `${environment[api]}/TaskLogOperations/DeleteTaskLogResourceById/${taskLogId}/${resourceId}`,
      null
    );
  }

  getLocations(
    path: string,
    api: ApiEndpoints = ApiEndpoints.COREAPI
  ): Observable<any> {
    return this.httpClient.get<any>(`${environment[api]}/${path}`);
  }

  GetLocationDetailsById(
    path: string,
    locationId: any,
    isMyProfile: boolean
  ): Observable<any> {
    if (isMyProfile) {
      return this.httpClient.get<any>(`${environment.coreApiUrl}/${path}`);
    } else {
      return this.httpClient.get<any>(
        `${environment.coreApiUrl}/${path}/${locationId}`
      );
    }
  }

  DeleteLocation(path: string, locationId: any): Observable<any> {
    return this.httpClient.delete<any>(
      `${environment.coreApiUrl}/${path}/${locationId}`
    );
  }

  GetCustomers(path: string): Observable<any> {
    return this.httpClient.get<any>(`${environment.coreApiUrl}/${path}`);
  }

  GetMasterInfo(path: string, masterId: any): Observable<any> {
    return this.httpClient.get<any>(
      `${environment.coreApiUrl}/${path}/${masterId}`
    );
  }

  AddOrUpdateMaster(
    path: string,
    obj: any,
    hasImage: boolean = false,
    masterType?: MasterComponentTypes
  ): Observable<any> {
    if (hasImage) {
      const objData = new FormData();
      if (masterType === MasterComponentTypes.MAN_POWER) {
        objData.append('firstName', obj.firstName);
        objData.append('middleName', obj.middleName);
        objData.append('lastName', obj.lastName);
        objData.append('mobileNo', obj.mobileNo);
        objData.append('email', obj.email);
        objData.append('isBlueColler', obj.isBlueColler);
        objData.append('isAssignWork', obj.isAssignWork);
        objData.append('isMobileLoginAllowed', obj.isMobileLoginAllowed);
        objData.append('isWebLoginAllowed', obj.isWebLoginAllowed);
        objData.append('status', obj.status);
        objData.append('code', obj.code);
        objData.append('accountProfileId', obj.accountProfileId);
        objData.append('designationId', obj.designationId);
        objData.append('designationName', obj.designationName);
        objData.append('departmentId', obj.departmentId);
        objData.append('departmentName', obj.departmentName);
        objData.append('divisionId', obj.divisionId);
        objData.append('divisionName', obj.divisionName);
        objData.append('skillSetIds', obj.skillSetIds);
        objData.append('languageIds', obj.languageIds);
        objData.append('roleId', obj.roleId);
        objData.append('roleName', obj.roleName);
        objData.append('roleAccessId', obj.roleAccessId);
        objData.append('resourceTypeId', obj.resourceTypeId);
        objData.append('resourceUserId', obj.resourceUserId);
        objData.append('resourceTypeName', obj.resourceTypeName);
        objData.append('resourceSubTypeId', obj.resourceSubTypeId);
        objData.append('resourceSubTypeName', obj.resourceSubTypeName);
        objData.append('password', obj.password);
        objData.append('postalCode', obj.postalCode);
        objData.append('hasAdditionalEmails', obj.hasAdditionalEmails);
        objData.append('additionalEmails', obj.additionalEmails);
        objData.append('clientOrVendorSourceId', obj.clientOrVendorSourceId);
        objData.append('resourceWorkTypeId', obj.resourceWorkTypeId);
        objData.append('supervisorId', obj.supervisorId);
      } else if (masterType === MasterComponentTypes.VENDORS) {
        objData.append('uniqueId', obj.uniqueId);
        objData.append('accountId', obj.accountId);
        objData.append('serviceTypeIds', obj.serviceTypeIds);
        objData.append('vendorTypeId', obj.vendorTypeId);
        objData.append('vendorTypeName', obj.vendorTypeName);
        objData.append('code', obj.code);
        objData.append('statusId', obj.statusId);
        objData.append('statusName', obj.statusName);
        objData.append('taxNo', obj.taxNo);
        objData.append('name', obj.name);
        objData.append(
          'isPrimayVendor',
          obj.isPrimayVendor == null ? false : obj.isPrimayVendor
        );
        objData.append('contactPerson', obj.contactPerson);
        objData.append('contactPersonEmail', obj.contactPersonEmail);
        objData.append('contactPersonMobileCode', obj.alternateMobileCode);
        objData.append(
          'contactPersonMobileNumber',
          obj.contactPersonMobileNumber
        );
        objData.append('countryName', obj.countryName);
        objData.append('stateName', obj.stateName);
        objData.append('cityName', obj.cityName);
        objData.append('zipCode', obj.zipCode == null ? '' : obj.zipCode);
        objData.append('mainEmail', obj.mainEmail);
        objData.append('mobileCode', obj.mobileCode);
        objData.append('mobileNumber', obj.mobileNumber);
        objData.append('landLineCode', obj.landLineCode);
        objData.append('landLineNumber', obj.landLineNumber);
        objData.append('faxNoCode', obj.faxNoCode);
        objData.append('faxNumber', obj.faxNumber);
        objData.append(
          'tollFreeNumber',
          obj.tollFreeNumber == null ? '' : obj.tollFreeNumber
        );
        objData.append('latitude', obj.latitude);
        objData.append('longitude', obj.longitude);
        objData.append('isActive', obj.isActive);
      } else if (masterType === MasterComponentTypes.CUSTOMERS) {
        objData.append('accountId', obj.accountId);
        objData.append('uniqueId', obj.uniqueId);
        objData.append('code', obj.code);
        objData.append('customerTypeId', obj.customerTypeId);
        objData.append('customerTypeName', obj.customerTypeName);
        objData.append('customerSubTypeId', obj.customerSubTypeId);
        objData.append('customerSubTypeName', obj.customerSubTypeName);
        objData.append('firstName', obj.firstName);
        objData.append('middleName', obj.middleName);
        objData.append('lastName', obj.lastName);
        objData.append('dob', obj.dob);
        objData.append(
          'nationalityId',
          obj.nationalityId == null ? '' : obj.nationalityId
        );
        objData.append('nationalityName', obj.nationalityName);
        objData.append('gender', obj.gender);
        objData.append('isMobileLoginAllowed', obj.isMobileLoginAllowed);
        objData.append('isWebLoginAllowed', obj.isWebLoginAllowed);
        objData.append('streetName', obj.streetName);
        objData.append('postalCode', obj.postalCode);
        objData.append('contactMobileCode', obj.contactMobileCode);
        objData.append('contactMobileNumber', obj.contactMobileNumber);
        objData.append('contactEmail', obj.contactEmail);
        objData.append('contactMobileCode1', obj.contactMobileCode1);
        objData.append('contactMobileNumber1', obj.contactMobileNumber1);
        objData.append('alternativeEmail1', obj.alternativeEmail1);
        objData.append('contactMobileCode2', obj.contactMobileCode2);
        objData.append('contactMobileNumber2', obj.contactMobileNumber2);
        objData.append('alternativeEmail2', obj.alternativeEmail2);
        objData.append('contactLandLineCode', obj.contactLandLineCode);
        objData.append('contactLandLineNumber', obj.contactLandLineNumber);
        objData.append('contactFaxNumberCode', obj.contactFaxNumberCode);
        objData.append('contactFaxNumberNumber', obj.contactFaxNumberNumber);
        objData.append('emergencyContactName', obj.emergencyContactName);
        objData.append(
          'emergencyContactLastName',
          obj.emergencyContactLastName
        );
        objData.append(
          'emergencyContactRelationShip',
          obj.emergencyContactRelationShip
        );
        objData.append(
          'emergencyContactMobileCode',
          obj.emergencyContactMobileCode
        );
        objData.append(
          'emergencyContactMobileNumber',
          obj.emergencyContactMobileNumber
        );
        objData.append('emergencyContactEmail', obj.emergencyContactEmail);
        objData.append('zoneId', obj.zoneId);
        objData.append('zoneName', obj.zoneName);
        objData.append('buildingId', obj.buildingId);
        objData.append('buildingName', obj.buildingName);
        objData.append('floorId', obj.floorId);
        objData.append('floorName', obj.floorName);
        objData.append('unitId', obj.unitId);
        objData.append('unitName', obj.unitName);
        objData.append('isOccupant', obj.isOccupant);
        objData.append('customerAccessMethodId', obj.customerAccessMethodId);
        objData.append('refCode1', obj.refCode1 == null ? '' : obj.refCode1);
        objData.append('refCode2', obj.refCode2 == null ? '' : obj.refCode2);
        objData.append('interests', obj.interests);
        objData.append('status', obj.status);
        objData.append('isVIP', obj.isVIP);
      }
      objData.append('id', obj.id);
      objData.append('mobileCode', obj.mobileCode);
      objData.append('countryId', obj.countryId);
      objData.append('stateId', obj.stateId);
      objData.append('cityId', obj.cityId);
      objData.append('streetNo', obj.streetNo == null ? '' : obj.streetNo);
      objData.append(
        'streetName',
        obj.streetName == null ? '' : obj.streetName
      );
      objData.append('landmark', obj.landmark == null ? '' : obj.landmark);
      objData.append('imageUrl', obj.imageUrl);
      objData.append('image', obj.image);

      return this.httpClient.post<any>(
        `${environment.coreApiUrl}/${path}`,
        objData
      );
    } else {
      return this.httpClient.post<any>(
        `${environment.coreApiUrl}/${path}`,
        obj
      );
    }
  }

  DeleteCustomer(path: string, customerId: any): Observable<any> {
    return this.httpClient.post<any>(
      `${environment.coreApiUrl}/${path}/${customerId}`,
      null
    );
  }

  getProjectPrivileges(projectId: number): Observable<any> {
    return this.httpClient.post<any>(
      `${environment.coreApiUrl}/Project/ProjectPrivileges?projectId=${projectId}`,
      null
    );
  }

  getProjectBuildings(projectId: number, path: string): Observable<any> {
    return this.httpClient.get<any>(
      `${environment.coreApiUrl}/${path}/${projectId}`
    );
  }

  AddOrUpdatePrivileges(path: string, privilege: any): Observable<any> {
    return this.httpClient.post<any>(
      `${environment.coreApiUrl}/${path}`,
      privilege
    );
  }

  /**Stocks **/
  GetStockList(path: string): Observable<IGridData> {
    return this.httpClient.get<any>(`${environment.stockApiUrl}/${path}`);
  }

  AddOrUpdateStock(path: string, stock: any): Observable<any> {
    const stockData = new FormData();
    stockData.append('id', stock.id);
    stockData.append('name', stock.name);
    stockData.append('code', stock.code);
    stockData.append('sparePartCode', stock.sparePartCode);
    stockData.append(
      'clientCode',
      stock.clientCode == null ? '' : stock.clientCode
    );
    stockData.append('groupId', stock.groupId);
    stockData.append('subGroupId', stock.subGroupId);
    stockData.append('stockClassId', stock.stockClassId);
    stockData.append(
      'manufacturer',
      stock.manufacturer == null ? '' : stock.manufacturer
    );
    stockData.append(
      'productCode',
      stock.productCode == null ? '' : stock.productCode
    );
    stockData.append('model', stock.model == null ? '' : stock.model);
    stockData.append('serialNo', stock.serialNo == null ? '' : stock.serialNo);
    stockData.append('vendorId', stock.vendorId == null ? '' : stock.vendorId);
    stockData.append('remarks', stock.remarks == null ? '' : stock.remarks);
    stockData.append('buildingId', stock.buildingId);
    stockData.append('projectId', stock.projectId);
    stockData.append('floorId', stock.floorId);
    stockData.append('unitId', stock.unitId);
    stockData.append('roomId', stock.roomId);
    stockData.append('financeCodeId', stock.financeCodeId);
    stockData.append('costCenterId', stock.costCenterId);
    stockData.append('costCodeId', stock.costCodeId);
    stockData.append('calculationMethodId', stock.calculationMethodId);
    stockData.append('availableStock', stock.availableStock);
    stockData.append('uOMId', stock.uomId == null ? '' : stock.uomId);
    stockData.append('packSize', stock.packSize);
    stockData.append('unitPrice', stock.unitPrice);
    stockData.append('totalPrice', stock.totalPrice);
    stockData.append('isTaxApplicable', stock.isTaxApplicable);
    stockData.append(
      'reOrderQuantity',
      stock.reOrderQuantity == null ? '' : stock.reOrderQuantity
    );
    stockData.append(
      'reOrderLevel',
      stock.reOrderLevel == null ? '' : stock.reOrderLevel
    );
    stockData.append('currencyCode', stock.currencyCode);
    stockData.append('image', stock.image ?? '');

    return this.httpClient.post<any>(
      `${environment.stockApiUrl}/${path}`,
      stockData
    );
  }

  DeleteMasterStock(path: string, id: number): Observable<any> {
    return this.httpClient.delete<any>(
      `${environment.stockApiUrl}/${path}/${id}`
    );
  }

  GetStockGeneralInfoById(path: string): Observable<IGridData> {
    return this.httpClient.get<any>(`${environment.stockApiUrl}/${path}`);
  }

  saveStockIssued(path: string, stock: any): Observable<any> {
    const stockIssued = new FormData();
    stockIssued.append('stockIssuedData.id', stock?.id);
    stockIssued.append('stockIssuedData.issueDate', (new Date()).toUTCString());
    stockIssued.append('stockIssuedData.issuedById', '0');
    stockIssued.append('stockIssuedData.issuedByName', stock.issuedBy);
    stockIssued.append('stockIssuedData.projectId', stock.project?.id);
    stockIssued.append('stockIssuedData.mrNumberId', stock.mrNumberId??'');
    stockIssued.append('stockIssuedData.workOrderType', stock.workOrderType?.id ?? stock.workOrderType);
    stockIssued.append('stockIssuedData.jobNumberId', stock.workOrderNo?.taskLogId ?? stock.workOrderNo);
    stockIssued.append('stockIssuedData.jobNumber', '');
    stockIssued.append(
      'stockIssuedData.serviceReportNo',
      stock.serviceReportNo == null ? '' : stock.serviceReportNo
    );
    stockIssued.append(
      'stockIssuedData.serviceReportDate',
      stock.serviceReportDate == null ? '' : stock.serviceReportDate
    );
    stockIssued.append('stockIssuedData.projectId', stock.project?.id);
    stockIssued.append('stockIssuedData.approvedById', stock.approverId?.id);
    stockIssued.append('stockIssuedData.collectedById', stock.employeeId?.id);
    stockIssued.append(
      'stockIssuedData.collectionDate',
      stock.dateOfCollection
    );
    stockIssued.append(
      'stockIssuedData.digitalSignature',
      stock.digitalSignature ?? ''
    );
    stockIssued.append('stockIssuedData.signatureImage', stock.signatureImage);
    stockIssued.append(
      'stockIssuedData.comments',
      stock.comments == null ? '' : stock.comments
    );

    for (let i = 0; i < stock.stockIssuedItems.length; i++) {
      stockIssued.append(
        'stockIssuedItems[' + i + '].id','0'
      );
      stockIssued.append('stockIssuedItems[' + i + '].stockIssuedId', stock.id);
      stockIssued.append(
        'stockIssuedItems[' + i + '].stockGroupId',
        stock.stockIssuedItems[i].group?.id ?? stock.stockIssuedItems[i].group
      );
      stockIssued.append(
        'stockIssuedItems[' + i + '].stockId',
        stock.stockIssuedItems[i].stockId
      );
      stockIssued.append(
        'stockIssuedItems[' + i + '].issuedQty',
        stock.stockIssuedItems[i].issuedQty ?? 0
      );
      stockIssued.append(
        'stockIssuedItems[' + i + '].previousIssuedQty',
        stock.stockIssuedItems[i].previousIssuedQty
      );
      stockIssued.append(
        'stockIssuedItems[' + i + '].availableQty',
        stock.stockIssuedItems[i].availableQty
      );
      stockIssued.append(
        'stockIssuedItems[' + i + '].requestedQty',
        stock.stockIssuedItems[i].requestedQty
      );
      stockIssued.append(
        'stockIssuedItems[' + i + '].issuedAmount',
        (stock.stockIssuedItems[i].totalPrice ?? 0)
      );
      stockIssued.append(
        'stockIssuedItems[' + i + '].remarks',
        stock.stockIssuedItems[i].remarks == null
          ? ''
          : stock.stockIssuedItems[i].remarks
      );
    }
    return this.httpClient.post<any>(
      `${environment.stockApiUrl}/${path}`,
      stockIssued
    );
  }

  /**Procurement **/
  getProcurementById(path: string, procurementId: any): Observable<any> {
    return this.httpClient.get<any>(
      `${environment.stockApiUrl}/${path}/${procurementId}`
    );
  }

  addProcurement(path: string, procurement: any): Observable<any> {
    return this.httpClient.post<any>(
      `${environment.stockApiUrl}/${path}`,
      procurement
    );
  }

  approveProcurement(path: string, procurementId: any): Observable<any> {
    return this.httpClient.post<any>(
      `${environment.stockApiUrl}/${path}/${procurementId}`,
      null
    );
  }

  /**Scheduled Tasks **/
  scheduledTaskData(path: any, id: any): Observable<any> {
    return this.httpClient.get<any>(
      `${environment.scheduledTaskApiUrl}/${path}/${id}`
    );
  }

  getScheduledDataByProject(path: any, projectId: any): Observable<any> {
    return this.httpClient.get<any>(
      `${environment.scheduledTaskApiUrl}/${path}/${projectId}`
    );
  }

  addOrUpdateScheduledTask(path: string, task: any): Observable<any> {
    return this.httpClient.post<any>(
      `${environment.scheduledTaskApiUrl}/${path}`,
      task
    );
  }

  GetScheduledTasks(path: string, task: any): Observable<any> {
    return this.httpClient.post<any>(
      `${environment.scheduledTaskApiUrl}/${path}`,
      task
    );
  }

  getMrDetails(path: string): Observable<any> {
    return this.httpClient.get<any>(
      `${environment.stockApiUrl}/${path}`
    )
  }
  getMrDetailsInfo(path:string, projectId:number, workOderId:number): Observable<any> {
    return this.httpClient.get<any>(
      `${environment.stockApiUrl}/${path}/${projectId}/${workOderId}`
    )
  }
  getProjects(path:string): Observable<any> {
    return this.httpClient.get<any>(
      `${environment.coreApiUrl}/${path}`
    )
  }
  getReports(path:string,projectId:number,year:number,month:number): Observable<any> {
    return this.httpClient.get<any>(
      `${environment.reportApiUrl}/${path}/${projectId}/${year}/${month}`
    )
  }

  getReportsForDashboard(path:string,data: any): Observable<any> {
    return this.httpClient.post<any>(
      `${environment.reportApiUrl}/${path}`, data
    )
  }
  StockIssuedAdditionalDetails(path:string, stockIssuedId:number, projectId:number): Observable<any> {
    return this.httpClient.get<any>(
      `${environment.stockApiUrl}/${path}/${stockIssuedId}/${projectId}`
    )
  }
  getMrDetailsByNumber(path:string, mrCode:number, projectId:number): Observable<any> {
    return this.httpClient.get<any>(
      `${environment.stockApiUrl}/${path}/${mrCode}/${projectId}`
    )
  }
  getMRWorkOrderDetails(path:string, mrId:number) : Observable<any> {
    return this.httpClient.get<any>(
      `${environment.stockApiUrl}/${path}/${mrId}`
    )
  }
  getMRDetails(path:string, mrId:number, projectId: number) : Observable<any> {
    return this.httpClient.get<any>(
      `${environment.stockApiUrl}/${path}/${mrId}/${projectId}`
    )
  }
  getStockIssueDetails(path:string, stockId:number, issuingQuantity: number) : Observable<any> {
    return this.httpClient.get<any>(
      `${environment.stockApiUrl}/${path}/${stockId}/${issuingQuantity}`
    )
  }

  GetAssignedUsers(
    Id: number
  ): Observable<any> {
    return this.httpClient.get<any>(`${environment.hrmsApiUrl}/Masters/HRResourcesGroup?groupId=${Id}`);
  }

  GetHrGroups(
    path:string
  ): Observable<any> {
    return this.httpClient.get<any>(`${environment.hrmsApiUrl}/${path}`);
  }

  AddOrRemoveUsersToGroup(
    groupId: number,
    resourceIds:string,
    IsAddRequest:boolean
  ): Observable<any> {
    const uploadData = JSON.stringify({'groupId':groupId,'resourceIds':resourceIds,'IsAddRequest': IsAddRequest});
    const headers = new HttpHeaders({
      'Content-Type': 'application/json-patch+json'
    });
    return this.httpClient.post<any>(`${environment.hrmsApiUrl}/Masters/AddOrRemoveResourceHRGroups`,uploadData, {headers});
  }
  getAnnouncementDetails(path:string,anctId:number): Observable<any> {
    return this.httpClient.get<any>(`${environment.hrmsApiUrl}/${path}/${anctId}`);
  }

  downloadXLReport(path:any, exportDetails:any): Observable<any> {
    const httpOptions = {
      responseType: 'blob' as 'json'
    };
    return this.httpClient.post<any>(
      `${environment.reportApiUrl}/${path}`,
      exportDetails,
      httpOptions
    );
  }
  
  getAssetDataById(
    path: string,
    assetId: any,
    api: ApiEndpoints = ApiEndpoints.AMAPI
  ): Observable<any> {
    return this.httpClient.get<any>(`${environment[api]}/${path}/${assetId}` );
  }
}
