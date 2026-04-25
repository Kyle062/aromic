import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonIcon,
  IonFab,
  IonFabButton,
  IonBackButton,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router'; // ✅ Import Router
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  createOutline,
  trashOutline,
  add,
  homeOutline,
  arrowBack,
  cubeOutline, // ✅ Add cube icon
} from 'ionicons/icons';

interface Room {
  id: number;
  name: string;
  dimensions: string;
  area: number;
  image: string;
  floor: number;
}

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.page.html',
  styleUrls: ['./room-list.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonIcon,
    IonBackButton,
    CommonModule,
    FormsModule,
  ],
})
export class RoomListPage implements OnInit {
  floor1Rooms: Room[] = [
    {
      id: 1,
      name: 'Living Room',
      dimensions: '6m x 8m',
      area: 48,
      image: '../../../assets/room-list/living-room.png',
      floor: 1,
    },
    {
      id: 2,
      name: 'Kitchen',
      dimensions: '4m x 5m',
      area: 20,
      image: '../../../assets/room-list/kitchen.png',
      floor: 1,
    },
    {
      id: 3,
      name: 'Dining Room',
      dimensions: '4m x 4m',
      area: 16,
      image: '../../../assets/room-list/Diningroom.png',
      floor: 1,
    },
  ];

  floor2Rooms: Room[] = [
    {
      id: 4,
      name: 'Bedroom 2',
      dimensions: '4m x 5m',
      area: 20,
      image: '../../../assets/room-list/bedroom.png',
      floor: 2,
    },
    {
      id: 5,
      name: 'Masters Bedroom',
      dimensions: '5m x 6m',
      area: 30,
      image: '../../../assets/room-list/masterbedroom.png',
      floor: 2,
    },
    {
      id: 6,
      name: 'Bathroom',
      dimensions: '3m x 3m',
      area: 9,
      image: '../../../assets/room-list/bathroom.png',
      floor: 2,
    },
  ];

  constructor(private router: Router) {
    // ✅ Inject Router
    addIcons({
      arrowBackOutline,
      createOutline,
      trashOutline,
      add,
      homeOutline,
      arrowBack,
      cubeOutline, // ✅ Register cube icon
    });
  }

  ngOnInit() {}

  editRoom(room: Room) {
    console.log('Edit room:', room);
    // Implement edit logic (open modal or navigate to edit page)
  }

  // ✅ Fixed generate3DHouse method
  generate3DHouse() {
    const allRooms = [...this.floor1Rooms, ...this.floor2Rooms];

    // Prepare data to send to 3D view
    const houseData = {
      projectName: 'My House Project',
      totalRooms: allRooms.length,
      rooms: allRooms,
      floors: [
        { floorNumber: 1, rooms: this.floor1Rooms },
        { floorNumber: 2, rooms: this.floor2Rooms },
      ],
      dimensions: {
        width: 12,
        length: 15,
      },
      floor: 2,
      notes: 'Generated from room list',
    };

    console.log('Generating 3D house with data:', houseData);

    // Navigate to 3D house view page
    this.router.navigate(['/3d-house-view'], {
      queryParams: { houseData: JSON.stringify(houseData) },
    });
  }

  deleteRoom(room: Room) {
    console.log('Delete room:', room);
    // Find and remove room from appropriate floor array
    if (room.floor === 1) {
      this.floor1Rooms = this.floor1Rooms.filter((r) => r.id !== room.id);
    } else {
      this.floor2Rooms = this.floor2Rooms.filter((r) => r.id !== room.id);
    }
  }

  addNewRoom() {
    console.log('Add new room');
    // Implement add room logic (open modal or navigate to add room page)
    // Example: this.router.navigate(['/add-room']);
  }

  get totalRooms(): number {
    return this.floor1Rooms.length + this.floor2Rooms.length;
  }
}
