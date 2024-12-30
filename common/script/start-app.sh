#!/bin/bash
echo "Exporting env variables"
set -a
source .env
set +a

echo "Up Compose In Detach Mode"
docker-compose up -d

echo "Redis Setup"
sleep 5
docker exec -i -e REDIS_LCL_USR="$REDIS_LCL_USR" -e REDIS_LCL_PWD="$REDIS_LCL_PWD" redis redis-cli <<EOF
  ACL SETUSER $REDIS_LCL_USR on >$REDIS_LCL_PWD ~* +@all
  ACL SETUSER default off
  exit
EOF

echo "Mongo Cluster Setup...."
docker exec mongo1 mongosh --quiet --eval "rs.status().ok"
REPLICA_STATUS=$(docker exec mongo1 mongosh --quiet --eval "rs.status().ok")

if [ "$REPLICA_STATUS" != "1" ]; then
echo "Initializing MongoDB Replica Set..."
docker exec -i mongo1 mongosh <<EOF
  rs.initiate({
    _id: "rs0",
    members: [
      { _id: 0, host: "mongo1:27017" },
      { _id: 1, host: "mongo2:27018" },
      { _id: 2, host: "mongo3:27019" }
    ]
  })
  exit
EOF
else
  echo "Replica set already initiated."
fi

echo "Waiting for the replica set to be fully initiated and a primary to be elected..."
sleep 20

PRIMARY_NODE=$(docker exec mongo1 mongosh --quiet --eval "rs.isMaster().primary" | tr -d '\r')
echo "Primary node identified: $PRIMARY_NODE"

echo "Create Admin User"
docker exec -i -e MONGO_LCL_USR="$MONGO_LCL_USR" -e MONGO_LCL_PWD="$MONGO_LCL_PWD" "${PRIMARY_NODE%:*}" mongosh <<EOF
use admin
db.createUser({
  user: "$MONGO_LCL_USR",
  pwd: "$MONGO_LCL_PWD",
  roles: [ { role: "readWriteAnyDatabase", db: "admin" } ]
})
exit
EOF

#echo "Adding Host..."
#ENTRIES=(
#    "127.0.0.1  mongo1"
#    "127.0.0.1  mongo2"
#    "127.0.0.1  mongo3"
#)
#
## Loop through each entry and add it if it doesn't already exist
#for ENTRY in "${ENTRIES[@]}"; do
#    if ! grep -qF "$ENTRY" /etc/hosts; then
#        echo "Adding $ENTRY to /etc/hosts"
#        echo "$ENTRY" | sudo tee -a /etc/hosts
#    else
#        echo "$ENTRY already exists in /etc/hosts"
#    fi
#done

echo "App Started Successfully..."