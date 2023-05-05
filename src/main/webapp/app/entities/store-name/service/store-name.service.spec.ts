import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IStoreName } from '../store-name.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../store-name.test-samples';

import { StoreNameService } from './store-name.service';

const requireRestSample: IStoreName = {
  ...sampleWithRequiredData,
};

describe('StoreName Service', () => {
  let service: StoreNameService;
  let httpMock: HttpTestingController;
  let expectedResult: IStoreName | IStoreName[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(StoreNameService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a StoreName', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const storeName = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(storeName).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a StoreName', () => {
      const storeName = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(storeName).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a StoreName', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of StoreName', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a StoreName', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addStoreNameToCollectionIfMissing', () => {
      it('should add a StoreName to an empty array', () => {
        const storeName: IStoreName = sampleWithRequiredData;
        expectedResult = service.addStoreNameToCollectionIfMissing([], storeName);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(storeName);
      });

      it('should not add a StoreName to an array that contains it', () => {
        const storeName: IStoreName = sampleWithRequiredData;
        const storeNameCollection: IStoreName[] = [
          {
            ...storeName,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addStoreNameToCollectionIfMissing(storeNameCollection, storeName);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a StoreName to an array that doesn't contain it", () => {
        const storeName: IStoreName = sampleWithRequiredData;
        const storeNameCollection: IStoreName[] = [sampleWithPartialData];
        expectedResult = service.addStoreNameToCollectionIfMissing(storeNameCollection, storeName);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(storeName);
      });

      it('should add only unique StoreName to an array', () => {
        const storeNameArray: IStoreName[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const storeNameCollection: IStoreName[] = [sampleWithRequiredData];
        expectedResult = service.addStoreNameToCollectionIfMissing(storeNameCollection, ...storeNameArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const storeName: IStoreName = sampleWithRequiredData;
        const storeName2: IStoreName = sampleWithPartialData;
        expectedResult = service.addStoreNameToCollectionIfMissing([], storeName, storeName2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(storeName);
        expect(expectedResult).toContain(storeName2);
      });

      it('should accept null and undefined values', () => {
        const storeName: IStoreName = sampleWithRequiredData;
        expectedResult = service.addStoreNameToCollectionIfMissing([], null, storeName, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(storeName);
      });

      it('should return initial array if no StoreName is added', () => {
        const storeNameCollection: IStoreName[] = [sampleWithRequiredData];
        expectedResult = service.addStoreNameToCollectionIfMissing(storeNameCollection, undefined, null);
        expect(expectedResult).toEqual(storeNameCollection);
      });
    });

    describe('compareStoreName', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareStoreName(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareStoreName(entity1, entity2);
        const compareResult2 = service.compareStoreName(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareStoreName(entity1, entity2);
        const compareResult2 = service.compareStoreName(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareStoreName(entity1, entity2);
        const compareResult2 = service.compareStoreName(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
