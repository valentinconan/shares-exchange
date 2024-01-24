# SHARES-EXCHANGE

Share exchange allows all employees to view, buy or sell shares.


## prerequisites
In order to build properly, node version 18.16 is required

## How to use it ?

In order to build project, launch the utility script `build.sh` using bash.

This will build all the applications under the `project` folder and generate a `package` one. 

In this folder, launch the utility script `run.sh` 

## Features

Some of the main features implemented : 

- create user with rights
- consult all users
- consult a specific user
- consult user rights
- login and get a jwt token
- validate token
- buy new shares
- sell new shares
- view transactions history
- consult wallet
- consult shares
- create a new share


## Technical details

### Technical stack

Frontend : Not implemented Yet

Backend : NodeJS (Nest.js)

Delivery : Docker images

Database : postgres

### Security

To manage security access, all critical routes are protected by several guards.

A jwt token must be requested via the login controller and will be used for future calls to validate authentication and authorization.

Role management is implemented to control user actions.

In a production context, it will be mandatory to install an SSL certificate to expose the application via the HTTPS protocol.

### exploit health endpoints

Some endpoints are deployed to indicate the state of the application. This will be useful for the orchestrator