import { CommonModule } from "@angular/common";
import { Component, OnInit, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Product } from "app/products/data-access/product.model";
import { ProductsService } from "app/products/data-access/products.service";
import { ProductFormComponent } from "app/products/ui/product-form/product-form.component";
import { PanierDetail } from "app/shop/data-access/panier-detail.model";
import { PanierService } from "app/shop/data-access/panier.service";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-shop-list',
  standalone: true,
  templateUrl: './shop-list.component.html',
  styleUrl: './shop-list.component.css',
  imports: [DataViewModule, CardModule, ButtonModule, DialogModule, ProductFormComponent, InputNumberModule, FormsModule, CommonModule],
})

export class ShopListComponent {
  private readonly productsService = inject(ProductsService);
  private readonly panierService = inject(PanierService);

  public panierlocal: PanierDetail[] = [];

  public readonly products = this.productsService.products;
  public readonly panier = this.panierService.panier;

  public isDialogVisible = false;
  public isCreation = false;
  value1: number = 0;
  ngOnInit() {
    this.productsService.get().subscribe();
  }



  onQuantityChange(productId: number, newQuantity: number) {
    const existingPanier = localStorage.getItem("panier");
    if (existingPanier !== null) {
      this.panierlocal = JSON.parse(existingPanier);
      const existingProductIndex = this.panierlocal.findIndex(item => item.product.id === productId);
      if (existingProductIndex !== -1) {
        this.panierlocal[existingProductIndex].quantity = newQuantity;
      }
      localStorage.setItem('panier', JSON.stringify(this.panierlocal));
    }
  }

  getQuantity(productId: number) {
    return this.panierService.getQuantity(productId);
  }

  deletePanierDetail(productId: number) {
    this.panierService.deletePanierDetail(productId);
  }

  addPanierDetail(product: Product) {
    this.panierService.addPanierDetail(product);
  }






}
