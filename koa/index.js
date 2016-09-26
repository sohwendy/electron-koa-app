const koa = require('koa');
const router = require('koa-router')();
const render = require('koa-ejs');
const serve = require('koa-static');
const path = require('path');
const fs = require('co-fs');
const $ = require('jQuery');
const formidable = require('koa-formidable')
const koaApp = koa();


koaApp.use(serve('public'));

render(koaApp, {
  root: path.join(__dirname, 'views'),
  layout: 'layout',
  viewExt: 'html',
  cache: false,
  debug: true
});

// const defaultdevice = {
//   users: []
// };

var devices =
  [{
    name: 'name',
    brand: 'brand',
    model: 'model',
    os: 'os',
    users: ['Showcase', 'Project'],
    date: '25 Sept 2016'
  }, {
    name: 'name 2',
    brand: 'brand 2',
    model: 'model 2',
    os: 'os 2',
    users: ['Showcase', 'Project'],
    date: '26 Sept 2016'
  }];


router
  .get('/devices',
    function *(next) {
      yield this.render("main", { devices: devices });
    })
  .get('/devices/:id',
    function *(next) {
      console.log('id');
      this.id = this.params.id;
      yield next;
    },
    function *hello(next) {
      yield this.render("device", { device: devices[this.id] });
    })
  .get('/devices/new',
    function *(next) {
      console.log('fffffff');
      yield this.render("form");
    })
  .post('/devices/create',
    function *(next) {
      const options = { uploadDir: path.join(__dirname, 'uploads'), keepExtensions: true };

      const form = yield formidable.parse(options, this);

      var file = form.files.photo;
      var image = yield fs.rename(file.path, path.join(__dirname, 'uploads', file.name));

      // devices.push(Object.assign({}, defaultdevice, form.fields));
      // console.log('======================================================');
      console.log(image);

      // devices.push(form.fields);
      // console.log(devices);
    })
  ;

koaApp.use(router.routes());

koaApp.listen(5000);
