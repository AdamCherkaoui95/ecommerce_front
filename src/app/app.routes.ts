import { Routes } from "@angular/router";
import { ContactComponent } from "./shared/features/contact/contact.component";
import { HomeComponent } from "./shared/features/home/home.component";

export const APP_ROUTES: Routes = [
  {
    path: "home",
    component: HomeComponent,
  },
  {
    path: "contact",
    component: ContactComponent,
  },
  {
    path: "products",
    loadChildren: () =>
      import("./products/products.routes").then((m) => m.PRODUCTS_ROUTES)
  },
  {
    path: "shop",
    loadChildren: () =>
      import("./shop/shop.routes").then((m) => m.SHOP_ROUTES)
  },
  { path: "", redirectTo: "home", pathMatch: "full" },
];
