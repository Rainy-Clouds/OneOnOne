// Strength, Speed, Cunning, Fatigue, Starting Fatigue, Current Move, Animation object
const playerStats = [6, 6, 6, 30, 30, "", null];
const enemyStats = [6, 6, 6, 30, 30, "", null];
const options = ["Attack", "Defend"];
const deadPlayers = [];
let winningPlayer;
let turnInProgress, gameInProgress;
let canvas, canvasAnim, context;
let frame = 0;

function initialize()
{
    setUpCanvas();
    startFight();

    update();
}

function update()
{
    strengthTag.innerHTML = `Strength: ${playerStats[0]}`;
    speedTag.innerHTML = `Speed: ${playerStats[1]}`;
    cunningTag.innerHTML = `Cunning: ${playerStats[2]}`;
    fatigueTag.innerHTML = `Fatigue: ${playerStats[3]}`;

    EstrengthTag.innerHTML = `Strength: ${enemyStats[0]}`;
    EspeedTag.innerHTML = `Speed: ${enemyStats[1]}`;
    EcunningTag.innerHTML = `Cunning: ${enemyStats[2]}`;
    EfatigueTag.innerHTML = `Fatigue: ${enemyStats[3]}`;

    attackButton.disabled = turnInProgress || !gameInProgress;
    defendButton.disabled = turnInProgress || !gameInProgress;
    finishingMoveButton.disabled = !(playerStats[3] >= enemyStats[3] * 2 || enemyStats[3] < 0) || turnInProgress || !gameInProgress;
}

function startFight()
{
    setPlayer(playerStats);
    setPlayer(enemyStats);

    turnInProgress = false;
    gameInProgress = true;

    document.getElementById("attackButton").addEventListener("click", function(){playTurn("Attack");});
    document.getElementById("defendButton").addEventListener("click", function(){playTurn("Defend");});
    document.getElementById("finishingMoveButton").addEventListener("click", function(){playTurn("Finishing Move");});
}

function setPlayer(playerArray)
{
    let idx1 = getRandInt(0, 3);
    let idx2 = getRandInt(0, 3);
    while(idx2 == idx1)
    {
        idx2 = getRandInt(0, 3);
    }

    for(let i = 0; i < 4; i++)
    {
        let multiplier = 1;
        if(i == 3)
        {
            multiplier *= 6;
        }

        if(i == idx1 || i == idx2)
        {
            playerArray[i] += getRandInt(0, multiplier); 
        }
        else
        {
            playerArray[i] += getRandInt(-multiplier, 0); 
        }
    }

    playerArray[4] = playerArray[3];
}

function playTurn(playerAttack)
{
    turnInProgress = true;
    playerStats[5] = playerAttack;

    if((enemyStats[3] >= playerStats[3] * 2 || playerStats[3] < 0))
    {
        enemyStats[5] = "Finishing Move"
    }
    else
    {
        enemyStats[5] = options[getRandInt(0, options.length - 1)];
    }

    if(playerAttack === "Attack")
    {
        playerStats[6].attack();
    
        playerLog.innerHTML += "Attacked </br>";
    }
    if(playerAttack === "Finishing Move")
    {
        canvasAnim.dfx.fadeIn = true;
        playerStats[6].finishingMove();

        playerLog.innerHTML += "Did a Finishing Move </br>";
    }

    if(playerAttack === "Defend" && enemyStats[5] === "Defend")
    {
        playerStats[6].defend(true);
        enemyStats[6].defend(true);
    }
    else if(playerAttack === "Defend")
    {
        halfTurn();
    }

    if(playerAttack === "Defend")
    {
        playerLog.innerHTML += "Defended </br>"
    }
    if(enemyStats[5] === "Defend")
    {
        enemyLog.innerHTML += "Defended </br>"
    }

    if(playerAttack === "Defend" && enemyStats[5] === "Defend")
    {
        let pHeal = getRandInt(1, 6);
        let eHeal = getRandInt(1, 6);

        playerStats[3] += pHeal;
        if(playerStats[3] > playerStats[4])
        {
            playerStats[3] = playerStats[4];
        }
        canvasAnim.addMarker(playerStats[6].centerx + getRandInt(-40, 40), playerStats[6].y, pHeal);

        enemyStats[3] += eHeal;
        if(enemyStats[3] > enemyStats[4])
        {
            enemyStats[3] = enemyStats[4];
        }
        canvasAnim.addMarker(enemyStats[6].centerx + getRandInt(-40, 40), enemyStats[6].y, eHeal);
    }

    update();
}

