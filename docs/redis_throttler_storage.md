``` 
local totalHits = redis.call("INCR", KEYS[1])
local timeToExpire = redis.call("PTTL", KEYS[1])
if timeToExpire <= 0
then
    redis.call("PEXPIRE", KEYS[1], tonumber(ARGV[1]))
    timeToExpire = tonumber(ARGV[1])
end
return { totalHits, timeToExpire }
`
.replace(/^\s+/gm, '')
.trim();
```

This script is a Lua script commonly used in Redis for handling rate limiting or throttling. The script performs the following operations:

1. **Increment a Key**: It increments the count associated with a specific key (presumably tracking hits or requests).
2. **Check and Set Expiration**: It checks the time-to-live (TTL) of the key and sets an expiration time if the key doesn't have one.
3. **Return the Results**: It returns the current count and the time remaining until the key expires.

### Explanation of the Script

Let's break down the Lua script step by step:

```lua
local totalHits = redis.call("INCR", KEYS[1])
```

- **redis.call**: Executes a Redis command from within the Lua script.
- **INCR**: Increments the integer value of a key by one. If the key does not exist, it is set to 0 before performing the increment operation.
- **KEYS[1]**: Refers to the first key passed to the script (typically a Redis key name).
- **totalHits**: Stores the incremented value (the new count).

```lua
local timeToExpire = redis.call("PTTL", KEYS[1])
```

- **PTTL**: Returns the remaining time to live of a key in milliseconds. If the key does not exist or has no associated expire, it returns -1.
- **timeToExpire**: Stores the time-to-live in milliseconds.

```lua
if timeToExpire <= 0 then
  redis.call("PEXPIRE", KEYS[1], tonumber(ARGV[1]))
  timeToExpire = tonumber(ARGV[1])
end
```

- **timeToExpire <= 0**: Checks if the key does not have an expiration set (or if it's a new key with no TTL).
- **PEXPIRE**: Sets a key's time-to-live in milliseconds. 
- **KEYS[1]**: The key whose TTL is being set.
- **ARGV[1]**: The first argument passed to the script (typically the TTL value in milliseconds).
- **tonumber(ARGV[1])**: Converts the argument to a number (as Lua treats all arguments as strings by default).
- **Sets the TTL**: If the key had no expiration, this sets it to the value of `ARGV[1]`.
- **Updates `timeToExpire`**: Sets the `timeToExpire` variable to the new TTL value in milliseconds.

```lua
return { totalHits, timeToExpire }
```

- **Returns**: A table (array) containing two values:
  - `totalHits`: The current count after incrementing.
  - `timeToExpire`: The time remaining until the key expires in milliseconds.

### Usage in Rate Limiting

In the context of rate limiting, this script would typically be used to:

1. **Count Requests**: Each call to the script increments the number of requests (or hits) tracked by the key.
2. **Set Expiration**: If the key is new or has expired, it sets an expiration time to start counting within a new time window.
3. **Return Results**: Provides the current count and the time remaining in the current window, which can be used to determine if the rate limit has been exceeded.

### Example Scenario

Assume we're implementing rate limiting where a user is allowed to make a certain number of requests in a fixed time window (e.g., 100 requests per minute):

1. **Increment Count**: Each time a user makes a request, the script increments a counter associated with their user ID.
2. **Check Expiration**: The script checks if the counter is new or expired.
3. **Set Expiration**: If the counter is new or expired, it sets a new TTL for the duration of the rate limit window (e.g., 60,000 milliseconds for one minute).
4. **Return Values**: The script returns the current number of requests made and the remaining time in the current window.

### Final Trimmed Script

The trimmed version of the Lua script without indentation is:

```lua
local totalHits = redis.call("INCR", KEYS[1])
local timeToExpire = redis.call("PTTL", KEYS[1])
if timeToExpire <= 0 then
  redis.call("PEXPIRE", KEYS[1], tonumber(ARGV[1]))
  timeToExpire = tonumber(ARGV[1])
