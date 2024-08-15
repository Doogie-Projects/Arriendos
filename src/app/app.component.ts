import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [FormsModule]
})
export class AppComponent {
  startDate: string = '';
  endDate: string = '';
  price: number = 0;
  daysBetween: number = 0;

  // Arreglo para las tasas de interes se pueden obtener de una API (https://www.ceta.org.co/html/usura.asp?txtAnod=2024&txtAnoh=2024&btnBuscar=Ver+Tasa+de+Usura)
  interestRates = [
    { month: '2024-01', rate: 34.98 },
    { month: '2024-02', rate: 34.97 },
    { month: '2024-03', rate: 33.30 },
    { month: '2024-04', rate: 33.09 },
    { month: '2024-05', rate: 31.53 },
    { month: '2024-06', rate: 30.84 },
    { month: '2024-07', rate: 29.49 },
    { month: '2024-08', rate: 29.21 },
  ];

  onSubmit() {
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    const timeDiff = end.getTime() - start.getTime();
    this.daysBetween = timeDiff / (1000 * 3600 * 24);

    console.log('Fecha inicio:', this.startDate);
    console.log('Fecha fin:', this.endDate);
    console.log('Canon:', this.price);
    console.log('Dias en mora:', this.daysBetween);

    // Calcular con interes simple
    const simpleInterest = this.calculateSimpleInterest();
    console.log('Total Interes a pagar (Simple):', simpleInterest);

    // Calcular con interes compuesto
    const compoundInterest = this.calculateCompoundInterest();
    console.log('Total Interes a pagar (Compuesto):', compoundInterest);
  }

  calculateSimpleInterest(): number {
    let totalInterest = 0;
    let currentDate = new Date(this.startDate);

    while (currentDate < new Date(this.endDate)) {
      const monthYear = `${currentDate.getFullYear()}-${('0' + (currentDate.getMonth() + 1)).slice(-2)}`;
      const interestRate = this.interestRates.find(rate => rate.month === monthYear)?.rate ?? 0;

      const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
      const daysInCurrentMonth = Math.min(daysInMonth, (new Date(this.endDate).getDate() - currentDate.getDate() + 1));

      const dailyRate = (interestRate / 100) / 365;

      const interest = this.price * dailyRate * daysInCurrentMonth;
      totalInterest += interest;

      // Siguiente mes
      currentDate.setMonth(currentDate.getMonth() + 1);
      currentDate.setDate(1);
    }

    return totalInterest;
  }

  calculateCompoundInterest(): number {
    let principal = this.price;
    let currentDate = new Date(this.startDate);
    let totalInterest = 0;

    while (currentDate < new Date(this.endDate)) {
      const monthYear = `${currentDate.getFullYear()}-${('0' + (currentDate.getMonth() + 1)).slice(-2)}`;
      const interestRate = this.interestRates.find(rate => rate.month === monthYear)?.rate ?? 0;

      const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
      const daysInCurrentMonth = Math.min(daysInMonth, (new Date(this.endDate).getDate() - currentDate.getDate() + 1));

      const dailyRate = (interestRate / 100) / 365;

      const periods = daysInCurrentMonth;
      const compoundInterestFactor = Math.pow(1 + dailyRate, periods);
      totalInterest = principal * (compoundInterestFactor - 1);

      principal += totalInterest;

      // Siguiente mes
      currentDate.setMonth(currentDate.getMonth() + 1);
      currentDate.setDate(1);
    }

    return principal - this.price;
  }
}
