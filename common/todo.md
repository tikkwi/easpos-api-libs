## GRPC

- [ ] rpc request's `ip` meta must be set by reverse proxy(nginx)
- [ ] check meta and request (`transform.guard`)
- [ ] we'll need to delete merchant dbs after a period of time
    - retention policy may differ (may delete after 1 month for demo user and 1 year for old user)

## Schedule Jobs

- [ ] check point balance every start of the month to downgrade tier
- [ ] sub end and send mail (sub end/pre sub end) to the merchants
- [ ] expire campaign and update adjustment as per this status