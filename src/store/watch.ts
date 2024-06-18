/*eslint no-console: 0*/

import { DependencyList, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Config } from '../config';

// private begins
const privateStoreData: {
  [key: string]: {
    model: any;
    uuid: string;
    isArray: boolean;
    options: StoreOptions<unknown, unknown>;
    keepList?: any[] /* items that wont be removed during updates */;
  };
} = {};

export const getKeyFromModel = <T>(model: T | T[]) => {
  const existingKey = Object.keys(privateStoreData).find((key) => {
    return privateStoreData[key].model === model;
  });
  if (existingKey) {
    return existingKey;
  }

  let key: any = model;
  if (typeof model === 'string' || typeof model === 'number') {
    key = Symbol(model);
  }
  if (typeof model === 'object') {
    return null;
  }
  return key;
};
// private ends

// public options
export interface StoreOptions<T, B> {
  /* Trigger change event on all object's individual props even if only a single one changed */
  greedy?: boolean; // TODO find a better name
  allowUpdateToUndefined?: boolean; // TODO find a better name
  allowWatchingFutureProperties?: boolean;
  /* Send it custom store key. Leave empty to have it auto-generated */
  storeKey?: string;
  customValues?: T | T[] | B | B[]; // optional custom values for the store instead of root object
}

// create store
// TODO make a deleteWatchStore()
export const createWatchStore = <T, B>(model: T | T[] | any, options?: StoreOptions<T, B>): any => {
  if (model === null) {
    console.error('failed to create store, no object passed');
    return;
  }

  const defaultOptions: StoreOptions<T, B> = {
    greedy: false,
    allowUpdateToUndefined: true,
    storeKey: undefined,
    allowWatchingFutureProperties: false,
    customValues: undefined,
  };

  if (options === undefined) {
    options = { ...defaultOptions };
  } else {
    // merge options with default
    options = { ...defaultOptions, ...options };
  }
  const newKey = uuidv4();
  const storeKey = options.storeKey || getKeyFromModel(model) || newKey;
  if (privateStoreData[storeKey] !== undefined) {
    // FIXME, an object could have changed but still match here as a key, even though different.
    console.error('failed to create store, already existing for this object passed');
    return;
  }

  privateStoreData[storeKey] = {
    model: model,
    uuid: newKey,
    options: options,
    isArray: options.customValues ? Array.isArray(options.customValues) : Array.isArray(model),
  };

  return privateStoreData[storeKey];
};

export const watchStoresEmptyCollections = () => {
  Object.keys(privateStoreData).forEach((key) => {
    if (privateStoreData[key].isArray) {
      privateStoreData[key].model.length = 0; // keep reference
    }
  });
};

// consumer side
export const watch = <T>(model: T, item: string, callback: (value: string) => void) => {
  const storeKey = getKeyFromModel(model);
  const store = privateStoreData[storeKey];
  if (store === undefined) {
    console.error('store does not exists for this model', model);
    return () => {
      return;
    };
  }
  const eventKey = 'watch.' + store.uuid + '.' + item;

  const watchFunc = (event: CustomEvent) => {
    callback(event.detail.value);
  };

  // adding watch event
  document.addEventListener(eventKey, watchFunc as EventListener);

  return () => {
    document.removeEventListener(eventKey, watchFunc as EventListener);
  };
};

export const watchFullObject = <T>(model: T, callback: (value: T) => void) => {
  const storeKey = getKeyFromModel(model);
  const store = privateStoreData[storeKey];
  if (!store) {
    Config.isDebug && console.error('no store found for model', model, storeKey); // this error if transient can be happen normally
    return () => {
      return;
    };
  }
  const eventKey = 'watch.' + store.uuid;

  const watchFunc = (event: CustomEvent) => {
    callback(event.detail.value);
  };

  // adding watch event
  document.addEventListener(eventKey, watchFunc as EventListener);

  return () => {
    document.removeEventListener(eventKey, watchFunc as EventListener);
  };
};

// single property
export const useWatch = <T>(model: T, item: string, setter: (value: any) => void) => {
  const storeKey = getKeyFromModel(model);
  const store = privateStoreData[storeKey];
  if (!store) {
    Config.isDebug && console.error('no store found for model', storeKey);
    return;
  }
  if (!Object.prototype.hasOwnProperty.call(model, item) && !store.options.allowWatchingFutureProperties) {
    console.error('watched property does not exists');
  }
  useEffect(() => {
    const unwatch = watch(model, item, (value: any) => {
      setter(value);
    });
    return () => {
      unwatch();
    };
  }, []);
};

