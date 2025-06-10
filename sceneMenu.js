var sceneMenu = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function () {
        Phaser.Scene.call(this, { key: "sceneMenu" });
    },

    init() {},

    preload() {
        this.load.image('bg_start', 'assets/images/bg_start.png');
        this.load.image('btn_play', 'assets/images/btn_play.png');
        this.load.image('title_game', 'assets/images/title_game.png');
        this.load.image('panel_skor', 'assets/images/panel_skor.png');
        this.load.audio('snd_ambience', 'assets/audio/ambience.mp3');
        this.load.audio('snd_touch', 'assets/audio/touch.mp3');
        this.load.audio('snd_transisi_menu', 'assets/audio/transisi_menu.mp3');
    },

    create() {
        // Musik latar global
        if (snd_ambience == null) {
            snd_ambience = this.sound.add('snd_ambience');
            snd_ambience.loop = true;
            snd_ambience.setVolume(0.35);
            snd_ambience.play();
        }

        this.snd_touch = this.sound.add('snd_touch');
        var snd_transisi = this.sound.add('snd_transisi_menu');

        var skorTertinggi = localStorage["highscore"] || 0;

        // Background
        this.add.image(1024 / 2, 768 / 2, 'bg_start');

        // Tombol Play
        var btnPlay = this.add.image(1024 / 2, 768 / 2 + 75, 'btn_play').setDepth(10).setScale(0).setInteractive();

        // Judul
        this.titleGame = this.add.image(1024 / 2, 200, 'title_game').setDepth(10).setScale(0);
        this.titleGame.y -= 384;

        // Panel Skor
        var panelSkor = this.add.image(1024 / 2, 768 - 120, 'panel_skor').setOrigin(0.5).setDepth(10).setAlpha(0);
        var lblSkor = this.add.text(panelSkor.x + 25, panelSkor.y, "High score : " + skorTertinggi).setOrigin(0.5).setDepth(10).setFontSize(30).setTint(0xff732e);

        var diz = this;

        // Animasi Judul
        this.tweens.add({
            targets: this.titleGame,
            ease: 'Bounce.easeOut',
            duration: 750,
            delay: 250,
            y: 200,
            onComplete: function () {
                snd_transisi.play();
            }
        });

        // Animasi Tombol Play
        this.tweens.add({
            targets: btnPlay,
            ease: 'Back',
            duration: 500,
            delay: 750,
            scaleX: 1,
            scaleY: 1
        });

        // Animasi Judul Game (skala)
        this.tweens.add({
            targets: this.titleGame,
            ease: 'Elastic',
            duration: 750,
            delay: 1000,
            scaleX: 1,
            scaleY: 1
        });

        // Event Input Tombol Play
        this.input.on('gameobjectover', function (pointer, gameObject) {
            if (gameObject === btnPlay) {
                btnPlay.setTint(0xaaaaaa);
            }
        }, this);

        this.input.on('gameobjectout', function (pointer, gameObject) {
            if (gameObject === btnPlay) {
                btnPlay.setTint(0xffffff);
            }
        }, this);

        this.input.on('gameobjectdown', function (pointer, gameObject) {
            if (gameObject === btnPlay) {
                btnPlay.setTint(0x616161);
            }
        }, this);

        this.input.on('gameobjectup', function (pointer, gameObject) {
            if (gameObject === btnPlay) {
                btnPlay.setTint(0xffffff);
                this.snd_touch.play();
                this.scene.start('scenePlay');
            }
        }, this);
    },

    update() {}
});