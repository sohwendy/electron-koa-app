const koa = require('koa');
const router = require('koa-router')();
const render = require('koa-ejs');
const serve = require('koa-static');
const path = require('path');
const fs = require('fs-extra');
const body = require('koa-body')({ multipart: true,  uploadDir: path.join(__dirname, 'uploads'), keepExtensions: true });
const koaApp = koa();
const DISPLAY = require("./constants.js");
const uuid = require('uuid');

var publicPath = path.join(__dirname, 'public');
require('koa-validate')(koaApp);

koaApp.use(serve(publicPath));

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
};

var devices =
  [{
    id: "0",
    name: 'name 1',
    brand: 'apple',
    model: 'model',
    os: 'ios',
    users: ['demo', 'project'],
    date: '25 Sept 2016',
    file: {}
  }, {
    id: "1",
    name: 'name 2',
    brand: 'lg',
    model: 'model 2',
    os: 'android',
    users: ['demo', 'project'],
    date: '26 Sept 2016',
    file: {}
  }];


router
.get('/',
  function *(next) {
    devices = fs.readJsonSync(path.join(__dirname, 'data.json'), {throws: false});
    console.log(devices)
    this.redirect('/devices');
  })
.get('/devices',
  function *(next) {
    yield this.render("main", { devices: devices, display: DISPLAY });
  })
.get('/devices/new',
  function *(next) {
    yield this.render("new", { device: defaultDevice, display: DISPLAY });
  })
.get('/devices/:id',
  getId,
  function *(next) {
    var id = this.id;
    var device = devices.find(function(device){
      return device.id == id;
    });

    yield this.render("view", { device: device, display: DISPLAY });
  })
.get('/devices/:id/edit',
  getId,
  function *(next) {
    var id = this.id;
    var device = devices.find(function(device){
      return device.id == id;
    });
    yield this.render("edit", { device: device, display: DISPLAY });
  })
.get('/devices/:id/delete',
  getId,
  function *(next) {
    var id = this.id;
    devices = devices.filter(function(device) {
      return device.id != id;
    });
    this.redirect('/devices');
  })
.post('/devices/create',
  body,
  processData, validate, generateId, processFile, addDevice
)
.post('/devices/:id/update',
  body,
  getId,
  processData, validate, processFile, editDevice
);

function *processData(next) {
  var requestBody = this.request.body;
  Array.isArray(this.device) ? this.device.users = [this.device.users] : null;
  this.device = requestBody.fields;
  yield next
}

function *processFile(next) {
  var photo = this.request.body.files.photo;
  var filepath = path.join(__dirname, 'public', 'uploads', this.id, photo.name);

  if (photo.size > 0) {

    fs.move(photo.path, filepath,  {clobber: true}, function (err) {
      if (err) return console.error(err)
    })
    this.device = Object.assign(this.device, {
      file: {
        filename: photo.name,
        path: path.join('/uploads', this.id, photo.name)
      }});
  }
  else {
    this.device = Object.assign(this.device, { file: {} });
  }

  yield next
}

function *getId(next) {
  this.id = this.params.id;
  yield next;
}

function *generateId(next) {
  this.id = uuid.v4();
  yield next;
}

function *addDevice(next) {
  this.device.id = this.id;
  devices.push(this.device);

  this.redirect(`/devices/${this.id}`);
}

function *editDevice(next) {
  this.device.id = this.id;
  var d = this.device;
  devices = devices.map(function(device) {
    return device.id == d.id ? d : device;
  });
  this.redirect(`/devices/${this.id}`);
}

function *deleteDevice(next) {
  var index = devices.indexOf(function(device){
    device.id == id
  });
  devices.splice(index, 1);
  this.redirect('/devices');
}

function *validate(next) {
    this.checkBody('name').notEmpty().len(10, 15);
    this.checkFile('icon').suffixIn(['png', 'jpg', 'gif']);

    // console.log(this.errors);
    yield next
}

koaApp.use(router.routes());

koaApp.listen(5000);