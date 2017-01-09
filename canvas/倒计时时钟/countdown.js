var WINDOW_WIDTH = 1024;
var WINDOW_HEIGHT = 500;
var RADIUS = 8 ;
var MARGIN_TOP = 60;
var MARGIN_LEFT = 30;

//const endTime =new Date(2017,0,7,18,47,52);

//每次一个小时倒计时
// var endTime = new Date();
// endTime.setTime(endTime.getTime() + 3600*1000);
var curShowTimeSeconds = 0;

//用来存增加的小球
var balls=[];
const colors = ["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"];

window.onload = function(){

	WINDOW_WIDTH = document.body.clientWidth;
	WINDOW_HEIGHT = document.body.clientHeight;

	MARGIN_LEFT = Math.round(WINDOW_WIDTH / 10);
	RADIUS = Math.round(WINDOW_WIDTH * 4/5 /108)-1;
	MARGIN_TOP = Math.round(WINDOW_HEIGHT /5);

	var canvas = document.getElementById("canvas");
	var context = canvas.getContext('2d');

	canvas.width = WINDOW_WIDTH;
	canvas.height = WINDOW_HEIGHT;

	curShowTimeSeconds = getCurrentShowTimeSeconds();
	setInterval(
		function(){
			render(context);
			update();
		},
		50
	);
}

function update() {
	//更新时间
	//curtimeshowseconds是个固定值，既是离结束的时间。而nextshowtimeseconds是每秒都在变化的值，
	//所以当curtimeshowseconds中的second值和nextshowtimeseconds的second值不相等时就让curtimeshowseconds等于nextshowtimeseconds值，这样就是实现每秒都在跳动。
	var nextShowTimeSeconds = getCurrentShowTimeSeconds();

	var nextHours = parseInt( nextShowTimeSeconds/3600 );
	var nextMinutes = parseInt( nextShowTimeSeconds -nextHours*3600 )/60;
	var nextSeconds = nextShowTimeSeconds % 60;

	var curHours = parseInt( curShowTimeSeconds/3600 );
	var curMinutes = parseInt( curShowTimeSeconds -curHours*3600 )/60;
	var curSeconds = curShowTimeSeconds % 60;

	//产生彩色小球
	if (nextSeconds != curSeconds ) {
		//对比每个数字是否改变，如果改变传位置，及当前数字		
		if(parseInt(curHours/10) != parseInt(nextHours/10)){
			addBalls(MARGIN_LEFT + 0, MARGIN_TOP, parseInt(curHours/10));
		}
		if(parseInt(curHours%10) != parseInt(nextHours%10)){
			addBalls(MARGIN_LEFT + 15*(RADIUS+1), MARGIN_TOP, parseInt(curHours%10));
		}
		if(parseInt(curMinutes/10) != parseInt(nextMinutes/10)){
			addBalls(MARGIN_LEFT + 39*(RADIUS+1), MARGIN_TOP, parseInt(curMinutes/10));
		}
		if(parseInt(curMinutes%10) != parseInt(nextMinutes%10)){
			addBalls(MARGIN_LEFT + 54*(RADIUS+1), MARGIN_TOP, parseInt(curMinutes%10));
		}
		if(parseInt(curSeconds/10) != parseInt(nextSeconds/10)){
			addBalls(MARGIN_LEFT + 78*(RADIUS+1), MARGIN_TOP, parseInt(curSeconds/10));
		}
		if(parseInt(curSeconds%10) != parseInt(nextSeconds%10)){
			addBalls(MARGIN_LEFT + 93*(RADIUS+1), MARGIN_TOP, parseInt(curSeconds%10));
		}

		curShowTimeSeconds = nextShowTimeSeconds;
	}

	updateBalls();

	//console.log(balls.length);
}

