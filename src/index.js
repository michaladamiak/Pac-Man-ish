document.addEventListener('DOMContentLoaded', () => {

    const game = document.querySelector('.game')
    const score = document.querySelector('.points')
    const win = document.getElementById('win')
    const lose = document.getElementById('lose')
    const comment = document.querySelector('.score')

    const layout  = [
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
            1,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
            1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,0,1,
            1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,1,0,1,
            1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,
            1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,
            1,0,1,0,1,0,1,1,1,1,0,1,1,1,1,0,1,0,1,0,1,
            1,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,1,
            1,0,1,0,1,0,1,0,1,1,3,1,1,0,1,0,1,0,1,0,1,
            1,0,1,0,1,0,1,0,1,1,3,1,1,0,1,0,1,0,1,0,1,
            1,0,0,0,1,0,0,0,3,3,2,3,3,0,0,0,1,0,0,0,1,
            1,0,1,0,1,0,1,0,1,1,3,1,1,0,1,0,1,0,1,0,1,
            1,0,1,0,1,0,1,0,1,1,3,1,1,0,1,0,1,0,1,0,1,
            1,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,1,
            1,0,1,0,1,0,1,1,1,1,0,1,1,1,1,0,1,0,1,0,1,
            1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,
            1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,
            1,0,1,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,
            1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,0,1,
            1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,1,
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]

    let board = []
    const size = 21
    let points = 206
    let position = 220

    for(let i=0; i<layout.length; i++){
        board[i] = document.createElement("div")
        switch(layout[i]){
            case 0:
                board[i].classList.add('ball')
                break
            case 1:
                board[i].classList.add('boarder')
                break
            case 2:
                board[i].classList.add('player')
                break
            case 3:
                board[i].classList.add('path')
                break
            case 4:
                board[i].classList.add('enemy')
                // board[i].classList.add('ball')
                break
            case 5:
                board[i].classList.add('enemy2')
                // board[i].classList.add('ball')
                break
            case 6:
                board[i].classList.add('enemy3')
                // board[i].classList.add('ball')
                break
            case 7:
                board[i].classList.add('enemy4')
                // board[i].classList.add('ball')
                break
        }
        game.appendChild(board[i])
    }

    //zjadanie kulek
    function ball() {
        if(board[position].classList.contains('ball')) {
            board[position].classList.remove('ball')
            points -= 1
            score.innerHTML = points
        }
        if(points == 0) {
            document.removeEventListener('keydown', move)
            win.style.display = 'flex'
            win.addEventListener('click', function() {
                window.location.reload(true)
            })
            // clearInterval(enemy_move)
            score.innerHTML = 'gitara!'
            comment.innerHTML = ''
            // tutaj trzeba cos zmienic zeby nie bylo playera po wygraniu bo enenmy nadal moga zjesc
            board[position].classList.remove('player')
            board[position].classList.add('path')
            // position = 0 
        }
    }

    const directions_before = [1,size,-1,-size]
    class Enemy {
        constructor(nazwa, pozycja, kierunek) {
            this.nazwa = nazwa
            this.pozycja = pozycja
            this.warunek = true
            this.kierunek = kierunek
            this.pop_kier = []
        }

        idz() {
            //czyszczenie pola
            board[this.pozycja].classList.remove(this.nazwa)
            this.warunek ? board[this.pozycja].classList.add('ball') : board[this.pozycja].classList.add('path')

            //ustalanie kierunku
            let possible_directions = []
            for(let i=0; i<directions_before.length;i++) {
                if(!board[this.pozycja+directions_before[i]].classList.contains('boarder')) {
                    possible_directions.push(directions_before[i])
                }
            }
            let new_directions = []
            for(let i=0; i<possible_directions.length; i++) {
                if((!this.pop_kier.includes(possible_directions[i])) && (possible_directions[i] != -this.kierunek)) {
                    new_directions.push(possible_directions[i])
                }
            }
            this.pop_kier = new_directions
            if(new_directions.length>0) {
                this.kierunek = new_directions[Math.floor(Math.random()*new_directions.length)]
            }
            //krok, sprawdzenie czy byly ball na nastepnym polu, i czy byl player
            this.pozycja += this.kierunek
            board[this.pozycja].classList.contains('ball') ? this.warunek = true : this.warunek = false
            board[this.pozycja].classList.remove('ball')
            board[this.pozycja].classList.add(this.nazwa)
            if(this.pozycja==position) {
                // clearInterval(inter)
                // inter = ? 
                // trzeba dodać coś zeby przeciwnicy sie zatrzymywali
                document.removeEventListener('keydown', move)
                lose.style.display = 'flex'
                board[position].classList.remove('player')
                lose.addEventListener('click', function() {
                    window.location.reload(true)
                })
                score.innerHTML = 'lipa :/'
                comment.innerHTML = ''
                position = 0
            }
        }

        timer() {
            var that = this
            var inter = setInterval(function(){that.idz();}, 200);
        }
    }

    let czerwony = new Enemy('enemy', 22, 1)
    czerwony.timer()
    let zielony = new Enemy('enemy2', 418, -1)
    zielony.timer()
    let rozowy = new Enemy('enemy3', 80, -21)
    rozowy.timer()
    let pomaranczowy = new Enemy('enemy4', 360, 21)
    pomaranczowy.timer()

    const enemies = [czerwony, zielony, rozowy, pomaranczowy]

    


    // pierwszy model chodzenia enemy

    // let direction = 1
    // let condition = true
    // let enemy_position = 22
    // let prev_directions = []

    // function run() {
    //     //czyszczenie pola
    //     board[enemy_position].classList.remove('enemy')
    //     condition ? board[enemy_position].classList.add('ball') : board[enemy_position].classList.add('path')

    //     //ustalanie kierunku
    //     let possible_directions = []
    //     for(let i=0; i<directions_before.length;i++) {
    //         if(!board[enemy_position+directions_before[i]].classList.contains('boarder')) {
    //             possible_directions.push(directions_before[i])
    //         }
    //     }
    //     let new_directions = []
    //     for(let i=0; i<possible_directions.length; i++) {
    //         if((!prev_directions.includes(possible_directions[i])) && (possible_directions[i] != -direction)) {
    //             new_directions.push(possible_directions[i])
    //         }
    //     }
    //     // if(new_directions.includes(-direction))
    //     prev_directions = new_directions
    //     if(new_directions.length>0) {
    //         direction = new_directions[Math.floor(Math.random()*new_directions.length)]
    //     }
    //     //krok, sprawdzenie czy byly ball na nastepnym polu, i czy byl player
    //     enemy_position += direction
    //     board[enemy_position].classList.contains('ball') ? condition = true : condition = false
    //     board[enemy_position].classList.remove('ball')
    //     board[enemy_position].classList.add('enemy')
    //     if(enemy_position==position) {
    //         clearInterval(enemy_move)
    //         document.removeEventListener('keydown', move)
    //         lose.style.display = 'flex'
    //         board[position].classList.remove('player')
    //         lose.addEventListener('click', function() {
    //             window.location.reload(true)
    //         })
    //         score.innerHTML = 'lipa :/'
    //         comment.innerHTML = ''
    //     }
    // }
    // const enemy_move = setInterval(run, 200)

    

    //chodzenie 
    // let position = 220
    function move(k) {
        switch(k.keyCode) {
            case 37:
                if(!board[position-1].classList.contains('boarder')) {
                    board[position].classList.remove('player')
                    board[position].classList.add('path')
                    position-=1
                    ball()
                    board[position].classList.add('player') 
                }
                break
            case 38:
                if(!board[position-size].classList.contains('boarder')) {
                    board[position].classList.remove('player')
                    board[position].classList.add('path')
                    position-=size
                    ball()
                    board[position].classList.add('player') 
                }
                break
            case 39:
                if(!board[position+1].classList.contains('boarder')) {
                    board[position].classList.remove('player')
                    board[position].classList.add('path')
                    position+=1
                    ball()
                    board[position].classList.add('player') 
                }
                break
            case 40:
                if(!board[position+size].classList.contains('boarder')) {
                    board[position].classList.remove('player')
                    board[position].classList.add('path')
                    position+=size
                    ball()
                    board[position].classList.add('player') 
                }
                break
        }
        enemies.forEach(enemy => {
            if(position==enemy.pozycja) {
                // clearInterval(enemy_move)
                document.removeEventListener('keydown', move)
                lose.style.display = 'flex'
                board[position].classList.remove('player')
                board[position].classList.add('path')
                lose.addEventListener('click', function() {
                    window.location.reload(true)
                })
                score.innerHTML = 'lipa :/'
                comment.innerHTML = ''
                position = 0
            }
        })
    }
    
    document.addEventListener('keydown', move)

    // const tabela = [1,2,3,23,-23]

    // tabela.forEach(t => {
    //     if (t==3) {
    //         console.log(t)
    //         // break
    // }
    // })

    // for(let i=0; i<tabela.length; i++) {
    //     console.log(tabela[i])
    //     if(tabela[i]==3){
    //         break
    //     }
    // }

    // console.log(Math.floor(42/21))
    // 0 1
    // 1 2
    // 2 3
    // 4 5
    // jesli rzad enenmy < rzad player to idz w dół ewentualnie inne kierunku jak nie mozna 
    // jesli > idz w gore ewentualnie inne kierunki jak nie mozna 

    // let x = [1,2,3]

    // console.log(x.includes(4))
})