import { v4 } from "uuid";
import { Ref } from "vue";

export class Tile {
  value?: number;
  id: string;
  x: number;
  y: number;

  constructor() {
    this.id = "";
    this.x = 0;
    this.y = 0;
  }
}

export class ValuedTile implements Tile {
  id: string;
  x: number;
  y: number;
  value: number;

  constructor(tile: Tile) {
    this.x = tile.x;
    this.y = tile.y;
    this.id = v4();
    this.value = Math.random() > 0.9 ? 4 : 2;
  }
}

export type Direction = "up" | "down" | "left" | "right";

export class MovingTile extends ValuedTile {
  to?: Tile | Direction;

  constructor(tile: ValuedTile) {
    super(tile);
    this.id = tile.id;
    this.value = tile.value;
  }

  moving() {
    return !!this.to;
  }
}

export interface Board {
  score: Ref<number>;
  newGame: () => void;
}
