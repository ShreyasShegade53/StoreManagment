import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { StoreNameFormService } from './store-name-form.service';
import { StoreNameService } from '../service/store-name.service';
import { IStoreName } from '../store-name.model';

import { StoreNameUpdateComponent } from './store-name-update.component';

describe('StoreName Management Update Component', () => {
  let comp: StoreNameUpdateComponent;
  let fixture: ComponentFixture<StoreNameUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let storeNameFormService: StoreNameFormService;
  let storeNameService: StoreNameService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [StoreNameUpdateComponent],
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
      .overrideTemplate(StoreNameUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StoreNameUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    storeNameFormService = TestBed.inject(StoreNameFormService);
    storeNameService = TestBed.inject(StoreNameService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const storeName: IStoreName = { id: 456 };

      activatedRoute.data = of({ storeName });
      comp.ngOnInit();

      expect(comp.storeName).toEqual(storeName);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStoreName>>();
      const storeName = { id: 123 };
      jest.spyOn(storeNameFormService, 'getStoreName').mockReturnValue(storeName);
      jest.spyOn(storeNameService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ storeName });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: storeName }));
      saveSubject.complete();

      // THEN
      expect(storeNameFormService.getStoreName).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(storeNameService.update).toHaveBeenCalledWith(expect.objectContaining(storeName));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStoreName>>();
      const storeName = { id: 123 };
      jest.spyOn(storeNameFormService, 'getStoreName').mockReturnValue({ id: null });
      jest.spyOn(storeNameService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ storeName: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: storeName }));
      saveSubject.complete();

      // THEN
      expect(storeNameFormService.getStoreName).toHaveBeenCalled();
      expect(storeNameService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStoreName>>();
      const storeName = { id: 123 };
      jest.spyOn(storeNameService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ storeName });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(storeNameService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
