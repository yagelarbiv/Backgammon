export enum PlayerColor {
  "black" = 0,
  "white" = 1
}

export enum PlayerHome {
  black = 25,
  white = 0
}

export class Player {
  home: PlayerHome;

  constructor(public color: PlayerColor) {
    this.home =
      color === PlayerColor.white ? PlayerHome.white : PlayerHome.black;
  }
}
