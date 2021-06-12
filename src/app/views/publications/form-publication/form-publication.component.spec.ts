import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPublicationComponent } from './form-publication.component';

describe('FormPublicationComponent', () => {
  let component: FormPublicationComponent;
  let fixture: ComponentFixture<FormPublicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormPublicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPublicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
