
export interface IUserParams {
  rnsName?: string | null;
}

export default class User {
  public rnsName?: string | null;
  public host?: string | null;
  public port?: number | null;

  constructor({ rnsName}: IUserParams) {
    this.rnsName = rnsName;
    this.port = 80;
  }
}
