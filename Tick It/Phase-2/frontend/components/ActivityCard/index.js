import styles from "./ActivityCard.module.scss";

const ActivityCard = ({ date, time, info, highlight, highlightName }) => {
  return (
    <div className={styles.activity}>
      {date && <p className={styles.activityDate}>{date}</p>}
      <p className={styles.activityTime}>{time}</p>
      <p className={styles.activityInfo}>
        {info}
        {highlight && <span style={{ color: '#FFCC00' }}>{highlight}</span>}
        {highlightName && (
          <span style={{ color: '#FFCC00' }}>{highlightName}</span>
        )}
      </p>
    </div>
  )
}

export default ActivityCard;
