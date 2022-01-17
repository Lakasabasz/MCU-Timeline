export function rect(x, y, w, h){
  return [
    x, y,
    x, y+h,
    x+w, y,
    x+w, y+h
  ];
}
