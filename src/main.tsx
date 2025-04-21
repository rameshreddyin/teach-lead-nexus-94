
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Performance monitoring
const reportWebVitals = () => {
  if ('performance' in window && 'getEntriesByType' in window.performance) {
    // Get First Contentful Paint (FCP)
    const paintEntries = performance.getEntriesByType('paint');
    const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    if (fcpEntry) {
      console.log(`FCP: ${fcpEntry.startTime.toFixed(2)}ms`);
    }
    
    // Get Largest Contentful Paint (LCP)
    new PerformanceObserver((entries) => {
      const lcp = entries.getEntries().at(-1);
      if (lcp) {
        console.log(`LCP: ${lcp.startTime.toFixed(2)}ms`);
      }
    }).observe({type: 'largest-contentful-paint', buffered: true});
    
    // Get First Input Delay (FID)
    new PerformanceObserver((entries) => {
      const firstInput = entries.getEntries()[0];
      if (firstInput) {
        // Use type assertion to handle processingStart property
        const inputDelay = (firstInput as any).processingStart - firstInput.startTime;
        console.log(`FID: ${inputDelay}ms`);
      }
    }).observe({type: 'first-input', buffered: true});
  }
};

createRoot(document.getElementById("root")!).render(<App />);

// Report web vitals after render
reportWebVitals();
