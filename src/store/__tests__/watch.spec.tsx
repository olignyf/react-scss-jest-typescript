/**
 * @jest-environment jsdom
 */
/* eslint-disable no-console */
import { createWatchStore, updateWatchStore, useWatch, useWatchObject } from '../watch';
import React, { useState } from 'react';
import renderer, { act } from 'react-test-renderer';

interface SampleObject {
  id: number;
  bitrate: number;
  resolution?: string;
  stats?: {
    state: number;
  };
}

const globalObject: SampleObject = {
  id: 1,
  bitrate: 5000,
  resolution: '3840x2160p',
  stats: {
    state: 1,
  },
};

const globalArray: SampleObject[] = [
  {
    id: 1,
    bitrate: 5000,
    resolution: '3840x2160p',
    stats: {
      state: 1,
    },
  },
  {
    id: 2,
    bitrate: 2000,
    resolution: '3840x2160p',
    stats: {
      state: 2,
    },
  },
  {
    id: 3,
    bitrate: 3000,
    resolution: '3840x2160p',
    stats: {
      state: 3,
    },
  },
];

interface RowProps extends SampleObject {}
const Row = (props: RowProps) => {
  const { bitrate } = props;
  return <div>bitrate: {bitrate}</div>;
};

interface MyComponentProps {
  model: SampleObject;
  callback?: any;
}
const MyComponent = (props: MyComponentProps) => {
  const { model } = props;
  const [bitrate, setBitrate] = useState(model.bitrate);
  useWatch(model, 'bitrate', (args: any) => {
    setBitrate(args);
    props.callback?.(args);
  });
  const { bitrate: garbage, ...rest } = props.model;
  return <Row key={model.id} bitrate={bitrate} {...rest} />;
};

interface MyListComponentProps {
  model: SampleObject[];
  callback?: any;
}
const MyListComponent = (props: MyListComponentProps) => {
  const { model } = props;
  const [list, setList] = useState(model);
  useWatchObject(model, (args: SampleObject[]) => {
    setList(args);
    props.callback?.(args);
  });
  // list.map((i) => console.log('i', i));
  return (
    <div>
      {list.map((i) => (
        <Row key={i.id} {...i} />
      ))}
    </div>
  );
};

describe('watch store', () => {
  test('create watch store', () => {
    const myObject: SampleObject = {
      id: 1,
      bitrate: 5000,
      resolution: '3840x2160p',
      stats: {
        state: 1,
      },
    };

    const model = createWatchStore(myObject);

    expect(model).toBeDefined(); // on failure it returns undefined
  });

  test('should fail to create an already existing watch store on the same object', () => {
    const myObject: SampleObject = {
      id: 1,
      bitrate: 5000,
      resolution: '3840x2160p',
      stats: {
        state: 1,
      },
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

  test('useWatch single property', () => {
    const dispatch = jest.fn();

    const newObject = { ...globalObject };

    createWatchStore(newObject);

    let component: renderer.ReactTestRenderer;
    act(() => {
      component = renderer.create(<MyComponent model={newObject} callback={dispatch} />);
    });

    if (!component) {
      expect(component).toBeDefined();
      return;
    }

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    const updatedBitrate = 6000;
    act(() => {
      updateWatchStore(newObject, { ...newObject, bitrate: updatedBitrate });
    });

    // after snapshot
    tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    expect(dispatch).toHaveBeenCalledWith(updatedBitrate);
  });

  test('useWatchObject on an array, delete item', () => {
    const dispatch = jest.fn();

    const theArray = [...globalArray];
    createWatchStore(theArray);

    let component: renderer.ReactTestRenderer;
    act(() => {
      component = renderer.create(<MyListComponent model={theArray} callback={dispatch} />);
    });

    if (!component) {
      expect(component).toBeDefined();
      return;
    }

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    const updatedArray = [...theArray];
    updatedArray.splice(0, 1); // remove first item

    act(() => {
      updateWatchStore(theArray, updatedArray);
    });

    // after snapshot
    tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    expect(dispatch).toHaveBeenCalledWith(updatedArray);
  });

  test('useWatchObject on an array, swap item', () => {
    const dispatch = jest.fn();

    const theArray = [...globalArray];
    createWatchStore(theArray);

    let component: renderer.ReactTestRenderer;
    act(() => {
      component = renderer.create(<MyListComponent model={theArray} callback={dispatch} />);
    });

    if (!component) {
      expect(component).toBeDefined();
      return;
    }

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    const updatedArray = [...theArray];
    [updatedArray[0], updatedArray[1]] = [theArray[1], theArray[0]];

    act(() => {
      updateWatchStore(theArray, updatedArray);
    });

    // after snapshot
    tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    expect(dispatch).toHaveBeenCalledWith(updatedArray);
  });

  test('useWatchObject on an array, add item at the end', () => {
    const dispatch = jest.fn();

    const theArray = [...globalArray];
    createWatchStore(theArray);

    let component: renderer.ReactTestRenderer;
    act(() => {
      component = renderer.create(<MyListComponent model={theArray} callback={dispatch} />);
    });

    if (!component) {
      expect(component).toBeDefined();
      return;
    }

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    const updatedArray = [...theArray];
    updatedArray.push({ id: -1, bitrate: 1001 });

    act(() => {
      updateWatchStore(theArray, updatedArray);
    });

    expect(theArray[theArray.length - 1]).toStrictEqual({ id: -1, bitrate: 1001 });

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    expect(dispatch).toHaveBeenCalledWith(updatedArray);
  });

  test('useWatchObject on an array, add item at the beginning', () => {
    const dispatch = jest.fn();

    const theArray = [...globalArray];
    createWatchStore(theArray);

    let component: renderer.ReactTestRenderer;
    act(() => {
      component = renderer.create(<MyListComponent model={theArray} callback={dispatch} />);
    });

    if (!component) {
      expect(component).toBeDefined();
      return;
    }

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    const updatedArray = [{ id: -1, bitrate: 2002 }, ...theArray];

    act(() => {
      updateWatchStore(theArray, updatedArray);
    });

    expect(theArray[0]).toStrictEqual({ id: -1, bitrate: 2002 });

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    expect(dispatch).toHaveBeenCalledWith(updatedArray);
  });
});
