// @flow
export class User {
  id: string;
  ra: string;
  nome: string;
  email: string;
  sexo: "M" | "F";
  dataNasc: Date;

  constructor(
    id: string,
    ra: string,
    nome: string,
    email: string,
    sexo: "M" | "F",
    dataNasc: Date
  ) {
    this.id = id;
    this.ra = ra;
    this.nome = nome;
    this.email = email;
    this.sexo = sexo;
    this.dataNasc = dataNasc;
  }
}
