import NodeCache from "node-cache";

const cache = new NodeCache({
  stdTTL: 3600,      // ✅ 1 hour = 3600 seconds
  checkperiod: 600,  // clean every 10 minutes
});

export default cache;
