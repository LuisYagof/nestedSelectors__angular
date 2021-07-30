import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { switchMap, tap } from "rxjs/operators";

import { CountriesService } from '../../services/countries.service';
import { CountrySmall } from '../../interfaces/countries.interface';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  myForm: FormGroup = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required],
  })

  regions: string[] = []
  countries: CountrySmall[] = []
  // borders: string[] = []
  borders: CountrySmall[] = []

  // UI
  loading: Boolean = false

  constructor(private fb: FormBuilder, private cs: CountriesService) { }

  ngOnInit(): void {
    this.regions = this.cs.regions

    // this.myForm.get('region')?.valueChanges
    //   .subscribe(region => {
    //     console.log(region)
    //     this.cs.getCountriesByRegion(region)
    //       .subscribe(countries => {
    //         this.countries = countries
    //       })
    //   })

    this.myForm.get('region')?.valueChanges
      .pipe(
        tap((_) => {
          this.myForm.get('country')?.reset('');
          this.loading = true
        }),
        switchMap(region => this.cs.getCountriesByRegion(region))
      )
      .subscribe(countries => {
        this.countries = countries
        this.loading = false
      })

    this.myForm.get('country')?.valueChanges
      .pipe(
        tap(() => {
          this.borders = []
          this.loading = true
          this.myForm.get('border')?.reset('')
        }),
        switchMap(code => this.cs.getCountryByCode(code)),
        switchMap(country => this.cs.getCountriesByBorders(country?.borders!)),

      )
      .subscribe(countries => {
        // this.borders = country?.borders || []
        this.borders = countries
        this.loading = false
      })
  }

  submitForm() {
    console.log(this.myForm);

  }

}
