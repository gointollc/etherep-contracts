# etherep-contracts
[![Build Status](https://travis-ci.org/gointollc/etherep-contracts.svg?branch=master)](https://travis-ci.org/gointollc/etherep-contracts) [![Coverage Status](https://coveralls.io/repos/github/gointollc/etherep-contracts/badge.svg?branch=master)](https://coveralls.io/github/gointollc/etherep-contracts?branch=master)

Ethereum smart contracts for etherep

## Public Usage

### GointoMigration

[GointoMigration](https://github.com/gointollc/GointoMigration) is used to track the addresses to the Etherep contracts.  It should be the most stable and not change addresses very often, if ever.  To make sure you have the most up to date address, check [etherep.com](https://www.etherep.com).  Etherep is stored with the key `etherep` and RatingStore as `ratingstore`.

To get the addresses, you can use `GointoMigration.getContract` like this: 

    var migrationABI = [{"constant":true,"inputs":[{"name":"key","type":"string"}],"name":"getContract","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"}];
    var migrate = web3.eth.contract(shortABI).at(TBD);
    var etherepAddress = migrate.getContract("etherep")
    var ratingstoreAddress = migrate.getContract("ratingstore")

### Etherep

Get an instance of the contract for function calls

    var etherepABI = [{"constant":false,"inputs":[{"name":"d","type":"bool"}],"name":"setDebug","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newFee","type":"uint256"}],"name":"setFee","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"drain","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"getScoreAndCount","outputs":[{"name":"score","type":"int256"},{"name":"ratings","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getDelay","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getFee","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"who","type":"address"}],"name":"setManager","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getDebug","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"getScore","outputs":[{"name":"score","type":"int256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getManager","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"delay","type":"uint256"}],"name":"setDelay","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"who","type":"address"},{"name":"rating","type":"int256"}],"name":"rate","outputs":[],"payable":true,"type":"function"},{"inputs":[{"name":"_manager","type":"address"},{"name":"_fee","type":"uint256"},{"name":"_storageAddress","type":"address"},{"name":"_wait","type":"uint256"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"message","type":"string"}],"name":"Error","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"message","type":"string"}],"name":"Debug","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"message","type":"int256"}],"name":"DebugInt","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"message","type":"uint256"}],"name":"DebugUint","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"by","type":"address"},{"indexed":false,"name":"who","type":"address"},{"indexed":false,"name":"rating","type":"int256"}],"name":"Rating","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"f","type":"uint256"}],"name":"FeeChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"d","type":"uint256"}],"name":"DelayChanged","type":"event"}];

    // Use the address you got from the migration contract
    var rep = web3.eth.contract(etherepABI).at(etherepAddress);

#### getManager()

Return the manager's address for the contract.

    rep.getManager()

#### getFee()

Return the current rating fee in Wei

    rep.getFee()

#### getDelay()

Return the current rating delay in seconds.

    rep.getDelay()

#### rate(address, int)

Rate another address on a scale of -5(awful) to 5(great).

    rep.rate("0x123deadbeef456...", 3, { gas: 100000 })

#### getScore(address)

Get the cumulative score for an address.  The score that is returned is a 3 digit integer but can be considered a float with two decimal places.

    rep.getScore("0x123deadbeef456...")

#### getScoreAndCount(address)

Get the cumulative score and the total count of ratings for an address.  This call returns an integer and an unsigned integer tuple.

    rep.getScore("0x123deadbeef456...")

### RatingStore

There's not a lot of reason for most people to interact with this contract.  No writable calls are available to the public.  That said, there's a couple constants that could be useful.

First, get an instance of the contract for function calls:

    var ratingstoreABI = [{"constant":false,"inputs":[{"name":"_debug","type":"bool"}],"name":"setDebug","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getController","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"target","type":"address"},{"name":"wScore","type":"int256"}],"name":"add","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"target","type":"address"}],"name":"reset","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"target","type":"address"},{"name":"cumulative","type":"int256"},{"name":"total","type":"uint256"}],"name":"set","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newController","type":"address"}],"name":"setController","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"target","type":"address"}],"name":"get","outputs":[{"name":"","type":"int256"},{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newManager","type":"address"}],"name":"setManager","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getDebug","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getManager","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"inputs":[{"name":"_manager","type":"address"},{"name":"_controller","type":"address"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"message","type":"string"}],"name":"Debug","type":"event"}];

    // Use the address you got from the migration contract
    var store = web3.eth.contract(ratingstoreABI).at(ratingstoreAddress);

