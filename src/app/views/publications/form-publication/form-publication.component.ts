import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, OnInit } from '@angular/core';

import { Tag, Publication } from 'src/app/models/publications';
import { UtilsService } from 'src/app/services/utils.service';
import { PublicationsService } from 'src/app/services/publications.service';

@Component({
  selector: 'app-form-publication',
  templateUrl: './form-publication.component.html',
  styleUrls: ['./form-publication.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class FormPublicationComponent implements OnInit {
  public tags: Tag[];
  public selectedTags: Tag[];
  public cover: File;
  public preview: string;
  public isEdit: boolean;

  public firstFormGroup = new FormGroup({
    id: new FormControl('', []),
    title: new FormControl('', [Validators.required]),
    subtitle: new FormControl('', [Validators.required]),
    cover: new FormControl('', [Validators.required]),
    tags: new FormControl('', [Validators.required, Validators.maxLength(3)]),
  });

  public secondFormGroup = new FormGroup({
    content: new FormControl('', [
      Validators.required,
      Validators.minLength(50),
    ]),
  });

  public editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '280px',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    placeholder: 'Escreva o conteúdo da sua publicação aqui...',
    defaultFontName: 'Times New Roman',
    sanitize: false,
    defaultFontSize: '4',
    toolbarHiddenButtons: [
      ['heading'],
      ['insertImage', 'insertVideo', 'customClasses'],
    ],
    outline: false,
  };

  constructor(
    private route: ActivatedRoute,
    private publicationsService: PublicationsService,
    private utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    const res = this.publicationsService.getTags();
    const publicationId = this.route.snapshot.paramMap.get('publicationId');
    this.isEdit = publicationId !== null;

    res.subscribe((res) => {
      this.tags = res.results;

      if (this.isEdit) {
        this.firstFormGroup.controls["cover"].clearValidators();
        this.firstFormGroup.controls["cover"].updateValueAndValidity();

        const resEdit =
          this.publicationsService.getPublicationById(publicationId);

        resEdit.subscribe((publication) => {
          const tags = publication.tags.map((tag) => tag.id);

          this.firstFormGroup.patchValue({
            id: publication.id,
            title: publication.title,
            subtitle: publication.subtitle,
            tags: tags,
          });

          this.secondFormGroup.setValue({
            content: publication.content,
          });

          this.selectedTags = publication.tags;
          this.preview = publication.cover;
        });
      }
    });
  }

  onSubmit(): void {
    if (!this.firstFormGroup.valid || !this.secondFormGroup.valid) {
      const message = 'Verifique as mensagens de erro e tente novamente';
      this.utilsService.showMessage(message, true);
      return;
    }

    const firstForm = this.firstFormGroup.getRawValue();
    const secondForm = this.secondFormGroup.getRawValue();
    const publication: Publication = { ...firstForm, ...secondForm };

    if (this.isEdit) {
      this.publicationsService.patchPublication(publication);
    } else {
      this.publicationsService.postPublication(publication, this.cover);
    }
  }

  onFileChange(event): void {
    if (event.target.files.length) {
      const file = (event.target as HTMLInputElement).files[0];
      const reader = new FileReader();

      this.cover = file;
      reader.onload = () => {
        this.preview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onChangeSelectedTags(): void {
    const idSelectedTags: string[] = this.firstFormGroup.value['tags'];

    this.selectedTags = this.tags.filter((tag) => {
      if (idSelectedTags.includes(tag.id)) {
        return tag;
      }
    });
  }
}
