import { Component, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/models/category';
import { Product } from 'src/app/models/product';
import { Response } from 'src/app/models/response';
import { CategoriesService } from 'src/app/services/categories.service';
import { EventEmitter } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-show-product',
  templateUrl: './show-product.component.html',
  styleUrls: ['./show-product.component.scss'],
})
export class ShowProductComponent implements OnInit {
  @Input() products: Product[];
  selectedProduct: Product;
  productModalOpen: boolean = false;
  categories: Category[];
  categorySub: Subscription;
  file: File;
  progress;
  baseImage : string = `${environment.api_image}`;

  constructor(
    private categoryServ: CategoriesService,
    private productService: ProductsService,
    private fileService: FileUploadService
  ) {}

  ngOnInit(): void {
    this.categorySub = this.categoryServ
      .getCategory()
      .subscribe((data: Response) => {
        this.categories = data.result;
        // console.log(this.categories)
      });
  }

  onEdit(product: Product): void {
    this.productModalOpen = true;
    this.selectedProduct = product;
  }

  onDelete(product: Product): void {}

  addProduct(): void {
    this.selectedProduct = undefined;
    this.productModalOpen = true;
  }

  handleFinish(data) {
    const { file } = data;
    if (data && data.product) {
      let product = data.product ? data.product : null;
      this.file = file ? file : null;
      console.log(product);
      if (this.selectedProduct) {
        //Edit product
        product.idProduct = this.selectedProduct.idProduct;
        this.editProductServ(product);
      } else {
        //Add product
        this.addProductToServ(product, file);
      }
    }
    this.productModalOpen = false;
  }

  uploadImage(event) {
    switch (event.type) {
      case HttpEventType.Sent:
        console.log('envoyer avec success');
        break;
      case HttpEventType.UploadProgress:
        this.progress = Math.round((event.loaded / event.total) * 100);
        break;
      case HttpEventType.Response:
        console.log(event.body);
        setTimeout(() => {
          this.progress = 0;
        }, 1500);
        break;
      default:
        break;
    }
  }

  editProductServ(product) {
    this.productService.editProduct(product).subscribe((data: Response) => {
      if (data.status === 200) {
        if (this.file) {
          this.fileService
            .uploadImage(this.file)
            .subscribe((data: HttpEvent<any>) => {
              this.uploadImage(data);
            });

          //remove image
          this.fileService.deleteImage(product.oldImage).subscribe((data: Response) => {
            console.log(data.message)
          });
        }

        //update font
        const index = this.products.findIndex(product => product.idProduct === product.idProduct);
        this.products = [
          ...this.products.slice(0, index),
          product,
          ...this.products.slice(index + 1)
        ]
      } else {
        console.log(data.message);
      }
    });
  }

  addProductToServ(product, file) {
    this.productService.addProduct(product).subscribe((response) => {
      // console.log(response);
      if (response.status === 200) {
        if (file) {
          this.fileService
            .uploadImage(file)
            .subscribe((event: HttpEvent<any>) => {
              this.uploadImage(event);
            });
        }
      }
      //update local front
      product.idProduct = response.args.lasInsertId;
      this.products.push(product);
    });
  }

  ngOnDestroy(): void {
    this.categorySub.unsubscribe();
  }
}
