export function orderBySelected(
  all: string[],
  selected: string[]
): string[] {
  const selectedSet = new Set(selected);

  return [
    ...selected,
    ...all.filter(item => !selectedSet.has(item)),
  ];
}
