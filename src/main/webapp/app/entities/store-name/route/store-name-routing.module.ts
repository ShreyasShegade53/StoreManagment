import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { StoreNameComponent } from '../list/store-name.component';
import { StoreNameDetailComponent } from '../detail/store-name-detail.component';
import { StoreNameUpdateComponent } from '../update/store-name-update.component';
import { StoreNameRoutingResolveService } from './store-name-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const storeNameRoute: Routes = [
  {
    path: '',
    component: StoreNameComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: StoreNameDetailComponent,
    resolve: {
      storeName: StoreNameRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: StoreNameUpdateComponent,
    resolve: {
      storeName: StoreNameRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: StoreNameUpdateComponent,
    resolve: {
      storeName: StoreNameRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(storeNameRoute)],
  exports: [RouterModule],
})
export class StoreNameRoutingModule {}
