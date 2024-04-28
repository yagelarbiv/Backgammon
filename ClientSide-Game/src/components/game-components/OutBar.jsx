import styles from "./OutBar.module.css";

export default function OutBar(props) {
  return (
    <div className={styles.barWrapper} style={{ fill: props.fill }} {...props}>
      <div
        className={styles.bar}
        style={{ justifyContent: props.isLeft ? "initial" : "flex-end" }}
      >
        {props.children}
      </div>
      <svg height="40" width="250">
        <polygon
          points={props.isLeft ? "0,0 0,40 250,20" : "0,20 250,0 250,40"}
          className={styles.polygon}
        />
      </svg>
    </div>
  );
}
