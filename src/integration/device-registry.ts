export interface DeviceRecord {
  id: string;
  name: string;
  kind: string;
  lastSeen: number;
}

export class DeviceRegistry {
  private devices: Map<string, DeviceRecord>;

  constructor() {
    this.devices = new Map<string, DeviceRecord>();
  }

  register(record: DeviceRecord): void {
    this.devices.set(record.id, {
      id: record.id,
      name: record.name,
      kind: record.kind,
      lastSeen: record.lastSeen
    });
  }

  heartbeat(id: string, now: number): boolean {
    var device = this.devices.get(id);
    if (!device) return false;

    device.lastSeen = now;
    return true;
  }

  prune(now: number, ttlMs: number): DeviceRecord[] {
    var removed: DeviceRecord[] = [];
    var ids: string[] = [];

    this.devices.forEach(function (device) {
      ids.push(device.id);
    });

    for (var i = 0; i < ids.length; i++) {
      var id = ids[i];
      var device = this.devices.get(id);
      if (device && now - device.lastSeen > ttlMs) {
        removed.push(device);
        this.devices.delete(id);
      }
    }

    return removed;
  }

  list(): DeviceRecord[] {
    var all: DeviceRecord[] = [];

    this.devices.forEach(function (device) {
      all.push(device);
    });

    return all.sort(function (a, b) {
      return b.lastSeen - a.lastSeen;
    });
  }

  size(): number {
    return this.devices.size;
  }

  has(id: string): boolean {
    return this.devices.has(id);
  }
}
