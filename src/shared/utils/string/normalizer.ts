function normalizer(value: string | number | null | undefined): string | null {
  if (value === undefined || value === null) return null;

  const str = value.toString().trim();

  if (str === 'undefined' || str === 'null' || str === '') return null;

  return str;
}

export { normalizer };
