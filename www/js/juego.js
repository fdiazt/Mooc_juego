var app = {

  inicio: function() {
      DIAMETRO_BOLA=50;
      velocidadX=0;
      velocidadY=0;
      dificultad=0;
      alto=document.documentElement.clientHeight-100;
      ancho=document.documentElement.clientWidth;
      app.vigilaSensores();
      app.iniciaJuego();
    },  

  iniciaJuego: function(){
      
      function preload(){

        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.stage.backgroundColor='#08ab23';
        game.load.image('bola','assets/bola.png');
        game.load.image('objetivo','assets/g3.png');
        game.load.image('bolaRoja','assets/BolaRoja.png');
        game.load.image('bolaAzul','assets/BolaAzul.png');
        game.load.image('bolaAmarilla','assets/BolaAmarilla.png');
        //game.load.image('premio','assets/g5.png');
        
      }

      function create(){
        puntuacion=0;

        scoreText=game.add.text(16,16,puntuacion,{fontSize: '20px',fill:'#757676'});
        bola=game.add.sprite(app.inicioX(),app.inicioY(),'bola');
        objetivo=game.add.sprite(app.inicioX(),app.inicioY(),'objetivo');
        bolaRoja=game.add.sprite(app.inicioX(),app.inicioY(),'bolaRoja');
        bolaAzul=game.add.sprite(app.inicioX(),app.inicioY(),'bolaAzul');
        bolaAmarilla=game.add.sprite(app.inicioX(),app.inicioY(),'bolaAmarilla');
       //premio=game.add.sprite(app.inicioX(),app.inicioY(),'premio');
        
        game.physics.arcade.enable([bola,objetivo,bolaRoja,bolaAzul,bolaAmarilla]);
        
        bola.body.immovable = true;
        velocidadDesaparece=100;
        bolaRoja.body.velocity.setTo(velocidadDesaparece, velocidadDesaparece);
        bolaAzul.body.velocity.setTo(velocidadDesaparece, velocidadDesaparece);
        bolaAmarilla.body.velocity.setTo(velocidadDesaparece, velocidadDesaparece);

        bola.body.collideWorldBounds=true;
        bola.body.onWorldBounds=new Phaser.Signal();
        bola.body.onWorldBounds.add(app.decrementaPuntuacion,this);

        
       //  This makes the game world bounce-able
        bolaRoja.body.collideWorldBounds = true;
        bolaAzul.body.collideWorldBounds = true;
        bolaAmarilla.body.collideWorldBounds = true;
        objetivo.body.collideWorldBounds = true;
         
       //  This sets the image bounce energy for the horizontal 
        //  and vertical vectors (as an x,y point). "1" is 100% energy return
        bolaRoja.body.bounce.setTo(1, 1);
        bolaAzul.body.bounce.setTo(1, 1);
        bolaAmarilla.body.bounce.setTo(1, 1);
        
        
      }

      function update(){
        var factorDificultad=(50-dificultad*100);
        bola.body.velocity.y=(velocidadY * 50);
        bola.body.velocity.x=(velocidadX * -50);
        game.physics.arcade.overlap(bola,objetivo,app.incrementaPuntuacion,null,this);
        
        game.physics.arcade.collide(bolaRoja,bolaAzul);
        game.physics.arcade.collide(bolaRoja,bolaAmarilla);
        game.physics.arcade.collide(bolaAzul,bolaAmarilla);
        game.physics.arcade.collide(objetivo,bolaAzul);
        game.physics.arcade.collide(objetivo,bolaAmarilla);
        game.physics.arcade.collide(objetivo,bolaRoja);
        
        game.physics.arcade.collide(bola,bolaRoja,app.desaparece,null,this);
        game.physics.arcade.collide(bola,bolaAzul,app.desaparece,null,this);
        game.physics.arcade.collide(bola,bolaAmarilla,app.desaparece,null,this);
        //game.physics.arcade.overlap(bola,premio,app.premio,null,this);
      }

      var estados={preload: preload,create: create, update: update};
      var game=new Phaser.Game(ancho,alto,Phaser.CANVAS,'phaser',estados);

  },
  inicioX: function () {
    return app.numeroAleatorioHasta(ancho-DIAMETRO_BOLA);
  },

  inicioY: function(){
      return app.numeroAleatorioHasta(alto-DIAMETRO_BOLA);
  },
  
  premio: function(){
      puntuacion=puntuacion+100;
      scoreText.text=puntuacion;      
  },
  numeroAleatorioHasta: function(limite){
    return Math.floor(Math.random() * limite);
  },
  desaparece: function(){
    
      bola.body.x=bola.body.x-50;
      bola.body.y=bola.body.y-50;
      app.decrementaPuntuacion();
      /*
      desaparece.body.x=app.inicioX();
      desaparece.body.y=app.inicioY();
      */
  },
  decrementaPuntuacion: function(){
    puntuacion=puntuacion-1;
    scoreText.text=puntuacion;
  },
  incrementaPuntuacion: function(){
    puntuacion=puntuacion+1;
    scoreText.text=puntuacion;
    objetivo.body.x=app.inicioX();
    objetivo.body.y=app.inicioY();
    app.incrementaDificultad;
  },
  incrementaDificultad: function(){
    if (puntuacion>10){
      dificultad=dificultad+1;
      velocidadDesaparece=velocidadDesaparece+100;
      bolaRoja.body.velocity.setTo(velocidadDesaparece, velocidadDesaparece);
      bolaAzul.body.velocity.setTo(velocidadDesaparece, velocidadDesaparece);
      bolaAmarilla.body.velocity.setTo(velocidadDesaparece, velocidadDesaparece);
    }
  },
  vigilaSensores: function(){
      function onError(){
        console.log('onError!');
      }
       function onSuccess (datosAceleracion) {
        app.detectaAgitacion(datosAceleracion);    
        app.registraDireccion(datosAceleracion);
      }
      var options={ frequency:10};
      navigator.accelerometer.watchAcceleration(onSuccess,onError,options);
  },
  registraDireccion: function(datosAceleracion){
      velocidadY=datosAceleracion.y;
      velocidadX=datosAceleracion.x;
  },

  detectaAgitacion: function(datosAceleracion){
    agitacionX=datosAceleracion.x>9;
    agitacionY=datosAceleracion.y>9;
    if (agitacionX || agitacionY)
    {
      setTimeOut(app.recomienza,1000);
    }
    
  },
  recomienza: function() {
    document.location.reload(true);
  },
  representa: function(dato,elementoHTML) {
    redondeo=Math.round(dato*100)/100;
    document.querySelector(elementoHTML).innerHTML=redondeo;
    
  }

  
};

var imageData;
if ('addEventListener' in document) {
  document.addEventListener('deviceready', function() {
    app.inicio();
  }, false);
}