function halfTurn()
{
    canvasAnim.dfx.fadeIn = false;

    if(!(!(enemyStats[5] === "Finishing Move") && deadPlayers[0] == enemyStats[6]))
    {
        if(enemyStats[5] === "Attack")
        {
            enemyStats[6].attack();

            enemyLog.innerHTML += "Attacked </br>";
        }
        if(enemyStats[5] === "Finishing Move")
        {
            canvasAnim.dfx.fadeIn = true;
            enemyStats[6].finishingMove();
            
            enemyLog.innerHTML += "Did a Finishing Move </br>";
        }
        if(enemyStats[5] === "Defend")
        {
            turnInProgress = false;
        }
    }
    else
    {
        finishTurn();
    }
}

function finishTurn()
{
    turnInProgress = false;
    canvasAnim.dfx.fadeIn = false;

    announceWinner();
}

function attackMethod(stats, oppStats, finishing)
{
    let diff = 0;
    if(finishing)
    {
        if(oppStats[5] === "Defend")
        {
            diff = ((stats[0] + stats[1]) / getRandInt(1, 3)) - (oppStats[1] + oppStats[2]);
        }
        else
        {
            diff = ((stats[0] + stats[1]) / getRandInt(1, 3)) - (oppStats[1] + getRandInt(1, 6));
        }
    }
    else
    {
        if(oppStats[5] === "Defend")
        {
            diff = ((stats[0] + stats[1] + stats[2]) / getRandInt(1, 3)) - (oppStats[1] + oppStats[2]);
        }
        else
        {
            diff = ((stats[0] + stats[1] + stats[2]) / getRandInt(1, 3)) - (oppStats[1] + getRandInt(1, 6));
        }
    }

    diff = Math.round(diff);
    
    console.log(diff);
    if(diff > 0)
    {
        if(finishing)
        {
            deadPlayers.push(oppStats[6]);
            winningPlayer = stats[6];
        }
        else
        {
            oppStats[3] -= diff;
        }

        canvasAnim.addMarker(oppStats[6].centerx + getRandInt(-40, 40), oppStats[6].y, -diff);
    }
    else if(oppStats[5] === "Defend")
    {
        let heal = getRandInt(1, 6)
        oppStats[3] += heal;
        if(oppStats[3] > oppStats[4])
        {
            oppStats[3] = oppStats[4];
        }
        canvasAnim.addMarker(oppStats[6].centerx + getRandInt(-40, 40), oppStats[6].y, heal);
    }
    else
    {
        canvasAnim.addMarker(oppStats[6].centerx + getRandInt(-40, 40), oppStats[6].y, 0);
    }
}

function announceWinner()
{
    if(deadPlayers.length == 1)
    {
        deadPlayers[0].startingframe = frame;
        deadPlayers[0].state = "dead";
        winningPlayer.state = "win";
    
        wintext.innerHTML = `${winningPlayer.name} wins!`;
        gameInProgress = false;
    }
    else if(deadPlayers.length == 2)
    {
        deadPlayers[0].state = "dead";
        deadPlayers[0].startingframe = frame;
        deadPlayers[1].state = "dead";
        deadPlayers[1].startingframe = frame;

        wintext.innerHTML = "Nobody Wins?!";
        gameInProgress = false;
    }
}

const getRandInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// ========================== Everything beneath this comment works with the Canvas and animations ==============================

class CanvasAnimations
{
    constructor()
    {
        console.log("test");
        this.mario = new Mario(0, 350);
        this.koopa = new Koopa(500, 350);
        this.dfx = new DarkFX(0.3);
        this.background = document.getElementById("bg");

        this.markers = [];
    }
    deleteMarker(marker)
    {
        this.markers.splice(this.markers.indexOf(marker), 1);
    }
    addMarker(x, y, v)
    {
        this.markers.push(new Marker(x, y, v));
    }
    update()
    {
        frame++;

        this.mario.update();
        this.koopa.update();
        this.dfx.update();

        for(let i = 0; i < this.markers.length; i++)
        {
            this.markers[i].update();
        }
    }
    render(ctx)
    {
        ctx.drawImage(this.background, 0, 0);

        this.dfx.render(ctx);
        this.koopa.render(ctx);
        this.mario.render(ctx);

        for(let i = 0; i < this.markers.length; i++)
        {
            this.markers[i].render(ctx);
        }
    }
}

