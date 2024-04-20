import { MovePath } from "./modules/Board";
import { Player, PlayerColor } from "./modules/Player";
import { DiceResut } from "./modules/Dice";
import { Point } from "./modules/Point";
import { initialState } from "./startingState";
import { unshiftFrom } from "./util";

export class Board {
  state = initialState;

  white = new Player(PlayerColor.white);
  black = new Player(PlayerColor.black);

  currentPlayer: Player = this.white;

  toggleCurrentPlayer() {
    if (this.currentPlayer.color === PlayerColor.white) {
      this.currentPlayer = this.black;
    } else {
      this.currentPlayer = this.white;
    }
  }

  PlayerInPrison(player: Player = this.currentPlayer): boolean {
    return this.state.prison.includesCheckerOf(player);
  }

  currentPlayerCanBearOff(): boolean {
    if (this.PlayerInPrison()) {
      return false;
    }

    const points = this.getPlayersPoints();
    return points.every(
      point => point.relativePositionFromHome(this.currentPlayer) <= 6
    );
  }

  getPlayersPoints(player: Player = this.currentPlayer) {
    return this.state.points.filter(point => point.includesCheckerOf(player));
  }

  score(player: Player) {
    const playersPoints = this.getPlayersPoints(player);

    if (this.PlayerInPrison(player)) {
      playersPoints.push(this.state.prison);
    }

    let totalScore = 0;
    for (let point of playersPoints) {
      totalScore +=
        point.relativePositionFromHome(player) * point.checkers.length;
    }

    return totalScore;
  }

  getTargetPoint(
    point: Point,
    dice: DiceResut,
    player: Player
  ): Point | undefined {
    const position =
      player.color === PlayerColor.white
        ? Math.max(point.position - dice, player.home)
        : Math.min(point.position + dice, player.home);

    return Point.getPointRefByPosition(
      position as Point["position"],
      this.state
    );
  }

  getMovePathsForPoint(
    point: Point,
    dices: DiceResut[],
    player: Player
  ): MovePath[] {
    const pointPaths: MovePath[] = [];

    const LoopDices = (dices: DiceResut[]): void => {
      const movePath: MovePath = [];
      let distance = 0;
      let lastPoint = point;

      for (let dice of dices) {
        const target = this.getTargetPoint(point, distance + dice, player);
        if (!target || !target.isAvailableFor(player)) {
          break;
        }

        movePath.push({ from: lastPoint, to: target, uses: dice });

        distance += dice;
        lastPoint = target;
      }

      if (movePath.length > 0) {
        pointPaths.push(movePath);
      }
    };

    dices.forEach(dice => {
      LoopDices(unshiftFrom(dices, dice));
    });

    return pointPaths;
  }

  private getPrisonMovePaths(diceValues: DiceResut[], currentPlayer: Player): MovePath[] {
    const prisonMovePaths: MovePath[] = [];
    const prisonMethodName = currentPlayer.color === PlayerColor.white ? 'checkWhitePrisonMoves' : 'checkBlackPrisonMoves';
    this[prisonMethodName](diceValues, prisonMovePaths, this.getPlayersPoints(currentPlayer)[25]);
    return prisonMovePaths;
  }

  private checkBlackPrisonMoves(diceValues: number[], allPrisonMovePaths: MovePath[], point: Point) {
    for (const diceValue of diceValues) {
      const targetIndex = 23 - (diceValue - 1);
      const targetPoint = this.state.points[targetIndex];

      if (targetPoint.checkers.length === 0 || targetPoint.includesCheckerOf(this.currentPlayer)) {
        allPrisonMovePaths.push([{ from: point, to: targetPoint, uses: diceValue }]);
      }
  }
}
  private checkWhitePrisonMoves(diceValues: number[], movePaths: MovePath[], origin: Point) {
    for (const diceValue of diceValues) {
      const targetIndex = diceValue - 1;
      const targetPoint = this.state.points[targetIndex];

      if (targetPoint.checkers.length === 0 || targetPoint.includesCheckerOf(this.currentPlayer)) {
        movePaths.push([{ from: origin, to: targetPoint, uses: diceValue }]);
      }
    }
  }

  getAllMovePaths(diceValues: DiceResut[], currentPlayer: Player = this.currentPlayer): MovePath[] {
    const allMovePaths: MovePath[] = [];
    const playerPoints = this.getPlayersPoints(currentPlayer);
    if (this.currentPlayerCanBearOff()) {
      
    }
    for (const point of playerPoints) {
      if (point.position === 25) {
        return this.getPrisonMovePaths(diceValues, currentPlayer);
      }
      const movePaths = this.getMovePathsForPoint(point, diceValues, currentPlayer);
      allMovePaths.push(...movePaths);
    }
    return allMovePaths;
  }
}
