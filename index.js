require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => {
  // Always use companylogo.jpg as the logo file
  let logoPath = '/uploads/companylogo.jpg';
  let absoluteLogoPath = '';
  
  // Create data URL for embedded logo
  const logoFile = path.join(__dirname, 'public', logoPath);
  try {
    if (fs.existsSync(logoFile)) {
      // Convert logo to base64 for embedding in HTML/PDF
      const logoData = fs.readFileSync(logoFile);
      const logoBase64 = Buffer.from(logoData).toString('base64');
      const logoType = logoPath.split('.').pop().toLowerCase();
      absoluteLogoPath = `data:image/${logoType === 'jpg' ? 'jpeg' : logoType};base64,${logoBase64}`;
      
      console.log('Using logo: ' + logoPath);
    } else {
      // Default placeholder if logo file not found
      logoPath = 'https://via.placeholder.com/150x80?text=YONGGUI+LOGO';
      absoluteLogoPath = logoPath;
      console.log('Logo file not found, using placeholder');
    }
  } catch (err) {
    console.error('Error reading logo file:', err);
    logoPath = 'https://via.placeholder.com/150x80?text=YONGGUI+LOGO';
    absoluteLogoPath = logoPath;
  }
  
  // Get company information from environment variables
  const companyInfo = {
    name: process.env.COMPANY_NAME || 'YONGGUI ELECTRIC (THAILAND) CO.,LTD.',
    address: process.env.COMPANY_ADDRESS || '7/226, Moo 6, Soi Pornprapha (Amata City Industrial Estate, Rayong)\nMap Yang Phon Sub-district, Pluak Daeng District, Rayong Province 21140',
    email: process.env.COMPANY_EMAIL || 'apichatrojwisitphat@yonggui.com',
    phone: process.env.COMPANY_PHONE || 'Tel : 0952499128',
    taxId: process.env.COMPANY_TAX_ID || '0215567005375',
    defaultCustomerCode: process.env.DEFAULT_CUSTOMER_CODE || 'SI001'
  };
  
  res.render('index', { 
    logoPath: logoPath,
    absoluteLogoPath: absoluteLogoPath,
    companyInfo: companyInfo
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}); 