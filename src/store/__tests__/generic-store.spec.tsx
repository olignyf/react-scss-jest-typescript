import { clone } from 'ramda';
import React, { useEffect, useState } from 'react';
import renderer, { act } from 'react-test-renderer';
import { GenericStore } from 'src/js/util/generic-store';
import { createWatchStore, useWatchObject } from '../watch';
import { GenericObject } from 'src/models/generics';

/**
 * @jest-environment jsdom
 */
/* eslint-disable no-console */

interface SampleObject extends GenericObject {
  id: number;
  bitrate: number;
  outputs: boolean[];
  resolution?: string;
  stats?: {
    state: number;
    bitrate?: number;
    load?: number;
  };
}

// const globalObject: SampleObject = {
//   id: 1,
//   bitrate: 5000,
//   outputs: [true, true, false, true],
//   resolution: '3840x2160p',
//   stats: {
//     state: 1,
//   },
//   updated: new Date().toISOString(),
//   selected: false,
//   hidden: false,
// };

// const globalArray: SampleObject[] = [
//   {
//     id: 1,
//     bitrate: 5000,
//     outputs: [true, false, false, true],
//     resolution: '3840x2160p',
//     stats: {
//       state: 1,
//     },
//     updated: new Date().toISOString(),
//     selected: false,
//     hidden: false,
//   },
//   {
//     id: 2,
//     bitrate: 2000,
//     outputs: [true, false, false, true],
//     resolution: '3840x2160p',
//     stats: {
//       state: 2,
//     },
//     updated: new Date().toISOString(),
//     selected: false,
//     hidden: false,
//   },
//   {
//     id: 3,
//     bitrate: 3000,
//     outputs: [true, false, false, true],
//     resolution: '3840x2160p',
//     stats: {
//       state: 3,
//     },
//     updated: new Date().toISOString(),
//     selected: false,
//     hidden: false,
//   },
// ];

interface RowProps {
  model: SampleObject;
}

const Row = (props: RowProps) => {
  const { bitrate, outputs } = props.model;
  //if (outputs === undefined) {
  //  console.log('here');
  //}
  return (
    <div>
      <div>bitrate: {bitrate}</div>
      <div>
        <label>
          Output 1<input name="outputs[0]" type="checkbox" checked={outputs[0]} />
        </label>
      </div>
      <div>
        <label>
          Output 2<input name="outputs[1]" type="checkbox" checked={outputs[1]} />
        </label>
      </div>
      <div>
        <label>
          Output 3<input name="outputs[2]" type="checkbox" checked={outputs[2]} />
        </label>
      </div>
      <div>
        <label>
          Output 4<input name="outputs[3]" type="checkbox" checked={outputs[3]} />
        </label>
      </div>
    </div>
  );
};

interface MyComponentProps {
  store: GenericStore<SampleObject, keyof SampleObject>;
  callback?: any;
  cbHasItemsChanged?: any;
}
const MyComponent = (props: MyComponentProps) => {
  const { store, ...rest } = props;
  const [renderCount, setRenderCount] = useState(0);

  useWatchObject(store, (args: any) => {
    const hasAnyChanges = store.hasItemsChanged();
    props.cbHasItemsChanged?.(hasAnyChanges);

    store.getAll().forEach((model) => {
      const hasAnyChanges = store.hasItemChanged(model.id);
      if (hasAnyChanges) {
        setRenderCount(renderCount + 1);
      }
    });

    // send back output of first object
    props.callback?.(args.get(1).outputs);
  });

  const models = props.store.getAll();
  return (
    <>
      {models.map((model) => (
        <Row key={model.id} model={model} {...rest} />
      ))}
    </>
  );
};

const gModelIssue1: SampleObject = {
  id: 1,
  bitrate: 5000,
  outputs: [true, true, true, true],
  resolution: '3840x2160p',
  updated: new Date().toISOString(),
  selected: false,
  hidden: false,
};

const MyComponentIssue1 = (props: MyComponentProps) => {
  const { store, ...rest } = props;

  const [state, setState] = useState(gModelIssue1);
  state.bitrate = 1111;
  state.outputs[0] = false;
  props.callback(gModelIssue1.outputs);

  useEffect(() => {
    setState((prev) => {
      prev.resolution = '480p';
      return { ...prev, resolution: '720p' };
    });
  }, []);

  useWatchObject(store, (args: any) => {
    store.getAll().forEach((model) => {
      const hasAnyChanges = store.hasItemChanged(model.id);
      if (hasAnyChanges) {
        //
      }
    });
    props.callback?.(args.get(1).outputs);
  });

  const models = props.store.getAll();
  return (
    <>
      {models.map((model) => (
        <Row key={model.id} model={model} {...rest} />
      ))}
    </>
  );
};

