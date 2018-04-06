import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/do';
import * as XLSX from 'xlsx';
type AOA = any[][];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  data: AOA = [ [1, 2], [3, 4] ];
  public jsonData :any[]=[];
  public jsonencabezado :any[]=[];
	wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
	fileName: string = 'SheetJS.xlsx';

	onFileChange(evt: any) {
		/* wire up file reader */
		const target: DataTransfer = <DataTransfer>(evt.target);
		if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    
		reader.onload = (e: any) => {
			/* read workbook */
			const bstr: string = e.target.result;
			const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

			/* grab first sheet */
			const wsname: string = wb.SheetNames[0];
			const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
     
      this.data = <AOA>(XLSX.utils.sheet_to_json(ws, {header: 1}));

      //console.log(this.data);
      

      this.procesarData();
		};
    reader.readAsBinaryString(target.files[0]);
    
    
    
  }
  
  procesarData(){
   

    this.data.forEach(function (row) {

      if(row.length>20){
       //console.log(row);
        this.jsonData.push(row);
        
      }
    
    
    }.bind(this));
   
    
  }

  mostrarEncabezados(){
    this.jsonencabezado=this.jsonData[0];

  }



	export(): void {
		/* generate worksheet */
		const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.data);

		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

		/* save to file */
		XLSX.writeFile(wb, this.fileName);
	}

}