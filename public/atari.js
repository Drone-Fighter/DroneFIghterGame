
var w = 400;
var h = 300;
var degradation = 0.5;
var hit_color_rate = 0.1;
var cri_color_rate = 0.5
var hit_threshold = w * h * degradation * hit_color_rate;
var cri_threshold = w * h * degradation * cri_threshold;

function pHit(){
    var canvas = $('#oculus-stream canvas')[0];
    var cc = canvas.getContext('2d');
    var img = cc.getImageData(0, 0, w, h);
    
    var acc = 0;
    for(var i = 0; i < w * h; i+=4){
	acc += img.data[i];
    }
    if(acc < cri_threshold){
	return 2;
    }
    else if(acc < hit_threshold){
	return 1;
    }f
    else{
	return 0;
    }
}

function shoot(){
    var res = document.getElementById('result');
    if(pHit()){
	res.innerText = "Hit!";
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
