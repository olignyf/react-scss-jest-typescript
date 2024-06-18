import { clone } from 'lodash';
import { createWatchStore, updateWatchStore } from '../store/watch';
import { GenericObject } from 'src/models/generics';

/*eslint no-console: 0*/
/*eslint curly: 0*/

const DEBUG = false;

export interface StoreState {
  changedInRestApi: boolean;
  changedInViewModels: boolean;
}

type uuidType = string | number;

export const compareModels = <T>(actual: T, initialCleanedUp: T, ignoredProperties: Array<keyof T>): boolean => {
  if (actual == null) {
    console.warn('actual is empty');
    return false;
  }
  if (initialCleanedUp == null) {
    console.warn('initial is empty');
    return false;
  }

  // cloning because we will overwrite ignored properties to it from initial and dont want to affect other modules using those objects
  actual = clone(actual);
  initialCleanedUp = clone(initialCleanedUp);

  // copy the ignored parts so they dont trigger changes
  ignoredProperties?.forEach((p) => {
    (initialCleanedUp as any)[p] = (actual as any)[p]; // copy the actual value so it doesn't appear changed, thus ignored
  });

  // compare all props of a single item
  // recursive
  const compareFunc = (oldObj: any, newObj: any) => {
    let hasChanged = false;
    if (Array.isArray(oldObj)) {
      // console.warn('checking array', oldObj, newObj);
      if (newObj == null || oldObj.length !== newObj.length) {
        if (DEBUG) console.warn('Changed array', oldObj, newObj);
        hasChanged = true;
        if (newObj == null) {
          return hasChanged;
        }
      }
      for (let i = 0; i < oldObj.length; i++) {
        if (compareFunc(oldObj[i], newObj[i])) {
          hasChanged = true;
          if (DEBUG) console.warn('Changed array', oldObj, newObj);
          break;
        }
      }
    } else if (oldObj != null && typeof oldObj === 'object') {
      // FIXME unit test usefulness of oldObj != null
      Object.keys(oldObj).map((key: any) => {
        if (Object.prototype.hasOwnProperty.call(oldObj, key)) {
          const original = oldObj[key as keyof T];
          const newVal = newObj[key as keyof T];
          if (/*key === 'outputs' ||*/ key === 'streamId') {
            if (DEBUG) console.info('Going to compare key', key, original, newVal);
          }
          if (compareFunc(original, newVal)) {
            hasChanged = true;
            if (DEBUG) console.warn('Changed object', oldObj, newObj);
          }
        }
      });
    } else {
      if (oldObj != newObj) {
        // soft compare
        hasChanged = true;
        if (DEBUG) console.warn('Changed prop', oldObj, newObj);
      }
    }
    return hasChanged;
  };

  let hasChanged = compareFunc(initialCleanedUp, actual);
  if (!hasChanged) {
    hasChanged = compareFunc(actual, initialCleanedUp);
  }
  if (DEBUG) console.error('hasItemChanged?', hasChanged);
  return hasChanged;
};

/**
 *
 * Manage one collection/array of objects, usually your viewModel objects.
 * It tracks active unsubmitted user form change through onChangeItem()
 * It tracks changes from the rest api (after mapping to view model) untouched by user form changes through updateInitials()
 * The object returned from `new GenericStore(...)` can be watched with useWatchObject()
 * initial object is the one that is reflecting current status of the model untouched by user form changes
 *
 *
 */
export class GenericStore<T extends GenericObject, K extends keyof T> {
  protected identifier: K = 'id' as K;
  protected ignoredProperties: Array<K> = [];
  protected models: T[];
  protected initialModels: T[];
  //  protected pendings: T[]; // pending models updates from REST API

  private state: StoreState;

  constructor(models: T[], ignoredProperties: Array<K> = [], identifier: K = 'id' as K) {
    this.models = clone(models);
    this.ignoredProperties = ignoredProperties;
    this.initialModels = clone(models);
    this.identifier = identifier;
    this.state = {
      changedInRestApi: false,
      changedInViewModels: false,
    };
    createWatchStore(this, { customValues: this.state });
    return this;
  }

  public get = (id: uuidType) => {
    return this.models.find((o: any) => o[this.identifier] === id);
  };

  public getAll = () => {
    return this.models;
  };

  public getInitial = (id: uuidType) => {
    return this.initialModels.find((o: any) => o[this.identifier] === id);
  };

  public update = (models: T[]) => {
    this.models = clone(models);
  };

