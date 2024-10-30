import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, Routes } from "@angular/router";
import { PanierListComponent } from "./features/panier-list/panier-list.component";
import { ShopListComponent } from "./features/shop-list/shop-list.component";

export const SHOP_ROUTES: Routes = [
	{
		path: "",
		component: ShopListComponent,
	},
	{
		path: "panier",
		component: PanierListComponent,
	},
	{ path: "**", redirectTo: "" },
];
