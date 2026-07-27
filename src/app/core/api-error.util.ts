export function getApiError(err: any, fallback = 'Error inesperado'): string {
  return err?.error?.error ?? err?.error?.detail ?? err?.message ?? fallback;
}
