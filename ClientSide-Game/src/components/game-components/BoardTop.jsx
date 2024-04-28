import { useMemo } from "react";
import Bar from "./Bar";
import Board from "./Board";
import EndBar from "./EndBar";
import Piece from "./Piece";
import "./BoardTop.css";

export default function BoardTop(props) {
  return (
    <div className="board-top">
      <CreateEndBar
        player={props.game._whitePlayer}
        name={props.game._whitePlayer._name}
        key={"left-bar"}
        {...props}
      />

      <CreateBoard />

      <CreateEndBar
        player={props.game._blackPlayer}
        name={props.game._blackPlayer._name}
        key={"right-bar"}
        {...props}
      />
    </div>
  );

  function CreateBoard() {
    return (
      <div className={props.isBlack ? "rotated" : ""}>
        <Board>
          {props.game._board.map((bar, barIdx) => (
            <CreateBar
              bar={bar}
              barIdx={barIdx}
              key={`${barIdx}-temp`}
              {...props}
            />
          ))}
        </Board>
      </div>
    );
  }

  function CreateBar(props) {
    return (
      <Bar
        isTopRow={props.barIdx > 11}
        onClick={() => props.select(props.barIdx)}
        key={props.barIdx}
        fill={
          (props.thisMove._canGoTo.includes(props.barIdx) && "#90ee90  ") ||
          (props.barIdx % 2 === 0 && props.barIdx > 11 && "#671010") ||
          (props.barIdx % 2 !== 0 && props.barIdx <= 11 && "#671010") ||
          (props.barIdx % 2 === 0 && props.barIdx <= 11 && "#231917") ||
          (props.barIdx % 2 !== 0 && props.barIdx > 11 && "#231917") ||
          "Red"
        }
      >
        {props.bar.map(
          (piece, pieceIdx) =>
            pieceIdx < 6 && (
              <CreatePiece
                piece={piece}
                pieceIdx={pieceIdx}
                key={`${props.barIdx}-${pieceIdx}-temp`}
                border={
                  (props.thisMove._fromBarIdx === props.barIdx &&
                    ((pieceIdx === 0 && props.barIdx > 11) ||
                      (pieceIdx === props.bar.length - 1 &&
                        props.barIdx <= 11)) &&
                    "2px solid #671010") ||
                  (piece == "White"
                    ? props.game._whitePlayer._pieceBorderColor
                    : props.game._blackPlayer._pieceBorderColor)
                }
                {...props}
              />
            )
        )}
      </Bar>
    );
  }

  function CreateEndBar(props) {
    return (
      <EndBar
        onClick={() => props.select(props.player._endBarIdx)}
        key={props.player._endBarIdx}
        fill={props.name === "White" ? "#e0ded7" : "#232937"}
      >
        {props.player._endBar.map((piece, pieceIdx) => (
          <CreatePiece
            key={`${props.player._endBarIdx}-${pieceIdx}-temp`}
            bar={props.player._endBar}
            barIdx={props.player._endBarIdx}
            piece={piece}
            pieceIdx={pieceIdx}
            border={props.player._pieceBorderColor}
          />
        ))}
      </EndBar>
    );
  }

  function CreatePiece(props) {
    const formattedBarIndex = useMemo(() => {
      const result =
        typeof props.barIdx === "number"
          ? props.barIdx
          : parseInt(props.barIdx);
      return result;
    }, [props.barIdx]);
    return (
      <Piece
        key={`${props.barIdx}-${props.pieceIdx}`}
        border={props.border}
        color={props.piece}
      >
        {props.bar.length > 6 &&
          ((props.pieceIdx === 0 && formattedBarIndex > 11) ||
            (props.pieceIdx === 5 && formattedBarIndex <= 11)) && (
            <>{props.bar.length - 6}</>
          )}
      </Piece>
    );
  }
}
