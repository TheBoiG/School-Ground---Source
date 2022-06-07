let Websokit = require('./websokit.js')
require('./http.js')
let life = 5;
class Game {
    constructor() {
        this.sokit = new Websokit(3008)
        this.game = {
            playerOne: {
                websokit: {},
                data: [],
                token: ""
            },
            playerTwo: {
                websokit: {},
                data: [],
                token: ""
            }
        }
        this.call()
    
        this.sokit.addMessage((s, data) => {
            data = data.toString()
            let game = this.game;
            console.log(data)
            // if(data.indexOf("token")!==-1){
            //     return;
            // }
            if (data.indexOf("play") !== -1) {
                this.play(data, s)
                console.log("play")
                return;
            }
            if (data.indexOf('liveIn') !== -1) {
                this.liveIn(data, s)
                return
            }
            
            if (data.indexOf("go") !== -1) {
                data = JSON.parse(data)
                if (game.playerOne.token == data.token) {
                    game.playerOne.data.Produce = data.Produce;
                    for (let p of data.Produce) {
                        game.playerOne.data.energy -= images[Number(p)].bloodVolume
                    }
                    game.playerOne.state = "go"
                }
                if (game.playerTwo.token == data.token) {
                    game.playerTwo.data.Produce = data.Produce;
                    game.playerTwo.state = "go"
                }
                if (game.playerOne.state == "go"
                    && game.playerTwo.state == "go") {
                    this.ready()
                }
                return;
            }
            if (data.indexOf("code") !== -1) {
                data = JSON.parse(data)

                this.rebot(data)
                return;
            }
            let obj = JSON.stringify(data)

        })
        


    }
    call(){
        setTimeout(()=>{
            try{
                if(this.game.playerOne.websokit){
                    this.game.playerOne.websokit.send(JSON.stringify({
                        flg:"token"
                    }))
                }
                if(this.game.playerTow.websokit){
                    this.game.playerTow.websokit.send(JSON.stringify({
                        flg:"token"
                    }))
                }
            }catch(e){

            }
            this.call()
        },3000)
    }
    rebot(data) {
        let game = this.game
        game.playerTwo.state = 'ready'
        game.playerOne.state = 'ready'
        let arr1 = [];
        while (arr1.length < 5) {
            let i = this.selectFrom(0, images.length-1)
            if (arr1.indexOf(i) == -1) {
                arr1.push(i)
            }
        }
        game.playerTwo.data.Cards = arr1
        arr1 = [];
        while (arr1.length < 5) {
            let i = this.selectFrom(0, images.length-1)
            if (arr1.indexOf(i) == -1) {
                arr1.push(i)
            }
        }
        if (life !== 10) {
            life++;
        }
        game.playerTwo.data.energy = life;
        game.playerOne.data.energy = life
        game.playerOne.data.Cards = arr1
        game.playerTwo.websokit.send(JSON.stringify({
            msg: "drawcard",
            data: {
                me: {
                    energy: game.playerTwo.data.energy,
                    life: game.playerTwo.data.life,
                    battle: [],
                    Cards: game.playerTwo.data.Cards
                },
                reload: true,
                state: "ready",
                to: {
                    energy: game.playerOne.data.energy,
                    life: game.playerOne.data.life,
                    battle: [] || [],
                }
            }
        }))
        game.playerOne.websokit.send(JSON.stringify({
            msg: "drawcard",
            data: {
                me: {
                    energy: game.playerOne.data.energy,
                    life: game.playerOne.data.life,
                    battle: [],
                    Cards: game.playerOne.data.Cards,
                },
                state: "ready",
                reload: true,
                to:
                {
                    energy: game.playerTwo.data.energy,
                    life: game.playerTwo.data.life,
                    Cards: game.playerTwo.data.Cards,
                    battle: [],
                }
            }
        }))
    }
    liveIn(data, s) {
        let game = this.game
        data = JSON.parse(data)
        if (!game.playerOne.token || game.playerOne.token == data.token || game.playerOne.websokit && game.playerOne.websokit.readyState == 3) {
            game.playerOne.token = data.token
            game.playerOne.websokit = s;
        } else if (!game.playerTwo.token || game.playerTwo.token == data.token || game.playerTwo.websokit && game.playerTwo.websokit.readyState == 3) {
            game.playerTwo.token = data.token
            game.playerTwo.websokit = s;
        } else {
            s.send(JSON.stringify({
                msg: "device login fail!"
            }))
        }
    }
    play(data, s) {
        let game = this.game;
        data = JSON.parse(data)
        if (game.playerOne.token == data.token || game.playerOne.websokit && game.playerOne.websokit.readyState == 3) {
            game.playerOne.token = data.token
            game.playerOne.websokit = s;
            game.playerOne.state = 'ready'
        } else if (game.playerTwo.token == data.token || game.playerOne.websokit && game.playerOne.websokit.readyState == 3) {
            game.playerTwo.token = data.token
            game.playerTwo.websokit = s;
            game.playerTwo.state = 'ready'
        }
        console.log(game.playerTwo.state,game.playerOne.state)
        if (game.playerOne.state == 'ready' && game.playerTwo.state == 'ready') {
            let arr1 = [];
            while (arr1.length < 5) {
                let i = this.selectFrom(0, images.length - 1)
                if (arr1.indexOf(i) == -1) {
                    arr1.push(i)
                }
            }
            game.playerOne.data = {}
            game.playerOne.data.Cards = arr1;
            game.playerOne.data.battle = []
            game.playerOne.data.energy = 5
            game.playerOne.data.life = 20
            arr1 = [];
            while (arr1.length < 5) {
                let i = this.selectFrom(0, images.length-1)
                if (arr1.indexOf(i) == -1) {
                    arr1.push(i)
                }
            }
            console.log("發牌成功")
            game.playerTwo.data = {}
            game.playerTwo.data.Cards = arr1;
            game.playerTwo.data.battle = []
            game.playerTwo.data.energy = 5
            game.playerTwo.data.life = 20
            
            game.playerTwo.websokit.send(JSON.stringify({
                msg: "drawcard",
                data: {
                    me: game.playerTwo.data,
                    state: "ready",
                    to: {
                        energy: game.playerOne.data.energy,
                        life: game.playerOne.data.life,
                        battle: game.playerOne.data.battle || [],
                    }
                }
            }))
            game.playerOne.websokit.send(JSON.stringify({
                msg: "drawcard",
                data: {
                    me: game.playerOne.data,
                    to: {
                        energy: game.playerTwo.data.energy,
                        life: game.playerTwo.data.life,
                        battle: [],
                        Cards: game.playerTwo.data.background
                    }
                }
            }))
        }
    }
    selectFrom(startNumber, endNumber) {
        var choice = endNumber - startNumber + 1;
        return Math.floor(Math.random() * choice + startNumber)
    }
    ready() {
        let flg = this.battle()
        let game = this.game;
        if (game.playerTwo.data.energy !== 5) {
            game.playerTwo.data.energy += 1
            game.playerOne.data.energy += 1
        }
        if (flg == "fail") {
            game.playerOne.data.life -= this.s.bloodVolume
        } else if (flg == "win") {
            game.playerTwo.data.life -= this.s.bloodVolume
        }
        let gameOver = false;
        if (game.playerTwo.data.life < 0 || game.playerOne.data.life < 0) {
            gameOver = true;
        }
        this.game.playerTwo.websokit.send(JSON.stringify({
            msg: "drawcard",
            flg: flg == "fail" ? "win" : "fail",
            gameOver,
            data: {
                me: {
                    energy: game.playerTwo.data.energy,
                    life: game.playerTwo.data.life,
                    battle: game.playerTwo.data.Produce,
                    Cards: game.playerTwo.data.Cards
                },
                state: "go",
                to: {
                    energy: game.playerOne.data.energy,
                    life: game.playerOne.data.life,
                    battle: game.playerOne.data.Cards || [],
                    battle: game.playerOne.data.Produce,
                }
            }
        }))
        game.playerOne.websokit.send(JSON.stringify({
            msg: "drawcard",
            flg,
            gameOver,
            data: {
                me: {
                    energy: game.playerOne.data.energy,
                    life: game.playerOne.data.life,
                    battle: game.playerOne.data.battle || [],
                    Cards: game.playerOne.data.Cards,
                    battle: game.playerOne.data.Produce,
                },

                state: "go",
                to:
                {
                    energy: game.playerTwo.data.energy,
                    life: game.playerTwo.data.life,
                    Cards: game.playerTwo.data.Cards,
                    battle: game.playerTwo.data.Produce,
                }
            }
        }))
    }
    battle() {
        let to = this.game.playerTwo.data.Produce.filter(e => e).map(se => images.filter(e => e.imageSrc == images.map(e => e.imageSrc)[se])[0])
        let me = this.game.playerOne.data.Produce.filter(e => e).map(se => images.filter(e => e.imageSrc == images.map(e => e.imageSrc)[se])[0])
        let toOne = to.shift()
        let meOne = me.shift()
        let ag = ""
        let test = 0;
        let flg = true;
        while (flg) {
            test++;
            
            meOne.defensivePower -= toOne.aggressivity
            toOne.defensivePower -= meOne.aggressivity;
            if (meOne.defensivePower <= 0 && toOne.defensivePower > 0) {
                console.log("fail")
                let tmp = me.shift()
                if (tmp) {
                    meOne = tmp;
                } else {
                    ag = "fail"
                    flg = false;
                    
                }
            } else if (meOne.defensivePower > 0 && toOne.defensivePower <= 0) {
                console.log("win")
                let tmp = to.shift()
                if (tmp) {
                    toOne = tmp;
                } else {
                    ag = "win"
                    flg = false;
                    
                }
            } else if (meOne.defensivePower <= 0 && toOne.defensivePower <= 0) {
                let tmp = me.shift()
                let tmp1 = to.shift()
                if (tmp && !tmp1) {
                    ag = "win"
                    flg = false;
                } else if (!tmp && tmp1) {
                    ag = "fail"
                    flg = false;
                } else if (!tmp && !tmp1) {
                    ag = "draw"
                    flg = false;
                }
            }
            if (ag == "win") {
                this.s = meOne
            } else if (ag == "fail") {
                this.s = toOne
            }
        }
        return ag
    }
    setState(ag) {
        if (ag == "fail") {
            his.game.playerOne.send({

            })
        } else {

        }
        console.log(ag)
    }
}
let images = [
    {
        imageSrc: "Pencil.png",
        aggressivity: 2,
        defensivePower: 1,
        bloodVolume: 1
    },
    {
        imageSrc: "Rubber.png",
        aggressivity: 1,
        defensivePower: 2,
        bloodVolume: 1
    },
    {
        imageSrc: "Paper.png",
        aggressivity: 1,
        defensivePower: 1,
        bloodVolume: 1,
    },
    {
        imageSrc: 'Chalk.png',
        aggressivity: 1,
        bloodVolume: 1,
        defensivePower: 1
    },
    {
        imageSrc: 'Pen.png',
        aggressivity: 3,
        bloodVolume: 3,
        defensivePower: 2

    },
    {

        imageSrc: 'mechanicalPencil.png',
        aggressivity: 1,
        bloodVolume: 1,
        defensivePower: 1

    },
    {
        imageSrc: 'highlighter.png',
        aggressivity: 2,
        bloodVolume: 3,
        defensivePower: 1

    },


    {

        imageSrc: 'Calculator.png',
        aggressivity: 2,
        bloodVolume: 5,
        defensivePower: 6

    },
    {

        imageSrc: 'Scissor.png',
        aggressivity: 5,
        bloodVolume: 5,
        defensivePower: 3

    },
    {

        imageSrc: 'Stapler.png',
        aggressivity: 4,
        bloodVolume: 5,
        defensivePower: 3

    },
    {

        imageSrc: 'HolePuncher.png',
        aggressivity: 1,
        bloodVolume: 5,
        defensivePower: 8
    },
    {

        imageSrc: 'Laptop.png',
        aggressivity: 3,
        bloodVolume: 10,
        defensivePower: 9,
    },
    {

        imageSrc: 'Smartwatch.png',
        aggressivity: 5,
        bloodVolume: 10,
        defensivePower: 5,
    },
]

let games = new Game()

let Calls = {};
