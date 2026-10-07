import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface BuildingCanvas3DProps {
  scrollProgress: number; // 0 to 1
  activeProjectTier: 'foundation' | 'podium' | 'midrise' | 'skyvillas' | 'crown' | null;
  cameraPreset?: 'cinematic' | 'isometric' | 'front' | 'detail';
}

export const BuildingCanvas3D: React.FC<BuildingCanvas3DProps> = ({
  scrollProgress,
  activeProjectTier,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);

  // References to keep animation state across renders
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const buildingGroupRef = useRef<THREE.Group | null>(null);

  // Sub-groups for construction stages
  const foundationGroupRef = useRef<THREE.Group | null>(null);
  const structuralCoreRef = useRef<THREE.Group | null>(null);
  const floorsGroupRef = useRef<THREE.Group[]>([]);
  const facadeGroupRef = useRef<THREE.Group | null>(null);
  const glassGroupRef = useRef<THREE.Group | null>(null);
  const interiorLightsRef = useRef<THREE.PointLight[]>([]);
  const spotLightRef = useRef<THREE.SpotLight | null>(null);
  const tierMeshMapRef = useRef<{ [key: string]: THREE.Mesh[] }>({});

  // Target camera coordinates for smooth interpolation
  const targetCamPos = useRef(new THREE.Vector3(14, 10, 18));
  const currentCamPos = useRef(new THREE.Vector3(14, 10, 18));
  const targetCamLook = useRef(new THREE.Vector3(0, 5, 0));
  const currentCamLook = useRef(new THREE.Vector3(0, 5, 0));
  const mousePos = useRef({ x: 0, y: 0 });

  // Scroll smoothing refs
  const targetScrollProg = useRef(0);
  const currentScrollProg = useRef(0);

  // Check WebGL support
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
      if (!gl) setWebglSupported(false);
    } catch {
      setWebglSupported(false);
    }
  }, []);

  // Update target scroll progress
  useEffect(() => {
    targetScrollProg.current = scrollProgress;
  }, [scrollProgress]);

  // Track mouse parallax (disabled on mobile and touch devices to prevent touch jerk)
  useEffect(() => {
    const isMobile =
      typeof window !== 'undefined' &&
      (window.innerWidth < 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0);

    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mousePos.current = { x: x * 0.3, y: y * 0.2 };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Main Three.js Scene Setup
  useEffect(() => {
    if (!containerRef.current || !webglSupported) return;

    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const isMobile =
      typeof window !== 'undefined' &&
      (window.innerWidth < 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0);

    // 1. Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x121212, 0.015);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 200);
    camera.position.set(16, 12, 20);
    cameraRef.current = camera;

    // 3. Optimized Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: 'high-performance',
      precision: isMobile ? 'mediump' : 'highp',
    });
    renderer.setSize(width, height);
    // Clamp DPR for high frame rate (1.25 on mobile, 1.5 on desktop)
    renderer.setPixelRatio(isMobile ? Math.min(window.devicePixelRatio, 1.25) : Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isMobile;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting System
    const ambientLight = new THREE.AmbientLight(0xebe6df, 0.75);
    scene.add(ambientLight);

    // Warm Key Light
    const keyLight = new THREE.DirectionalLight(0xfff0db, 2.2);
    keyLight.position.set(22, 35, 18);
    if (!isMobile) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 5;
      keyLight.shadow.camera.far = 80;
      keyLight.shadow.camera.left = -18;
      keyLight.shadow.camera.right = 18;
      keyLight.shadow.camera.top = 22;
      keyLight.shadow.camera.bottom = -8;
      keyLight.shadow.bias = -0.0008;
    }
    scene.add(keyLight);

    // Soft Cool Fill Light
    const fillLight = new THREE.DirectionalLight(0x768a9e, 1.0);
    fillLight.position.set(-20, 15, -15);
    scene.add(fillLight);

    // Warm Architectural Accent Spotlight
    const spotLight = new THREE.SpotLight(0xd4af37, 2.2);
    spotLight.position.set(0, 30, 20);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.8;
    spotLight.decay = 1.5;
    spotLight.distance = 70;
    scene.add(spotLight);
    spotLightRef.current = spotLight;

    // 5. Materials (Lightweight Standard Materials)
    const concreteMat = new THREE.MeshStandardMaterial({
      color: 0x9E978E,
      roughness: 0.85,
      metalness: 0.1,
    });

    const darkGraniteMat = new THREE.MeshStandardMaterial({
      color: 0x1A1A1A,
      roughness: 0.6,
      metalness: 0.3,
    });

    const bronzeMetalMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.35,
      metalness: 0.8,
    });

    const darkSteelMat = new THREE.MeshStandardMaterial({
      color: 0x242424,
      roughness: 0.5,
      metalness: 0.7,
    });

    // Highly performant tinted glass without multi-pass transmission overhead
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x141e24,
      metalness: 0.85,
      roughness: 0.1,
      transparent: true,
      opacity: 0.6,
    });

    const illuminatedInteriorMat = new THREE.MeshStandardMaterial({
      color: 0xffdfa8,
      emissive: new THREE.Color(0xffdfa8),
      emissiveIntensity: 0.6,
    });

    // 6. Master Building Group
    const masterBuilding = new THREE.Group();
    scene.add(masterBuilding);
    buildingGroupRef.current = masterBuilding;

    // Tier mapping for project focus
    tierMeshMapRef.current = {
      foundation: [],
      podium: [],
      midrise: [],
      skyvillas: [],
      crown: [],
    };

    // A. Foundation & Ground Grid
    const foundationGroup = new THREE.Group();
    masterBuilding.add(foundationGroup);
    foundationGroupRef.current = foundationGroup;

    // Ground Paving Plinth
    const plinthGeo = new THREE.BoxGeometry(22, 0.6, 22);
    const plinthMesh = new THREE.Mesh(plinthGeo, darkGraniteMat);
    plinthMesh.position.y = -0.3;
    plinthMesh.receiveShadow = !isMobile;
    foundationGroup.add(plinthMesh);
    tierMeshMapRef.current.foundation.push(plinthMesh);

    // Foundation Pedestals & Ground Grid Lines
    const gridHelper = new THREE.GridHelper(26, 26, 0xd4af37, 0x272b2e);
    gridHelper.position.y = 0.02;
    foundationGroup.add(gridHelper);

    // Subterranean excavation / foundation footings
    for (let x = -8; x <= 8; x += 4) {
      for (let z = -8; z <= 8; z += 4) {
        const footingGeo = new THREE.CylinderGeometry(0.5, 0.6, 1.2, 12);
        const footingMesh = new THREE.Mesh(footingGeo, darkSteelMat);
        footingMesh.position.set(x, -0.6, z);
        foundationGroup.add(footingMesh);
      }
    }

    // B. Structural Core
    const structuralGroup = new THREE.Group();
    masterBuilding.add(structuralGroup);
    structuralCoreRef.current = structuralGroup;

    // Central Elevator Shear Core
    const coreGeo = new THREE.BoxGeometry(3.6, 22, 3.6);
    const coreMesh = new THREE.Mesh(coreGeo, concreteMat);
    coreMesh.position.y = 11;
    coreMesh.castShadow = !isMobile;
    coreMesh.receiveShadow = !isMobile;
    structuralGroup.add(coreMesh);

    // Corner Mega-Columns
    const columnPositions = [
      [-6, -6],
      [6, -6],
      [-6, 6],
      [6, 6],
      [-6, 0],
      [6, 0],
      [0, -6],
      [0, 6],
    ];
    columnPositions.forEach(([cx, cz]) => {
      const colGeo = new THREE.BoxGeometry(0.7, 21, 0.7);
      const colMesh = new THREE.Mesh(colGeo, darkSteelMat);
      colMesh.position.set(cx, 10.5, cz);
      colMesh.castShadow = !isMobile;
      structuralGroup.add(colMesh);
    });

    // C. Floor Slabs
    floorsGroupRef.current = [];
    interiorLightsRef.current = [];
    const floorHeights = [1.8, 3.8, 5.8, 8.0, 10.2, 12.6, 15.0, 17.4, 19.8];

    // Shared key ambient interior lights
    const interiorLight1 = new THREE.PointLight(0xffdfa8, 1.2, 15);
    interiorLight1.position.set(0, 5, 0);
    masterBuilding.add(interiorLight1);
    interiorLightsRef.current.push(interiorLight1);

    const interiorLight2 = new THREE.PointLight(0xffdfa8, 1.2, 15);
    interiorLight2.position.set(0, 15, 0);
    masterBuilding.add(interiorLight2);
    interiorLightsRef.current.push(interiorLight2);

    floorHeights.forEach((fy, idx) => {
      const floorGroup = new THREE.Group();
      floorGroup.position.y = fy;
      masterBuilding.add(floorGroup);
      floorsGroupRef.current.push(floorGroup);

      let w = 12;
      let d = 12;
      let tier: 'podium' | 'midrise' | 'skyvillas' | 'crown' = 'podium';

      if (idx <= 1) {
        w = 14;
        d = 14;
        tier = 'podium';
      } else if (idx <= 4) {
        w = 12.5;
        d = 11.5;
        tier = 'midrise';
      } else if (idx <= 6) {
        w = 10.5;
        d = 9.5;
        tier = 'skyvillas';
      } else {
        w = 8.5;
        d = 8.5;
        tier = 'crown';
      }

      // Concrete Slab
      const slabGeo = new THREE.BoxGeometry(w, 0.4, d);
      const slabMesh = new THREE.Mesh(slabGeo, concreteMat);
      slabMesh.castShadow = !isMobile;
      slabMesh.receiveShadow = !isMobile;
      floorGroup.add(slabMesh);
      tierMeshMapRef.current[tier].push(slabMesh);

      // Bronze slab fascia trim
      const trimGeo = new THREE.BoxGeometry(w + 0.1, 0.15, d + 0.1);
      const trimMesh = new THREE.Mesh(trimGeo, bronzeMetalMat);
      floorGroup.add(trimMesh);

      // Interior ceiling illuminated warm bar
      const glowGeo = new THREE.BoxGeometry(w * 0.6, 0.05, d * 0.6);
      const glowMesh = new THREE.Mesh(glowGeo, illuminatedInteriorMat);
      glowMesh.position.y = 1.6;
      floorGroup.add(glowMesh);

      // Cantilevered Terrace Railing & Balcony
      if (tier === 'skyvillas' || tier === 'crown') {
        const balustradeGeo = new THREE.BoxGeometry(w + 0.3, 0.7, d + 0.3);
        const balustradeMesh = new THREE.Mesh(balustradeGeo, glassMat);
        balustradeMesh.position.y = 0.45;
        floorGroup.add(balustradeMesh);
      }
    });

    // D. Architectural Facade, Brise-Soleil, & Mullions
    const facadeGroup = new THREE.Group();
    masterBuilding.add(facadeGroup);
    facadeGroupRef.current = facadeGroup;

    // Vertical Bronze Louvers
    for (let i = -5.5; i <= 5.5; i += 1.2) {
      const louverGeo = new THREE.BoxGeometry(0.12, 10, 0.6);
      const louverMesh1 = new THREE.Mesh(louverGeo, bronzeMetalMat);
      louverMesh1.position.set(i, 8, 6.2);
      louverMesh1.castShadow = !isMobile;
      facadeGroup.add(louverMesh1);
      tierMeshMapRef.current.midrise.push(louverMesh1);

      const louverMesh2 = new THREE.Mesh(louverGeo, bronzeMetalMat);
      louverMesh2.position.set(i, 8, -6.2);
      louverMesh2.castShadow = !isMobile;
      facadeGroup.add(louverMesh2);
      tierMeshMapRef.current.midrise.push(louverMesh2);
    }

    // Grand Entrance Pavilion Canopy
    const canopyGeo = new THREE.BoxGeometry(10, 0.3, 5);
    const canopyMesh = new THREE.Mesh(canopyGeo, bronzeMetalMat);
    canopyMesh.position.set(0, 3.8, 8);
    canopyMesh.castShadow = !isMobile;
    facadeGroup.add(canopyMesh);
    tierMeshMapRef.current.podium.push(canopyMesh);

    // Slim Bronze Canopy Columns
    const cCol1 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 3.8, 10), bronzeMetalMat);
    cCol1.position.set(-4.5, 1.9, 10);
    facadeGroup.add(cCol1);
    const cCol2 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 3.8, 10), bronzeMetalMat);
    cCol2.position.set(4.5, 1.9, 10);
    facadeGroup.add(cCol2);

    // Rooftop Sculptural Crown / Pergola
    const crownGroup = new THREE.Group();
    crownGroup.position.y = 20.2;
    facadeGroup.add(crownGroup);

    for (let r = -3.5; r <= 3.5; r += 1.0) {
      const ribGeo = new THREE.BoxGeometry(7.6, 0.25, 0.15);
      const ribMesh = new THREE.Mesh(ribGeo, bronzeMetalMat);
      ribMesh.position.set(0, 1.2, r);
      ribMesh.castShadow = !isMobile;
      crownGroup.add(ribMesh);
      tierMeshMapRef.current.crown.push(ribMesh);
    }

    // Sky Spire / Architectural Fin
    const spireGeo = new THREE.CylinderGeometry(0.06, 0.2, 5, 8);
    const spireMesh = new THREE.Mesh(spireGeo, bronzeMetalMat);
    spireMesh.position.set(0, 23.5, 0);
    facadeGroup.add(spireMesh);
    tierMeshMapRef.current.crown.push(spireMesh);

    // E. Glass Curtain Wall Envelope
    const glassGroup = new THREE.Group();
    masterBuilding.add(glassGroup);
    glassGroupRef.current = glassGroup;

    // Podium Glass Curtain
    const pGlassGeo = new THREE.BoxGeometry(13.6, 3.6, 13.6);
    const pGlassMesh = new THREE.Mesh(pGlassGeo, glassMat);
    pGlassMesh.position.y = 2.0;
    glassGroup.add(pGlassMesh);
    tierMeshMapRef.current.podium.push(pGlassMesh);

    // Midrise Glass Envelope
    const mGlassGeo = new THREE.BoxGeometry(11.8, 7.8, 10.8);
    const mGlassMesh = new THREE.Mesh(mGlassGeo, glassMat);
    mGlassMesh.position.y = 8.0;
    glassGroup.add(mGlassMesh);
    tierMeshMapRef.current.midrise.push(mGlassMesh);

    // Highrise Glass Envelope
    const hGlassGeo = new THREE.BoxGeometry(9.8, 6.8, 8.8);
    const hGlassMesh = new THREE.Mesh(hGlassGeo, glassMat);
    hGlassMesh.position.y = 15.6;
    glassGroup.add(hGlassMesh);
    tierMeshMapRef.current.skyvillas.push(hGlassMesh);

    // 7. Subtle Ambient Floating Particles
    const particleCount = isMobile ? 50 : 100;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 35;
      particlePositions[i + 1] = Math.random() * 28;
      particlePositions[i + 2] = (Math.random() - 0.5) * 35;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xd4af37,
      size: 0.15,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 8. Animation & Render Loop (High Performance with pre-allocated vectors)
    let animationFrameId: number;
    let clock = new THREE.Clock();
    const tempCamTarget = new THREE.Vector3();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smoothly interpolate scroll progress for silky fluid animation
      currentScrollProg.current += (targetScrollProg.current - currentScrollProg.current) * 0.08;
      const p = currentScrollProg.current;

      // Gentle floating particle motion
      particles.rotation.y = elapsedTime * 0.02;

      // Apply Dynamic Stage Transformations
      if (buildingGroupRef.current) {
        buildingGroupRef.current.rotation.y = p * Math.PI * 1.5;
      }

      // Foundation
      if (foundationGroupRef.current) {
        const fProg = Math.min(1, Math.max(0, p / 0.08));
        foundationGroupRef.current.scale.set(
          Math.max(0.01, fProg),
          Math.max(0.01, fProg),
          Math.max(0.01, fProg)
        );
        foundationGroupRef.current.visible = fProg > 0.01;
      }

      // Structural Core
      if (structuralCoreRef.current) {
        const sProg = Math.min(1, Math.max(0, (p - 0.05) / 0.11));
        structuralCoreRef.current.scale.set(1, Math.max(0.001, sProg), 1);
        structuralCoreRef.current.position.y = (sProg - 1) * 2;
        structuralCoreRef.current.visible = sProg > 0.01;
      }

      // Floors Assembly
      floorsGroupRef.current.forEach((floor, idx) => {
        const floorStart = 0.12 + (idx / floorsGroupRef.current.length) * 0.14;
        const fProg = Math.min(1, Math.max(0, (p - floorStart) / 0.035));
        floor.scale.set(Math.max(0.001, fProg), Math.max(0.001, fProg), Math.max(0.001, fProg));
        floor.position.x = (1 - fProg) * (idx % 2 === 0 ? 3 : -3);
        floor.visible = fProg > 0.01;
      });

      // Facade
      if (facadeGroupRef.current) {
        const fcProg = Math.min(1, Math.max(0, (p - 0.22) / 0.1));
        facadeGroupRef.current.scale.set(1, Math.max(0.001, fcProg), 1);
        facadeGroupRef.current.visible = fcProg > 0.01;
      }

      // Glass Envelope
      if (glassGroupRef.current) {
        const gProg = Math.min(1, Math.max(0, (p - 0.28) / 0.08));
        glassGroupRef.current.scale.set(
          Math.max(0.001, gProg),
          Math.max(0.001, gProg),
          Math.max(0.001, gProg)
        );
        glassGroupRef.current.visible = gProg > 0.01;
      }

      // Interior Lights
      const lightProg = Math.min(1, Math.max(0, (p - 0.34) / 0.08));
      interiorLightsRef.current.forEach((light) => {
        light.intensity = THREE.MathUtils.lerp(0, 1.8, lightProg);
      });

      // Smooth Camera Lerp
      const isMobileView =
        typeof window !== 'undefined' &&
        (window.innerWidth < 768 || 'ontouchstart' in window);
      const mouseParallaxX = isMobileView ? 0 : mousePos.current.x * 1.5;
      const mouseParallaxY = isMobileView ? 0 : mousePos.current.y * 1.0;

      tempCamTarget.set(
        targetCamPos.current.x + mouseParallaxX,
        targetCamPos.current.y + mouseParallaxY,
        targetCamPos.current.z
      );
      currentCamPos.current.lerp(tempCamTarget, 0.05);
      currentCamLook.current.lerp(targetCamLook.current, 0.05);

      camera.position.copy(currentCamPos.current);
      camera.lookAt(currentCamLook.current);

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const newW = containerRef.current.clientWidth;
      const newH = containerRef.current.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, [webglSupported]);

  // Update target camera coordinates based on scroll progress and active project tier
  useEffect(() => {
    const p = Math.max(0, Math.min(1, scrollProgress));
    const isMobileView = typeof window !== 'undefined' && window.innerWidth < 768;
    const distScale = isMobileView ? 1.25 : 1.0;

    if (p < 0.35) {
      const cNorm = p / 0.35;
      targetCamPos.current.set(
        16 * Math.cos(cNorm * Math.PI * 0.5) * distScale,
        THREE.MathUtils.lerp(5, 14, cNorm),
        (16 * Math.sin(cNorm * Math.PI * 0.5) + 12) * distScale
      );
      targetCamLook.current.set(0, THREE.MathUtils.lerp(2, 9, cNorm), 0);
    } else if (p < 0.72) {
      if (activeProjectTier === 'skyvillas') {
        targetCamPos.current.set(12 * distScale, 15, 13 * distScale);
        targetCamLook.current.set(0, 14, 0);
      } else if (activeProjectTier === 'midrise') {
        targetCamPos.current.set(13 * distScale, 11, 13 * distScale);
        targetCamLook.current.set(0, 9, 0);
      } else if (activeProjectTier === 'crown') {
        targetCamPos.current.set(11 * distScale, 19, 13 * distScale);
        targetCamLook.current.set(0, 17, 0);
      } else if (activeProjectTier === 'podium') {
        targetCamPos.current.set(13 * distScale, 6, 14 * distScale);
        targetCamLook.current.set(0, 4, 0);
      } else {
        targetCamPos.current.set(15 * distScale, 12, 16 * distScale);
        targetCamLook.current.set(0, 9, 0);
      }
    } else {
      // Services / Overview section: steady, elegant perspective
      targetCamPos.current.set(17 * distScale, 13, 19 * distScale);
      targetCamLook.current.set(0, 9, 0);
    }
  }, [scrollProgress, activeProjectTier]);

  // Highlight Active Project Tier
  useEffect(() => {
    if (!tierMeshMapRef.current) return;

    const tiers = ['foundation', 'podium', 'midrise', 'skyvillas', 'crown'];
    tiers.forEach((t) => {
      const meshes = tierMeshMapRef.current[t] || [];
      const isActive = activeProjectTier === t;

      meshes.forEach((mesh) => {
        if (mesh.material && 'emissive' in mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          if (isActive) {
            mat.emissive = new THREE.Color(0xd4af37);
            mat.emissiveIntensity = 0.35;
          } else {
            mat.emissive = new THREE.Color(0x000000);
            mat.emissiveIntensity = 0;
          }
        }
      });
    });

    if (spotLightRef.current) {
      if (activeProjectTier === 'skyvillas') {
        spotLightRef.current.target.position.set(0, 15, 0);
        spotLightRef.current.intensity = 2.8;
      } else if (activeProjectTier === 'midrise') {
        spotLightRef.current.target.position.set(0, 9, 0);
        spotLightRef.current.intensity = 2.8;
      } else if (activeProjectTier === 'crown') {
        spotLightRef.current.target.position.set(0, 18, 0);
        spotLightRef.current.intensity = 2.8;
      } else if (activeProjectTier === 'podium') {
        spotLightRef.current.target.position.set(0, 4, 0);
        spotLightRef.current.intensity = 2.8;
      } else {
        spotLightRef.current.target.position.set(0, 10, 0);
        spotLightRef.current.intensity = 2.0;
      }
    }
  }, [activeProjectTier]);

  if (!webglSupported) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#121212] text-[#D4AF37] p-8 text-center border border-[#D4AF37]/20 rounded-2xl">
        <div className="w-20 h-20 border border-[#D4AF37]/40 rounded-full flex items-center justify-center mb-4 bg-[#D4AF37]/5">
          <svg
            className="w-10 h-10 text-[#D4AF37]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M3 21h18M5 21V7l8-4v18M13 3l6 4v14M9 9v.01M9 13v.01M9 17v.01M17 9v.01M17 13v.01M17 17v.01" />
          </svg>
        </div>
        <h3 className="font-heading text-xl text-[#F7F5F0] tracking-wider mb-2 uppercase">
          Architectural Blueprint Render
        </h3>
        <p className="text-sm text-[#9E978E] max-w-md font-light leading-relaxed">
          High-performance architectural visualization mode active.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div
        ref={containerRef}
        className="w-full h-full touch-none select-none cursor-grab active:cursor-grabbing"
      />

      {/* Subtle Architectural Lens Flare / Vignette Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-radial from-transparent via-transparent to-[#121212]/80" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#121212] to-transparent" />
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#121212]/90 to-transparent" />
    </div>
  );
};
