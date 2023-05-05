import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SoldProductFormService } from './sold-product-form.service';
import { SoldProductService } from '../service/sold-product.service';
import { ISoldProduct } from '../sold-product.model';

import { SoldProductUpdateComponent } from './sold-product-update.component';

describe('SoldProduct Management Update Component', () => {
  let comp: SoldProductUpdateComponent;
  let fixture: ComponentFixture<SoldProductUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let soldProductFormService: SoldProductFormService;
  let soldProductService: SoldProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SoldProductUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(SoldProductUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SoldProductUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    soldProductFormService = TestBed.inject(SoldProductFormService);
    soldProductService = TestBed.inject(SoldProductService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const soldProduct: ISoldProduct = { id: 456 };

      activatedRoute.data = of({ soldProduct });
      comp.ngOnInit();

      expect(comp.soldProduct).toEqual(soldProduct);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISoldProduct>>();
      const soldProduct = { id: 123 };
      jest.spyOn(soldProductFormService, 'getSoldProduct').mockReturnValue(soldProduct);
      jest.spyOn(soldProductService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ soldProduct });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: soldProduct }));
      saveSubject.complete();

      // THEN
      expect(soldProductFormService.getSoldProduct).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(soldProductService.update).toHaveBeenCalledWith(expect.objectContaining(soldProduct));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISoldProduct>>();
      const soldProduct = { id: 123 };
      jest.spyOn(soldProductFormService, 'getSoldProduct').mockReturnValue({ id: null });
      jest.spyOn(soldProductService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ soldProduct: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: soldProduct }));
      saveSubject.complete();

      // THEN
      expect(soldProductFormService.getSoldProduct).toHaveBeenCalled();
      expect(soldProductService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISoldProduct>>();
      const soldProduct = { id: 123 };
      jest.spyOn(soldProductService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ soldProduct });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(soldProductService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
