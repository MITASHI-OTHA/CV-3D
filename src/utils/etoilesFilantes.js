let scene, camera, renderer, starsGeometry, stars;
const starImage =
  "data:image/png;base64,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";
const animateStars = () => {
  starsGeometry.vertices.forEach((p) => {
    p.velocity += p.acceleration;
    p.y -= p.velocity;

    if (p.y < -200) {
      p.y = 200;
      p.velocity = 0;
    }
  });
  starsGeometry.verticesNeedUpdate = true;
  stars.rotation.y += 0.002;

  renderer.render(scene, camera);
  requestAnimationFrame(animateStars);
};

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

const initSetup = () => {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  renderer = new THREE.WebGLRenderer();

  camera.position.z = 1;
  camera.rotation.x = Math.PI / 2;

  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  starsGeometry = new THREE.Geometry();
  for (let i = 0; i < 6000; i++) {
    let star = new THREE.Vector3(
      Math.random() + 600 - 300,
      Math.random() + 600 - 300,
      Math.random() + 600 - 300
    );
    star.velocity = 0;
    star.acceleration = 0.02;
    starsGeometry.vertices.push(star);
  }

  let sprite = new THREE.TextureLoader().load(starImage);
  let starsMaterial = new THREE.PointsMaterial({
    color: 0xaaaaaa,
    size: 0.7,
    map: sprite,
  });

  stars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(stars);
  console.log(scene);

  window.addEventListener("resize", onWindowResize, false);

  animateStars();
};

initSetup();
