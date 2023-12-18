import {
  getCurrentTask,
  updateTaskInDB,
} from "../../firebase-api/firebase-handlers";
import {
  getUserSettingsFromLS,
  getCurrentTaskFromLS,
} from "../../shared/local-storage-service";
import { Modal } from "../../shared/modal";
import { MODAL_MESSAGES } from "../../shared/modal_messages";
import { renderHeader } from "../header/header";

export const mainPageHandler = async () => {
  await renderHeader();
  const runButton = document.getElementById("run");
  const pauseButton = document.getElementById("pause");
  const stopButton = document.getElementById("stop");
  const resumeButton = document.getElementById("resume");
  const output = document.getElementById("output");
  const progressBarWrapper = document.getElementById("progress-wrapper");
  const progressBar = document.getElementById("progress-bar");
  const progressBarPercent = document.getElementById("progress-percent");

  let userDurationSettings = getUserSettingsFromLS();
  console.log(userDurationSettings);

  let count = 0;
  let totalTime = userDurationSettings.fullPomodoroDuration * 60;
  let timer;
  let shortRestCount = 0;
  let alarm = new Audio("./src/sounds/win_calendar.mp3");

  const getTimeInHHMMSS = (timeValueInSeconds) => {
    let hours = Math.floor(timeValueInSeconds / 3600);
    let minutes = Math.floor((timeValueInSeconds - hours * 3600) / 60);
    let seconds = timeValueInSeconds - hours * 3600 - minutes * 60;
    if (hours < 10) {
      hours = "0" + hours;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    return hours + ":" + minutes + ":" + seconds;
  };

  const getCurrentTimePercentage = (currentCountValue, totalTimeInSeconds) => {
    let actualElapsedTimeValue = totalTimeInSeconds - currentCountValue;
    let percentage = (actualElapsedTimeValue * 100) / totalTimeInSeconds;
    if (percentage < 1) {
      return 0;
    }
    if (percentage > 1 && percentage <= 99) {
      return Math.round(percentage);
    }
    if (percentage >= 99 && percentage !== 100) {
      return 99;
    }
    if (percentage === 100) {
      return 100;
    }
  };
  const resetAll = () => {
    progressBar.style.width = "0%";
    clearInterval(timer);
    output.innerText = "";
  };

  const checkBreakStatus = () => {
    if (shortRestCount < userDurationSettings.numberOfShortBeforeLong) {
      resetAll();
      totalTime = userDurationSettings.shortBreakDuration * 60;
      mainRunHandler(false);
    }
    if (shortRestCount >= userDurationSettings.numberOfShortBeforeLong) {
      resetAll();
      totalTime = userDurationSettings.longBreakDuration * 60;
      shortRestCount = 0;
      mainRunHandler(false);
    }
  };

  const mainRunHandler = async (isResumed) => {
    console.log(count, totalTime);
    if (!isResumed) {
      count = totalTime;
      output.innerText = getTimeInHHMMSS(totalTime);
      progressBar.style.width = "1px";
    }
    count--;

    timer = setInterval(async () => {
      if (count <= 0) {
        clearInterval(timer);
        console.log(count);
        shortRestCount++;
        progressBar.style.width = "100%";
        output.innerText = "Sucessfully finished";
        stopButton.style.display = "none";
        pauseButton.style.display = "none";
        runButton.style.display = "inline-block";
        alarm.play();

        //обновляем значение счетчика в базе;
        const currentTask = getCurrentTaskFromLS();
        let currentTaskId = getUserSettingsFromLS();
        currentTaskId = currentTaskId.currentTask;

        let currentTaskToUpdate;
        await getCurrentTask(currentTaskId).then((response) => {
          currentTaskToUpdate = response;
        });
        console.log(currentTaskToUpdate);
        currentTaskToUpdate.pomodorosCount++;
        await updateTaskInDB(currentTaskToUpdate, currentTaskId);

        // показ модального окна
        new Modal(
          shortRestCount >= 3
            ? MODAL_MESSAGES.longBreak
            : MODAL_MESSAGES.shortBreak,
          checkBreakStatus
        ).showModal();

        console.log(shortRestCount);
      } else {
        output.innerText = getTimeInHHMMSS(count);
        console.log(getTimeInHHMMSS(count));
        progressBar.style.width = `${getCurrentTimePercentage(
          count,
          totalTime
        )}%`;
        count--;
      }
    }, 1000);
  };

  runButton.onclick = async () => {
    runButton.style.display = "none";
    pauseButton.style.display = "inline-block";
    stopButton.style.display = "inline-block";
    userDurationSettings = getUserSettingsFromLS();
    totalTime = userDurationSettings.fullPomodoroDuration * 60;
    count = totalTime;
    console.log(userDurationSettings);
    mainRunHandler(false);
  };

  stopButton.onclick = () => {
    new Modal(MODAL_MESSAGES.stop, resetAll).showModal();
    resumeButton.style.display = "none";
    pauseButton.style.display = "none";
    stopButton.style.display = "none";
    runButton.style.display = "block";
    console.log("stopped", getTimeInHHMMSS(totalTime));
  };

  pauseButton.onclick = () => {
    resumeButton.style.display = "inline-block";
    stopButton.style.display = "inline-block";
    pauseButton.style.display = "none";
    clearInterval(timer);
    console.log("paused", count);
    //инкремент на исключение задержки и случая остатка 1 секунды
    count++;
    console.log(count);
  };

  resumeButton.onclick = () => {
    resumeButton.style.display = "none";
    pauseButton.style.display = "inline-block";
    console.log("resumed");
    mainRunHandler(true);
  };
};
