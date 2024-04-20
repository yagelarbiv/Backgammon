export type UntilRange<Max extends number> = number | Max;

export type _Range<Max extends number, Arr extends number[]> = Arr['length'] extends Max
  ? Arr[number]
  : _Range<Max, [...Arr, Arr['length']]>;

export type Range<Max extends number> = _Range<Max, []>;

export function unshiftFrom<T>(arr: T[], item: T) {
  const index = arr.indexOf(item);
  if (index > -1 && index < arr.length) {
    const [itemToMove] = arr.splice(index, 1);
    arr.unshift(itemToMove);
  }
  return arr;
}
