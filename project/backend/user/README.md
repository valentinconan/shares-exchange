# User module

This module manage users and validate authentication

Create user

> curl -H "Content-type: application/json" --data '{"firstName":"Doe","lastName":"John","login":"jdoe", "rights":[{"name":"ADMIN"}]}' http://localhost:3000/user

Login and get token

> curl -H "Content-type: application/json" --data '{"login":"jdoe", "password":"default"}' http://localhost:3000/login

Validate token

> curl -H 'Content-type: application/json' --data '{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqZG9lIiwiaWF0IjoxNzA1NzA0NjYyLCJleHAiOjE3MDU3MJ9.qNzf2WY7npI72RyMvwO5BMZVmS8wZyrNn_FdhaBi-dc"}' http://localhost:3000/validate-token

Retrieve user rights

> curl http://localhost:3000/user/rights/jdoe4