end
return { totalHits, timeToExpire }
```

### Integrating with NestJS Throttler

This script can be integrated into a custom Redis-based rate limiting strategy in NestJS by invoking it from within your custom storage logic (as shown in the earlier example). The use of such a Lua script helps ensure atomicity and efficiency in managing rate limits.


### Why use lua over directly calling redis commands in sequence

Using a Lua script in Redis for operations like rate limiting, instead of directly calling Redis commands in sequence, has several significant advantages:

---

### Advantages of Using Lua Scripts in Redis

1. **Atomicity**:
   - **Problem with Sequential Calls**: When you issue multiple Redis commands sequentially from a client, each command is an independent operation. This can lead to race conditions in a concurrent environment where multiple clients are accessing and modifying the same key.
   - **Lua Script Solution**: Lua scripts are executed atomically by Redis. This means that all commands within the script are treated as a single, indivisible operation. Other clients will not see any intermediate states and the script will be executed in a single step, preventing race conditions.

2. **Efficiency**:
   - **Problem with Network Overhead**: Multiple round trips to Redis for each command can lead to significant network overhead and latency.
   - **Lua Script Solution**: By bundling multiple operations into a single Lua script, you reduce the number of round trips between your application and Redis. The script is sent to Redis and executed in one go, making it much more efficient for complex operations.

3. **Reduced Client-Side Complexity**:
   - **Problem with Complex Logic**: Implementing complex logic (like rate limiting) on the client side can be error-prone and lead to inconsistent states, especially under high concurrency.
   - **Lua Script Solution**: Encapsulating the logic within a Lua script simplifies the client-side code. The client just needs to call the script, and all the logic is handled server-side in a consistent and reliable manner.

4. **Consistency in Expiry Management**:
   - **Problem with Expiry Management**: Manually handling TTLs and increments in a distributed system can be tricky, as the state might change between commands.
   - **Lua Script Solution**: The script can handle increments and TTL checks/updates in a single operation, ensuring that these related operations are always performed together, maintaining consistency.

5. **Redis' Built-in Lua Scripting Support**:
   - **Ease of Use**: Redis natively supports Lua scripting, making it easy to integrate and use without requiring additional dependencies.
   - **Pre-optimized**: Redis optimizes the execution of Lua scripts and ensures that they run efficiently.

### Example Scenario: Rate Limiting

Consider implementing a rate limiter where each user is allowed a certain number of requests in a time window. If you were to use separate Redis commands without Lua scripting, your steps might look like this:

1. **Check if Key Exists**: See if there's an existing count for the user's request.
2. **Increment the Count**: If the key exists, increment the count.
3. **Set the TTL**: If the key does not exist, create it and set its TTL to define the time window.

If you try to do this using sequential Redis commands from a client:

```javascript
// Pseudo-code for sequential Redis operations
const totalHits = await redis.incr(key);
let timeToExpire = await redis.pttl(key);

if (timeToExpire <= 0) {
  await redis.pexpire(key, ttl);
  timeToExpire = ttl;
}

return { totalHits, timeToExpire };
```

In a high-concurrency scenario, between the `incr` and `pttl` commands, another client could modify the key, leading to inconsistent states.

With Lua scripting, the above logic can be bundled into a single atomic operation:

```lua
local totalHits = redis.call("INCR", KEYS[1])
local timeToExpire = redis.call("PTTL", KEYS[1])
if timeToExpire <= 0 then
  redis.call("PEXPIRE", KEYS[1], tonumber(ARGV[1]))
  timeToExpire = tonumber(ARGV[1])
end
return { totalHits, timeToExpire }
```

And from the client side, you just call the script with the necessary arguments:

```javascript
const result = await redis.eval(script, 1, key, ttl);
```

This encapsulates the logic within Redis, ensuring atomicity, consistency, and efficiency.

### Summary

- **Atomicity**: Ensures all operations in the script are completed without interference from other clients.
- **Efficiency**: Reduces network overhead by combining multiple commands into a single script execution.
- **Consistency**: Avoids potential race conditions and maintains consistent state.
- **Simplicity**: Simplifies client-side logic and leverages Redis' powerful scripting capabilities.

These benefits make Lua scripting in Redis a powerful tool for scenarios requiring complex, atomic operations like rate limiting, counters, or any multi-step process that needs to be executed as a single unit.