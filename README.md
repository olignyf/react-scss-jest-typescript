# Requirements:
 nvm version 1.1.7 minimum
 node 10.X minimum, 16.X recommended
 versions tested with:
  => nvm install 14.19.1
  => nvm install 16.14.2
     nvm use 16.14.2
 python2 (for node-sass compiling)
  => $ npm install --global --production windows-build-tools@4.0.0
 Visual Studio 2013 or 2017 (The free Community version is fine, again for compiling node-sass)

# Setup
$ npm install yarn -g


# History

    $ yarn create react-app react-scss-jest-typescript --template typescript
    $ yarn add node-sass
    $ yarn add --dev jest babel-jest jest-transform-file jest-transform-css sass-jest OR sass-jest-transform
    $ yarn add --dev @babel/plugin-proposal-export-default-from @babel/plugin-proposal-decorators 
    $ yarn add --dev jsdom-screenshot jest-image-snapshot
    $ yarn add react-i18next i18next i18next-browser-languagedetector i18next-intervalplural-postprocessor
    $ yarn add --dev @types/lodash
    $ yarn add react-bootstrap bootstrap@4.6.0

## Issues open and/or resolved

https://github.com/dferber90/jest-transform-css/issues/10

# Notes

"sass-jest" npm package is used to render SCSS in jest unit tests. Otherwise the rendering will hang as other parser only support CSS and will error on SCSS.


## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn jest`

Runs the image snapshot tests

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
