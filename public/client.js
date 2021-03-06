// Generated by CoffeeScript 1.8.0
(function() {
  var diffAngles, keys, queryOculusAngles, setOculusAngle, attack;
  var score = 0;
  var isGame = false;
  var timer = new Timer(120,
    function(){
      if(isGame == true){
      console.log('END');
      isGame = false;
      console.log(score);
      }
    });

  window.socket = new Faye.Client("/faye", {
    timeout: 1,
    retry: 1
  });

  socket.bind("transport:down", function() {
    swarm.forEach(function(drone) {
      return drone.terminate();
    });
    $('body').append($('<div id="lost-connection">').css({
      position: "fixed",
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      opacity: 0.8,
      background: 'black'
    }).append($('<div>').html('Lost connection with server<br><br><span id="reconnecting">- Reconnecting -</span>').css({
      color: "white",
      textAlign: "center",
      fontSize: "16px",
      marginTop: "10px"
    })));
    setInterval(function() {
      return $('#lost-connection #reconnecting').fadeOut().fadeIn();
    }, 1000);
    return socket.bind("transport:up", function() {
      return document.location.reload();
    });
  });

  window.swarm = [];

  $.extend(swarm, {
    drones: {},
    forEach: function(iterator) {
      return Object.keys(swarm.drones).forEach(function(id) {
        return iterator(swarm.drones[id]);
      });
    },
    _speed: 1,
    speed: function(options) {
      if (!options) {
        return swarm._speed;
      }
      return swarm._speed = options.speed;
    },
    action: function(options, stop) {
      if (stop) {
        return;
      }
      console.log("/swarm/action", options);
      return socket.publish("/swarm/action", options);
    },
    move: function(options, stop) {
      var move;
      move = {};
      move[options.axis] = options.vector * swarm.speed() * (stop ? 0 : 1);
      return socket.publish("/swarm/move", move);
    },
    animate: function(options, stop) {
      if (stop) {
        return;
      }
      console.log("/swarm/animate", options);
      return socket.publish("/swarm/animate", options);
    }
  });

  $.ajax({
    url: '/drones',
    dataType: 'json',
    success: function(drones) {
      return drones.forEach(function(drone) {
        swarm.drones[drone.id] = new Drone(drone);
        return swarm.push(swarm.drones[drone.id]);
      });
    }
  });

  window.useOculusControl = false;

  window.referenceOculusAngle = null;

  window.lastOculusAngle = null;

  queryOculusAngles = function() {
    return $.get('http://localhost:50000', function(response, error) {
      return window.lastOculusAngle = response;
    });
  };

  $(function() {
    setInterval(queryOculusAngles, 10);
    setInterval(renderOculusControl, 10);
    window.$oculusOSD = $('.oculus-osd');
    $('body').prepend(window.$oculusDiv = $('<div>'));
    window.$oculusDiv.css({
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '30px',
      backgroundColor: 'black',
      color: 'white',
      textAlign: 'center',
      fontSize: '13px',
      lineHeight: '30px',
      zIndex: '1'
    });
    return window.$oculusDiv.html('Start Oculus deamon & press O to set reference and start control');
  });

  setOculusAngle = function(options, stop) {
    if (stop) {
      return;
    }
    if (window.useOculusControl = !window.useOculusControl) {
      $('#oculus-stream').show();
      $('#oculus-left,#oculus-right').fadeIn(500);
      window.$oculusDiv.animate({
        color: 'black',
        backgroundColor: 'white'
      });
      window.$oculusDiv.html('OCULUS RIFT ENABLED<br>');
      return window.referenceOculusAngle = window.lastOculusAngle;
    } else {
      $('#oculus-left,#oculus-right').fadeOut(500, function() {
        return $('#oculus-stream').hide();
      });
      window.$oculusDiv.animate({
        color: 'white',
        backgroundColor: 'black'
      });
      window.$oculusDiv.html('Start Oculus deamon & press O to set reference and start control');
      window.referenceOculusAngle = null;
      swarm.move({
        axis: 'x',
        vector: 0
      });
      swarm.move({
        axis: 'y',
        vector: 0
      });
      swarm.move({
        axis: 'r',
        vector: 0
      });
      return swarm.action({
        action: 'stop'
      });
    }
  };

  attack = function() {
    if(isGame){
      var res = pHit();
      console.log(res);
      if (res == 1) {
        $('#audio_hit').get(0).play();
        score += 1;
      } else if (res == 2) {
        $('#audio_chit').get(0).play();
        score += 5;
      }

      $('#oculus-osd-left').html(score);
    }
  };

  start = function() {
    if(isGame == false){
      console.log('START');
      isGame = true;
      score = 0;
      timer.start();
      setInterval(100,
        function(){
          $('.remain-time').text(timer.get_time());
        }
      );
    }
  };

  window.diffOculusAngle = function() {
    if (window.useOculusControl && window.referenceOculusAngle) {
      return {
        euler: {
          y: +diffAngles(window.referenceOculusAngle.euler.y, window.lastOculusAngle.euler.y),
          p: +diffAngles(window.referenceOculusAngle.euler.p, window.lastOculusAngle.euler.p),
          r: -diffAngles(window.referenceOculusAngle.euler.r, window.lastOculusAngle.euler.r)
        }
      };
    }
  };

  window.renderOculusControl = function() {
    var $oculusControl, $oculusControlPad, diffAngle, diffScale, diffThreshold, oculusControl;
    if (!window.useOculusControl || !(diffAngle = window.diffOculusAngle())) {
      return;
    }
    diffThreshold = {
      y: 0.3,
      p: 0.05,
      r: 0.05
    };
    diffScale = {
      y: 0.5,
      p: 0.3,
      r: 0.3
    };
    oculusControl = {
      x: 0,
      y: 0,
      r: 0
    };
    window.$oculusOSD.html('');
    if (Math.abs(diffAngle.euler.y) > diffThreshold.y) {
      window.$oculusOSD.append(diffAngle.euler.y > 0 ? "CW " : "CWW ");
      if (window.useOculusControl) {
        oculusControl.r = diffAngle.euler.y * diffScale.r;
      }
    }
    if (Math.abs(diffAngle.euler.p) > diffThreshold.p) {
      window.$oculusOSD.append(diffAngle.euler.p > 0 ? "FORWARD " : "BACKWARD ");
      if (window.useOculusControl) {
        oculusControl.y = diffAngle.euler.p * diffScale.p;
      }
    }
    if (Math.abs(diffAngle.euler.r) > diffThreshold.r) {
      window.$oculusOSD.append(diffAngle.euler.r > 0 ? "LEFT " : "RIGHT ");
      if (window.useOculusControl) {
        oculusControl.x = diffAngle.euler.r * diffScale.r;
      }
    }
    swarm.move({
      axis: 'x',
      vector: -oculusControl.x
    });
    swarm.move({
      axis: 'y',
      vector: +oculusControl.y
    });
    swarm.move({
      axis: 'r',
      vector: +oculusControl.r
    });
    $oculusControlPad = $('.oculus-control-pad');
    $oculusControl = $('.oculus-control');
    $oculusControlPad.css({
      marginTop: ((3 * -oculusControl.y + 0.5) * $oculusControl.width()) - ($oculusControlPad.width() / 2),
      marginLeft: ((3 * -oculusControl.x + 0.5) * $oculusControl.height()) - ($oculusControlPad.height() / 2),
      background: 'green'
    });
    $oculusControl.css({
      "-webkit-transform": "rotate(" + (360 * (0.3 * oculusControl.r)) + "deg)"
    });
    if (!oculusControl.x && !oculusControl.y && !oculusControl.r) {
      window.$oculusOSD.html('HOLD');
      return $oculusControlPad.css({
        background: 'black'
      });
    }
  };

  diffAngles = function(a, b) {
    a += 3 * Math.PI;
    b += 3 * Math.PI;
    return a - b;
  };

  keys = {
    38: {
      event: swarm.move,
      options: {
        axis: 'y',
        vector: +1
      }
    },
    40: {
      event: swarm.move,
      options: {
        axis: 'y',
        vector: -1
      }
    },
    37: {
      event: swarm.move,
      options: {
        axis: 'x',
        vector: -1
      }
    },
    39: {
      event: swarm.move,
      options: {
        axis: 'x',
        vector: +1
      }
    },
    87: {
      event: swarm.move,
      options: {
        axis: 'z',
        vector: +1
      }
    },
    83: {
      event: swarm.move,
      options: {
        axis: 'z',
        vector: -1
      }
    },
    65: {
      event: swarm.move,
      options: {
        axis: 'r',
        vector: -1
      }
    },
    68: {
      event: swarm.move,
      options: {
        axis: 'r',
        vector: +1
      }
    },
    32: {
      event: swarm.action,
      options: {
        action: 'stop'
      }
    },
    13: {
      event: swarm.action,
      options: {
        action: 'takeoff'
      }
    },
    27: {
      event: swarm.action,
      options: {
        action: 'land'
      }
    },
    69: {
      event: swarm.action,
      options: {
        action: 'disableEmergency'
      }
    },
    49: {
      event: swarm.animate,
      options: {
        name: 'wave',
        duration: 3000
      }
    },
    50: {
      event: swarm.animate,
      options: {
        name: 'flipAhead',
        duration: 3000
      }
    },
    79: {
      event: setOculusAngle
    },
    84: {
      event: attack
    },
    13: {
      event: start
    }
  };

  $(document).keydown(function(e) {
    var keyOptions;
    if (!(keyOptions = keys[e.keyCode])) {
      return;
    }
    e.preventDefault();
    if (keyOptions.sending) {
      return;
    }
    keyOptions.sending = true;
    return keyOptions.event(keyOptions.options, false);
  });

  $(document).keyup(function(e) {
    var keyOptions;
    if (!(keyOptions = keys[e.keyCode])) {
      return;
    }
    e.preventDefault();
    keyOptions.sending = false;
    return keyOptions.event(keyOptions.options, true);
  });

  $(function() {
    var $video1, $video2, $videoBuffer, dronestream, processFrame, video1, video1Ctx, video2, video2Ctx, videoBuffer, _RATIO;
    _RATIO = 0.5;
    dronestream = new NodecopterStream(document.getElementById("oculus-stream"));
    $videoBuffer = $('#oculus-stream canvas');
    videoBuffer = $videoBuffer[0];
    $video1 = $videoBuffer.clone().appendTo('#oculus-left').attr('id', 'oculus-stream-left');
    $video2 = $videoBuffer.clone().appendTo('#oculus-right').attr('id', 'oculus-stream-right');
    video1 = $video1[0];
    video1Ctx = video1.getContext('2d');
    video2 = $video2[0];
    video2Ctx = video2.getContext('2d');
    processFrame = function() {
      requestAnimationFrame(processFrame);
      video1.width = video1.width;
      video1Ctx.drawImage(videoBuffer, 0, 0, videoBuffer.width, videoBuffer.height);
      video2.width = video2.width;
      return video2Ctx.drawImage(videoBuffer, 0, 0, videoBuffer.width, videoBuffer.height);
    };
    return processFrame();
  });

}).call(this);