#### get(address)

Return cumulative score and count of ratings for an address.

    store.get("0x123deadbeef456...")

#### getManager()

Get the managing account of the contract.

    store.getManager()

#### getController()

Get the controller address for the contract.  The Controller is the address that has the rights to make write calls to the contract.  This should always be the address of the current Etherep contract.

    store.getManager()

#### getDebug()

Whether or not debug is turned on.  This usually causes debug events to fire for... well, debugging purposes.

    store.getDebug()

## Deploying With a Web3 Javascript API

This should work with web3.js or the geth console.

### RatingStore

    var manager = web3.eth.accounts[0];

    var ratingstoreABI = [{"constant":false,"inputs":[{"name":"_debug","type":"bool"}],"name":"setDebug","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getController","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"target","type":"address"},{"name":"wScore","type":"int256"}],"name":"add","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"target","type":"address"}],"name":"reset","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"target","type":"address"},{"name":"cumulative","type":"int256"},{"name":"total","type":"uint256"}],"name":"set","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newController","type":"address"}],"name":"setController","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"target","type":"address"}],"name":"get","outputs":[{"name":"","type":"int256"},{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newManager","type":"address"}],"name":"setManager","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getDebug","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getManager","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"inputs":[{"name":"_manager","type":"address"},{"name":"_controller","type":"address"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"message","type":"string"}],"name":"Debug","type":"event"}];

    var ratingstoreBytes = "0x6060604052341561000f57600080fd5b60405160408061068e83398101604052808051919060200180519150505b60028054600160a060020a03808516600160a060020a03199283161790925560038054928416929091169190911790556000805460ff191690555b50505b6106148061007a6000396000f300606060405236156100a15763ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416630c2cb82081146100a65780633018205f146100c05780635cd60dad146100ef5780636b8ab97d146101135780637223cd191461013457806392eefe9b1461015b578063c2bc2efc1461017c578063d0ebdbe7146101b3578063d184935d146101d4578063d5009584146101fb575b600080fd5b34156100b157600080fd5b6100be600435151561022a565b005b34156100cb57600080fd5b6100d361025a565b604051600160a060020a03909116815260200160405180910390f35b34156100fa57600080fd5b6100be600160a060020a036004351660243561026a565b005b341561011e57600080fd5b6100be600160a060020a0360043516610367565b005b341561013f57600080fd5b6100be600160a060020a03600435166024356044356103e0565b005b341561016657600080fd5b6100be600160a060020a03600435166104d7565b005b341561018757600080fd5b61019b600160a060020a0360043516610521565b60405191825260208201526040908101905180910390f35b34156101be57600080fd5b6100be600160a060020a0360043516610584565b005b34156101df57600080fd5b6101e76105ce565b604051901515815260200160405180910390f35b341561020657600080fd5b6100d36105d8565b604051600160a060020a03909116815260200160405180910390f35b600254600160a060020a03908116903316811461024657600080fd5b6000805460ff19168315151790555b5b5050565b600354600160a060020a03165b90565b60025433600160a060020a0390811691161480610295575060025432600160a060020a039081169116145b806102ae575060035433600160a060020a039081169116145b15156102b957600080fd5b600160a060020a03821660009081526001602052604090205460ff1615156103335760606040519081016040908152600180835260006020808501829052838501829052600160a060020a038716825291909152208151815460ff1916901515178155602082015181600101556040820151600290910155505b600160a060020a0382166000908152600160208190526040909120808201805484019055600201805490910190555b5b5050565b600254600160a060020a03908116903316811461038357600080fd5b60606040519081016040908152600180835260006020808501829052838501829052600160a060020a038716825291909152208151815460ff1916901515178155602082015181600101556040820151600290910155505b5b5050565b60025433600160a060020a039081169116148061040b575060025432600160a060020a039081169116145b80610424575060035433600160a060020a039081169116145b151561042f57600080fd5b600160a060020a03831660009081526001602052604090205460ff1615156104a95760606040519081016040908152600180835260006020808501829052838501829052600160a060020a038816825291909152208151815460ff1916901515178155602082015181600101556040820151600290910155505b600160a060020a03831660009081526001602081905260409091209081018390556002018190555b5b505050565b600254600160a060020a0390811690331681146104f357600080fd5b6003805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a0384161790555b5b5050565b600160a060020a0381166000908152600160208190526040822054829160ff90911615151415610577575050600160a060020a03811660009081526001602081905260409091209081015460029091015461057e565b5060009050805b5b915091565b600254600160a060020a0390811690331681146105a057600080fd5b6002805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a0384161790555b5b5050565b60005460ff165b90565b600254600160a060020a03165b905600a165627a7a72305820cebd51dd8f5abd6dbe578baea988c27459b8fa89c3d39ec3db627178d297493c0029";

    // Deploy RatingStore
    var contractRatingStore = web3.eth.contract(ratingstoreABI);
    personal.unlockAccount(manager)
    var rsDeploy = contractRatingStore.new(manager, manager, {from: manager, data: ratingstoreBytes, gas: 600000});
    var rsAddress = eth.getTransactionReceipt(rsDeploy.transactionHash).contractAddress;
    var store = contractRatingStore.at(rsAddress);

