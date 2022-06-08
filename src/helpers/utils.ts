export const isNumeric = (value: string): boolean => /^-?\d+$/.test(value);

export const error = (status: number, message: string): Response =>
  new Response(message, {status});
