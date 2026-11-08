// SMELL: Magic Numbers / Magic Strings. What are 15, 2.5, 18 and 'EV'? Why 0.5? Changing the free
// period means hunting for every 15 in the code base and guessing which ones are minutes.
export function parkingFee(minutes: number, vehicle: string): number {
  if (minutes <= 15) {
    return 0;
  }
  let fee = Math.ceil((minutes - 15) / 60) * 2.5;
  if (fee > 18) {
    fee = 18;
  }
  if (vehicle === 'EV') {
    fee = fee * 0.5;
  }
  return fee;
}
