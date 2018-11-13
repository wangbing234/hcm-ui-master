const {
  map200Data,
} = require('./utils');

const AUTH = {
  ADMIN: 1,
  USER: 2,
  GUEST: 3,
};

const getMenus = {
  organizations: {
    show: [AUTH.ADMIN, AUTH.USER, AUTH.GUEST],
    view: [AUTH.ADMIN, AUTH.USER, AUTH.GUEST],
    write: [AUTH.ADMIN],
  },
  companies: {
    show: [AUTH.ADMIN, AUTH.USER],
    view: [AUTH.ADMIN],
    write: [AUTH.ADMIN],
  },
  setting: {
    show: [AUTH.ADMIN, AUTH.USER, AUTH.GUEST],
    view: [AUTH.ADMIN, AUTH.USER, AUTH.GUEST],
    write: [AUTH.ADMIN, AUTH.USER, AUTH.GUEST],
  },
};

const loginData =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHQiOjE1MzE5MDI3ODc1OTYsImRhdGEiOiJ7XCJpZFwiOjEsXCJ0ZW5hbnROYW1lXCI6XCIyYmYxOTQ4NlwifSIsImlhdCI6MTUzMTI5Nzk4NzU5Nn0.Ix4g4x_NKuKxVWF_lrSOjBKH3ZqIwTAnii1Wzn02DwA';


const userData = {
  "id": 1,
  "name": "leo",
  "avatar": "batman.png",
  "superAdmin": true,
  "tel" : 12345678901,
};

module.exports = (app) => {
  app.get('/api/menus', (req, res) => {
    res.send(map200Data(getMenus));
  });
  app.post('/api/user/login/password', (req, res) => {
    res.send(map200Data(loginData));
  });
  app.post('/api/user/getCaptcha', (req, res) => {
    res.send(map200Data());
  });
  app.get('/api/employees/me', (req, res) => {
    res.send(map200Data(userData));
  });
  app.post('/api/upload/', (req, res) => {
    res.send({
      fileId: Math.random(),
      filename: 'filename.txt',
      filepath: 'uploads/filename.txt',
    });
  });
}
