import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IStoreName } from '../store-name.model';
import { StoreNameService } from '../service/store-name.service';

@Injectable({ providedIn: 'root' })
export class StoreNameRoutingResolveService implements Resolve<IStoreName | null> {
  constructor(protected service: StoreNameService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IStoreName | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((storeName: HttpResponse<IStoreName>) => {
          if (storeName.body) {
            return of(storeName.body);
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
