import { Injectable, inject, signal } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, Observable, of, tap } from "rxjs";
import { environment } from "environments/environment";
import { PanierDetail } from "./panier-detail.model";
import { Product } from "app/products/data-access/product.model";

@Injectable({
    providedIn: "root"
}) export class PanierService {

    private readonly http = inject(HttpClient);
    private readonly path = environment.ROOT_URL + "/api/panier/";

    private readonly _panier = signal<PanierDetail[]>([]);

    public readonly panier = this._panier.asReadonly();
    public panierlocal: PanierDetail[] = [];
    constructor() {
        this.getPanierDetail();
    }

    getQuantity(productId: number) {
        const existingProductIndex = this.panierlocal.findIndex(item => item.product.id === productId);
        if (existingProductIndex !== -1) {
            return this.panierlocal[existingProductIndex];
        }
    }

    getPanierDetail() {
        let panier = localStorage.getItem("panier");
        if (panier !== null) {
            this.panierlocal = JSON.parse(panier);
            this._panier.update(() => this.panierlocal);
        }
    }

    deletePanierDetail(productId: number) {
        const existingPanier = localStorage.getItem("panier");
        if (existingPanier !== null) {
            this.panierlocal = JSON.parse(existingPanier);
            this.panierlocal = this.panierlocal.filter(item => item.product.id !== productId);
            localStorage.setItem('panier', JSON.stringify(this.panierlocal));
        }
    }



    addPanierDetail(product: Product) {
        let panierdetail = { id: 0, quantity: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), product: product };
        this.addToPanier(panierdetail);
    }

    addToPanier(panierdetail: PanierDetail) {
        const existingPanier = localStorage.getItem("panier");
        if (existingPanier !== null) {
            this.panierlocal = JSON.parse(existingPanier);
            const existingProductIndex = this.panierlocal.findIndex(item => item.product.id === panierdetail.product.id);
            if (existingProductIndex !== -1) {
                this.panierlocal[existingProductIndex].quantity++;
            } else {
                this.panierlocal.push(panierdetail);
            }
        } else {
            this.panierlocal = [panierdetail];
        }
        localStorage.setItem('panier', JSON.stringify(this.panierlocal));
        this._panier.update(() => this.panierlocal);
    }

    public create(): Observable<boolean> {
        this.getPanierDetail();
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.post<boolean>(this.path, this.panierlocal, { headers }).pipe(
            catchError(() => {
                return of(true);
            }),
            // tap(() => this._panier.update(() => []))
        );
    }

    // public get(): Observable<PanierDetail[]> {
    //     return this.http.get<PanierDetail[]>(this.path).pipe(

    //         tap((panier) => this._panier.set(panier)),
    //     );
    // }



    // public update(panier: PanierDetail): Observable<boolean> {
    //     return this.http.patch<boolean>(`${this.path}/${panier.id}`, panier).pipe(
    //         catchError(() => {
    //             return of(true);
    //         }),
    //         tap(() => this._panier.update(paniers => {
    //             return paniers.map(p => p.id === panier.id ? panier : p)
    //         })),
    //     );
    // }

    // public delete(panierId: number): Observable<boolean> {
    //     return this.http.delete<boolean>(`${this.path}/${panierId}`).pipe(
    //         catchError(() => {
    //             return of(true);
    //         }),
    //         tap(() => this._panier.update(paniers => paniers.filter(panier => panier.id !== panierId))),
    //     );
    // }
}