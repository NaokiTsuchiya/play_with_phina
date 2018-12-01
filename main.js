/*
 * Runstant
 * 思いたったらすぐ開発. プログラミングに革命を...
 */

phina.globalize();

var SCREEN_WIDTH    = 640;
var SCREEN_HEIGHT   = 960;
var PIECE_SIZE      = 80;
var PIECE_SIZE_HALF = PIECE_SIZE/2;
var GRAVITY = 0.98;
var FLOOR_HEIGHT = 960;
var SIZE = 12;


phina.define("MainScene", {
  superClass: 'DisplayScene',

  init: function() {
    this.superInit({
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT
    });

    this.size = SIZE;

    this.fromJSON({
      children: {
        wordGroup: {
          className: 'DisplayElement',
        }
      },
    });

    // this.vy = 0;

    // デフォルトでいくつか生成
    (this.size).times(function() {
      var x = Math.randint(PIECE_SIZE, this.gridX.width - PIECE_SIZE);
      var y = Math.randint(0, this.gridY.width);
      this.createWord(x, y, self);
    }, this);

    // タイマーラベルを生成
    var timerLabel = Label('0').addChildTo(this);
    timerLabel.origin.x = 1;
    timerLabel.x = 580;
    timerLabel.y = 130;
    timerLabel.fill = '#444';
    timerLabel.fontSize = 100;
    // timerLabel.align = 'right';
    timerLabel.baseline = 'bottom';
    this.timerLabel = timerLabel;

    this.time = 0;

  },

  onkeydown: function(e) {
    var ch = String.fromCharCode(e.keyCode)
    var wordGroup = this.wordGroup;
    var result = wordGroup.children.some(function(word) {
      if (word.enable && word.text === ch) {
        word.disappear();
        return true;
      }
      return false;
    });

    if (result) {
      this.size--;
      console.log(this.size);
    }

    if (this.size === 0) {
      this.exit({
        score: this.timerLabel.text
      });
    }
  },

  createWord: function(x, y, self) {
    var ascii = [48,49,50,51,52,53,54,55,56,57,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89];

    var ch = String.fromCharCode(ascii.pickup());
    var word = Word(ch).addChildTo(this.wordGroup);
    word.x = x
    word.y = y;

    // word.onattack = function() {
    //   this.exit({
    //     score: this.time,
    //   });
    // }.bind(this);

    return word;
  },

  update: function(app) {
    // タイマーを更新
    this.time += app.ticker.deltaTime;
    var sec = this.time/1000; // 秒数に変換
    this.timerLabel.text = sec.toFixed(3);
  },

});

phina.define('Word', {
  superClass: 'Button',

  init: function(word) {
    this.superInit({
      width: PIECE_SIZE,
      height: PIECE_SIZE,
      text: word,
    });
    this.enable = true;
    this.vy = 0;
  },

  update: function() {
    // 下に移動
    this.vy += GRAVITY;
    this.y += this.vy;

    // 地面に着いたら反発する
    if (this.bottom > FLOOR_HEIGHT) {
      this.bottom = FLOOR_HEIGHT;
      this.vy *= -1;
    }
  },

  disappear: function() {
    this.enable = false;
    this.tweener
      .to({
        scaleX: 2,
        scaleY: 2,
        alpha: 0,
      }, 250)
      .call(function() {
        this.target.remove();
      });
  }
});


phina.main(function() {
  var app = GameApp({
    title: 'typing game',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    startLabel: 'title',
  });

  // app.enableStats();

  app.run();
  
  // 無理やり canvas にフォーカス
  ;(function() {
    var canvas = app.domElement;
    canvas.setAttribute('tabindex', '0');
    canvas.focus();
  })();
});
