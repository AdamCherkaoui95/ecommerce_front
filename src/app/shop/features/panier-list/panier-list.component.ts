import { Component, OnInit, inject, signal } from "@angular/core";
import { Product } from "app/products/data-access/product.model";
import { ProductFormComponent } from "app/products/ui/product-form/product-form.component";
import { PanierDetail } from "app/shop/data-access/panier-detail.model";
import { PanierService } from "app/shop/data-access/panier.service";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DataViewModule } from "primeng/dataview";
import { DialogModule } from "primeng/dialog";


@Component({
  selector: 'app-panier-list',
  standalone: true,
  templateUrl: './panier-list.component.html',
  styleUrl: './panier-list.component.css',
  imports: [DataViewModule, CardModule, ButtonModule, DialogModule, ProductFormComponent],
})
export class PanierListComponent {
  private readonly panierService = inject(PanierService);

  public readonly panier = this.panierService.panier;

  ngOnInit() {
  }

  getPanierDetail() {
    this.panierService.getPanierDetail();
  }

  deletePanierDetail(productId: number) {
    this.panierService.deletePanierDetail(productId);
  }

  addPanierDetail(panierdetail: PanierDetail) {
    this.panierService.addToPanier(panierdetail);
  }

  onCreate() {
    this.panierService.create().subscribe();
  }

}
