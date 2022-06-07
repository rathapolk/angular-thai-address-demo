import { Component } from '@angular/core';
import { District, districts } from 'src/consts/districts';
import { Province, provinces } from 'src/consts/provinces';
import { Subdistrict, subdistricts } from 'src/consts/subdistricts';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  availableProvinces: Province[];
  availableDistricts: District[];
  availableSubdistricts: Subdistrict[];

  postcode = '';
  postcodeValid = false;

  selectedProvince = '';
  selectedDistrict = '';
  selectedSubdistrict = '';

  constructor() {
    this.availableProvinces = provinces;
    this.availableDistricts = [];
    this.availableSubdistricts = [];
  }

  onPostcodeUpdate(value: string) {
    this.postcode = value;

    if (this.postcode.length !== 5) {
      this.postcodeValid = false;
      this.updateAvailableProvinces();
      return;
    }

    this.postcodeValid = true;
    // find subdistricts from postcode
    const subdistrictCandidates = subdistricts.filter(s => s.postcodes.includes(this.postcode));
    if (subdistrictCandidates.length > 0) {
      const provinceCandidates = subdistrictCandidates.reduce<string[]>((prev, curr) => {
        if (!prev.includes(curr.provinceId)) {
          return [curr.provinceId, ...prev];
        }
        return prev;
      }, []);

      const districtCandidates = subdistrictCandidates.reduce<string[]>((prev, curr) => {
        if (!prev.includes(curr.districtId)) {
          return [curr.districtId, ...prev];
        }
        return prev;
      }, []);

      console.log('provinceCandidates', provinceCandidates);
      console.log('districtCandidates', districtCandidates);
      console.log('subdistrictCandidates', subdistrictCandidates);

      this.updateAvailableProvinces(provinceCandidates, districtCandidates);
    }
  }

  onProvinceChange() {
    this.selectedDistrict = '';
    this.selectedSubdistrict = '';
    this.updateAvailableDistricts();
  }

  onDistrictChange() {
    this.selectedSubdistrict = '';
    this.updateAvailableSubdistricts();
  }

  private updateAvailableProvinces(provinceCandidates?: string[], districtCandidates?: string[], subdistrictCandidatess?: string[]) {
    if (provinceCandidates) {
      this.availableProvinces = provinces.filter(p => provinceCandidates.includes(p.id));
      if (this.availableProvinces.length == 1) {
        this.selectedProvince = this.availableProvinces[0].id;
      }
      this.selectedDistrict = '';
      this.updateAvailableDistricts(districtCandidates, subdistrictCandidatess);
      return;
    }

    this.availableProvinces = provinces;
    if (this.availableProvinces.length == 1) {
      this.selectedProvince = this.availableProvinces[0].id;
    }
    this.selectedDistrict = '';
    this.updateAvailableDistricts();
  }

  private updateAvailableDistricts(districtCandidates?: string[], subdistrictCandidatess?: string[]) {
    if (districtCandidates) {
      this.availableDistricts = districts.filter(d => districtCandidates.includes(d.id));
      if (this.availableDistricts.length == 1) {
        this.selectedDistrict = this.availableDistricts[0].id;
      }
      this.selectedSubdistrict = '';
      this.updateAvailableSubdistricts(subdistrictCandidatess);
      return;
    }

    if (this.selectedProvince === '') {
      this.availableDistricts = [];
      this.availableSubdistricts = [];
      return;
    }
    this.availableDistricts = districts.filter(d => d.provinceId == this.selectedProvince);
    this.selectedSubdistrict = '';
    this.updateAvailableSubdistricts();
  }

  private updateAvailableSubdistricts(subdistrictCandidates?: string[]) {
    if (subdistrictCandidates) {
      this.availableSubdistricts = subdistricts.filter(s => subdistrictCandidates.includes(s.id));
      if (this.availableSubdistricts.length == 1) {
        this.selectedSubdistrict = this.availableSubdistricts[0].id;
      }
      return;
    }

    if (this.selectedDistrict === '') {
      this.availableSubdistricts = [];
      return;
    }
    this.availableSubdistricts = subdistricts.filter(s => s.districtId == this.selectedDistrict);
    if (this.availableSubdistricts.length == 1) {
      this.selectedSubdistrict = this.availableSubdistricts[0].id;
    }
  }
}
