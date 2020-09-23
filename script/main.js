const CANVAS_NAME = 'canvas'
var canvas        =  document.getElementById( CANVAS_NAME );
var ctx           =  canvas.getContext("2d");
document.addEventListener("DOMContentLoaded", startUp);


var sys = {
	mouse : {X: 0, Y: 0, click: false  },
	color:{
		fireLevel : [
		'rgb(242, 186, 19, 0.5)',	//brightness 
		'rgb(242, 186, 19, 0.5)',	//brightness 
		'rgb(242, 162, 14, 0.5)',
		'rgb(242, 162, 14, 0.5)',
		'rgb(242, 119, 12, 0.5)',
		'rgb(216, 65, 10, 0.5)',
		'rgb(216, 65, 10, 0.5)',
	    'rgb(180, 50, 10, 0.3)',  
		'rgb(12, 12, 12, 0.1)', 	// darkness 	
		],
		fuel_off : 'RGB( 141, 81, 55)',
		fuel_on: 'RGB( 216, 100, 40)',
		bg :'#6595BF',
		sys : 'rgb(12, 12, 12)',
		n_sys: 'rgb(243, 243, 243)',
		arrow: 'rgb(12, 12, 12)',
	},
	score: 1,
	max_score : 1,
	r : 0,
};
		

function startUp(){
	// add events listers 
	window.addEventListener( 'resize',  updateScreen );
	
	canvas.addEventListener('mousemove', mouseMove, false );
	canvas.addEventListener('mousedown', mouseDown, false );
	canvas.addEventListener('mouseup', mouseUp, false );
	canvas.addEventListener('mouseleave', mouseUp, false );
	
gameStart();
update();
}
function gameStart(){
	
	// add fuel
	sys.fuel = new Fuel(), //0.0002
	sys.fuel.add(100, 100 , 0.0005);
	sys.fuel.add(400, 200 , 0 );
	
	//add arrow 
	sys.arrow = new Arrow();
	
	//*add fire 
	sys.fire = new Fire();
	
}

function update(){
//screen	
	updateScreen();	
	// BG
	ctx.fillStyle = sys.color.bg;
	ctx.fillRect (  0,0,  canvas.width , canvas.height );

//update 
	//fuel
	sys.fuel.update();
	sys.fuel.view(); 
	//arrow 
	sys.arrow.update();
	sys.arrow.view();
	//fire 
	sys.fire.update();
	sys.fire.view();

//score 
	ctx.fillStyle = sys.color.sys;
	ctx.font = "30px Arial";
	ctx.fillText("score: "+sys.score, 20, 30 );
	ctx.fillText("max score: "+sys.max_score, 20, 60 );
//floor 
	ctx.fillRect (  0,canvas.height * 0.90,  canvas.width , canvas.height * 0.1 );
//game rudes 
	newFuel(); 
	scoreUp();
	gameover();

window.requestAnimationFrame( update);	
}

// game rudes 
function scoreUp(){
	sys.score = sys.fire.list.length;
	if( sys.score > sys.max_score ){
		sys.max_score = sys.score;
	}
	
}
function newFuel(){
	sys.r ++; 
	var r = Math.random();
	if( r > 0.998 || sys.r > 200 ){
		sys.fuel.add( canvas.width *( Math.random()*0.8 +0.1)  , 0 ,0) 
		sys.r = 0 ;	
	}
	
}

