# Orders Rest API

A serverless REST API for managing orders in a storefront system.

### Prerequisites

node.js 14 - https://github.com/nvm-sh/nvm

### Development

Install dependencies
```
npm i
```

running tests
```
npm test
```

### TODO

- [ ] authentication
- [ ] update postman tests 
- [ ] add tests in `test/auth/token-verification.test.ts`
- [ ] remove `src/auth/token-verification.test.ts` entry in test exclusions
- [x] hook up dynamo streams
- [x] add `PATCH /orders/{id}`
- [x] add `status` to `Order` model
- [x] hook up SQS
- [x] rename this repo to `orders-api`
- [ ] add endpoint documentation in README
- [ ] add more description of the system
- [ ] update and provide arch diagrams
- [ ] add dlq/monitoring for 500 errors
- [ ] add dlq/monitoring for dynamo stream processing errors
- [ ] add dynamo read validation (search `//TODO` in code)
