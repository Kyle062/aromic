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
  position: { x: number; z: number };
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
  private roofGroup!: THREE.Group;
  private frontWallGroup!: THREE.Group;

  // View states
  isAutoGenerate: boolean = true;
  isGenerating: boolean = false;
  isInteriorView: boolean = false;
  showRoof: boolean = true;
  showFrontWall: boolean = true;

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

    // Initialize rooms based on data or defaults
    this.initializeRooms();
  }

  ngAfterViewInit() {
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

  private initializeRooms() {
    const roomList = this.houseData?.rooms || [
      { name: 'Living Room', type: 'living' },
      { name: 'Kitchen', type: 'kitchen' },
      { name: 'Bedroom', type: 'bedroom' },
      { name: 'Bathroom', type: 'bathroom' },
      { name: 'Dining Room', type: 'dining' },
    ];

    // Define room layouts
    const roomLayouts: Room[] = [
      {
        name: 'Living Room',
        type: 'living',
        width: 5,
        depth: 5,
        wallColor: '#f5e6d3',
        floorColor: '#d4a574',
        position: { x: -4, z: -2 },
      },
      {
        name: 'Kitchen',
        type: 'kitchen',
        width: 4,
        depth: 4,
        wallColor: '#e8ddd0',
        floorColor: '#c4a882',
        position: { x: 3, z: -2 },
      },
      {
        name: 'Bedroom',
        type: 'bedroom',
        width: 4,
        depth: 5,
        wallColor: '#d4c4b0',
        floorColor: '#b8956a',
        position: { x: -3, z: 3 },
      },
      {
        name: 'Bathroom',
        type: 'bathroom',
        width: 3,
        depth: 3,
        wallColor: '#c8d8e8',
        floorColor: '#a0b0c0',
        position: { x: 4, z: 3 },
      },
      {
        name: 'Dining Room',
        type: 'dining',
        width: 4,
        depth: 4,
        wallColor: '#f0e0d0',
        floorColor: '#d4a574',
        position: { x: -1, z: -3 },
      },
    ];

    this.rooms = roomLayouts.slice(0, roomList.length);
  }

  private initThreeJS() {
    const container = this.canvasContainer.nativeElement;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 400;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#87CEEB'); // Sky blue

    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    this.camera.position.set(12, 8, 15);
    this.camera.lookAt(0, 2, 0);

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
    this.controls.target.set(0, 2, 0);
    this.controls.maxPolarAngle = Math.PI / 1.8;
    this.controls.minDistance = 3;
    this.controls.maxDistance = 30;

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
    sunLight.shadow.camera.left = -20;
    sunLight.shadow.camera.right = 20;
    sunLight.shadow.camera.top = 20;
    sunLight.shadow.camera.bottom = -20;
    this.scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0xccddff, 0.5);
    fillLight.position.set(-10, 5, 10);
    this.scene.add(fillLight);

    // Interior lights
    const interiorLight1 = new THREE.PointLight(0xffeedd, 0.8);
    interiorLight1.position.set(-2, 3, 0);
    this.scene.add(interiorLight1);

    const interiorLight2 = new THREE.PointLight(0xffeedd, 0.6);
    interiorLight2.position.set(3, 3, 2);
    this.scene.add(interiorLight2);
  }

  private addGround() {
    const groundGeometry = new THREE.CircleGeometry(40, 32);
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

    const gridHelper = new THREE.GridHelper(80, 40, '#555555', '#888888');
    gridHelper.position.y = 0;
    this.scene.add(gridHelper);
  }

  private createHouse() {
    if (this.houseGroup) {
      this.scene.remove(this.houseGroup);
    }

    this.houseGroup = new THREE.Group();
    this.roofGroup = new THREE.Group();
    this.frontWallGroup = new THREE.Group();

    // Create foundation
    this.createFoundation();

    // Create exterior walls
    this.createExteriorWalls();

    // Create interior rooms
    this.createInteriorRooms();

    // Create roof
    this.createRoof();

    // Create exterior details
    this.createExteriorDetails();

    // Add surrounding elements
    this.addSurroundings();

    this.houseGroup.add(this.roofGroup);
    this.houseGroup.add(this.frontWallGroup);
    this.scene.add(this.houseGroup);

    console.log('House created with interior rooms');
  }

  private createFoundation() {
    const foundationMaterial = new THREE.MeshStandardMaterial({
      color: '#888888',
      roughness: 0.8,
    });

    const foundation = new THREE.BoxGeometry(14, 0.2, 12);
    const foundationMesh = new THREE.Mesh(foundation, foundationMaterial);
    foundationMesh.position.y = 0.1;
    foundationMesh.receiveShadow = true;
    foundationMesh.castShadow = true;
    this.houseGroup.add(foundationMesh);
  }

  private createExteriorWalls() {
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: '#e8d5c4',
      roughness: 0.6,
      side: THREE.DoubleSide,
    });

    const wallHeight = 3.5;

    // Back wall
    const backWall = new THREE.BoxGeometry(14, wallHeight, 0.2);
    const backWallMesh = new THREE.Mesh(backWall, wallMaterial);
    backWallMesh.position.set(0, wallHeight / 2, -6);
    backWallMesh.castShadow = true;
    backWallMesh.receiveShadow = true;
    this.houseGroup.add(backWallMesh);

    // Left wall
    const leftWall = new THREE.BoxGeometry(0.2, wallHeight, 12);
    const leftWallMesh = new THREE.Mesh(leftWall, wallMaterial);
    leftWallMesh.position.set(-7, wallHeight / 2, 0);
    leftWallMesh.castShadow = true;
    leftWallMesh.receiveShadow = true;
    this.houseGroup.add(leftWallMesh);

    // Right wall
    const rightWall = new THREE.BoxGeometry(0.2, wallHeight, 12);
    const rightWallMesh = new THREE.Mesh(rightWall, wallMaterial);
    rightWallMesh.position.set(7, wallHeight / 2, 0);
    rightWallMesh.castShadow = true;
    rightWallMesh.receiveShadow = true;
    this.houseGroup.add(rightWallMesh);

    // Front wall (separate group for toggling)
    const frontWallMaterial = new THREE.MeshStandardMaterial({
      color: '#e8d5c4',
      roughness: 0.6,
      transparent: true,
      opacity: this.showFrontWall ? 1 : 0.15,
      side: THREE.DoubleSide,
    });

    const frontWall = new THREE.BoxGeometry(14, wallHeight, 0.2);
    const frontWallMesh = new THREE.Mesh(frontWall, frontWallMaterial);
    frontWallMesh.position.set(0, wallHeight / 2, 6);
    frontWallMesh.castShadow = true;
    frontWallMesh.receiveShadow = true;
    this.frontWallGroup.add(frontWallMesh);

    // Door opening
    this.createDoorOpening();
  }

  private createDoorOpening() {
    const doorFrameMaterial = new THREE.MeshStandardMaterial({
      color: '#5c3a21',
    });

    // Door frame
    const frameLeft = new THREE.BoxGeometry(0.15, 2.4, 0.15);
    const frameLeftMesh = new THREE.Mesh(frameLeft, doorFrameMaterial);
    frameLeftMesh.position.set(-0.9, 1.2, 6.05);
    frameLeftMesh.castShadow = true;
    this.frontWallGroup.add(frameLeftMesh);

    const frameRight = new THREE.BoxGeometry(0.15, 2.4, 0.15);
    const frameRightMesh = new THREE.Mesh(frameRight, doorFrameMaterial);
    frameRightMesh.position.set(0.9, 1.2, 6.05);
    frameRightMesh.castShadow = true;
    this.frontWallGroup.add(frameRightMesh);

    const frameTop = new THREE.BoxGeometry(1.8, 0.15, 0.15);
    const frameTopMesh = new THREE.Mesh(frameTop, doorFrameMaterial);
    frameTopMesh.position.set(0, 2.4, 6.05);
    frameTopMesh.castShadow = true;
    this.frontWallGroup.add(frameTopMesh);

    // Door
    const doorMaterial = new THREE.MeshStandardMaterial({ color: '#8B4513' });
    const door = new THREE.BoxGeometry(1.5, 2.2, 0.05);
    const doorMesh = new THREE.Mesh(door, doorMaterial);
    doorMesh.position.set(0, 1.1, 6.05);
    doorMesh.castShadow = true;
    this.frontWallGroup.add(doorMesh);

    // Door handle
    const handleMaterial = new THREE.MeshStandardMaterial({
      color: '#FFD700',
      metalness: 0.8,
    });
    const handle = new THREE.SphereGeometry(0.05);
    const handleMesh = new THREE.Mesh(handle, handleMaterial);
    handleMesh.position.set(0.5, 1.1, 6.1);
    handleMesh.castShadow = true;
    this.frontWallGroup.add(handleMesh);
  }

  private createInteriorRooms() {
    const interiorWallMaterial = new THREE.MeshStandardMaterial({
      color: '#f0e6d8',
      roughness: 0.5,
      side: THREE.DoubleSide,
    });

    const wallHeight = 3.5;

    // Interior walls
    const walls = [
      { w: 0.15, h: wallHeight, d: 6, x: 0, y: wallHeight / 2, z: -3 }, // Center vertical
      { w: 8, h: wallHeight, d: 0.15, x: -3, y: wallHeight / 2, z: 0 }, // Horizontal divider
    ];

    walls.forEach((w) => {
      const wall = new THREE.BoxGeometry(w.w, w.h, w.d);
      const wallMesh = new THREE.Mesh(wall, interiorWallMaterial);
      wallMesh.position.set(w.x, w.y, w.z);
      wallMesh.castShadow = true;
      wallMesh.receiveShadow = true;
      this.houseGroup.add(wallMesh);
    });

    // Create each room with furniture
    this.rooms.forEach((room, index) => {
      this.createRoomWithFurniture(room);
    });
  }

  private createRoomWithFurniture(room: Room) {
    const { position, width, depth, type, floorColor } = room;
    const roomGroup = new THREE.Group();
    roomGroup.position.set(position.x, 0.01, position.z);

    // Floor
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: floorColor,
      roughness: 0.7,
    });
    const floor = new THREE.BoxGeometry(width, 0.05, depth);
    const floorMesh = new THREE.Mesh(floor, floorMaterial);
    floorMesh.position.y = 0;
    floorMesh.receiveShadow = true;
    roomGroup.add(floorMesh);

    // Add furniture based on room type
    switch (type) {
      case 'living':
        this.addLivingRoomFurniture(roomGroup, width, depth);
        break;
      case 'kitchen':
        this.addKitchenFurniture(roomGroup, width, depth);
        break;
      case 'bedroom':
        this.addBedroomFurniture(roomGroup, width, depth);
        break;
      case 'bathroom':
        this.addBathroomFurniture(roomGroup, width, depth);
        break;
      case 'dining':
        this.addDiningRoomFurniture(roomGroup, width, depth);
        break;
    }

    this.houseGroup.add(roomGroup);
  }

  private addLivingRoomFurniture(
    group: THREE.Group,
    width: number,
    depth: number,
  ) {
    // Sofa
    const sofaMaterial = new THREE.MeshStandardMaterial({ color: '#6b4c3a' });
    const sofaBase = new THREE.BoxGeometry(2, 0.5, 0.8);
    const sofaBaseMesh = new THREE.Mesh(sofaBase, sofaMaterial);
    sofaBaseMesh.position.set(-0.5, 0.25, -0.5);
    sofaBaseMesh.castShadow = true;
    sofaBaseMesh.receiveShadow = true;
    group.add(sofaBaseMesh);

    const sofaBack = new THREE.BoxGeometry(2, 0.6, 0.2);
    const sofaBackMesh = new THREE.Mesh(sofaBack, sofaMaterial);
    sofaBackMesh.position.set(-0.5, 0.7, -0.9);
    sofaBackMesh.castShadow = true;
    sofaBackMesh.receiveShadow = true;
    group.add(sofaBackMesh);

    const armMaterial = new THREE.MeshStandardMaterial({ color: '#5a3d2b' });
    const armLeft = new THREE.BoxGeometry(0.2, 0.5, 0.8);
    const armLeftMesh = new THREE.Mesh(armLeft, armMaterial);
    armLeftMesh.position.set(-1.4, 0.35, -0.5);
    armLeftMesh.castShadow = true;
    group.add(armLeftMesh);

    const armRight = new THREE.BoxGeometry(0.2, 0.5, 0.8);
    const armRightMesh = new THREE.Mesh(armRight, armMaterial);
    armRightMesh.position.set(0.4, 0.35, -0.5);
    armRightMesh.castShadow = true;
    group.add(armRightMesh);

    // Coffee table
    const tableMaterial = new THREE.MeshStandardMaterial({ color: '#8B6914' });
    const tableTop = new THREE.BoxGeometry(1.2, 0.05, 0.6);
    const tableTopMesh = new THREE.Mesh(tableTop, tableMaterial);
    tableTopMesh.position.set(-0.5, 0.4, 0.5);
    tableTopMesh.castShadow = true;
    tableTopMesh.receiveShadow = true;
    group.add(tableTopMesh);

    const tableLegs = [
      [-1, 0.2, 0.3],
      [0, 0.2, 0.3],
      [-1, 0.2, 0.7],
      [0, 0.2, 0.7],
    ];
    tableLegs.forEach((pos) => {
      const leg = new THREE.BoxGeometry(0.1, 0.4, 0.1);
      const legMesh = new THREE.Mesh(leg, tableMaterial);
      legMesh.position.set(pos[0], pos[1], pos[2]);
      legMesh.castShadow = true;
      group.add(legMesh);
    });

    // TV
    const tvMaterial = new THREE.MeshStandardMaterial({ color: '#111111' });
    const tv = new THREE.BoxGeometry(1.2, 0.8, 0.05);
    const tvMesh = new THREE.Mesh(tv, tvMaterial);
    tvMesh.position.set(0.5, 0.9, -1.5);
    tvMesh.castShadow = true;
    group.add(tvMesh);

    const screenMaterial = new THREE.MeshStandardMaterial({
      color: '#1a1a2e',
      emissive: new THREE.Color(0x112233),
    });
    const screen = new THREE.BoxGeometry(1.1, 0.7, 0.02);
    const screenMesh = new THREE.Mesh(screen, screenMaterial);
    screenMesh.position.set(0.5, 0.9, -1.47);
    group.add(screenMesh);
  }

  private addKitchenFurniture(
    group: THREE.Group,
    width: number,
    depth: number,
  ) {
    const cabinetMaterial = new THREE.MeshStandardMaterial({
      color: '#d4c4a8',
    });
    const counterMaterial = new THREE.MeshStandardMaterial({
      color: '#888888',
    });

    // Counters
    const counter = new THREE.BoxGeometry(2.5, 0.9, 0.6);
    const counterMesh = new THREE.Mesh(counter, cabinetMaterial);
    counterMesh.position.set(-0.5, 0.45, -0.8);
    counterMesh.castShadow = true;
    counterMesh.receiveShadow = true;
    group.add(counterMesh);

    const counterTop = new THREE.BoxGeometry(2.6, 0.05, 0.7);
    const counterTopMesh = new THREE.Mesh(counterTop, counterMaterial);
    counterTopMesh.position.set(-0.5, 0.92, -0.8);
    counterTopMesh.castShadow = true;
    counterTopMesh.receiveShadow = true;
    group.add(counterTopMesh);

    // Stove
    const stoveMaterial = new THREE.MeshStandardMaterial({ color: '#333333' });
    const stove = new THREE.BoxGeometry(0.8, 0.1, 0.5);
    const stoveMesh = new THREE.Mesh(stove, stoveMaterial);
    stoveMesh.position.set(0.8, 0.95, -0.8);
    stoveMesh.castShadow = true;
    group.add(stoveMesh);

    // Fridge
    const fridgeMaterial = new THREE.MeshStandardMaterial({
      color: '#c0c0c0',
      metalness: 0.7,
    });
    const fridge = new THREE.BoxGeometry(0.8, 1.8, 0.7);
    const fridgeMesh = new THREE.Mesh(fridge, fridgeMaterial);
    fridgeMesh.position.set(1.2, 0.9, 0.5);
    fridgeMesh.castShadow = true;
    fridgeMesh.receiveShadow = true;
    group.add(fridgeMesh);
  }

  private addBedroomFurniture(
    group: THREE.Group,
    width: number,
    depth: number,
  ) {
    // Bed
    const bedMaterial = new THREE.MeshStandardMaterial({ color: '#4a6fa5' });
    const bedBase = new THREE.BoxGeometry(2, 0.3, 1.8);
    const bedBaseMesh = new THREE.Mesh(bedBase, bedMaterial);
    bedBaseMesh.position.set(-0.3, 0.15, 0);
    bedBaseMesh.castShadow = true;
    bedBaseMesh.receiveShadow = true;
    group.add(bedBaseMesh);

    const mattressMaterial = new THREE.MeshStandardMaterial({
      color: '#ffffff',
    });
    const mattress = new THREE.BoxGeometry(1.8, 0.2, 1.6);
    const mattressMesh = new THREE.Mesh(mattress, mattressMaterial);
    mattressMesh.position.set(-0.3, 0.4, 0);
    mattressMesh.castShadow = true;
    mattressMesh.receiveShadow = true;
    group.add(mattressMesh);

    const pillowMaterial = new THREE.MeshStandardMaterial({ color: '#e8e8e8' });
    const pillow = new THREE.BoxGeometry(0.5, 0.1, 0.4);
    const pillowMesh = new THREE.Mesh(pillow, pillowMaterial);
    pillowMesh.position.set(-1, 0.55, 0);
    pillowMesh.castShadow = true;
    group.add(pillowMesh);

    // Nightstand
    const nightstandMaterial = new THREE.MeshStandardMaterial({
      color: '#8B6914',
    });
    const nightstand = new THREE.BoxGeometry(0.5, 0.6, 0.5);
    const nightstandMesh = new THREE.Mesh(nightstand, nightstandMaterial);
    nightstandMesh.position.set(-1.5, 0.3, 0.8);
    nightstandMesh.castShadow = true;
    nightstandMesh.receiveShadow = true;
    group.add(nightstandMesh);

    // Wardrobe
    const wardrobeMaterial = new THREE.MeshStandardMaterial({
      color: '#a0522d',
    });
    const wardrobe = new THREE.BoxGeometry(1.2, 2, 0.6);
    const wardrobeMesh = new THREE.Mesh(wardrobe, wardrobeMaterial);
    wardrobeMesh.position.set(1.2, 1, -1);
    wardrobeMesh.castShadow = true;
    wardrobeMesh.receiveShadow = true;
    group.add(wardrobeMesh);
  }

  private addBathroomFurniture(
    group: THREE.Group,
    width: number,
    depth: number,
  ) {
    // Toilet
    const toiletMaterial = new THREE.MeshStandardMaterial({ color: '#f0f0f0' });
    const toiletBase = new THREE.BoxGeometry(0.5, 0.4, 0.6);
    const toiletBaseMesh = new THREE.Mesh(toiletBase, toiletMaterial);
    toiletBaseMesh.position.set(-0.5, 0.2, 0.5);
    toiletBaseMesh.castShadow = true;
    group.add(toiletBaseMesh);

    const toiletTank = new THREE.BoxGeometry(0.4, 0.6, 0.2);
    const toiletTankMesh = new THREE.Mesh(toiletTank, toiletMaterial);
    toiletTankMesh.position.set(-0.5, 0.5, 0.8);
    toiletTankMesh.castShadow = true;
    group.add(toiletTankMesh);

    // Sink
    const sinkMaterial = new THREE.MeshStandardMaterial({ color: '#e8e8e8' });
    const sink = new THREE.BoxGeometry(0.7, 0.1, 0.5);
    const sinkMesh = new THREE.Mesh(sink, sinkMaterial);
    sinkMesh.position.set(0.6, 0.8, 0.5);
    sinkMesh.castShadow = true;
    group.add(sinkMesh);

    const sinkBase = new THREE.BoxGeometry(0.6, 0.7, 0.4);
    const sinkBaseMesh = new THREE.Mesh(sinkBase, toiletMaterial);
    sinkBaseMesh.position.set(0.6, 0.35, 0.5);
    sinkBaseMesh.castShadow = true;
    group.add(sinkBaseMesh);

    // Mirror
    const mirrorMaterial = new THREE.MeshStandardMaterial({
      color: '#c0d8f0',
      metalness: 0.3,
    });
    const mirror = new THREE.BoxGeometry(0.5, 0.6, 0.05);
    const mirrorMesh = new THREE.Mesh(mirror, mirrorMaterial);
    mirrorMesh.position.set(0.6, 1, 0.1);
    mirrorMesh.castShadow = true;
    group.add(mirrorMesh);

    // Bathtub/Shower
    const tubMaterial = new THREE.MeshStandardMaterial({ color: '#d0e8f0' });
    const tub = new THREE.BoxGeometry(1.2, 0.5, 0.7);
    const tubMesh = new THREE.Mesh(tub, tubMaterial);
    tubMesh.position.set(-0.3, 0.25, -0.8);
    tubMesh.castShadow = true;
    tubMesh.receiveShadow = true;
    group.add(tubMesh);
  }

  private addDiningRoomFurniture(
    group: THREE.Group,
    width: number,
    depth: number,
  ) {
    // Table
    const tableMaterial = new THREE.MeshStandardMaterial({ color: '#8B6914' });
    const tableTop = new THREE.BoxGeometry(1.8, 0.05, 1);
    const tableTopMesh = new THREE.Mesh(tableTop, tableMaterial);
    tableTopMesh.position.set(0, 0.75, 0);
    tableTopMesh.castShadow = true;
    tableTopMesh.receiveShadow = true;
    group.add(tableTopMesh);

    const legPositions = [
      [-0.7, 0.4, -0.3],
      [0.7, 0.4, -0.3],
      [-0.7, 0.4, 0.3],
      [0.7, 0.4, 0.3],
    ];
    legPositions.forEach((pos) => {
      const leg = new THREE.BoxGeometry(0.1, 0.8, 0.1);
      const legMesh = new THREE.Mesh(leg, tableMaterial);
      legMesh.position.set(pos[0], pos[1], pos[2]);
      legMesh.castShadow = true;
      group.add(legMesh);
    });

    // Chairs
    const chairMaterial = new THREE.MeshStandardMaterial({ color: '#6b3a2a' });
    const chairPositions = [
      [-1, 0.4, 0],
      [1, 0.4, 0],
      [0, 0.4, -0.8],
      [0, 0.4, 0.8],
    ];
    chairPositions.forEach((pos) => {
      const chairSeat = new THREE.BoxGeometry(0.5, 0.1, 0.5);
      const chairSeatMesh = new THREE.Mesh(chairSeat, chairMaterial);
      chairSeatMesh.position.set(pos[0], pos[1], pos[2]);
      chairSeatMesh.castShadow = true;
      group.add(chairSeatMesh);

      const chairBack = new THREE.BoxGeometry(0.5, 0.5, 0.1);
      const chairBackMesh = new THREE.Mesh(chairBack, chairMaterial);
      chairBackMesh.position.set(pos[0], pos[1] + 0.3, pos[2] + 0.25);
      chairBackMesh.castShadow = true;
      group.add(chairBackMesh);
    });
  }

  private createRoof() {
    const roofMaterial = new THREE.MeshStandardMaterial({
      color: '#5c3a2a',
      roughness: 0.8,
      transparent: true,
      opacity: this.showRoof ? 1 : 0.15,
      side: THREE.DoubleSide,
    });

    // Main roof
    const roofGeometry = new THREE.ConeGeometry(10, 2.5, 4);
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 4.2;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    roof.receiveShadow = true;
    this.roofGroup.add(roof);

    // Roof overhang
    const overhangMaterial = new THREE.MeshStandardMaterial({
      color: '#4a2a1a',
    });
    const overhang = new THREE.BoxGeometry(15, 0.1, 13);
    const overhangMesh = new THREE.Mesh(overhang, overhangMaterial);
    overhangMesh.position.y = 3.5;
    overhangMesh.castShadow = true;
    overhangMesh.receiveShadow = true;
    this.roofGroup.add(overhangMesh);
  }

  private createExteriorDetails() {
    // Windows on front wall
    const windowMaterial = new THREE.MeshStandardMaterial({
      color: '#a8d8ea',
      transparent: true,
      opacity: 0.6,
    });
    const frameMaterial = new THREE.MeshStandardMaterial({ color: '#ffffff' });

    const windowPositions = [
      [-3, 2, 6.05],
      [3, 2, 6.05],
    ];
    windowPositions.forEach((pos) => {
      const frame = new THREE.BoxGeometry(1.2, 1.5, 0.1);
      const frameMesh = new THREE.Mesh(frame, frameMaterial);
      frameMesh.position.set(pos[0], pos[1], pos[2]);
      frameMesh.castShadow = true;
      this.frontWallGroup.add(frameMesh);

      const glass = new THREE.BoxGeometry(1, 1.3, 0.05);
      const glassMesh = new THREE.Mesh(glass, windowMaterial);
      glassMesh.position.set(pos[0], pos[1], pos[2] + 0.03);
      glassMesh.castShadow = true;
      this.frontWallGroup.add(glassMesh);
    });
  }

  private addSurroundings() {
    // Trees
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: '#8B7355' });
    const leafMaterial = new THREE.MeshStandardMaterial({ color: '#2d5a27' });

    const treePositions = [
      [-10, -8],
      [11, -5],
      [-9, 9],
      [12, 7],
    ];
    treePositions.forEach((pos) => {
      const trunk = new THREE.CylinderGeometry(0.4, 0.5, 2.5);
      const trunkMesh = new THREE.Mesh(trunk, trunkMaterial);
      trunkMesh.position.set(pos[0], 1.25, pos[1]);
      trunkMesh.castShadow = true;
      trunkMesh.receiveShadow = true;
      this.houseGroup.add(trunkMesh);

      const leaves1 = new THREE.ConeGeometry(1.5, 2, 8);
      const leaves1Mesh = new THREE.Mesh(leaves1, leafMaterial);
      leaves1Mesh.position.set(pos[0], 3, pos[1]);
      leaves1Mesh.castShadow = true;
      leaves1Mesh.receiveShadow = true;
      this.houseGroup.add(leaves1Mesh);

      const leaves2 = new THREE.ConeGeometry(1.2, 1.5, 8);
      const leaves2Mesh = new THREE.Mesh(leaves2, leafMaterial);
      leaves2Mesh.position.set(pos[0], 4.5, pos[1]);
      leaves2Mesh.castShadow = true;
      leaves2Mesh.receiveShadow = true;
      this.houseGroup.add(leaves2Mesh);
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
      this.createHouse();
    }, 1500);
  }

  retryGeneration() {
    this.createHouse();
  }

  toggleAutoRotate() {
    if (this.controls) {
      this.controls.autoRotate = !this.controls.autoRotate;
    }
  }

  resetView() {
    if (this.camera && this.controls) {
      this.camera.position.set(12, 8, 15);
      this.controls.target.set(0, 2, 0);
      this.controls.update();
    }
  }

  toggleInteriorView() {
    this.isInteriorView = !this.isInteriorView;
    this.showRoof = !this.isInteriorView;
    this.showFrontWall = !this.isInteriorView;

    if (this.isInteriorView) {
      this.camera.position.set(0, 2.5, 3);
      this.controls.target.set(0, 2, 0);
    } else {
      this.camera.position.set(12, 8, 15);
      this.controls.target.set(0, 2, 0);
    }
    this.controls.update();
    this.createHouse();
  }

  toggleRoof() {
    this.showRoof = !this.showRoof;
    this.createHouse();
  }

  toggleFrontWall() {
    this.showFrontWall = !this.showFrontWall;
    this.createHouse();
  }
}
