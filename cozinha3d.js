(() => {
  const errorBox = document.querySelector("#game-error");
  const status = document.querySelector("#game-status");
  const hint = document.querySelector("#scene-hint");
  const canvas = document.querySelector("#kitchen-scene");
  const actionButton = document.querySelector("#interact-button");
  const restartButton = document.querySelector("#restart-turn");
  const recipeName = document.querySelector("#recipe-name");
  const recipeSteps = document.querySelector("#recipe-steps");
  const turnTimer = document.querySelector("#turn-timer");
  const orderTimer = document.querySelector("#order-timer");
  const servedDisplay = document.querySelector("#served");
  const scoreDisplay = document.querySelector("#score");

  if (!window.THREE) {
    errorBox.hidden = false;
    errorBox.textContent = "Não foi possível carregar o Three.js. Confira sua conexão e recarregue a página.";
    status.textContent = "A cozinha 3D não pôde iniciar.";
    hint.textContent = "Conexão com a internet necessária para carregar o Three.js.";
    actionButton.disabled = true;
    return;
  }

  const THREE = window.THREE;
  const recipes = [
    { title: "Estrogonofe", ingredients: ["Frango", "Creme", "Molho"], station: "fogão", cookingAction: "mexer a panela" },
    { title: "Feijoada", ingredients: ["Feijão", "Carnes", "Bacon", "Coentro"], garnish: "Laranja", station: "fogão", cookingAction: "mexer a panela" },
    { title: "Churrasco", ingredients: ["Carnes", "Sal grosso", "Farofa"], station: "churrasqueira", cookingAction: "virar as carnes" }
  ];
  const customers = [
    { name: "Seu Zeca", waiting: "Minha barriga já pediu a conta duas vezes!", happy: "Esse prato merece aplauso... e repeteco!" },
    { name: "Dona Fifi", waiting: "A novela acabou e a comida ainda não chegou!", happy: "Nota dez. E olha que eu trouxe minha lupa crítica!" },
    { name: "Nino", waiting: "Eu já cresci um centímetro esperando!", happy: "Gostei tanto que até dividi. Quase!" }
  ];
  const turnLength = 300;
  const clock = new THREE.Clock();
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#f1dfbf");
  scene.fog = new THREE.Fog("#f1dfbf", 19, 34);
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);
  camera.position.set(9, 12, 12);
  camera.lookAt(0, 0, 0);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  } catch (error) {
    errorBox.hidden = false;
    errorBox.textContent = "Seu navegador não conseguiu iniciar o WebGL necessário para desenhar a cozinha 3D.";
    status.textContent = "A cozinha 3D não pôde iniciar.";
    hint.textContent = "WebGL não está disponível neste dispositivo ou navegador.";
    actionButton.disabled = true;
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  scene.add(new THREE.HemisphereLight("#fff5de", "#897254", 2.2));
  const sun = new THREE.DirectionalLight("#fff3d4", 3);
  sun.position.set(-5, 12, 7);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  scene.add(sun);

  const materials = {
    floor: new THREE.MeshStandardMaterial({ color: "#e7cda5", roughness: 0.95 }),
    tile: new THREE.MeshStandardMaterial({ color: "#f6e8cc", roughness: 0.92 }),
    wood: new THREE.MeshStandardMaterial({ color: "#9b6848", roughness: 0.85 }),
    woodLight: new THREE.MeshStandardMaterial({ color: "#c18a5c", roughness: 0.78 }),
    cream: new THREE.MeshStandardMaterial({ color: "#fff8e9", roughness: 0.75 }),
    red: new THREE.MeshStandardMaterial({ color: "#bd5535", roughness: 0.8 }),
    dark: new THREE.MeshStandardMaterial({ color: "#343039", roughness: 0.58 }),
    steel: new THREE.MeshStandardMaterial({ color: "#bfc2c3", metalness: 0.38, roughness: 0.45 }),
    leaf: new THREE.MeshStandardMaterial({ color: "#80a66c", roughness: 0.9 }),
    accent: new THREE.MeshStandardMaterial({ color: "#e1a34b", roughness: 0.7 })
  };
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const sphereGeometry = new THREE.SphereGeometry(1, 20, 16);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(14, 11), materials.floor);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.07;
  floor.receiveShadow = true;
  scene.add(floor);

  for (let x = -6.5; x < 7; x += 1) {
    for (let z = -5; z < 5.5; z += 1) {
      if ((Math.round(x + z) & 1) !== 0) continue;
      const tile = new THREE.Mesh(new THREE.PlaneGeometry(0.98, 0.98), materials.tile);
      tile.rotation.x = -Math.PI / 2;
      tile.position.set(x, -0.055, z);
      tile.receiveShadow = true;
      scene.add(tile);
    }
  }

  function makeBox(parent, material, position, size, castShadow = true) {
    const mesh = new THREE.Mesh(boxGeometry, material);
    mesh.position.set(...position);
    mesh.scale.set(...size);
    mesh.castShadow = castShadow;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  function makeSphere(parent, material, position, size) {
    const mesh = new THREE.Mesh(sphereGeometry, material);
    mesh.position.set(...position);
    mesh.scale.set(...size);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  function makeTextSprite(text, color = "#624832") {
    const board = document.createElement("canvas");
    board.width = 512;
    board.height = 128;
    const context = board.getContext("2d");
    context.fillStyle = "rgba(255,253,248,0.94)";
    context.beginPath();
    context.roundRect(10, 10, 492, 108, 24);
    context.fill();
    context.strokeStyle = "#dec9a8";
    context.lineWidth = 6;
    context.stroke();
    context.fillStyle = color;
    context.font = "bold 42px Trebuchet MS, sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, 256, 65, 455);
    const texture = new THREE.CanvasTexture(board);
    texture.colorSpace = THREE.SRGBColorSpace;
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true }));
    sprite.scale.set(2.4, 0.6, 1);
    return sprite;
  }

  function makeCounter(position, size) {
    const group = new THREE.Group();
    group.position.set(...position);
    scene.add(group);
    makeBox(group, materials.wood, [0, 0.48, 0], size, false);
    makeBox(group, materials.woodLight, [0, 0.79, 0], [size[0] * 1.04, 0.12, size[2] * 1.05], false);
    for (const x of [-0.38, 0.38]) {
      makeBox(group, materials.wood, [x * size[0], 0.22, 0], [0.09, 0.46, size[2] * 0.72], false);
    }
    return group;
  }

  function addLabeledStation(label, position, size) {
    const group = makeCounter(position, size);
    const sign = makeTextSprite(label);
    sign.position.set(0, 1.28, 0);
    group.add(sign);
    return group;
  }

  addLabeledStation("INGREDIENTES", [-4.3, 0, -3.1], [3, 0.65, 1.1]);
  const ingredientCrateColors = ["#e58b50", "#efd180", "#79a36b", "#bb6e70"];
  for (let index = 0; index < 4; index += 1) {
    const crateMaterial = new THREE.MeshStandardMaterial({ color: ingredientCrateColors[index], roughness: 0.88 });
    const crate = makeBox(scene, crateMaterial, [-5.25 + index * 0.64, 1.03, -3.1], [0.48, 0.38, 0.48]);
    crate.rotation.y = Math.PI / 4;
    makeSphere(scene, materials.cream, [-5.25 + index * 0.64, 1.28, -3.1], [0.14, 0.13, 0.14]);
  }

  const cookStation = addLabeledStation("FOGÃO", [3.9, 0, -3.1], [2.4, 0.65, 1.15]);
  makeBox(cookStation, materials.dark, [0, 0.91, 0], [1.35, 0.18, 0.85]);
  const hotplate = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.44, 0.1, 24), materials.dark);
  hotplate.position.set(0, 1.06, 0);
  hotplate.castShadow = true;
  cookStation.add(hotplate);
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.3, 0.42, 24), materials.steel);
  pot.position.set(0, 1.33, 0);
  pot.castShadow = true;
  cookStation.add(pot);
  const potInside = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.035, 24), materials.dark);
  potInside.position.set(0, 1.55, 0);
  cookStation.add(potInside);
  const grillGrate = makeBox(cookStation, materials.steel, [0, 1.08, 0], [1.25, 0.08, 0.76], false);
  grillGrate.visible = false;
  const grillSlots = new THREE.Group();
  grillSlots.position.set(0, 1.13, 0);
  cookStation.add(grillSlots);
  for (let index = -3; index <= 3; index += 1) {
    const bar = makeBox(grillSlots, materials.dark, [index * 0.16, 0, 0], [0.035, 0.035, 0.72], false);
    bar.castShadow = false;
  }
  const grillFire = makeBox(cookStation, materials.red, [0, 0.79, 0], [1.15, 0.15, 0.68], false);
  grillFire.visible = false;
  cookStation.userData.pot = pot;
  cookStation.userData.potInside = potInside;
  cookStation.userData.hotplate = hotplate;
  cookStation.userData.grillGrate = grillGrate;
  cookStation.userData.grillSlots = grillSlots;
  cookStation.userData.grillFire = grillFire;

  addLabeledStation("MONTAR PRATO", [3.9, 0, 2.2], [2.4, 0.65, 1.15]);
  const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.53, 0.1, 32), materials.cream);
  plate.position.set(3.9, 0.93, 2.2);
  plate.castShadow = true;
  scene.add(plate);
  const plateFood = new THREE.Group();
  plateFood.position.set(3.9, 1, 2.2);
  scene.add(plateFood);

  const serveStation = addLabeledStation("ENTREGAR", [-4.3, 0, 2.2], [2.6, 0.65, 1.2]);
  const bellBase = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.3, 0.1, 18), materials.accent);
  bellBase.position.set(0.6, 0.96, 0);
  bellBase.castShadow = true;
  serveStation.add(bellBase);
  const bellTop = new THREE.Mesh(new THREE.SphereGeometry(0.2, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2), materials.accent);
  bellTop.position.set(0.6, 1.01, 0);
  serveStation.add(bellTop);
  const customer = new THREE.Group();
  customer.position.set(-4.3, 0, 3.36);
  scene.add(customer);
  makeSphere(customer, materials.dark, [0, 0.64, 0], [0.35, 0.45, 0.3]);
  makeSphere(customer, materials.accent, [0, 1.25, 0], [0.34, 0.34, 0.34]);

  const wallMaterial = new THREE.MeshStandardMaterial({ color: "#e7c79d", roughness: 1 });
  makeBox(scene, wallMaterial, [0, 1.65, -5.15], [14, 3.4, 0.3], false);
  makeBox(scene, materials.wood, [0, 0.28, -4.92], [14, 0.28, 0.25], false);
  const windowFrame = makeBox(scene, materials.cream, [0, 2.15, -4.94], [3.15, 1.55, 0.12], false);
  const windowGlass = new THREE.MeshStandardMaterial({ color: "#b4d8d1", roughness: 0.38, metalness: 0.05 });
  makeBox(scene, windowGlass, [0, 2.15, -4.85], [2.82, 1.25, 0.09], false);
  makeBox(scene, materials.cream, [0, 2.15, -4.76], [0.1, 1.35, 0.09], false);
  makeBox(scene, materials.cream, [0, 2.15, -4.75], [2.95, 0.1, 0.09], false);

  const chef = new THREE.Group();
  const chefBody = new THREE.Group();
  chef.add(chefBody);
  scene.add(chef);
  makeSphere(chefBody, new THREE.MeshStandardMaterial({ color: "#f0a94f", roughness: 0.92 }), [0, 0.78, 0], [0.43, 0.48, 0.34]);
  makeSphere(chefBody, new THREE.MeshStandardMaterial({ color: "#f5b960", roughness: 0.92 }), [0, 1.45, 0], [0.53, 0.48, 0.44]);
  const earMaterial = new THREE.MeshStandardMaterial({ color: "#e89b41", roughness: 0.9 });
  for (const side of [-1, 1]) {
    const ear = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.48, 4), earMaterial);
    ear.position.set(side * 0.35, 1.8, 0);
    ear.rotation.z = side * -0.16;
    ear.castShadow = true;
    chefBody.add(ear);
  }
  const facePatch = new THREE.MeshStandardMaterial({ color: "#fff1dc", roughness: 1 });
  makeSphere(chefBody, facePatch, [0, 1.32, 0.37], [0.36, 0.22, 0.11]);
  const eyeMaterial = new THREE.MeshStandardMaterial({ color: "#374638", roughness: 0.38 });
  makeSphere(chefBody, eyeMaterial, [-0.19, 1.49, 0.408], [0.045, 0.063, 0.03]);
  makeSphere(chefBody, eyeMaterial, [0.19, 1.49, 0.408], [0.045, 0.063, 0.03]);
  makeSphere(chefBody, new THREE.MeshStandardMaterial({ color: "#bd6e76", roughness: 0.75 }), [0, 1.36, 0.478], [0.055, 0.04, 0.03]);
  const jacket = new THREE.Mesh(new THREE.CapsuleGeometry(0.28, 0.27, 4, 8), materials.cream);
  jacket.position.set(0, 0.78, 0);
  jacket.scale.set(1.3, 1, 1);
  jacket.castShadow = true;
  chefBody.add(jacket);
  makeBox(chefBody, materials.red, [0, 1.04, 0.31], [0.19, 0.12, 0.035], false);
  const apron = makeBox(chefBody, materials.cream, [0, 0.71, 0.29], [0.43, 0.35, 0.06], false);
  apron.material = materials.cream;
  const toque = new THREE.Group();
  chefBody.add(toque);
  const hatBand = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.31, 0.13, 20), materials.cream);
  hatBand.position.set(0, 1.91, 0);
  toque.add(hatBand);
  makeSphere(toque, materials.cream, [-0.16, 2.04, 0], [0.17, 0.22, 0.17]);
  makeSphere(toque, materials.cream, [0, 2.09, 0], [0.2, 0.25, 0.19]);
  makeSphere(toque, materials.cream, [0.16, 2.04, 0], [0.17, 0.22, 0.17]);
  const legMaterial = new THREE.MeshStandardMaterial({ color: "#efad50", roughness: 0.9 });
  for (const side of [-1, 1]) {
    const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.105, 0.24, 3, 7), legMaterial);
    leg.position.set(side * 0.18, 0.2, 0);
    leg.castShadow = true;
    chefBody.add(leg);
  }
  const footMaterial = new THREE.MeshStandardMaterial({ color: "#8e5037", roughness: 0.8 });
  for (const side of [-1, 1]) makeSphere(chefBody, footMaterial, [side * 0.18, 0.08, 0.06], [0.16, 0.09, 0.22]);
  chef.position.set(0, 0, 1.9);

  const stations = [
    { kind: "ingredients", position: new THREE.Vector3(-4.3, 0, -3.1), group: null },
    { kind: "cook", position: new THREE.Vector3(3.9, 0, -3.1), group: cookStation },
    { kind: "plate", position: new THREE.Vector3(3.9, 0, 2.2), group: plateFood },
    { kind: "serve", position: new THREE.Vector3(-4.3, 0, 2.2), group: serveStation }
  ];
  const targetRing = new THREE.Mesh(
    new THREE.RingGeometry(0.65, 0.78, 40),
    new THREE.MeshBasicMaterial({ color: "#d68b49", transparent: true, opacity: 0.76, side: THREE.DoubleSide })
  );
  targetRing.rotation.x = -Math.PI / 2;
  targetRing.position.y = 0.018;
  targetRing.visible = false;
  scene.add(targetRing);

  const heldDirections = new Set();
  const activePointers = new Map();
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let currentRecipe = 0;
  let currentCustomer = 0;
  let collected = 0;
  let hasGarnish = false;
  let orderElapsed = 0;
  let remainingSeconds = turnLength;
  let served = 0;
  let score = 0;
  let totalStars = 0;
  let mistakes = 0;
  let phase = "collect";
  let nearby = null;
  let isPlaying = true;
  let customerTimeout = null;
  let timerInterval = null;

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  function say(message, isError = false) {
    status.textContent = message;
    status.classList.toggle("is-error", isError);
  }

  function renderRecipe() {
    const recipe = recipes[currentRecipe];
    recipeName.textContent = `${recipe.title} · ${customers[currentCustomer].name}`;
    recipeSteps.replaceChildren(...recipe.ingredients.map((ingredient, index) => {
      const item = document.createElement("li");
      item.textContent = index < collected ? `✓ ${ingredient}` : ingredient;
      item.classList.toggle("is-done", index < collected);
      return item;
    }));
    cookStation.userData.pot.visible = recipe.station === "fogão";
    cookStation.userData.potInside.visible = recipe.station === "fogão";
    cookStation.userData.hotplate.visible = recipe.station === "fogão";
    cookStation.userData.grillGrate.visible = recipe.station === "churrasqueira";
    cookStation.userData.grillSlots.visible = recipe.station === "churrasqueira";
    cookStation.userData.grillFire.visible = recipe.station === "churrasqueira";
    const stationSign = cookStation.children.find((child) => child.isSprite);
    if (stationSign) {
      const texture = stationSign.material.map;
      const context = texture.image.getContext("2d");
      context.clearRect(0, 0, 512, 128);
      context.fillStyle = "rgba(255,253,248,0.94)";
      context.beginPath();
      context.roundRect(10, 10, 492, 108, 24);
      context.fill();
      context.strokeStyle = "#dec9a8";
      context.lineWidth = 6;
      context.stroke();
      context.fillStyle = "#624832";
      context.font = "bold 42px Trebuchet MS, sans-serif";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(recipe.station === "fogão" ? "FOGÃO" : "CHURRASQUEIRA", 256, 65, 455);
      texture.needsUpdate = true;
    }
    if (nearby) setTarget(nearby);
    else sceneHintForPhase();
  }

  function sceneHintForPhase() {
    if (!isPlaying) {
      hint.textContent = "Turno encerrado. Recarregue a página para jogar de novo.";
      return;
    }
    const recipe = recipes[currentRecipe];
    const prompts = {
      collect: `Pegue ${recipe.ingredients[collected]} na bancada de ingredientes.`,
      cook: `Pedido completo! Vá até o ${recipe.station} e ${recipe.cookingAction}.`,
      plate: "Receita pronta! Vá até a estação para montar o prato.",
      garnish: `Prato montado! Finalize com ${recipe.garnish}.`,
      serve: "Prato montado! Leve até o balcão e entregue ao cliente."
    };
    hint.innerHTML = `${prompts[phase]} <span>WASD / setas · E interagir</span>`;
  }

  function setTarget(station) {
    nearby = station;
    targetRing.visible = Boolean(station) && isPlaying;
    if (!station) {
      actionButton.disabled = true;
      sceneHintForPhase();
      return;
    }
    targetRing.position.x = station.position.x;
    targetRing.position.z = station.position.z;
    const names = { ingredients: "bancada de ingredientes", cook: recipes[currentRecipe].station, plate: "estação de montagem", serve: "balcão de entrega" };
    const expectedStation = { collect: "ingredients", cook: "cook", plate: "plate", garnish: "plate", serve: "serve" }[phase];
    const actions = {
      ingredients: phase === "collect" ? `Pegar ${recipes[currentRecipe].ingredients[collected]}` : "Ingredientes",
      cook: phase === "cook" ? recipes[currentRecipe].cookingAction : "Preparar",
      plate: phase === "plate" ? "Montar prato" : phase === "garnish" ? `Adicionar ${recipes[currentRecipe].garnish}` : "Estação de montagem",
      serve: phase === "serve" ? "Entregar pedido" : "Balcão de entrega"
    };
    actionButton.disabled = !isPlaying || station.kind !== expectedStation;
    if (station.kind !== expectedStation) {
      actionButton.textContent = `Próxima: ${names[expectedStation]}`;
      hint.innerHTML = `Próxima etapa: ${names[expectedStation]}. <span>WASD / setas · E interagir</span>`;
      return;
    }
    actionButton.textContent = `🖐️ ${actions[station.kind]}`;
    hint.innerHTML = `Pressione <span>E</span> para ${actions[station.kind].toLowerCase()} · ${names[station.kind]}`;
  }

  function updateNearby() {
    let nearest = null;
    let closest = 1.8;
    for (const station of stations) {
      const distance = Math.hypot(chef.position.x - station.position.x, chef.position.z - station.position.z);
      if (distance < closest) {
        nearest = station;
        closest = distance;
      }
    }
    if (nearest !== nearby) setTarget(nearest);
  }

  function loseTime(message) {
    if (!isPlaying) return;
    mistakes += 1;
    remainingSeconds = Math.max(0, remainingSeconds - 2);
    turnTimer.textContent = formatTime(remainingSeconds);
    say(`${message} -2s`, true);
    if (remainingSeconds === 0) finishGame();
  }

  function clearFoodFromPlate() {
    for (const child of [...plateFood.children]) {
      plateFood.remove(child);
      child.geometry.dispose();
      child.material.dispose();
    }
  }

  function addFoodToPlate(includeGarnish = false) {
    clearFoodFromPlate();
    const recipe = recipes[currentRecipe];
    const ingredientList = includeGarnish && recipe.garnish ? [...recipe.ingredients, recipe.garnish] : recipe.ingredients;
    ingredientList.forEach((ingredient, index) => {
      const color = ingredient === "Laranja" ? "#ee9b40" : ingredient === "Coentro" ? "#6f9c5e" : ingredient === "Feijão" ? "#604333" : ingredient === "Frango" || ingredient === "Carnes" ? "#b35d46" : ingredient === "Farofa" ? "#e0bf72" : "#f2dfc0";
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.17, 12, 10), new THREE.MeshStandardMaterial({ color, roughness: 0.9 }));
      const angle = (index / ingredientList.length) * Math.PI * 2;
      mesh.position.set(Math.cos(angle) * 0.27, 0.15 + (index % 2) * 0.05, Math.sin(angle) * 0.27);
      mesh.castShadow = true;
      plateFood.add(mesh);
    });
  }

  function interact() {
    if (!isPlaying) return;
    if (!nearby) {
      say("Chegue perto de uma estação para interagir.");
      return;
    }
    if (nearby.kind === "ingredients" && phase === "collect") {
      const ingredient = recipes[currentRecipe].ingredients[collected];
      collected += 1;
      renderRecipe();
      if (collected === recipes[currentRecipe].ingredients.length) {
        phase = "cook";
        sceneHintForPhase();
        say(`Ingredientes reunidos! Agora vá ao ${recipes[currentRecipe].station}.`);
      } else {
        say(`${ingredient} na cestinha! Próximo: ${recipes[currentRecipe].ingredients[collected]}.`);
      }
      return;
    }
    if (nearby.kind === "cook" && phase === "cook") {
      phase = "plate";
      cookStation.userData.pot.rotation.z = recipes[currentRecipe].station === "fogão" ? 0.12 : 0;
      renderRecipe();
      chefBody.position.y = reducedMotion ? 0 : 0.16;
      window.setTimeout(() => { chefBody.position.y = 0; }, 240);
      say(recipes[currentRecipe].station === "fogão" ? "Mexeu a panela! Receita no ponto — agora monte o prato." : "Virou as carnes! Churrasco pronto — hora de montar.");
      return;
    }
    if (nearby.kind === "plate" && phase === "plate") {
      phase = recipes[currentRecipe].garnish ? "garnish" : "serve";
      addFoodToPlate();
      renderRecipe();
      say(recipes[currentRecipe].garnish
        ? `Prato montado! Agora finalize com ${recipes[currentRecipe].garnish}.`
        : "Prato montado! Leve ao balcão para o cliente.");
      return;
    }
    if (nearby.kind === "plate" && phase === "garnish") {
      hasGarnish = true;
      phase = "serve";
      addFoodToPlate(true);
      renderRecipe();
      say(`${recipes[currentRecipe].garnish} no prato — agora pode entregar!`);
      return;
    }
    if (nearby.kind === "serve" && phase === "serve") {
      deliverOrder();
      return;
    }
    loseTime("Essa estação não é a próxima da comanda.");
  }

  function deliverOrder() {
    window.clearTimeout(customerTimeout);
    const speedStars = orderElapsed <= 35 ? 5 : orderElapsed <= 55 ? 4 : orderElapsed <= 80 ? 3 : orderElapsed <= 110 ? 2 : 1;
    const stars = Math.max(1, speedStars - Math.min(mistakes, 4));
    const orderPoints = stars * 20;
    const customer = customers[currentCustomer];
    served += 1;
    score += orderPoints;
    totalStars += stars;
    servedDisplay.textContent = String(served);
    scoreDisplay.textContent = String(score);
    say(`${customer.happy} ${"⭐".repeat(stars)} · ${orderPoints} pontos (${orderElapsed}s).`);
    phase = "collect";
    collected = 0;
    orderElapsed = 0;
    mistakes = 0;
    hasGarnish = false;
    currentRecipe = (currentRecipe + 1) % recipes.length;
    currentCustomer = (currentCustomer + 1) % customers.length;
    chef.position.set(0, 0, 1.9);
    chef.rotation.y = 0;
    setTarget(null);
    renderRecipe();
    customerTimeout = window.setTimeout(() => {
      if (isPlaying) say(`${customers[currentCustomer].name}: “Cheguei! Meu apetite chegou antes de mim!”`);
    }, 1400);
  }

  function finishGame() {
    window.clearInterval(timerInterval);
    window.clearTimeout(customerTimeout);
    isPlaying = false;
    remainingSeconds = 0;
    turnTimer.textContent = "00:00";
    targetRing.visible = false;
    actionButton.disabled = true;
    const averageStars = served ? (totalStars / served).toFixed(1) : "0.0";
    say(served ? `Turno encerrado! ${served} pratos, ${score} pontos e média de ${averageStars}/5 estrelas.` : "Turno encerrado! A equipe felina pede revanche.");
    sceneHintForPhase();
  }

  function startTimer() {
    window.clearInterval(timerInterval);
    timerInterval = window.setInterval(() => {
      if (!isPlaying) return;
      remainingSeconds = Math.max(0, remainingSeconds - 1);
      orderElapsed += 1;
      turnTimer.textContent = formatTime(remainingSeconds);
      orderTimer.textContent = formatTime(orderElapsed);
      if (orderElapsed === 12) say(`${customers[currentCustomer].name}: “${customers[currentCustomer].waiting}”`);
      if (orderElapsed === 24) say(`${customers[currentCustomer].name}: “Se demorar, vou pedir delivery pro meu gato!”`);
      if (remainingSeconds === 0) finishGame();
    }, 1000);
  }

  function startTurn() {
    window.clearTimeout(customerTimeout);
    clearFoodFromPlate();
    heldDirections.clear();
    currentRecipe = 0;
    currentCustomer = 0;
    collected = 0;
    hasGarnish = false;
    orderElapsed = 0;
    remainingSeconds = turnLength;
    served = 0;
    score = 0;
    totalStars = 0;
    mistakes = 0;
    phase = "collect";
    nearby = null;
    isPlaying = true;
    chef.position.set(0, 0, 1.9);
    chef.rotation.y = 0;
    chefBody.position.y = 0;
    targetRing.visible = false;
    turnTimer.textContent = formatTime(remainingSeconds);
    orderTimer.textContent = "00:00";
    servedDisplay.textContent = "0";
    scoreDisplay.textContent = "0";
    actionButton.disabled = true;
    renderRecipe();
    say("Turno iniciado! Ande até a bancada de ingredientes.");
    startTimer();
  }

  function resize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.fov = width < 620 ? 56 : 42;
    camera.updateProjectionMatrix();
  }

  function moveChef(delta) {
    if (!isPlaying) return;
    let x = 0;
    let z = 0;
    if (heldDirections.has("left")) x -= 1;
    if (heldDirections.has("right")) x += 1;
    if (heldDirections.has("up")) z -= 1;
    if (heldDirections.has("down")) z += 1;
    if (!x && !z) return;
    const length = Math.hypot(x, z);
    x /= length;
    z /= length;
    chef.position.x = THREE.MathUtils.clamp(chef.position.x + x * delta * 3.2, -6.1, 6.1);
    chef.position.z = THREE.MathUtils.clamp(chef.position.z + z * delta * 3.2, -4.2, 4.2);
    chef.rotation.y = Math.atan2(x, z);
    if (!reducedMotion) chefBody.position.y = Math.sin(clock.elapsedTime * 14) * 0.025;
  }

  function stepChef(direction) {
    if (!isPlaying) return;
    const steps = { left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1] };
    const [x, z] = steps[direction];
    chef.position.x = THREE.MathUtils.clamp(chef.position.x + x * 0.55, -6.1, 6.1);
    chef.position.z = THREE.MathUtils.clamp(chef.position.z + z * 0.55, -4.2, 4.2);
    chef.rotation.y = Math.atan2(x, z);
    updateNearby();
  }

  const keyDirection = {
    ArrowLeft: "left", a: "left", A: "left",
    ArrowRight: "right", d: "right", D: "right",
    ArrowUp: "up", w: "up", W: "up",
    ArrowDown: "down", s: "down", S: "down"
  };
  window.addEventListener("keydown", (event) => {
    const direction = keyDirection[event.key];
    if (direction) {
      event.preventDefault();
      heldDirections.add(direction);
    }
    if ((event.key === "e" || event.key === "E" || event.key === "Enter") && !event.repeat) interact();
  });
  window.addEventListener("keyup", (event) => {
    const direction = keyDirection[event.key];
    if (direction) heldDirections.delete(direction);
  });
  window.addEventListener("blur", () => heldDirections.clear());
  canvas.addEventListener("pointerdown", () => canvas.focus());
  function releasePointer(event) {
    const activePointer = activePointers.get(event.pointerId);
    if (!activePointer) return;
    activePointers.delete(event.pointerId);
    heldDirections.delete(activePointer.direction);
    if (performance.now() - activePointer.startedAt < 220) stepChef(activePointer.direction);
  }

  document.querySelectorAll("[data-move]").forEach((button) => {
    const direction = button.dataset.move;
    if (direction === "interact") {
      button.addEventListener("click", interact);
      return;
    }
    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      heldDirections.add(direction);
      activePointers.set(event.pointerId, { direction, startedAt: performance.now() });
    });
    button.addEventListener("click", (event) => {
      if (event.detail === 0) stepChef(direction);
    });
  });
  window.addEventListener("pointerup", releasePointer);
  window.addEventListener("pointercancel", releasePointer);
  actionButton.addEventListener("click", interact);
  restartButton.addEventListener("click", startTurn);
  window.addEventListener("resize", resize);
  new ResizeObserver(resize).observe(canvas);

  renderRecipe();
  resize();
  actionButton.disabled = true;
  say("Cozinha pronta! Ande até a bancada de ingredientes.");
  sceneHintForPhase();
  startTimer();
  let elapsed = 0;
  renderer.setAnimationLoop(() => {
    const delta = Math.min(clock.getDelta(), 0.05);
    elapsed += delta;
    moveChef(delta);
    updateNearby();
    if (!reducedMotion) targetRing.scale.setScalar(1 + Math.sin(elapsed * 3) * 0.04);
    renderer.render(scene, camera);
  });
})();
