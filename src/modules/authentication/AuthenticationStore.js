// @flow

import { observable, action } from "mobx";
import { AuthenticationService } from "./AuthenticationService";
import { User } from "./models/User";

import { firebase } from "../../firebase";

class Store {
  @observable
  user: User;

  /**
   * Login
   */

  @action.bound
  async authenticateUserWithEmail(email: string, password: string) {
    try {
      let request = await AuthenticationService.authenticateUser(
        email,
        password
      );

      if (request) {
        this.user = request;
      }
    } catch (e) {
      console.log(e);
    }
  }

  @action.bound
  async authenticateUserWithId(id) {
    let request = await AuthenticationService.fetchFromUsers(id);

    if (!request) {
      throw new Error("Could not fetch user from firestore");
    }

    this.user = request;

    return request;
  }

  @action.bound
  async logoutUser() {
    await firebase.auth().signOut();
  }

  /**
   * Register
   */

  @action.bound
  checkIfRAExists(ra: string) {
    return new Promise(async (resolve, reject) => {
      let request = await AuthenticationService.checkIfRAExists(ra);
      resolve(request);
    });
  }

  @action.bound
  checkIfEmailExists(email: string) {
    return new Promise(async (resolve, reject) => {
      let request = await AuthenticationService.checkIfEmailExists(email);
      resolve(request);
    });
  }

  @action.bound
  async registerNewUser(
    name: string,
    ra: string,
    gender: "M" | "F",
    email: string,
    password: string
  ) {
    await AuthenticationService.registerNewUser(
      name,
      ra,
      gender,
      email,
      password
    );
  }
}

export const AuthenticationStore = new Store();
