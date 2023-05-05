import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { SoldProductFormService, SoldProductFormGroup } from './sold-product-form.service';
import { ISoldProduct } from '../sold-product.model';
import { SoldProductService } from '../service/sold-product.service';

@Component({
  selector: 'jhi-sold-product-update',
  templateUrl: './sold-product-update.component.html',
})
export class SoldProductUpdateComponent implements OnInit {
  isSaving = false;
  soldProduct: ISoldProduct | null = null;

  editForm: SoldProductFormGroup = this.soldProductFormService.createSoldProductFormGroup();

  constructor(
    protected soldProductService: SoldProductService,
    protected soldProductFormService: SoldProductFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ soldProduct }) => {
      this.soldProduct = soldProduct;
      if (soldProduct) {
        this.updateForm(soldProduct);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const soldProduct = this.soldProductFormService.getSoldProduct(this.editForm);
    if (soldProduct.id !== null) {
      this.subscribeToSaveResponse(this.soldProductService.update(soldProduct));
    } else {
      this.subscribeToSaveResponse(this.soldProductService.create(soldProduct));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISoldProduct>>): void {
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

  protected updateForm(soldProduct: ISoldProduct): void {
    this.soldProduct = soldProduct;
    this.soldProductFormService.resetForm(this.editForm, soldProduct);
  }
}
