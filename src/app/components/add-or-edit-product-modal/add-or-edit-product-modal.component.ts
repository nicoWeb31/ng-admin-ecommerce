import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-add-or-edit-product-modal',
  templateUrl: './add-or-edit-product-modal.component.html',
  styleUrls: ['./add-or-edit-product-modal.component.scss']
})
export class AddOrEditProductModalComponent implements OnInit {

  @Input() product: Product;
  productform : FormGroup;

  constructor(
    private fb : FormBuilder,
  ) { }

  ngOnInit(): void {
    this.initialForm()
  }

  initialForm():void {
    this.productform = this.fb.group({
      productInfo: this.fb.group({
        name: ['', Validators.required],
        description: ['', Validators.required],
        price: ['', Validators.required],
        stock: ['', Validators.required],
      }),
      illustration: this.fb.group({
        image: ['', Validators.required],
      })

    })
  }

}
