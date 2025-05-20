import * as THREE from 'three';

import scene from './scene';

let clock = new THREE.Clock();
let updateList = [];

function animate() {
    let delta = clock.getDelta();
    scene.userData.controls.update();
    updateList.forEach(function(element) {
        element.update(delta);
    });
    requestAnimationFrame(animate);

    scene.userData.renderer.render(scene, scene.userData.camera);

};

animate();



//监听窗口大小变化
window.addEventListener('resize', function() {
    scene.userData.camera.aspect = window.innerWidth / window.innerHeight;
    scene.userData.camera.updateProjectionMatrix();
    scene.userData.renderer.setSize(window.innerWidth, window.innerHeight);
});

export default updateList;