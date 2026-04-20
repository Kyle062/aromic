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
  homeOutline,
  eyeOutline,
  cubeOutline,
} from 'ionicons/icons';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface Room {
  name: string;
  type: string;
  width: number;
  depth: number;
  wallColor: string;
  floorColor: string;
  position: { x: number; y: number; z: number };
  floor: number;
}

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
  private frontWallGroup!: THREE.Group;
  private secondFloorGroup!: THREE.Group;

  // View states
  isGenerating: boolean = false;
  isInteriorView: boolean = true;
  showFrontWall: boolean = false;
  showSecondFloor: boolean = true;
  currentFloor: number = 1;

  // Room definitions
  private rooms: Room[] = [];

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
      homeOutline,
      eyeOutline,
      cubeOutline,
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['houseData']) {
        this.houseData = JSON.parse(params['houseData']);
        console.log('House data received:', this.houseData);
      }
    });

    this.initializeRooms();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initThreeJS();
      this.createMansion();
      this.startAnimation();
    }, 100);
  }

  ngOnDestroy() {
    this.stopAnimation();
    this.cleanupThreeJS();
  }

  private initializeRooms() {
    // First Floor Rooms
    const firstFloorRooms: Room[] = [
      {
        name: 'Living Room',
        type: 'living',
        width: 6,
        depth: 6,
        wallColor: '#f5e6d3',
        floorColor: '#d4a574',
        position: { x: -4, y: 0.01, z: -3 },
        floor: 1,
      },
      {
        name: 'Kitchen',
        type: 'kitchen',
        width: 5,
        depth: 5,
        wallColor: '#e8ddd0',
        floorColor: '#c4a882',
        position: { x: 4, y: 0.01, z: -3 },
        floor: 1,
      },
      {
        name: 'Dining Room',
        type: 'dining',
        width: 5,
        depth: 5,
        wallColor: '#f0e0d0',
        floorColor: '#d4a574',
        position: { x: 0, y: 0.01, z: 3 },
        floor: 1,
      },
    ];

    // Second Floor Rooms
    const secondFloorRooms: Room[] = [
      {
        name: 'Master Bedroom',
        type: 'master',
        width: 6,
        depth: 6,
        wallColor: '#d4c4b0',
        floorColor: '#b8956a',
        position: { x: -4, y: 3.51, z: -3 },
        floor: 2,
      },
      {
        name: 'Bedroom',
        type: 'bedroom',
        width: 5,
        depth: 5,
        wallColor: '#c8d8e8',
        floorColor: '#a0b0c0',
        position: { x: 4, y: 3.51, z: -3 },
        floor: 2,
      },
      {
        name: 'Bathroom',
        type: 'bathroom',
        width: 4,
        depth: 4,
        wallColor: '#d0e0e8',
        floorColor: '#b0c0d0',
        position: { x: 0, y: 3.51, z: 3 },
        floor: 2,
      },
    ];

    this.rooms = [...firstFloorRooms, ...secondFloorRooms];
  }

  private initThreeJS() {
    const container = this.canvasContainer.nativeElement;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 400;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#87CEEB');

    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    this.camera.position.set(15, 8, 18);
    this.camera.lookAt(0, 3, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(width, height);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setPixelRatio(window.devicePixelRatio);

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.autoRotate = false;
    this.controls.autoRotateSpeed = 0.8;
    this.controls.enableZoom = true;
    this.controls.enablePan = true;
    this.controls.target.set(0, 3, 0);
    this.controls.maxPolarAngle = Math.PI / 1.8;
    this.controls.minDistance = 5;
    this.controls.maxDistance = 35;

    this.addLighting();
    this.addGround();

    window.addEventListener('resize', this.onWindowResize.bind(this));
    console.log('Three.js initialized successfully');
  }

  private addLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff5e6, 1.2);
    sunLight.position.set(10, 20, 5);
    sunLight.castShadow = true;
    sunLight.receiveShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 50;
    sunLight.shadow.camera.left = -25;
    sunLight.shadow.camera.right = 25;
    sunLight.shadow.camera.top = 25;
    sunLight.shadow.camera.bottom = -25;
    this.scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0xccddff, 0.5);
    fillLight.position.set(-10, 5, 10);
    this.scene.add(fillLight);

    // Interior lights for each floor
    const interiorLight1 = new THREE.PointLight(0xffeedd, 0.8);
    interiorLight1.position.set(-2, 2.5, 0);
    this.scene.add(interiorLight1);

    const interiorLight2 = new THREE.PointLight(0xffeedd, 0.8);
    interiorLight2.position.set(3, 5.5, 2);
    this.scene.add(interiorLight2);

    const interiorLight3 = new THREE.PointLight(0xffeedd, 0.6);
    interiorLight3.position.set(-3, 5.5, -2);
    this.scene.add(interiorLight3);
  }

  private addGround() {
    const groundGeometry = new THREE.CircleGeometry(50, 32);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: '#7cb342',
      roughness: 0.9,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    ground.receiveShadow = true;
    this.scene.add(ground);

    const gridHelper = new THREE.GridHelper(100, 40, '#555555', '#888888');
    gridHelper.position.y = 0;
    this.scene.add(gridHelper);

    // Add driveway
    const drivewayMaterial = new THREE.MeshStandardMaterial({
      color: '#888888',
      roughness: 0.8,
    });
    const driveway = new THREE.BoxGeometry(4, 0.05, 8);
    const drivewayMesh = new THREE.Mesh(driveway, drivewayMaterial);
    drivewayMesh.position.set(0, 0.02, 10);
    drivewayMesh.receiveShadow = true;
    this.scene.add(drivewayMesh);
  }

  private createMansion() {
    if (this.houseGroup) {
      this.scene.remove(this.houseGroup);
    }

    this.houseGroup = new THREE.Group();
    this.frontWallGroup = new THREE.Group();
    this.secondFloorGroup = new THREE.Group();

    // Create foundation
    this.createFoundation();

    // Create exterior walls
    this.createExteriorWalls();

    // Create floor separator (second floor base)
    this.createFloorSeparator();

    // Create first floor rooms
    this.createFirstFloorRooms();

    // Create second floor structure and rooms
    this.createSecondFloor();

    // Create exterior details
    this.createExteriorDetails();

    // Add mansion features (columns, balcony, etc.)
    this.addMansionFeatures();

    // Add surrounding elements
    this.addSurroundings();

    this.houseGroup.add(this.frontWallGroup);
    this.houseGroup.add(this.secondFloorGroup);
    this.scene.add(this.houseGroup);

    console.log('Mansion created with 2 floors');
  }

  private createFoundation() {
    const foundationMaterial = new THREE.MeshStandardMaterial({
      color: '#999999',
      roughness: 0.7,
    });

    const foundation = new THREE.BoxGeometry(16, 0.3, 14);
    const foundationMesh = new THREE.Mesh(foundation, foundationMaterial);
    foundationMesh.position.y = 0.15;
    foundationMesh.receiveShadow = true;
    foundationMesh.castShadow = true;
    this.houseGroup.add(foundationMesh);
  }

  private createExteriorWalls() {
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: '#e8d5c4',
      roughness: 0.5,
      side: THREE.DoubleSide,
    });

    const wallHeight = 7; // Total height for 2 floors

    // Back wall
    const backWall = new THREE.BoxGeometry(16, wallHeight, 0.25);
    const backWallMesh = new THREE.Mesh(backWall, wallMaterial);
    backWallMesh.position.set(0, wallHeight / 2, -7);
    backWallMesh.castShadow = true;
    backWallMesh.receiveShadow = true;
    this.houseGroup.add(backWallMesh);

    // Left wall
    const leftWall = new THREE.BoxGeometry(0.25, wallHeight, 14);
    const leftWallMesh = new THREE.Mesh(leftWall, wallMaterial);
    leftWallMesh.position.set(-8, wallHeight / 2, 0);
    leftWallMesh.castShadow = true;
    leftWallMesh.receiveShadow = true;
    this.houseGroup.add(leftWallMesh);

    // Right wall
    const rightWall = new THREE.BoxGeometry(0.25, wallHeight, 14);
    const rightWallMesh = new THREE.Mesh(rightWall, wallMaterial);
    rightWallMesh.position.set(8, wallHeight / 2, 0);
    rightWallMesh.castShadow = true;
    rightWallMesh.receiveShadow = true;
    this.houseGroup.add(rightWallMesh);

    // Front wall
    const frontWallMaterial = new THREE.MeshStandardMaterial({
      color: '#e8d5c4',
      roughness: 0.5,
      transparent: true,
      opacity: this.showFrontWall ? 1 : 0.15,
      side: THREE.DoubleSide,
    });

    const frontWall = new THREE.BoxGeometry(16, wallHeight, 0.25);
    const frontWallMesh = new THREE.Mesh(frontWall, frontWallMaterial);
    frontWallMesh.position.set(0, wallHeight / 2, 7);
    frontWallMesh.castShadow = true;
    frontWallMesh.receiveShadow = true;
    this.frontWallGroup.add(frontWallMesh);

    // Grand entrance
    this.createGrandEntrance();
  }

  private createFloorSeparator() {
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: '#a0846c',
      roughness: 0.6,
    });

    const separator = new THREE.BoxGeometry(16.2, 0.2, 14.2);
    const separatorMesh = new THREE.Mesh(separator, floorMaterial);
    separatorMesh.position.y = 3.5;
    separatorMesh.castShadow = true;
    separatorMesh.receiveShadow = true;
    this.houseGroup.add(separatorMesh);
  }

  private createGrandEntrance() {
    const frameMaterial = new THREE.MeshStandardMaterial({ color: '#8B7355' });

    // Double doors
    const doorMaterial = new THREE.MeshStandardMaterial({ color: '#5c3a21' });

    // Left door
    const leftDoor = new THREE.BoxGeometry(1, 2.5, 0.08);
    const leftDoorMesh = new THREE.Mesh(leftDoor, doorMaterial);
    leftDoorMesh.position.set(-0.6, 1.25, 7.1);
    leftDoorMesh.castShadow = true;
    this.frontWallGroup.add(leftDoorMesh);

    // Right door
    const rightDoor = new THREE.BoxGeometry(1, 2.5, 0.08);
    const rightDoorMesh = new THREE.Mesh(rightDoor, doorMaterial);
    rightDoorMesh.position.set(0.6, 1.25, 7.1);
    rightDoorMesh.castShadow = true;
    this.frontWallGroup.add(rightDoorMesh);

    // Door frame
    const frameTop = new THREE.BoxGeometry(2.4, 0.2, 0.15);
    const frameTopMesh = new THREE.Mesh(frameTop, frameMaterial);
    frameTopMesh.position.set(0, 2.5, 7.1);
    frameTopMesh.castShadow = true;
    this.frontWallGroup.add(frameTopMesh);

    // Door handles
    const handleMaterial = new THREE.MeshStandardMaterial({
      color: '#FFD700',
      metalness: 0.8,
    });
    const handleLeft = new THREE.SphereGeometry(0.06);
    const handleLeftMesh = new THREE.Mesh(handleLeft, handleMaterial);
    handleLeftMesh.position.set(-0.15, 1.3, 7.15);
    this.frontWallGroup.add(handleLeftMesh);

    const handleRight = new THREE.SphereGeometry(0.06);
    const handleRightMesh = new THREE.Mesh(handleRight, handleMaterial);
    handleRightMesh.position.set(1.05, 1.3, 7.15);
    this.frontWallGroup.add(handleRightMesh);
  }

  private createFirstFloorRooms() {
    const interiorWallMaterial = new THREE.MeshStandardMaterial({
      color: '#f0e6d8',
      roughness: 0.5,
      side: THREE.DoubleSide,
    });

    // Interior walls for first floor
    const walls = [
      { w: 0.15, h: 3.5, d: 7, x: 0, y: 1.75, z: 2 }, // Center vertical
      { w: 8, h: 3.5, d: 0, x: 0, y: 1.75, z: -1.5 }, // Horizontal divider
    ];

    walls.forEach((w) => {
      const wall = new THREE.BoxGeometry(w.w, w.h, w.d);
      const wallMesh = new THREE.Mesh(wall, interiorWallMaterial);
      wallMesh.position.set(w.x, w.y, w.z);
      wallMesh.castShadow = true;
      wallMesh.receiveShadow = true;
      this.houseGroup.add(wallMesh);
    });

    // Create first floor rooms
    this.rooms
      .filter((r) => r.floor === 1)
      .forEach((room) => {
        this.createRoomWithFurniture(room);
      });

    // Add stairs
    this.createStairs(1);
  }

  private createSecondFloor() {
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: '#e0d0c0',
      roughness: 0.5,
      side: THREE.DoubleSide,
    });

    // Second floor walls
    const wallHeight = 3.5;
    const wallPositions = [
      { w: 16, h: wallHeight, d: 0.2, x: 0, y: 5.25, z: -7 }, // Back
      { w: 0.2, h: wallHeight, d: 14, x: -8, y: 5.25, z: 0 }, // Left
      { w: 0.2, h: wallHeight, d: 14, x: 8, y: 5.25, z: 0 }, // Right
    ];

    wallPositions.forEach((w) => {
      const wall = new THREE.BoxGeometry(w.w, w.h, w.d);
      const wallMesh = new THREE.Mesh(wall, wallMaterial);
      wallMesh.position.set(w.x, w.y, w.z);
      wallMesh.castShadow = true;
      wallMesh.receiveShadow = true;
      this.secondFloorGroup.add(wallMesh);
    });

    // Front wall for second floor
    const frontWallMaterial = new THREE.MeshStandardMaterial({
      color: '#e0d0c0',
      roughness: 0.5,
      transparent: true,
      opacity: this.showFrontWall ? 1 : 0.15,
      side: THREE.DoubleSide,
    });

    const frontWall = new THREE.BoxGeometry(16, wallHeight, 0.2);
    const frontWallMesh = new THREE.Mesh(frontWall, frontWallMaterial);
    frontWallMesh.position.set(0, 5.25, 7);
    frontWallMesh.castShadow = true;
    frontWallMesh.receiveShadow = true;
    this.secondFloorGroup.add(frontWallMesh);

    // Interior walls for second floor
    const interiorWallMaterial = new THREE.MeshStandardMaterial({
      color: '#e8ddd0',
      roughness: 0.5,
      side: THREE.DoubleSide,
    });

    const interiorWalls = [
      { w: 0.14, h: 3.5, d: 7, x: 0, y: 5.25, z: -2 },
      { w: 8, h: 3.5, d: 0.15, x: 0, y: 5.25, z: -5.5 },
    ];

    interiorWalls.forEach((w) => {
      const wall = new THREE.BoxGeometry(w.w, w.h, w.d);
      const wallMesh = new THREE.Mesh(wall, interiorWallMaterial);
      wallMesh.position.set(w.x, w.y, w.z);
      wallMesh.castShadow = true;
      wallMesh.receiveShadow = true;
      this.secondFloorGroup.add(wallMesh);
    });

    // Create second floor rooms
    this.rooms
      .filter((r) => r.floor === 2)
      .forEach((room) => {
        this.createRoomWithFurniture(room);
      });

    // Add stairs continuation
    this.createStairs(2);
  }

  private createStairs(floor: number) {
    const stairMaterial = new THREE.MeshStandardMaterial({ color: '#8B6914' });
    const stepHeight = 0.2;
    const stepDepth = 0.4;
    const startY = floor === 1 ? 0 : 3.5;

    for (let i = 0; i < 8; i++) {
      const step = new THREE.BoxGeometry(1.5, stepHeight, stepDepth);
      const stepMesh = new THREE.Mesh(step, stairMaterial);
      stepMesh.position.set(
        -5,
        startY + i * stepHeight + stepHeight / 2,
        2 - i * stepDepth,
      );
      stepMesh.castShadow = true;
      stepMesh.receiveShadow = true;

      if (floor === 1) {
        this.houseGroup.add(stepMesh);
      } else {
        this.secondFloorGroup.add(stepMesh);
      }
    }
  }

  private createRoomWithFurniture(room: Room) {
    const { position, width, depth, type, floorColor, floor } = room;
    const roomGroup = new THREE.Group();
    roomGroup.position.set(position.x, position.y, position.z);

    // Floor
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: floorColor,
      roughness: 0.6,
    });
    const floorMesh = new THREE.BoxGeometry(width, 0.05, depth);
    const floorGeometry = new THREE.Mesh(floorMesh, floorMaterial);
    floorGeometry.position.y = 0;
    floorGeometry.receiveShadow = true;
    roomGroup.add(floorGeometry);

    // Add furniture based on room type
    switch (type) {
      case 'living':
        this.addLivingRoomFurniture(roomGroup, width, depth);
        break;
      case 'kitchen':
        this.addKitchenFurniture(roomGroup, width, depth);
        break;
      case 'dining':
        this.addDiningRoomFurniture(roomGroup, width, depth);
        break;
      case 'master':
        this.addMasterBedroomFurniture(roomGroup, width, depth);
        break;
      case 'bedroom':
        this.addBedroomFurniture(roomGroup, width, depth);
        break;
      case 'bathroom':
        this.addBathroomFurniture(roomGroup, width, depth);
        break;
    }

    if (floor === 1) {
      this.houseGroup.add(roomGroup);
    } else {
      this.secondFloorGroup.add(roomGroup);
    }
  }

  private addLivingRoomFurniture(
    group: THREE.Group,
    width: number,
    depth: number,
  ) {
    // Large luxury sofa
    const sofaMaterial = new THREE.MeshStandardMaterial({ color: '#8B4513' });
    const sofaBase = new THREE.BoxGeometry(2.5, 0.5, 1);
    const sofaBaseMesh = new THREE.Mesh(sofaBase, sofaMaterial);
    sofaBaseMesh.position.set(-0.5, 0.25, -0.5);
    sofaBaseMesh.castShadow = true;
    sofaBaseMesh.receiveShadow = true;
    group.add(sofaBaseMesh);

    const sofaBack = new THREE.BoxGeometry(2.5, 0.8, 0.2);
    const sofaBackMesh = new THREE.Mesh(sofaBack, sofaMaterial);
    sofaBackMesh.position.set(-0.5, 0.8, -1);
    sofaBackMesh.castShadow = true;
    sofaBackMesh.receiveShadow = true;
    group.add(sofaBackMesh);

    // Coffee table
    const tableMaterial = new THREE.MeshStandardMaterial({ color: '#D2691E' });
    const tableTop = new THREE.BoxGeometry(1.5, 0.05, 0.8);
    const tableTopMesh = new THREE.Mesh(tableTop, tableMaterial);
    tableTopMesh.position.set(-0.5, 0.45, 0.8);
    tableTopMesh.castShadow = true;
    tableTopMesh.receiveShadow = true;
    group.add(tableTopMesh);

    // TV and entertainment center
    const tvStand = new THREE.BoxGeometry(2, 0.6, 0.5);
    const tvStandMesh = new THREE.Mesh(
      tvStand,
      new THREE.MeshStandardMaterial({ color: '#4a3728' }),
    );
    tvStandMesh.position.set(0.8, 0.3, -1.5);
    tvStandMesh.castShadow = true;
    tvStandMesh.receiveShadow = true;
    group.add(tvStandMesh);

    const tv = new THREE.BoxGeometry(1.6, 1, 0.05);
    const tvMesh = new THREE.Mesh(
      tv,
      new THREE.MeshStandardMaterial({ color: '#111' }),
    );
    tvMesh.position.set(0.8, 1, -1.3);
    tvMesh.castShadow = true;
    group.add(tvMesh);

    // Chandelier (floating)
    const chandelierMaterial = new THREE.MeshStandardMaterial({
      color: '#FFD700',
      emissive: new THREE.Color(0x443322),
    });
    const chandelier = new THREE.SphereGeometry(0.3);
    const chandelierMesh = new THREE.Mesh(chandelier, chandelierMaterial);
    chandelierMesh.position.set(0, 3.2, 0);
    group.add(chandelierMesh);
  }

  private addKitchenFurniture(
    group: THREE.Group,
    width: number,
    depth: number,
  ) {
    const cabinetMaterial = new THREE.MeshStandardMaterial({
      color: '#d4c4a8',
    });
    const counterMaterial = new THREE.MeshStandardMaterial({ color: '#888' });

    // L-shaped counter
    const counter1 = new THREE.BoxGeometry(3, 0.9, 0.7);
    const counter1Mesh = new THREE.Mesh(counter1, cabinetMaterial);
    counter1Mesh.position.set(-0.5, 0.45, -1);
    counter1Mesh.castShadow = true;
    counter1Mesh.receiveShadow = true;
    group.add(counter1Mesh);

    const counter2 = new THREE.BoxGeometry(0.7, 0.9, 2.5);
    const counter2Mesh = new THREE.Mesh(counter2, cabinetMaterial);
    counter2Mesh.position.set(1.2, 0.45, 0.2);
    counter2Mesh.castShadow = true;
    counter2Mesh.receiveShadow = true;
    group.add(counter2Mesh);

    // Stove
    const stove = new THREE.BoxGeometry(1, 0.1, 0.6);
    const stoveMesh = new THREE.Mesh(
      stove,
      new THREE.MeshStandardMaterial({ color: '#333' }),
    );
    stoveMesh.position.set(-1, 0.95, -1);
    stoveMesh.castShadow = true;
    group.add(stoveMesh);

    // Island
    const islandBase = new THREE.BoxGeometry(1.5, 0.9, 1);
    const islandMesh = new THREE.Mesh(islandBase, cabinetMaterial);
    islandMesh.position.set(-1, 0.45, 1.2);
    islandMesh.castShadow = true;
    islandMesh.receiveShadow = true;
    group.add(islandMesh);

    const islandTop = new THREE.BoxGeometry(1.6, 0.05, 1.1);
    const islandTopMesh = new THREE.Mesh(islandTop, counterMaterial);
    islandTopMesh.position.set(-1, 0.92, 1.2);
    islandTopMesh.castShadow = true;
    islandTopMesh.receiveShadow = true;
    group.add(islandTopMesh);
  }

  private addDiningRoomFurniture(
    group: THREE.Group,
    width: number,
    depth: number,
  ) {
    const tableMaterial = new THREE.MeshStandardMaterial({ color: '#8B6914' });

    // Large dining table
    const tableTop = new THREE.BoxGeometry(2.5, 0.08, 1.2);
    const tableTopMesh = new THREE.Mesh(tableTop, tableMaterial);
    tableTopMesh.position.set(0, 0.8, 0);
    tableTopMesh.castShadow = true;
    tableTopMesh.receiveShadow = true;
    group.add(tableTopMesh);

    // Table legs
    const legPositions = [
      [-1, 0.4, -0.4],
      [1, 0.4, -0.4],
      [-1, 0.4, 0.4],
      [1, 0.4, 0.4],
    ];
    legPositions.forEach((pos) => {
      const leg = new THREE.BoxGeometry(0.15, 0.8, 0.15);
      const legMesh = new THREE.Mesh(leg, tableMaterial);
      legMesh.position.set(pos[0], pos[1], pos[2]);
      legMesh.castShadow = true;
      group.add(legMesh);
    });

    // 6 Chairs
    const chairMaterial = new THREE.MeshStandardMaterial({ color: '#6b3a2a' });
    const chairPositions = [
      [-1.5, 0.45, 0],
      [1.5, 0.45, 0],
      [-0.8, 0.45, -0.9],
      [0.8, 0.45, -0.9],
      [-0.8, 0.45, 0.9],
      [0.8, 0.45, 0.9],
    ];

    chairPositions.forEach((pos) => {
      const seat = new THREE.BoxGeometry(0.6, 0.1, 0.6);
      const seatMesh = new THREE.Mesh(seat, chairMaterial);
      seatMesh.position.set(pos[0], pos[1], pos[2]);
      seatMesh.castShadow = true;
      group.add(seatMesh);

      const back = new THREE.BoxGeometry(0.6, 0.6, 0.1);
      const backMesh = new THREE.Mesh(back, chairMaterial);
      backMesh.position.set(pos[0], pos[1] + 0.35, pos[2] + 0.3);
      backMesh.castShadow = true;
      group.add(backMesh);
    });
  }

  private addMasterBedroomFurniture(
    group: THREE.Group,
    width: number,
    depth: number,
  ) {
    // King size bed
    const bedMaterial = new THREE.MeshStandardMaterial({ color: '#4a3728' });
    const bedBase = new THREE.BoxGeometry(2.5, 0.4, 2.2);
    const bedBaseMesh = new THREE.Mesh(bedBase, bedMaterial);
    bedBaseMesh.position.set(-0.3, 0.2, 0);
    bedBaseMesh.castShadow = true;
    bedBaseMesh.receiveShadow = true;
    group.add(bedBaseMesh);

    const mattress = new THREE.BoxGeometry(2.3, 0.25, 2);
    const mattressMesh = new THREE.Mesh(
      mattress,
      new THREE.MeshStandardMaterial({ color: '#fff' }),
    );
    mattressMesh.position.set(-0.3, 0.5, 0);
    mattressMesh.castShadow = true;
    mattressMesh.receiveShadow = true;
    group.add(mattressMesh);

    // Headboard
    const headboard = new THREE.BoxGeometry(2.5, 1, 0.2);
    const headboardMesh = new THREE.Mesh(
      headboard,
      new THREE.MeshStandardMaterial({ color: '#8B6914' }),
    );
    headboardMesh.position.set(-0.3, 0.9, -1.1);
    headboardMesh.castShadow = true;
    group.add(headboardMesh);

    // Nightstands
    const nightstandPositions = [
      [-1.8, -0.8],
      [1.2, -0.8],
    ];
    nightstandPositions.forEach((pos) => {
      const nightstand = new THREE.BoxGeometry(0.5, 0.6, 0.5);
      const nightstandMesh = new THREE.Mesh(
        nightstand,
        new THREE.MeshStandardMaterial({ color: '#8B6914' }),
      );
      nightstandMesh.position.set(pos[0], 0.3, pos[1]);
      nightstandMesh.castShadow = true;
      nightstandMesh.receiveShadow = true;
      group.add(nightstandMesh);
    });

    // Walk-in closet hint
    const closet = new THREE.BoxGeometry(1.5, 2.5, 0.8);
    const closetMesh = new THREE.Mesh(
      closet,
      new THREE.MeshStandardMaterial({ color: '#d4c4a8' }),
    );
    closetMesh.position.set(1.5, 1.25, 1);
    closetMesh.castShadow = true;
    closetMesh.receiveShadow = true;
    group.add(closetMesh);
  }

  private addBedroomFurniture(
    group: THREE.Group,
    width: number,
    depth: number,
  ) {
    // Queen bed
    const bedMaterial = new THREE.MeshStandardMaterial({ color: '#5c4a3a' });
    const bedBase = new THREE.BoxGeometry(2, 0.35, 1.8);
    const bedBaseMesh = new THREE.Mesh(bedBase, bedMaterial);
    bedBaseMesh.position.set(-0.2, 0.175, 0);
    bedBaseMesh.castShadow = true;
    bedBaseMesh.receiveShadow = true;
    group.add(bedBaseMesh);

    const mattress = new THREE.BoxGeometry(1.8, 0.2, 1.6);
    const mattressMesh = new THREE.Mesh(
      mattress,
      new THREE.MeshStandardMaterial({ color: '#f5f5f5' }),
    );
    mattressMesh.position.set(-0.2, 0.45, 0);
    mattressMesh.castShadow = true;
    mattressMesh.receiveShadow = true;
    group.add(mattressMesh);

    // Desk
    const desk = new THREE.BoxGeometry(1.2, 0.05, 0.8);
    const deskMesh = new THREE.Mesh(
      desk,
      new THREE.MeshStandardMaterial({ color: '#8B6914' }),
    );
    deskMesh.position.set(1.2, 0.75, -0.5);
    deskMesh.castShadow = true;
    deskMesh.receiveShadow = true;
    group.add(deskMesh);

    // Desk legs
    const legPositions = [
      [0.8, 0.4, -0.8],
      [1.6, 0.4, -0.8],
      [0.8, 0.4, -0.2],
      [1.6, 0.4, -0.2],
    ];
    legPositions.forEach((pos) => {
      const leg = new THREE.BoxGeometry(0.1, 0.8, 0.1);
      const legMesh = new THREE.Mesh(
        leg,
        new THREE.MeshStandardMaterial({ color: '#8B6914' }),
      );
      legMesh.position.set(pos[0], pos[1], pos[2]);
      legMesh.castShadow = true;
      group.add(legMesh);
    });

    // Wardrobe
    const wardrobe = new THREE.BoxGeometry(1.2, 2.2, 0.7);
    const wardrobeMesh = new THREE.Mesh(
      wardrobe,
      new THREE.MeshStandardMaterial({ color: '#a0522d' }),
    );
    wardrobeMesh.position.set(-1.5, 1.1, 1);
    wardrobeMesh.castShadow = true;
    wardrobeMesh.receiveShadow = true;
    group.add(wardrobeMesh);
  }

  private addBathroomFurniture(
    group: THREE.Group,
    width: number,
    depth: number,
  ) {
    // Luxury bathtub
    const tubMaterial = new THREE.MeshStandardMaterial({ color: '#f0f0f0' });
    const tub = new THREE.BoxGeometry(1.8, 0.6, 1);
    const tubMesh = new THREE.Mesh(tub, tubMaterial);
    tubMesh.position.set(-0.3, 0.3, -0.3);
    tubMesh.castShadow = true;
    tubMesh.receiveShadow = true;
    group.add(tubMesh);

    // Toilet
    const toiletMaterial = new THREE.MeshStandardMaterial({ color: '#fff' });
    const toiletBase = new THREE.BoxGeometry(0.5, 0.4, 0.6);
    const toiletBaseMesh = new THREE.Mesh(toiletBase, toiletMaterial);
    toiletBaseMesh.position.set(1, 0.2, 0.8);
    toiletBaseMesh.castShadow = true;
    group.add(toiletBaseMesh);

    const toiletTank = new THREE.BoxGeometry(0.4, 0.7, 0.2);
    const toiletTankMesh = new THREE.Mesh(toiletTank, toiletMaterial);
    toiletTankMesh.position.set(1, 0.55, 1.1);
    toiletTankMesh.castShadow = true;
    group.add(toiletTankMesh);

    // Double sink vanity
    const vanity = new THREE.BoxGeometry(1.5, 0.8, 0.6);
    const vanityMesh = new THREE.Mesh(
      vanity,
      new THREE.MeshStandardMaterial({ color: '#8B6914' }),
    );
    vanityMesh.position.set(-0.8, 0.4, 1);
    vanityMesh.castShadow = true;
    vanityMesh.receiveShadow = true;
    group.add(vanityMesh);

    // Mirror
    const mirror = new THREE.BoxGeometry(1.3, 0.9, 0.05);
    const mirrorMesh = new THREE.Mesh(
      mirror,
      new THREE.MeshStandardMaterial({ color: '#c0d8f0', metalness: 0.4 }),
    );
    mirrorMesh.position.set(-0.8, 1.2, 0.7);
    mirrorMesh.castShadow = true;
    group.add(mirrorMesh);
  }

  private addMansionFeatures() {
    // Front columns
    const columnMaterial = new THREE.MeshStandardMaterial({ color: '#d4c4b0' });
    const columnPositions = [
      [-3, 3.5, 7.1],
      [3, 3.5, 7.1],
    ];

    columnPositions.forEach((pos) => {
      const column = new THREE.CylinderGeometry(0.3, 0.35, 7);
      const columnMesh = new THREE.Mesh(column, columnMaterial);
      columnMesh.position.set(pos[0], pos[1], pos[2]);
      columnMesh.castShadow = true;
      columnMesh.receiveShadow = true;
      this.houseGroup.add(columnMesh);
    });

    // Balcony on second floor
    const balconyMaterial = new THREE.MeshStandardMaterial({
      color: '#a0846c',
    });
    const balcony = new THREE.BoxGeometry(4, 0.1, 1.5);
    const balconyMesh = new THREE.Mesh(balcony, balconyMaterial);
    balconyMesh.position.set(0, 5, 7.5);
    balconyMesh.castShadow = true;
    balconyMesh.receiveShadow = true;
    this.secondFloorGroup.add(balconyMesh);

    // Balcony railing
    const railingMaterial = new THREE.MeshStandardMaterial({ color: '#333' });
    for (let i = -1.8; i <= 1.8; i += 0.9) {
      const railingPost = new THREE.BoxGeometry(0.1, 0.8, 0.1);
      const postMesh = new THREE.Mesh(railingPost, railingMaterial);
      postMesh.position.set(i, 5.4, 8.2);
      postMesh.castShadow = true;
      this.secondFloorGroup.add(postMesh);
    }

    // Chimney
    const chimneyMaterial = new THREE.MeshStandardMaterial({
      color: '#8b5e3c',
    });
    const chimney = new THREE.BoxGeometry(1, 3, 1);
    const chimneyMesh = new THREE.Mesh(chimney, chimneyMaterial);
    chimneyMesh.position.set(4, 5.5, -4);
    chimneyMesh.castShadow = true;
    chimneyMesh.receiveShadow = true;
    this.houseGroup.add(chimneyMesh);
  }

  private createExteriorDetails() {
    const windowMaterial = new THREE.MeshStandardMaterial({
      color: '#a8d8ea',
      transparent: true,
      opacity: 0.5,
    });
    const frameMaterial = new THREE.MeshStandardMaterial({ color: '#fff' });

    // First floor windows
    const windowPositions1 = [
      [-4, 2.2, 7.05],
      [4, 2.2, 7.05],
    ];
    windowPositions1.forEach((pos) => {
      const frame = new THREE.BoxGeometry(1.5, 1.8, 0.1);
      const frameMesh = new THREE.Mesh(frame, frameMaterial);
      frameMesh.position.set(pos[0], pos[1], pos[2]);
      frameMesh.castShadow = true;
      this.frontWallGroup.add(frameMesh);

      const glass = new THREE.BoxGeometry(1.3, 1.6, 0.05);
      const glassMesh = new THREE.Mesh(glass, windowMaterial);
      glassMesh.position.set(pos[0], pos[1], pos[2] + 0.03);
      glassMesh.castShadow = true;
      this.frontWallGroup.add(glassMesh);
    });

    // Second floor windows
    const windowPositions2 = [
      [-4, 5.7, 7.05],
      [4, 5.7, 7.05],
    ];
    windowPositions2.forEach((pos) => {
      const frame = new THREE.BoxGeometry(1.5, 1.5, 0.1);
      const frameMesh = new THREE.Mesh(frame, frameMaterial);
      frameMesh.position.set(pos[0], pos[1], pos[2]);
      frameMesh.castShadow = true;
      this.secondFloorGroup.add(frameMesh);

      const glass = new THREE.BoxGeometry(1.3, 1.3, 0.05);
      const glassMesh = new THREE.Mesh(glass, windowMaterial);
      glassMesh.position.set(pos[0], pos[1], pos[2] + 0.03);
      glassMesh.castShadow = true;
      this.secondFloorGroup.add(glassMesh);
    });
  }

  private addSurroundings() {
    // Trees
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: '#8B7355' });
    const leafMaterial = new THREE.MeshStandardMaterial({ color: '#2d5a27' });

    const treePositions = [
      [-12, -8],
      [13, -5],
      [-11, 10],
      [14, 8],
      [-14, -10],
      [15, -9],
    ];
    treePositions.forEach((pos) => {
      const trunk = new THREE.CylinderGeometry(0.5, 0.6, 3);
      const trunkMesh = new THREE.Mesh(trunk, trunkMaterial);
      trunkMesh.position.set(pos[0], 1.5, pos[1]);
      trunkMesh.castShadow = true;
      trunkMesh.receiveShadow = true;
      this.houseGroup.add(trunkMesh);

      const leaves1 = new THREE.ConeGeometry(1.8, 2.5, 8);
      const leaves1Mesh = new THREE.Mesh(leaves1, leafMaterial);
      leaves1Mesh.position.set(pos[0], 3.5, pos[1]);
      leaves1Mesh.castShadow = true;
      leaves1Mesh.receiveShadow = true;
      this.houseGroup.add(leaves1Mesh);

      const leaves2 = new THREE.ConeGeometry(1.4, 2, 8);
      const leaves2Mesh = new THREE.Mesh(leaves2, leafMaterial);
      leaves2Mesh.position.set(pos[0], 5.5, pos[1]);
      leaves2Mesh.castShadow = true;
      leaves2Mesh.receiveShadow = true;
      this.houseGroup.add(leaves2Mesh);
    });

    // Garden bushes
    const bushMaterial = new THREE.MeshStandardMaterial({ color: '#3a7a3a' });
    const bushPositions = [
      [-6, 8],
      [6, 8],
      [-7, -6],
      [7, -6],
    ];
    bushPositions.forEach((pos) => {
      const bush = new THREE.SphereGeometry(0.8);
      const bushMesh = new THREE.Mesh(bush, bushMaterial);
      bushMesh.position.set(pos[0], 0.8, pos[1]);
      bushMesh.castShadow = true;
      bushMesh.receiveShadow = true;
      this.houseGroup.add(bushMesh);
    });
  }

  private startAnimation() {
    const animate = () => {
      this.animationId = requestAnimationFrame(animate);
      if (this.controls) this.controls.update();
      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
    };
    animate();
  }

  private stopAnimation() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
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
    setTimeout(() => {
      this.isGenerating = false;
      this.createMansion();
    }, 1500);
  }

  retryGeneration() {
    this.createMansion();
  }

  toggleAutoRotate() {
    if (this.controls) {
      this.controls.autoRotate = !this.controls.autoRotate;
    }
  }

  resetView() {
    if (this.camera && this.controls) {
      this.camera.position.set(15, 8, 18);
      this.controls.target.set(0, 3, 0);
      this.controls.update();
    }
  }

  toggleInteriorView() {
    this.isInteriorView = !this.isInteriorView;
    this.showFrontWall = !this.isInteriorView;

    if (this.isInteriorView) {
      this.camera.position.set(0, 2.5, 5);
      this.controls.target.set(0, 2, 0);
    } else {
      this.camera.position.set(15, 8, 18);
      this.controls.target.set(0, 3, 0);
    }
    this.controls.update();
    this.createMansion();
  }

  toggleFrontWall() {
    this.showFrontWall = !this.showFrontWall;
    this.createMansion();
  }

  toggleFloor() {
    this.currentFloor = this.currentFloor === 1 ? 2 : 1;
    const targetY = this.currentFloor === 1 ? 2 : 5.5;
    this.controls.target.set(0, targetY, 0);
    this.camera.position.set(
      this.currentFloor === 1 ? 15 : 15,
      this.currentFloor === 1 ? 5 : 9,
      this.currentFloor === 1 ? 18 : 18,
    );
    this.controls.update();
  }
}
