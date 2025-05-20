import * as THREE from 'three';
import scene from './core/scene.js';
import updateList from './core/runAnimate.js';

// 创建 Raycaster 和鼠标向量
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// 当前模型对象
let currentModel = null;

// 加载模型函数
function loadModel(url) {
    // 移除旧模型
    if (currentModel) {
        scene.remove(currentModel);
        currentModel.traverse(child => {
            if (child.isMesh) {
                child.geometry.dispose();
                if (child.material.map) child.material.map.dispose();
                child.material.dispose();
            }
        });
        currentModel = null;
    }
    // 加载新模型
    scene.userData.gltfLoader.load(url, (gltf) => {
        currentModel = gltf.scene;
        // 设置阴影
        currentModel.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        scene.add(currentModel);
    });
}

// 初始加载地下二层模型
loadModel('./model/-2.glb');

// 监听按钮点击
document.addEventListener('DOMContentLoaded', () => {
    const buttons = Array.from(document.querySelectorAll('.bottom-buttons button'));
    const btnB2 = buttons.find(b => b.textContent === '地下二层');
    const btnB1 = buttons.find(b => b.textContent === '地下一层');
    const btnB3 = buttons.find(b => b.textContent === '首层');
    const btnB4 = buttons.find(b => b.textContent === '二层');
    const btnB5 = buttons.find(b => b.textContent === '三层');
    const btnB6 = buttons.find(b => b.textContent === '四层');
    const btnB7 = buttons.find(b => b.textContent === '五层');
    const btnB8 = buttons.find(b => b.textContent === '塔楼');

    if (btnB2) {
        btnB2.addEventListener('click', () => {
            loadModel('./model/-2.glb');
        });
    }
    if (btnB1) {
        btnB1.addEventListener('click', () => {
            loadModel('./model/-1.glb');
        });
    }
    if (btnB3) {
        btnB3.addEventListener('click', () => {
            loadModel('./model/1.glb');
        });
    }
    if (btnB4) {
        btnB4.addEventListener('click', () => {
            loadModel('./model/2.glb');
        });
    }
    if (btnB5) {
        btnB5.addEventListener('click', () => {
            loadModel('./model/3.glb');
        });
    }
    if (btnB6) {
        btnB6.addEventListener('click', () => {
            loadModel('./model/4.glb');
        });
    }
    if (btnB7) {
        btnB7.addEventListener('click', () => {
            loadModel('./model/5.glb');
        });
    }
    // 塔楼弹出菜单
    const towerBtn = document.getElementById('tower-btn');
    const towerMenu = document.getElementById('tower-menu');
    if (towerBtn && towerMenu) {
        towerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            towerMenu.style.display = towerMenu.style.display === 'flex' ? 'none' : 'flex';
        });
        // 点击页面其他地方关闭菜单
        document.addEventListener('click', () => {
            towerMenu.style.display = 'none';
        });
        towerMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // 子菜单按钮事件（示例，需根据实际模型路径调整）
        const towerBtns = towerMenu.querySelectorAll('button');
        towerBtns[0].addEventListener('click', () => loadModel('./model/6-12北塔楼.glb'));
        towerBtns[1].addEventListener('click', () => loadModel('./model/6南塔楼.glb'));
        towerBtns[2].addEventListener('click', () => loadModel('./model/7-10南塔楼.glb'));
        towerBtns[3].addEventListener('click', () => loadModel('./model/11 12南塔楼.glb'));
        towerBtns[4].addEventListener('click', () => loadModel('./model/13塔楼.glb'));
        towerBtns[5].addEventListener('click', () => loadModel('./model/13塔楼.glb'));
    }
});
