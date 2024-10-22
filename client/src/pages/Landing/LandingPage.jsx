import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

const LandingPage = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Create a renderer and append it to the mountRef div
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    mountRef.current.appendChild(renderer.domElement);

    // Set up the scene, camera, and geometry
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 10);
    camera.position.z = 2;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.03;

    // Create stars
    const createStars = () => {
      const starGeometry = new THREE.SphereGeometry(0.005, 24, 24); // Small sphere for stars
      const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      for (let i = 0; i < 500; i++) {
        const star = new THREE.Mesh(starGeometry, starMaterial);
        
        // Randomize the position of each star
        const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(10)); // Spread stars over an area
        star.position.set(x, y, z);
        scene.add(star);
      }
    };

    // Call the function to create stars
    createStars();

    // Set up the icosahedron geometry
    const geo = new THREE.IcosahedronGeometry(1.0, 2);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      flatShading: true,
    });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    // Add a hemisphere light
    const hemiLight = new THREE.HemisphereLight(0x0099ff, 0x008000);
    scene.add(hemiLight);

    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
    });
    const wireMesh = new THREE.Mesh(geo, wireMat);
    wireMesh.scale.setScalar(1.0002);
    mesh.add(wireMesh);

    // Load the font and create text geometry
    const fontLoader = new FontLoader();
    fontLoader.load(
      'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', // Path to a font JSON file
      (font) => {
        const textGeometry = new TextGeometry('YK Estates', {
          font: font,
          size: 0.1,
          height: 0.02,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 0.01,
          bevelSize: 0.01,
          bevelSegments: 1,
        });

        const textMaterial = new THREE.MeshStandardMaterial({ color: 0xfff });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(-0.5, 0, 1); // Adjust the position of the text on the icosahedron
        mesh.add(textMesh);
      }
    );

    // Animation loop
    const animate = (t = 0) => {
      requestAnimationFrame(animate);
      mesh.rotation.y = t * 0.0001;
      renderer.render(scene, camera);
      controls.update();
    };
    animate();

    return () => {
      // Clean up on component unmount
      renderer.dispose();
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />;
};

export default LandingPage;
