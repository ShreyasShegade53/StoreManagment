import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IStoreName } from '../store-name.model';
import { StoreNameService } from '../service/store-name.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './store-name-delete-dialog.component.html',
})
export class StoreNameDeleteDialogComponent {
  storeName?: IStoreName;

  constructor(protected storeNameService: StoreNameService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.storeNameService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
