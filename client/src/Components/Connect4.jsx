import React, { useEffect, useRef, useState } from 'react'
import './Connect4.css'
import redBall from '../ass/redBall.png'
import purpleBall from '../ass/purpleBall.png';
import { io } from 'socket.io-client';

const socket = io()



let data = new Array(7).fill().map(() => new Array(7).fill(0));
let lock = new Array(7).fill().map(() => new Array(7).fill(0));
const list = Array(7).fill(0);

for (let i = 0; i < 7; i++) {
    lock[6][i] = 1;
}

let count = 0;
let it = 0;


const Connect4 = () => {
    const [winner, setWinner] = useState('')
    const refs = useRef([]);
    const [player, setPlayer] = useState('')
    const [color, setColor] = useState('')
    const [joinmsg, setJoinmsg] = useState('')
    const joinRef = useRef();
    const playerRef = useRef();

    useEffect(() => {
        socket.emit("connecion_msg", {});

        socket.on("receiveDeails", (details) => {
            setColor(details.color);
            setPlayer(details.player);
        })

        // socket.on("receivePermit",(permit)=>{
        //     console.log(permit);
        //     setPermit(permit);
        //     console.log(permit);
        // })
    }, []);


    socket.on('join', (msg) => {
        setJoinmsg(msg);
        setTimeout(function () {
            joinRef.current.style.display = "none";

        }, 5000);
    })
    const toggle = (row, col) => {

        socket.emit("send_msg", [{ row, col }, 0]);
    }
    useEffect(() => {
        socket.on("receive_msg", (player_data) => {

            if (lock[player_data[0].row][player_data[0].col] && player_data[1] === it % 2) {
                // console.log(player_data[0].row, player_data[0].col);

                if (it % 2 === 0) {
                    const index = player_data[0].col * 7 + player_data[0].row;
                    const element = refs.current[index];


                    element.classList.add('fade-out');
                    setTimeout(() => {
                        element.innerHTML = `<img src='${redBall}'>`;
                        element.classList.remove('fade-out');
                        element.classList.add('fade-in');
                        setTimeout(() => {
                            element.classList.remove('fade-in');
                        }, 500); 
                    }, 500);
                    
                    data[player_data[0].row][player_data[0].col] = 1;
                    playerRef.current.innerHTML = `<img className='player-img' src='${purpleBall}'>`
                }


            else {

                const index = player_data[0].col * 7 + player_data[0].row;
                const element = refs.current[index];


                element.classList.add('fade-out');
                setTimeout(() => {
                    element.innerHTML = `<img src='${purpleBall}'>`;
                    element.classList.remove('fade-out');
                    element.classList.add('fade-in');
                    setTimeout(() => {
                        element.classList.remove('fade-in');
                    }, 500); 
                }, 500);
                
                data[player_data[0].row][player_data[0].col] = 2;
                playerRef.current.innerHTML = `<img className='player-img' src='${redBall}'>`
            }

            if (check_win(it, player_data[0].row, player_data[0].col)) {
                lock = new Array(7).fill().map(() => new Array(7).fill(0));
            };

            it = it + 1;
            lock[player_data[0].row][player_data[0].col] = 0;
            // console.log(lock);
            if (player_data[0].row > 0) lock[player_data[0].row - 1][player_data[0].col] = 1;
        }

        })
}, [socket]);



const check_win = (player, row, col) => {

    if (player % 2 == 0)
        player = 1;
    else
        player = 2;

    // Horizontal
    for (let i = 0; i < 7; i++) {

        if (data[row][i] === player) {
            count++;
        }
        else {
            count = 0;
        }
        if (count === 4) {
            setWinner(`Player ${player == 1 ? "Red" : "Purple"} wins`);
            return 1;
        }
    }

    // Vertical
    count = 0;
    for (let i = 0; i < 7; i++) {
        if (data[i][col] === player)
            count++;
        else
            count = 0;

        if (count === 4) {
            setWinner(`${player == 1 ? "Red" : "Purple"} wins`);
            return 1;
        }
    }

    // Diagonal 1 \
    let r, c;
    if (row - col >= 0) {
        r = row - col;
        c = 0;
    }
    else {
        c = col - row;
        r = 0;
    }

    count = 0;

    while (r < 7 && c < 7) {
        if (data[r][c] === player)
            count++;
        else
            count = 0;

        if (count === 4) {
            setWinner(`Player ${player == 1 ? "Red" : "Purple"} wins`);
            return 1;
        }
        r++, c++;
    }

    //    // Diagonal 2 /
    count = 0;
    if (row + col > 6) {
        r = (row + col) % 6;
        c = 6;
    }
    else {
        c = row + col;
        r = 0;
    }
    while (r < 7 && c >= 0) {
        if (data[r][c] === player)
            count++;
        else
            count = 0;

        if (count === 4) {
            setWinner(`Player ${player == 1 ? "Red" : "Purple"} wins`);
            return 1;
        }
        r++, c--;
    }

    count = 0;

    return 0;
}

const reset = () => {
    refs.current.map((ele) => {
        ele.innerHTML = ""
    })
    data = new Array(7).fill().map(() => new Array(7).fill(0));
    lock = new Array(7).fill().map(() => new Array(7).fill(0));
    for (let i = 0; i < 7; i++) {
        lock[6][i] = 1;
    }
    it = 0;
    setWinner('');
}


return (
    <div className="container">
        <div className="title">Connect - 4 </div>
        <div className="play-board">
            <div className="top">
                <div className="board">
                    {
                        list.map((item, i) => {
                            return (
                                <div className="col" key={i}>
                                    {list.map((item, j) => {
                                        return (
                                            <div key={i + j} className="boxes" ref={(box) => { refs.current[i * list.length + j] = box }} onClick={() => { toggle(j, i) }} ></div>
                                        )
                                    })}
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className="bottom">
                <div className="right">
                    <div className="player-turn">Player turn
                        <div className='img-container' ref={playerRef}>
                            <img className='player-img' src={redBall} />
                        </div>
                    </div>
                    <button className="reset" onClick={reset} disabled={!winner}>Reset</button>
                </div>

                <div className='winner'>{winner}</div>
                <div className="player">{player}{' || '}{color}</div>
                <p className='msg' ref={joinRef}>{joinmsg}</p>

            </div>
        </div>
    </div>
)
}

export default Connect4