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
  // Find the logo file to use
  let logoPath = '';
  
  // Check for logo files in uploads directory
  const uploadDir = path.join(__dirname, 'public/uploads');
  try {
    const files = fs.readdirSync(uploadDir);
    // Find image files
    const logoFiles = files.filter(file => 
      file.match(/\.(jpg|jpeg|png|gif)$/i) && 
      !file.startsWith('.')  // Skip hidden files
    ).map(fileName => {
      const filePath = path.join(uploadDir, fileName);
      return {
        name: fileName,
        path: '/uploads/' + fileName,
        mtime: fs.statSync(filePath).mtime.getTime()
      };
    });
    
    // Sort by modification time (newest first)
    logoFiles.sort((a, b) => b.mtime - a.mtime);
    
    if (logoFiles.length > 0) {
      logoPath = logoFiles[0].path;
      console.log('Using logo: ' + logoPath);
    } else {
      // Default placeholder if no logo found
      logoPath = 'https://via.placeholder.com/150x80?text=YONGGUI+LOGO';
    }
  } catch (err) {
    console.error('Error reading uploads directory:', err);
    logoPath = 'https://via.placeholder.com/150x80?text=YONGGUI+LOGO';
  }
  
  // Get company information from environment variables
  const companyInfo = {
    name: process.env.COMPANY_NAME || 'YONGGUI ELECTRIC (THAILAND) CO.,LTD.',
    address: process.env.COMPANY_ADDRESS || '7/226, Moo 6, Soi Pornprapha (Amata City Industrial Estate, Rayong)\nMap Yang Phon Sub-district, Pluak Daeng District, Rayong Province 21140',
    email: process.env.COMPANY_EMAIL || 'aiyadarojwisitphat@yonggui.com',
    phone: process.env.COMPANY_PHONE || 'Tel : 0952499128',
    taxId: process.env.COMPANY_TAX_ID || '0215567005375',
    defaultCustomerCode: process.env.DEFAULT_CUSTOMER_CODE || 'SI001'
  };
  
  res.render('index', { 
    logoPath: logoPath,
    companyInfo: companyInfo
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}); 