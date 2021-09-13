# Project Completion System Javascript
Frontend javascript application for Project Completion System (ProCoSys)

## Software
### Required Software
- NodeJS - https://nodejs.org/en/
- Yarn Pkg - https://yarnpkg.com/lang/en/

### Optional Software
- Docker - https://www.docker.com/ (Only if you want to test production environment)


# How to run

Duplicate the `settings.template.json` file and rename to `settings.json`.
Fill in the blanks from you Azure AD or any other provider supported by MSAL.js
```
$ yarn install
$ yarn start
```

# Development
`yarn start` - Starts the dev environment with hot reloading

`yarn test` - runs the test suite

`yarn test-watch` - continual re-testing when files change

# Docker & Docker Compose

```
docker-compose up
```
This starts the application in a production like environment. 

## Manual

```
$ docker build --force-rm -t pcs:latest -f .docker/Dockerfile .
$ docker run -it -p 80:80 pcs:latest
```

# Libraries

### Microsoft Authentication Library (MSAL)

https://github.com/AzureAD/microsoft-authentication-library-for-js

### React
https://reactjs.org/

# Testing

### JEST
https://jestjs.io/

Testing Framework


### TS-JEST
https://github.com/kulshekhar/ts-jest

For running tests with Typescript and Typechecking


### React Testing Library
https://testing-library.com/docs/react-testing-library/api

For abstraction of boilerplate code when testing and test helper functions


# (Build) Tools for the job

### SASS (SCSS)
https://sass-lang.com/

### Styled Components
General component styling

https://www.styled-components.com

### TypeScript
Better code quality and easier transition for developers coming from a typed language

https://Typescriptlang.org

### Webpack
Building / bundling the application

https://webpack.js.org/

### Browserslist
Used to define which browsers we support, as well as integrate with polyfill loading in CSS and Babel. 

https://www.npmjs.com/package/browserslist


