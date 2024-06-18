/*eslint no-console: 0*/

import natsort from 'natsort';
import React, { ReactElement } from 'react';
import { GenericObject } from 'src/models/generics';

export type Comparator<T> = (a: T, b: T) => -1 | 0 | 1;

export enum SortType {
  GENERIC = 1,
  NATURAL_SORT,
  CUSTOM_FUNCTION, // via 'comparator' func
}

export enum SortDirection {
  IDLE = 0,
  DESCENDING = -1,
  ASCENDING = 1,
}

/* extends {id:string|number}*/
interface Props<T extends GenericObject> {
  children: ReactElement[]; // each mapping to a T element with key = T.id
  list: T[];
  sortInfo: {
    [K in keyof Partial<T> | string]: {
      type: SortType;
      /*
       *  Optional
       *  Supply custom comparator function receiving model A and B as input and returning -1 | 0 | 1
       */
      comparator?: Comparator<T>;
      /*
       *  Optional
       *  Value provider for the field. Takes model as input and output value to sort on
       */
      provider?: (arg: T) => any;
    };
  };
  sortKey: keyof T | string;
  direction: SortDirection;
  uuid?: any; 
}

// local helper functions
const natsortFunc = natsort({ insensitive: true });

// No sorting sorts by 'id'
const comparatorNoSorting = (a: any, b: any, dirVal: any): 0 | 1 | -1 => {
  let result = 0;
  if (a.id > b.id) {
    result = 1;
  } else if (a.id < b.id) {
    result = -1;
  }

  if (dirVal < 0) {
    if (result === -1) {
      return 1;
    } else if (result === 1) {
      return -1;
    }
    return 0;
  }

  return result as 0 | 1 | -1;
};

// Comparator for strings (natural sort)
const comparatorNaturalSort = (
  item: string | number | symbol,
  a: any,
  b: any,
  dirVal: any,
  uuid: any,
  provider?: (model: any) => any,
): 0 | 1 | -1 => {
  let valueA = a[item];
  let valueB = b[item];
  if (provider) {
    valueA = provider(a);
    valueB = provider(b);
  }
  const result = natsortFunc(valueA, valueB);

  // keep new stream form on top
  if (a[uuid] === -1) {
    return -1;
  }
  if (b[uuid] === -1) {
    return 1;
  }

  if (dirVal < 0) {
    if (result === -1) {
      return 1;
    } else if (result === 1) {
      return -1;
    }
    return 0;
  }
  return result as 0 | 1 | -1;
};

// Generic comparator (for numbers)
const comparatorGeneric = (
  item: string | number | symbol,
  a: any,
  b: any,
  dirVal: any,
  uuid: any,
  provider?: (model: any) => any,
): 0 | 1 | -1 => {
  let result = 0;

  // keep new stream form on top
  if (a[uuid] === -1) {
    return -1;
  }
  if (b[uuid] === -1) {
    return 1;
  }

  let valueA = a[item];
  let valueB = b[item];
  if (provider) {
    valueA = provider(a) ?? '';
    valueB = provider(b) ?? '';
  }

  if (valueA > valueB) {
    result = 1;
  } else if (valueA < valueB) {
    result = -1;
  }

  if (dirVal < 0) {
    return (-1 * result) as 1 | -1; // descending
  }

  return result as 0 | 1 | -1;
};

/**
 *
 */
export const SortManager: <T extends GenericObject>(
  props: Props<T>,
) => React.ReactElement<Props<T>> = ({ children, list, sortInfo, direction, sortKey, uuid = 'id' }) => {
  let comparator = comparatorNoSorting;
  if (sortInfo[sortKey] !== undefined) {
    if (sortInfo[sortKey].type === SortType.GENERIC) {
      comparator = function (a: any, b: any) {
        return comparatorGeneric(sortKey, a, b, direction, sortInfo[sortKey].provider);
      };
    } else if (sortInfo[sortKey].type === SortType.NATURAL_SORT) {
      comparator = function (a: any, b: any) {
        return comparatorNaturalSort(sortKey, a, b, direction, sortInfo[sortKey].provider);
      };
    } else if (sortInfo[sortKey].type === SortType.CUSTOM_FUNCTION) {
      if (sortInfo[sortKey].comparator == null) {
        console.error('SortType.CUSTOM_FUNCTION requires a comparator function')
      }
      comparator = sortInfo[sortKey].comparator as Comparator<any>;
    }
  } else {
    console.error('Sort key is not supported, verify sortInfo or clear localstorage', sortKey);
  }

  // Actual sort
  if (Array.isArray(children)) {
    children = [...children].sort((a, b) => {
      const item1 = list.find((item) => item[uuid] == a.key);
      const item2 = list.find((item) => item[uuid] == b.key);

      return comparator(item1, item2, direction);
    });
  }

  return <>{children}</>;
};
