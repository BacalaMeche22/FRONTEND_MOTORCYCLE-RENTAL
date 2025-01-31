import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';

import { BlocklistService } from '../../services/blocklist.service';
import { UpdateUserComponent } from '../update-user/update-user.component';
import { AddBlocklistComponent } from '../add-blocklist/add-blocklist.component';

@Component({
  selector: 'app-blocklist',
  templateUrl: './blocklist.component.html',
  styleUrls: ['./blocklist.component.css'],
})
export class BlocklistComponent implements OnInit {
  allblocklist: any[] = [];
  displayedColumns: string[] = ['index', 'name', 'email', 'block_date', 'reason', 'action'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private blocklistService: BlocklistService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadAllBlocklist();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadAllBlocklist(): void {
    this.blocklistService.getAllBlockUser().subscribe(
      (res) => {
        this.allblocklist = res.filter((block: any) => block.user.isBlocked);
        this.dataSource.data = this.allblocklist;
      },
      (error) => {
        console.error('Error loading blocklist:', error);
      }
    );
  }

  openUpdateUserModal(userId: string): void {
    const selectedUser = this.allblocklist.find((block: any) => block.user.user_id === userId);

    if (selectedUser) {
      const dialogRef = this.dialog.open(UpdateUserComponent, {
        width: '30rem',
        height: '90vh',
        panelClass: 'custom-dialog',
        data: selectedUser,
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.loadAllBlocklist();
        }
      });
    }
  }

  openAddBlocklistDialog(): void {
    const dialogRef = this.dialog.open(AddBlocklistComponent, {
      width: 'auto',
      panelClass: 'custom-dialog',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadAllBlocklist();
    });
  }

  unBlock(blockId: string): void {
    Swal.fire({
      title: 'Are you sure you want to UNBLOCK this user?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, unblock it!',
      cancelButtonText: 'No, cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.blocklistService.updateBlock(blockId).subscribe(
          () => {
            Swal.fire('Success!', 'The user has been unblocked.', 'success');
            this.loadAllBlocklist();
          },
          (error) => {
            console.error(`Error unblocking user with id ${blockId}:`, error);
            Swal.fire('Error', 'There was a problem unblocking the user.', 'error');
          }
        );
      } else {
        Swal.fire('Cancelled', 'The user remains blocked.', 'info');
      }
    });
  }
}
