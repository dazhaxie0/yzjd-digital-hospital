import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

//创建场景
const scene = new THREE.Scene();

//创建相机
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    500 
);

camera.position.set(0, 120, 0);
camera.lookAt(0, 0, 0);
scene.userData.camera = camera;

//创建渲染器
const renderer = new THREE.WebGLRenderer(
    {
        antialias: true,
        alpha: true,
        logarithmicDepthBuffer: true
    }
);

scene.userData.renderer = renderer;

renderer.setPixelRatio(window.devicePixelRatio); // 根据设备像素比调整分辨率
renderer.setSize(window.innerWidth, window.innerHeight);

//设置渲染器启用阴影
renderer.shadowMap.enabled = true;
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 1;

document.body.appendChild(renderer.domElement );

//添加世界坐标轴辅助器
const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );
scene.userData.axesHelper = axesHelper;


//网格辅助器
const gridHelper = new THREE.GridHelper(100, 100);
gridHelper.material.opacity = 0.2;
gridHelper.material.transparent = true;
scene.add(gridHelper);
scene.userData.gridHelper = gridHelper;

//轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.autoRotateSpeed = 0.05;
controls.autoRotate = true;
scene.userData.controls = controls;

//rgbe加载器
const rgbeLoader = new RGBELoader();
scene.userData.rgbeLoader = rgbeLoader;
rgbeLoader.load('/texture/sky/NoEmotion-Dayhdr_Day_0016_4k.hdr', (envMap) => 
{

    envMap.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = envMap;
    scene.environment = envMap;
    scene.userData.envMap = envMap;
    scene.backgroundIntensity=5;
});

//gltf加载器
const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
gltfLoader.setDRACOLoader( dracoLoader);

scene.userData.gltfLoader = gltfLoader;

// 添加地面
const planeGeometry = new THREE.PlaneGeometry(500, 500);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x00FFFF });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = 0;
plane.receiveShadow = true;
scene.add(plane);



// 设置柔和阴影
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//环境光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // 减弱环境光强度
scene.add(ambientLight);
scene.userData.ambientLight = ambientLight;

//平行光
const directionalLight = new THREE.DirectionalLight(0xfff7e8, 3); // 增加光源强度
directionalLight.position.set(50, 100, 50);

directionalLight.castShadow = true;
directionalLight.shadow.camera.top = 150; // 扩大阴影相机范围
directionalLight.shadow.camera.bottom = -150;
directionalLight.shadow.camera.left = -150;
directionalLight.shadow.camera.right = 150;
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 300;
directionalLight.shadow.mapSize.set(8192, 8192); // 提高阴影分辨率
scene.add(directionalLight);
scene.userData.directionalLight = directionalLight;


// 调整渲染器曝光
renderer.toneMappingExposure = 1.5;


//创建GUI
const gui = new GUI();
scene.userData.gui = gui;

// 确保 GUI 被正确添加到 DOM
gui.domElement.style.position = 'absolute';
gui.domElement.style.top = '0px';
gui.domElement.style.right = '0px';
document.body.appendChild(gui.domElement);

// 添加平行光的 GUI 控件
const directionalLightFolder = gui.addFolder('Directional Light');
directionalLightFolder.add(directionalLight, 'intensity', 0, 10, 0.1).name('Intensity');
directionalLightFolder.addColor({ color: directionalLight.color.getHex() }, 'color')
    .name('Color')
    .onChange((value) => {
        directionalLight.color.set(value);
    });
directionalLightFolder.add(directionalLight.position, 'x', -200, 200, 1).name('Position X');
directionalLightFolder.add(directionalLight.position, 'y', -200, 200, 1).name('Position Y');
directionalLightFolder.add(directionalLight.position, 'z', -200, 200, 1).name('Position Z');
directionalLightFolder.open();

// 添加环境光的 GUI 控件
const ambientLightFolder = gui.addFolder('Ambient Light');
ambientLightFolder.add(ambientLight, 'intensity', 0, 5, 0.1).name('Intensity');
ambientLightFolder.addColor({ color: ambientLight.color.getHex() }, 'color')
    .name('Color')
    .onChange((value) => {
        ambientLight.color.set(value);
    });
ambientLightFolder.open();

// 添加渲染器曝光的 GUI 控件
const rendererFolder = gui.addFolder('Renderer');
rendererFolder.add(renderer, 'toneMappingExposure', 0.1, 5, 0.1).name('Exposure');
rendererFolder.open();

// 添加鼠标点击事件监听器
window.addEventListener('mousedown', (event) => {
    // 获取鼠标在屏幕上的位置
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // 创建射线投射器
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, scene.userData.camera);

    // 检测与场景中物体的交互
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        // 获取第一个交互点的坐标
        const point = intersects[0].point;
        console.log(`点击位置的世界坐标: x=${point.x}, y=${point.y}, z=${point.z}`);
    } else {
        console.log('未点击到任何物体');
    }
});


export default scene;