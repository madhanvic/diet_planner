export interface Coordinates {
  top: number;
  bottom: number;
  left: number;
  right: number;
  width: number;
  heigth: number;
  vdirection: null | "UP" | "DOWN";
}

export type CordinateStateInterface = Coordinates | null;
