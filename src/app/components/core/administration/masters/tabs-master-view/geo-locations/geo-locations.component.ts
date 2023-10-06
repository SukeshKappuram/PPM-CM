import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-geo-locations',
  templateUrl: './geo-locations.component.html',
  styleUrls: ['./geo-locations.component.scss']
})
export class GeoLocationsComponent {
  locationForm!: FormGroup;
  geoCoordinates!: FormGroup;
  @Input() latitude: number = 0;
  @Input() longitude: number = 0;
  constructor(private fb: FormBuilder) {
    this.geoCoordinates = this.fb.group({
      latitude: [this.latitude, Validators.required],
      longitude: [this.longitude, Validators.required]
    });
    this.geoCoordinates.valueChanges.subscribe(() => {});
    this.locationForm = this.fb.group({
      contract: [],
      building: [],
      location: []
    });
  }

  getFormData(): any{
    return this.geoCoordinates.value;
  }

  public defaultItem(text : string): any{
    return {
      code: "Select",
      name: text,
    };
  }
}
