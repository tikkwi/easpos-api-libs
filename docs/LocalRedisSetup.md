## Redis Setup

---

- `docker volume create redis-data` *create volume*
- `docker run -d --name redis -v redis-data:/data -v $(pwd)/redis.conf:/usr/local/etc/redis/redis.conf -p 6379:6379 redis:latest`
  *run redis image*
- `docker exec -it redis redis-cli` *go inside redis-cli from image*
- `ACL SETUSER $username on >$password ~* +@all` *create new user*
- `ACL SETUSER default off` *turn off default user permissions*

## Redis Persistence (AOF - Append Only File)

---

- `redis-cli CONFIG SET appendonly yes` _enable aof_
- `redis-cli CONFIG SET auto-aof-rewrite-percentage 100` _trigger an AOF rewrite when the AOF file is at least 100%
  larger than it was after the last rewrite_
- `redis-cli CONFIG SET auto-aof-rewrite-min-size 64mb` _The minimum size for triggering a rewrite is 64 MB_

## What is AOF Rewrite

---

### Understanding AOF Rewrite

When the AOF file grows too large (based on the configured rewrite policies), Redis triggers an **AOF rewrite**. Here's
how it works:

1. **AOF Rewrite Process:**

- Redis creates a new, more compact AOF file by only writing the current state of the dataset as a sequence of commands,
  instead of every single write operation since the start.
- The rewrite operation is performed in the background, meaning Redis continues to serve clients without interruption.
- While the rewrite is happening, Redis continues to append new write operations to the original AOF file to ensure no
  data is lost.

2. **Merging the New and Old AOF Files:**

- After the rewrite completes, Redis merges the new AOF file with the data that was written during the rewrite process.
- The old, large AOF file is then replaced with the new, optimized one.

3. **Data Integrity:**

- Throughout this process, data integrity is maintained. Redis ensures that all commands are captured, so no data is
  lost.
- The new AOF file is an accurate and complete representation of the current dataset.

### Key Points

- **No Data Loss:** The rewrite process is safe and does not result in any data loss. The new AOF file still contains
  all the data, just in a more efficient format.
- **Performance Optimization:** AOF rewrite helps reduce the size of the AOF file, making Redis start faster and use
  less disk space.
- **Automatic and Manual Triggers:** You can configure Redis to automatically trigger an AOF rewrite when certain
  conditions are met, or you can manually trigger it using the `BGREWRITEAOF` command.

### Summary

- **AOF Rewrite does NOT cause data loss.**
- It compacts the AOF file while maintaining all the data.
- Redis handles the rewrite process safely and in the background to ensure continuous operation.

## Then why not optimized file on the first place

---

Redis uses the AOF (Append-Only File) approach with an emphasis on ensuring data durability rather than optimizing
storage space from the outset. Here's why Redis doesn't optimize the AOF file initially and why it eventually performs
an AOF rewrite:

### 1. **Focus on Data Durability and Speed:**

- **Initial AOF Writing:** When Redis writes to the AOF file, it logs every write operation (like `SET`, `DEL`, etc.) as
  it happens. This approach ensures that all data changes are immediately recorded on disk, providing strong data
  durability.
- **Non-Blocking Writes:** Writing each operation sequentially to the AOF file is quick and does not block the Redis
  server, allowing Redis to maintain high performance and low latency for client operations.

### 2. **Why Not Optimize Initially?**

- **Performance Overhead:** Optimizing the AOF file while recording each operation would introduce additional
  computational overhead, potentially slowing down Redis. The focus during normal operation is on speed and ensuring
  that all changes are logged immediately.
- **Complexity:** Optimizing the file in real-time as each command is processed would complicate the Redis server’s
  internals, potentially leading to performance issues or bugs.
- **Data Integrity:** Immediate optimization could risk data integrity if not done correctly. The simple approach of
  appending each command ensures that Redis can always recover the exact sequence of operations that led to the current
  state.

### 3. **AOF Rewrite as a Controlled Optimization:**

- **Background Process:** Redis performs the AOF rewrite in the background, which means it can optimize the file without
  affecting the server's responsiveness. This approach ensures that Redis can continue serving requests without
  interruption.
- **File Compaction:** The rewrite process compacts the AOF file by removing redundant operations and storing the
  minimal set of commands needed to recreate the current dataset. For example, if a key has been set multiple times,
  only the final `SET` command needs to be saved.
- **Efficiency:** The rewrite results in a more compact and efficient AOF file, which reduces disk space usage and
  speeds up the recovery process if Redis needs to restart.

### 4. **Trade-offs:**

- **Initial File Growth:** The trade-off is that the AOF file grows larger over time until a rewrite is triggered.
  However, this approach allows Redis to maintain its high performance and data safety during regular operations.
- **Scheduled Optimization:** The AOF rewrite is a scheduled optimization that happens when needed (based on your
  configuration), allowing Redis to manage the balance between performance and file size.

### Summary

- **Immediate Write Strategy:** Redis prioritizes durability and performance by logging every operation to the AOF file
  without initial optimization.
- **AOF Rewrite:** Optimization occurs during a controlled rewrite process, which compacts the AOF file while preserving
  data integrity and minimizing impact on performance.
- **Best of Both Worlds:** This strategy allows Redis to be both fast and efficient, ensuring data safety while managing
  disk usage through periodic optimization.