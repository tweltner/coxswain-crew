import { Injectable } from '@angular/core';
import { BleClient, BleDevice } from '@capacitor-community/bluetooth-le';
import { BehaviorSubject } from 'rxjs';

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
  async initialize() {
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
  getDevices() {
    return this.devices$.asObservable();
  }

  isScanActive() {
    return this._scanning$.asObservable();
  }

  /**
   *
   */
  async startScan() {
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
  async stopScan() {
    this._scanning$.next(false);
    await BleClient.stopLEScan();
  }

  async connect(deviceId: string, onDisconnectFn?: (deviceId: string) => void) {
    await BleClient.connect(deviceId, onDisconnectFn);
  }

  async disconnect(deviceId: string) {
    await BleClient.disconnect(deviceId);
  }

  async getServices(deviceId: string) {
    return BleClient.getServices(deviceId);
  }
}
