import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { FIREBASE_CONFIG, DB_URL } from "./firebase-config";

//инициализация firebase
const app = initializeApp(FIREBASE_CONFIG);
const auth = getAuth();

export const createUserAuthRequest = ({ email, password_1 }) => {
  return createUserWithEmailAndPassword(auth, email, password_1);
};

export const createUserDataRequest = (user) => {
  return fetch(`${DB_URL}/users.json`, {
    method: "POST",
    body: JSON.stringify(user),
  }).then((response) => response.json());
};

export const setUserSettingsInDB = (userSettings, id) => {
  return fetch(`${DB_URL}/users/${id}/userDurationSettings.json`, {
    method: "PUT",
    body: JSON.stringify(userSettings),
  }).then((response) => response.json());
};

export const getUserSettingsFromDB = (id) => {
  return fetch(`${DB_URL}/users/${id}/userDurationSettings.json`).then(
    (response) => response.json()
  );
};

export const getUsers = () => {
  return fetch(`${DB_URL}/users.json`).then((responce) => responce.json());
};

export const getUser = (id) => {
  return fetch(`${DB_URL}/users/${id}.json`).then((responce) =>
    responce.json()
  );
};
export const signInRequest = ({ email, password }) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const getAllPomodoros = () => {
  return fetch(`${DB_URL}/pomodoros.json`).then((responce) => responce.json());
};

export const newPorodoroToDB = (pomodoro) => {
  return fetch(`${DB_URL}/tasks/${id}.json`, {
    method: "POST",
    body: JSON.stringify(pomodoro),
  }).then((response) => response.json());
};

export const createNewTaskInDB = (task) => {
  return fetch(`${DB_URL}/tasks.json`, {
    method: "POST",
    body: JSON.stringify(task),
  }).then((response) => response.json());
};

export const updateTaskInDB = (task, taskId) => {
  return fetch(`${DB_URL}/tasks/${taskId}.json`, {
    method: "PUT",
    body: JSON.stringify(task),
  }).then((response) => response.json());
};

export const deleteTaskInDB = (task) => {
  return fetch(`${DB_URL}/tasks/${task.id}.json`, {
    method: "DELETE",
  }).then((response) => response.json());
};

export const getAllTasks = () => {
  return fetch(`${DB_URL}/tasks.json`).then((responce) => responce.json());
};

export const getCurrentTask = (id) => {
  let task = fetch(`${DB_URL}/tasks/${id}.json`).then((responce) =>
    responce.json()
  );
  return task;
};