function gameover(){
	var bor = 0;
	for( i of sys.fuel.activeList ){
		if( i.burn !== 0){
			bor++;
		}
	}
	for( i of sys.fire.list ){
		if( i.burn !== 0){
			bor++;
		}
	}
	
	if( bor == 0){
		//text
		ctx.fillStyle = sys.color.sys;
		ctx.font = "60px Arial black ";
		ctx.fillText("GAME OVER",canvas.width/2 , canvas.height/2	);
		ctx.font = "30px Arial  ";
		ctx.fillText("max score: "+sys.max_score,canvas.width/2 +10 , canvas.height/2+30	);
		
		//button
		if( sys.mouse.X > canvas.width/2 && sys.mouse.X < canvas.width/2 +400 
			&& sys.mouse.Y > canvas.height/2 +40 && sys.mouse.Y < canvas.height/2 +140 
			){ ctx.fillStyle = sys.color.n_sys ;
				}
		ctx.fillRect( canvas.width/2 , canvas.height/2 +40 , 400, 100 )
		
		if( sys.mouse.X > canvas.width/2 && sys.mouse.X < canvas.width/2 +400 
			&& sys.mouse.Y > canvas.height/2 +40&& sys.mouse.Y < canvas.height/2 +140 
			){ ctx.fillStyle = sys.color.sys ;
				}else{
				ctx.fillStyle = sys.color.n_sys ;
			}
		ctx.fillText( "play again ",canvas.width/2+ 140 , canvas.height/2 +90  )
		
		if( sys.mouse.X > canvas.width/2 && sys.mouse.X < canvas.width/2 +400 
			&& sys.mouse.Y > canvas.height/2 +40&& sys.mouse.Y < canvas.height/2 +140 
			&&  sys.mouse.click
			){ 
				gameStart();
				}
	}
}
//Math
function Point ( X, Y) {
	this.X = X;
	this.Y = Y;
	this.mod = function(){
		return  Math.sqrt( this.X**2 +  this.Y**2 );
	}
}

//screen 
function updateScreen()
{
	canvas.width = window.innerWidth    ;
	canvas.height = window.innerHeight   ;
};

//fuel 
function Fuel(){
	this.activeList = [];
	this.add = function (x, y, b){
		var new_fuel = {
			X : x,
			Y : y, 
			R : 1.5,
			burn : b  ,
			u: b,
		}
		this.activeList.push(new_fuel)
	}
	this.update = function() {
		for (  i in this.activeList ){
			//+burn
			var f = new Point(0,0 );
				
			for (  u in sys.fire.list ){
				f.X = sys.fire.list[u].X- this.activeList[i].X;
				f.Y = sys.fire.list[u].Y- this.activeList[i].Y;
				/**/	
				if(  f.mod() < this.activeList[i].R * canvas.height * 0.03  ){
					//console.log( f.X );
					this.activeList[i].burn += 0.00001;
					sys.fire.list.splice ( u,1 ); 
				}	
			}
			
			//radius
			if( this.activeList[i].Y + this.activeList[i].R * canvas.height * 0.03 
				+ canvas.height * 0.02 < canvas.height * 0.9 ){
					this.activeList[i].Y += canvas.height * 0.02;
			}else{
				this.activeList[i].Y =  canvas.height * 0.9 
									- this.activeList[i].R * canvas.height * 0.03 ;
			}
			
			//burn 
			if( this.activeList[i].R - this.activeList[i].burn >0.05 ){
				if( this.activeList[i].burn > 0 ){
					
					for( var u = 1; u < this.activeList[i].u* 100; u++ ){
						var r = Math.PI *( 1/2- Math.random() )
						sys.fire.add( this.activeList[i].X + this.activeList[i].R * canvas.height * 0.04* Math.sin(r ),
									  this.activeList[i].Y - this.activeList[i].R * canvas.height * 0.04 * Math.cos(r ) )
					}
					
					if( 1 >= this.activeList[i].u* 100 ) {
						this.activeList[i].u += 0.0002
					}else{
						this.activeList[i].u = 10*this.activeList[i].burn;
					}
					this.activeList[i].R -= this.activeList[i].burn;
				}
			}else{
				this.activeList.splice ( i,1 )
			}
			
		}
	}
	this.view = function() {
		for (  i of this.activeList ){
			ctx.beginPath();
			ctx.arc(i.X, i.Y, i.R * canvas.height * 0.03 , 0, 2 * Math.PI);
			
			if( i.burn > 0 ){
				ctx.fillStyle = sys.color.fuel_on;
			}else{
				ctx.fillStyle = sys.color.fuel_off;
			}
			ctx.lineWidth = canvas.height * 0.002;
			ctx.strokeStyle = sys.color.sys;
			ctx.stroke();	
			ctx.fill();
		}
	}
	
} 


