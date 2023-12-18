import {
  createUserAuthRequest,
  createUserDataRequest,
  getUser,
  signInRequest,
} from "../../firebase-api/firebase-handlers";
import {
  setToken,
  setUser,
  setUserIdInLC,
} from "../../shared/local-storage-service";
import { ROUTES } from "../../shared/routes";

export const signUpHandler = () => {
  console.log(`Sign Up`);
  const firstNameInput = document.getElementById("firstNameInput");
  const lastNameInput = document.getElementById("lastNameInput");
  const emailInput = document.getElementById("emailInput");
  const passwordInput1 = document.getElementById("passwordInput1");
  const passwordInput2 = document.getElementById("passwordInput2");
  const signUpButton = document.getElementById("signUpButton");

  const userData = {
    firstName: "",
    lastName: "",
    email: "",
    password_1: "",
    password_2: "",
    userDurationSettings: {
      fullPomodoroDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      numberOfShortBeforeLong: 3,
      disableBreaks: false,
      autoStartNext: false,
      currentAlarmSound: 1,
      currentTask: false,
    },
  };

  const checkFormValid = () => {
    const isFormValid = Object.values(userData).every((value) => !!value);
    const isPasswordsEqual = userData.password_1 === userData.password_2;
    isFormValid && isPasswordsEqual
      ? signUpButton.removeAttribute("disabled")
      : signUpButton.setAttribute("disabled", true);
    console.log(isPasswordsEqual);
  };

  firstNameInput.oninput = () => {
    userData.firstName = firstNameInput.value;
    checkFormValid();
  };
  lastNameInput.oninput = () => {
    userData.lastName = lastNameInput.value;
    checkFormValid();
  };
  emailInput.oninput = () => {
    userData.email = emailInput.value;
    checkFormValid();
  };
  passwordInput1.oninput = () => {
    userData.password_1 = passwordInput1.value;
    checkFormValid();
  };
  passwordInput2.oninput = () => {
    userData.password_2 = passwordInput2.value;
    checkFormValid();
  };

  signUpButton.onclick = async () => {
    let authId = "";
    let userId = "";
    const { email, password_1: password } = userData;

    await createUserAuthRequest(userData).then((responce) => {
      //добавляем поле из auth
      authId = responce.user.uid;
      console.log(responce);
      console.log("SUCCESS");
    });

    //кладем поле из auth в коллекцию users
    await createUserDataRequest({ ...userData, authId: authId }).then(
      (response) => {
        userId = response.name;
        console.log("createUserDataRequest", response.name);
      }
    );

    // логин из  объекта userData
    await signInRequest({ email, password })
      .then(({ user: { accessToken } }) => {
        console.log(accessToken);
        setToken(accessToken);
      })
      .catch((error) => {
        console.log(error);
        console.log("INVALID CREDS");
      });
    await getUser(userId).then((response) => {
      console.log(response);
      console.log(userId);
      setUser(response);
      const userIdObj = {
        userId: userId,
      };
      setUserIdInLC(userIdObj);
      window.location.href = ROUTES.main_page;
    });
  };
};