### Etherep

    var manager = web3.eth.accounts[0];
    var fee = 200000000000000;

    var etherepABI = [{"constant":false,"inputs":[{"name":"d","type":"bool"}],"name":"setDebug","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newFee","type":"uint256"}],"name":"setFee","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"drain","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"getScoreAndCount","outputs":[{"name":"score","type":"int256"},{"name":"ratings","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getDelay","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getFee","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"who","type":"address"}],"name":"setManager","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getDebug","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"getScore","outputs":[{"name":"score","type":"int256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getManager","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_delay","type":"uint256"}],"name":"setDelay","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"who","type":"address"},{"name":"rating","type":"int256"}],"name":"rate","outputs":[],"payable":true,"type":"function"},{"inputs":[{"name":"_manager","type":"address"},{"name":"_fee","type":"uint256"},{"name":"_storageAddress","type":"address"},{"name":"_wait","type":"uint256"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"message","type":"string"}],"name":"Error","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"message","type":"string"}],"name":"Debug","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"message","type":"int256"}],"name":"DebugInt","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"message","type":"uint256"}],"name":"DebugUint","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"by","type":"address"},{"indexed":false,"name":"who","type":"address"},{"indexed":false,"name":"rating","type":"int256"}],"name":"Rating","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"f","type":"uint256"}],"name":"FeeChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"d","type":"uint256"}],"name":"DelayChanged","type":"event"}];

    var etherepBytes = "0x6060604052341561000f57600080fd5b604051608080610912833981016040528080519190602001805191906020018051919060200180519150505b60008054600185905560028054600160a060020a031916600160a060020a0386811691909117909155600384905561010060a860020a0319909116610100918716919091021760ff191690555b505050505b6108768061009c6000396000f3006060604052361561009e5763ffffffff60e060020a6000350416630c2cb82081146100a357806369fe0e2d146100bd5780639890220b146100d5578063ab413a7e146100ea578063cebc9a8214610121578063ced72f8714610146578063d0ebdbe71461016b578063d184935d1461018c578063d47875d0146101b3578063d5009584146101e4578063e177246e14610213578063e7e3e1671461022b575b600080fd5b34156100ae57600080fd5b6100bb6004351515610244565b005b34156100c857600080fd5b6100bb600435610279565b005b34156100e057600080fd5b6100bb6102d8565b005b34156100f557600080fd5b610109600160a060020a0360043516610353565b60405191825260208201526040908101905180910390f35b341561012c57600080fd5b6101346103ed565b60405190815260200160405180910390f35b341561015157600080fd5b6101346103f4565b60405190815260200160405180910390f35b341561017657600080fd5b6100bb600160a060020a03600435166103fb565b005b341561019757600080fd5b61019f61044f565b604051901515815260200160405180910390f35b34156101be57600080fd5b610134600160a060020a0360043516610459565b60405190815260200160405180910390f35b34156101ef57600080fd5b6101f76104f4565b604051600160a060020a03909116815260200160405180910390f35b341561021e57600080fd5b6100bb600435610509565b005b6100bb600160a060020a0360043516602435610568565b005b600054600160a060020a036101009091048116903316811461026557600080fd5b6000805460ff19168315151790555b5b5050565b600054600160a060020a036101009091048116903316811461029a57600080fd5b60018290557f6bbc57480a46553fa4d156ce702beef5f3ad66303b0ed1a5d4cb44966c6584c38260405190815260200160405180910390a15b5b5050565b600054600160a060020a03610100909104811690331681146102f957600080fd5b6000600160a060020a033016311161031057600080fd5b600054600160a060020a0361010090910481169030163180156108fc0290604051600060405180830381858888f19350505050151561034e57600080fd5b5b5b50565b6002546000908190600160a060020a0316818163c2bc2efc86836040516040015260405160e060020a63ffffffff8416028152600160a060020a0390911660048201526024016040805180830381600087803b15156103b157600080fd5b6102c65a03f115156103c257600080fd5b50505060405180519060200180519450909150839050818115156103e257fe5b0593505b5050915091565b6003545b90565b6001545b90565b600054600160a060020a036101009091048116903316811461041c57600080fd5b6000805474ffffffffffffffffffffffffffffffffffffffff001916610100600160a060020a038516021790555b5b5050565b60005460ff165b90565b600254600090600160a060020a031681808263c2bc2efc86836040516040015260405160e060020a63ffffffff8416028152600160a060020a0390911660048201526024016040805180830381600087803b15156104b657600080fd5b6102c65a03f115156104c757600080fd5b5050506040518051906020018051919350909150819050828115156104e857fe5b0593505b505050919050565b6000546101009004600160a060020a03165b90565b600054600160a060020a036101009091048116903316811461052a57600080fd5b60038290557f91f02f9cd6e47aaaa95af9dbcbdaf771b32a1c9fea1c867ddd1a8fff54fd13f58260405190815260200160405180910390a15b5b5050565b60008054819081908190819081908190819060ff161580156105a95750600354600160a060020a033316600090815260046020526040902054429190910390115b15610626577fcfa5f641c29090a64bc13dcafdc8c23d82677807046c35d636ca9c57fc9cb25733604051600160a060020a0390911681526040602082018190526010818301527f526174696e6720746f6f206f6674656e0000000000000000000000000000000060608301526080909101905180910390a1600080fd5b60015434101561063557600080fd5b6005891315801561064857506004198912155b151561065357600080fd5b33600160a060020a03168a600160a060020a03161415151561067457600080fd5b600254600160a060020a0316975060009650606495508894508685121561069c578860000394505b6000915087600160a060020a031663c2bc2efc3360006040516040015260405160e060020a63ffffffff8416028152600160a060020a0390911660048201526024016040805180830381600087803b15156106f657600080fd5b6102c65a03f1151561070757600080fd5b505050604051805190602001805191955090935050831561073757826064028481151561073057fe5b0560640291505b600082131561075c5785600a866005855b050281151561075357fe5b05019650610760565b8596505b5033600160a060020a03811660009081526004602052604090819020429055878a02917f5df952557c4acd5185f164dba741f992b65e22830c4a5f2092349fb350bf3f33918c90849051600160a060020a039384168152919092166020820152604080820192909252606001905180910390a187600160a060020a0316635cd60dad8b8360405160e060020a63ffffffff8516028152600160a060020a0390921660048301526024820152604401600060405180830381600087803b151561082757600080fd5b6102c65a03f1151561083857600080fd5b5050505b5b5b505050505050505050505600a165627a7a72305820c26fe1559446835632b4ff96fe41dcbf71e0ea21f5127ffa7115f89cdef70cf70029";

    // Deploy Etherep
    var contractEtherep = web3.eth.contract(etherepABI);
    var eDeploy = contractEtherep.new(manager, fee, rsAddress, 3600, {from: manager, data: etherepBytes, gas: 900000});
    var eAddress = eth.getTransactionReceipt(eDeploy.transactionHash).contractAddress;
    var rep = contractEtherep.at(eAddress);

    // Let RatingStore know of the address for Etherep
    var trans = store.setController(eAddress, {from: manager, gas: 85000})
    eth.getTransactionReceipt(trans);

### GointoMigration Notification

GointoMigration contract should be notified of the new contract addresses

    var manager = web3.eth.accounts[0];

    var migrationABI = [{"constant":false,"inputs":[{"name":"key","type":"string"},{"name":"contractAddress","type":"address"}],"name":"setContract","outputs":[],"payable":false,"type":"function"}];

    // Get migration contract instance
    var migrate = web3.eth.contract(migrationABI).at("0x123deadbeef456...");

    // Set contract addresses in the migration contract
    var setTrans = migrate.setContract("etherep", rep.address, {from: manager, gas: 60000});
    var setTrans = migrate.setContract("ratingstore", store.address, {from: manager, gas: 60000});