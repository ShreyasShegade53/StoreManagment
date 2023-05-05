import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'employee',
        data: { pageTitle: 'Employees' },
        loadChildren: () => import('./employee/employee.module').then(m => m.EmployeeModule),
      },
      {
        path: 'product',
        data: { pageTitle: 'Products' },
        loadChildren: () => import('./product/product.module').then(m => m.ProductModule),
      },
      {
        path: 'purchase-product',
        data: { pageTitle: 'PurchaseProducts' },
        loadChildren: () => import('./purchase-product/purchase-product.module').then(m => m.PurchaseProductModule),
      },
      {
        path: 'sold-product',
        data: { pageTitle: 'SoldProducts' },
        loadChildren: () => import('./sold-product/sold-product.module').then(m => m.SoldProductModule),
      },
      {
        path: 'stock',
        data: { pageTitle: 'Stocks' },
        loadChildren: () => import('./stock/stock.module').then(m => m.StockModule),
      },
      {
        path: 'store-name',
        data: { pageTitle: 'StoreNames' },
        loadChildren: () => import('./store-name/store-name.module').then(m => m.StoreNameModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
