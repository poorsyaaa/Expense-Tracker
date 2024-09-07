export type DefaultOptions<
  QP = Record<string, never>,
  D = Record<string, never>,
  PP = Record<string, never>,
> = {
  endpoint: string;
  queryParams?: QP;
  data?: D;
  pathParams?: PP;
  signal?: AbortSignal;
  headers?: Record<string, string>;
};
