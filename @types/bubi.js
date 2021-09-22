/** @global */
var Chain = {
    /**
     * 获取合约账号的metadata信息
     *
     * 权限：只读
     *
     * @example
     * let value = Chain.load('abc');
     *
     * @param {string} metadata_key metadata 的关键字
     * @returns {boolean | string} 成功返回字符串，如 'values', 失败返回false
     */
    load: (metadata_key) => {},
    /**
     * 存储合约账号的metadata信息
     *
     * 权限：可写
     *
     * @example
     * Chain.store('abc', 'values');
     *
     * @param {string} metadata_key metadata 的关键字
     * @param {string} metadata_key: metadata 的内容
     * @returns {boolean} 成功返回true, 失败抛异常
     */
    store: (metadata_key, metadata_value) => {},
    /**
     * 删除合约账号的metadata信息
     *
     * 权限：可写
     *
     * @example
     * Chain.del('abc');
     *
     * @param {string} metadata_key metadata 的关键字
     * @returns {boolean} 成功返回true, 失败抛异常
     */
    del: (metadata_key) => {},
    /**
     * 获取区块信息
     *
     * 权限：只读
     *
     * @example
     * let ledger = Chain.getBlockHash(4);
     *
     * @param {number} offset_seq 距离最后一个区块的偏移量，范围：[0,1024)
     * @returns {string | boolean} 成功返回字符串，如 'c2f6892eb934d56076a49f8b01aeb3f635df3d51aaed04ca521da3494451afb3'，失败返回 false
     */
    getBlockHash: (offset_seq) => {},
    /**
     * 输出交易日志
     *
     * 权限：可写
     * @example
     * Chain.tlog('transfer',sender +' transfer 1000',true);
     *
     * @param {string} topic 日志主题，必须为字符串类型,参数长度(0,128]
     * @argument args 最多可以包含5个参数，参数类型可以是字符串、数值或者布尔类型,每个参数长度(0,1024]
     * @returns {boolean} 成功返回 true，失败抛异常
     */
    tlog: (topic, ...args) => {},
    /**
     * 获取指定账号的metadata
     *
     * 权限：只读
     *
     * @example
     * let value = Chain.getAccountMetadata('adxSnBFboATCEgbiDRYS7gfbe1XRsTPWJhCFE', 'abc');
     *
     * @param {string} account_address 账号地址
     * @param {string} metadata_key metadata 的关键字
     * @returns {string | number | object | boolean} 成功返回字符串，如 'values', 失败返回false
     */
    getAccountMetadata: (account_address, metadata_key) => {},
    /**
     * 获取账号coin amount
     *
     * 权限：只读
     *
     * @example
     * let balance = Chain.getBalance('adxSnBFboATCEgbiDRYS7gfbe1XRsTPWJhCFE');
     *
     * @param {string} address 账号地址
     * @returns {string} 字符串格式数字 '9999111100000'
     */
    getBalance: (address) => {},
    /**
     * 获取某个账号的资产信息
     *
     * 权限：只读
     * @example
     * let asset_key =
     * {
     *  'issuer' : 'adxSnBFboATCEgbiDRYS7gfbe1XRsTPWJhCFE',
     *  'code' : 'CNY'
     * };
     * let bar = Chain.getAccountAsset('adxSnBFboATCEgbiDRYS7gfbe1XRsTPWJhCFE', asset_key);
     *
     * @param {string} account_address 账号地址
     * @param {string} asset_key 资产属性
     * @returns {string | boolean} 成功返回资产数字如'10000'，失败返回 false
     */
    getAccountAsset: (account_address, asset_key) => {},
    /**
     * 获取某个账号的权限信息
     *
     * 权限：只读
     *
     * @example
     * let bar = Chain.getAccountPrivilege('adxSnBFboATCEgbiDRYS7gfbe1XRsTPWJhCFE');
     *
     * @param {string} account_address 账号地址
     * @returns {Object | boolean} 成功返回权限json字符串如'{"master_weight":1,"thresholds":{"tx_threshold":1}}'，失败返回 false
     */
    getAccountPrivilege: (account_address) => {},
    /**
     * 获取合约账号属性
     *
     * 权限：只读
     *
     * @example
     * let value = Chain.getContractProperty('adxSgCwYLWoCZnP6s2WXtQCwhxuFxhvsr375z');
     *
     * @param {string} contract_address 合约地址
     * @returns {Object | boolean} 成功返回JSON对象，如 {"type":0, "length" : 416},  type 指合约类型， length 指合约代码长度，如果该账户不是合约则，length 为0. 失败返回false
     */
    getContractProperty: (contract_address) => {},
    /**
     * 获取合约账号属性
     *
     * 权限：可写
     *
     * @example
     * Chain.payCoin("adxSnBFboATCEgbiDRYS7gfbe1XRsTPWJhCFE", "10000", "{}");
     *
     * @param {string} address 发送Gas的目标地址
     * @param {string} amount 发送Gas的数量
     * @param {string} input  可选，合约参数，如果用户未填入，默认为空字符串
     * @returns {boolean} 成功返回 true，失败抛异常
     */
    payCoin: (address, amount, input) => {},
    /**
     * 发行资产
     *
     * 权限：可写
     *
     * @example
     * Chain.issueAsset("CNY", "10000");
     *
     * @param {string} code 资产代码
     * @param {string} amount 发行资产数量
     * @returns {boolean} 成功返回 true，失败抛异常
     */
    issueAsset: (code, amount) => {},
    /**
     * 转移资产
     *
     * 权限：可写
     *
     * @example
     * Chain.payAsset("adxSnBFboATCEgbiDRYS7gfbe1XRsTPWJhCFE", "adxSj9kGyXR2YpyxwZVMrnGcLWoG3Hf9qXne8", "CNY", "10000", "{}");
     *
     * @param {string} address 转移资产的目标地址
     * @param {string} issuer 资产发行方
     * @param {string} code 资产代码
     * @param {string} amount 转移资产的数量
     * @param {string} input 可选，合约参数，如果用户未填入，默认为空字符串
     * @returns {boolean} 成功返回 true，失败抛异常
     */
    payAsset: (address, issuer, code, amount, input) => {},
    /**
     * 委托调用
     *
     * 权限：可写
     *
     * @example
     * let ret = Chain.delegateCall('adxSgGkHuPv6FQUu6C5uWnaqyKJ22bSNrJUCJ'，'{}');
     *
     * @param {string} contractAddress 被调用的合约地址
     * @param {string} input 调用参数
     * @returns {Object | boolean} 成功会返回结果，失败抛出异常
     */
    delegateCall: (contractAddress, input) => {},
    /**
     * 委托查询
     *
     * 权限：只读
     *
     * @example
     * let ret = Chain.delegateQuery('adxSgGkHuPv6FQUu6C5uWnaqyKJ22bSNrJUCJ'，"");
     *
     * @param {string} contractAddress 被调用的合约地址
     * @param {string} input 调用参数
     * @returns {Object} 如果目标账户为普通账户，则返回true，如果目标账户为合约，调用成功则返回字符串 {"result":"4"}，其中 result 字段的值即查询的具体结果，调用失败返回 {"error":true} 字符串
     */
    delegateQuery: (contractAddress, input) => {},
    /**
     * 调用合约
     * Chain.contractCall函数会触发被调用的合约 main 函数入口
     *
     * 权限：可写
     *
     * @example
     * let ret = Chain.contractCall('adxSgGkHuPv6FQUu6C5uWnaqyKJ22bSNrJUCJ'，true, toBaseUnit("10"), "");
     *
     * @param {string} contractAddress 被调用的合约地址
     * @param {string | boolean} asset 资产类别，true代表Gas，对象{"issue": adxxxx, "code" : USDT} 代表资产
     * @param {string} amount 资产数量
     * @param {string} input 调用参数
     * @returns {boolean | any} 如果目标账户为普通账户，则返回true，如果目标账户为合约，调用成功则返回main函数的返回值，调用失败则抛出异常
     */
    contractCall: (contractAddress, asset, amount, input) => {},
    /**
     * 查询合约
     * Chain.contractQuery 会调用合约的查询接口
     *
     * 权限：只读
     *
     * @example
     * let ret = Chain.contractQuery('adxSgGkHuPv6FQUu6C5uWnaqyKJ22bSNrJUCJ'，"");
     *
     * @param {string} contractAddress 被调用的合约地址
     * @param {string} input 调用参数
     * @returns {Object} 调用成功则返回字符串 {"result":"xxx"}，其中 result 字段的值即查询的具体结果，调用失败返回 {"error":true} 字符串
     */
    contractQuery: (contractAddress, input) => {},
    /**
     * 创建合约
     *
     * 权限：可写
     *
     * @example
     * let ret = Chain.contractCreate(toBaseUnit("10"), 0, "'use strict';function init(input){return input;} function main(input){return input;} function query(input){return input;} ", "");
     *
     * @param {string} balance 字符串类型，转移给被创建的合约的资产
     * @param {number} type 整型，0代表javascript
     * @param {string} code 字符串类型， 合约代码
     * @param {string} input init函数初始化参数
     * @returns {string} 创建成功返回合约地址，失败则抛出异常
     */
    contractCreate: (balance, type, code, input) => {},
    /**
     * 区块信息
     */
    block: {
        /**
         * 当前交易执行时候所在的区块时间戳
         * @type {number}
         */
        timestamp,
        /**
         * 当前交易执行时候所在的区块高度
         * @type {number}
         */
        number
    },
    /**
     * 交易
     *
     * 交易是用户签名的那笔交易信息
     */
    tx: {
        /**
         * 交易最原始的发起者，即交易的费用付款者
         * @type {string}
         */
        initiator,
        /**
         * 交易最原始的触发者，即交易里触发合约执行的操作的账户。 例如某账号发起了一笔交易，该交易中有个操作是调用合约Y（该操作的source_address是x），那么合约Y执行过程中，sender的值就是x账号的地址
         * @type {string}
         * @example
         * let bar = Chain.tx.sender;
         */
        sender,
        /**
         * 交易签名里的gas价格
         * @type {string}
         */
        gasPrice,
        /**
         * 交易的hash值
         * @type {string}
         */
        hash,
        /**
         * 变量描述
         * @type {number}
         */
        feeLimit
    },
    /**
     * 消息是在交易里触发智能合约执行产生的信息。在触发的合约执行的过程中，交易信息不会被改变，消息会发生变化。例如在合约中调用 Chain.contractCall，Chain.contractQuery的时候，消息会变化。
     */
    msg: {
        /**
         * 本消息的原始的发起者账号
         * @type {string}
         */
        initiator,
        /**
         * 本次消息的触发者账号
         * @type {string}
         */
        sender,
        /**
         * 本次支付操作的 Gas coin
         * @type {number}
         */
        coinAmount,
        /**
         * 本次支付操作的资产
         * @type {Object}
         * @example
         * {
         * "amount": 1000,
         * "key" : {
         *    "issuer": "adxSnBFboATCEgbiDRYS7gfbe1XRsTPWJhCFE",
         *   "code":"CNY"
         * }
         * }
         */
        asset,
        /**
         * 本次交易里的发起者的nonce值，即Chain.msg.initiator账号的 nonce值
         * @type {number}
         */
        nonce,
        /**
         * 触发本次合约调用的操作的序号
         * @type {number}
         * @example
         * 例如某账号A发起了一笔交易tx0，tx0中第0（从0开始计数）个操作是给某个合约账户转移资产(调用合约), 那么Chain.msg.operationIndex的值就是0。
         */
        operationIndex
    },
    /**
     * 当前合约账号的地址
     * @type {string}
     * @example
     * 例如账号x发起了一笔交易调用合约Y，本次执行过程中，该值就是Y合约账号的地址
     */
    thisAddress
};

