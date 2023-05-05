import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { StoreNameFormService, StoreNameFormGroup } from './store-name-form.service';
import { IStoreName } from '../store-name.model';
import { StoreNameService } from '../service/store-name.service';

@Component({
  selector: 'jhi-store-name-update',
  templateUrl: './store-name-update.component.html',
})
export class StoreNameUpdateComponent implements OnInit {
  isSaving = false;
  storeName: IStoreName | null = null;

  editForm: StoreNameFormGroup = this.storeNameFormService.createStoreNameFormGroup();

  constructor(
    protected storeNameService: StoreNameService,
    protected storeNameFormService: StoreNameFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ storeName }) => {
      this.storeName = storeName;
      if (storeName) {
        this.updateForm(storeName);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const storeName = this.storeNameFormService.getStoreName(this.editForm);
    if (storeName.id !== null) {
      this.subscribeToSaveResponse(this.storeNameService.update(storeName));
    } else {
      this.subscribeToSaveResponse(this.storeNameService.create(storeName));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IStoreName>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(storeName: IStoreName): void {
    this.storeName = storeName;
    this.storeNameFormService.resetForm(this.editForm, storeName);
  }
}
