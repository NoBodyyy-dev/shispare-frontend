import styles from "./skeletons.module.sass"; // Подключаем стили

export default function SkeletonProductCard() {
  return (
    <div className={styles["skeleton-product-card"]}>
      <div className={styles["skeleton-product-card-image"]}></div>
      <div className={styles["skeleton-product-card-title"]}></div>
      <div className={styles["skeleton-product-card-rating"]}></div>
      <div className={styles["skeleton-product-card-price"]}></div>
      <div className={styles["skeleton-product-card-button"]}></div>
    </div>
  );
}
