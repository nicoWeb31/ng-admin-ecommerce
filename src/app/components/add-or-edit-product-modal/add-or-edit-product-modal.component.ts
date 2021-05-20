import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/models/category';
import { Product } from 'src/app/models/product';
import { CategoriesService } from 'src/app/services/categories.service';

@Component({
  selector: 'app-add-or-edit-product-modal',
  templateUrl: './add-or-edit-product-modal.component.html',
  styleUrls: ['./add-or-edit-product-modal.component.scss'],
})
export class AddOrEditProductModalComponent implements OnInit, OnDestroy {
  @Input() product: Product;
  @Output() finish = new EventEmitter();
  productform: FormGroup;
  categorySub: Subscription;
  categories: Category[];
  idCategory: number = 1;
  file: File;

  constructor(
    private fb: FormBuilder,
    private categoruServ: CategoriesService
  ) {}

  ngOnInit(): void {
    this.initialForm();
    this.categorySub = this.categoruServ.getCategory().subscribe((response) => {
      this.categories = response.result;
      console.log(this.categories);
    });
  }

  initialForm(): void {
    this.productform = this.fb.group({
      productInfo: this.fb.group({
        name: ['', Validators.required],
        description: ['', Validators.required],
        price: ['', Validators.required],
        stock: ['', Validators.required],
      }),
      illustration: this.fb.group({
        image: ['', Validators.required],
      }),
    });
  }

  get isProductInfoInvalid(): boolean {
    return this.productform.get('productInfo').invalid;
  }

  get isUlistrationInvalid(): boolean {
    return this.productform.get('illustration').invalid;
  }

  handleCancel(): void {
    this.finish.emit();
    this.closeForm();
  }

  handleFinish(): void {
    const product = {
      ...this.productform.get('productInfo').value,
      ...this.productform.get('illustration').value,
      category: this.idCategory,
    };
    if(this.file){
      product.image = this.file.name;
    }
    this.finish.emit({product, file : this.file ? this.file : null});
    this.closeForm();
  }

  closeForm(): void {
    this.productform.reset();
    this.idCategory = 1;
  }

  selectCategory(id: number) {
    this.idCategory = id;
  }

  detectFiles(event){
    this.file = event.target.files[0];


  }

  ngOnDestroy(): void {
    this.categorySub.unsubscribe();
  }
}
