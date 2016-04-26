var container;
var camera, scene, renderer, controls;
var mesh;
var extrudeSettings;
var line;
var startpoint = 0;
init();
animate();

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

function drawD()
{
	var geometry = new THREE.Geometry();
	var pts2 = [], numPts = 30;
	var theta = 0;
	var d = startpoint;
	var ro = 0;
	var k = 1.5;
	var a = 20;
	for (var j= 0; j < numPts+1; j++){
	 theta= 2*j /numPts* Math.PI;;
	 var rDee= ro + a*Math.cos(theta+ d * Math.sin(theta) )-1;
	 var zDee= a*k*Math.sin(theta);
	 geometry.vertices.push(new THREE.Vector3 (zDee,0,rDee)) ;
	 pts2.push(new THREE.Vector2 (((zDee)),(rDee)))
	}
	
	var material = new THREE.LineBasicMaterial({
		color: 0x0000ff
	});
	line = new THREE.Line( geometry, material );
	
	
	var shape = new THREE.Shape( pts2 );
	drawpath();
	var geometry2 = new THREE.ExtrudeGeometry( shape, extrudeSettings );
	var material = new THREE.MeshLambertMaterial( { color: 0xb00000, wireframe: false } );
	mesh = new THREE.Mesh( geometry2, material );
	mesh.geometry.dynamic = true;
	mesh.rotation.z  = Math.PI / 2;
	
}
var postive = true;
function updateD()
{
	var geometry = new THREE.Geometry();
	var pts2 = [], numPts = 30;
	var theta = 0;
	//var d = THREE.Math.randFloat( 0, 1 ) ;
	var d = startpoint;
	if(postive)
	{
		startpoint += .02;
	}
	else
	{
		startpoint -= .02;
		
	}
	if(startpoint > 1.1)
	{
		postive = false;
	}
	if(startpoint < 0)
	{
		postive = true;
	}
	
	var ro = 0;
	var k = 1.5;
	var a = 20;
	for (var j= 0; j < numPts+1; j++){
	 theta= 2*j /numPts* Math.PI;;
	 var rDee= ro + a*Math.cos(theta+ d * Math.sin(theta) )-1;
	 var zDee= a*k*Math.sin(theta);
	 geometry.vertices.push(new THREE.Vector3 (zDee,0,rDee)) ;
	 pts2.push(new THREE.Vector2 (((zDee)),(rDee)))
	}
	var shape = new THREE.Shape( pts2 );
	var material = new THREE.LineBasicMaterial({
		color: 0x0000ff
	});
	var line2 = new THREE.Line( geometry, material );
	var geometry2 = new THREE.ExtrudeGeometry( shape, extrudeSettings );
	scene.remove(mesh);
	var material = new THREE.MeshLambertMaterial( { color: 0xb00000, wireframe: false } );
	mesh = new THREE.Mesh( geometry2, material ); 
	mesh.rotation.z  = Math.PI / 2;
	
	scene.add( mesh );
}

function init() {
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
	//
	drawD();
	//
	scene.add( mesh );
	scene.add( line );
	

	
	
	
	
	
}
function animate() {
	requestAnimationFrame( animate );
	
	controls.update();
	//mesh.rotation.y += 0.01;
	//mesh.rotation.y += 0.02;
	//updateD();
	renderer.render( scene, camera );
	
	
}
window.setInterval(function(){
   updateD();
  /// call your function here
}, 100);