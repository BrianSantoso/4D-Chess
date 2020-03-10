/* Directional Light
directionalLight2.position.copy(lightPosition2);
directionalLight2.castShadow = true;
directionalLight2.shadow.camera.right = shadowFrustum;
directionalLight2.shadow.camera.left = -shadowFrustum;
directionalLight2.shadow.camera.top = shadowFrustum;
directionalLight2.shadow.camera.bottom = -shadowFrustum;
directionalLight2.shadow.mapSize.width = shadowMapWidth;
directionalLight2.shadow.mapSize.height = shadowMapHeight;
scene.add(directionalLight2);
*/

/*	Skybox Code
const cubeTextureLoader = new THREE.CubeTextureLoader();
cubeTextureLoader.setPath( 'skybox/' );
const cubeTexture = cubeTextureLoader.load( [
	"wrath_ft.jpg", "wrath_bk.jpg",
	"wrath_up.jpg", "wrath_dn.jpg",
	"wrath_rt.jpg", "wrath_lf.jpg"
] );
scene.background = cubeTexture;
*/

/* Text Overlay example
var text2 = document.createElement('div');
text2.style.position = 'absolute';
//text2.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
text2.style.width = 100;
text2.style.height = 100;
text2.style.backgroundColor = "blue";
text2.innerHTML = "hi there!";
text2.style.top = 200 + 'px';
text2.style.left = 200 + 'px';
document.body.appendChild(text2);
*/