import { Component, Input, OnInit, OnDestroy} from '@angular/core';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/models/category';
import { Product } from 'src/app/models/product';
import { Response } from 'src/app/models/response';
import { CategoriesService } from 'src/app/services/categories.service';

@Component({
  selector: 'app-show-product',
  templateUrl: './show-product.component.html',
  styleUrls: ['./show-product.component.scss'],
})
export class ShowProductComponent implements OnInit {
  @Input() products: Product[];
  productModalOpen: boolean = false;
  categories: Category[];
categorySub : Subscription;

  constructor(
    private categoryServ : CategoriesService,
  ) {}

  ngOnInit(): void {
this.categorySub = this.categoryServ.getCategory().subscribe((data: Response) => {
  this.categories = data.result;
  // console.log(this.categories)
})
  }

  onEdit(product: Product): void {}

  onDelete(product: Product): void {}

  addProduct():void{
    this.productModalOpen = !this.productModalOpen;
  }




  ngOnDestroy():void {
    this.categorySub.unsubscribe();
  }

}
