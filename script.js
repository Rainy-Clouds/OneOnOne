// Strength, Speed, Cunning, Fatigue
const playerStats = [6, 6, 6, 30];
const enemyStats = [6, 6, 6, 30];

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
}

function startFight()
{
    setPlayer(playerStats);
    setPlayer(enemyStats);
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

function getRandInt(min, max)
{
    return Math.floor(Math.random() * (max - min + 1) + min);
}