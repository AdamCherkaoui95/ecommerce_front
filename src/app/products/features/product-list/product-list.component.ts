import { Component, OnInit, inject, signal } from "@angular/core";
import { Product } from "app/products/data-access/product.model";
import { ProductsService } from "app/products/data-access/products.service";
import { ProductFormComponent } from "app/products/ui/product-form/product-form.component";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from "primeng/dialog";
import { PaginatorModule } from 'primeng/paginator';
import { CommonModule } from '@angular/common';

const emptyProduct: Product = {
  id: 0,
  code: "",
  name: "",
  description: "",
  image: "",
  category: "",
  price: 0,
  quantity: 0,
  internalReference: "",
  shellId: 0,
  inventoryStatus: "INSTOCK",
  rating: 0,
  createdAt: '',
  updatedAt: '',
};

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    DataViewModule,
    CardModule,
    ButtonModule,
    DialogModule,
    ProductFormComponent,
    PaginatorModule,
  ],
})
export class ProductListComponent implements OnInit {
  private readonly productsService = inject(ProductsService);

  public products: Product[] = [];
  public totalRecords: number = 0; // Total number of records for pagination
  public currentPage: number = 0;
  public pageSize: number = 10; // Items per page

  public isDialogVisible = false;
  public isCreation = false;
  public readonly editedProduct = signal<Product>(emptyProduct);

  ngOnInit() {
    this.loadProducts(this.currentPage, this.pageSize);
  }

  private loadProducts(page: number, size: number): void {
    this.productsService.get(page, size).subscribe(data => {
      this.products = data.content; // Assuming 'content' holds the products array
      this.totalRecords = data.totalElements; // Assuming 'totalElements' holds the total count
    });
  }

  public onPageChange(event: any): void {
    this.currentPage = event.page;
    this.loadProducts(this.currentPage, this.pageSize);
  }

  public onCreate() {
    this.isCreation = true;
    this.isDialogVisible = true;
    this.editedProduct.set(emptyProduct);
  }

  public onUpdate(product: Product) {
    this.isCreation = false;
    this.isDialogVisible = true;
    this.editedProduct.set(product);
  }

  public onDelete(product: Product) {
    this.productsService.delete(product.id).subscribe(() => {
      this.loadProducts(this.currentPage, this.pageSize); // Reload products after deletion
    });
  }

  public onSave(product: Product) {
    if (this.isCreation) {
      this.productsService.create(product).subscribe(() => {
        this.loadProducts(this.currentPage, this.pageSize); // Reload products after creation
      });
    } else {
      this.productsService.update(product).subscribe(() => {
        this.loadProducts(this.currentPage, this.pageSize); // Reload products after update
      });
    }
    this.closeDialog();
  }

  public onCancel() {
    this.closeDialog();
  }

  private closeDialog() {
    this.isDialogVisible = false;
  }

  trackByFn(index: number, product: Product): number {
    return product.id; // Return a unique identifier for each item
  }
}
