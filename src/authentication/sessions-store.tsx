
export class SessionStore {
  authenticated = false;
  username = '';
  group = '';

  login(username: string, group: string) {
    this.authenticated = true;
    this.username = username;
    this.group = group;
  }

  logout() {
    this.authenticated = false;
    this.username = '';
  }

  isAdmin() {
    return this.group === 'admin';
  }

  isUser() {
    return this.group === 'user';
  }

}

export const sessionStore = new SessionStore();