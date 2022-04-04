document.addEventListener('DOMContentLoaded', () => {

    const game = document.querySelector('.game')
    const score = document.querySelector('.points')
    const end = document.getElementById('end')
    const result = document.getElementById('result')
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
    const board = []
    const size = 21
    let points = 206
    let playerPosition = 220
    createBoard()


    function createBoard() {
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
                    break
                case 5:
                    board[i].classList.add('enemy2')
                    break
                case 6:
                    board[i].classList.add('enemy3')
                    break
                case 7:
                    board[i].classList.add('enemy4')
                    break
            }
            game.appendChild(board[i])
        }
    }

    function endGame() {
        end.style.display = 'flex'
        document.removeEventListener('keydown', move)
        end.addEventListener('click', function() {
            window.location.reload(true)
        })
        comment.innerHTML = ''
        board[playerPosition].classList.remove('player', 'open-right', 'open-left', 'open-down', 'open-up')
        board[playerPosition].classList.add('path')
        clearInterval(changeMouthInterval)
    }

    //gathering points
    function ball() {
        if(board[playerPosition].classList.contains('ball')) {
            board[playerPosition].classList.remove('ball')
            points -= 1
            score.innerHTML = points
        }
        if(points == 0) {
            endGame()
        }
    }

    //enenmy class
    const directions = [1,size,-1,-size]
    class Enemy {
        constructor(name, enemyPosition, enemyDirection) {
            this.name = name
            this.enemyPosition = enemyPosition
            this.containsBall = true
            this.enemyDirection = enemyDirection
            this.previousEnemyDirection = []
        }
        //enemy movement
        go() {
            //clear path
            board[this.enemyPosition].classList.remove(this.name)
            this.containsBall ? board[this.enemyPosition].classList.add('ball') : board[this.enemyPosition].classList.add('path')

            //set direction
            let possibleDirections = []
            for(let i=0; i<directions.length;i++) {
                if(!board[this.enemyPosition+directions[i]].classList.contains('boarder')) {
                    possibleDirections.push(directions[i])
                }
            }
            let newDirections = []
            for(let i=0; i<possibleDirections.length; i++) {
                if((!this.previousEnemyDirection.includes(possibleDirections[i])) && (possibleDirections[i] != -this.enemyDirection)) {
                    newDirections.push(possibleDirections[i])
                }
            }
            this.previousEnemyDirection = newDirections
            if(newDirections.length>0) {
                this.enemyDirection = newDirections[Math.floor(Math.random()*newDirections.length)]
            }
            //movement, check if point should stan on this field 
            this.enemyPosition += this.enemyDirection
            board[this.enemyPosition].classList.contains('ball') ? this.containsBall = true : this.containsBall = false
            board[this.enemyPosition].classList.remove('ball')
            board[this.enemyPosition].classList.add(this.name)
            if(this.enemyPosition==playerPosition) {
                result.innerHTML = 'TOO BAD<br>RESTART'
                endGame()
            }
        }
        //interval for method go
        timer() {
            var that = this
            var inter = setInterval(function(){that.go();}, 200);
        }
    }

    const red = new Enemy('enemy', 22, 1)
    red.timer()
    const green = new Enemy('enemy2', 418, -1)
    green.timer()
    const pink = new Enemy('enemy3', 80, -21)
    pink.timer()
    const orange = new Enemy('enemy4', 360, 21)
    orange.timer()

    const enemies = [red, green, pink, orange]

    //opening mouth
    function changeMouth() {
        board[playerPosition].classList.add(mouth)
        setTimeout(function(){
            board[playerPosition].classList.remove('open-right', 'open-left', 'open-down','open-up')
        },300)
    }

    //interval for opening mouth
    let playerDirection = 1
    let mouth = 'open-right'
    const changeMouthInterval = setInterval(changeMouth,600)

    //move player based on direction
    function moveDirection(dir) {
        if(!board[playerPosition+dir].classList.contains('boarder')) {
            board[playerPosition].classList.remove('player')
            board[playerPosition].classList.add('path')
            playerPosition+=dir
            ball()
            board[playerPosition].classList.add('player') 
        }
    }

    //set direction on keydown 
    function move(k) {
        board[playerPosition].classList.remove('open-right', 'open-left', 'open-down','open-up')
        switch(k.keyCode) {
            case 37:
                playerDirection = -1
                mouth = 'open-left'
                moveDirection(playerDirection)
                break
            case 38:
                playerDirection = -size
                mouth = 'open-up'
                moveDirection(playerDirection)
                break
            case 39:
                playerDirection = 1
                mouth = 'open-right'
                moveDirection(playerDirection)
                break
            case 40:
                playerDirection = size
                mouth = 'open-down'
                moveDirection(playerDirection)
                break
        }
        enemies.forEach(enemy => {
            if(playerPosition==enemy.enemyPosition) {
                result.innerHTML = 'TOO BAD<br>RESTART'
                endGame()
            }
        })
    }
    
    document.addEventListener('keydown', move)

})