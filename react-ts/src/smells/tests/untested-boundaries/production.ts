// Production code: museum ticket fare by age.
export type Fare = "free" | "child" | "adult" | "senior";

export function fareForAge(age: number): Fare {
  if (!Number.isInteger(age) || age < 0) throw new RangeError("Invalid age");
  if (age < 4) return "free";
  if (age < 18) return "child";
  if (age < 65) return "adult";
  return "senior";
}
