// @flow
export class User {
  uid: string;
  ra: string;
  nome: string;
  email: string;
  sexo: "M" | "F";
  dataNascimento: Date;

  constructor(
    uid: string,
    ra: string,
    nome: string,
    email: string,
    sexo: "M" | "F",
    dataNascimento: Date
  ) {
    this.uid = uid;
    this.ra = ra;
    this.nome = nome;
    this.email = email;
    this.sexo = sexo;
    this.dataNascimento = dataNascimento;
  }
}
