HTTP service using Node.js & Mysql

Create an HTTP service written in NodeJS that exposes CRUD operations for two objects: user and photo.  These objects should be modeled and stored in a datastore of your choice. (I'm using MYSQL)  The fields for these models are:


user
- id
- name

photo
- id
- user_id
- url

## Installation

	npm install


## Main  

	server.js

## Configuration (database)

        host: 'localhost',
        user: 'root',
        password : 'maddy',
        port : 3306, //port mysql
        database:'project'	


