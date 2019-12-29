// importante saber que el sistema de rendering de 3js debe integrar una figura 3D interesante para el vr, despues de la prueba de instalacion en escritorio, que actualmente para probar la instalacion solo debemos quitar el https, pero para probar el vr debemos ir a android con https para que las camaras se activen... ;)
	
	// init renderer
	var renderer	= new THREE.WebGLRenderer({
		// antialias	: true,
		alpha: true
	});
	renderer.setClearColor(new THREE.Color('lightgrey'), 0)
	// renderer.setPixelRatio( 2 );
	//probamos a no setear el renderer, nada...
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.domElement.style.position = 'absolute'
	renderer.domElement.style.top = '0px'
	renderer.domElement.style.left = '0px'
	document.body.appendChild( renderer.domElement );

	

	// array of functions for the rendering loop
	var onRenderFcts= [];

	// init scene and camera
	var scene	= new THREE.Scene();

	var camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
	//var camera = new THREE.Camera();
	//sustituimos de prueba la camara en perspectiva... nada
	scene.add(camera);

	var vrEffect = null
	if( true ){
		vrEffect = new THREE.VREffect(renderer);
		vrEffect.setSize(window.innerWidth, window.innerHeight);
	}

	// Get the VRDisplay and save it for later.
	var vrDisplay = null;
	navigator.getVRDisplays().then(function(displays){
		if (displays.length > 0) {
			vrDisplay = displays[0];
		}
	});
	window.addEventListener('vrdisplaypresentchange', function onVRDisplayPresentChange() {
		onResize();
	});

	function togglePresent(){
		
		//gamy = document.getElementById("#canvas");
		//console.log('Check this two',gamy, renderer.domElement)
		if( vrDisplay.capabilities.canPresent === false ){
			alert('You vr display can not present!')
			return
		}
		if( vrDisplay.isPresenting ){
			vrDisplay.exitPresent()
		}else{
			//gamy = document.getElementById("#canvas");
			//console.log(gamy, renderer.domElement)
			vrDisplay.requestPresent([{source: renderer.domElement}]);
		}
	}

	
	// Resize the WebGL canvas when we resize and also when we change modes.
	window.addEventListener('resize', onResize);

	function onResize() {
		// handle arToolkitSource resize
		arToolkitSource.onResizeElement(renderer.domElement)		

		// get width/height from arToolkitSource.domElement
		//estos anchos sirven para setear la redimension
		var elementWidth = parseFloat( arToolkitSource.domElement.style.width.replace(/px$/,''), 10 )
		var elementHeight = parseFloat( arToolkitSource.domElement.style.height.replace(/px$/,''), 10 )

		if( vrEffect !== null ){
			vrEffect.setSize(elementWidth, elementHeight);
		}

		if( camera instanceof THREE.PerspectiveCamera === true ){
			camera.aspect = elementWidth / elementHeight;
			camera.updateProjectionMatrix();
		}
	}
	////////////////////////////////////////////////////////////////////////////////
	//          handle arToolkitSource
	////////////////////////////////////////////////////////////////////////////////

	var arToolkitSource = new THREEx.ArToolkitSource({
		// to read from the webcam
		sourceType : 'webcam',

		// // to read from an image
		// sourceType : 'image',
		// sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/images/img.jpg',

		// // to read from a video
		// sourceType : 'video',
		// sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/videos/headtracking.mp4',
	})

	arToolkitSource.init(function onReady(){
		onResize()
	})

	////////////////////////////////////////////////////////////////////////////////
	//          initialize arToolkitContext
	////////////////////////////////////////////////////////////////////////////////

	// create atToolkitContext
	var arToolkitContext = new THREEx.ArToolkitContext({
		cameraParametersUrl: THREEx.ArToolkitContext.baseURL + '/data/data/camera_para.dat',
		detectionMode: 'mono',
		maxDetectionRate: 30,
		canvasWidth: 80*3,
		canvasHeight: 60*3,
	})
	// initialize it
	arToolkitContext.init(function onCompleted(){
		if( camera instanceof THREE.PerspectiveCamera === false ){
			// copy projection matrix to camera
			camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );
		}
	})

	// update artoolkit on every frame
	onRenderFcts.push(function(){
		if( arToolkitSource.ready === false )	return

		arToolkitContext.update( arToolkitSource.domElement )
	})


	////////////////////////////////////////////////////////////////////////////////
	//          Create a ArMarkerControls
	////////////////////////////////////////////////////////////////////////////////

	var markerRoot = new THREE.Group
	scene.add(markerRoot)
	var artoolkitMarker = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
		type : 'pattern',
		patternUrl : THREEx.ArToolkitContext.baseURL + '/data/data/patt.hiro',
		// patternUrl : THREEx.ArToolkitContext.baseURL + '../data/data/patt.kanji',
	})

	//////////////////////////////////////////////////////////////////////////////////
	//		build videoTexture
	//////////////////////////////////////////////////////////////////////////////////

	// get videoTexture
	if( arToolkitSource.domElement.nodeName === 'VIDEO' ){
		var videoTexture = new THREE.VideoTexture(arToolkitSource.domElement)
		// arToolkitSource.domElement.pause()
	}else if( arToolkitSource.domElement.nodeName === 'IMG' ){
		var videoTexture = new THREE.Texture(arToolkitSource.domElement)
		videoTexture.needsUpdate = true
	}
	//else console.assert(false) // que sucederia si quitaramos este assert??
	// TODO to remove if webgl2 - better visual ?
	videoTexture.minFilter =  THREE.NearestFilter


	//////////////////////////////////////////////////////////////////////////////
	//	plane always in front of the camera, exactly as big as the viewport
	//////////////////////////////////////////////////////////////////////////////
	var videoInWebgl = new THREEx.ArVideoInWebgl(videoTexture)
	scene.add(videoInWebgl.object3d);
	arToolkitSource.domElement.style.visibility = 'hidden'

	// TODO extract the fov from the projectionMatrix
	// camera.fov = 43.1
	// camera.fov = 42
	onRenderFcts.push(function(){
		videoInWebgl.update(camera)
	})

