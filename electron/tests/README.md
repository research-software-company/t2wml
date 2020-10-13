# Electron Tests

This directory contains the frontend tests. Some of these tests are simple frontend-only tests, and some of them are end-to-end tests that involve the backend as well. 

## Running the tests
To run the tests, just use `yarn test`. This will run the tests against the GUI code in the `dist` directory. If you compiled the code in development mode, you will need to start the backend on port 13000 as you usually do in development code. If the code was compiled in production mode, you will need to have a backend executable (created with pyinstaller) in the proper backend directory (use the `backend/packaging/prepare_installation.py` script with the `--skip-electron` flag to create a backend executable in the right place).

## Writing tests
`yarn test` runs all the `*.test.ts` files in the `tests` directory (or any of its subdirectories). You can add additional test files quite easily.