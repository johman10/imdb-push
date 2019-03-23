function createDevice(pusher: Pusher, nickname: string): Promise<Device> {
  const deviceOptions = {
    nickname,
    icon: 'system',
    has_sms: false,
  };
  return pusher.createDevice(deviceOptions);
}

export function findOrCreateDevice(pusher: Pusher, nickname: string): Promise<Device> {
  return pusher.devices()
    .then((result: { devices: Device[] }) => {
      const appDevice = result.devices.find((device: Device) => device.nickname === nickname);
      if (!appDevice) return createDevice(pusher, nickname);
      return appDevice;
    });
}

export function pushToDevice(
  pusher: Pusher,
  deviceIden: string,
  title: string,
  message: string,
): Promise<Push> {
  return pusher.note(deviceIden, title, message);
}
