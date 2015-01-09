
var degradation = 1.0;
var hit_color_rate = 0.1;
var cri_color_rate = 0.5


function pHit(){
    var canvas = $('#oculus-stream canvas')[0];
    var w = canvas.width;
    var h = canvas.height;
    var cc = canvas.getContext('2d');
    var img = cc.getImageData(0, 0, w, h);

    var hit_threshold = w * h * degradation * hit_color_rate * 255;
    var cri_threshold = w * h * degradation * cri_threshold * 255;
    
    var acc_r = 0;
    var acc_g = 0;
    var acc_b = 0;
    
    for(var i = 0; i < w * h; i+=4){
	acc_r += img.data[i];
	acc_g += img.data[i+1];
	acc_b += img.data[i+2];
    }

    // ave_r = acc_r / (w * h);
    // ave_g = acc_g / (w * h);
    // ave_b = acc_b / (w * h);

    if(acc_r/acc_g < 2.0 || acc_r/acc_b < 2.0){
	return 0;
    }
    else{
	if(acc_r/acc_g > 3.0 || acc_r/acc_b > 3.0){
	    return 2;
	}
	else{
	    return 1;
	}
    }
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
