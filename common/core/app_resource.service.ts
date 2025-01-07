// import { ModuleRef } from '@nestjs/core';
// import { InternalServerErrorException } from '@nestjs/common';
// import { LRUCache } from 'lru-cache';
// import process from 'node:process';
//
// export default class AppResourceService {
//    #connection_pool = new LRUCache({
//       max: +process.env['MONGO_POOL_MAX_CONNECTIONS'],
//       ttl: +process.env['MONGO_POOL_MAX_TTL'],
//       updateAgeOnGet: true,
//       dispose: (connection: Connection) => connection.close(),
//    });
//
//    static getRef = () => this.#moduleRef;
//
//    protected static setRef(ref: ModuleRef) {
//       if (this.#moduleRef) throw new InternalServerErrorException('Already initialized module ref');
//       this.#moduleRef = ref;
//    }
// }