/**
 * useWatchObject
 * Watch whole object
 * model: model that was passed to createWatchStore()
 * setter: The setter from useState() or your own.
 * enabled: Optional parameter that can be used to temporary halt the updates.
 */
export const useWatchObject = <T>(
  model: T,
  setter: (value: T) => void,
  enabled?: () => boolean,
  dependancies?: DependencyList,
) => {
  useEffect(() => {
    const unwatch = watchFullObject(model, (value: T) => {
      if (enabled && enabled() === false) {
        return; // bypass setter
      }
      if (Array.isArray(value)) {
        setter([...value] as unknown as T); // isArray true
      } else {
        setter({ ...value }); // the deconstruction creates a new object and triggers React useState change, otherwise it would see the same object.
      }
    });
    return () => {
      unwatch();
    };
  }, [enabled, dependancies]);
};

// trigger render on change
export const useWatchRenderOnChange = <T>(model: T) => {
  const [, setRender] = useState(0);
  useWatchObject(model, (_update) => {
    setRender((count) => {
      return count + 1;
    });
  });
};

export const useStateWatch = <T>(model: T, item: string, initial: any) => {
  const storeKey = getKeyFromModel(model);
  const store = privateStoreData[storeKey];
  if (!store) {
    Config.isDebug && console.error('no store found for model', storeKey);
    return;
  }
  if (!Object.prototype.hasOwnProperty.call(model, item) && !store.options.allowWatchingFutureProperties) {
    console.error('watched property does not exists');
  }
  const [value, setter] = useState(initial);
  useEffect(() => {
    const unwatch = watch(model, item, (value: any) => {
      setter(value);
    });
    return () => {
      unwatch();
    };
  }, []);
  return value;
};

// provider side
function setProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]) {
  obj[key] = value;
}
export { setProperty };

function removeItemFromArray<T>(obj: T[], itemToRemove: T) {
  if (!Array.isArray(obj)) {
    console.error('Object is not an array');
    return;
  }
  const index = obj.indexOf(itemToRemove);
  if (index >= 0) {
    obj.splice(index, 1);
  }
}

export const updateWatchStore = <T, B>(model: T | T[], updatedModel: T | T[] | B | B[]) => {
  if (updatedModel === null) {
    return; // probably logged out
  }

  const storeKey = getKeyFromModel(model);
  const store = privateStoreData[storeKey];
  if (store === undefined) {
    console.error('store does not exists for this model. Use createWatchStore()');
    return;
  }
  const eventKeyPrefix = 'watch.' + store.uuid;

  const keyDone = [];

  if (store.isArray) {
    let changed = false;
    const list = (store.options.customValues !== undefined ? store.options.customValues : model) as T[];
    const updatedList = updatedModel as T[];
    //let existingItem:T;
    const itemsToRemove = [];
    for (const existingItem of list) {
      keyDone.push(list.indexOf(existingItem));
      if (store.keepList && store.keepList.includes(existingItem)) {
        continue;
      }
      const newValue = updatedList.find((item) => item === existingItem);
      if (newValue === undefined) {
        // item was removed from list
        itemsToRemove.push(existingItem);
        changed = true;
      }
    }

    // actual delete
    itemsToRemove.forEach((i) => removeItemFromArray(list, i));

    // add items if any
    if (!Array.isArray(updatedList)) {
      console.warn('passed update is not an array but was expected to be', updatedList);
      return;
    }
    for (const newItem of updatedList) {
      const existingItem = list.find((i) => i === newItem);
      if (existingItem === undefined) {
        // item was added to the list
        const index = updatedList.indexOf(newItem);
        list.splice(index, 0, newItem);
        changed = true;
      }
    }

    // swap items if any
    for (const existingItem of list) {
      // check if index change
      const indexOriginal = list.indexOf(existingItem);
      const indexUpdated = updatedList.indexOf(existingItem);
      if (indexOriginal !== indexUpdated && indexOriginal >= 0 && indexUpdated >= 0) {
        // swap
        [list[indexOriginal], list[indexUpdated]] = [list[indexUpdated], list[indexOriginal]];
        changed = true;
      }
    }

    if (changed) {
      // final update trigger for whole object
      document.dispatchEvent(
        new CustomEvent<{ value: T[] }>(eventKeyPrefix, {
          detail: { value: list },
        }),
      );
    }
  } else {
    // model is an key-value pairs object {}
    let key: keyof T; /* | keyof B;*/
    //const object = store.options.customValues !== undefined ? store.options.customValues as B : model as T;
    const object = model as T;
    const updatedObject = updatedModel as T;
    for (key in object) {
      keyDone.push(key);
      const existingValue = object[key];
      const newValue = updatedObject[key];
      let changed = existingValue !== newValue; // not soft compare
      if (
        existingValue !== undefined &&
        newValue === undefined &&
        store.options.allowUpdateToUndefined === false // always remove items from array
      ) {
        // do not zero out this value to undefined
        changed = false;
      }

      const eventKey = eventKeyPrefix + '.' + key.toString();

      if (changed) {
        setProperty(object, key, updatedObject[key]);
      }

      if (changed || store.options.greedy) {
        document.dispatchEvent(
          new CustomEvent<{ value: T[keyof T] }>(eventKey, {
            detail: { value: object[key] },
          }),
        );
      }
    }

    // check if new keys got sent
    for (key in updatedObject) {
      if (keyDone.includes(key)) {
        continue;
      }
      keyDone.push(key);
      // we have a value that was undefined in original model
      const changed = object[key] !== updatedObject[key];
      setProperty(object, key, updatedObject[key]);
      const eventKey = eventKeyPrefix + '.' + key.toString();
      if (changed || store.options.greedy) {
        document.dispatchEvent(
          new CustomEvent<{ value: T[keyof T] }>(eventKey, {
            detail: { value: object[key] },
          }),
        );
      }
    }

    // final update trigger for whole object
    document.dispatchEvent(
      new CustomEvent<{ value: T }>(eventKeyPrefix, {
        detail: { value: object },
      }),
    );
  }
};

