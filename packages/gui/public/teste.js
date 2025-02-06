console.log("teste");

importScripts("./threejs.js");

self.onmessage = function (e) {
    const { canvas } = e.data;
    
    if (!canvas) {
        return;
    }

    if (canvas.style === undefined) {
        canvas.style = {};
    }

    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(1000, 1000);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(100, 1, 0.1, 9000);
    camera.position.z = 2;

    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xaaaa7f, wireframe: true });
    const cube = new THREE.Mesh(geometry, material);
    console.log(geometry);
    scene.add(cube);


    function animate() {
        cube.rotation.x += 0.01;
        // cube.rotation.y += 0.01;
        // cube.rotation.z += 0.01;
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
        renderer.setSize(1000, 1000);
    }

    animate();

    console.log("after")

    return new Promise(() => {

    });
};