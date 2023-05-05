import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISoldProduct, NewSoldProduct } from '../sold-product.model';

export type PartialUpdateSoldProduct = Partial<ISoldProduct> & Pick<ISoldProduct, 'id'>;

export type EntityResponseType = HttpResponse<ISoldProduct>;
export type EntityArrayResponseType = HttpResponse<ISoldProduct[]>;

@Injectable({ providedIn: 'root' })
export class SoldProductService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/sold-products');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(soldProduct: NewSoldProduct): Observable<EntityResponseType> {
    return this.http.post<ISoldProduct>(this.resourceUrl, soldProduct, { observe: 'response' });
  }

  update(soldProduct: ISoldProduct): Observable<EntityResponseType> {
    return this.http.put<ISoldProduct>(`${this.resourceUrl}/${this.getSoldProductIdentifier(soldProduct)}`, soldProduct, {
      observe: 'response',
    });
  }

  partialUpdate(soldProduct: PartialUpdateSoldProduct): Observable<EntityResponseType> {
    return this.http.patch<ISoldProduct>(`${this.resourceUrl}/${this.getSoldProductIdentifier(soldProduct)}`, soldProduct, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISoldProduct>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISoldProduct[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSoldProductIdentifier(soldProduct: Pick<ISoldProduct, 'id'>): number {
    return soldProduct.id;
  }

  compareSoldProduct(o1: Pick<ISoldProduct, 'id'> | null, o2: Pick<ISoldProduct, 'id'> | null): boolean {
    return o1 && o2 ? this.getSoldProductIdentifier(o1) === this.getSoldProductIdentifier(o2) : o1 === o2;
  }

  addSoldProductToCollectionIfMissing<Type extends Pick<ISoldProduct, 'id'>>(
    soldProductCollection: Type[],
    ...soldProductsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const soldProducts: Type[] = soldProductsToCheck.filter(isPresent);
    if (soldProducts.length > 0) {
      const soldProductCollectionIdentifiers = soldProductCollection.map(
        soldProductItem => this.getSoldProductIdentifier(soldProductItem)!
      );
      const soldProductsToAdd = soldProducts.filter(soldProductItem => {
        const soldProductIdentifier = this.getSoldProductIdentifier(soldProductItem);
        if (soldProductCollectionIdentifiers.includes(soldProductIdentifier)) {
          return false;
        }
        soldProductCollectionIdentifiers.push(soldProductIdentifier);
        return true;
      });
      return [...soldProductsToAdd, ...soldProductCollection];
    }
    return soldProductCollection;
  }
}
