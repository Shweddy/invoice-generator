document.addEventListener('DOMContentLoaded', function() {
  // Item counter for dynamic item rows
  let itemCounter = 1;
  
  // Set default date to today
  const today = new Date();
  const dateInput = document.getElementById('issuedDateInput');
  dateInput.valueAsDate = today;
  
  // Format number with thousand separator
  function formatNumber(num) {
    return parseFloat(num).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
  
  // Add item row
  document.getElementById('addItem').addEventListener('click', function() {
    itemCounter++;
    const itemsContainer = document.getElementById('itemsContainer');
    
    const newRow = document.createElement('div');
    newRow.className = 'row item-row mb-3';
    newRow.innerHTML = `
      <div class="col-1">
        <input type="text" class="form-control" name="itemNumber" value="${itemCounter}" readonly>
      </div>
      <div class="col-2">
        <input type="text" class="form-control" name="itemCpn" placeholder="Part No.">
      </div>
      <div class="col-4">
        <input type="text" class="form-control" name="itemDescription" placeholder="Description">
      </div>
      <div class="col-1">
        <input type="number" class="form-control quantity" name="itemQuantity" placeholder="Qty" min="1" value="1">
      </div>
      <div class="col-2">
        <input type="number" class="form-control price" name="itemPrice" placeholder="Unit Price" min="0" step="0.01">
      </div>
      <div class="col-2">
        <input type="number" class="form-control amount" name="itemAmount" placeholder="Amount" readonly>
      </div>
    `;
    
    itemsContainer.appendChild(newRow);
    
    // Add event listeners to new inputs
    attachInputListeners(newRow);
  });
  
  // Remove item row
  document.getElementById('removeItem').addEventListener('click', function() {
    if (itemCounter > 1) {
      const itemsContainer = document.getElementById('itemsContainer');
      itemsContainer.removeChild(itemsContainer.lastChild);
      itemCounter--;
    }
  });
  
  // Calculate amounts and totals
  function calculateAmounts() {
    let subtotal = 0;
    
    // Calculate amount for each item
    document.querySelectorAll('.item-row').forEach(row => {
      const quantity = parseFloat(row.querySelector('.quantity').value) || 0;
      const price = parseFloat(row.querySelector('.price').value) || 0;
      const amount = quantity * price;
      
      row.querySelector('.amount').value = amount.toFixed(2);
      subtotal += amount;
    });
    
    // Update totals
    document.getElementById('subtotal').value = subtotal.toFixed(2);
    
    const vatRate = parseFloat(document.getElementById('vatRate').value) || 0;
    const vatAmount = subtotal * (vatRate / 100);
    document.getElementById('vatAmount').value = vatAmount.toFixed(2);
    
    const grandTotal = subtotal + vatAmount;
    document.getElementById('grandTotal').value = grandTotal.toFixed(2);
  }
  
  // Attach input event listeners
  function attachInputListeners(container) {
    container.querySelectorAll('.quantity, .price').forEach(input => {
      input.addEventListener('input', calculateAmounts);
    });
  }
  
  // Initialize event listeners for existing inputs
  document.querySelectorAll('.item-row').forEach(row => {
    attachInputListeners(row);
  });
  
  // VAT rate change listener
  document.getElementById('vatRate').addEventListener('input', calculateAmounts);
  
  // Generate Invoice
  document.getElementById('generateInvoice').addEventListener('click', function() {
    // Show the invoice preview
    document.getElementById('invoiceForm').classList.add('d-none');
    document.getElementById('invoicePreview').classList.remove('d-none');
    
    // Format and populate the issued date from the date picker
    const issuedDate = new Date(document.getElementById('issuedDateInput').value);
    const formattedDate = issuedDate.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: '2-digit'
    });
    document.getElementById('issuedDate').textContent = formattedDate;
    document.getElementById('issuedDateCopy').textContent = formattedDate;
    
    // Company info - no longer need to set this as it's hardcoded in the HTML
    // const companyName = document.getElementById('sellerName').value;
    // const companyAddress = document.getElementById('sellerAddress').value;
    // const companyTaxId = document.getElementById('sellerTaxId').value;
    // 
    // document.getElementById('companyName').textContent = companyName;
    // document.getElementById('companyAddress').textContent = companyAddress;
    // document.getElementById('companyTaxId').textContent = companyTaxId;
    // 
    // document.getElementById('companyNameCopy').textContent = companyName;
    // document.getElementById('companyAddressCopy').textContent = companyAddress;
    // document.getElementById('companyTaxIdCopy').textContent = companyTaxId;
    
    // Customer info
    const customerName = document.getElementById('buyerName').value;
    const customerAddress = document.getElementById('buyerAddress').value;
    const customerTaxId = document.getElementById('buyerTaxId').value;
    
    document.getElementById('customerName').textContent = customerName;
    document.getElementById('customerAddress').textContent = customerAddress;
    document.getElementById('customerTaxId').textContent = customerTaxId;
    
    document.getElementById('customerNameCopy').textContent = customerName;
    document.getElementById('customerAddressCopy').textContent = customerAddress;
    document.getElementById('customerTaxIdCopy').textContent = customerTaxId;
    
    // Invoice details
    const invoiceNo = document.getElementById('invoiceNumber').value;
    const poNo = document.getElementById('poNumber').value;
    
    document.getElementById('invoiceNo').textContent = invoiceNo;
    document.getElementById('poNo').textContent = poNo;
    
    document.getElementById('invoiceNoCopy').textContent = invoiceNo;
    document.getElementById('poNoCopy').textContent = poNo;
    
    // Generate invoice items
    const itemsBody = document.getElementById('itemsBody');
    const itemsBodyCopy = document.getElementById('itemsBodyCopy');
    itemsBody.innerHTML = '';
    itemsBodyCopy.innerHTML = '';
    
    document.querySelectorAll('.item-row').forEach((row, index) => {
      const itemNumber = row.querySelector('[name="itemNumber"]').value;
      const itemCpn = row.querySelector('[name="itemCpn"]').value;
      const itemDescription = row.querySelector('[name="itemDescription"]').value;
      const itemQuantity = row.querySelector('[name="itemQuantity"]').value;
      const itemPrice = parseFloat(row.querySelector('[name="itemPrice"]').value) || 0;
      const itemAmount = parseFloat(row.querySelector('[name="itemAmount"]').value) || 0;
      
      // Create row for original invoice
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${itemNumber}</td>
        <td>${itemCpn}</td>
        <td>${itemDescription}</td>
        <td>${itemQuantity}</td>
        <td>${formatNumber(itemPrice)}</td>
        <td>${formatNumber(itemAmount)}</td>
      `;
      itemsBody.appendChild(tr);
      
      // Create duplicate row for copy invoice
      const trCopy = document.createElement('tr');
      trCopy.innerHTML = tr.innerHTML;
      itemsBodyCopy.appendChild(trCopy);
    });
    
    // Update totals in preview with formatted numbers
    const subtotal = parseFloat(document.getElementById('subtotal').value) || 0;
    const vatAmount = parseFloat(document.getElementById('vatAmount').value) || 0;
    const grandTotal = parseFloat(document.getElementById('grandTotal').value) || 0;
    
    // Set totals for original
    document.getElementById('previewSubtotal').textContent = formatNumber(subtotal);
    document.getElementById('previewVat').textContent = formatNumber(vatAmount);
    document.getElementById('previewGrandTotal').textContent = formatNumber(grandTotal);
    
    // Set totals for copy
    document.getElementById('previewSubtotalCopy').textContent = formatNumber(subtotal);
    document.getElementById('previewVatCopy').textContent = formatNumber(vatAmount);
    document.getElementById('previewGrandTotalCopy').textContent = formatNumber(grandTotal);
  });
  
  // Download PDF
  document.getElementById('downloadPdf').addEventListener('click', function() {
    console.log('PDF download initiated');
    
    try {
      // Create temporary container to make a clean copy of the invoice for PDF generation
      const tempContainer = document.createElement('div');
      tempContainer.className = 'pdf-container';
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      document.body.appendChild(tempContainer);
      
      // Clone the original invoice without any event listeners
      const originalInvoice = document.querySelector('.original-invoice').cloneNode(true);
      
      // Remove all script tags and elements with certain classes
      originalInvoice.querySelectorAll('script, .no-print, .browser-info').forEach(el => {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
      
      // Append the clean invoice to the temp container
      tempContainer.appendChild(originalInvoice);
      
      // Clone the copy invoice without any event listeners
      const copyInvoice = document.querySelector('.copy-invoice').cloneNode(true);
      
      // Remove all script tags and elements with certain classes from copy
      copyInvoice.querySelectorAll('script, .no-print, .browser-info').forEach(el => {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
      
      // Make copy invoice visible in the temp container
      copyInvoice.style.display = 'block';
      tempContainer.appendChild(copyInvoice);
      
      // Process all text nodes to remove any localhost references
      const walker = document.createTreeWalker(
        tempContainer,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );
      
      const textsToClean = [];
      let node;
      while (node = walker.nextNode()) {
        if (node.nodeValue && node.nodeValue.includes('localhost:3000')) {
          textsToClean.push(node);
        }
      }
      
      textsToClean.forEach(node => {
        node.nodeValue = "";
      });
      
      console.log('Capturing clean invoice');
      
      // Generate PDF from the clean temp container
      html2canvas(originalInvoice, {
        scale: 2,  // Higher quality
        useCORS: true,
        logging: false,
        removeContainer: false
      }).then(function(canvas) {
        console.log('Original invoice captured successfully');
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const pageHeight = 295;  
        const imgHeight = canvas.height * imgWidth / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        
        // Capture the copy invoice
        html2canvas(copyInvoice, {
          scale: 2,
          useCORS: true,
          logging: false,
          removeContainer: false
        }).then(function(copyCanvas) {
          console.log('Copy invoice captured successfully');
          
          const copyImgData = copyCanvas.toDataURL('image/png');
          pdf.addPage();
          pdf.addImage(copyImgData, 'PNG', 0, 0, imgWidth, imgHeight);
          
          // Save the PDF with both pages
          pdf.save('invoice.pdf');
          console.log('PDF saved successfully');
          
          // Clean up
          if (tempContainer && tempContainer.parentNode) {
            tempContainer.parentNode.removeChild(tempContainer);
          }
        }).catch(function(err) {
          console.error('Error capturing copy invoice:', err);
          // Try to save with just the first page
          pdf.save('invoice-original-only.pdf');
          
          // Clean up
          if (tempContainer && tempContainer.parentNode) {
            tempContainer.parentNode.removeChild(tempContainer);
          }
        });
      }).catch(function(err) {
        console.error('Error capturing original invoice:', err);
        alert('Could not generate PDF. Please try using the "Print to PDF" button instead.');
        
        // Clean up
        if (tempContainer && tempContainer.parentNode) {
          tempContainer.parentNode.removeChild(tempContainer);
        }
      });
    } catch (err) {
      console.error('Error in PDF generation process:', err);
      alert('Could not generate PDF. Please try using the "Print to PDF" button instead.');
    }
  });
  
  // Back to form
  document.getElementById('backToForm').addEventListener('click', function() {
    document.getElementById('invoiceForm').classList.remove('d-none');
    document.getElementById('invoicePreview').classList.add('d-none');
  });
  
  // Print Original only
  document.getElementById('printOriginal').addEventListener('click', function() {
    const copyInvoice = document.querySelector('.copy-invoice');
    const pageBreak = document.querySelector('.page-break');
    
    // Hide the copy and page break
    copyInvoice.style.display = 'none';
    pageBreak.style.display = 'none';
    
    // Print
    window.print();
    
    // Restore display properties after printing
    setTimeout(function() {
      pageBreak.style.display = 'block';
    }, 500);
  });
  
  // Print both invoices
  document.getElementById('printInvoice').addEventListener('click', function() {
    // Show the copy for printing
    document.querySelector('.copy-invoice').style.display = 'block';
    window.print();
  });
  
  // Fallback PDF download method
  document.getElementById('fallbackPdf').addEventListener('click', function() {
    alert('Please use your browser\'s "Save as PDF" option in the print dialog that will open next.');
    
    // Show the copy for printing
    document.querySelector('.copy-invoice').style.display = 'block';
    
    // Print which should allow saving as PDF
    window.print();
    
    // Guidance alert after print dialog
    setTimeout(function() {
      // Hide the copy again
      document.querySelector('.copy-invoice').style.display = 'none';
    }, 1000);
  });
}); 