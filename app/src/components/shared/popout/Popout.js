import styles from "./popout.module.css";

export default function Popout({ name, body, style, href, highlight }) {
  return (
    <>
      {href ? (
        <a className={style} href={href}>
          {highlight && (
            <span className={`${styles["badge"]} ${styles["red"]}`}>
              {highlight}
            </span>
          )}
          <h3>{name}</h3>
          {body ? <body>{body}</body> : <></>}
        </a>
      ) : (
        <div className={style}>
          {highlight && (
            <span className={`${styles["badge"]} ${styles["red"]}`}>
              {highlight}
            </span>
          )}
          <h3>{name}</h3>
          {body ? <body>{body}</body> : <></>}
        </div>
      )}
    </>
  );
}
