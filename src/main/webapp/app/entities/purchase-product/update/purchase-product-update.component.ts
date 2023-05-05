import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { PurchaseProductFormService, PurchaseProductFormGroup } from './purchase-product-form.service';
import { IPurchaseProduct } from '../purchase-product.model';
import { PurchaseProductService } from '../service/purchase-product.service';

@Component({
  selector: 'jhi-purchase-product-update',
  templateUrl: './purchase-product-update.component.html',
})
export class PurchaseProductUpdateComponent implements OnInit {
  isSaving = false;
  purchaseProduct: IPurchaseProduct | null = null;

  editForm: PurchaseProductFormGroup = this.purchaseProductFormService.createPurchaseProductFormGroup();

  constructor(
    protected purchaseProductService: PurchaseProductService,
    protected purchaseProductFormService: PurchaseProductFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ purchaseProduct }) => {
      this.purchaseProduct = purchaseProduct;
      if (purchaseProduct) {
        this.updateForm(purchaseProduct);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const purchaseProduct = this.purchaseProductFormService.getPurchaseProduct(this.editForm);
    if (purchaseProduct.id !== null) {
      this.subscribeToSaveResponse(this.purchaseProductService.update(purchaseProduct));
    } else {
      this.subscribeToSaveResponse(this.purchaseProductService.create(purchaseProduct));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPurchaseProduct>>): void {
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

  protected updateForm(purchaseProduct: IPurchaseProduct): void {
    this.purchaseProduct = purchaseProduct;
    this.purchaseProductFormService.resetForm(this.editForm, purchaseProduct);
  }
}