describe('generic store', () => {
  test('should fail to create an already existing watch store on the same object', () => {
    const myObject: SampleObject = {
      id: 1,
      bitrate: 5000,
      outputs: [true, false, false, true],
      resolution: '3840x2160p',
      stats: {
        state: 1,
      },
      updated: new Date().toISOString(),
      selected: false,
      hidden: false,
    };

    const model = createWatchStore(myObject);

    jest.spyOn(console, 'error');

    // @ts-ignore
    console.error.mockImplementation(() => null);
    const model2 = createWatchStore(myObject); // should fail, print console.error and return undefined

    // @ts-ignore
    console.error.mockRestore();

    expect(model).toBeDefined();
    expect(model2).toBeUndefined(); // on failure it returns undefined
  });

  test('create watch store and get notification of a simple change', async () => {
    const myObject: SampleObject[] = [
      {
        id: 1,
        bitrate: 5000,
        resolution: '3840x2160p',
        outputs: [true, false, false, true],
        stats: {
          state: 1,
        },
        updated: new Date().toISOString(),
        selected: false,
        hidden: false,
      },
      {
        id: 2,
        bitrate: 5000,
        resolution: '3840x2160p',
        outputs: [false, false, false, false],
        stats: {
          state: 1,
        },
        updated: new Date().toISOString(),
        selected: false,
        hidden: false,
      },
    ];

    const store = new GenericStore(myObject);

    const dispatch = jest.fn();

    const expectedOutputs = [true, true, true, true];

    let component: renderer.ReactTestRenderer;
    act(() => {
      component = renderer.create(<MyComponent store={store} callback={dispatch} />);
    });

    if (!component) {
      expect(component).toBeDefined();
      return;
    }

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    act(() => {
      // updateWatchStore(newObject, { ...newObject, bitrate: updatedBitrate });
      const cloned = clone(store.get(1));
      cloned.outputs = clone(expectedOutputs);
      store.onChangeItem(cloned);
    });

    // after snapshot
    tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    // const hasChanged = true;
    expect(dispatch).toHaveBeenCalledWith(expectedOutputs);
  });

  test('setState issue 1', async () => {
    const myObject: SampleObject[] = [
      {
        id: 1,
        bitrate: 5000,
        resolution: '3840x2160p',
        outputs: [true, false, false, true],
        stats: {
          state: 1,
        },
        updated: new Date().toISOString(),
        selected: false,
        hidden: false,
      },
      {
        id: 2,
        bitrate: 5000,
        resolution: '3840x2160p',
        outputs: [false, false, false, false],
        stats: {
          state: 1,
        },
        updated: new Date().toISOString(),
        selected: false,
        hidden: false,
      },
    ];

    const store = new GenericStore(myObject);

    const dispatch = jest.fn();

    let component: renderer.ReactTestRenderer;
    act(() => {
      component = renderer.create(<MyComponentIssue1 store={store} callback={dispatch} />);
    });

    if (!component) {
      expect(component).toBeDefined();
      return;
    }

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    const expectedOutputs = [false, true, true, true];
    expect(dispatch).toHaveBeenCalledWith(expectedOutputs);
  });

  test('hasItemsChanged', async () => {
    const myObject: SampleObject[] = [
      {
        id: 1,
        bitrate: 5000,
        resolution: '3840x2160p',
        outputs: [true, false, false, true],
        stats: {
          state: 1,
        },
        updated: new Date().toISOString(),
        selected: false,
        hidden: false,
      },
      {
        id: 2,
        bitrate: 5000,
        resolution: '3840x2160p',
        outputs: [false, false, false, false],
        stats: {
          state: 1,
        },
        updated: new Date().toISOString(),
        selected: false,
        hidden: false,
      },
    ];

    const store = new GenericStore(myObject);

    const dispatch = jest.fn();
    const cbHasItemsChanged = jest.fn();

    let component: renderer.ReactTestRenderer;
    act(() => {
      component = renderer.create(
        <MyComponent store={store} callback={dispatch} cbHasItemsChanged={cbHasItemsChanged} />,
      );
    });

    if (!component) {
      expect(component).toBeDefined();
      return;
    }

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    act(() => {
      const cloned = clone(store.get(1));
      cloned.bitrate = 1234;
      store.onChangeItem(cloned);
    });

    expect(cbHasItemsChanged).toHaveBeenCalledWith(true);

    act(() => {
      const cloned = clone(store.get(1));
      cloned.bitrate = myObject[0].bitrate; // put back original
      store.onChangeItem(cloned);
    });

    expect(cbHasItemsChanged).toHaveBeenCalledWith(false); // hasItemsChanged() should have gone back false
  });

  test('reset', async () => {
    const myObject: SampleObject[] = [
      {
        id: 1,
        bitrate: 5000,
        resolution: '3840x2160p',
        outputs: [true, false, false, true],
        stats: {
          state: 1,
        },
        updated: new Date().toISOString(),
        selected: false,
        hidden: false,
      },
      {
        id: 2,
        bitrate: 5000,
        resolution: '3840x2160p',
        outputs: [false, false, false, false],
        stats: {
          state: 1,
        },
        updated: new Date().toISOString(),
        selected: false,
        hidden: false,
      },
    ];

    const store = new GenericStore(myObject);

    const dispatch = jest.fn();
    const cbHasItemsChanged = jest.fn();

    let component: renderer.ReactTestRenderer;
    act(() => {
      component = renderer.create(
        <MyComponent store={store} callback={dispatch} cbHasItemsChanged={cbHasItemsChanged} />,
      );
    });

    if (!component) {
      expect(component).toBeDefined();
      return;
    }

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    act(() => {
      const cloned = clone(store.get(1));
      cloned.bitrate = 1234;
      store.onChangeItem(cloned);
    });

    expect(cbHasItemsChanged).toHaveBeenCalledWith(true);
    let hasItemsChanged = store.hasItemsChanged();
    expect(hasItemsChanged).toBe(true);

    act(() => {
      store.reset();
    });

    hasItemsChanged = store.hasItemsChanged();
    expect(hasItemsChanged).toBe(false); // hasItemsChanged() should have gone back false after reset

    act(() => {
      const cloned = clone(store.get(1));
      cloned.bitrate = 7890; // diff
      store.onChangeItem(cloned);
    });

    hasItemsChanged = store.hasItemsChanged();
    expect(hasItemsChanged).toBe(true);

    act(() => {
      store.reset();
    });

    hasItemsChanged = store.hasItemsChanged();
    expect(hasItemsChanged).toBe(false); // hasItemsChanged() should have gone back false after reset
  });

  test('ignoring stats', async () => {
    const myObject: SampleObject[] = [
      {
        id: 1,
        bitrate: 5000,
        resolution: '3840x2160p',
        outputs: [true, false, false, true],
        stats: {
          state: 1,
        },
        updated: new Date().toISOString(),
        selected: false,
        hidden: false,
      },
      {
        id: 2,
        bitrate: 5000,
        resolution: '3840x2160p',
        outputs: [false, false, false, false],
        stats: {
          state: 1,
        },
        updated: new Date().toISOString(),
        selected: false,
        hidden: false,
      },
    ];

    const ignoreList = ['stats'];
    //const ignoreList = [];
    const store = new GenericStore(myObject, ignoreList);

    const dispatch = jest.fn();
    const cbHasItemsChanged = jest.fn();

    let component: renderer.ReactTestRenderer;
    act(() => {
      component = renderer.create(
        <MyComponent store={store} callback={dispatch} cbHasItemsChanged={cbHasItemsChanged} />,
      );
    });

    if (!component) {
      expect(component).toBeDefined();
      return;
    }

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    const NEW_STATE = 3;
    act(() => {
      const cloned = clone(store.get(1));
      cloned.bitrate = 1234;
      cloned.stats.state = NEW_STATE;
      store.onChangeItem(cloned);
    });

    expect(cbHasItemsChanged).toHaveBeenCalledWith(true);

    act(() => {
      const cloned = clone(store.get(1));
      cloned.bitrate = myObject[0].bitrate; // put back original
      // keep stats changed
      store.onChangeItem(cloned);
    });

    expect(store.models[0].stats.state).toBe(NEW_STATE);
    expect(cbHasItemsChanged).toHaveBeenCalledWith(false); // hasItemsChanged() should have gone back false
  });

  test('bug check to not modify original object when having ignore list', async () => {
    const myList: SampleObject[] = [
      {
        id: 1,
        bitrate: 5000,
        resolution: '3840x2160p',
        outputs: [true, false, false, true],
        stats: {
          state: 1,
          load: 0.0,
        },
        updated: new Date().toISOString(),
        selected: false,
        hidden: false,
      },
      {
        id: 2,
        bitrate: 5000,
        resolution: '3840x2160p',
        outputs: [false, false, false, false],
        stats: {
          state: 1,
          load: 0.0,
        },
        updated: new Date().toISOString(),
        selected: false,
        hidden: false,
      },
    ];

    const ignoreList = ['stats']; // ignoring stats will cause initial stats to be copied over updated stats and thus load % will not update
    const store = new GenericStore(myList, ignoreList);

    const dispatch = jest.fn();
    const cbHasItemsChanged = jest.fn();

    let component: renderer.ReactTestRenderer;
    act(() => {
      component = renderer.create(
        <MyComponent store={store} callback={dispatch} cbHasItemsChanged={cbHasItemsChanged} />,
      );
    });

    if (!component) {
      expect(component).toBeDefined();
      return;
    }

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    act(() => {
      // simulates updates from REST API

      myList[0].stats.load = 12.1;
      myList[1].stats.load = 25.0;
      store.updateFromRestApi(myList); // this should not modify `myList` while performing comparison R4KD-1676
    });

    // at this point the initials should show total of 37.1% load
    expect(myList[0].stats.load).toBe(12.1);
    expect(myList[1].stats.load).toBe(25.0);
    /*
    // at this point the initials should show total of 37.1% load
    expect(store.initialModels[0].stats.load).toBe(12.1);
    expect(store.initialModels[1].stats.load).toBe(25.0); */
  });

  // This one got fixed in 59ede3556e02193faabc24d86aa5f60a9d404edd
  // Before that all object initial states were updated to latest update if any one had a change
  test('bug check a object with modification initial state shouldnt be modified by second object updates', async () => {
    const myList: SampleObject[] = [
      {
        id: 1,
        bitrate: 5000,
        resolution: '3840x2160p',
        outputs: [true, false, false, true],
        stats: {
          state: 1,
          load: 0.0,
        },
        updated: new Date().toISOString(),
        selected: false,
        hidden: false,
      },
      {
        id: 2,
        bitrate: 5000,
        resolution: '3840x2160p',
        outputs: [false, false, false, false],
        stats: {
          state: 1,
          load: 0.0,
        },
        updated: new Date().toISOString(),
        selected: false,
        hidden: false,
      },
    ];

    const ignoreList = []; // for this test we need to not ignore stats so that updates on second item register as a change
    const store = new GenericStore(myList, ignoreList);

    const dispatch = jest.fn();
    const cbHasItemsChanged = jest.fn();

    let component: renderer.ReactTestRenderer;
    act(() => {
      component = renderer.create(
        <MyComponent store={store} callback={dispatch} cbHasItemsChanged={cbHasItemsChanged} />,
      );
    });

    if (!component) {
      expect(component).toBeDefined();
      return;
    }

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    const NEW_BITRATE = 3000;
    act(() => {
      const cloned = clone(store.get(1));
      cloned.bitrate = NEW_BITRATE;
      store.onChangeItem(cloned);
    });

    let hasChanged = store.hasItemsChanged();
    expect(hasChanged).toBe(true);

    act(() => {
      // simulates updates from REST API
      myList[0].stats.load = 12.1;
      myList[1].stats.load = 25.0;
      store.updateFromRestApi(myList); // this should not modify `myList` while performing comparison R4KD-1676
    });

    expect(store.models[0].bitrate).toBe(NEW_BITRATE);
    expect(store.initialModels[0].bitrate).toBe(5000);
    expect(store.initialModels[0].stats.load).toBe(0);
    expect(store.initialModels[1].stats.load).toBe(25.0);

    hasChanged = store.hasItemsChanged();
    expect(hasChanged).toBe(true);

    expect(store.models[0].bitrate).toBe(NEW_BITRATE);
    expect(store.initialModels[0].bitrate).toBe(5000);
    expect(store.initialModels[0].stats.load).toBe(0);
    expect(store.initialModels[1].stats.load).toBe(25.0);
  });
});
