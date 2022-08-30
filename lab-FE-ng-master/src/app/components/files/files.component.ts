import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '@services/data.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {
  @ViewChild('input', { static: true }) inputFile: any;
  loading: boolean;
  updateDate: any;

  constructor(
    private data: DataService,
    private toast: MessageService,
  ) { }

  ngOnInit() {
    this.onLoad();
  }

  onLoad() {
    this.data.getConfig('updateDate').then((res) => {
      this.updateDate = res;
    }).catch(err => {
      console.error(err);
    });
  }

  displayMessage(msg: string) {
    this.toast.add({
      severity: 'info', summary: msg
    });
  }

  onUpload(event: any) {
    console.log('onUpload');
    const file = event.files[0];
    if (file === null) {
      this.displayMessage('No se seleccionó un archivo');
      return;
    }

    this.loading = true;
    this.data.uploadDatabaseFile(file).subscribe((res: any) => {
      this.displayMessage(res.message);
      if (res.code === 0) {
        this.updateDate = new Date();
        this.data.setConfig('updateDate', this.updateDate);
      }
      this.inputFile.clear();
      this.loading = false;
    });
  }

}
