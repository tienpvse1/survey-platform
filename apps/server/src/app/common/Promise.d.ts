declare global {
  interface Promise<T> {
    try(): Promise<[T | undefined, Error | undefined]>;
  }
}
export {};