  public updateFromRestApi = (updates: T[]) => {
    // only for models who dont have forms opened
    let anyChanges = false;
    const keyDone = [];
    // update existings
    for (const existingItem of this.models) {
      let hasUserChange = false;
      let hasRestApiChange = false;
      if (this.hasItemChanged(existingItem[this.identifier] as unknown as uuidType)) {
        // dont updated items with unapplied changes
        // FIXME put in pending
        if (DEBUG) console.info('NOT UPDATING UNAPPLIED ITEM WITH USER CHANGES', existingItem);
        hasUserChange = true;
      } else {
        if (DEBUG) console.info('UPDATING ITEM FROM REST API', existingItem);
        // allow to update this one, check if we have an update
        const myUpdate = updates.find((m) => m[this.identifier] === existingItem[this.identifier]);
        if (myUpdate) {
          // item found
          const hasChanges = compareModels(existingItem, myUpdate, this.ignoredProperties);
          if (hasChanges) {
            hasRestApiChange = true;
            let curIndex = this.models.indexOf(existingItem);
            if (curIndex >= 0) {
              this.models.splice(curIndex, 1, myUpdate);
              anyChanges = true;
            } else {
              // is this possible? unit test needed
            }
            // update initials
            // note only update initials when there is not user changes (that is the form is openened)
            const modelInInitial = this.initialModels.find((m) => m[this.identifier] === existingItem[this.identifier]);
            curIndex = this.initialModels.indexOf(modelInInitial as T);
            if (curIndex >= 0) {
              this.initialModels.splice(curIndex, 1, clone(myUpdate));
            } else {
              // is this possible? unit test needed
            }
          }
        }
      }
      keyDone.push({
        id: existingItem[this.identifier],
        model: existingItem,
        hasUserChange: hasUserChange,
        hasRestApiChange: hasRestApiChange,
      });
    }

    // add items if any
    for (const newItem of updates) {
      const existingItem = this.get(newItem[this.identifier] as unknown as uuidType);
      if (existingItem === undefined) {
        // item was added to the list
        const index = updates.indexOf(newItem);
        this.models.splice(index, 0, newItem); // FIXME add at correct index instead of 0
        anyChanges = true;
        //   changed = true;
      }
    }

    if (anyChanges) {
      // dont update all initials because we can have opened forms.
      if (this.initialModels.length === 0 && this.models && this.models.length > 0) {
        // initialize initials
        this.initialModels = clone(this.models);
      }
      updateWatchStore(this, this);
    }
  };

  public onChangeItem = (model: T) => {
    if (DEBUG) console.log('onChangeItem: user form change');
    for (let i = 0; i < this.models.length; i++) {
      if (this.models[i][this.identifier] === model[this.identifier]) {
        this.models[i] = clone(model);
        if (DEBUG) console.log('onChangeItem: going to updateWatchStore', this.models[i]);
        updateWatchStore(this, this);
        return;
      }
    }
  };

  public updateInitials = (models: T[]) => {
    if (DEBUG) console.error('updateInitials', models);
    this.initialModels = [...models];
    updateWatchStore(this, this);
  };

  public updateInitial = (model: T) => {
    if (DEBUG) console.log('updateInitial', model);
    for (let i = 0; i < this.initialModels.length; i++) {
      if (this.initialModels[i][this.identifier] === model[this.identifier]) {
        this.initialModels[i] = clone(model);
        // clone needed ?
        updateWatchStore(this, this);
        return;
      }
    }
  };

  /** reset current models with initial values if nothing was passed, or with passed models */
  public reset = (models?: T[]) => {
    if (DEBUG) console.log('RESET', this.initialModels);
    if (models) {
      this.models = clone(models);
      this.initialModels = clone(models);
    } else {
      this.models = clone(this.initialModels);
      for (let i = 0; i < this.models.length; i++) {
        this.models[i] = clone(this.models[i]);
      }
    }
    updateWatchStore(this, this);
  };

  public hasItemChanged = (id: uuidType): boolean => {
    const actual = this.get(id);
    const initialCleanedUp = this.getInitial(id);
    return compareModels(actual as T, initialCleanedUp as T, this.ignoredProperties);
  };

  // compares info but not stats, so that if stats change, the apply button doesnt become enabled.
  public hasItemsChanged = (): boolean => {
    let hasAnyItemChanged = false;
    this.models.forEach((value, _index) => {
      const key = value[this.identifier] as unknown as uuidType;
      if (this.hasItemChanged(key)) {
        hasAnyItemChanged = true;
        return;
      }
    });
    return hasAnyItemChanged;
  };
  
  public saveResponse = (response: T[]) => {
    updateWatchStore(this, clone(response));
  };
}

