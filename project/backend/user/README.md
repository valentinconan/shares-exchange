# User module

This module manage users and validate authentication

## prerequisites
In order to build properly, node version 18.16 is required

## How to build

Use the `build.sh` script at the root of the project. A help option is available using `-h` 
For example, build the project and the native image, skipping tests. See help for more details 
> bash build.sh -ns

## Some usefull curl
Create user

> curl -H "Content-type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqZG9lIiwiaWF0IjoxNzA1NzA0NjYyLCJleHAiOjE3MDU3MJ9.qNzf2WY7npI72RyMvwO5BMZVmS8wZyrNn_FdhaBi-dc" --data '{"firstName":"Doe","lastName":"John","login":"jdoe", "rights":[{"name":"ADMIN"}]}' http://localhost:3000/user

Login and get token

> curl -H "Content-type: application/json" --data '{"login":"jdoe", "password":"default"}' http://localhost:3000/login

Validate token

> curl -H 'Content-type: application/json' --data '{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqZG9lIiwiaWF0IjoxNzA1NzA0NjYyLCJleHAiOjE3MDU3MJ9.qNzf2WY7npI72RyMvwO5BMZVmS8wZyrNn_FdhaBi-dc"}' http://localhost:3000/validate-token

Retrieve user rights

> curl "Content-type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqZG9lIiwiaWF0IjoxNzA1NzA0NjYyLCJleHAiOjE3MDU3MJ9.qNzf2WY7npI72RyMvwO5BMZVmS8wZyrNn_FdhaBi-dc" http://localhost:3000/user/rights/admin