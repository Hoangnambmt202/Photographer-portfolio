'use client';
import styles from "@/styles/UploadButton.module.scss";

const UploadButton = () => {
    
  return (
    <button type="submit" className="relative w-[120px] h-[42px] rounded-lg">
      <input type="checkbox" id="c" className={styles.checkbox} />
      <label htmlFor="c" className={styles.label}>
        <div className={styles.app}>
          <div className={styles.arrow} />
          <div className={styles.success}>
            <i className="fas fa-check-circle" />
          </div>
        </div>
      </label>
    </button>
  );
};

export default UploadButton;
