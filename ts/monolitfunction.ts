export abstract class MonolitFunction{
  abstract getCoords(t: number): [number, number];
  abstract getSpline(): number[][];
  abstract distanceFromPoint(point: [number, number]): number;
}
