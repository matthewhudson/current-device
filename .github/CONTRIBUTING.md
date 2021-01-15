# Contributing to `current-device`

:+1::tada: First off, thanks for taking the time to contribute! :tada::+1:

The following is a set of guidelines for contributing to `current-device`. These
are mostly guidelines, not rules. Use your best judgment, and feel free to
propose changes to this document in a Pull Request.

## Contributing Code

1. Pull the repo
2. Create a branch against `master` (`git checkout -b feature`)
3. Make change(s)
4. Commit your changes (`git commit -am 'Added a feature'`)
5. Push to the branch (`git push origin feature`)
6. Open a Pull Request

## Prerequisites

[Node.js](http://nodejs.org/) >= v4 must be installed.

## Installation

- Running `npm install` in the module's root directory will install everything
  you need for development.

## Running Tests

- `npm test` will run the tests once.

- `npm run test:coverage` will run the tests and produce a coverage report in
  `coverage/`.

- `npm run test:watch` will run the tests on every change.

## Building

- `npm run build` will build the module for publishing to npm.

- `npm run clean` will delete built resources.
