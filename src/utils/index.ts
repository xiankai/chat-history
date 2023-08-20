import has from "lodash/has";
import get from "lodash/get";
import set from "lodash/set";

// https://github.com/lodash/lodash/issues/1315
export const push_safe = (
  obj: object,
  key: string | (number | string)[],
  val: any
): number => {
  if (has(obj, key)) {
    return get(obj, key).push(val) - 1;
  } else {
    set(obj, key, [val]);
    return 0;
  }
};

export const get_random_item = <T>(arr: T[]): T => {
  const randomIndex = Math.floor(Math.random() * arr.length);
  const randomChoice = arr[randomIndex];
  return randomChoice;
};
