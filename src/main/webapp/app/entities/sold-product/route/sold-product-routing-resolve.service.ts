import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISoldProduct } from '../sold-product.model';
import { SoldProductService } from '../service/sold-product.service';

@Injectable({ providedIn: 'root' })
export class SoldProductRoutingResolveService implements Resolve<ISoldProduct | null> {
  constructor(protected service: SoldProductService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISoldProduct | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((soldProduct: HttpResponse<ISoldProduct>) => {
          if (soldProduct.body) {
            return of(soldProduct.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