class Mario
{
    constructor(x, y)
    {
        this.x = x;
        this.centerx = x + 120;
        this.y = y;
        this.frame = 0;
        this.startingframe = 0;
        this.image = document.getElementById("marioimages");
        this.state = "idle";
        this.defending = false;
        this.hurt = false;
        this.staticdefend = false;
        this.finishing = false;
        this.name = "Mario";
        this.called = false;
    }
    update()
    {
        if(this.state === "idle")
        {
            this.frame = 0;
        }
        if(this.state === "runTo")
        {
            if(frame % 12 < 6)
            {
                this.frame = 1;
            }
            else
            {
                this.frame = 0;
            }

            this.x += 8;
            if(this.x >= 375)
            {
                this.state = "attack";
                this.startingframe = frame;
            }
        }
        if(this.state === "attack")
        {
            if(frame - this.startingframe < 13)
            {
                this.frame = 2;
                if(!enemyStats[6].defending && enemyStats[5] === "Defend")
                {
                    enemyStats[6].defend();
                }
            }
            else if(frame - this.startingframe < 16)
            {
                this.frame = 3;
            }
            else if(frame - this.startingframe < 30)
            {
                this.frame = 4;
                if(!enemyStats[6].hurt && !(enemyStats[5] === "Defend"))
                {
                    enemyStats[6].getHurt();
                }
                if(!this.called)
                {
                    attackMethod(playerStats, enemyStats, this.finishing);
                    this.called = true;
                }
            }
            else
            {
                this.state = "runBack";
            }
        }
        if(this.state === "runBack")
        {
            if(frame % 12 < 6)
            {
                this.frame = 9;
            }
            else
            {
                this.frame = 10;
            }

            this.x -= 8;
            if(this.x <= 0)
            {
                this.x = 0;
                this.state = "idle";
                this.finishing = false;
                halfTurn();
            }
        }
        if(this.state === "defend")
        {
            this.defending = true;
            this.frame = 8;
            if(frame - this.startingframe > 5 && frame - this.startingframe < 10 && !this.staticdefend)
            {
                this.x = -20;
            }
            else
            {
                this.x = 0;
            }

            if(frame - this.startingframe >= 35)
            {
                this.state = "idle";
                this.defending = false;

                if(this.staticdefend)
                {
                    finishTurn();
                }
            }
        }
        if(this.state === "hurt")
        {
            this.hurt = true;
            this.frame = 11;
            if(frame - this.startingframe > 2 && frame - this.startingframe < 7)
            {
                this.x = -20;
            }
            else
            {
                this.x = 0;
            }

            if(frame - this.startingframe >= 35)
            {
                this.state = "idle";
                this.hurt = false;
            }
        }
        if(this.state === "dead")
        {
            if(frame - this.startingframe < 10)
            {
                this.frame = 6;
            }
            else
            {
                this.frame = 7;
            }
        }
        if(this.state === "win")
        {
            this.frame = 5;
        }
    }
    attack()
    {
        this.state = "runTo";
        this.called = false;
    }
    defend(stat)
    {
        this.state = "defend";
        this.startingframe = frame;
        this.staticdefend = stat;
        this.defending = true;
    }
    getHurt()
    {
        this.state = "hurt";
        this.startingframe = frame;
    }
    finishingMove()
    {
        this.state = "runTo";
        this.finishing = true;
        this.called = false;
    }
    render(ctx)
    {
        if(this.finishing)
        {
            ctx.shadowBlur = 20;
            ctx.shadowColor = "yellow";
        }
        ctx.drawImage(this.image, 0, 128 * this.frame, 196, 128, this.x, this.y, 294, 192);
        ctx.shadowBlur = 0;
    }
}

