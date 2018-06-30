
// Environment setup

function out(x) {
  console.log(x);
}

function err(x) {
  console.warn(x);
}

// Set up memory and table

var memory, table;

function setup(info) {
  memory = new WebAssembly.Memory({ initial: info.memorySize, maximum: info.memorySize });
  table = new WebAssembly.Table({ initial: info.tableSize, maximum: info.tableSize, element: 'anyfunc' });
  var staticEnd = info.staticStart + info.staticSize;
  var stackStart = staticEnd;
  var stackMax = stackStart + info.stackSize;
  var sbrkStart = stackMax;
  var sbrkPtr = 16;
  (new Int32Array(memory.buffer))[sbrkPtr >> 2] = sbrkStart;
  return {
    memory: memory,
    table: table,
    stackStart: stackStart,
    sbrkStart: sbrkStart,
    sbrkPtr: sbrkPtr,
  };
}

// Compile and run

function start(imports, ctors, jsCtors) {
  console.log('start1');
  fetch('b.wasm', { credentials: 'same-origin' })
    .then(function(response) {
  console.log('start2');
      return response.arrayBuffer();
    })
    .then(function(arrayBuffer) {
  console.log('start3');
      return new Uint8Array(arrayBuffer);
    })
    .then(function(binary) {
  console.log('start4');
      return WebAssembly.instantiate(binary, imports);
    })
    .then(function(pair) {
  console.log('start5');
      var instance = pair['instance'];
      var exports = instance['exports'];
      ctors.forEach(function(ctor) {
  console.log('ctor ' + ctor);
        exports[ctor]();
      });
      jsCtors.forEach(function(ctor) {
  console.log('js ctor');
        ctor();
      });
      var main = exports['_main'];
  console.log('maintime');
      main();
    });
}

// XXX fix these

var __ATINIT__ = [];
var __ATMAIN__ = [];
var __ATEXIT__ = [];
var ENVIRONMENT_IS_NODE = 0;