/** @global */
var Utils = {
    /**
     * 输出日志
     *
     * 权限：只读
     *
     * @example
     * Utils.log(info);
     *
     * @param {string} info 日志内容
     * @returns {Object | boolean} 成功无返回值，会在对应的合约执行进程里，输出一段Trace级别的日志，如 V8contract log[adxSnBFboATCEgbiDRYS7gfbe1XRsTPWJhCFE:hello]；失败返回 false
     *
     */
    log: (info) => {},
    /**
     * 字符串数字合法性检查
     *
     * 权限：只读
     *
     * @example
     * let ret = Utils.stoI64Check('12345678912345');
     *
     * @param {string} strNumber 字符串数字参数
     * @returns {boolean} 成功返回 true，失败返回 false
     *
     */
    stoI64Check: (strNumber) => {},
    /**
     * 64断言
     *
     * 权限：只读
     *
     * @example
     * Utils.assert(1===1, "Not valid");
     *
     * @param {boolean} condition 断言变量
     * @param {string} message 可选，失败时抛出异常的消息
     * @returns {boolean} 成功返回 true，失败抛异常
     *
     */
    assert: (condition, message) => {},
    /**
     * 字符串数字合法性检查
     *
     * 权限：只读
     *
     * @example
     * let ret = Utils.stoI64Check('12345678912345');
     *
     * @param {string} strNumber 字符串数字参数
     * @returns {boolean} 成功返回 true，失败返回 false
     *
     */
    stoI64Check: (strNumber) => {},
    /**
     * 64位加法
     *
     * 权限：只读
     *
     * @example
     * let ret = Utils.int64Add('12345678912345', 1);
     *
     * @param {string | number} left_value 左值
     * @param {string | number} right_value 右值
     * @returns {string} 成功返回字符串 '12345678912346', 失败抛异常
     *
     */
    int64Add: (left_value, right_value) => {},
    /**
     * 64位减法
     *
     * 权限：只读
     *
     * @example
     * let ret = Utils.int64Sub('12345678912345', 1);
     *
     * @param {string | number} left_value 左值
     * @param {string | number} right_value 右值
     * @returns {string} 成功返回字符串 '12345678912346', 失败抛异常
     *
     */
    int64Sub: (left_value, right_value) => {},
    /**
     * 64位乘法
     *
     * 权限：只读
     *
     * @example
     * let ret = Utils.int64Mul('12345678912345', 1);
     *
     * @param {string | number} left_value 左值
     * @param {string | number} right_value 右值
     * @returns {string} 成功返回字符串 '12345678912346', 失败抛异常
     *
     */
    int64Mul: (left_value, right_value) => {},
    /**
     * 64位取模
     *
     * 权限：只读
     *
     * @example
     * let ret = Utils.int64Mod('12345678912345', 1);
     *
     * @param {string | number} left_value 左值
     * @param {string | number} right_value 右值
     * @returns {string} 成功返回字符串 '1', 失败抛异常
     *
     */
    int64Mod: (left_value, right_value) => {},
    /**
     * 64位除法
     *
     * 权限：只读
     *
     * @example
     * let ret = Utils.int64Div('12345678912345', 1);
     *
     * @param {string | number} left_value 左值
     * @param {string | number} right_value 右值
     * @returns {string} 成功返回字符串 '6172839456172', 失败抛异常
     *
     */
    int64Div: (left_value, right_value) => {},
    /**
     * 64位比较
     *
     * 权限：只读
     *
     * @example
     * let ret = Utils.int64Div('12345678912345', 1);
     *
     * @param {string | number} left_value 左值
     * @param {string | number} right_value 右值
     * @returns {number} 成功返回数字 (1：左值大于右值，0：等于，-1 ：小于)，失败抛异常
     *
     */
    int64Compare: (left_value, right_value) => {},
    /**
     * 变换单位
     *
     * 权限：只读
     *
     * @example
     * let ret = Utils.toBaseUnit('12345678912');
     *
     * @param {string} value 被转换的数字，只能传入字符串，可以包含小数点，且小数点之后最多保留 8 位数字
     * @returns {string | boolean} 成功会返回乘以 10^8 的字符串，失败会返回 false
     *
     */
    toBaseUnit: (value) => {}
};
