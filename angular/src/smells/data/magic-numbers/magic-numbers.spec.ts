import { parkingFee as smellyFee } from './smelly';
import { parkingFee, type VehicleKind } from './refactored';

const legacyCode: Record<VehicleKind, string> = { combustion: 'ICE', electric: 'EV' };

describe('Magic Numbers', () => {
  it.each([
    [10, 'combustion'],
    [16, 'combustion'],
    [130, 'electric'],
    [1000, 'combustion'],
    [1000, 'electric'],
  ] as const)('both versions charge the same for %i minutes (%s)', (minutes, vehicle) => {
    expect(parkingFee(minutes, vehicle)).toBe(smellyFee(minutes, legacyCode[vehicle]));
  });
});
