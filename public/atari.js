
var degradation = 1.0;
var hit_color_rate = 0.1;
var cri_color_rate = 0.5


function pHit(){
    var p = Math.random();

    if(p > 0.8){
	return 2;
    }
    else if(p > 0.5){
	return 1;
    }
    else{
	return 0;
    }

    // var canvas = $('#oculus-stream canvas')[0];
    // var w = canvas.width;
    // var h = canvas.height;
    // var cc = canvas.getContext('2d');
    // var img = cc.getImageData(0, 0, w, h);

    // var max = w * h * 255;
    
    // var acc_r = 0;
    // var acc_g = 0;
    // var acc_b = 0;
    
    // for(var i = 0; i < w * h; i+=4){
    // 	acc_r += img.data[i];
    // 	acc_g += img.data[i+1];
    // 	acc_b += img.data[i+2];
    // }

    // var rd = acc_r / max;
    // var gd = acc_g / max;
    // var bd = acc_b / max;
    

    // if(rd > 0.8 && gd < 0.3 && bd < 0.3){
    // 	return 2;
    // }
    // else if(rd > 0.6 && gd < 0.3 && bd < 0.3){
    // 	return 1;
    // }
    // else{
    // 	return 0;
    // }

}

function shoot(){
    var res = document.getElementById('result');
    var p = pHit()
    if(p < cri_threshold){
	res.innerText = "critical!";
    }
    else if(p < hit_threshold){
	res.innerText = "hit!";
    }
    else{
	res.innerText = "miss";
    }
    
}


var offset = 0;
function testFill(){
    var canvas = $('#oculus-stream canvas')[0];
    var cc = canvas.getContext('2d');

    cc.beginPath();
    cc.moveTo(0, 0);
    cc.lineTo(400, 0);
    cc.lineTo(400, 300);
    cc.lineTo(0, 300);
    cc.closePath();

    switch(offset){
    case 0:
	cc.fillStyle = 'rgb(255, 0, 0)';
	break;
    case 1:
	cc.fillStyle = 'rgb(0, 255, 0)';
	break;
    case 2:
	cc.fillStyle = 'rgb(0, 0, 255)';
	break;
    }
    
    
    cc.fill();
    offset = (offset+1) % 3;
}

function testDrive(){
    setInterval('testFill()', 1000);
}
