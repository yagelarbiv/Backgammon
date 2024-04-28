/* eslint-disable react/prop-types */
import styles from "./Piece.module.css";


export default function Piece(props) {
  return (
    <div
      className={styles.piece}
      style={{
        background: props.color !== "White" ? "black" : "#f8f7f3",
        border: props.border,
        color: props.color === "White" ? "black" : "#f8f7f3",
      }}
      {...props}
    />
  );
}
