/**
 * @jest-environment jsdom
 */

// https://jestjs.io/docs/en/configuration

import React from 'react';

//import renderer from 'react-test-renderer';
import { render, unmountComponentAtNode } from 'react-dom';
import { HomePageJig } from './home-page-jig';
import 'regenerator-runtime/runtime';
import { generateImage } from 'jsdom-screenshot';

// add some helpful assertions
import '@testing-library/jest-dom/extend-expect';

import { initializeI18n } from 'src/i18n';
initializeI18n();

import { toMatchImageSnapshot } from 'jest-image-snapshot';
expect.extend({ toMatchImageSnapshot });

import { act } from 'react-dom/test-utils';

jest.useFakeTimers();

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

describe('ConfirmPrompts', () => {
  it('should render', async () => {
    // 1. react-test-renderer
    act(() => {
      render(<HomePageJig />, container);
    });

    // move ahead in time
    act(() => {
      jest.advanceTimersByTime(100);
    });

    // Take screenshot with generateImage()
    const screenshot = await generateImage();
    // and compare it to the previous sceenshot with toMatchImageSnapshot()
    expect(screenshot).toMatchImageSnapshot();
  });
});
