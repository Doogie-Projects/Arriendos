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

  totalInterest: number = 0;
  totalInterestArray: number[] = [];
  totalInterest5DaysArray: number[] = [];
  resultArray: number[] = [];
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
    { month: 'Septiembre', rate: 28.85 },
  ];

  constructor() {
    const today = new Date();
    this.paymentDate = today.toISOString().split('T')[0];
    this.value = 0;
  }

  //Method to calculate the simple interest
  calculateSimpleInterest(): { totalInterest: number, totalInterestArray: number[], selectedMonthsName: string[], totalInterest5DaysArray: number[], resultArray: number[] } {
    let totalInterestArray = [];
    let totalInterest5DaysArray = [];
    let resultArray = [];
    let totalInterest = 0;
    let selectedMonthsName = [];
    const firstTrueIndex = this.selectedMonths.findIndex(month => month === true);
    const paymentDateString: string = this.paymentDate;
    const dateParts: string[] = paymentDateString.split('-');
    const dayPart: string = dateParts[2];
    const lastNumber: number = parseInt(dayPart, 10);

    for (let i = 0; i < this.selectedMonths.length; i++) {
      if (this.selectedMonths[i]) {
        const month = this.months[i];
        const interestRate = this.interestRates.find(rate => rate.month === month)?.rate ?? 0;

        let daysInMonth = 30;
        let isLastTrue = true;

        // calculate if is the last month
        for (let j = i + 1; j < this.selectedMonths.length; j++) {
          if (this.selectedMonths[j] === true) {
            isLastTrue = false;
            break;
          }
        }

        // if is the last month, calculate the day form date form
        if (this.selectedMonths[i] === true && isLastTrue) {
          daysInMonth = lastNumber - 1;
        }

        let interest = (this.value * interestRate * daysInMonth) / (100 * 360);
        totalInterest += interest * (i - firstTrueIndex + 1);
        totalInterestArray.push(interest * (i - firstTrueIndex + 1));
        selectedMonthsName.push(month);
      }
    }

    // calculate 5 days interest
    for (let i = 0; i < this.selectedMonths.length; i++) {
      if (this.selectedMonths[i]) {
        const month = this.months[i];
        const interestRate = this.interestRates.find(rate => rate.month === month)?.rate ?? 0;
        let daysInMonth = 5;
        let interest = (this.value * interestRate * daysInMonth) / (100 * 360);

        totalInterest5DaysArray.push(interest);
      }
    }

    //subtract 5 days interest from total interest and create resultArray
    for (let i = 0; i < totalInterestArray.length; i++) {
      const result = totalInterestArray[i] - totalInterest5DaysArray[i];
      resultArray.push(result);
    }

    //Subtract 5 days interest from total interest
    const sumTotalInterest5Days = totalInterest5DaysArray.reduce((acc, curr) => acc + curr, 0);
    totalInterest -= sumTotalInterest5Days;

    return { totalInterest, totalInterestArray, selectedMonthsName, totalInterest5DaysArray, resultArray };
  }

  onSubmit() {
    // Lógica para calcular intereses
    const { totalInterest, totalInterestArray, selectedMonthsName, totalInterest5DaysArray, resultArray } = this.calculateSimpleInterest();
    this.totalInterest = totalInterest;
    this.totalInterestArray = totalInterestArray;
    this.selectedMonthsName = selectedMonthsName;
    this.totalInterest5DaysArray = totalInterest5DaysArray;
    this.resultArray = resultArray;
    // console.log('1. currentDate:', this.currentDate);
    // console.log('2. currentMonth:', this.currentMonth);
    // console.log('3. currentDay:', this.currentDay);
    // console.log('4. selectedMonths TF:', this.selectedMonths);
    // console.log('5. selectedMonthsName:', selectedMonthsName);
    // console.log('6. paymentDate:', this.paymentDate);
    // console.log('7. value:', this.value);
    // console.log('8. totalInterest:', totalInterest);
    // console.log('9. totalInterestArray:', totalInterestArray)
    // console.log('10. totalInterest5DaysArray:', totalInterest5DaysArray)
    // console.log('11. paymentDate:', this.paymentDate);
    // console.log('12. resultArray:', this.resultArray);
  }

}