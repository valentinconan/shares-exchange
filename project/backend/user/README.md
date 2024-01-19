# User module

This module manage users and validate authentication

```
curl -H "Content-type: application/json" --data '{"firstName":"Doe","lastName":"John","login":"jdoe"}' http://localhost:3000/user

curl -H "Content-type: application/json" --data '{"login":"jdoe", "password":"default"}' http://localhost:3000/login

curl -H 'Content-type: application/json' --data '{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqZG9lIiwiaWF0IjoxNzA1NzA0NjYyLCJleHAiOjE3MDU3MJ9.qNzf2WY7npI72RyMvwO5BMZVmS8wZyrNn_FdhaBi-dc"}' http://localhost:3000/validate-token
```
