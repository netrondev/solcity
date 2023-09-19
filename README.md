# SOLCITY

Install surrealdb: https://surrealdb.com/install

```sh
# Run from the same folder:
surreal start -A --auth --user root --pass root file://main.db
```

```sh
surreal sql --endpoint http://localhost:8000 --username root --password YoURS3CR3T --namespace solcitydev --database solcitydev --pretty
```
