import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISoldProduct } from '../sold-product.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../sold-product.test-samples';

import { SoldProductService } from './sold-product.service';

const requireRestSample: ISoldProduct = {
  ...sampleWithRequiredData,
};

describe('SoldProduct Service', () => {
  let service: SoldProductService;
  let httpMock: HttpTestingController;
  let expectedResult: ISoldProduct | ISoldProduct[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SoldProductService);
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

    it('should create a SoldProduct', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const soldProduct = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(soldProduct).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SoldProduct', () => {
      const soldProduct = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(soldProduct).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a SoldProduct', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of SoldProduct', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a SoldProduct', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSoldProductToCollectionIfMissing', () => {
      it('should add a SoldProduct to an empty array', () => {
        const soldProduct: ISoldProduct = sampleWithRequiredData;
        expectedResult = service.addSoldProductToCollectionIfMissing([], soldProduct);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(soldProduct);
      });

      it('should not add a SoldProduct to an array that contains it', () => {
        const soldProduct: ISoldProduct = sampleWithRequiredData;
        const soldProductCollection: ISoldProduct[] = [
          {
            ...soldProduct,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSoldProductToCollectionIfMissing(soldProductCollection, soldProduct);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SoldProduct to an array that doesn't contain it", () => {
        const soldProduct: ISoldProduct = sampleWithRequiredData;
        const soldProductCollection: ISoldProduct[] = [sampleWithPartialData];
        expectedResult = service.addSoldProductToCollectionIfMissing(soldProductCollection, soldProduct);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(soldProduct);
      });

      it('should add only unique SoldProduct to an array', () => {
        const soldProductArray: ISoldProduct[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const soldProductCollection: ISoldProduct[] = [sampleWithRequiredData];
        expectedResult = service.addSoldProductToCollectionIfMissing(soldProductCollection, ...soldProductArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const soldProduct: ISoldProduct = sampleWithRequiredData;
        const soldProduct2: ISoldProduct = sampleWithPartialData;
        expectedResult = service.addSoldProductToCollectionIfMissing([], soldProduct, soldProduct2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(soldProduct);
        expect(expectedResult).toContain(soldProduct2);
      });

      it('should accept null and undefined values', () => {
        const soldProduct: ISoldProduct = sampleWithRequiredData;
        expectedResult = service.addSoldProductToCollectionIfMissing([], null, soldProduct, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(soldProduct);
      });

      it('should return initial array if no SoldProduct is added', () => {
        const soldProductCollection: ISoldProduct[] = [sampleWithRequiredData];
        expectedResult = service.addSoldProductToCollectionIfMissing(soldProductCollection, undefined, null);
        expect(expectedResult).toEqual(soldProductCollection);
      });
    });

    describe('compareSoldProduct', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSoldProduct(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareSoldProduct(entity1, entity2);
        const compareResult2 = service.compareSoldProduct(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareSoldProduct(entity1, entity2);
        const compareResult2 = service.compareSoldProduct(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareSoldProduct(entity1, entity2);
        const compareResult2 = service.compareSoldProduct(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
