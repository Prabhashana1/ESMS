import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageTitleService {
  // Default title eka 'Dashboard' widihata set karanawa
  public title = new BehaviorSubject<string>('Dashboard');
  
  constructor() { }
  
  setTitle(newTitle: string) {
    this.title.next(newTitle);
  }
}