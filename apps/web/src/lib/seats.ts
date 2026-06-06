/**
 * Seat accounting for a company.
 *
 * The company admin assigned when the company is created is a free "owner"
 * seat — it does NOT count against `maximumUsers`. `maximumUsers` is therefore
 * the number of *additional* members the owner can add (default 3), so a
 * company can hold the owner admin plus `maximumUsers` other members.
 *
 * Exactly one admin seat is treated as the free owner; every other admin and
 * every user counts. This keeps the math robust regardless of how many admins
 * the owner promotes.
 */
export function computeSeatUsage(
  adminCount: number,
  userCount: number,
  maximumUsers: number
) {
  const total = adminCount + userCount;
  const ownerSeat = adminCount > 0 ? 1 : 0; // the assigned company admin is free
  const used = Math.max(0, total - ownerSeat);
  const remaining = Math.max(0, maximumUsers - used);
  return { total, used, remaining, ownerSeat };
}
