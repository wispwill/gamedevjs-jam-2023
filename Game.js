
var controls;
var points = 0;

var croissant;
var walkers;

var walkerVelocities = new Map();

var gamewidth = 1200;
var gameheight = 800;

var config = {
    type: Phaser.AUTO,
    width: gamewidth,
    height: gameheight,
    physics: {
        default: 'arcade',
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    backgroundColor: '#45b3e0'
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('background', 'assets/background.png');
    this.load.image('croissant', 'assets/croissant.png');
    this.load.image('walker', 'assets/walker1.png');
    this.load.image('clocktower', 'assets/clocktower_base.png');
    this.load.spritesheet('clockface', 
    'assets/clockface_map.png',
    { frameWidth: 123, frameHeight: 119 });
}

function update (time, delta)
{
    this.controls.update(delta);

    this.physics.world.wrap(walkers, 24);

    if (cursors.left.isDown)
    {
        forwardTime();
    }
    else if (cursors.right.isDown)
    {
        reverseTime();
    }
}

function reverseTime ()
{
    //walkers.setVelocityX(-(walkerVelocities.get("walker")));
    walkers.setVelocityX(-160);
}

function forwardTime ()
{
    //walkers.setVelocityX(walkerVelocities.get("walker"));
    walkers.setVelocityX(200);
}

function chowdown (croissant, clockface)
{
    croissant.disableBody(true, true);
    points += 1;
    scoreText.setText('Pastries Consumed: ' + points)
    this.tweens.add({
        targets: clockface, //your image that must spin
        rotation: 2 * Math.PI, //rotation value must be radian
        duration: 2000 //duration is in milliseconds
    });
}

function create ()
{
    background = this.add.image(gamewidth/2, gameheight/2,'background');
    scoreText = this.add.text(140, 65, 'Pastries Consumed: ' + points, { fontSize: '20px', fill: '#9c640c' });
    clocktower = this.add.image(gamewidth/2, (gameheight/2) + 100, 'clocktower');
    clockface = this.physics.add.sprite(gamewidth/2 + 2, (gameheight/2) - 6, 'clockface');
    this.anims.create({
        key: 'face_rotation',
        frames: this.anims.generateFrameNumbers('clockface', { start: 0, end: 2 }),
        frameRate: 1,
        repeat: -1
    });
    clockface.anims.play('face_rotation', true);
    

    cursors = this.input.keyboard.createCursorKeys();

    const controlConfig = {
        camera: this.cameras.main,
        up: cursors.up,
        down: cursors.down,
        acceleration: 0.06,
        drag: 0.0005,
        maxSpeed: 1.0
    };

    this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
    this.cameras.main.setBounds(0, 0, gamewidth, gameheight);
    this.cameras.main.scrollY = gameheight/2;

    this.physics.world.setBounds(0, 0, gamewidth, gameheight);

    croissant = this.physics.add.image(0, 0, 'croissant').setGravityY(300);
    walkers = this.physics.add.group({
        key: 'walker',
        velocityX: 200,
        setScale: 0.5,
        frameQuantity: 5,
        setXY: {
            y: gameheight - 70,
            stepX: Math.floor(Math.random() * 300) + 60,
        },
        setScale: {
            x: 0.5,
            y: 0.5
        },
        immovable: true
    });

    for (var walker of walkers.getChildren())
    {
        walker.setX(Math.floor(Math.random() * gamewidth) + 60)
    }

    croissant.setVelocity(200, 200);
    croissant.setBounce(1, 1);
    croissant.setCollideWorldBounds(true);

    this.physics.add.collider(croissant, walkers);
    this.physics.add.overlap(croissant, clockface, chowdown, null, this);
}