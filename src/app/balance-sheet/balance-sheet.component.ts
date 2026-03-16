// working one

// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { HttpClient } from '@angular/common/http';
//
// interface Transaction {
//   date: string;
//   description: string;
//   amount: number;
//   type: string;
// }
//
// @Component({
//   selector: 'app-balance-sheet',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './balance-sheet.component.html',
//   styleUrl: './balance-sheet.component.css'
// })
// export class BalanceSheetComponent implements OnInit {
//
//   startingBalance = 0;
//   incomeTotal = 0;
//   expenseTotal = 0;
//   closingBalance = 0;
//
//   transactions: Transaction[] = [];
//
//   constructor(private http: HttpClient) {}
//
//   ngOnInit(): void {
//
//     this.http.get<any>('assets/data/transactions.json')
//       .subscribe(data => {
//
//         this.startingBalance = data.startingBalance;
//         this.transactions = data.transactions;
//
//         this.calculateTotals();
//
//       });
//
//   }
//
//   calculateTotals() {
//
//     this.incomeTotal = 0;
//     this.expenseTotal = 0;
//
//     this.transactions.forEach(t => {
//
//       if (t.type === 'income') {
//         this.incomeTotal += t.amount;
//       } else {
//         this.expenseTotal += t.amount;
//       }
//
//     });
//
//     this.closingBalance =
//       this.startingBalance +
//       this.incomeTotal -
//       this.expenseTotal;
//
//   }
//
// }


// new change ui

// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { HttpClient } from '@angular/common/http';
// import Chart from 'chart.js/auto';
// import * as XLSX from 'xlsx';
// import { saveAs } from 'file-saver';
//
// interface Transaction{
//   date:string;
//   description:string;
//   amount:number;
//   type:string;
// }
//
// @Component({
//   selector:'app-balance-sheet',
//   standalone:true,
//   imports:[CommonModule],
//   templateUrl:'./balance-sheet.component.html',
//   styleUrl:'./balance-sheet.component.css'
// })
// export class BalanceSheetComponent implements OnInit{
//
//   selectedYear=2026;
//
//   startingBalance=0;
//   incomeTotal=0;
//   expenseTotal=0;
//   closingBalance=0;
//
//   transactions:Transaction[]=[];
//
//   monthlyIncome:number[]=[];
//   monthlyExpense:number[]=[];
//
//   constructor(private http:HttpClient){}
//
//   ngOnInit(){
//     this.loadYear(this.selectedYear);
//   }
//
// loadYear(year: number) {
//
//   this.http.get<any>(`assets/data/${year}.json`)
//     .subscribe(data => {
//
//       this.startingBalance = data.startingBalance;
//       this.transactions = data.transactions;
//
//       this.calculateTotals();
//       this.calculateMonthly();
//       this.drawChart();
//
//     });
//
// }
//
//   calculateTotals(){
//
//     this.incomeTotal=0;
//     this.expenseTotal=0;
//
//     this.transactions.forEach(t=>{
//
//       if(t.type==='income'){
//         this.incomeTotal+=t.amount;
//       }else{
//         this.expenseTotal+=t.amount;
//       }
//
//     });
//
//     this.closingBalance =
//       this.startingBalance +
//       this.incomeTotal -
//       this.expenseTotal;
//
//   }
//
//   calculateMonthly(){
//
//     this.monthlyIncome = new Array(12).fill(0);
//     this.monthlyExpense = new Array(12).fill(0);
//
//     this.transactions.forEach(t=>{
//
//       const month=new Date(t.date).getMonth();
//
//       if(t.type==='income'){
//         this.monthlyIncome[month]+=t.amount;
//       }else{
//         this.monthlyExpense[month]+=t.amount;
//       }
//
//     });
//
//   }
//
//   drawChart(){
//
//     new Chart("financeChart",{
//       type:'bar',
//       data:{
//         labels:[
//           "Jan","Feb","Mar","Apr","May","Jun",
//           "Jul","Aug","Sep","Oct","Nov","Dec"
//         ],
//         datasets:[
//           {
//             label:'Income',
//             data:this.monthlyIncome
//           },
//           {
//             label:'Expense',
//             data:this.monthlyExpense
//           }
//         ]
//       }
//     });
//
//   }
//
//   downloadExcel(){
//
//     const ws = XLSX.utils.json_to_sheet(this.transactions);
//     const wb = XLSX.utils.book_new();
//
//     XLSX.utils.book_append_sheet(wb,ws,"Transactions");
//
//     const buffer = XLSX.write(wb,{
//       bookType:'xlsx',
//       type:'array'
//     });
//
//     const file=new Blob([buffer],{type:'application/octet-stream'});
//
//     saveAs(file,`Balance_${this.selectedYear}.xlsx`);
//
//   }
//
// }




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

  const data=document.getElementById("dashboard");

  html2canvas(data!).then(canvas=>{

    const imgWidth=208;
    const imgHeight=canvas.height * imgWidth / canvas.width;

    const imgData=canvas.toDataURL('image/png');

    const pdf=new jsPDF();

    pdf.addImage(imgData,'PNG',0,0,imgWidth,imgHeight);

    pdf.save("finance-report.pdf");

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
