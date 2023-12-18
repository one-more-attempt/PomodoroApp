import {
  createNewTaskInDB,
  getAllTasks,
  updateTaskInDB,
  deleteTaskInDB,
} from "../../firebase-api/firebase-handlers";
import { getUserIdFromLS } from "../../shared/local-storage-service";
import { Task } from "../task/task";
import { renderHeader } from "../header/header";
import { ROUTES } from "../../shared/routes";
export const pomodorosHandler = async () => {
  await renderHeader();
  const title = document.getElementById("title");
  const description = document.getElementById("description");
  const createButton = document.getElementById("createButton");
  const cancelButton = document.getElementById("cancelButton");
  const tasksWrapper = document.querySelector(".tasks-list");
  const userIdFromLC = getUserIdFromLS();
  let tasks = [];
  let isEditTaskMode = false;
  let newTask = {
    userId: getUserIdFromLS(),
    title: "",
    description: "",
    pomodorosCount: 0,
  };
  let newTaskId;

  const initializeNewTaskObject = () => {
    newTask.userId = getUserIdFromLS();
    newTask.title = "";
    newTask.description = "";
    newTask.pomodorosCount = 0;
  };

  const clearForm = () => {
    title.value = null;
    description.value = null;
  };

  const editClickHandler = (taskId) => {
    console.log(taskId);
    isEditTaskMode = true;
    createButton.innerText = "Save changes";
    cancelButton.classList.remove("hidden");
    //ищем объект с таском на который кликнули
    const findTask = tasks.find(({ id }) => id === taskId);
    console.log(findTask);
    //обновляем поля в форме
    title.value = findTask.title;
    description.value = findTask.description;
    createButton.removeAttribute("disabled");
    //обновляем объект для сохранения в БД
    newTaskId = findTask.id;
    newTask = findTask;
    delete newTask.id;
    console.log("new Task", newTask);
    console.log("new TaskID", newTaskId);
  };

  const deleteClickHandler = async (taskId) => {
    const findTask = tasks.find(({ id }) => id === taskId);
    console.log(findTask);
    await deleteTaskInDB(findTask);
    await getAllTasks().then((tasksList) => {
      renderAllTasks(tasksList);
    });
  };

  const renderAllTasks = (tasksList) => {
    //если не пуст
    if (tasksList) {
      tasksWrapper.innerHTML = null;
      //получаем все таски в виде массива объектов
      tasks = Object.keys(tasksList).map((key) => {
        const task = { id: key, ...tasksList[key] };
        //сортировка по текущему юзеру
        if (task.userId === userIdFromLC) {
          tasksWrapper.append(
            new Task(task, editClickHandler, deleteClickHandler).getTask()
          );
        }
        return task;
      });
    }
  };

  const checkIsFormValid = () => {
    if (!!newTask.title && !!newTask.description) {
      createButton.removeAttribute("disabled");
    } else createButton.setAttribute("disabled", true);
  };

  const createTask = async () => {
    await createNewTaskInDB({ ...newTask, date: new Date() }).then(
      (response) => {
        console.log(response);
        clearForm();
        initializeNewTaskObject();
      }
    );
    await getAllTasks().then((tasksList) => {
      renderAllTasks(tasksList);
    });
  };

  const updateTask = async () => {
    await updateTaskInDB({ ...newTask }, newTaskId).then((response) => {
      console.log(response);
      clearForm();
      initializeNewTaskObject();
    });
    await getAllTasks().then((tasksList) => {
      renderAllTasks(tasksList);
    });
  };

  title.oninput = () => {
    newTask.title = title.value;
    checkIsFormValid();
  };

  description.oninput = () => {
    newTask.description = description.value;
    checkIsFormValid();
  };

  createButton.onclick = async () => {
    isEditTaskMode ? updateTask() : createTask();
  };

  cancelButton.onclick = () => {
    isEditTaskMode = false;
    cancelButton.classList.add("hidden");
    createButton.innerText = "Create Task";
    clearForm();
    initializeNewTaskObject();
  };

  await getAllTasks().then((tasksList) => {
    renderAllTasks(tasksList);
  });
  console.log(tasks);
};
