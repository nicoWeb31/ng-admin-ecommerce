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
  progress;

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
    this.productModalOpen = !this.productModalOpen;
    this.selectedProduct = product;
  }

  onDelete(product: Product): void {}

  addProduct(): void {
    this.productModalOpen = true;
  }

  handleFinish(data) {
    const { product, file } = data;
    if (product) {
      console.log(product);
      if (this.selectedProduct) {
        //Edit product
      } else {
        //Add product
        this.productService.addProduct(product).subscribe((response) => {
          console.log(response);
          if (response.status === 200) {
            if (file) {
              this.fileService
                .uploadImage(file)
                .subscribe((event: HttpEvent<any>) => {
                  switch (event.type) {
                    case HttpEventType.Sent:
                      console.log('envoyer avec success');
                      break;
                    case HttpEventType.UploadProgress:
                      this.progress = Math.round(
                        (event.loaded / event.total) * 100
                      );
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
                });
            }

            //update local front
            product.idProduct = response.args.lasInsertId;
            this.products.push(product);
          }
        });
      }
    }
    this.productModalOpen = false;
  }

  ngOnDestroy(): void {
    this.categorySub.unsubscribe();
  }
}
