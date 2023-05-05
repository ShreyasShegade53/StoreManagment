import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IStoreName } from '../store-name.model';

@Component({
  selector: 'jhi-store-name-detail',
  templateUrl: './store-name-detail.component.html',
})
export class StoreNameDetailComponent implements OnInit {
  storeName: IStoreName | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ storeName }) => {
      this.storeName = storeName;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
