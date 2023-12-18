import { ROUTES } from "../../shared/routes";
import {
  setUserSettingsInDB,
  getUser,
  getAllTasks,
  getCurrentTask,
} from "../../firebase-api/firebase-handlers";
import {
  getUserFromLS,
  getUserIdFromLS,
  setUser,
  setCurrentTaskInLS,
  getCurrentTaskFromLS,
  setUserSettingsInLS,
} from "../../shared/local-storage-service";
import { Modal } from "../../shared/modal";
import { MODAL_MESSAGES } from "../../shared/modal_messages";
import { logoutFunction } from "../../shared/local-storage-service";
import { Task } from "../task/task";

export const renderHeader = async () => {
  const logout = document.getElementById("logout");
  const headerUserName = document.getElementById("userName");
  const headerLogoContainer = document.getElementById("logoContainer");
  const progressButton = document.getElementById("progressButton");
  const saveChangesButton = document.getElementById("saveChangesButton");
  const pomodoroDuration = document.getElementById("pomodoroDuration");
  const pomodoroDurationValue = document.getElementById(
    "pomodoroDurationValue"
  );
  const shortRestDuration = document.getElementById("shortRestDuration");
  const shortRestDurationValue = document.getElementById(
    "shortRestDurationValue"
  );
  const longRestDuration = document.getElementById("longRestDuration");
  const longRestDurationValue = document.getElementById(
    "longRestDurationValue"
  );
  const pomodorosBefereLongRest = document.getElementById(
    "pomodorosBefereLongRest"
  );
  const pomodorosBefereLongRestValue = document.getElementById(
    "pomodorosBefereLongRestValue"
  );
  const dropdownContainer = document.getElementById("dropdownContainer");
  const currentTaskDropdown = document.getElementById("currentTask");
  const withoutTask = document.getElementById("withoutTask");

  // инициализация по умолчанию
  let userDurationSettings = {
    fullPomodoroDuration: 1,
    shortBreakDuration: 1.1,
    longBreakDuration: 1.5,
    numberOfShortBeforeLong: 3,
    disableBreaks: false,
    autoStartNext: false,
    currentAlarmSound: 1,
    currentTask: false,
  };
  setUserSettingsInLS(userDurationSettings);

  //обновляем если залогинен
  let newSettings = getUserFromLS();
  newSettings = newSettings.userDurationSettings;
  setUserSettingsInLS(newSettings);
  userDurationSettings = newSettings;

  //берем из базы если в объекте не false
  if (userDurationSettings.currentTask) {
    let currentTaskFromDB;
    await getCurrentTask(userDurationSettings.currentTask).then((response) => {
      currentTaskFromDB = response;
    });

    setCurrentTaskInLS(currentTaskFromDB);
    console.log(currentTaskFromDB);
  }

  // Если залогинен выводим имя и заполняем настройки
  let curentUser = getUserFromLS();
  let userIDFromLocal = getUserIdFromLS();
  let tasks = [];
  let currentTaskFromLocalStorage = getCurrentTaskFromLS();
  console.log(currentTaskFromLocalStorage);

  if (currentTaskFromLocalStorage) {
    currentTaskDropdown.innerText = `${currentTaskFromLocalStorage.title}`;
  }
  headerUserName.innerText = `${curentUser.firstName} ${curentUser.lastName}`;

  console.log(curentUser);
  console.log(userDurationSettings);

  const titleClickHandler = async (taskId) => {
    console.log(taskId);
    //ищем объект с таском на который кликнули
    const findTask = tasks.find(({ id }) => id === taskId);
    console.log(findTask);
    currentTaskDropdown.innerText = `${findTask.title}`;
    setCurrentTaskInLS({ ...findTask });
    userDurationSettings.currentTask = findTask.id;
    await setUserSettingsInDB(userDurationSettings, userIDFromLocal);
    console.log(userDurationSettings);
  };

  const renderAllTasksTitles = (tasksList) => {
    //если если таски выводим
    withoutTask.onclick = () => {
      currentTaskDropdown.innerText = `No specific task`;
      setCurrentTaskInLS(false);
    };
    if (tasksList) {
      tasks = Object.keys(tasksList).map((key) => {
        const task = { id: key, ...tasksList[key] };
        if (task.userId === userIDFromLocal) {
          console.log('has tasks');
          dropdownContainer.append(
            new Task(task, titleClickHandler).getTaskTitle()
          );
        }
        return task;
      });
    }
  };

  await getAllTasks().then((tasksList) => {
    console.log(tasksList);
    renderAllTasksTitles(tasksList);
  });

  setUserSettingsInLS(userDurationSettings);
  console.log(userDurationSettings);
  pomodoroDuration.value = userDurationSettings.fullPomodoroDuration;
  shortRestDuration.value = userDurationSettings.shortBreakDuration;
  longRestDuration.value = userDurationSettings.longBreakDuration;
  pomodorosBefereLongRest.value = userDurationSettings.numberOfShortBeforeLong;

  pomodoroDurationValue.innerText = ` ${pomodoroDuration.value}`;
  shortRestDurationValue.innerText = ` ${shortRestDuration.value}`;
  longRestDurationValue.innerText = ` ${longRestDuration.value}`;
  pomodorosBefereLongRestValue.innerText = ` ${pomodorosBefereLongRest.value}`;

  pomodoroDuration.oninput = () => {
    pomodoroDurationValue.innerText = ` ${pomodoroDuration.value}`;
  };
  shortRestDuration.oninput = () => {
    shortRestDurationValue.innerText = ` ${shortRestDuration.value}`;
  };
  longRestDuration.oninput = () => {
    longRestDurationValue.innerText = ` ${longRestDuration.value}`;
  };
  pomodorosBefereLongRest.oninput = () => {
    pomodorosBefereLongRestValue.innerText = ` ${pomodorosBefereLongRest.value}`;
  };

  saveChangesButton.onclick = async () => {
    userDurationSettings.fullPomodoroDuration = pomodoroDuration.value;
    userDurationSettings.shortBreakDuration = shortRestDuration.value;
    userDurationSettings.longBreakDuration = longRestDuration.value;
    userDurationSettings.numberOfShortBeforeLong =
      pomodorosBefereLongRest.value;

    console.log(userDurationSettings);
    // // обновляем базуы
    const currentUserId = getUserIdFromLS();
    console.log(currentUserId);
    await setUserSettingsInDB(userDurationSettings, currentUserId);
    //обновляем локалсторадж
    const newUserFromDB = await getUser(currentUserId);
    setUser(newUserFromDB);
    setUserSettingsInLS(userDurationSettings);
  };

  headerLogoContainer.onclick = () => {
    window.location.href = ROUTES.main_page;
  };
  progressButton.onclick = () => {
    window.location.href = ROUTES.progress;
  };

  logout.onclick = () => {
    new Modal(MODAL_MESSAGES.logout, logoutFunction).showModal();
  };
};
