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
  fullcetaInterestArray: { month: string, rate: number }[] = [];

  constructor() {
    const today = new Date();
    this.paymentDate = today.toISOString().split('T')[0];
    this.value = 0;
  }

  // ----------------Method to calculate the simple interest----------------
  async calculateSimpleInterest(): Promise<{ totalInterest: number, totalInterestArray: number[], selectedMonthsName: string[], totalInterest5DaysArray: number[], resultArray: number[] }> {

    // ----------------Wait for fetchUsuraRate() before continuing----------------
    const data = await this.fetchUsuraRate();
    this.fullcetaInterestArray = data;
    // console.log('fullcetaInterestArray:', this.fullcetaInterestArray);

    let totalInterestArray: number[] = [];
    let totalInterest5DaysArray: number[] = [];
    let resultArray: number[] = [];
    let totalInterest: number = 0;
    let selectedMonthsName: string[] = [];
    const firstTrueIndex = this.selectedMonths.findIndex(month => month === true);
    const paymentDateString: string = this.paymentDate;
    const dateParts: string[] = paymentDateString.split('-');
    const dayPart: string = dateParts[2];
    const lastNumber: number = parseInt(dayPart, 10);

    for (let i = 0; i < this.selectedMonths.length; i++) {
      if (this.selectedMonths[i]) {
        const month = this.months[i];
        const interestRate = this.fullcetaInterestArray.find(rate => rate.month === month)?.rate ?? 0;

        let daysInMonth = 30;
        let isLastTrue = true;

        // ----------------calculate if is the last month----------------
        for (let j = i + 1; j < this.selectedMonths.length; j++) {
          if (this.selectedMonths[j] === true) {
            isLastTrue = false;
            break;
          }
        }

        // ----------------if is the last month, calculate the day form date form----------------
        if (this.selectedMonths[i] === true && isLastTrue) {
          daysInMonth = lastNumber - 1;
        }

        let interest = (this.value * interestRate * daysInMonth) / (100 * 360);
        totalInterest += interest * (i - firstTrueIndex + 1);
        totalInterestArray.push(interest * (i - firstTrueIndex + 1));
        selectedMonthsName.push(month);
      }
    }

    // ----------------calculate 5 days interest----------------
    for (let i = 0; i < this.selectedMonths.length; i++) {
      if (this.selectedMonths[i]) {
        const month = this.months[i];
        const interestRate = this.fullcetaInterestArray.find(rate => rate.month === month)?.rate ?? 0;
        let daysInMonth = 5;
        let interest = (this.value * interestRate * daysInMonth) / (100 * 360);

        totalInterest5DaysArray.push(interest);
      }
    }

    // ----------------subtract 5 days interest from total interest and create resultArray----------------
    for (let i = 0; i < totalInterestArray.length; i++) {
      const result = totalInterestArray[i] - totalInterest5DaysArray[i];
      resultArray.push(result);
    }

    // ----------------Subtract 5 days interest from total interest----------------
    const sumTotalInterest5Days = totalInterest5DaysArray.reduce((acc, curr) => acc + curr, 0);
    totalInterest -= sumTotalInterest5Days;

    return { totalInterest, totalInterestArray, selectedMonthsName, totalInterest5DaysArray, resultArray };
  }

  fetchUsuraRate(): Promise<{ month: string, rate: number }[]> {
    let cetaInterestArray: number[] = [];
    let fullcetaInterestArray: { month: string, rate: number }[] = [];

    const requestOptions: RequestInit = {
      method: "GET",
      headers: {},
      redirect: "follow" as RequestRedirect
    };

    const currentDate = new Date();

    return fetch(`/api/html/usura.asp?txtAnod=${currentDate.getFullYear()}&txtAnoh=${currentDate.getFullYear()}&btnBuscar=Ver+Tasa+de+Usura`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(result, 'text/html');
        doc.querySelectorAll('p').forEach((span) => {
          const match = span.innerHTML.match(/&nbsp;(\d+\.\d+)%/);
          if (match) {
            const number = parseFloat(match[1]);
            cetaInterestArray.push(number);
          }
        });

        for (let i = 0; i < this.currentMonth + 1; i++) {
          fullcetaInterestArray.push({ month: this.months[i], rate: cetaInterestArray[i] });
        }
        return fullcetaInterestArray;
      })
      .catch((error) => {
        console.error(error);
        return [];
      });
  }


  async onSubmit() {
    try {
      // ----------------Await the promise returned by calculateSimpleInterest----------------
      const { totalInterest, totalInterestArray, selectedMonthsName, totalInterest5DaysArray, resultArray } = await this.calculateSimpleInterest();

      // ----------------Assign the resolved values to the component properties----------------
      this.totalInterest = totalInterest;
      this.totalInterestArray = totalInterestArray;
      this.selectedMonthsName = selectedMonthsName;
      this.totalInterest5DaysArray = totalInterest5DaysArray;
      this.resultArray = resultArray;

      // ----------------Fetch and assign the usura rate----------------
      const data = await this.fetchUsuraRate();
      this.fullcetaInterestArray = data;
      // console.log('fullcetaInterestArray:', this.fullcetaInterestArray);

      // ----------------Additional debug logs----------------
      // console.log('1. currentDate:', this.currentDate);
      // console.log('2. currentMonth:', this.currentMonth);
      // console.log('3. currentDay:', this.currentDay);
      // console.log('4. selectedMonths TF:', this.selectedMonths);
      // console.log('5. selectedMonthsName:', selectedMonthsName);
    } catch (error) {
      console.error('Error in onSubmit:', error);
    }
  }

}