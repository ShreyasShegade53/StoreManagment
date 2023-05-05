import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { StoreNameDetailComponent } from './store-name-detail.component';

describe('StoreName Management Detail Component', () => {
  let comp: StoreNameDetailComponent;
  let fixture: ComponentFixture<StoreNameDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StoreNameDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ storeName: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(StoreNameDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(StoreNameDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load storeName on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.storeName).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
