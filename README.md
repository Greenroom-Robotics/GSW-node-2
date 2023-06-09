# Gsw Node 2

Nodejs interface to Gibbs-SeaWater (GSW) Oceanographic Toolbox in C++.

Link to the homepage: [Teos-10.org](https://www.teos-10.org/)

This library includes all modules: 
- TeosBase
- TeosIce
- TeosSea

## Features

- Integrated node.js packaging and dependency management through [npm](https://www.npmjs.com)
- Type safety through [TypeScript](https://www.typescriptlang.org)
- [CMake](https://cmake.org) build system
- Integrated C++ dependency management using [CPM.cmake](https://github.com/TheLartians/CPM.cmake) 
- Automatic bindings and typescript declarations using the [Glue](https://github.com/TheLartians/Glue) library
- Integrated test suite using [jest](https://jestjs.io)
- Code formatting enforced through [prettier](https://prettier.io) and [Format.cmake](https://github.com/TheLartians/Format.cmake)
- Semi-automatic memory management using [scopes](#memory-management)
- A [GitHub action](.github/workflows/publish.yml) to automatically [update the npm release](https://github.com/mikeal/merge-release) for each commit to master

## Usage


### Build WebAssembly code

To be able to build WebAssembly code from C++ using Emscripten, you must first [install and activate the emsdk](https://emscripten.org/docs/getting_started/downloads.html).
To compile the C++ code to WebAssembly, run the following command from the project's root directory.

```bash
yarn
```

This will create the files `source/WasmModule.js` and `source/WasmModule.d.ts` from the C++ code in the [wasm](wasm) directory and transpile everything into a JavaScript module in the `dist` directory.
To build your code as wasm, add it as a CPM.cmake dependency in the [CMakeLists.txt](wasm/CMakeLists.txt) file and define the bindings in the [wasmGlue.cpp](wasm/source/wasmGlue.cpp) source file.
To update the wasm and TypeScript declarations, you can run `yearn build:wasm`. 

### Run tests

The following command will build and run the test suite.

```bash
yarn test
```

For rapid developing, tests can also be started in watch mode, which will automatically run on any code change to the TypeScript or JavaScript sources.

```bash
yarn start
```

### Fix code style

The following command will run prettier on the TypeScript and clang-format on the C++ source code.

```
yarn fix:style
```

## Writing bindings

This starter uses the Glue project to create bindings and declarations.
Update the [wasmGlue.cpp](wasm/source/wasmGlue.cpp) source files to expose new classes or functions.
See the [Glue](https://github.com/TheLartians/Glue) or [EmGlue](https://github.com/TheLartians/EmGlue) projects for documentation and examples.

## Memory management

As JavaScript has no destructors, any created C++ objects must be deleted manually, or they will be leaked.
To simplify this, the project introduces memory scopes that semi-automatically take care of memory management.
The usage is illustrated below.

```ts
import { withGsw } from "gsw-node-2";

// `withGsw()` will run the callback asynchronously in a memory scope and return the result in a `Promise`
withGsw(gswModule => {
  // construct a new C++ `TeosBase` instance
  const teosBase = new gswModule.TeosBase("Wasm");

  // call a member function
  console.log(teosBase.greet(greeterModule.LanguageCode.EN));
  
  // any created C++ objects will be destroyed after the function exits, unless they are persisted
});
```

To see additional techniques, such as synchronous scopes or persisting and removing values outside of the scope, check out the [tests](__tests__/wasm.ts) or [API](source/wasmWrapper.ts).
