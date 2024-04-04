import axios from "axios";
import { LOGIN_USER, REGISTER_USER, AUTH_USER } from "./type";

export function loginUser(dataToSubmit) {
  return function (dispatch) {
    return axios
      .post("api/user/login", dataToSubmit)
      .then((response) => {
        dispatch({
          type: LOGIN_USER,
          payload: response.data,
        });
        return response.data;
      })
      .catch((error) => {
        console.error("Error while login:", error);
        throw error;
      });
  };
}

export function registerUser(dataToSubmit) {
  return function (dispatch) {
    return axios
      .post("api/user/register", dataToSubmit)
      .then((response) => {
        dispatch({
          type: REGISTER_USER,
          payload: response.data,
        });
        return response.data;
      })
      .catch((error) => {
        console.error("Error while login:", error);
        throw error;
      });
  };
}

export function auth() {
  return function (dispatch) {
    return axios
      .get("api/user/auth")
      .then((response) => {
        dispatch({
          type: AUTH_USER,
          payload: response.data,
        });
        return response.data;
      })
      .catch((error) => {
        console.error("Error while login:", error);
        throw error;
      });
  };
}
