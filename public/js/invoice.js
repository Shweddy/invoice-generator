document.addEventListener('DOMContentLoaded', function() {
  // Item counter for dynamic item rows
  let itemCounter = 1;
  
  // Set default date to today
  const today = new Date();
  const dateInput = document.getElementById('issuedDateInput');
  dateInput.valueAsDate = today;
  
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
        <input type="text" class="form-control" name="itemCpn" placeholder="CPN">
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
    
    // Company info
    document.getElementById('companyName').textContent = document.getElementById('sellerName').value;
    document.getElementById('companyAddress').textContent = document.getElementById('sellerAddress').value;
    document.getElementById('companyTaxId').textContent = document.getElementById('sellerTaxId').value;
    
    // Customer info
    document.getElementById('customerName').textContent = document.getElementById('buyerName').value;
    document.getElementById('customerAddress').textContent = document.getElementById('buyerAddress').value;
    document.getElementById('customerTaxId').textContent = document.getElementById('buyerTaxId').value;
    
    // Invoice details
    document.getElementById('invoiceNo').textContent = document.getElementById('invoiceNumber').value;
    document.getElementById('poNo').textContent = document.getElementById('poNumber').value;
    
    // Generate invoice items
    const itemsBody = document.getElementById('itemsBody');
    itemsBody.innerHTML = '';
    
    document.querySelectorAll('.item-row').forEach((row, index) => {
      const tr = document.createElement('tr');
      
      const itemNumber = row.querySelector('[name="itemNumber"]').value;
      const itemCpn = row.querySelector('[name="itemCpn"]').value;
      const itemDescription = row.querySelector('[name="itemDescription"]').value;
      const itemQuantity = row.querySelector('[name="itemQuantity"]').value;
      const itemPrice = row.querySelector('[name="itemPrice"]').value;
      const itemAmount = row.querySelector('[name="itemAmount"]').value;
      
      tr.innerHTML = `
        <td>${itemNumber}</td>
        <td>${itemCpn}</td>
        <td>${itemDescription}</td>
        <td>${itemQuantity}</td>
        <td>${parseFloat(itemPrice).toFixed(2)}</td>
        <td>${parseFloat(itemAmount).toFixed(2)}</td>
      `;
      
      itemsBody.appendChild(tr);
    });
    
    // Update totals in preview
    document.getElementById('previewSubtotal').textContent = document.getElementById('subtotal').value;
    document.getElementById('previewVat').textContent = document.getElementById('vatAmount').value;
    document.getElementById('previewGrandTotal').textContent = document.getElementById('grandTotal').value;
  });
  
  // Download PDF
  document.getElementById('downloadPdf').addEventListener('click', function() {
    const element = document.getElementById('invoicePreview');
    const buttons = element.querySelectorAll('.no-print');
    
    // Hide buttons temporarily
    buttons.forEach(btn => {
      btn.style.display = 'none';
    });
    
    // Generate PDF
    html2canvas(element).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('invoice.pdf');
      
      // Show buttons again
      buttons.forEach(btn => {
        btn.style.display = 'block';
      });
    });
  });
  
  // Back to form
  document.getElementById('backToForm').addEventListener('click', function() {
    document.getElementById('invoiceForm').classList.remove('d-none');
    document.getElementById('invoicePreview').classList.add('d-none');
  });
  
  // Print invoice
  document.getElementById('printInvoice').addEventListener('click', function() {
    window.print();
  });
}); 