const env = require('./environment');
const fs = require('fs');
const path = require('path');

module.exports = (app) => {
    app.locals.assetPath = function(filePath){
        if (env.name == 'development'){
            console.log('development', filePath);
            return '/' + filePath;
        }

        else{
            console.log('production', JSON.parse(fs.readFileSync(path.join(__dirname, '../public/assets/rev-manifest.json')))[filePath]);
            return '/' + JSON.parse(fs.readFileSync(path.join(__dirname, '../public/assets/rev-manifest.json')))[filePath];
        }
    }
}