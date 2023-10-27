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
    title: 'Projects',
    displayType: 9,
    legends: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    series: [
      {
        name: 'Project 1',
        data: [
          {
            name: ' Fire Curtain',
            value: 70
          },
          {
            name: '2 Tier Db Rack',
            value: 63
          },
          {
            name: '2 Tier Db Rack Small',
            value: 52
          },
          {
            name: ' Fire Curtain',
            value: 46
          },
          {
            name: '2 Tier Db Rack',
            value: 38
          },
          {
            name: '2 Tier Db Rack Small',
            value: 25
          }
        ]
      },
      {
        name: 'Project 2',
        data: [
          {
            name: '1Watt LED Recess Mounted Exit Light-6No',
            value: 65
          },
          {
            name: '1Watt LED S.Mounted Exit Light-42No',
            value: 52
          },
          {
            name: ' Fire Curtain',
            value: 44
          },
          {
            name: '2 Tier Db Rack',
            value: 30
          },
          {
            name: '2 Tier Db Rack Small',
            value: 25
          },
          {
            name: ' Fire Curtain',
            value: 10
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
    title: 'Stock Consumed',
    displayType: 5,
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
    series: [0, 200, 400, 600, 800, 1000]
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
  g8Data = {
    title : 'Workorder by Status',
    displayType: 8,
    categories: [],
    series: [
      {
        data:[100, 123, 234, 343]
      },
      {
        data : [120, 67, 231, 196]
      },
      {
        data : [45, 124, 189, 143]
      },
      {
        data : [87, 154, 210, 215]
      }
    ]
  }
  graphs: any[] = [];
  
  // @ViewChild('mapContainer', { static: false })
  // gmap!: ElementRef;
  // map!: google.maps.Map;
  // lat = 40.73061;
  // lng = -73.935242;

  // coordinates = new google.maps.LatLng(this.lat, this.lng);

  // mapOptions: google.maps.MapOptions = {
  //   center: this.coordinates,
  //   zoom: 8
  // };

  // marker = new google.maps.Marker({
  //   position: this.coordinates,
  //   map: this.map,
  // });

  // ngAfterViewInit() {
    // this.mapInitializer();
  // }

  // lat = 22.4064172;

  // long = 69.0750171;

  // zoom=7;

  // google maps zoom level
  zoom: number = 8;
 
  // initial center position for the map
  lat: number = 51.673858;
  lng: number = 7.815982;
 
  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
  }
 
  markers = [
      {
          lat: 51.673858,
          lng: 7.815982,
          label: "A",
          draggable: true
      },
      {
          lat: 51.373858,
          lng: 7.215982,
          label: "B",
          draggable: false
      },
      {
          lat: 51.723858,
          lng: 7.895982,
          label: "C",
          draggable: true
      }
  ]

  // markers = [
  //   {
  //     position: new google.maps.LatLng(40.73061, 73.935242),
  //     map: this.map,
  //     title: "Marker 1"
  //   },
  //   {
  //     position: new google.maps.LatLng(32.06485, 34.763226),
  //     map: this.map,
  //     title: "Marker 2"
  //   }
  // ];
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
  mapInitializer() {
    // this.map = new google.maps.Map(this.gmap.nativeElement, this.mapOptions);

    //Adding Click event to default marker
    // this.marker.addListener("click", () => {
    //   const infoWindow = new google.maps.InfoWindow({
    //     content: this.marker.getTitle()!
    //   });
    //   infoWindow.open(this.marker.getMap()!, this.marker);
    // });

    // //Adding default marker to map
    // this.marker.setMap(this.map);

    //Adding other markers
    this.loadAllMarkers();
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

  loadAllMarkers (): void {
    this.markers.forEach(markerInfo => {
      //Creating a new marker object
      // const marker = new google.maps.Marker({
      //   ...markerInfo
      // });

      //creating a new info window with markers info
      // const infoWindow = new google.maps.InfoWindow({
      //   content: marker.getTitle()!
      // });

      //Add click event to open info window on marker
      // marker.addListener("click", () => {
      //   infoWindow.open(marker.getMap()!, marker);
      // });

      //Adding marker to google map
      // marker.setMap(this.map);
    });
  }
}
