var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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
    }
    //backgroundColor: '#2dab2d'
};

var gamewidth = 800;
var gameheight = (600 * 2);

var game = new Phaser.Game(config);
controls;

function preload ()
{
    this.load.image('croissant', 'assets/cat.png');
    this.load.image('walker', 'assets/walker1.png');
    this.load.image('sky', 'assets/sky.png');
}

function update (time, delta)
{
    this.controls.update(delta);
}

function create ()
{
    this.cameras.main.setBounds(0, 0, gamewidth, gameheight);
    this.cameras.main.scrollY = gameheight/2;

    this.physics.world.setBounds(0, 0, gamewidth, gameheight);
    this.add.image(0, 0, 'sky').setOrigin(0, 0);
    this.add.image(0, 600, 'sky').setOrigin(0, 0);
    this.add.image(0, 1200, 'sky').setOrigin(0, 0);
    this.add.image(0, 1800, 'sky').setOrigin(0, 0);

    var croissant = this.physics.add.image(50, 50, 'croissant');
    var walker = this.physics.add.image(gamewidth/2, gameheight, 'walker').setScale(0.3);

    croissant.setVelocity(200, 200);
    croissant.setBounce(1, 1);
    croissant.setCollideWorldBounds(true);

    walker.setVelocity(200, 0);
    walker.setBounce(1, 0);
    walker.setCollideWorldBounds(true);

    this.physics.add.collider(croissant, walker);

    const cursors = this.input.keyboard.createCursorKeys();

    const controlConfig = {
        camera: this.cameras.main,
        up: cursors.up,
        down: cursors.down,
        acceleration: 0.06,
        drag: 0.0005,
        maxSpeed: 1.0
    };

    this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
}