/*
Estos materiales si se copian al canvas del efecto vr sin embargo la instancia de unity no
 ... asi que es cuestion de revisar que copia a la matriz de proyeccion --- ok
*/
	var geometry	= new THREE.TorusKnotGeometry(0.7,0.1,64,16);
	var material	= new THREE.MeshNormalMaterial();
	var mesh	= new THREE.Mesh( geometry, material );
	mesh.position.y	= 0.5
	markerRoot.add( mesh );

	onRenderFcts.push(function(){
		// Render the scene.
		if( vrEffect !== null ){
			vrEffect.render(scene, camera);
			unitysync();	
		}else{
			renderer.render( scene, camera );
			unitysync();
		}
		//stats.update();
	})

	// run the rendering loop
	var lastTimeMsec= null

	//que bonica LA API RAF!! que va a 60HZ en android.... 

	requestAnimationFrame(function animate(nowMsec){
		// keep looping
		requestAnimationFrame( animate );
		// measure time
		lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
		var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
		lastTimeMsec	= nowMsec
		// call each update function
		onRenderFcts.forEach(function(onRenderFct){
			onRenderFct(deltaMsec/1000, nowMsec/1000)
		})
	})


	function unitysync(){

		if(unityDataSendReady){
			if(unitylog=="true"){
				UnityLog(target,"true");
			}else{
				UnityLog(target,"false");
				PosSyncX(target,0)
				PosSyncY(target,0)
				PosSyncZ(target,0)
				
				QuatSyncX(target,0)
				QuatSyncY(target,0)
				QuatSyncZ(target,0)
				QuatSyncW(target,0)

			}
			//condicionando el log de arjs	
			
			//tofixed falla.... ya veremos si reasignando los valores y retransmitiendolos tambien falla :) ... no, no falla, sin embargo hay un temblor espeficico de deteccion que parece ser innerente al mismo sistema de coordenadas que tiene el sistema de arjs, y que tiene ciertas variaciones que quizas debemos controlar de alguna manera que filtre los rizos en las mediciones.
			markerx = markerRoot.position.x.toFixed(3);
			markery = markerRoot.position.y.toFixed(3);
			markerz = markerRoot.position.z.toFixed(3);
			marker_x = markerRoot.quaternion._x.toFixed(3);
			marker_y = markerRoot.quaternion._y.toFixed(3);
			marker_z = markerRoot.quaternion._z.toFixed(3);
			marker_w = markerRoot.quaternion._w.toFixed(3);
			
			//console.log("Transformada",typeof(marker_w))
			//console.log("Normal",typeof(markerRoot.quaternion._w))

			//sin fixed mandamos valores de muchos decimales,
			//reasignando el fixed mandamos solo 6 decimales.
			
			PosSyncX(target,parseFloat(markerx))
			PosSyncY(target,parseFloat(markery))
			PosSyncZ(target,parseFloat(markerz))
			
			QuatSyncX(target,parseFloat(marker_x))
			QuatSyncY(target,parseFloat(marker_y))
			QuatSyncZ(target,parseFloat(marker_z))
			QuatSyncW(target,parseFloat(marker_w))
			
		}
		// el log de arjs no tiene que ver con el envio de datos a unity
		if(ArjsDataLog){
			console.log("PS:" + JSON.stringify(markerRoot.position))
			console.log("QT:" + JSON.stringify(markerRoot.quaternion))
			//console.log("QT-fixed proof:", (markerRoot.quaternion._x.toFixed(2)))
		}

	}


