import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UpdateComponent } from '../update/update.component';
import { style } from '@angular/animations';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
})
export class FormComponent implements OnInit {
  tableData: User[] = [];
  public info: User = new User();
  checkfordup: any;
  isDuplicateData: boolean = false;
  searchTerm: string = '';
  localData: User[] = [];
  deleteStaus: boolean = false;
  finalData: User[] = [];
  showPopup: boolean = false;

  availableMessage: boolean = false;
  message: string = '';

  constructor(private toastr: ToastrService, private dialog: MatDialog) {}

  ngOnInit() {
    const storedTableData = localStorage.getItem('tableData');
    this.tableData = storedTableData ? JSON.parse(storedTableData) : [];

    if (!localStorage.getItem('lastId')) {
      localStorage.setItem('lastId', '0');
    }
  }

  checkforduplicate() {
    this.checkfordup = this.tableData.find(
      (d) => d.name === this.info.name && d.code === this.info.code
    );
    if (this.checkfordup) {
      this.toastr.error("Duplicates aren't allowed");
      this.isDuplicateData = true;
    }
  }

  submitForm(form: NgForm) {
    const name = this.info.name;
    const code = this.info.code;
    if (name && code) {
      this.checkforduplicate();
      if (!this.isDuplicateData) {
        this.toastr.success('Form Submitted!');
        this.tableData.push(this.info);
        localStorage.setItem('tableData', JSON.stringify(this.tableData));
        this.info = new User();
        form.resetForm();
      }
    } else {
      this.toastr.error('All fields required!');
    }
  }

  filterData() {
    if (!this.searchTerm) {
      return this.tableData;
    }
    return this.tableData.filter(
      (item) =>
        item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  deleteItem(index: number) {
    if (confirm('Are you sure you want to delete this item?')) {
      const item = this.tableData[index];
      const deletedId = item.id;
      item.status = false;

      this.tableData.splice(index, 1);
      this.toastr.success('Item Deleted!');
      this.tableData.forEach((user) => {
        if (user.id > deletedId) {
          user.id--;
        }
      });
      localStorage.setItem('tableData', JSON.stringify(this.tableData));
    }
  }

  // Pop up

  openPopup(index: number) {
    const dialogRef = this.dialog.open(UpdateComponent, {
      data: {
        data: index,
      },
    });

    dialogRef.afterClosed().subscribe((result: User) => {
      if (result) {
        this.info = result;
        this.tableData[index] = this.info;
        localStorage.setItem('tableData', JSON.stringify(this.tableData));
      } else {
        this.toastr.error('Failed to update the item!');
      }
    });
  }

  closePopup() {
    this.showPopup = false;
  }
}
