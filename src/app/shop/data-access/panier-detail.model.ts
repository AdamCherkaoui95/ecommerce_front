import { Product } from "app/products/data-access/product.model";

export interface PanierDetail {
    id: number;
    quantity: number;
    createdAt: string;
    updatedAt: string;
    product: Product;

}
