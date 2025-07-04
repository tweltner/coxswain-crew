import { ChangeDetectionStrategy, Component, inject, Injector, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { IonButton, IonItem, IonLabel, IonList, IonSpinner } from '@ionic/angular/standalone';
import { BluetoothService } from './bluetooth.service';
import { BleClient } from '@capacitor-community/bluetooth-le';
import { FITNESS_MACHINE_ROWER_DATA_CHARACTERISTIC, FITNESS_MACHINE_SERVICE } from './pirowflo/pirowflo-ble-services';

@Component({
  selector: 'cwc-devices',
  imports: [IonSpinner, IonButton, IonList, IonItem, IonLabel],
  templateUrl: './devices.component.html',
  styleUrl: './devices.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevicesComponent {
  private bleService = inject(BluetoothService);
  private injector = inject(Injector);
  private deviceId = '';

  readonly scanActive = toSignal(this.bleService.isScanActive(), {
    injector: this.injector,
    initialValue: false,
  });

  readonly devices = toSignal(this.bleService.getDevices(), { injector: this.injector });
  readonly connected = signal(false);

  startScanning(): void {
    this.bleService.startScan();
  }

  stopScanning(): void {
    this.bleService.stopScan();
  }

  async connect(deviceId: string): Promise<void> {
    await this.bleService.connect(deviceId, (id) => this.onDisconnect(id));
    const services = await this.bleService.getServices(deviceId);

    this.connected.set(true);
    this.deviceId = deviceId;

    console.log(JSON.stringify(services));

    await BleClient.startNotifications(
      this.deviceId,
      FITNESS_MACHINE_SERVICE,
      FITNESS_MACHINE_ROWER_DATA_CHARACTERISTIC,
      (value) => {
        console.log('current data: ', this.parseRowerData(value));
      },
    );
  }

  async disconnect(): Promise<void> {
    await this.bleService.disconnect(this.deviceId);
    this.deviceId = '';
    this.connected.set(false);
  }

  private onDisconnect(deviceId: string): void {
    console.log(`device ${deviceId} disconnected.`);
  }

  private parseRowerData(data: DataView): number {
    return data.getUint16(0);
  }
}
