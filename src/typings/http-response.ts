type HttpResponseGeneric<T> = {
  code: number;
  message: string;
  data: T;
};

export type { HttpResponseGeneric };
