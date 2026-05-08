function initThreeBackground() {
  if (!window.THREE || document.getElementById("threeBgCanvas")) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1400);
  camera.position.set(0, 0, 240);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.id = "threeBgCanvas";
  document.body.prepend(renderer.domElement);

  const ambient = new THREE.AmbientLight(0x9ff0b6, 0.95);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xffffff, 0.9);
  keyLight.position.set(40, 50, 80);
  scene.add(keyLight);

  const fillLight = new THREE.PointLight(0x49d58c, 0.8, 700);
  fillLight.position.set(-40, -30, 120);
  scene.add(fillLight);

  const textureCanvas = document.createElement("canvas");
  textureCanvas.width = 256;
  textureCanvas.height = 128;
  const tx = textureCanvas.getContext("2d");
  tx.fillStyle = "#83d39d";
  tx.fillRect(0, 0, 256, 128);
  tx.strokeStyle = "#2f6f43";
  tx.lineWidth = 8;
  tx.strokeRect(6, 6, 244, 116);
  tx.fillStyle = "#1f5d36";
  tx.font = "700 58px Poppins";
  tx.textAlign = "center";
  tx.textBaseline = "middle";
  tx.fillText("$", 128, 64);
  tx.font = "600 18px Poppins";
  tx.fillText("FINMASTER", 128, 26);
  tx.fillText("ACADEMY", 128, 104);
  for (let i = 0; i < 18; i += 1) {
    tx.fillStyle = `rgba(255,255,255,${Math.random() * 0.3})`;
    tx.fillRect(Math.random() * 256, Math.random() * 128, Math.random() * 4 + 1, Math.random() * 4 + 1);
  }
  const dollarTexture = new THREE.CanvasTexture(textureCanvas);
  dollarTexture.anisotropy = 4;

  const billCount = window.innerWidth < 700 ? 28 : 55;
  const bills = [];
  const billGeometry = new THREE.PlaneGeometry(22, 11.6, 1, 1);

  for (let i = 0; i < billCount; i += 1) {
    const mat = new THREE.MeshStandardMaterial({
      map: dollarTexture,
      transparent: true,
      opacity: Math.random() * 0.35 + 0.45,
      side: THREE.DoubleSide,
      roughness: 0.65,
      metalness: 0.15,
    });

    const bill = new THREE.Mesh(billGeometry, mat);
    bill.position.set((Math.random() - 0.5) * 300, (Math.random() - 0.5) * 220, (Math.random() - 0.5) * 320);
    bill.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    bill.userData = {
      fallSpeed: (Math.random() * 0.85 + 0.45) / 2,
      driftSpeed: Math.random() * 0.02 + 0.008,
      swayAmp: Math.random() * 0.9 + 0.3,
      spinX: (Math.random() - 0.5) * 0.028,
      spinY: (Math.random() - 0.5) * 0.03,
      spinZ: (Math.random() - 0.5) * 0.03,
      phase: Math.random() * Math.PI * 2,
    };
    bills.push(bill);
    scene.add(bill);
  }

  const clock = new THREE.Clock();

  function animate() {
    const t = clock.getElapsedTime();
    bills.forEach((bill) => {
      const d = bill.userData;
      bill.position.y -= d.fallSpeed;
      bill.position.x += Math.sin(t * d.driftSpeed * 30 + d.phase) * d.swayAmp;
      bill.rotation.x += d.spinX;
      bill.rotation.y += d.spinY;
      bill.rotation.z += d.spinZ;

      if (bill.position.y < -145) {
        bill.position.y = 145;
        bill.position.x = (Math.random() - 0.5) * 300;
        bill.position.z = (Math.random() - 0.5) * 320;
      }
    });

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener("resize", onResize);
  animate();
}
