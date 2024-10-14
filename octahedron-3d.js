<script>
    document.addEventListener("DOMContentLoaded", function() {
    const containers = document.querySelectorAll('.octahedron-3d'); // Select all elements with the class 'octahedron-3d'

    containers.forEach(container => {

        function initOctahedronScene(container) {
            if (typeof THREE === 'undefined' || typeof THREE.OrbitControls === 'undefined') {
                console.error('Three.js or OrbitControls not loaded.');
                return;
            }

            const scene = new THREE.Scene();
            const aspect = container.clientWidth / container.clientHeight;
            const camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
            camera.position.z = 3;

            const renderer = new THREE.WebGLRenderer({ alpha: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            container.appendChild(renderer.domElement);

            // Create Octahedron Geometry for a geometric shape
            const geometry = new THREE.OctahedronGeometry(1, 0); // 0: no additional subdivisions
            const edges = new THREE.EdgesGeometry(geometry);
            const material = new THREE.LineBasicMaterial({ color: 0x131211 });
            const octahedron = new THREE.LineSegments(edges, material);

            scene.add(octahedron);

            const controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableZoom = false;
            controls.rotateSpeed = 0.3;
            controls.enableDamping = true;
            controls.dampingFactor = 0.15;

            // Adjustments for mobile experience
            let floatAmplitude = window.innerWidth <= 767 ? 0.05 : 0.1;
            let floatSpeed = window.innerWidth <= 767 ? 0.5 : 1.0;

            function onResize() {
                const aspect = container.clientWidth / container.clientHeight;
                camera.aspect = aspect;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            }
            window.addEventListener('resize', onResize);

            function animate() {
                controls.update();
                const time = new THREE.Clock().getElapsedTime();
                octahedron.rotation.x += 0.005;
                octahedron.rotation.y += 0.007;
                octahedron.position.y = Math.sin(time * floatSpeed) * floatAmplitude;
                renderer.render(scene, camera);
                requestAnimationFrame(animate);
            }

            // Cleanup Function
            function cleanup() {
                renderer.dispose();
                controls.dispose();
                container.removeChild(renderer.domElement);
                window.removeEventListener('resize', onResize);
            }

            animate();
        }

        const options = {
            root: null,
            rootMargin: '10px 0px 10px 0px',
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    initOctahedronScene(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        observer.observe(container);
    });
});
</script>