var scene;
var controls;
var points = 0;

var fallsound;
var backgroundsound;
var bouncesound;
var chompsound;

var croissant;
var walkers;
var clockface;
var birds;
var rewindSign;
var forwardSign;

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
    scene = this;

    this.load.audio('fall', ['assets/sounds/fall.wav']);// sound by remaxim, from https://opengameart.org/content/falling-body, under Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0) 
    this.load.audio('background', ['assets/sounds/Happy walk.mp3']); //song by Johan Brodd, from https://opengameart.org/content/happy-walk, under GPL 3.0
    this.load.audio('bounce', ['assets/sounds/bounce.mp3']);// sound by Lamoot and Blender Foundation, from https://opengameart.org/content/funny-comic-cartoon-bounce-sound, under CC-BY 3.0
    this.load.audio('munch', ['assets/sounds/chomp.ogg']);// sound by AntumDeluge from https://opengameart.org/node/132358, under Creative Commons Zero (CC0)

    this.load.image('background', 'assets/background.png');
    this.load.image('rewind', 'assets/rewind.png');
    this.load.image('forward', 'assets/forward.png');
    this.load.image('croissant', 'assets/croissant.png');
    this.load.image('clocktower', 'assets/clocktower_base.png');
    
    this.load.spritesheet('walker1', 
    'assets/walker1_map.png',
    { frameWidth: 69, frameHeight: 150 });
    this.load.spritesheet('walker2', 
    'assets/walker2_map.png',
    { frameWidth: 69, frameHeight: 150 });
    this.load.spritesheet('walker3', 
    'assets/walker3_map.png',
    { frameWidth: 69, frameHeight: 150 });
    
    this.load.spritesheet('clockface', 
    'assets/clockface_map.png',
    { frameWidth: 123, frameHeight: 119 });

    this.load.spritesheet('birds', 
    'assets/bird_map.png',
    { frameWidth: 150, frameHeight: 90 });
}

function update (time, delta)
{
    this.controls.update(delta);

    this.physics.world.wrap(walkers, 24);
    this.physics.world.wrap(birds, 24);

    if (cursors.left.isDown)
    {
        forwardTime();
    }
    else if (cursors.right.isDown)
    {
        reverseTime();
    }
    if(croissant.body.blocked.down)
    {
        fallsound.play();
        croissant.disableBody(true, true);
        newCroissant();
    }
}

function create ()
{
    fallsound = this.sound.add('fall', { loop: false });
    backgroundsound = this.sound.add('background', { loop: true });
    bouncesound = this.sound.add('bounce', { loop: false });
    munchsound = this.sound.add('munch', { loop: false });

    backgroundsound.play();

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

    rewindSign = this.add.image(900, gameheight/2 - 100,'rewind').setVisible(false);
    forwardSign = this.add.image(300, gameheight/2 - 100,'forward').setVisible(true);
    

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
    
    walkers = this.physics.add.group({immovable: true});
    for(let i = 1; i <= 5; i++)
    {
        walkertype = (Math.floor(Math.random() * 3) + 1);
        walkername = 'walker' + walkertype;
        walkingname = 'walking' + walkertype;

        walker = walkers.create(Math.floor(Math.random() * gamewidth) + 60, gameheight - 88, walkername);
        walker.setVelocityX(200);
        walker.setScale(1.2);

        this.anims.create({
            key: walkingname,
            frames: this.anims.generateFrameNumbers(walkername, { start: 0, end: 1 }),
            frameRate: 2,
            repeat: -1
        });

        walker.anims.play(walkingname, true);
    }
    
    
    // {
    //     key: ['walker1', 'walker2', 'walker3'],
    //     randomKey: true,
    //     velocityX: 200,
    //     frameQuantity: 6,
    //     setXY: {
    //         y: gameheight - 88,
    //         stepX: Math.floor(Math.random() * 300) + 60,
    //     },
    //     setScale: {
    //         x: 1.2,
    //         y: 1.2
    //     },
    //     immovable: true,
    // });



    newCroissant();

    birds = scene.physics.add.sprite(500, 200, 'birds');
    birds.setVelocity(-100, 0);
    birds.setBounce(1, 1);
    birds.setImmovable(true);
    this.anims.create({
        key: 'birds',
        frames: this.anims.generateFrameNumbers('birds', { start: 0, end: 2 }),
        frameRate: 1,
        repeat: -1
    });
    birds.anims.play('birds', true);
}

function reverseTime ()
{
    //walkers.setVelocityX(-(walkerVelocities.get("walker")));
    walkers.setVelocityX(-200);
    birds.setVelocityX(100);
    rewindSign.setVisible(true);
    forwardSign.setVisible(false);
}

function forwardTime ()
{
    //walkers.setVelocityX(walkerVelocities.get("walker"));
    walkers.setVelocityX(200);
    birds.setVelocityX(-100);
    rewindSign.setVisible(false);
    forwardSign.setVisible(true);
}

function clickClock()
{
    
}

function chowdown (croissant, clockface)
{
    croissant.disableBody(true, true);
    points += 1;
    scoreText.setText('Pastries Consumed: ' + points)
    munchsound.play();
    scene.tweens.add({
        targets: clockface,
        rotation: 2 * Math.PI,
        duration: 2000
    });
    newCroissant();
}

function bounce()
{
    bouncesound.play();
}

function newCroissant()
{
    croissant = scene.physics.add.image(0, 0, 'croissant').setGravityY(300);
    croissant.setAngle(Math.floor(Math.random() * 360));
    croissant.setVelocity(200, 200);
    croissant.setBounce(0.9, 0.9);
    croissant.setCollideWorldBounds(true);

    scene.physics.add.collider(croissant, walkers, bounce, null, this);
    scene.physics.add.collider(croissant, birds, bounce, null, this);
    scene.physics.add.overlap(croissant, clockface, chowdown, null, this);

}