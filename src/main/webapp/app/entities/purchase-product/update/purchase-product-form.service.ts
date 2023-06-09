import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPurchaseProduct, NewPurchaseProduct } from '../purchase-product.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPurchaseProduct for edit and NewPurchaseProductFormGroupInput for create.
 */
type PurchaseProductFormGroupInput = IPurchaseProduct | PartialWithRequiredKeyOf<NewPurchaseProduct>;

type PurchaseProductFormDefaults = Pick<NewPurchaseProduct, 'id'>;

type PurchaseProductFormGroupContent = {
  id: FormControl<IPurchaseProduct['id'] | NewPurchaseProduct['id']>;
  name: FormControl<IPurchaseProduct['name']>;
  category: FormControl<IPurchaseProduct['category']>;
  price: FormControl<IPurchaseProduct['price']>;
  units: FormControl<IPurchaseProduct['units']>;
  from: FormControl<IPurchaseProduct['from']>;
  company: FormControl<IPurchaseProduct['company']>;
};

export type PurchaseProductFormGroup = FormGroup<PurchaseProductFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PurchaseProductFormService {
  createPurchaseProductFormGroup(purchaseProduct: PurchaseProductFormGroupInput = { id: null }): PurchaseProductFormGroup {
    const purchaseProductRawValue = {
      ...this.getFormDefaults(),
      ...purchaseProduct,
    };
    return new FormGroup<PurchaseProductFormGroupContent>({
      id: new FormControl(
        { value: purchaseProductRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(purchaseProductRawValue.name),
      category: new FormControl(purchaseProductRawValue.category),
      price: new FormControl(purchaseProductRawValue.price),
      units: new FormControl(purchaseProductRawValue.units),
      from: new FormControl(purchaseProductRawValue.from),
      company: new FormControl(purchaseProductRawValue.company),
    });
  }

  getPurchaseProduct(form: PurchaseProductFormGroup): IPurchaseProduct | NewPurchaseProduct {
    return form.getRawValue() as IPurchaseProduct | NewPurchaseProduct;
  }

  resetForm(form: PurchaseProductFormGroup, purchaseProduct: PurchaseProductFormGroupInput): void {
    const purchaseProductRawValue = { ...this.getFormDefaults(), ...purchaseProduct };
    form.reset(
      {
        ...purchaseProductRawValue,
        id: { value: purchaseProductRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PurchaseProductFormDefaults {
    return {
      id: null,
    };
  }
}
