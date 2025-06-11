var scenePlay = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function () {
        Phaser.Scene.call(this, { key: 'scenePlay' });
    },
    init: function () {},
    preload: function () {
        this.load.image('chara', 'assets/images/chara.png');
        this.load.image('fg_loop', 'assets/images/fg_loop.png');
        this.load.image('fg_loop_back', 'assets/images/fg_loop_back.png');
        this.load.image('obstc','assets/images/obstc.png');
        this.load.image('panel_skor', 'assets/images/panel_skor.png');
        this.load.audio('snd_klik_1','assets/audio/klik_1.mp3');
        this.load.audio('snd_klik_2', 'assets/audio/klik_2.mp3');
        this.load.audio('snd_klik_3', 'assets/audio/klik_3.mp3');
        this.load.audio('snd_dead', 'assets/audio/dead.mp3');

    },
    create: function(){
        this.snd_dead = this.sound.add('snd_dead');
        this.snd_click = [];
        this.snd_click.push(this.sound.add('snd_klik_1'));
        this.snd_click.push(this.sound.add('snd_klik_2'));
        this.snd_click.push(this.sound.add('snd_klik_3'));
        for(let i = 0; i<this.snd_click.length; i++){
            this.snd_click[i].setVolume(0.5);
        }

        this.timerHalangan =0;
        this.halangan=[];
        this.background=[];
        //variabel global
        this.isGameRunning = false;

        //nambah chara
        this.chara = this.add.image(130, 768 / 2, 'chara');
        this.chara.setDepth(3);
        //chara g keliatan
        this.chara.setScale(0);
        //bikin pengganti this
        var myScene= this;
        //keliatan
        this.tweens.add({
            delay: 250,
            targets: this.chara,
            ease: 'Back.Out',
            duration: 500,
            scaleX: 1,
            scaleY: 1,
            onComplete: function () {
                myScene.isGameRunning = true;
            },
        });

        //nilaiiiii
        this.score = 0;
        this.panelSkor =this.add.image(1024/2,60,'panel_skor');
        this.panelSkor.setOrigin(0.5);
        this.panelSkor.setDepth(10);
        this.panelSkor.setAlpha(0.8);
        //label nilai skor
        this.lblSkor = this.add.text(this.panelSkor.x+25,this.panelSkor.y, this.score);
        this.lblSkor.setOrigin(0.5);
        this.lblSkor.setDepth(10);
        this.lblSkor.setFontSize(30);
        this.lblSkor.setTint(0xff732e);

        //----custom function-----
        // Perbaiki di scenePlay
        this.gameOver = function(){
            let skorTertinggi = localStorage["highscore"] || 0;
            if(myScene.score > skorTertinggi){
                localStorage["highscore"] = myScene.score;  // <- disamakan 'highscore'
            }
            myScene.scene.start("sceneMenu");
        };


        //-----deteksi user input-------
        //dilepas nurun
        this.input.on('pointerup', function (pointer,currentyOver) {
            if(!this.isGameRunning) return;
            this.snd_click[Math.floor((Math.random() * 2))].play();
            this.charaTweens= this.charaTweens= this.tweens.add({
                targets: this.chara,
                ease: 'Power1',
                duration:750,
                y:this.chara.y + 200,
            });
        },this);
        //var pengganti angka
        var bg_x=1366/2;
        //bg gerak
        for(let i =0; i<2; i++){
            var bg_awal =[];
            var BG = this.add.image(bg_x, 768 / 2, 'fg_loop_back');
            var FG = this.add.image(bg_x, 768 / 2, 'fg_loop');
            BG.setData('kecepatan',2);
            FG.setData('kecepatan',4);
            FG.setDepth(2);
            bg_awal.push(BG);
            bg_awal.push(FG);
            this.background.push(bg_awal);
            bg_x+=1366;
        }
    },

    update: function() {
        if(this.isGameRunning){
            //naik 5 px
            this.chara.y -= 5;
            //batas posisi biar tdk jatuh
            if(this.chara.y>690)this.chara.y=690;
            //array
            for(let i = 0; i < this.background.length; i++){
                for(var j=0; j<this.background[1].length; j++){
                    this.background[i][j].x -= this.background[i][j].getData('kecepatan');
                    if(this.background[i][j].x <= -(1366 / 2)){
                        var diff = this.background[i][j].x + (1366 / 2);
                        this.background[i][j].x = 1366 + 1366 / 2 + diff;
                    }
                }
            }
            if(this.timerHalangan==0){
                //jika ini 0 maka buat peluru baru
                var acak_y=Math.floor((Math.random() * 680) + 60);
                var halanganBaru = this.add.image(1500, acak_y, 'obstc');
                halanganBaru.setOrigin(0, 0);
                halanganBaru.setData("status_aktif",true);
                halanganBaru.setData("kecepatan",Math.floor((Math.random() * 10) + 5));
                halanganBaru.setDepth(5);
                this.halangan.push(halanganBaru);
                this.timerHalangan = Math.floor((Math.random() * 100) + 50);
            }

            //hapus halangan yg gperlu
            for(let i = this.halangan.length - 1; i >= 0; i--){
                this.halangan[i].x -= this.halangan[i].getData('kecepatan');
                if(this.halangan[i].x < -200){
                    this.halangan[i].destroy();
                    this.halangan.splice(i, 1);
                    break;
                }
            }
            this.timerHalangan--;

            for(var i = this.halangan.length -1; i>=0;i-- ){
                if(this.chara.x > this.halangan[i].x + 50 && this.halangan[i].getData('status_aktif')==true){
                    this.halangan[i].setData('status_aktif',false);
                    this.score++;
                    this.lblSkor.setText(this.score);
                }
            }
            for(let i = this.halangan.length -1; i >= 0; i--){
                if(this.chara.getBounds().contains(this.halangan[i].x, this.halangan[i].y)){
                    this.halangan[i].setData('status_aktif',false);
                    this.isGameRunning = false;
                    this.snd_dead.play();
                    if(this.charaTweens != null){
                        this.charaTweens.stop();
                    }
                    var myScene = this;
                    this.charaTweens = this.tweens.add({
                        targets: this.chara,
                        ease: 'Elastic.easeOut',
                        duration: 2000,
                        alpha: 0,
                        onComplete: myScene.gameOver,
                    });
                    break;
                }
            }  
            if(this.chara.y < -50){
                this.isGameRunning = false;
                this.snd_dead.play();
                if(this.charaTweens != null){
                    this.charaTweens.stop();
                }
                let myScene = this;
                this.charaTweens = this.tweens.add({
                    targets: this.chara,
                    ease: 'Elastic.easeOut',
                    duration: 2000,
                    alpha: 0,
                    onComplete: myScene.gameOver,
                });
            }              
        }
    }
});