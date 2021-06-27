import has from 'lodash/has';
import get from 'lodash/get';
import set from 'lodash/set';

// https://github.com/lodash/lodash/issues/1315
export const push_safe = (
  obj: object,
  key: string | (number | string)[],
  val: any
) => {
  if (has(obj, key)) {
    get(obj, key).push(val);
  } else {
    set(obj, key, [val]);
  }
};
