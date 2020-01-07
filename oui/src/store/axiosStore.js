import { observable, action, computed, autorun, decorate} from 'mobx';
import axios from 'axios';
import https from 'https'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
class axiosStore {
  url = 'http://127.0.0.1:8000';
  token = '';
  master_password = '';

  instance = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    // httpsAgent: new https.Agent({
    //   rejectUnauthorized: false,
    // }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Osmedeus foo',
    },
  });

  constructor() {
    autorun(() => {
      let url = window.localStorage.getItem('url');
      if (!url) {
        url = window.location.origin;
      }
      this.url = url;

      this.instance.defaults.baseURL = url;
      // get the token
      const token = 'Osmedeus ' + window.localStorage.getItem('jwt');
      this.token = 'Osmedeus ' + window.localStorage.getItem('jwt');
      this.mpassword = window.localStorage.getItem('mpassword');
      this.instance.defaults.headers['Authorization'] = token;
    });
  }

  setJWT = jwt => {
    const token = 'Osmedeus ' + jwt;
    window.localStorage.setItem('jwt', jwt);
    this.instance.defaults.headers['Authorization'] = token;
  };

  setMPassword = mpassword => {
    window.localStorage.setItem('mpassword', mpassword);
  };

  setURL = url => {
    const origin = new URL(url).origin;
    // console.log(origin);
    this.url = origin;
    // console.log(this.url)
    window.localStorage.setItem('url', origin);
    this.instance.defaults.baseURL = origin;
  };

  get checkLogin() {
    return this.isLogged;
  }
}

decorate(axiosStore, {
  url: observable,
  instance: observable,

  setJWT: action,
  setURL: action,
  setMPassword: action,
  checkLogin: computed,
});

export default new axiosStore();
