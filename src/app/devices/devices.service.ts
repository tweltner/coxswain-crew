import { Injectable, inject } from '@angular/core';
import { BluetoothService } from './bluetooth.service';

@Injectable({
  providedIn: 'root',
})
export class DevicesService {
  private bleService = inject(BluetoothService);
}
