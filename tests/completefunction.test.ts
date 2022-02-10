import {CompleteFunction, CompleteFunctionConfig, Node, Connector} from './../js/completefunction.js';

test("CompleteFunction", () => {
  const config: CompleteFunctionConfig = [
    {"x": 0, "y": 0, "d": 0},
    {"type": "linear"},
    {"x": 1, "y": 0, "d": 0},
    {"type": "bezier"},
    {"x": 3, "y": 1, "d": 1},
    {"type": "linear"},
    {"x": 5, "y": 3, "d": 1}
  ]
  const cf = new CompleteFunction(config)
  expect(5).toBe(5);
})
