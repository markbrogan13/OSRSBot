var robot = require('robotjs');

/*
    Use mouseMoveSmooth with random motions either 2-3 times formatting a random human's movement
    sleep for varying lengths in a given range eg: [6000-9000ms] with randomizer
    Making sure that we are getting the next tree
    store array/map of all pixel locations of inventory slot
    check for filled inventory (check last availiable slot)
*/

const minWait = 6000;
const maxWait = 9000;
const totalRuns = 10000;

// base pixels for screenshot offest
const screenCap = {
    min_x: 4,
    min_y: 64,
    max_x: 520,
    max_y: 400
};

// inventory last slot box
const invScreenCap = { 
    min_x: 688,
    min_y: 495,
    max_x: 725,
    max_y: 517,
    logValue: "a3854c"
};

const invDrop = {
    start_x: 581,
    start_y: 290,
    delta_x: 42,
    delta_y: 37
};

// tree colors in hex
const treeColors = ["705634", "634c43", "5b463f", "574328", "765b37", "60492c"];

async function doCutting() {
    console.log("Starting..");
    await sleep(5000);
    robot.moveMouse(0, 0);
    //robot.mouseClick();
    
    var count = 0;
    while (count < totalRuns) {
        await sleep(getRandomMs(minWait, maxWait));
        findTree();
        count++;
        console.log("\nNumber: " + count + "\n");
    }
}

function findTree() {
    var screen = robot.screen.capture(
            screenCap.min_x, 
            screenCap.min_y, 
            screenCap.max_x - screenCap.min_x, 
            screenCap.max_y - screenCap.min_y
        );

    if (!checkInventoryFull()) {
        for (var x = screenCap.min_x; x < screenCap.max_x - 1; x+=5) {
            for (var y = screenCap.min_y; y < screenCap.max_y - 1; y+=5) {
                // console.log(screen.colorAt(x - screenCap.min_x, y - screenCap.min_y));
                if (treeColors.includes(screen.colorAt(x - screenCap.min_x, y - screenCap.min_y))) {
                    robot.moveMouseSmooth(x, y, 2);
                    robot.mouseClick();
                    return;
                }
            }
        }
    }
}

function checkInventoryFull() {
    //TODO: Check to see if the inventory is full
    var screen = robot.screen.capture(
        invScreenCap.min_x,
        invScreenCap.min_y,
        invScreenCap.max_x - invScreenCap.min_x,
        invScreenCap.max_y - invScreenCap.min_y
    );

    for (var x = invScreenCap.min_x; x < invScreenCap.max_x - 1; x++) {
        for (var y = invScreenCap.min_y; y < invScreenCap.max_y - 1; y++) {
            if (screen.colorAt(x - invScreenCap.min_x, y - invScreenCap.min_y) == invScreenCap.logValue) {
                dropLogs();
                return;
            }
        }
    }

    return false;
}

function dropLogs() {
    //TODO: Drop all logs in inventory (time this as human, try to get standard dev)
    // Starting px and delta x and y | START: [581, 290] DELTA Y: +35 DELTA X: +42

    robot.moveMouseSmooth(invDrop.start_x, invDrop.start_y);

    for (var y = invDrop.start_y; y <= invDrop.start_y + (invDrop.delta_y * 6); y += invDrop.delta_y) {
        for (var x = invDrop.start_x; x <= invDrop.start_x + (invDrop.delta_x * 3); x += invDrop.delta_x) {
            // console.log(x, y);
            robot.keyToggle('shift', 'down');
            robot.moveMouseSmooth(x, y);
            robot.mouseClick();
            robot.keyToggle('shift', 'up');
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getRandomMs(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive 
}

function quitProgram() {
    // TODO: this
}

doCutting();
