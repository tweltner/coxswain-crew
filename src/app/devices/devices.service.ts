import { Injectable } from '@angular/core';
import { BluetoothService } from './bluetooth.service';

@Injectable({
  providedIn: 'root',
})
export class DevicesService {
  constructor(private bleService: BluetoothService) {}
}
