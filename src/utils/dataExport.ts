import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface CarbonRecord {
  id: number;
  date: Date;
  emission: number;
  userId: number;
}

export const exportToCSV = (data: CarbonRecord[], filename: string = 'carbon-footprint-data.csv') => {
  const headers = ['Date', 'Carbon Emission (kg CO₂)', 'User ID'];
  const csvContent = [
    headers.join(','),
    ...data.map(record => [
      record.date.toISOString().split('T')[0],
      record.emission.toFixed(2),
      record.userId
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToJSON = (data: any, filename: string = 'carbon-footprint-data.json') => {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generatePDFReport = async (
  userData: any,
  carbonData: CarbonRecord[],
  insights: any[],
  filename: string = 'carbon-footprint-report.pdf'
) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // Title
  pdf.setFontSize(20);
  pdf.setTextColor(22, 163, 74); // Green color
  pdf.text('Carbon Footprint Report', pageWidth / 2, 30, { align: 'center' });
  
  // User info
  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Generated for: ${userData.username}`, 20, 50);
  pdf.text(`Email: ${userData.email}`, 20, 60);
  pdf.text(`City: ${userData.city}`, 20, 70);
  pdf.text(`Report Date: ${new Date().toLocaleDateString()}`, 20, 80);
  
  // Summary statistics
  const totalEmissions = carbonData.reduce((sum, record) => sum + record.emission, 0);
  const avgEmission = carbonData.length > 0 ? totalEmissions / carbonData.length : 0;
  const minEmission = carbonData.length > 0 ? Math.min(...carbonData.map(r => r.emission)) : 0;
  const maxEmission = carbonData.length > 0 ? Math.max(...carbonData.map(r => r.emission)) : 0;
  
  pdf.setFontSize(14);
  pdf.text('Summary Statistics', 20, 100);
  pdf.setFontSize(10);
  pdf.text(`Total Records: ${carbonData.length}`, 20, 115);
  pdf.text(`Average Daily Emission: ${avgEmission.toFixed(2)} kg CO₂`, 20, 125);
  pdf.text(`Lowest Daily Emission: ${minEmission.toFixed(2)} kg CO₂`, 20, 135);
  pdf.text(`Highest Daily Emission: ${maxEmission.toFixed(2)} kg CO₂`, 20, 145);
  pdf.text(`Total Emissions: ${totalEmissions.toFixed(2)} kg CO₂`, 20, 155);
  
  // Environmental impact
  pdf.setFontSize(14);
  pdf.text('Environmental Impact', 20, 175);
  pdf.setFontSize(10);
  pdf.text(`Trees needed to offset annual emissions: ${Math.ceil(totalEmissions * 365 / 21)} trees`, 20, 190);
  pdf.text(`Equivalent driving distance: ${(totalEmissions * 365 / 0.404).toFixed(0)} km/year`, 20, 200);
  pdf.text(`Energy equivalent: ${(totalEmissions * 365 * 2.3).toFixed(0)} kWh/year`, 20, 210);
  
  // Recent insights
  if (insights.length > 0) {
    pdf.setFontSize(14);
    pdf.text('Recent AI Insights', 20, 230);
    pdf.setFontSize(10);
    let yPos = 245;
    insights.slice(0, 3).forEach((insight, index) => {
      pdf.text(`${index + 1}. ${insight.title}`, 20, yPos);
      yPos += 10;
      const lines = pdf.splitTextToSize(insight.content, pageWidth - 40);
      pdf.text(lines, 25, yPos);
      yPos += lines.length * 5 + 5;
    });
  }
  
  // Save the PDF
  pdf.save(filename);
};

export const shareData = async (data: any, title: string = 'My Carbon Footprint Data') => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: title,
        text: `Check out my carbon footprint data: Average daily emission is ${data.avgEmission?.toFixed(2)} kg CO₂`,
        url: window.location.href,
      });
    } catch (error) {
      console.log('Error sharing:', error);
      // Fallback to clipboard
      await navigator.clipboard.writeText(`${title}: ${JSON.stringify(data, null, 2)}`);
      alert('Data copied to clipboard!');
    }
  } else {
    // Fallback for browsers that don't support Web Share API
    await navigator.clipboard.writeText(`${title}: ${JSON.stringify(data, null, 2)}`);
    alert('Data copied to clipboard!');
  }
};