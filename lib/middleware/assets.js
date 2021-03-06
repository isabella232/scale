var express = require('express');
var stylus = require('stylus');
var path = require('path');

module.exports = function(app) {

  // Stylus
  function compile(str, path) {
    return stylus(str)
      .set('compress', app.config.stylus_compress)
      .set('filename', path);
  }

  var styles = stylus.middleware({
    src: path.join(__dirname, '/../../shared'),
    dest: path.join(__dirname, '/../../public'),
    debug: app.config.stylus_debug,
    compile: compile,
    force: app.config.stylus_force
  });

  // Static files
  var staticFiles = express['static'](path.join(__dirname, '../../public'));

  app.use(styles);             // css
  app.use(staticFiles);        // 'public'
  app.use(function(req,res,next) {
    var url_pieces = req.url.split("/");
    
    if (url_pieces[1] === "component") {

      var fs = require('fs'),
          component = url_pieces[2],
          component_path = app.root_dir+'/components/' + component,
          file_path = component_path+"/public/" +url_pieces.slice(3).join("/");

      if (fs.existsSync(file_path)) {
        res.sendfile(file_path);
      }
      else return next();
    }

    else return next();
  });

};