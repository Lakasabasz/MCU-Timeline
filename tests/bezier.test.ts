import {Bezier} from './../js/bezier.js';

test("Bezier.getSpline().lenght == 1000", () => {
  const b = new Bezier({x: 0, y: 0, d: 0}, {x: 1.5, y: 1, d: 1});
  expect(b.getSpline().length).toBe(100);
})
