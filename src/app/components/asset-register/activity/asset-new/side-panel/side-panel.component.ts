import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss']
})
export class SidePanelComponent {
  assetData: any = {
    floorName: 'Floor',
    buildingName: 'Building',
    unitOrSpaceName: 'Unit or Space',
    roomName: 'room'
  };

  assetDefaultImg: string = "url('assets/images/no-image3.jpeg')";
  qrImg: string = 'assets/images/noqrimage-SM.png';

  @Input() tabId: number = 1;
  @Input() isNew: boolean = false;
  @Input() widgetData: any;

  constructor() {}

  updateQr(qrImg: any): void {
    if (qrImg !== undefined && qrImg !== '') {
      this.qrImg = qrImg;
    }
  }

  setAssetDefaultImg(imageUrl: any): void {
    this.assetDefaultImg = `url('${imageUrl}')`;
  }
}
