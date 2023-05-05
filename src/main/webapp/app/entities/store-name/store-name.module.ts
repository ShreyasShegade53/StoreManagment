import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { StoreNameComponent } from './list/store-name.component';
import { StoreNameDetailComponent } from './detail/store-name-detail.component';
import { StoreNameUpdateComponent } from './update/store-name-update.component';
import { StoreNameDeleteDialogComponent } from './delete/store-name-delete-dialog.component';
import { StoreNameRoutingModule } from './route/store-name-routing.module';

@NgModule({
  imports: [SharedModule, StoreNameRoutingModule],
  declarations: [StoreNameComponent, StoreNameDetailComponent, StoreNameUpdateComponent, StoreNameDeleteDialogComponent],
})
export class StoreNameModule {}
