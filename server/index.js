const express = require("express");
const http = require("http");
const {Server} = require("socket.io")
const cors = require('cors');
const path = require("path")

const app = express();
app.use(cors());



let players = ['', ''];

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
})

// SETTING PLAYER ID
io.on("connection", (socket) => {
    if (players[0] === ''){
        socket.broadcast.emit("join","Player 2 has Joined")
        players[0] = socket.id
    } 
    else if(players[1]==='') {
        // io.emit("receivePermit", true)
        players[1] = socket.id
        socket.broadcast.emit("join","Player 2 has Joined")
    }
    else {
        players[0]=socket.id
        players[1]=''
        socket.broadcast.emit("join","Player 1 has Joined")
        // io.emit("receivePermit",false)
    }
    console.log(socket.id);
    console.log(players);


    socket.on("connecion_msg",()=>{
        if(players[1]==='') {
            // setPlayer("Player 1")
            var playerDetails ={
                player : "Player 1",
                color: "RED"
            }
            socket.emit("receiveDeails",playerDetails)
        }
        else {
            // setPlayer("Player 2")
            var playerDetails ={
                player : "Player 2",
                color: "PURPLE"
            }
            socket.emit("receiveDeails",playerDetails)
        }

        
    })

    socket.on("send_msg", (data) => {
        if(socket.id==players[0]) data[1]=0
        else data[1]=1

        io.emit("receive_msg", data)
    })
});


//---------------------DEPLOYMENT--------------------------

const __dirname1 = path.resolve();

    app.use(express.static(path.join(__dirname1,'/client/dist')));
    
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname1,"/client","dist","index.html"))
    });

//---------------------DEPLOYMENT--------------------------


server.listen(process.env.PORT || 3000, () => {
    console.log("Port connected to ", process.env.PORT || 3000);
})
