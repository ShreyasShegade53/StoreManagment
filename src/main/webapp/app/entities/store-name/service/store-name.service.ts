import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IStoreName, NewStoreName } from '../store-name.model';

export type PartialUpdateStoreName = Partial<IStoreName> & Pick<IStoreName, 'id'>;

export type EntityResponseType = HttpResponse<IStoreName>;
export type EntityArrayResponseType = HttpResponse<IStoreName[]>;

@Injectable({ providedIn: 'root' })
export class StoreNameService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/store-names');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(storeName: NewStoreName): Observable<EntityResponseType> {
    return this.http.post<IStoreName>(this.resourceUrl, storeName, { observe: 'response' });
  }

  update(storeName: IStoreName): Observable<EntityResponseType> {
    return this.http.put<IStoreName>(`${this.resourceUrl}/${this.getStoreNameIdentifier(storeName)}`, storeName, { observe: 'response' });
  }

  partialUpdate(storeName: PartialUpdateStoreName): Observable<EntityResponseType> {
    return this.http.patch<IStoreName>(`${this.resourceUrl}/${this.getStoreNameIdentifier(storeName)}`, storeName, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IStoreName>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IStoreName[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getStoreNameIdentifier(storeName: Pick<IStoreName, 'id'>): number {
    return storeName.id;
  }

  compareStoreName(o1: Pick<IStoreName, 'id'> | null, o2: Pick<IStoreName, 'id'> | null): boolean {
    return o1 && o2 ? this.getStoreNameIdentifier(o1) === this.getStoreNameIdentifier(o2) : o1 === o2;
  }

  addStoreNameToCollectionIfMissing<Type extends Pick<IStoreName, 'id'>>(
    storeNameCollection: Type[],
    ...storeNamesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const storeNames: Type[] = storeNamesToCheck.filter(isPresent);
    if (storeNames.length > 0) {
      const storeNameCollectionIdentifiers = storeNameCollection.map(storeNameItem => this.getStoreNameIdentifier(storeNameItem)!);
      const storeNamesToAdd = storeNames.filter(storeNameItem => {
        const storeNameIdentifier = this.getStoreNameIdentifier(storeNameItem);
        if (storeNameCollectionIdentifiers.includes(storeNameIdentifier)) {
          return false;
        }
        storeNameCollectionIdentifiers.push(storeNameIdentifier);
        return true;
      });
      return [...storeNamesToAdd, ...storeNameCollection];
    }
    return storeNameCollection;
  }
}
