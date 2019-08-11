import { observable, action, computed, decorate } from 'mobx';

class sessStore {
  isLogged = false;
  // @NOTE enable login bypass for now
  // isLogged = true;

  setisLogged = () => {
    this.isLogged = true;
  };

  setLogout = () => {
    this.isLogged = false;
    window.localStorage.clear();
  };

  get checkLogin() {
    return this.isLogged;
  }
}

decorate(sessStore, {
  isLogged: observable,
  checkLogin: computed,
  setisLogged: action,
  setLogout: action,
});

export default new sessStore();