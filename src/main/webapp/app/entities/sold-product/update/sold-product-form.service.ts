import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ISoldProduct, NewSoldProduct } from '../sold-product.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISoldProduct for edit and NewSoldProductFormGroupInput for create.
 */
type SoldProductFormGroupInput = ISoldProduct | PartialWithRequiredKeyOf<NewSoldProduct>;

type SoldProductFormDefaults = Pick<NewSoldProduct, 'id'>;

type SoldProductFormGroupContent = {
  id: FormControl<ISoldProduct['id'] | NewSoldProduct['id']>;
  name: FormControl<ISoldProduct['name']>;
  category: FormControl<ISoldProduct['category']>;
  price: FormControl<ISoldProduct['price']>;
  units: FormControl<ISoldProduct['units']>;
  company: FormControl<ISoldProduct['company']>;
};

export type SoldProductFormGroup = FormGroup<SoldProductFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SoldProductFormService {
  createSoldProductFormGroup(soldProduct: SoldProductFormGroupInput = { id: null }): SoldProductFormGroup {
    const soldProductRawValue = {
      ...this.getFormDefaults(),
      ...soldProduct,
    };
    return new FormGroup<SoldProductFormGroupContent>({
      id: new FormControl(
        { value: soldProductRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(soldProductRawValue.name),
      category: new FormControl(soldProductRawValue.category),
      price: new FormControl(soldProductRawValue.price),
      units: new FormControl(soldProductRawValue.units),
      company: new FormControl(soldProductRawValue.company),
    });
  }

  getSoldProduct(form: SoldProductFormGroup): ISoldProduct | NewSoldProduct {
    return form.getRawValue() as ISoldProduct | NewSoldProduct;
  }

  resetForm(form: SoldProductFormGroup, soldProduct: SoldProductFormGroupInput): void {
    const soldProductRawValue = { ...this.getFormDefaults(), ...soldProduct };
    form.reset(
      {
        ...soldProductRawValue,
        id: { value: soldProductRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): SoldProductFormDefaults {
    return {
      id: null,
    };
  }
}
