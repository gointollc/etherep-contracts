# etherep-contracts
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

    var etherepABI = var etherepABI = [{"constant":false,"inputs":[{"name":"d","type":"bool"}],"name":"setDebug","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"drain","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"getScoreAndCount","outputs":[{"name":"score","type":"int256"},{"name":"ratings","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"who","type":"address"}],"name":"setManager","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getDebug","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"getScore","outputs":[{"name":"score","type":"int256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getManager","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"who","type":"address"},{"name":"rating","type":"int256"}],"name":"rate","outputs":[],"payable":true,"type":"function"},{"inputs":[{"name":"_manager","type":"address"},{"name":"_fee","type":"uint256"},{"name":"_storageAddress","type":"address"},{"name":"_wait","type":"uint256"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"message","type":"string"}],"name":"Error","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"message","type":"string"}],"name":"Debug","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"message","type":"int256"}],"name":"DebugInt","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"message","type":"uint256"}],"name":"DebugUint","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"by","type":"address"},{"indexed":false,"name":"who","type":"address"},{"indexed":false,"name":"rating","type":"int256"}],"name":"Rating","type":"event"}];

    // Use the address you got from the migration contract
    var rep = web3.eth.contract(etherepABI).at(etherepAddress);

#### getManager()

Return the manager's address for the contract.

    rep.getManager()

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

    var ratingstoreBytes = "0x6060604052341561000c57fe5b60405160408061075c8339810160405280516020909101515b60028054600160a060020a03808516600160a060020a03199283161790925560038054928416929091169190911790556000805460ff191690555b50505b6106ea806100726000396000f300606060405236156100a15763ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416630c2cb82081146100a35780633018205f146100ba5780635cd60dad146100e65780636b8ab97d146101075780637223cd191461012557806392eefe9b14610149578063c2bc2efc14610167578063d0ebdbe71461019c578063d184935d146101ba578063d5009584146101de575bfe5b34156100ab57fe5b6100b8600435151561020a565b005b34156100c257fe5b6100ca610281565b60408051600160a060020a039092168252519081900360200190f35b34156100ee57fe5b6100b8600160a060020a0360043516602435610291565b005b341561010f57fe5b6100b8600160a060020a036004351661038b565b005b341561012d57fe5b6100b8600160a060020a0360043516602435604435610443565b005b341561015157fe5b6100b8600160a060020a0360043516610537565b005b341561016f57fe5b610183600160a060020a03600435166105c8565b6040805192835260208301919091528051918290030190f35b34156101a457fe5b6100b8600160a060020a03600435166105f3565b005b34156101c257fe5b6101ca610684565b604080519115158252519081900360200190f35b34156101e657fe5b6100ca61068e565b60408051600160a060020a039092168252519081900360200190f35b600254600160a060020a03908116903316811461026d5760005460ff16156102675760408051602080825260069082015260d260020a6511195b9a59590281830152905160008051602061069f8339815191529181900360600190a15b60006000fd5b6000805460ff19168315151790555b5b5050565b600354600160a060020a03165b90565b60025433600160a060020a039081169116148015906102bf575060025432600160a060020a03908116911614155b80156102da575060035433600160a060020a03908116911614155b156102e55760006000fd5b600160a060020a03821660009081526001602052604090205460ff1615156103575760408051606081018252600180825260006020808401828152848601838152600160a060020a038916845291849052949091209251835460ff191690151517835592519082015590516002909101555b600160a060020a0382166000908152600160208190526040909120808201805484019055600201805490910190555b5b5050565b600254600160a060020a0390811690331681146103ee5760005460ff16156102675760408051602080825260069082015260d260020a6511195b9a59590281830152905160008051602061069f8339815191529181900360600190a15b60006000fd5b60408051606081018252600180825260006020808401828152848601838152600160a060020a038916845291849052949091209251835460ff191690151517835592519082015590516002909101555b5b5050565b60025433600160a060020a03908116911614801590610471575060025432600160a060020a03908116911614155b801561048c575060035433600160a060020a03908116911614155b156104975760006000fd5b600160a060020a03831660009081526001602052604090205460ff1615156105095760408051606081018252600180825260006020808401828152848601838152600160a060020a038a16845291849052949091209251835460ff191690151517835592519082015590516002909101555b600160a060020a03831660009081526001602081905260409091209081018390556002018190555b5b505050565b600254600160a060020a03908116903316811461059a5760005460ff16156102675760408051602080825260069082015260d260020a6511195b9a59590281830152905160008051602061069f8339815191529181900360600190a15b60006000fd5b6003805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a0384161790555b5b5050565b600160a060020a0381166000908152600160208190526040909120908101546002909101545b915091565b600254600160a060020a0390811690331681146106565760005460ff16156102675760408051602080825260069082015260d260020a6511195b9a59590281830152905160008051602061069f8339815191529181900360600190a15b60006000fd5b6002805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a0384161790555b5b5050565b60005460ff165b90565b600254600160a060020a03165b9056007cdb51e9dbbc205231228146c3246e7f914aa6d4a33170e43ecc8e3593481d1aa165627a7a7230582086547d84ab205b3f3c44864bf45c8fa8f5546e8ae9cb08251bc59c9d79a3d2470029";

    // Deploy RatingStore
    var contractRatingStore = web3.eth.contract(ratingstoreABI);
    personal.unlockAccount(manager)
    var rsDeploy = contractRatingStore.new(manager, manager, {from: manager, data: ratingstoreBytes, gas: 600000});
    var rsAddress = eth.getTransactionReceipt(rsDeploy.transactionHash).contractAddress;
    var store = contractRatingStore.at(rsAddress);

### Etherep

    var manager = web3.eth.accounts[0];
    var fee = 200000000000000;

    var etherepABI = [{"constant":false,"inputs":[{"name":"d","type":"bool"}],"name":"setDebug","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"drain","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"getScoreAndCount","outputs":[{"name":"score","type":"int256"},{"name":"ratings","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"who","type":"address"}],"name":"setManager","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getDebug","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"getScore","outputs":[{"name":"score","type":"int256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getManager","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"who","type":"address"},{"name":"rating","type":"int256"}],"name":"rate","outputs":[],"payable":true,"type":"function"},{"inputs":[{"name":"_manager","type":"address"},{"name":"_fee","type":"uint256"},{"name":"_storageAddress","type":"address"},{"name":"_wait","type":"uint256"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"message","type":"string"}],"name":"Error","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"message","type":"string"}],"name":"Debug","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"message","type":"int256"}],"name":"DebugInt","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"message","type":"uint256"}],"name":"DebugUint","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"by","type":"address"},{"indexed":false,"name":"who","type":"address"},{"indexed":false,"name":"rating","type":"int256"}],"name":"Rating","type":"event"}];

    var etherepBytes = "0x6060604052341561000c57fe5b604051608080610b1483398101604090815281516020830151918301516060909301519092905b60008054600185905560028054600160a060020a031916600160a060020a0386811691909117909155600384905561010060a860020a0319909116610100918716919091021760ff191690555b505050505b610a80806100946000396000f3006060604052361561008b5763ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416630c2cb820811461008d5780639890220b146100a4578063ab413a7e146100b6578063d0ebdbe7146100eb578063d184935d14610109578063d47875d01461012d578063d50095841461015b578063e7e3e16714610187575bfe5b341561009557fe5b6100a260043515156101a0565b005b34156100ac57fe5b6100a2610233565b005b34156100be57fe5b6100d2600160a060020a036004351661030a565b6040805192835260208301919091528051918290030190f35b34156100f357fe5b6100a2600160a060020a0360043516610433565b005b341561011157fe5b6101196104e5565b604080519115158252519081900360200190f35b341561013557fe5b610149600160a060020a03600435166104ef565b60408051918252519081900360200190f35b341561016357fe5b61016b610619565b60408051600160a060020a039092168252519081900360200190f35b6100a2600160a060020a036004351660243561062e565b005b600054600160a060020a036101009091048116903316811461021f5760408051600160a060020a0333168152602081018290526006818301527f44656e696564000000000000000000000000000000000000000000000000000060608201529051600080516020610a358339815191529181900360800190a160006000fd5b6000805460ff19168315151790555b5b5050565b600054600160a060020a03610100909104811690331681146102b25760408051600160a060020a0333168152602081018290526006818301527f44656e696564000000000000000000000000000000000000000000000000000060608201529051600080516020610a358339815191529181900360800190a160006000fd5b6000600160a060020a03301631116102ca5760006000fd5b60008054604051600160a060020a03610100909204821692309092163180156108fc0292909190818181858888f19350505050151561030557fe5b5b5b50565b60025460408051600090820181905281517fc2bc2efc000000000000000000000000000000000000000000000000000000008152600160a060020a0385811660048301528351929485949116928492849263c2bc2efc9260248084019382900301818787803b151561037857fe5b6102c65a03f1151561038657fe5b5050604051805160208083015196509093507f341905673a2abf111ea058ea9b66bc53e8da9cc34d6d510ee5679c14c6b5f007925090a1604080516020808252600a908201527f43756d756c6174697665000000000000000000000000000000000000000000008183015290517f7cdb51e9dbbc205231228146c3246e7f914aa6d4a33170e43ecc8e3593481d1a9181900360600190a1828181151561042857fe5b0593505b5050915091565b600054600160a060020a03610100909104811690331681146104b25760408051600160a060020a0333168152602081018290526006818301527f44656e696564000000000000000000000000000000000000000000000000000060608201529051600080516020610a358339815191529181900360800190a160006000fd5b6000805474ffffffffffffffffffffffffffffffffffffffff001916610100600160a060020a038516021790555b5b5050565b60005460ff165b90565b60025460408051600090820181905281517fc2bc2efc000000000000000000000000000000000000000000000000000000008152600160a060020a03858116600483015283519294169284928392859263c2bc2efc9260248084019382900301818787803b151561055c57fe5b6102c65a03f1151561056a57fe5b505060405180516020808301519195509093507f341905673a2abf111ea058ea9b66bc53e8da9cc34d6d510ee5679c14c6b5f007925090a1604080516020808252600a908201527f43756d756c6174697665000000000000000000000000000000000000000000008183015290517f7cdb51e9dbbc205231228146c3246e7f914aa6d4a33170e43ecc8e3593481d1a9181900360600190a1808281151561060d57fe5b0593505b505050919050565b6000546101009004600160a060020a03165b90565b60006000600060006000600060006000600060009054906101000a900460ff1615801561067a5750600354600160a060020a033316600090815260046020526040902054429190910390115b156106e25760408051600160a060020a0333168152602081018290526010818301527f526174696e6720746f6f206f6674656e0000000000000000000000000000000060608201529051600080516020610a358339815191529181900360800190a160006000fd5b60015434101561074f5760408051600160a060020a033316815260208101829052600c818301527f466565207265717569726564000000000000000000000000000000000000000060608201529051600080516020610a358339815191529181900360800190a160006000fd5b600589138061075f575060041989125b156107c75760408051600160a060020a033316815260208101829052600d818301527f4f7574206f6620626f756e64730000000000000000000000000000000000000060608201529051600080516020610a358339815191529181900360800190a160006000fd5b33600160a060020a03168a600160a060020a031614156108445760408051600160a060020a033316815260208101829052600b818301527f53656c6620726174696e6700000000000000000000000000000000000000000060608201529051600080516020610a358339815191529181900360800190a160006000fd5b600254600160a060020a0316975060009650606495508894508685121561086c578860000394505b60408051600090820181905281517fc2bc2efc000000000000000000000000000000000000000000000000000000008152600160a060020a03338116600483015283519295508b169263c2bc2efc9260248084019382900301818887803b15156108d257fe5b6102c65a03f115156108e057fe5b50506040518051602090910151909550935050831561090e57826064028481151561090757fe5b0560640291505b60008213156109335785600a866005855b050281151561092a57fe5b05019650610937565b8596505b50600160a060020a033381166000818152600460209081526040918290204290558151928352928c169282019290925289880281830181905291517f5df952557c4acd5185f164dba741f992b65e22830c4a5f2092349fb350bf3f339181900360600190a187600160a060020a0316635cd60dad8b836040518363ffffffff167c01000000000000000000000000000000000000000000000000000000000281526004018083600160a060020a0316600160a060020a0316815260200182815260200192505050600060405180830381600087803b1515610a1457fe5b6102c65a03f11515610a2257fe5b5050505b5b5b505050505050505050505600cfa5f641c29090a64bc13dcafdc8c23d82677807046c35d636ca9c57fc9cb257a165627a7a72305820e4ea0af43ef684712146d2dc91d7c89964c19554c479f560fd262eb16258e8e30029";

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
    var contractMigrate = web3.eth.contract(migrationABI).at("0x123deadbeef456...");

    // Set contract addresses in the migration contract
    var setTrans = migrate.setContract("etherep", rep.address, {from: manager, gas: 60000});
    var setTrans = migrate.setContract("ratingstore", store.address, {from: manager, gas: 60000});