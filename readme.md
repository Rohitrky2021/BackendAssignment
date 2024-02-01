# OpenInApp Backend Task

Welcome to the OpenInApp Backend Task repository! This project is designed to meet the requirements of the openinapp backend assignment by employing a variety of technologies and solutions.

## 🛠️ Technology Stack

Our backend is built using Node.js and Express.js, providing a robust and scalable foundation for handling various tasks. We rely on MySQL for our database needs, ensuring data integrity and efficiency. To facilitate communication, we utilize Twilio's powerful calling service.

## 🔧 Environment Configuration

To ensure smooth operation of the project, you must set up several environment variables in your .env.development file. These variables include configurations for database connection, security settings, and service endpoints. You can reference the provided .env.example file for guidance on configuring these variables according to your environment.

## 🚀 Local Setup

To run the project locally, follow these steps:

### Clone the repository to your local machine using the following command:

```bash
   git clone https://github.com/Rohitrky2021/BackendAssignment.git  
```

### Navigate to the project directory:

```bash 
    cd openinapp-backend

```

### Install project dependencies by running:

```bash 
npm install
```

## Install Sequelize-cli globally to manage database

```bash 
npm install -g sequelize-cli

npm i win-node-env
set NODE_ENV=development 
npx sequelize-cli db:create

```

### migrations and seeders:
 
```bash  
npm run db:migrate:up
``` 

### API Routes Urls

## 1.CreaterUser

```bash  
localhost:8080/v1/user/
 ``` 

## 2.Login

```bash  
localhost:8080/v1/auth/
 ``` 
 
## 3. Create And Get Task

```bash  
localhost:8080/v1/task/get_all_tasks/

localhost:8080/v1/sub_task/get_all_sub_tasks/:1

localhost:8080/v1/sub_task/create/1

localhost:8080/v1/task/create
 ``` 

## 4.Crons Twilio CAlling 

```bash  
localhost:8080/v1/call/
 ``` 

## 5. Updates And Delete 

```bash  
localhost:8080/v1/task/upd/1

localhost:8080/v1/sub_task/upd/6

localhost:8080/v1/sub_task/del/8
 ``` 


## For TWilio Setup 

```bash 
 https://www.twilio.com/docs/voice/make-calls?_gl=1*ijlhzm*_ga*Njg5OTMxNjA4LjE3MDY2MTU2MjY.*_ga_RRP8K4M4F3*MTcwNjc4NDMzNS42LjEuMTcwNjc4NDM5NS4wLjAuMA..
 ``` 

 ##  ThankYou!