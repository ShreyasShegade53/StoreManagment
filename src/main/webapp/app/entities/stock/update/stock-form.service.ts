import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IStock, NewStock } from '../stock.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IStock for edit and NewStockFormGroupInput for create.
 */
type StockFormGroupInput = IStock | PartialWithRequiredKeyOf<NewStock>;

type StockFormDefaults = Pick<NewStock, 'id'>;

type StockFormGroupContent = {
  id: FormControl<IStock['id'] | NewStock['id']>;
  name: FormControl<IStock['name']>;
  category: FormControl<IStock['category']>;
  purchasePrice: FormControl<IStock['purchasePrice']>;
  salePrice: FormControl<IStock['salePrice']>;
  units: FormControl<IStock['units']>;
  company: FormControl<IStock['company']>;
};

export type StockFormGroup = FormGroup<StockFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class StockFormService {
  createStockFormGroup(stock: StockFormGroupInput = { id: null }): StockFormGroup {
    const stockRawValue = {
      ...this.getFormDefaults(),
      ...stock,
    };
    return new FormGroup<StockFormGroupContent>({
      id: new FormControl(
        { value: stockRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(stockRawValue.name),
      category: new FormControl(stockRawValue.category),
      purchasePrice: new FormControl(stockRawValue.purchasePrice),
      salePrice: new FormControl(stockRawValue.salePrice),
      units: new FormControl(stockRawValue.units),
      company: new FormControl(stockRawValue.company),
    });
  }

  getStock(form: StockFormGroup): IStock | NewStock {
    return form.getRawValue() as IStock | NewStock;
  }

  resetForm(form: StockFormGroup, stock: StockFormGroupInput): void {
    const stockRawValue = { ...this.getFormDefaults(), ...stock };
    form.reset(
      {
        ...stockRawValue,
        id: { value: stockRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): StockFormDefaults {
    return {
      id: null,
    };
  }
}
