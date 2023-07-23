import React from 'react';
import styles from './Cat.module.css';

function Cat() {
  return (
    <div className={styles.cat}>
      <div className={styles["ear ear--left"]}></div>
      <div className={styles["ear ear--right"]}></div>
      <div className={styles.face}>
        <div className={styles["eye eye--left"]}>
          <div className={styles["eye-pupil"]}></div>
        </div>
        <div className={styles["eye eye--right"]}>
          <div className={styles["eye-pupil"]}></div>
        </div>
        <div className={styles.muzzle}></div>
      </div>
    </div>
  );
}

export default Cat;