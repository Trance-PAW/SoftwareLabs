import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { PageOrientation } from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { group } from '@angular/animations';
import { Subject } from 'rxjs';
import { AssetsService } from './assets.service';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class PdfGenerator {

  images: any = {};

  constructor(private assets: AssetsService) {
    (pdfMake as any).fonts = {
      Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Medium.ttf',
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-MediumItalic.ttf'
      }
    };
    this.loadImages();
  }

  async loadImages() {
    this.images.logo_fing = await this.assets.getAssetAsBlob('img/logo_fing.jpg');
    this.images.logo_uach = await this.assets.getAssetAsBlob('img/logo_uach.jpg');
  }

  generateStudentsReportPdf(content: {
    classroom: string,
    startDate: Date,
    endDate: Date,
    group: string,
    subject: string,
    managerName: string,
    records: any[]
    professor: string
  }) {
    const timeStamp = `${this.formatDate(content.startDate)} - ${this.formatDate(content.endDate)}`;
    const docDefinition = {
      background: (currentPage: number, pageSize: any) => {
        return currentPage === 1 ? [
          {
            margin: [30, 30, 0, 0],
            image: this.images.logo_uach,
            height: 100,
            width: 90,
          },
          {
            margin: [0, -90, 20, 0],
            alignment: 'right',
            height: 90,
            width: 90,
            image: this.images.logo_fing,
          }
        ] : '';
      },
      content: [
        { text: 'Universidad Autónoma de Chihuahua', style: 'header' },
        { text: 'Facultad de Ingeniería', style: 'header' },
        { text: `Laboratorio: ${content.classroom}`, style: 'header' },
        { text: 'Bitácora de Asistencia de Alumnos', style: 'header' },
        { text: `Jefe de Laboratorio: ${content.managerName}`, style: 'header' },
        {
          columns: [
            { width: '*', text: '' },
            {
              width: 'auto',
              alignment: 'center',
              margin: [0, 20, 0, 0],
              table: {
                headerRows: 0,
                widths: ['*'],
                body: [
                  [{ text: content.group || 'NA' }],
                  [{ text: content.subject || 'NA' }],
                  [{ text: content.professor || 'NA' }],
                  [{ text: timeStamp }],
                ]
              }
            },
            { width: '*', text: '' },
          ]
        },
        {
          margin: [0, 20, 0, 0],
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: ['*', 250, '*'],

            body: [
              [{ text: 'Matrícula', style: 'tableHead' }, { text: 'Nombre', style: 'tableHead' }, { text: 'Carrera', style: 'tableHead' }],
              ...content.records
            ]
          }
        }
      ],
      styles: {
        header: {
          fontSize: 14,
          bold: true,
          alignment: 'center',
        },
        tableHead: {
          fontSize: 12,
          alignment: 'center',
        }
      },
      images: {
        // logo_fing: 'http://fing.uach.mx/util/2013/01/27/logo%20ingenieria.png',
        // logo_uach: 'http://fing.uach.mx/util/2013/01/27/logo%20uach.png',
      }
    };

    pdfMake.createPdf(docDefinition as any).open();
  }

  generateProfessorsReportPdf(content: {
    classroom: string,
    startDate: Date,
    endDate: Date,
    managerName: string,
    records: any[]
  }) {
    const docDefinition = {
      pageOrientation: 'landscape',
      background: (currentPage: number, pageSize: any) => {
        return currentPage === 1 ? [
          {
            margin: [30, 30, 0, 0],
            image: this.images.logo_uach,
            height: 100,
            width: 90,
          },
          {
            margin: [0, -90, 20, 0],
            alignment: 'right',
            height: 90,
            width: 90,
            image: this.images.logo_fing,
          }
        ] : '';
      },
      content: [
        { text: 'Universidad Autónoma de Chihuahua', style: 'header' },
        { text: 'Facultad de Ingeniería', style: 'header' },
        { text: `Laboratorio: ${content.classroom}`, style: 'header' },
        { text: 'Bitácora de Asistencia Docente', style: 'header' },
        { text: `Jefe de Laboratorio: ${content.managerName}`, style: 'header' },
        {
          margin: [0, 30, 0, 0],
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: [350, '*', '*', '*'],

            body: [
              [{ text: 'Docente', style: 'tableHead' }, { text: 'Materia', style: 'tableHead' },
              { text: 'Fecha', style: 'tableHead' }, { text: 'Entrada', style: 'tableHead' }],
              ...content.records
            ]
          }
        }
      ],
      styles: {
        header: {
          fontSize: 14,
          bold: true,
          alignment: 'center',
        },
        tableHead: {
          fontSize: 12,
          alignment: 'center',
        }
      }
    };

    pdfMake.createPdf(docDefinition as any).open();
  }

  formatDate(date: Date) {
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    const year = '' + date.getFullYear();
    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    return [day, month, year].join('/');
  }
}
