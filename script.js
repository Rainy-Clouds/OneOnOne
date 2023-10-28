// Strength, Speed, Cunning, Fatigue
const playerStats = [6, 6, 6, 30];
const enemyStats = [6, 6, 6, 30];
const options = ["Attack", "Defend"];
let playerStartFatigue, enemyStartFatigue;

function initialize()
{
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

    finishingMoveButton.disabled = !(playerStats[3] >= enemyStats[3] * 2 || enemyStats[3] < 0);
}

function startFight()
{
    setPlayer(playerStats);
    setPlayer(enemyStats);

    playerStartFatigue = playerStats[3];
    enemyStartFatigue = enemyStats[3];
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
    let enemyAttack = "";
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
        attackMethod(playerStats, enemyAttack, enemyStats, enemyStartFatigue, false, "Mario");
        playerLog.innerHTML += "Attacked </br>";
    }
    if(playerAttack === "Finishing Move")
    {
        attackMethod(playerStats, enemyAttack, enemyStats, enemyStartFatigue, true, "Mario");
        playerLog.innerHTML += "Did a Finishing Move </br>";
    }
    if(enemyAttack === "Attack")
    {
        attackMethod(enemyStats, playerAttack, playerStats, playerStartFatigue, false, "Enemy");
        enemyLog.innerHTML += "Attacked </br>";
    }
    if(enemyAttack === "Finishing Move")
    {
        attackMethod(enemyStats, playerAttack, playerStats, playerStartFatigue, true, "Enemy");
        enemyLog.innerHTML += "Did a Finishing Move </br>";
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