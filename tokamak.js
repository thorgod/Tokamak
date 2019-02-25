var container;
var camera, scene, renderer, controls;
var mesh;
var extrudeSettings;
var line;
var startpoint = 0;



//Options for D
var options = {
  d: .313,  //D Shape
  ro:  0,  //Radius
  k : 1.5, 
  a : 20
};

//GUI For sliders. Temporary.
var gui = new dat.GUI();

var shape = gui.addFolder('shape');
shape.add(options, 'd', -2, 2,.1).listen();  //D Shape
shape.add(options, 'ro', 0, 100,1).listen(); //Radius
shape.add(options, 'k', 0, 40,.4).listen(); //Hieght 
shape.add(options, 'a', 0, 100).listen();  //Scale
shape.open();



//(Extrude spline)
function drawpath()
{
	var randomPoints = [];
	for ( var i = 0; i < 70; i ++ ) {
		var theta = 1.75*i*Math.PI/70;
		
		randomPoints.push( new THREE.Vector3(  0,60*Math.sin(theta),  60*Math.cos(theta) ) );
	}
	var randomSpline =  new THREE.CatmullRomCurve3( randomPoints );
	randomSpline.closed = false;
	extrudeSettings = {
		steps			: 40,
		bevelEnabled	: false,
		extrudePath		: randomSpline
	};
}



// Main Drawing.
var drawEveryThing = function ()
{
	var geometry = new THREE.Geometry();
	var pts2 = [], numPts = 30;
	var theta = 0;

	// -----------2D  D Vector drwaing here-----------
	for (var j= 0; j < numPts+1; j++){
	 theta= 2*j /numPts* Math.PI;;
	 var rDee= options.ro + options.a*Math.cos(theta+ options.d * Math.sin(theta) )-1;
	 var zDee= options.a*options.k*Math.sin(theta);
	 geometry.vertices.push(new THREE.Vector3 (zDee,0,rDee)) ;
	 pts2.push(new THREE.Vector2 (((zDee)),(rDee)))
	}
	
	//------------ Rotate around spline (AKA Make 3D)----------
	//Remove Mesh, re-add mesh. 
	//Make red!
	//Allign mesh so its horizional with camera
	var shape = new THREE.Shape( pts2 );
	var material = new THREE.LineBasicMaterial({
		color: 0x0000ff
	});
	var line2 = new THREE.Line( geometry, material );
	
	drawpath();
	
	var geometry2 = new THREE.ExtrudeGeometry( shape, extrudeSettings );
	

	scene.remove(mesh);
	var material = new THREE.MeshLambertMaterial( { color: 0xb00000, wireframe: false } );
	mesh = new THREE.Mesh( geometry2, material ); 
	mesh.rotation.z  = Math.PI / 2;
	
	scene.add( mesh );
}


var init = function ()
{
	var info = document.createElement( 'div' );
	info.style.position = 'absolute';
	info.style.top = '10px';
	info.style.width = '100%';
	info.style.textAlign = 'center';
	info.style.color = '#fff';
	info.style.link = '#f80';
	info.innerHTML = '<a href="https://github.com/thorgod/Tokamak/" target="_blank">GitHub</a> Mikes Tokamak';
	document.body.appendChild( info );
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor( 0x222222 );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.set( 0, 0, 500 );
	controls = new THREE.TrackballControls( camera, renderer.domElement );
	controls.minDistance = 200;
	controls.maxDistance = 500;
	scene.add( new THREE.AmbientLight( 0x222222 ) );
	var light = new THREE.PointLight( 0xffffff );
	light.position.copy( camera.position );
	scene.add( light );
	
	
}
var animate = function ()
{
	requestAnimationFrame( animate );
	
	controls.update();
	//mesh.rotation.y += 0.01;
	//mesh.rotation.y += 0.02;
	//updateD();
	renderer.render( scene, camera );
	
	
}
window.setInterval(function(){
   drawEveryThing();
  /// call your function here
}, 100);


init();
animate();
