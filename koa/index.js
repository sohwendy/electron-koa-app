const koa = require('koa');
const router = require('koa-router')();
const render = require('koa-ejs');
const serve = require('koa-static');
const path = require('path');
const fs = require('co-fs');
//const formidable = require('koa-formidable');
const body = require('koa-body')({ multipart: true,  uploadDir: path.join(__dirname, 'uploads'), keepExtensions: true });
const koaApp = koa();

// koaApp.use(body);
koaApp.use(serve('public'));

render(koaApp, {
  root: path.join(__dirname, 'views'),
  layout: 'layout',
  viewExt: 'html',
  cache: false,
  debug: true
});

var defaultDevice = {
  id: '',
  name: '',
  brand: '',
  model: '',
  os: '',
  users: [],
  date: '',
  file: { path: ''}
}

var devices =
  [{
    id: 0,
    name: 'name 1',
    brand: 'apple',
    model: 'model',
    os: 'ios',
    users: ['demo', 'project'],
    date: '25 Sept 2016'
  }, {
    id: 1,
    name: 'name 2',
    brand: 'lg',
    model: 'model 2',
    os: 'android',
    users: ['demo', 'project'],
    date: '26 Sept 2016'
  }];

const OS =
  [{
    label: 'Android',
    value: 'android'
  }, {
    label: 'iOS',
    value: 'ios'
  }, {
    label: 'Other OS',
    value: 'others'
  }];

const USERS =
  [{
    label: 'Usability Lab',
    value: 'ux'
  }, {
    label: 'Showcase',
    value: 'demo'
  }, {
    label: 'Project',
    value: 'project'
  }];

const BRANDS =
  [{
    label: 'Apple',
    value: 'apple'
  }, {
    label: 'LG',
    value: 'lg'
  }, {
    label: 'Samsung',
    value: 'samsung'
  }];

DISPLAY = {
  os: OS,
  users: USERS,
  brand: BRANDS
};


router
  .get('/devices',
    function *(next) {
      yield this.render("main", { devices: devices, display: DISPLAY });
    })
  .get('/devices/:id',
    function *(next) {
      console.log('id');
      this.id = this.params.id;
      yield next;
    },
    function *(next) {
      yield this.render("device", { device: devices[this.id], display: DISPLAY });
    })
  .get('/devices/:id/edit',
    function *(next) {
      this.id = this.params.id;
      yield next;
    },
    function *(next) {
      yield this.render("form", { device: devices[this.id], display: DISPLAY });
    })
  .get('/devices/new',
    function *(next) {
      yield this.render("form", { device: defaultDevice, display: DISPLAY});
    })
  .post('/devices/create',
    body,
    processFile,
    function *(next) {
      requestBody = this.request.body;
      // var photo = requestBody.files.photo;
      // if (photo.size > 0) {
      //   yield fs.rename(photo.path, path.join(__dirname, 'uploads', photo.name))
      // }

      var id = devices.length;
      var device = { id: id, file: this.file };
      //var device = { id: id, file: { path: path.join(__dirname, 'uploads', photo.name) } };
      device = Object.assign(device, requestBody.fields);
      Array.isArray(device) ? device.users = [device.users] : null;

      devices.push(device);

      console.log(devices);
      yield this.render("device", { device: devices[id], display: DISPLAY });
    });




function *processFile(next) {

  console.log(this.request.body);

  var photo = this.request.body.files.photo;
  if (photo.size > 0) {
    yield fs.rename(photo.path, path.join(__dirname, 'uploads', photo.name))
  }
  this.file = { path: path.join(__dirname, 'uploads', photo.name) };

}

koaApp.use(router.routes());

koaApp.listen(5000);
