import { async } from "@firebase/util";
import { signInRequest, getUsers } from "../../firebase-api/firebase-handlers";
import {
  setToken,
  setUser,
  setUserIdInLC,
} from "../../shared/local-storage-service";
import { ROUTES } from "../../shared/routes";

export const signInHandler = () => {
  console.log("SIGN IN PAGE!");

  const signInButton = document.getElementById("sign-in-button");
  const passwordInput = document.getElementById("passwordInput");
  const emailInput = document.getElementById("emailInput");
  const userData = {
    email: "",
    password: "",
  };

  const checkFormValid = () => {
    const isFormValid = Object.values(userData).every((value) => !!value);
    isFormValid
      ? signInButton.removeAttribute("disabled")
      : signInButton.setAttribute("disabled", true);
  };

  passwordInput.oninput = () => {
    userData.password = passwordInput.value;
    checkFormValid();
  };

  emailInput.oninput = () => {
    userData.email = emailInput.value;
    checkFormValid();
  };

  signInButton.onclick = async () => {
    let userId = "";
    await signInRequest(userData)
      .then(({ user: { accessToken, uid } }) => {
        console.log(accessToken, "\n", uid);
        setToken(accessToken);
        userId = uid;
      })
      .catch((error) => {
        console.log(error);
        console.log(`invalid credentials`);
      });

    await getUsers().then((response) => {
      //проверка записи соответствия полученному authID
      //возвращаю объект с айди в базе
      const users = Object.keys(response).map((userId) => {
        return { ...response[userId], userId };
      });
      console.log(users);
      const user = users.find((user) => user.authId === userId);
      console.log(user);
      setUser(user);
      setUserIdInLC(user);
      window.location.href = ROUTES.main_page;
    });
  };
};
