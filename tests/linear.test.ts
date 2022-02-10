import {Linear} from './../js/linear.js';

test("Linear", ()=>{
  const l = new Linear({x: 0, y: 0, d: 1}, {x: 1, y: 1, d: 1});
  expect(0).toBe(0)
});