class Koopa
{
    constructor(x, y)
    {
        this.x = x;
        this.centerx = x + 120;
        this.y = y;
        this.frame = 0;
        this.state = "idle";
        this.startingframe = 0;
        this.image = document.getElementById("koopaimages");
        this.defending = false;
        this.hurt = false;
        this.staticdefend = false;
        this.finishing = false;
        this.name = "Koopa";
    }
    update()
    {
        if(this.state === "idle")
        {
            this.frame = 0;
        }
        if(this.state === "enterShell")
        {
            if(frame - this.startingframe < 5)
            {
                this.frame = 1;
            }
            else if(frame - this.startingframe < 15)
            {
                this.frame = 2;
            }
            else
            {
                this.state = "attack";
            }
        }
        if(this.state === "attack")
        {
            this.frame = 2;
            this.x -= 25;
            if(this.x <= 200 && playerStats[5] === "Defend" && !playerStats[6].defending)
            {
                playerStats[6].defend();
            }
            if(this.x <= 150 && !(playerStats[5] === "Defend") && !playerStats[6].hurt)
            {
                playerStats[6].getHurt();
            }
            if(this.x <= 45)
            {
                this.state = "return";
                attackMethod(enemyStats, playerStats, this.finishing);
            }
        }
        if(this.state === "return")
        {
            this.frame = 6;
            this.x += 25;
            if(this.x >= 500)
            {
                this.x = 500;
                this.state = "idle";
                this.finishing = false;
                finishTurn();
            }
        }
        if(this.state === "defend")
        {
            this.defending = true;

            if(frame - this.startingframe > 16 && frame - this.startingframe < 21 && !this.staticdefend)
            {
                this.y = 365;
            }
            else
            {
                this.y = 350;
            }

            if(frame - this.startingframe < 5)
            {
                this.frame = 1;
            }
            else if(frame - this.startingframe < 35)
            {
                this.frame = 2;
            }
            else
            {
                this.state = "idle";
                this.defending = false;
            }
        }
        if(this.state === "hurt")
        {
            this.hurt = true;

            if(frame - this.startingframe < 25)
            {
                this.frame = 4;
                if(frame - this.startingframe < 10)
                {
                    this.y = 365;
                }
                else
                {
                    this.y = 350;
                }
            }
            else
            {
                this.state = "idle";
                this.hurt = false;
            }
        }
        if(this.state === "win")
        {
            this.frame = 3;
        }
        if(this.state === "dead")
        {
            if(frame - this.startingframe < 5)
            {
                this.frame = 4;
            }
            else
            {
                if(frame % 30 < 15)
                {
                    this.frame = 5;
                }
                else
                {
                    this.frame = 7;
                }
            }
        }
    }
    attack()
    {
        this.state = "enterShell"
        this.startingframe = frame;
    }
    defend(stat)
    {
        this.state = "defend";
        this.startingframe = frame;
        this.staticdefend = stat;
        this.defending = true;
    }
    getHurt()
    {
        this.state = "hurt";
        this.startingframe = frame;
    }
    finishingMove()
    {
        this.state = "enterShell";
        this.startingframe = frame;
        this.finishing = true;
    }
    render(ctx)
    {
        if(this.finishing)
        {
            ctx.shadowBlur = 20;
            ctx.shadowColor = "yellow";
        }
        ctx.drawImage(this.image, 0, 128 * this.frame, 196, 128, this.x, this.y, 294, 192);
        ctx.shadowBlur = 0;
    }
}

class DarkFX
{
    constructor(maxShade)
    {
        this.shade = 0;
        this.max = maxShade;
        this.fadeIn = false;
    }
    update()
    {
        if(this.fadeIn)
        {
            this.shade += 0.025;
            if(this.shade >= this.max)
            {
                this.shade = this.max;
            }
        }
        else
        {
            this.shade -= 0.025;
            if(this.shade <= 0)
            {
                this.shade = 0;
            }
        }
    }
    render(ctx)
    {
        ctx.globalAlpha = this.shade;
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, 800, 600);
        ctx.globalAlpha = 1.0;
    }
}

class Marker
{
    constructor(x, y, val)
    {
        this.x = x;
        this.y = y;

        this.val = val == 0 ? 0 : val > 0 ? `+${val}` : val;
        this.image = val == 0 ? neutmarker : val > 0 ? healmarker : hitmarker;

        this.fade = 0.1;
        this.fadeout = false;
        this.initframe = frame;
    }
    update()
    {
        this.y -= 2;
        if(this.fadeout)
        {
            this.fade -= 0.05;
            if(this.fade <= 0)
            {
                this.fade = 0;
                canvasAnim.deleteMarker(this);
            }
        }
        else
        {
            this.fade += 0.1;
            if(frame - this.initframe > 15)
            {
                this.fadeout = true;
            }
        }
    }
    render(ctx)
    {
        ctx.globalAlpha = this.fade;
        ctx.font = "30px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";

        ctx.drawImage(this.image, this.x, this.y, 75, 75);
        ctx.fillText(this.val, this.x + 35, this.y + 47);
        ctx.globalAlpha = 1;
    }
}

function setUpCanvas()
{
    canvas = document.querySelector("canvas");
    canvas.width = 800;
    canvas.height = 600;

    context = canvas.getContext('2d');
    canvasAnim = new CanvasAnimations();

    playerStats[6] = canvasAnim.mario;
    enemyStats[6] = canvasAnim.koopa;

    animate();
}

function animate()
{
    context.clearRect(0, 0, canvas.width, canvas.height);

    update();
    canvasAnim.update(context);
    canvasAnim.render(context);
    requestAnimationFrame(animate);
}