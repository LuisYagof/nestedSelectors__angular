import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { Country, CountrySmall } from '../interfaces/countries.interface';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private baseUrl: string = 'https://restcountries.eu/rest/v2'
  private _regions: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regions(): string[] {
    return [...this._regions];
  }

  constructor(private http: HttpClient) { }

  getCountriesByRegion(region: string): Observable<CountrySmall[]> {
    const url: string = `${this.baseUrl}/region/${region}?fields=alpha3Code;name`
    return this.http.get<CountrySmall[]>(url)
  }

  getCountryByCode(code: string): Observable<Country | null> {

    if (!code) {
      return of(null)
    }

    const url: string = `${this.baseUrl}/alpha/${code}`
    return this.http.get<Country>(url)
  }

  getNameByCode(code: string): Observable<CountrySmall> {
    const url: string = `${this.baseUrl}/alpha/${code}?fields=alpha3Code;name`
    return this.http.get<CountrySmall>(url)
  }

  getCountriesByBorders(borders: string[]): Observable<CountrySmall[]> {

    if (!borders) {
      return of([])
    }

    const requests: Observable<CountrySmall>[] = [];

    borders.forEach(code => {
      const req = this.getNameByCode(code)
      requests.push(req)
    })

    return combineLatest(requests)
  }
}
