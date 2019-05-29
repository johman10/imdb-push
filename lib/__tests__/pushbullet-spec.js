const { findOrCreateDevice } = require('../pushbullet');
const { devices, createDevice } = require('../__mockData__/pushbullet.mock');

const EXPECTED_DEVICE_NAME = createDevice.nickname;

const pusher = {
  devices: jest.fn(),
  createDevice: jest.fn(),
};

describe('device', () => {
  describe('findOrCreateDevice', () => {
    it('returns a device if it finds one matching the passed in name', () => {
      pusher.devices.mockReturnValueOnce(Promise.resolve(devices));

      return findOrCreateDevice(pusher, EXPECTED_DEVICE_NAME).then((result) => {
        expect(pusher.devices).toHaveBeenCalledTimes(1);
        expect(pusher.createDevice).toHaveBeenCalledTimes(0);
        expect(result).toMatchObject(devices.devices[0]);
      });
    });

    it('returns creates and returns a new device if there was no matching devices', () => {
      pusher.devices.mockReturnValueOnce(Promise.resolve({ devices: [] }));
      pusher.createDevice.mockReturnValueOnce(Promise.resolve(createDevice));

      return findOrCreateDevice(pusher, EXPECTED_DEVICE_NAME).then((result) => {
        expect(pusher.devices).toHaveBeenCalledTimes(1);
        expect(pusher.createDevice).toHaveBeenCalledTimes(1);
        expect(pusher.createDevice).toHaveBeenCalledWith({
          nickname: EXPECTED_DEVICE_NAME,
          icon: 'system',
          has_sms: false,
        });
        expect(result).toMatchObject(createDevice);
      });
    });
  });
});
