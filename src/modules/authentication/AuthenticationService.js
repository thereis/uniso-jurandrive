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
}

export const AuthenticationService = new Service();
