/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="./Promise.d.ts" />

Promise.prototype.try = async function <T>(
  this: Promise<T>
): Promise<[T, Error]> {
  try {
    const value = await this;
    return [value, undefined];
  } catch (error) {
    return [undefined, error as Error];
  }
};
