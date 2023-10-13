const axios = require('axios').default;
const Promise = require('bluebird');
const timeout = 30000;
const baseUrl = 'http://127.0.0.1:2268';

class Hidemyacc {
  constructor() {}

  async me() {
    return await this.#get(`${baseUrl}/me`);
  }

  async folders() {
    return await this.#get(`${baseUrl}/folders`);
  }

  async profiles() {
    return await this.#get(`${baseUrl}/profiles`);
  }

  async create(body) {
    return await this.#post(`${baseUrl}/profiles`, body);
  }

  async update(id, body) {
    return await this.#put(`${baseUrl}/profiles/${id}`, body);
  }

  async quick(body) {
    return await this.#post(`${baseUrl}/profiles/quick`, body);
  }

  async start(id) {
    return await this.#post(`${baseUrl}/profiles/start/${id}`);
  }

  async stop(id) {
    try {
      await this.#post(`${baseUrl}/profiles/stop/${id}`);
      return true;
    } catch (error) {
      return false;
    }
  }

  async delete(id) {
    return await this.#delete(`${baseUrl}/profiles/${id}`);
  }

  async #get(url) {
    try {
      return await new Promise((resolve, reject) => {
        axios
          .get(url, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          })
          .then((response) => resolve(response.data))
          .catch(reject);
      }).timeout(timeout);
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  async #post(url, body = {}) {
    try {
      return await new Promise((resolve, reject) => {
        axios
          .post(url, body, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          })
          .then((response) => resolve(response.data))
          .catch(reject);
      }).timeout(timeout);
    } catch (error) {
      // console.log(error);
    }
    return null;
  }

  async #put(url, body = {}) {
    try {
      return await new Promise((resolve, reject) => {
        axios
          .put(url, body, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          })
          .then((response) => resolve(response.data))
          .catch(reject);
      }).timeout(timeout);
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  async #delete(url, body = {}) {
    try {
      return await new Promise((resolve, reject) => {
        axios
          .delete(url, body, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          })
          .then((response) => resolve(response.data))
          .catch(reject);
      }).timeout(timeout);
    } catch (error) {
      // console.log(error);
    }
    return null;
  }
}

module.exports = Hidemyacc;
