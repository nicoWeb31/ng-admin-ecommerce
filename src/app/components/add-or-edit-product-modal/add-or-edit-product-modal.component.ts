import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  OnChanges,
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
export class AddOrEditProductModalComponent
  implements OnInit, OnDestroy, OnChanges
{
  @Input() product: Product;
  @Output() finish = new EventEmitter();
  productform: FormGroup;
  categorySub: Subscription;
  categories: Category[];
  idCategory: number = 1;
  file: File;
  productImage: string;

  constructor(
    private fb: FormBuilder,
    private categoruServ: CategoriesService
  ) {
    this.productform =this.fb.group({
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
    if(this.product){
      return false;
    }
    return this.productform.get('illustration').invalid;
  }

  handleCancel(): void {
    this.finish.emit();
    this.closeForm();
  }

  handleFinish(): void {
    const product : Product = {
      ...this.productform.get('productInfo').value,
      ...this.productform.get('illustration').value,
      category: this.idCategory,
    };
    if (this.file) {
      product.image = this.file.name;
    }else{
      product.image = this.product.oldImage;
    }
    this.finish.emit({ product, file: this.file ? this.file : null });
    this.closeForm();
  }

  closeForm(): void {
    this.productform.reset();
    this.idCategory = 1;
  }

  updateFrom(product: Product) {
    this.productform.patchValue({
      productInfo: {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
      },
    });
    product.oldImage = product.image;
    this.selectCategory(product.Category);
  }

  selectCategory(id: number) {
    this.idCategory = id;
  }

  detectFiles(event) {
    this.file = event.target.files[0];
  }
  ngOnInit(): void {
    this.categorySub = this.categoruServ.getCategory().subscribe((response) => {
      this.categories = response.result;
    });

  }

  ngOnChanges(): void {
    if (this.product) {
      this.updateFrom(this.product);
      console.log(this.product);
    }
  }

  ngOnDestroy(): void {
    this.categorySub.unsubscribe();
  }
}
