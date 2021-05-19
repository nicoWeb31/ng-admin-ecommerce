import { Component, OnInit } from '@angular/core';
import { Response } from 'src/app/models/response';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  products;
  productSub;

  constructor(
    private productServ : ProductsService,
  ) { }

  ngOnInit(): void {
    this.productSub = this.productServ.getProducts().subscribe((data : Response) => {
      this.products = data.result
    },(err)=>{
      console.log(err.message)
    })
  }

}
