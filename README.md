# sales_manage
Web Application to manage sales, written by NodeJs, Express.js, React.js.
Use gulp to build app,

##Installation on Ubuntu

###Clone project from github:

$ git clone https://github.com/xuantain/sales-manage.git

Change current directory to sales-manage:

$ cd sales-manage

###Install dependencies:

$ npm install

###Run Service Mongodb

$ mongod --dbpath ~/the-path-of-project/sales-manage/data
$ mongod

###Run sales-manage by using command-line:

$ npm start

###Build project

$ gulp

File build locate at /public/javascripts/build/app.js


Start web browser and open address http://localhost:3000/.
