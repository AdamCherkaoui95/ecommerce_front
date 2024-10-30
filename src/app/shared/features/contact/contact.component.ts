import {
  Component,
  computed,
  EventEmitter,
  inject,
  input,
  Output,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Product } from "app/products/data-access/product.model";
import { Contact } from "app/shared/data-access/contact";
import { MessageService, SelectItem } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { DropdownModule } from "primeng/dropdown";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CardModule } from "primeng/card";
import { ContactsService } from "app/shared/data-access/contact.service";
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    CardModule,
    ToastModule
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  contact: Contact = new Contact();
  private readonly contactsService = inject(ContactsService);
  constructor(private messageService: MessageService) {

  }

  public onSave(form: any) {
    this.contactsService.create(this.contact).subscribe(res => {
      if (res) {
        this.contact = new Contact();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Demande de contact envoyée avec succès' });
      }
    });
  }
}
