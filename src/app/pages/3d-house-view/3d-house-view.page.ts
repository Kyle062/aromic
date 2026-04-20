import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  arrowUndoOutline,
  refreshOutline,
  saveOutline,
  gridOutline,
} from 'ionicons/icons';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-three-d-house-view',
  templateUrl: './3d-house-view.page.html',
  styleUrls: ['./3d-house-view.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class ThreeDHouseViewPage implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('canvasContainer', { static: false })
  canvasContainer!: ElementRef<HTMLDivElement>;

  houseData: any = null;

  // Three.js variables
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private animationId!: number;
  private houseGroup!: THREE.Group;

  // View states
  isAutoGenerate: boolean = true;
  isGenerating: boolean = false;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
  ) {
    addIcons({
      arrowBackOutline,
      arrowUndoOutline,
      refreshOutline,
      saveOutline,
      gridOutline,
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['houseData']) {
        this.houseData = JSON.parse(params['houseData']);
        console.log('House data received:', this.houseData);
      }
    });
  }

  ngAfterViewInit() {
    // Add a small delay to ensure DOM is fully rendered
    setTimeout(() => {
      this.initThreeJS();
      this.createHouse();
      this.startAnimation();
    }, 100);
  }

  ngOnDestroy() {
    this.stopAnimation();
    this.cleanupThreeJS();
  }

  // Initialize Three.js scene
  private initThreeJS() {
    const container = this.canvasContainer.nativeElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    console.log('Container dimensions:', width, height); // Debug

    // If container has no dimensions, set default
    if (width === 0 || height === 0) {
      console.warn('Container has zero dimensions, using defaults');
      container.style.width = '100%';
      container.style.height = '400px';
    }

    const actualWidth = container.clientWidth || window.innerWidth;
    const actualHeight = container.clientHeight || 400;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#f5f0eb');

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      45,
      actualWidth / actualHeight,
      0.1,
      1000,
    );
    this.camera.position.set(15, 10, 20);
    this.camera.lookAt(0, 2, 0);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(actualWidth, actualHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // Clear any existing canvas
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    container.appendChild(this.renderer.domElement);
    console.log('Renderer created and appended'); // Debug

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 1.0;
    this.controls.enableZoom = true;
    this.controls.enablePan = true;
    this.controls.target.set(0, 2, 0);
    this.controls.maxPolarAngle = Math.PI / 2;

    // Lighting
    this.addLighting();

    // Grid and ground
    this.addGround();

    // Add axes helper for debugging (remove in production)
    // const axesHelper = new THREE.AxesHelper(10);
    // this.scene.add(axesHelper);

    // Handle window resize
    window.addEventListener('resize', this.onWindowResize.bind(this));

    console.log('Three.js initialized successfully'); // Debug
  }

  private addLighting() {
    // Ambient light - increased intensity
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    // Main directional light (sun)
    const sunLight = new THREE.DirectionalLight(0xfff5e6, 1.5);
    sunLight.position.set(10, 20, 5);
    sunLight.castShadow = true;
    sunLight.receiveShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 50;
    sunLight.shadow.camera.left = -15;
    sunLight.shadow.camera.right = 15;
    sunLight.shadow.camera.top = 15;
    sunLight.shadow.camera.bottom = -15;
    this.scene.add(sunLight);

    // Fill light - increased
    const fillLight = new THREE.DirectionalLight(0xccddff, 0.6);
    fillLight.position.set(-10, 5, 10);
    this.scene.add(fillLight);

    // Back light
    const backLight = new THREE.DirectionalLight(0xffeedd, 0.4);
    backLight.position.set(0, 5, -15);
    this.scene.add(backLight);

    // Additional point light for better illumination
    const pointLight = new THREE.PointLight(0xffaa88, 0.5);
    pointLight.position.set(5, 8, 5);
    this.scene.add(pointLight);
  }

  private addGround() {
    // Ground plane
    const groundGeometry = new THREE.CircleGeometry(30, 32);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: '#c4b5a0',
      roughness: 0.8,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Grid helper - more visible
    const gridHelper = new THREE.GridHelper(60, 20, '#8B7355', '#d4c4b0');
    gridHelper.position.y = 0;
    this.scene.add(gridHelper);
  }

  // Create house based on data
  private createHouse() {
    // Remove existing house if any
    if (this.houseGroup) {
      this.scene.remove(this.houseGroup);
    }

    this.houseGroup = new THREE.Group();

    const roomCount = this.houseData?.rooms?.length || 6;
    const floors = this.houseData?.floor || 2;

    console.log(
      'Creating house with',
      roomCount,
      'rooms and',
      floors,
      'floors',
    ); // Debug

    // Create main structure
    this.createWalls(roomCount, floors);
    this.createRoof(roomCount);
    this.createWindows(roomCount, floors);
    this.createDoor();
    this.createChimney();

    // Add some trees/bushes for context
    this.addTrees();

    this.scene.add(this.houseGroup);
    console.log('House created and added to scene'); // Debug
  }

  private createWalls(roomCount: number, floors: number) {
    const width = 8 + roomCount * 1.5;
    const depth = 10;
    const height = 3 * floors;

    // Main walls
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: '#e8d5c4',
      roughness: 0.6,
      metalness: 0.1,
      emissive: new THREE.Color(0x000000),
    });

    const walls = new THREE.BoxGeometry(width, height, depth);
    const wallsMesh = new THREE.Mesh(walls, wallMaterial);
    wallsMesh.position.y = height / 2;
    wallsMesh.castShadow = true;
    wallsMesh.receiveShadow = true;
    this.houseGroup.add(wallsMesh);

    // Floor separator (if multiple floors)
    if (floors > 1) {
      const floorMaterial = new THREE.MeshStandardMaterial({
        color: '#a0846c',
        roughness: 0.7,
      });
      const floorSeparator = new THREE.BoxGeometry(
        width + 0.2,
        0.15,
        depth + 0.2,
      );
      const separatorMesh = new THREE.Mesh(floorSeparator, floorMaterial);
      separatorMesh.position.y = 3;
      separatorMesh.castShadow = true;
      separatorMesh.receiveShadow = true;
      this.houseGroup.add(separatorMesh);
    }
  }

  private createRoof(width: number) {
    const roofMaterial = new THREE.MeshStandardMaterial({
      color: '#6b3a2a',
      roughness: 0.8,
      metalness: 0.1,
    });

    // Main roof
    const roofGeometry = new THREE.ConeGeometry(width * 0.9, 2.5, 4);
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 4.5;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    roof.receiveShadow = true;
    this.houseGroup.add(roof);
  }

  private createWindows(roomCount: number, floors: number) {
    const windowMaterial = new THREE.MeshStandardMaterial({
      color: '#a8d8ea',
      roughness: 0.2,
      metalness: 0.1,
      transparent: true,
      opacity: 0.8,
      emissive: new THREE.Color(0x112233),
    });

    const frameMaterial = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      roughness: 0.4,
    });

    const windowCount = Math.min(roomCount + 2, 7);
    const width = 8 + roomCount * 1.5;

    for (let i = 0; i < windowCount; i++) {
      // Front windows - first floor
      const windowFrame = new THREE.BoxGeometry(1.3, 1.6, 0.1);
      const frame = new THREE.Mesh(windowFrame, frameMaterial);
      frame.position.set(-width / 3 + i * 2.2, 1.8, 5);
      frame.castShadow = true;
      this.houseGroup.add(frame);

      const windowGlass = new THREE.BoxGeometry(1.1, 1.4, 0.05);
      const glass = new THREE.Mesh(windowGlass, windowMaterial);
      glass.position.set(-width / 3 + i * 2.2, 1.8, 5.1);
      glass.castShadow = true;
      this.houseGroup.add(glass);

      // Second floor windows if applicable
      if (floors > 1) {
        const frame2 = new THREE.Mesh(windowFrame, frameMaterial);
        frame2.position.set(-width / 3 + i * 2.2, 4.8, 5.05);
        frame2.castShadow = true;
        this.houseGroup.add(frame2);

        const glass2 = new THREE.Mesh(windowGlass, windowMaterial);
        glass2.position.set(-width / 3 + i * 2.2, 4.8, 5.1);
        glass2.castShadow = true;
        this.houseGroup.add(glass2);
      }
    }
  }

  private createDoor() {
    const doorMaterial = new THREE.MeshStandardMaterial({
      color: '#5c3a21',
      roughness: 0.7,
    });

    const door = new THREE.BoxGeometry(1.4, 2.4, 0.1);
    const doorMesh = new THREE.Mesh(door, doorMaterial);
    doorMesh.position.set(0, 1.2, 5.05);
    doorMesh.castShadow = true;
    doorMesh.receiveShadow = true;
    this.houseGroup.add(doorMesh);

    // Door handle
    const handleMaterial = new THREE.MeshStandardMaterial({
      color: '#d4a843',
      roughness: 0.3,
      metalness: 0.8,
      emissive: new THREE.Color(0x332211),
    });
    const handle = new THREE.SphereGeometry(0.06);
    const handleMesh = new THREE.Mesh(handle, handleMaterial);
    handleMesh.position.set(0.5, 1.2, 5.11);
    handleMesh.castShadow = true;
    this.houseGroup.add(handleMesh);
  }

  private createChimney() {
    const chimneyMaterial = new THREE.MeshStandardMaterial({
      color: '#8b5e3c',
      roughness: 0.9,
    });

    const chimney = new THREE.BoxGeometry(0.9, 3.5, 0.9);
    const chimneyMesh = new THREE.Mesh(chimney, chimneyMaterial);
    chimneyMesh.position.set(2.5, 5, -2.5);
    chimneyMesh.castShadow = true;
    chimneyMesh.receiveShadow = true;
    this.houseGroup.add(chimneyMesh);
  }

  private addTrees() {
    // Simple trees for context
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: '#8B7355' });
    const leafMaterial = new THREE.MeshStandardMaterial({ color: '#3a7a3a' });

    const treePositions = [
      { x: -8, z: 3 },
      { x: 9, z: -2 },
      { x: -7, z: -6 },
      { x: 10, z: 5 },
    ];

    treePositions.forEach((pos) => {
      // Trunk
      const trunk = new THREE.CylinderGeometry(0.4, 0.5, 2.5);
      const trunkMesh = new THREE.Mesh(trunk, trunkMaterial);
      trunkMesh.position.set(pos.x, 1.25, pos.z);
      trunkMesh.castShadow = true;
      trunkMesh.receiveShadow = true;
      this.houseGroup.add(trunkMesh);

      // Leaves
      const leaves1 = new THREE.ConeGeometry(1.2, 1.8, 8);
      const leaves1Mesh = new THREE.Mesh(leaves1, leafMaterial);
      leaves1Mesh.position.set(pos.x, 3, pos.z);
      leaves1Mesh.castShadow = true;
      leaves1Mesh.receiveShadow = true;
      this.houseGroup.add(leaves1Mesh);

      const leaves2 = new THREE.ConeGeometry(1.0, 1.5, 8);
      const leaves2Mesh = new THREE.Mesh(leaves2, leafMaterial);
      leaves2Mesh.position.set(pos.x, 4.3, pos.z);
      leaves2Mesh.castShadow = true;
      leaves2Mesh.receiveShadow = true;
      this.houseGroup.add(leaves2Mesh);
    });
  }

  // Animation loop
  private startAnimation() {
    const animate = () => {
      this.animationId = requestAnimationFrame(animate);

      if (this.controls) {
        this.controls.update();
      }

      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
    };

    animate();
  }

  private stopAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  private onWindowResize = () => {
    const container = this.canvasContainer.nativeElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    if (this.camera && this.renderer) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    }
  };

  private cleanupThreeJS() {
    if (this.renderer) {
      this.renderer.dispose();
      const container = this.canvasContainer.nativeElement;
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    }
  }

  // UI Actions
  goBack() {
    this.navCtrl.back();
  }

  goToHome() {
    this.navCtrl.navigateRoot('/room-list');
  }

  generateDesign() {
    this.isGenerating = true;
    this.controls.autoRotate = true;

    setTimeout(() => {
      this.isGenerating = false;
      this.createHouse(); // Regenerate house
    }, 1500);
  }

  retryGeneration() {
    this.controls.autoRotate = true;
    this.createHouse();
  }

  toggleAutoRotate() {
    if (this.controls) {
      this.controls.autoRotate = !this.controls.autoRotate;
    }
  }

  resetView() {
    if (this.camera && this.controls) {
      this.camera.position.set(15, 10, 20);
      this.controls.target.set(0, 2, 0);
      this.controls.update();
    }
  }
}
