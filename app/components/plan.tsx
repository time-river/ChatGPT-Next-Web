import React from "react";

import styles from "./plan.module.scss";

import { StateStore, useStateStore } from "@/customize/store/state";

export function Plan() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const unstate = useStateStore.subscribe((state: StateStore) => {
      setVisible(state.planVisible);
    });

    return () => {
      unstate();
    };
  }, []);

  return (
    <div
      className={styles["plan-container"]}
      style={{ visibility: visible ? "visible" : "hidden" }}
    >
      <div className={styles["plan-wrapper"]}>
        <div className={styles["plan-dialog"]}>
          <div className={styles["plan-box"]}>
            <div>购买token</div>
            <button>用户中心</button>
          </div>
        </div>
      </div>
    </div>
  );
}
