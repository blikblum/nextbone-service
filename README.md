# Nextbone Service

Simple service class for Nextbone.

## Usage

> _**Note:** nextbone-service requires a global `Promise` object to
> exist, please include a `Promise` polyfill if necessary._

```js
import { Service } from 'nextbone-service';

class AuthService extends Service {
  start() {
    this.user = new User();
    return this.user.fetch();
  }

  static requests = {
    isAuthenticated: 'isAuthenticated',
    authenticate: 'authenticate'
  }

  isAuthenticated() {
    return this.user.get('isAuthenticated');
  }

  authenticate() {
    this.user.authenticate();
  }

  onError(err) {
    console.log('Err!', err);
  }
};

const authService = new AuthService();

class Page extends HTMLElement {
  connectedCallback () {
    this.render();
  }

  render() {
    authService.request('isAuthenticated').then(isAuthenticated => {
      if (isAuthenticated) {
        this.innerHTML = 'Welcome!';
        return;
      }

      this.innerHTML = 'Permission denied.'
      return authService.request('authenticate').then(() => this.render());
    }).catch(err => {
      this.innerHTML = 'Oh no!';
    });
  }
};

// Which would behave like you wrote all of this:

class Page extends HTMLElement {
  connectedCallback () {
    this.render();
  }

  render() {
    Promise.resolve()
      .then(() => {
        if (!authService.isStarted) {
          return authService.start().catch(err => {
            authService.onError(err);
            throw err;
          }))
        }
      })
      .then(() => authService.isAuthenticated().catch(err => {
        authService.onError(err);
        throw err;
      })))
      .then(isAuthenticated => {
        if (isAuthenticated) {
          this.innerHTML = 'Welcome!';
          return;
        }

        this.innerHTML = 'Permission denied.'
        return Promise.resolve()
          .then(() => authService.authenticate().catch(err => {
            authService.onError(err);
            throw err;
          }))
          .then(() => this.render());
        }
      }).catch(err => {
        this.innerHTML = 'Oh no!';
      });
  }
};
```

## Contibuting

### Getting Started

[Fork](https://help.github.com/articles/fork-a-repo/) and
[clone](http://git-scm.com/docs/git-clone) this repo.

```
git clone git@github.com:blikblum/nextbone-service.git && cd mextbone-service
```

Make sure [Node.js](http://nodejs.org/) and [npm](https://www.npmjs.org/) are
[installed](http://nodejs.org/download/).

```
npm install
```

### Running Tests

```
npm test
```

===

© 2015 James Kyle (original backbone.service)
© 2019 Luiz Américo. Distributed under ISC license.
