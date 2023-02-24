/**
 * @jest-environment jsdom
 */

// https://jestjs.io/docs/en/configuration

import React from 'react';

//import renderer from 'react-test-renderer';
import { render, unmountComponentAtNode } from 'react-dom';
import { HomePageJig } from './home-page-jig';
import 'regenerator-runtime/runtime';
import { generateImage } from 'visual-screenshot';

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
  container = document.createElement('html');
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

describe('Home Page', () => {
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
    console.log('here going to gen screenshot');
    const screenshot = await generateImage();
    console.log('after gen screenshot');
    // and compare it to the previous sceenshot with toMatchImageSnapshot()
    expect(screenshot).toMatchImageSnapshot(); // png image
    
    expect(container).toMatchSnapshot(); // html text
  });
});
