import { Component, OnInit } from '@angular/core';
import { CommonComponent } from 'src/app/components/common/common.component';
import { LocalizedDatePipe } from 'src/app/pipes/localized-date.pipe';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends CommonComponent implements OnInit {
  isCollapsed: boolean = true;
  isDemoVersion: boolean = false;
  public range = { start: new Date(2023, 8, 4), end: new Date(2023, 8, 10) };

  g1Data = {
    title: 'Projects Vs Months',
    displayType: 9,
    legends: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    series: [
      {
        name: 'Project 1',
        data: [
          {
            name: ' Fire Curtain',
            value: 10
          },
          {
            name: '2 Tier Db Rack',
            value: 50
          },
          {
            name: '2 Tier Db Rack Small',
            value: 40
          },
          {
            name: ' Fire Curtain',
            value: 76
          },
          {
            name: '2 Tier Db Rack',
            value: 90
          },
          {
            name: '2 Tier Db Rack Small',
            value: 140
          },
          {
            name: ' Fire Curtain',
            value: 170
          },
          {
            name: '2 Tier Db Rack',
            value: 150
          },
          {
            name: '2 Tier Db Rack Small',
            value: 190
          }
        ]
      },
      {
        name: 'Project 2',
        data: [
          {
            name: '1Watt LED Recess Mounted Exit Light-6No',
            value: 130
          },
          {
            name: '1Watt LED S.Mounted Exit Light-42No',
            value: 58
          },
          {
            name: ' Fire Curtain',
            value: 96
          },
          {
            name: '2 Tier Db Rack',
            value: 190
          },
          {
            name: '2 Tier Db Rack Small',
            value: 140
          },
          {
            name: ' Fire Curtain',
            value: 190
          },
          {
            name: '2 Tier Db Rack',
            value: 240
          },
          {
            name: '2 Tier Db Rack Small',
            value: 300
          },
          {
            name: '2 Tier Db Rack Small',
            value: 350
          }
        ]
      },
      {
        name: 'Project 3',
        data: [
          {
            name: '22V M V Switchgear',
            value: 150
          },
          {
            name: ' Fire Curtain',
            value: 36
          },
          {
            name: '2 Tier Db Rack',
            value: 60
          },
          {
            name: '2 Tier Db Rack Small',
            value: 120
          },
          {
            name: ' Fire Curtain',
            value: 150
          },
          {
            name: '2 Tier Db Rack',
            value: 170
          },
          {
            name: '2 Tier Db Rack Small',
            value: 210
          },
          {
            name: '2 Tier Db Rack Small',
            value: 280
          },
          {
            name: '2 Tier Db Rack Small',
            value: 200
          }
        ]
      },
      {
        name: 'Project 4',
        data: [
          {
            name: '2M H.265 NW Box Camera',
            value: 80
          },
          {
            name: '2M H.265 NW IR Bullet Camera',
            value: 55
          },
          {
            name: '2M H.265 NW IR Dome Camera',
            value: 130
          },
          {
            name: '2MP Full HD IR Dome',
            value: 160
          },
          {
            name: '2M H.265 NW Box Camera',
            value: 134
          },
          {
            name: '2M H.265 NW IR Bullet Camera',
            value: 167
          },
          {
            name: '2M H.265 NW IR Dome Camera',
            value: 220
          },
          {
            name: '2MP Full HD IR Dome',
            value: 140
          },
          {
            name: '2 Tier Db Rack Small',
            value: 270
          }
        ]
      }
    ]
  };
  g2Data = {
    title: 'Assets by System by Project',
    displayType: 2,
    categories: [
      'Al Bahr Tower',
      'Court Yard Mall -Riyadh City',
      'Addax Tower (COL Community)',
      'Maze Tower'
    ],
    series: [
      {
        name: 'Fire Curtain',
        data: [
          {
            name: 'Fire Curtain',
            value: 6
          },
          {
            name: 'Fire Curtain',
            value: 1
          },
          {
            name: 'Fire Curtain',
            value: 1
          },
          {
            name: 'Fire Curtain',
            value: 4
          }
        ]
      },
      {
        name: '1Watt LED Recess Mounted Exit Light-6No',
        data: [
          {
            name: '1Watt LED Recess Mounted Exit Light-6No',
            value: 1
          },
          {
            name: '1Watt LED Recess Mounted Exit Light-6No',
            value: 2
          },
          {
            name: '1Watt LED Recess Mounted Exit Light-6No',
            value: 4
          },
          {
            name: '1Watt LED Recess Mounted Exit Light-6No',
            value: 3
          }
        ]
      },
      {
        name: '2 Tier Db Rack Small',
        data: [
          {
            name: '2 Tier Db Rack Small',
            value: 14
          },
          {
            name: '2 Tier Db Rack Small',
            value: 3
          },
          {
            name: '2 Tier Db Rack Small',
            value: 11
          },
          {
            name: '2 Tier Db Rack Small',
            value: 6
          }
        ]
      },
      {
        name: '22V M V Switchgear',
        data: [
          {
            name: '22V M V Switchgear',
            value: 7
          },
          {
            name: '22V M V Switchgear',
            value: 67
          },
          {
            name: '22V M V Switchgear',
            value: 230
          },
          {
            name: '22V M V Switchgear',
            value: 10
          }
        ]
      }
    ]
  };
  g3Data = {
    title: 'Assets System by Project',
    displayType: 5,
    categories: ['Planned', 'Issued', 'WP', 'Completed'],
    series: [1, 2, 3, 5]
  };
  g4Data = {
    title: 'Reactive W/O by Status',
    displayType: 3,
    categories: ['Jan', 'Feb', 'Mar'],
    series: [
      {
        name: 'Active',
        data: [
          {
            name: 'Active',
            value: 6
          },
          {
            name: 'Active',
            value: 1
          },
          {
            name: 'Active',
            value: 1
          }
        ]
      },
      {
        name: 'Assigned',
        data: [
          {
            name: 'Assigned',
            value: 1
          },
          {
            name: 'Assigned',
            value: 1
          },
          {
            name: 'Assigned',
            value: 4
          }
        ]
      },
      {
        name: 'Completed',
        data: [
          {
            name: 'Completed',
            value: 3
          },
          {
            name: 'Completed',
            value: 6
          },
          {
            name: 'Completed',
            value: 2
          }
        ]
      }
    ]
  };
  g5Data = {
    title: 'Corrective W/O by Status',
    displayType: 3,
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    series: [
      {
        name: 'Active',
        data: [
          {
            name: 'Active',
            value: 6
          },
          {
            name: 'Active',
            value: 1
          },
          {
            name: 'Active',
            value: 1
          },
          {
            name: 'Active',
            value: 3
          },
          {
            name: 'Active',
            value: 8
          },
          {
            name: 'Active',
            value: 2
          }
        ]
      },
      {
        name: 'Assigned',
        data: [
          {
            name: 'Assigned',
            value: 1
          },
          {
            name: 'Assigned',
            value: 3
          },
          {
            name: 'Assigned',
            value: 4
          },
          {
            name: 'Assigned',
            value: 5
          },
          {
            name: 'Assigned',
            value: 7
          },
          {
            name: 'Assigned',
            value: 2
          }
        ]
      },
      {
        name: 'Completed',
        data: [
          {
            name: 'Completed',
            value: 3
          },
          {
            name: 'Completed',
            value: 6
          },
          {
            name: 'Completed',
            value: 2
          },
          {
            name: 'Completed',
            value: 7
          },
          {
            name: 'Completed',
            value: 2
          },
          {
            name: 'Completed',
            value: 1
          }
        ]
      }
    ]
  };
  g6Data = {
    title: 'Stock By Cost',
    displayType: 7,
    categories: [
      'Stock A',
      'Stock B',
      'Stock C',
      'Stock D',
      'Stock E',
      'Stock F',
      'Stock G'
    ],
    series: [
      {
        name: 'Stocks',
        data: [10, 42, 28, 38, 10, 22, 9]
      }
    ]
  };
  g7Data = {
    title: 'Stock Consumed',
    displayType: 7,
    categories: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ],
    series: [
      {
        name: 'Project 1',
        data: [10, 30, 54, 84, 132, 76]
      },
      {
        name: 'Project 2',
        data: [12, 43, 74, 149, 182, 132]
      },
      {
        name: 'Project 3',
        data: [215, 142, 128, 99, 84, 62]
      }
    ]
  };
  graphs: any[] = [];
  constructor(
    private themeService: ThemeService,
    private apiService: ApiService,
    private localizedPipe: LocalizedDatePipe,
    protected override dataService: DataService
  ) {
    super(dataService);
    this.isDemoVersion = this.themeService.isDemoVersion();
    let startDate = new Date();
    let endDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    this.range = { start: startDate, end: endDate };
  }

  ngOnInit(): void {
    this.dataService.currentAccount.subscribe(data => {
      this.dateRangeChanged();
    });
  }

  dateRangeChanged(){
    // this.apiService
    //   .getReportsForDashboard('DashBoard/DashBoardGraphs', {
    //     startDate: this.localizedPipe.transform(
    //       this.range.start,
    //       'MM-dd-yyyy HH:mm:ss'
    //     ),
    //     endDate: this.localizedPipe.transform(this.range.end, 'MM-dd-yyyy HH:mm:ss')
    //   })
    //   .subscribe((result: any) => {
    //     if (result) {
    //       this.graphs = result;
    //     }
    //     // this.graphs.unshift(this.g1Data);
    //     this.graphs.splice(2, 0, this.g3Data);
    //     this.graphs.push(this.g7Data);
    //   });
  }

  protected override buttonClicked(buttonType: any): void {
    throw new Error('Method not implemented.');
  }
}
