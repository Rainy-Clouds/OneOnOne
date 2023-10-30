// Strength, Speed, Cunning, Fatigue
const playerStats = [6, 6, 6, 30];
const enemyStats = [6, 6, 6, 30];
const options = ["Attack", "Defend"];
let playerStartFatigue, enemyStartFatigue, turnInProgress, playerWent, playerAtk;
let canvas, canvasAnim, context;
let frame = 0;

let enemyAttack = "";

function initialize()
{
    startFight();
    setUpCanvas();

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

    attackButton.disabled = turnInProgress;
    defendButton.disabled = turnInProgress;
    finishingMoveButton.disabled = !(playerStats[3] >= enemyStats[3] * 2 || enemyStats[3] < 0) || turnInProgress;

    if(turnInProgress && !playerWent && !canvasAnim.mario.attacking)
    {
        playerWent = true;

        if(enemyAttack === "Attack")
        {
            canvasAnim.koopa.attack();
            attackMethod(enemyStats, playerAtk, playerStats, playerStartFatigue, false, "Enemy");
            enemyLog.innerHTML += "Attacked </br>";
        }
        if(enemyAttack === "Finishing Move")
        {
            attackMethod(enemyStats, playerAtk, playerStats, playerStartFatigue, true, "Enemy");
            enemyLog.innerHTML += "Did a Finishing Move </br>";
        }
    }
    if(turnInProgress && playerWent && !canvasAnim.koopa.attacking && !canvasAnim.mario.defending)
    {
        turnInProgress = false;
    }
}

function startFight()
{
    setPlayer(playerStats);
    setPlayer(enemyStats);

    playerStartFatigue = playerStats[3];
    enemyStartFatigue = enemyStats[3];

    turnInProgress = false;
    playerWent = false;
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
}

function playTurn(playerAttack)
{
    turnInProgress = true;
    playerWent = false;
    playerAtk = playerAttack;

    if((enemyStats[3] >= playerStats[3] * 2 || playerStats[3] < 0))
    {
        enemyAttack = "Finishing Move"
    }
    else
    {
        enemyAttack = options[getRandInt(0, options.length - 1)];
    }

    if(playerAttack === "Attack")
    {
        canvasAnim.mario.attack();
        attackMethod(playerStats, enemyAttack, enemyStats, enemyStartFatigue, false, "Mario");
        playerLog.innerHTML += "Attacked </br>";
    }
    if(playerAttack === "Defend" && enemyAttack === "Defend")
    {
        canvasAnim.mario.defend(true);
        canvasAnim.koopa.defend(true);
    }
    if(playerAttack === "Finishing Move")
    {
        attackMethod(playerStats, enemyAttack, enemyStats, enemyStartFatigue, true, "Mario");
        playerLog.innerHTML += "Did a Finishing Move </br>";
    }

    if(playerAttack === "Defend")
    {
        playerLog.innerHTML += "Defended </br>"
    }
    if(enemyAttack === "Defend")
    {
        enemyLog.innerHTML += "Defended </br>"
    }

    update();
}

function attackMethod(stats, oppAttack, oppStats, oppStartFatigue, finishing, name)
{
    let diff = 0;
    if(finishing)
    {
        if(oppAttack === "Defend")
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
        if(oppAttack === "Defend")
        {
            diff = ((stats[0] + stats[1] + stats[2]) / getRandInt(1, 3)) - (oppStats[1] + oppStats[2]);
        }
        else
        {
            diff = ((stats[0] + stats[1] + stats[2]) / getRandInt(1, 3)) - (oppStats[1] + getRandInt(1, 6));
        }
    }
    

    console.log(diff);
    if(diff > 0)
    {
        if(finishing)
        {
            wintext.innerHTML = `${name} wins!`;
        }
        else
        {
            oppStats[3] -= diff;
        }
    }
    else if(oppAttack === "Defend")
    {
        oppStats[3] += getRandInt(1, 6);
        if(oppStats[3] > oppStartFatigue)
        {
            oppStats[3] = oppStartFatigue;
        }
    }
}

function getRandInt(min, max)
{
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Everything beneath this comment works with the Canvas and animations

class CanvasAnimations
{
    constructor()
    {
        console.log("test");
        this.mario = new Mario(0, 350);
        this.koopa = new Koopa(500, 350);
    }
    update()
    {
        frame++;

        this.mario.update();
        this.koopa.update();
    }
    render(ctx)
    {
        this.koopa.render(ctx);
        this.mario.render(ctx);
    }
}

class Mario
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
        this.frame = 0;
        this.startingframe = 0;
        this.image = document.getElementById("marioimages");
        this.state = "idle";
        this.attacking = false;
        this.defending = false;
        this.hurt = false;
        this.staticdefend = false;
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
                if(!canvasAnim.koopa.defending && enemyAttack === "Defend")
                {
                    canvasAnim.koopa.defend();
                }
            }
            else if(frame - this.startingframe < 16)
            {
                this.frame = 3;
            }
            else if(frame - this.startingframe < 30)
            {
                this.frame = 4;
                if(!canvasAnim.koopa.hurt && !(enemyAttack === "Defend"))
                {
                    canvasAnim.koopa.getHurt();
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
                this.attacking = false;
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
    }
    attack()
    {
        this.state = "runTo";
        this.attacking = true;
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
    render(ctx)
    {
        ctx.drawImage(this.image, 0, 128 * this.frame, 196, 128, this.x, this.y, 294, 192);
    }
}

class Koopa
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
        this.frame = 0;
        this.state = "idle";
        this.startingframe = 0;
        this.image = document.getElementById("koopaimages");
        this.attacking = false;
        this.defending = false;
        this.hurt = false;
        this.staticdefend = false;
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
            if(this.x <= 200 && playerAtk === "Defend" && !canvasAnim.mario.defending)
            {
                canvasAnim.mario.defend();
            }
            if(this.x <= 150 && !(playerAtk === "Defend") && !canvasAnim.mario.hurt)
            {
                canvasAnim.mario.getHurt();
            }
            if(this.x <= 45)
            {
                this.state = "return";
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
                this.attacking = false;
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
    }
    attack()
    {
        this.state = "enterShell"
        this.startingframe = frame;
        this.attacking = true;
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
    render(ctx)
    {
        ctx.drawImage(this.image, 0, 128 * this.frame, 196, 128, this.x, this.y, 294, 192);
    }
}

function setUpCanvas()
{
    canvas = document.querySelector("canvas");
    canvas.width = 800;
    canvas.height = 600;

    context = canvas.getContext('2d');
    canvasAnim = new CanvasAnimations();

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