import { Injectable, inject, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable, of, tap } from "rxjs";
import { environment } from "environments/environment";
import { Contact } from "./contact";

@Injectable({
    providedIn: "root"
}) export class ContactsService {

    private readonly http = inject(HttpClient);
    private readonly path = environment.ROOT_URL + "/api/contact/";


    public create(contact: Contact): Observable<boolean> {
        return this.http.post<boolean>(this.path, contact).pipe(
            catchError(() => {
                return of(true);
            }),
            tap(() => { return of(false); }),
        );
    }

}