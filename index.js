import "./src/styles/style.scss";
import { mainPageHandler } from "./src/components/main-page/main-page";
import { signInHandler } from "./src/components/sign-in/sign-in";
import { PATHNAMES, ROUTES } from "./src/shared/routes";
import { getToken } from "./src/shared/local-storage-service";
import { signUpHandler } from "./src/components/sign-up/sign-up";
import { pomodorosHandler } from "./src/components/progress/progress";
import "bootstrap";

const routerMap = new Map([
  [
    PATHNAMES.home,
    () => {
      if (getToken()) {
        window.location.href = ROUTES.main_page;
        mainPageHandler();
      } else {
        window.location.href = ROUTES.sign_in;
      }
    },
  ],
  [PATHNAMES.sign_in, () => signInHandler()],
  [PATHNAMES.sign_up, () => signUpHandler()],
  [
    PATHNAMES.main_page,
    () => {
      if (getToken()) {
        mainPageHandler();
      } else {
        window.location.href = ROUTES.sign_in;
      }
    },
  ],
  [PATHNAMES.progress, () => pomodorosHandler()],
]);

window.onload = () => {
  const pathname = window.location.pathname;
  routerMap.get(pathname)();
};
