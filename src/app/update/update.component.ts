import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../user';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrl: './update.component.css',
})
export class UpdateComponent implements OnInit {
  inputData: any = '';
  updatedData: User;
  updatedValue: User[] = [];
  checkfordup: any;
  isDuplicateData: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: User,
    private dialogRef: MatDialogRef<UpdateComponent>,
    private toastr: ToastrService
  ) {
    // Initialize updatedData with the received data
    this.updatedData = { ...data };
  }

  closeDialog() {
    this.dialogRef.close();
  }
  updateDataDialog() {
    console.log('sdkjb');
  }
  name: string = '';
  code: string = '';

  dataFromParent: User[] = [];
  finalProduct: User[] = [];
  @Output('output') messageEvent = new EventEmitter<string>();

  updateData(form: NgForm) {
    const finalName = form.value.name;
    const finalCode = form.value.code;
    if (finalName && finalCode) {
      const updatedValue = form.value;

      this.checkforduplicate(updatedValue);

      if (this.isDuplicateData) {
        return;
      }
      this.toastr.success('Data Updated Successfully');
      this.dialogRef.close(updatedValue);
    } else {
      this.toastr.error('All fields required!');
    }
  }

  checkforduplicate(updatedValue: User) {
    const data = localStorage.getItem('tableData');
    const localStorageData: User[] = data ? JSON.parse(data) : [];

    this.isDuplicateData = localStorageData.some(
      (user) =>
        user.name === updatedValue.name &&
        user.code === updatedValue.code &&
        user.id !== this.updatedData.id
    );

    if (this.isDuplicateData) {
      this.toastr.error("Duplicates aren't allowed");
    }
  }

  ngOnInit() {
    this.inputData = this.data;
    console.log(this.inputData.data);
    const idForData = this.inputData.data++;
    console.log(idForData);
    console.log(this.inputData.data);

    const data = localStorage.getItem('tableData');
    const localStorageData = data ? JSON.parse(data) : [];
    console.log(localStorageData);

    if (localStorageData) {
      this.finalProduct = localStorageData.filter(
        (a: any) => a.id === this.inputData.data
      );
      console.log(this.finalProduct);
    }
  }
}
