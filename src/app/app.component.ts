import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})

export class AppComponent {

  totalInterestArray: number[] = [];
  months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  currentDate = new Date();
  currentDay = new Date().getDate();
  currentMonth = new Date().getMonth();
  selectedMonths = new Array(this.months.length).fill(false);
  selectedMonthsName: string[] = [];
  paymentDate: string;
  value: number;
  interestRates = [
    { month: 'Enero', rate: 34.98 },
    { month: 'Febrero', rate: 34.97 },
    { month: 'Marzo', rate: 33.30 },
    { month: 'Abril', rate: 33.09 },
    { month: 'Mayo', rate: 31.53 },
    { month: 'Junio', rate: 30.84 },
    { month: 'Julio', rate: 29.49 },
    { month: 'Agosto', rate: 29.21 },
  ];

  constructor() {
    const today = new Date();
    this.paymentDate = today.toISOString().split('T')[0];
    this.value = 0;
  }

  calculateSimpleInterest(): { totalInterest: number, totalInterestArray: number[], selectedMonthsName: string[] } {
    let totalInterestArray = [];
    let totalInterest = 0;
    let selectedMonthsName = [];
    const firstTrueIndex = this.selectedMonths.findIndex(month => month === true);
    const paymentDateString: string = this.paymentDate;
    const dateParts: string[] = paymentDateString.split('-');
    const dayPart: string = dateParts[2];
    const lastNumber: number = parseInt(dayPart, 10);
    // console.log('Last Number:', lastNumber);
    
    for (let i = 0; i < this.selectedMonths.length; i++) {
      if (this.selectedMonths[i]) {
        const month = this.months[i];
        const interestRate = this.interestRates.find(rate => rate.month === month)?.rate ?? 0;
        // console.log('Interest Rate:', interestRate);

        let daysInMonth = 30;
        let isLastTrue = true;

        for (let j = i + 1; j < this.selectedMonths.length; j++) {
          if (this.selectedMonths[j] === true) {
            isLastTrue = false;
            break;
          }
        }

        if (this.selectedMonths[i] === true && isLastTrue) {
          daysInMonth = lastNumber-1;
        }
        let interest = (this.value * interestRate * daysInMonth) / (100 * 360);
        totalInterest += interest * (i - firstTrueIndex + 1);
        totalInterestArray.push(interest * (i - firstTrueIndex + 1));
        // console.log('I:', i);
        // totalInterestArray.push(interest); 
        // console.log(this.months[i]);
        // selectedMonthsName.push(this.months[i]);
        selectedMonthsName.push(month);
        // console.log(selectedMonthsName);
      }
    }

    return { totalInterest, totalInterestArray, selectedMonthsName };
  }

  onSubmit() {
    // Lógica para calcular intereses
    const { totalInterest, totalInterestArray, selectedMonthsName } = this.calculateSimpleInterest();
    console.log('1. currentDate:', this.currentDate);
    console.log('2. currentMonth:', this.currentMonth);
    console.log('3. currentDay:', this.currentDay);
    console.log('4. selectedMonths TF:', this.selectedMonths);
    console.log('5. selectedMonthsName:', selectedMonthsName);
    console.log('6. paymentDate:', this.paymentDate);
    console.log('7. value:', this.value);
    console.log('8. totalInterest:', totalInterest);
    this.totalInterestArray = totalInterestArray;
    this.selectedMonthsName = selectedMonthsName;
    console.log('9. totalInterestArray:', totalInterestArray)
    console.log('10. paymentDate:', this.paymentDate);
  }

}