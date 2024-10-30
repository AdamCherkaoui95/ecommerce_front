import { Injectable, inject, signal } from "@angular/core";
import { Product } from "./product.model";
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable, of, tap } from "rxjs";
import { environment } from "environments/environment";

export interface PaginatedProducts {
    content: Product[]; // Array of products
    totalElements: number; // Total number of products
    totalPages: number; // Total number of pages
    size: number; // Number of items per page
    number: number; // Current page number
}

@Injectable({
    providedIn: "root"
})
export class ProductsService {

    private readonly http = inject(HttpClient);
    private readonly path = environment.ROOT_URL + "/api/products/";

    private readonly _products = signal<Product[]>([]);
    public readonly products = this._products.asReadonly();

    // Method to fetch paginated products
    public get(page: number = 0, size: number = 10): Observable<PaginatedProducts> {
        return this.http.get<PaginatedProducts>(`${this.path}?page=${page}&size=${size}`).pipe(
            catchError((error) => {
                console.error('Fetching products failed', error);
                return this.http.get<Product[]>("assets/products.json").pipe(
                    map(products => ({
                        content: products,
                        totalElements: products.length, // Total number of products
                        totalPages: 1, // Assuming a single page since it's a static file
                        size: products.length, // Total items in this static file
                        number: 0 // Current page number (static)
                    }))
                );
            }),
            tap(({ content }) => {
                this._products.set(content);
            }),
        );
    }

    public create(product: Product): Observable<boolean> {
        return this.http.post<boolean>(this.path, product).pipe(
            catchError(() => {
                return of(true);
            }),
            tap(() => this._products.update(products => [product, ...products])),
        );
    }

    public update(product: Product): Observable<boolean> {
        return this.http.patch<boolean>(`${this.path}/${product.id}`, product).pipe(
            catchError(() => {
                return of(true);
            }),
            tap(() => this._products.update(products => {
                return products.map(p => p.id === product.id ? product : p);
            })),
        );
    }

    public delete(productId: number): Observable<boolean> {
        return this.http.delete<boolean>(`${this.path}/${productId}`).pipe(
            catchError(() => {
                return of(true);
            }),
            tap(() => this._products.update(products => products.filter(product => product.id !== productId))),
        );
    }
}
