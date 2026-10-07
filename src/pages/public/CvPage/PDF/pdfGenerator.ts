import { pdf } from '@react-pdf/renderer';
import React from 'react';

/**
 * Generates and downloads a PDF document dynamically
 * @param documentComponent The @react-pdf/renderer Document component to render
 * @param fileName The name of the file to be downloaded
 */
export const generatePdfDocument = async (
  documentComponent: React.ReactElement,
  fileName: string,
) => {
  try {
    // @react-pdf typings are stricter than generic ReactElement
    const blob = await pdf(documentComponent as React.ReactElement<any>).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error('Failed to generate PDF:', error);
  }
};
