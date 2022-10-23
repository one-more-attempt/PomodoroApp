import { Modal } from "../../shared/modal";
import { MODAL_MESSAGES } from "../../shared/modal_messages";

export class Task {
  #id;
  #description;
  #title;
  #pomodorosCount;
  #editFn;
  #deleteFn;

  constructor({ id, description, title, pomodorosCount }, editFn, deleteFn) {
    this.#id = id;
    this.#description = description;
    this.#title = title;
    this.#pomodorosCount = pomodorosCount;
    this.#editFn = editFn;
    this.#deleteFn = deleteFn;
  }

  getTask() {
    const taskWrapper = document.createElement("div");
    const title = document.createElement("h4");
    const description = document.createElement("p");
    const pomodorosCount = document.createElement("span");
    const editIcon = document.createElement("div");
    const deleteIcon = document.createElement("div");
    const pomodoroCounterIcon = document.createElement("div");

    const delFunction = () => {
      this.#deleteFn(this.#id);
      taskWrapper.remove();
    };

    editIcon.innerHTML = `<i class="fa-solid fa-square-pen edit-icon"></i>`;
    deleteIcon.innerHTML = `<i class="fa-solid fa-trash delete-icon"></i>`;
    pomodoroCounterIcon.innerHTML = `<img src="/src/img/pomodoro.png" alt="">`;
    taskWrapper.className = "task";
    pomodoroCounterIcon.className = "pomo-icon";

    title.innerText = this.#title;
    description.innerText = this.#description;
    pomodorosCount.innerText = this.#pomodorosCount;

    taskWrapper.append(
      title,
      description,
      pomodoroCounterIcon,
      pomodorosCount,
      editIcon,
      deleteIcon
    );

    editIcon.onclick = () => this.#editFn(this.#id);
    deleteIcon.onclick = () => {
      new Modal(MODAL_MESSAGES.delete, delFunction).showModal();
    };

    return taskWrapper;
  }

  getTaskTitle() {
    const taskWrapper = document.createElement("li");
    const taskTitle = document.createElement("a");

    taskTitle.className = "dropdown-item";
    taskTitle.innerText = `${this.#title}`;
    taskWrapper.append(taskTitle);

    taskWrapper.onclick = () => {
      this.#editFn(this.#id);
    };

    return taskWrapper;
  }
}

export class TaskTitle {
  #id;
  #title;
  #setFn;

  constructor({ id, title }, setFn) {
    this.#id = id;
    this.#title = title;
    this.#setFn = setFn;
  }
  getTitle() {
    const taskElement = document.createElement("li");
    const tasklink = document.createElement("a");
    tasklink.classList.add("dropdown-item");
    tasklink.innerText = `${this.#title}`;

    taskElement.append(tasklink);
    taskElement.onclick = () => {
      console.log(taskElement);
      console.log(this.#title);
      this.#setFn(this.#title, this.#id);
    };
    return taskElement;
  }
}
