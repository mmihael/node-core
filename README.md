#Core node api

##Features
- Express framework
- RC config
- Mongoose
- JWT/cookie auth
- Mocha tests

##Usage

###Configurations

Configurations are loaded by rc module. 

By default application will look for .apprc

To change it set custom value to `NODE_ENV` variable.

``` 
$ NODE_ENV=test node index.js
```

In this case app will look for .testrc