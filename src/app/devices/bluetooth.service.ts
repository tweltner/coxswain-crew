import { Injectable } from '@angular/core';
import { BleClient, BleDevice, BleService } from '@capacitor-community/bluetooth-le';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BluetoothService {
  private static readonly SCAN_TIMEOUT = 60 * 1000; // 60 seconds

  private _scanning$ = new BehaviorSubject<boolean>(false);
  private devices: BleDevice[] = [];
  private devices$ = new BehaviorSubject<BleDevice[]>([]);

  /**
   *
   */
  async initialize(): Promise<void> {
    try {
      await BleClient.initialize({ androidNeverForLocation: false });

      const connectedDevices = await BleClient.getConnectedDevices([]);
      this.devices = [...this.devices, ...connectedDevices];
      this.devices$.next(this.devices);
    } catch (e) {
      console.error('exception in ble client: ', e);
    }
  }

  /**
   *
   * @returns
   */
  getDevices(): Observable<BleDevice[]> {
    return this.devices$.asObservable();
  }

  isScanActive(): Observable<boolean> {
    return this._scanning$.asObservable();
  }

  /**
   *
   */
  async startScan(): Promise<void> {
    this._scanning$.next(true);

    await BleClient.requestLEScan({ allowDuplicates: false }, (result) => {
      console.log('yeah i found some device ;)');
      console.log('name: ', result.localName);
      console.log('uuid: ', JSON.stringify(result.device));

      this.devices = [...this.devices, result.device];
      this.devices$.next(this.devices);
    }).catch((e) => {
      console.error('Error during ble scan', e);
    });

    setTimeout(async () => {
      await this.stopScan();
      console.log('Stop scanning for ble devices because of timeout.');
    }, BluetoothService.SCAN_TIMEOUT);
  }

  /**
   *
   */
  async stopScan(): Promise<void> {
    this._scanning$.next(false);
    await BleClient.stopLEScan();
  }

  async connect(deviceId: string, onDisconnectFn?: (deviceId: string) => void): Promise<void> {
    await BleClient.connect(deviceId, onDisconnectFn);
  }

  async disconnect(deviceId: string): Promise<void> {
    await BleClient.disconnect(deviceId);
  }

  async getServices(deviceId: string): Promise<BleService[]> {
    return BleClient.getServices(deviceId);
  }
}
