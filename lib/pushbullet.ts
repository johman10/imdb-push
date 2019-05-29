function createDevice(pusher: Pushbullet, nickname: string): Promise<Device> {
  const deviceOptions = {
    nickname,
    icon: DeviceIcon.system,
    has_sms: false, // eslint-disable-line @typescript-eslint/camelcase
  };
  return pusher.createDevice(deviceOptions);
}

export function findOrCreateDevice(pusher: Pushbullet, nickname: string): Promise<Device> {
  return pusher.devices()
    .then((result): Promise<Device> | Device => {
      const appDevice = result.devices.find((device: Device): boolean => (
        device.nickname === nickname
      ));
      if (!appDevice) return createDevice(pusher, nickname);
      return appDevice;
    });
}

export function pushToDevice(
  pusher: Pushbullet,
  deviceIden: string,
  title: string,
  message: string,
): Promise<Push> {
  return pusher.note(deviceIden, title, message);
}
