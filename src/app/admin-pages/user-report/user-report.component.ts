import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-user-report',
  templateUrl: './user-report.component.html',
  styleUrls: ['./user-report.component.css'],
})
export class UserReportComponent implements OnInit {
  user: any[] = [];
  filteredUsers: any[] = [];
  reportFrom: string = '';
  reportTo: string = '';
  isReportGenerated: boolean = false;

  constructor(private userService: LoginService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUser().subscribe(
      (data) => {
        this.user = data;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  errorMessage = '';
  generateReport(): void {
    if (!this.reportFrom || !this.reportTo) {
      alert('Please select both start and end dates.');
      return;
    }

    const fromDate = new Date(this.reportFrom);
    const toDate = new Date(this.reportTo);

    if (fromDate > toDate) {
      alert('Start date cannot be after end date.');
      return;
    }

    this.filteredUsers = this.user.filter((user) => {
      const createdDate = new Date(user.created_at);
      return createdDate >= fromDate && createdDate <= toDate;
    });

    this.isReportGenerated = true;
  }

  // Utility function to format date to 'Month Day, Year Hour:Minute AM/PM'
  formatDateWithTime(date: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };

    const formattedDate = new Date(date).toLocaleDateString('en-US', options);
    const formattedTime = new Date(date).toLocaleTimeString('en-US', timeOptions);

    return `${formattedDate} ${formattedTime}`;
  }

  createPDF(): jsPDF {
    const doc = new jsPDF('p', 'mm', 'a4');

    const title = 'Motorcycle Rental';
    const subtitle = 'User Report';
    const dateRange = `Date from: ${new Date(this.reportFrom).toLocaleDateString()} to: ${new Date(this.reportTo).toLocaleDateString()}`;

    doc.setFontSize(14).text(title, 105, 10, { align: 'center' });
    doc.setFontSize(12).text(subtitle, 105, 18, { align: 'center' });
    doc.setFontSize(10).text(dateRange, 105, 25, { align: 'center' });

    const headers = [['Created At', 'Full Name', 'Email', 'Contact No', 'Role', 'Status', 'Blocked']];
    const rows = this.filteredUsers.map((user) => [
      // Use formatDateWithTime function to display formatted date with time
      this.formatDateWithTime(user.created_at),
      `${user.first_name} ${user.last_name}`,
      user.email,
      user.contact_no,
      user.role,
      user.status ? 'Active' : 'Inactive',
      user.isBlocked ? 'Yes' : 'No',
    ]);

    (doc as any).autoTable({
      head: headers,
      body: rows,
      startY: 30,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
      styles: { fontSize: 8 },
    });

    return doc;
  }

  exportToPDF(): void {
    const doc = this.createPDF();
    
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
  }

  printPDF(): void {
    const doc = this.createPDF();
  
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    iframe.src = pdfUrl;
  
    iframe.onload = () => {
      iframe.contentWindow?.print();
    };
  
    document.body.appendChild(iframe);
  }
}
