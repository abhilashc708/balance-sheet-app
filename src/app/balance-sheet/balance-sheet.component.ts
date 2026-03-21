import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import Chart from 'chart.js/auto';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Transaction{
  date:string;
  description:string;
  amount:number;
  type:string;
}

@Component({
  selector:'app-balance-sheet',
  standalone:true,
  imports:[CommonModule],
  templateUrl:'./balance-sheet.component.html',
  styleUrl:'./balance-sheet.component.css'
})
export class BalanceSheetComponent implements OnInit{

  selectedYear=2026;

  startingBalance=0;
  incomeTotal=0;
  expenseTotal=0;
  closingBalance=0;

  transactions:Transaction[]=[];

  monthlyIncome:number[]=[];
  monthlyExpense:number[]=[];

  darkMode=false;

  constructor(private http:HttpClient){}

  ngOnInit(){
    this.loadYear(this.selectedYear);
  }

loadYear(year:number){

  this.selectedYear=year;

  this.http.get<any>(`assets/data/${year}.json`)
    .subscribe(data => {

      this.startingBalance=data.startingBalance;
      this.transactions=data.transactions;

      this.calculateTotals();
      this.calculateMonthly();

    });

}

calculateTotals(){

  this.incomeTotal=0;
  this.expenseTotal=0;

  this.transactions.forEach(t=>{

    if(t.type==='income'){
      this.incomeTotal+=t.amount;
    }else{
      this.expenseTotal+=t.amount;
    }

  });

  this.closingBalance =
    this.startingBalance +
    this.incomeTotal -
    this.expenseTotal;

}

calculateMonthly(){

  this.monthlyIncome=new Array(12).fill(0);
  this.monthlyExpense=new Array(12).fill(0);

  this.transactions.forEach(t=>{

    const month=new Date(t.date).getMonth();

    if(t.type==='income'){
      this.monthlyIncome[month]+=t.amount;
    }else{
      this.monthlyExpense[month]+=t.amount;
    }

  });

}


downloadExcel(){

  const ws=XLSX.utils.json_to_sheet(this.transactions);
  const wb=XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb,ws,"Transactions");

  const buffer=XLSX.write(wb,{bookType:'xlsx',type:'array'});

  const file=new Blob([buffer],{type:'application/octet-stream'});

  saveAs(file,`Balance_${this.selectedYear}.xlsx`);

}

downloadPDF(){
  const original = document.getElementById('dashboard');
  // 🔥 clone the UI
  const cloned = original!.cloneNode(true) as HTMLElement;
  // hide buttons in clone only
  const elements = cloned.querySelectorAll('.no-print');
  elements.forEach((el: any) => el.style.display = 'none');
  // move clone off-screen (invisible to user)
  cloned.style.position = 'absolute';
  cloned.style.top = '-9999px';
  document.body.appendChild(cloned);

  html2canvas(cloned, {
    scale: 2,
    backgroundColor: '#ffffff'
  }).then(canvas => {
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = canvas.height * imgWidth / canvas.width;
    let heightLeft = imgHeight;
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p','mm','a4');
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save('finance-report.pdf');

    // 🔥 remove cloned DOM
    document.body.removeChild(cloned);

  });

}
toggleTheme(){

this.darkMode=!this.darkMode;

if(this.darkMode){
document.body.classList.add("dark-theme");
}else{
document.body.classList.remove("dark-theme");
}
}
}
