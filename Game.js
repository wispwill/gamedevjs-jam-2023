
var controls;
var points = 0;

var croissant;
var walker;

var velocities = new Map([
    ["walker", 160]
])

var gamewidth = 1200;
var gameheight = 800;

var config = {
    type: Phaser.AUTO,
    width: gamewidth,
    height: gameheight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
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
    this.load.image('croissant', 'assets/cat.png');
    this.load.image('walker', 'assets/walker1.png');
    this.load.image('clocktower', 'assets/clocktower1.png');
    this.load.spritesheet('clockface', 
    'assets/clockface_map.png',
    { frameWidth: 123, frameHeight: 119 }
);
}

function update (time, delta)
{
    this.controls.update(delta);

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
    walker.setVelocityX(-(velocities.get("walker")));
    clockface.anims.play('face_rotation', true);
}

function forwardTime ()
{
    walker.setVelocityX(velocities.get("walker"));
    clockface.anims.play('face_rotation', true);
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
    this.add.image(gamewidth/2, gameheight/2,'background');
    scoreText = this.add.text(140, 65, 'Pastries Consumed: ' + points, { fontSize: '20px', fill: '#9c640c' });
    clocktower = this.add.image(gamewidth/2, (gameheight/2) + 100, 'clocktower');
    clockface = this.physics.add.sprite(gamewidth/2 + 2, (gameheight/2) - 6, 'clockface');
    clockface.body.stop();
    clockface.body.allowGravity = false;
    this.anims.create({
        key: 'face_rotation',
        frames: this.anims.generateFrameNumbers('clockface', { start: 0, end: 2 }),
        frameRate: 1,
        repeat: -1
    });
    

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

    croissant = this.physics.add.image(0, 0, 'croissant');
    walker = this.physics.add.image(gamewidth/2, gameheight, 'walker').setScale(0.5);

    croissant.setVelocity(200, 200);
    croissant.setBounce(1, 1);
    croissant.setCollideWorldBounds(true);

    walker.setVelocity(200, 0);
    walker.setBounce(1, 0);
    walker.setCollideWorldBounds(true);

    this.physics.add.collider(croissant, walker);
    this.physics.add.overlap(croissant, clockface, chowdown, null, this);
}