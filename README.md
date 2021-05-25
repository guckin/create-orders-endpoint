# Create Orders Endpoint

Endpoint responsible for creating order resources

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
- [ ] add `PATCH /orders/{id}`
- [ ] add `status` to `Order` model
- [ ] hook up SQS
- [ ] rename this repo to `orders-api`
- [ ] add dlq/monitoring for 500 errors
- [ ] add dlq/monitoring for dynamo stream processing errors
- [ ] add dynamo read validation (search `//TODO` in code)
