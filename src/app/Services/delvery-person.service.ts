import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralResponse } from './cart.service';
import { DeliveryPerson } from './delivery-person.service';
import { DeliveryPersonUpdateDTO, Offer } from '../Interfaces/idelvery-person';
import { Environment } from '../Environment/environment';

@Injectable({
  providedIn: 'root'
})
export class DelveryPersonService {

  private apiUrl = `${Environment.baseUrl}/DeliveryPerson`

  constructor(private http: HttpClient) {}

  // --- CRUD / Info ---
  getById(id: string): Observable<GeneralResponse<DeliveryPerson>> {
    return this.http.get<GeneralResponse<DeliveryPerson>>(`${this.apiUrl}/${id}`);
  }

  getAll(): Observable<GeneralResponse<DeliveryPerson[]>> {
    return this.http.get<GeneralResponse<DeliveryPerson[]>>(this.apiUrl);
  }

  getAvailable(): Observable<GeneralResponse<DeliveryPerson[]>> {
    return this.http.get<GeneralResponse<DeliveryPerson[]>>(`${this.apiUrl}/available`);
  }

  update(id: string, dto: DeliveryPersonUpdateDTO): Observable<GeneralResponse<DeliveryPerson>> {
    return this.http.put<GeneralResponse<DeliveryPerson>>(`${this.apiUrl}/${id}`, dto);
  }

  // --- Offers Management ---
  getAllOffers(driverId: string): Observable<GeneralResponse<Offer[]>> {
    return this.http.get<GeneralResponse<Offer[]>>(`${this.apiUrl}/${driverId}/offers/all`);
  }

  getPendingOffers(driverId: string): Observable<GeneralResponse<Offer[]>> {
    return this.http.get<GeneralResponse<Offer[]>>(`${this.apiUrl}/${driverId}/offers/pending`);
  }

  acceptOffer(driverId: string, offerId: string): Observable<GeneralResponse<Offer>> {
    return this.http.post<GeneralResponse<Offer>>(
      `${this.apiUrl}/${driverId}/offers/${offerId}/accept`, {}
    );
  }

  declineOffer(driverId: string, offerId: string): Observable<GeneralResponse<Offer>> {
    return this.http.post<GeneralResponse<Offer>>(
      `${this.apiUrl}/${driverId}/offers/${offerId}/decline`, {}
    );
  }

  cancelOffer(driverId: string, offerId: string): Observable<GeneralResponse<Offer>> {
    return this.http.post<GeneralResponse<Offer>>(
      `${this.apiUrl}/${driverId}/offers/${offerId}/cancel`, {}
    );
  }
}
