// @flow

import { observable, action } from "mobx";
import { AuthenticationService } from "./AuthenticationService";
import { User } from "./models/User";

import { firebase } from "../../firebase";

class Store {
  @observable
  user: User;

  @action.bound
  async authenticateUserWithEmail(email, senha) {
    try {
      let request = await AuthenticationService.authenticateUser(email, senha);

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
}

export const AuthenticationStore = new Store();