//小球基本运动
function updateBalls(){
	for( var i = 0; i < balls.length; i++){
		balls[i].x += balls[i].vx;
		balls[i].y += balls[i].vy;
		balls[i].vy += balls[i].g;

		if (balls[i].y >= WINDOW_HEIGHT-RADIUS) {
			balls[i].y = WINDOW_HEIGHT-RADIUS;
			balls[i].vy = -balls[i].vy*0.7;
		}
	}
	//优化小球数组，减少占用内存
	var cnt = 0;
	for( var i = 0 ; i < balls.length ; i++)
		if( balls[i].x + RADIUS > 0 && balls[i].x -RADIUS < WINDOW_WIDTH)
			balls[cnt++] = balls[i];
	while( balls.length > Math.min(300,cnt)){
		balls.pop();//将数组最后一个元素
	}
}
//在x，y的位置，对num点阵化的位置加一个小球
function addBalls( x, y, num){
	for( var i = 0 ; i<digit[num].length ; i++)
		for( var j =0 ; j<digit[num][i].length ; j++)
			if (digit[num][i][j] == 1) {
				var aBall = {
					x:x+j*2*(RADIUS+1)+(RADIUS+1),
					y:y+i*2*(RADIUS+1)+(RADIUS+1),
					//半径为RADIUS
					g:1.5+Math.random(),//1.5到2.5之间
					vx:Math.pow(-1,Math.ceil(Math.random()*1000))*4,//+4或-4
					vy:-5,
					color:colors[Math.floor(Math.random()*colors.length)]
				}
				balls.push( aBall);
			}
}
//画一个小球
function render(cxt){

	cxt.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);//对矩形内图像进行刷新操作

	var hours = parseInt( curShowTimeSeconds/3600 );
	var minutes = parseInt( curShowTimeSeconds -hours*3600 )/60;
	var seconds = curShowTimeSeconds % 60;

	renderDigit(MARGIN_LEFT,MARGIN_TOP,parseInt(hours/10),cxt);
	renderDigit(MARGIN_LEFT + 15*(RADIUS+1),MARGIN_TOP,parseInt(hours%10),cxt);
	renderDigit(MARGIN_LEFT + 30*(RADIUS+1),MARGIN_TOP,10,cxt);
	renderDigit(MARGIN_LEFT + 39*(RADIUS+1),MARGIN_TOP,parseInt(minutes/10),cxt);
	renderDigit(MARGIN_LEFT + 54*(RADIUS+1),MARGIN_TOP,parseInt(minutes%10),cxt);
	renderDigit(MARGIN_LEFT + 69*(RADIUS+1),MARGIN_TOP,10,cxt);
	renderDigit(MARGIN_LEFT + 78*(RADIUS+1),MARGIN_TOP,parseInt(seconds/10),cxt);
	renderDigit(MARGIN_LEFT + 93*(RADIUS+1),MARGIN_TOP,parseInt(seconds%10),cxt);

	//渲染增加的彩色的小球
	for( var i = 0; i < balls.length; i++){
		cxt.fillStyle = balls[i].color;
		cxt.beginPath();
		cxt.arc( balls[i].x , balls[i].y , RADIUS , 0 , 2*Math.PI , true );
		cxt.closePath();

		cxt.fill();
	}
}
//画一个数字
function renderDigit(x,y,num,cxt){

	cxt.fillStyle = "rgb(0,102,153)";
	//循环遍历数组
	for( var i = 0 ; i < digit[num].length ; i++ )
		for( var j = 0 ; j < digit[num][i].length ; j++ ){
			if (digit[num][i][j] == 1 ){
				cxt.beginPath();
				//画每一个小圆，圆心坐标为啥是这个公式见笔记
				cxt.arc( x+j*2*(RADIUS+1)+(RADIUS+1) , y+i*2*(RADIUS+1)+(RADIUS+1) , RADIUS ,0, 2*Math.PI);
				cxt.closePath();

				cxt.fill();
			}
		}
}
function getCurrentShowTimeSeconds(){
	var curTime = new Date();
	//倒计时
	// var ret = endTime.getTime() - curTime.getTime();
	// ret = Math.round(ret/1000);
	// return ret >= 0 ? ret : 0;
	//时钟
	var ret = curTime.getHours() * 3600 + curTime.getMinutes()*60 + curTime.getSeconds();
	return ret; 
}