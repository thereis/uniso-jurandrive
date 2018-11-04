import { firebase, firestore } from "../../firebase";
import { User } from "../authentication/models/User";

class Service {
  // handle user authentication
  async authenticateUser(email, senha) {
    try {
      let request = await firebase
        .auth()
        .signInWithEmailAndPassword(email, senha);

      if (request.user) {
        return await this.fetchFromUsers(request.user.uid);
      }
    } catch (e) {
      window.alert(e.message);
    }
  }

  async fetchFromUsers(id) {
    try {
      let request = await firestore
        .collection("users")
        .where("uid", "==", id)
        .limit(1)
        .get();

      let data = request.docs[0].data();

      return new User(
        id,
        data.ra,
        data.nome,
        data.email,
        data.sexo,
        data.dataNascimento.toDate()
      );
    } catch (e) {
      window.alert(e.message);
    }
  }

  /**
   * Register
   */
  async checkIfEmailExists(email: string) {
    return await firebase.auth().fetchSignInMethodsForEmail(email);
  }

  async checkIfRAExists(ra: string) {
    let query = await firebase
      .firestore()
      .collection("users")
      .doc(ra)
      .get();

    return query.exists;
  }

  async registerNewUser(
    name: string,
    ra: string,
    gender: "M" | "F",
    email: string,
    password: string
  ) {
    try {
      let request = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      let newUser = new User(
        request.user.uid,
        ra,
        name,
        email,
        gender,
        new Date()
      );

      await this.addToFirestore(newUser);
    } catch (e) {
      console.log(e);
    }
  }

  async addToFirestore(user: User) {
    try {
      console.log("user: ", user);
      return await firestore
        .collection("users")
        .doc(user.ra)
        .set({ ...user });
    } catch (e) {
      console.log("e: ", e);
    }
  }
}

export const AuthenticationService = new Service();
