import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IStoreName, NewStoreName } from '../store-name.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IStoreName for edit and NewStoreNameFormGroupInput for create.
 */
type StoreNameFormGroupInput = IStoreName | PartialWithRequiredKeyOf<NewStoreName>;

type StoreNameFormDefaults = Pick<NewStoreName, 'id'>;

type StoreNameFormGroupContent = {
  id: FormControl<IStoreName['id'] | NewStoreName['id']>;
  name: FormControl<IStoreName['name']>;
};

export type StoreNameFormGroup = FormGroup<StoreNameFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class StoreNameFormService {
  createStoreNameFormGroup(storeName: StoreNameFormGroupInput = { id: null }): StoreNameFormGroup {
    const storeNameRawValue = {
      ...this.getFormDefaults(),
      ...storeName,
    };
    return new FormGroup<StoreNameFormGroupContent>({
      id: new FormControl(
        { value: storeNameRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(storeNameRawValue.name),
    });
  }

  getStoreName(form: StoreNameFormGroup): IStoreName | NewStoreName {
    return form.getRawValue() as IStoreName | NewStoreName;
  }

  resetForm(form: StoreNameFormGroup, storeName: StoreNameFormGroupInput): void {
    const storeNameRawValue = { ...this.getFormDefaults(), ...storeName };
    form.reset(
      {
        ...storeNameRawValue,
        id: { value: storeNameRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): StoreNameFormDefaults {
    return {
      id: null,
    };
  }
}
