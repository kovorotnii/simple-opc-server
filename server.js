
const opcua = require('node-opcua');

const uuid = require('uuid');

const server = new opcua.OPCUAServer({
    port: 4334,
    resourcePath: "UA/TstServer"
})

function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; 
}

// callback for server.initialize()
function postInitialize(){
    console.log("initialized");

    function createAddressSpace(server){

        const addressSpace = server.engine.addressSpace;
        const nameSpace = addressSpace.getOwnNamespace();
    
        const device = nameSpace.addObject({
            organizedBy: addressSpace.rootFolder.objects,
            browseName: "Device1"
        });
    
        let opcVar;
    
        setInterval(function(){  opcVar = getRandom(0, 100); }, 1000);
    
        nameSpace.addVariable({
            componentOf: device,
            nodeId: "ns=1;i=1",
            browseName: "opcVariable1",
            dataType: "Double",
            value: {
                get: function(){
                    return new opcua.Variant({ dataType: opcua.DataType.Double, value: opcVar });
                }
            }
        });


        let opcArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

        setInterval(function(){  
            for (let i = 0 ; i < opcArray.length;i++){
                opcArray[i] = getRandom(200, 1000);
        } 
    }, 1000);

        nameSpace.addVariable({
            componentOf: device,
            nodeId: "ns=1;i=2",
            browseName: "opcArray1",
            dataType: "Int32",
            value:{
                get:function(){
                    return new opcua.Variant({ dataType: opcua.DataType.Int32, value: opcArray });
                }
            }

        });

        let opcString = "";

        setInterval(function(){  opcString = uuid.v4(); }, 1000);

        nameSpace.addVariable({
            componentOf: device,
            nodeId: "ns=1;i=3",
            browseName: "opcString",
            dataType: "String",
            value:{
                get: function(){
                    return new opcua.Variant({ dataType: opcua.DataType.String, value: opcString });
                }
            }
        });

        let opcHumidity = 0;
    
        setInterval(function(){  opcHumidity = getRandom(1, 100); }, 1000);
    
        nameSpace.addVariable({
            componentOf: device,
            nodeId: "ns=1;i=4",
            browseName: "opcHumidity",
            dataType: "Int32",
            value: {
                get: function(){
                    return new opcua.Variant({ dataType: opcua.DataType.Int32, value: opcHumidity });
                }
            }
        });
    

    }

    createAddressSpace(server);
    server.start(function() {
        console.log("Server is now listening ... ( press CTRL+C to stop)");
        console.log("port ", server.endpoints[0].port);
        const endpointUrl = server.endpoints[0].endpointDescriptions()[0].endpointUrl;
        console.log(" the primary server endpoint url is ", endpointUrl );
    });    
}

// init server
server.initialize(postInitialize);




