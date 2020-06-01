import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CsvDataService {

  constructor(private http: HttpClient) { }
  getBillAndCategroies() {
    return forkJoin([this.getCategroiesData(), this.getBillData()]).pipe(tap(result => { }));
  }
  getBillData() {
    return this.http.get<string>('/assets/bill.csv', { responseType: 'text' as 'json' })
      .pipe(tap(result => { }),
        catchError(this.handleError<any>('Get bill'))
      );
  }
  getCategroiesData() {
    return this.http.get<string>('/assets/categories.csv', { responseType: 'text' as 'json' })
      .pipe(tap(result => { }),
        catchError(this.handleError<any>('Get categories'))
      );
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  private log(message: string) {
    console.log(message);
  }
}
