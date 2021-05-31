# Orders Rest API

A serverless REST API for a storefront application.

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
- [x] hook up dynamo streams
- [x] add `PATCH /orders/{id}`
- [x] add `status` to `Order` model
- [ ] hook up SQS
- [ ] rename this repo to `orders-api`
- [ ] add endpoint documentation in README
- [ ] add dlq/monitoring for 500 errors
- [ ] add dlq/monitoring for dynamo stream processing errors
- [ ] add dynamo read validation (search `//TODO` in code)