// only update partial properties. It will not remove other ones not updated
export const updateWatchStoreProp = <T>(model: T, updatedModel: Partial<any>) => {
  if (updatedModel === null) {
    return; // probably logged out
  }

  const storeKey = getKeyFromModel(model);
  const store = privateStoreData[storeKey];
  if (store === undefined) {
    console.error('store does not exists for this model. Use createWatchStore()');
    return;
  }
  const eventKeyPrefix = 'watch.' + store.uuid;

  const keyDone = [];
  let key: keyof T;
  // FIXME model or customValues
  for (key in model) {
    keyDone.push(key);
    const existingValue = model[key];
    const newValue = updatedModel[key];
    let changed = existingValue !== newValue;

    if (existingValue !== undefined && newValue === undefined) {
      // do not zero out this value to undefined
      changed = false;
    }

    const eventKey = eventKeyPrefix + '.' + key.toString();
    if (changed) {
      // changeCount++;
      setProperty(model, key, updatedModel[key.toString()]);
    }

    if (changed) {
      // going to send event 'eventKey'
      document.dispatchEvent(
        new CustomEvent<{ value: T[keyof T] }>(eventKey, {
          detail: { value: model[key] },
        }),
      );
    }
  }

  // check if new keys got sent
  let aKey: any;
  for (aKey in updatedModel) {
    if (keyDone.includes(aKey)) {
      continue;
    }
    keyDone.push(aKey);
    // we have a value that was undefined in original model
    const changed = model[aKey as keyof T] !== updatedModel[aKey];

    setProperty(model, aKey, updatedModel[aKey]);
    const eventKey = eventKeyPrefix + '.' + aKey;
    if (changed || store.options.greedy) {
      document.dispatchEvent(
        new CustomEvent<{ value: T[keyof T] }>(eventKey, {
          detail: { value: (model as any)[aKey] },
        }),
      );
    }
  }

  // final update trigger for whole object
  document.dispatchEvent(
    new CustomEvent<{ value: T }>(eventKeyPrefix, {
      detail: { value: model },
    }),
  );
};

// Update store keepList array
export const updateWatchStoreKeepList = <T>(model: T | T[], keepItem: T | T[]) => {
  const storeKey = getKeyFromModel(model);
  const store = privateStoreData[storeKey];
  if (store === undefined) {
    console.error('store does not exists for this model. Use createWatchStore()');
    return;
  }
  if (Array.isArray(keepItem)) {
    store.keepList = keepItem;
  } else {
    store.keepList = [keepItem];
  }
};

/*
Troubleshooting:

Possible error:
Type 'number | boolean' is not assignable to type 'never'.
Type 'number' is not assignable to type 'never'.  TS2322

Solution: use setProperty<T, K> above

*/