//arrow 
function Arrow(){
	this.list = [];
	this.add = function(x0, y0 , xi ,yi, ative ){
		var new_arrow = {
			X0 :x0,
			Y0 :y0,
			Xi :xi,
			Yi :yi, 
			T : 1,
			ative: ative, 
		}
		this.list.push(new_arrow);
		
	}

	this.down = function(){
		this.add( 	sys.mouse.X, sys.mouse.Y,
					sys.mouse.X, sys.mouse.Y, 
					true);	
	}
	
	this.up = function(){
		for( i of this.list ){
			if( i.ative ){
				i.Xi = sys.mouse.X;
				i.Yi = sys.mouse.Y;
				i.ative = false;
			}  
		}

	}

	this.update = function(){
		for( i in this.list ){
			if(  this.list[ i ].ative  ){
				this.list[i].Xi = sys.mouse.X;
				this.list[i].Yi = sys.mouse.Y;
				
			}else{
				if(  this.list[i].T - 0.02 > 0 ){
					this.list[i].T -= 0.02
				}else{
					this.list.splice ( i,1 );
				}
			}  
		}
	}
	this.view = function(){
		for( i of this.list ){
			ctx.lineWidth = canvas.height * 0.02* i.T**2;
			ctx.strokeStyle = sys.color.arrow;
			
			//line
			ctx.beginPath(); 
			  ctx.moveTo( i.X0, i.Y0);
			  ctx.lineTo( i.Xi, i.Yi);
			ctx.stroke();
			//arrow
			ctx.beginPath();
				ctx.arc(i.Xi, i.Yi, canvas.height * 0.01* i.T**2 , 0, 2 * Math.PI);
				ctx.fillStyle = sys.color.arrow;
			ctx.stroke();	
			
			
		}
	}
	
	this.calc = function(x, y){
		var sum = new Point(0, 0);
		
		var force = new Point(0, 0);
		var mod1 = new Point(x,y);
		var mod2 = new Point(x,y);
		
		for( u of this.list ){
			if( ! u.ative  ){
				force.X = u.Xi - u.X0; 
				force.Y = u.Yi - u.Y0; 
				
				mod1.X = x - u.Xi ;
				mod1.Y = y - u.Yi ;
				
				mod2.X = x - u.X0 ;
				mod2.Y = y - u.Y0 ;
				
				var mod = force.mod()
				var e = Math.E ** -( ( ( mod1.mod() + mod2.mod() )/(mod *0.1)  )**2 )
				sum.X += ( force.X/mod ) * e;
				sum.Y += ( force.Y/mod ) * e;
				
				
			}
		}
		var mod = sum.mod()
			
		if(mod >0){
			sum.X /= mod/10; 
			sum.Y /= mod/10;	
		}
		
		return sum;
	}
}
//fire
function Fire(){
	this.list = [];
	this.add = function(x,y ){
		var new_fire = {
			X:x,
			Y:y,
			burn : 0, 
		}
		this.list.push(new_fire);	
	}
	
	this.update = function(){
		// particles 
		for( i of this.list ){
			// pos
			var pos = sys.arrow.calc( i.X, i.Y );
			i.X += canvas.height * 0.006* Math.sin( 2*	Math.PI * Math.random() ) 
				+ pos.X;
			i.Y -= canvas.height * 0.006 * Math.sin( 1*	Math.PI * Math.random() ) - pos.Y;	
			// burn 
			if(  i.burn + 1< sys.color.fireLevel.length ){
				i.burn += 0.05;
			}else{
				this.list.splice ( i,1 )
			}
		}
		
	}

	this.view = function(){
		for( i of this.list ){
			ctx.beginPath();
				ctx.arc(i.X, i.Y,  canvas.height * 0.01 * (( sys.color.fireLevel.length - i.burn) /sys.color.fireLevel.length +1), 
				0, 2 * Math.PI);
			ctx.fillStyle = sys.color.fireLevel[ Math.floor( i.burn ) ];
			ctx.fill();
		}
	}
}

//mouse

function mouseMove (mouse){
	mouse.preventDefault(); 
		sys.mouse.X = 	mouse.clientX - canvas.getBoundingClientRect().left;
		sys.mouse.Y =	mouse.clientY - canvas.getBoundingClientRect().top;
	//console.log( sys.mouse)
}
function mouseDown (){
	sys.arrow.down();
	sys.mouse.click = true;
	
}
function mouseUp(){
	sys.arrow.up();
	sys.mouse.click = false ;
}
 
