# pie.ng
[![pipeline status](http://code.pie.ng/root/PieNG/badges/master/pipeline.svg)](http://code.pie.ng/root/PieNG/commits/master)
[![coverage report](http://code.pie.ng/root/PieNG/badges/master/coverage.svg)](http://code.pie.ng/root/PieNG/commits/master)

## Development
```shell
npm run dev
export DATABASE_URL=mysql:root:xxx@localhost:3600/db && npm run dev:seed:db
```


## Testing & Seeding
```shell
export DATABASE_URL=mysql:root:xxx@localhost:3600/db && export NODE_ENV=test && npm run test
```
