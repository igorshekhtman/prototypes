/**
 * Created by rezaalemy on 6/30/15.
 */
var redis=require("redis"),
    q=require("q");

function Redis(client) {
    this.redisPromise = function (cmd) {
        var args = Array.prototype.slice.call(arguments, 1),
            p = makePromise(args.pop());
        args.push(p.cb);
        client[cmd].apply(client, args);
        return p.promise;

        function makePromise(extra) {
            extra.status = extra.status || "fail";
            var defer = q.defer();
            return {
                promise: defer.promise,
                cb: function (err, result) {
                    if (err)
                        return defer.reject({err: err, extra: extra});
                    defer.resolve(result);
                }
            }
        }
    };
}

Redis.prototype = {
    swapMember:function(source,target){
        return this.redisPromise("rpoplpush",source,target,{
            message:"failed to pop right and push left",
            source:source,
            target:target
        })
    },
    getListLength: function (key) {
        return this.redisPromise("llen", key, {
            message: "failed get length of collection",
            key: key
        });
    },
    getAllSetKeys:function(col){
        return this.redisPromise("hkeys",col,{
            message:"Failed to get keys of hash set",
            collection:col
        });
    },
    getAllListKeys: function (col) {
        return this.redisPromise("lrange", col, 0, -1, {
            message: "Failed to read collection",
            collection: col
        });
    },
    getItemFromSet: function (list, hash) {
        return this.redisPromise("hget", list, hash, {
            message: "Failed to get key from set",
            set: list,
            key: hash
        });
    },
    putItemInSet: function (list, item, hash) {
        return this.redisPromise("hset", list, hash, item, {
            message: "Failed to set item as hash in set",
            set: list,
            key: hash,
            item: item
        });
    },
    putItemInList: function (list, item) {
        return this.redisPromise("lpush", list, item, {
            message: "Failed to push item to list",
            list: list,
            item: item
        });
    },
    removeItemFromSet: function (list, hash) {
        return this.redisPromise("hdel", list, hash, {
            message: "Failed to remove item from key",
            set: list,
            key: hash
        });
    },
    removeItemFromList: function (list, item, count) {
        return this.redisPromise("lrem", list, count || 0, item, {
            message: "Failed to remove item from list",
            list: list,
            item: item
        });
    },
    removeKey: function (key) {
        return this.redisPromise("del", key, {
            message: "Failed to remove key from db",
            key: key
        })
    },
    getListCount: function (Set) {
        return this.redisPromise("llen", Set, {
            message: "Can't get length of set",
            set: Set
        });
    },
    getHashCount: function (Set) {
        return this.redisPromise("hlen", Set, {
            message: "Can't get length of set",
            set: Set
        });
    }
};

module.exports = {
    connect:function(host,port,options){
        var defer= q.defer(),
            client=redis.createClient(port,host,options);
        client.on("connect",function(){
            defer.resolve(client);
        });
        client.on("error",function(err){
            defer.reject(err);
        });
        return defer.promise;
    },
    initialize:function(client){
        return new Redis(client);
    }
};
