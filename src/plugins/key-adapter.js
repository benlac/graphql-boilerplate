import { KeyvAdapter } from "@apollo/utils.keyvadapter";
import RedisCollector from "./redis-collector.js";

export class MyKeyvAdapter extends KeyvAdapter {
  constructor(keyv) {
    super(keyv);
  }

  async get(key) {
    RedisCollector.addGetInfos({
      cacheId: key,
    });
    return super.get(key);
  }

  async set(key, value, options) {
    const { ttl } = { ...this.defaultSetOptions, ...options };

    RedisCollector.addSetInfos({
      cacheId: key,
      ttl,
    });

    return super.set(key, value, options);
  }
}
