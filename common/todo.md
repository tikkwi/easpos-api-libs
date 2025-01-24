## Version Update

- [ ] check if redis-throttler-storage working properly
    - [ ] swagger working properly (`ApiProperty` in `AppProp`)

## GRPC

- [ ] rpc request's `ip` meta must be set by reverse proxy(nginx)
- [ ] check meta and request (`transform.guard`)
- [ ] we'll need to delete merchant dbs after a period of time
    - retention policy may differ (may delete after 1 month for demo user and 1 year for old user)

## Schema

- [ ] index fields for heavy query

## Schedule Jobs

- [ ] delete pending merchant's db after 1 month (but keep merchant to prevent misuses and give the chance to active
  after some time)
- [ ] delete pending product sale /sale after 15minute
- [ ] check point balance every start of the month to downgrade tier
- [ ] sub end and send mail (sub end/pre sub end) to the merchants
- [ ] update app subscription status wrt expire date
- [x] ~~update campaign/adjustment/promo_code status on expire date~~ (_no need scheduler, can do this on access_)
    - [x] ~~campaign's expire affect all campaign/adjustment/promo_code and adjustment expire affect only
      adjustment and promo_code~~

## Just Allow Temporarily

- `auth-credential/create`

## Admin App

- [ ] crud admin and authenticate admin routes

## To Check

- [ ] if Reflect is working properly in decorator(controller, service, etc)