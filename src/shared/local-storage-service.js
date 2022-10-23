import { ROUTES } from "./routes";

export const setToken = (token) => {
  localStorage.setItem("accessToken", token);
};
export const getToken = () => localStorage.getItem("accessToken");

export const setUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const setUserIdInLC = (user) => {
  localStorage.setItem("userId", JSON.stringify(user.userId));
};

export const getUserFromLS = () =>
  JSON.parse(localStorage.getItem("user")) || {};

export const getUserIdFromLS = () => JSON.parse(localStorage.getItem("userId"));

export const setUserSettingsInLS = (userSettings) => {
  localStorage.setItem("userSettings", JSON.stringify(userSettings));
};

export const getUserSettingsFromLS = () =>
  JSON.parse(localStorage.getItem("userSettings"));

export const setCurrentTaskInLS = (currentTask) => {
  localStorage.setItem("currentTask", JSON.stringify(currentTask));
};

export const getCurrentTaskFromLS = () =>
  JSON.parse(localStorage.getItem("currentTask"));

export const logoutFunction = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userSettings");
  localStorage.removeItem("user");
  localStorage.removeItem("currentTask");
  localStorage.removeItem("userId");
  window.location = ROUTES.sign_in;
};
