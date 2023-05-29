import * as React from "react";

import More from "../icons/more.svg";
import styles from "./profile.module.scss";

import { useUser } from "@/customize/store/user";
import { useStateStore } from "@/customize/store/state";

function logOutClick() {
  const userStore = useUser.getState();

  userStore.signOut();
}

export function Profile() {
  const isSignIn = true;
  const [showNav, setShowNav] = React.useState(false);
  const [planVisible, setPlanVisible] = React.useState(false);

  function planClick() {
    setPlanVisible(!planVisible);
    useStateStore.setState({ planVisible: planVisible });
  }

  React.useEffect(() => {
    // TODO: fix event type
    function handleClickOutside(event: any) {
      if (!!event.target.closest(".drop-menu")) {
        // ignore event
      } else if (!event.target.closest(".drop-nav")) {
        setShowNav(false);
      }
    }

    window.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className={styles["drop-container"]}>
        <button
          className={styles["drop-menu"] + " drop-menu"}
          onClick={() => {
            setShowNav(!showNav);
          }}
        >
          {isSignIn ? (
            <>
              <div>Profile</div>
              <div>{showNav}</div>
              <div>
                <More />
              </div>
            </>
          ) : (
            <></>
          )}
        </button>
        <div
          className={styles["drop-nav"] + " drop-nav"}
          style={{ visibility: showNav ? "visible" : "hidden" }}
        >
          <nav>
            <a className={styles["drop-content"]} onClick={planClick}>
              My Plan
            </a>
            <a className={styles["drop-content"]}>Settings</a>

            <div className={styles["drop-line"]} />

            <a className={styles["drop-content"]} onClick={logOutClick}>
              Log out
            </a>
          </nav>
        </div>
      </div>
    </>
  );
}
