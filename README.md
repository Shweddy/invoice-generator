# Invoice Generator

A web application for generating and printing tax invoices based on a Thai invoice template.

## Features

- Create invoices with custom company and customer information
- Add and remove invoice items dynamically
- Automatic calculation of subtotals, VAT, and grand totals
- Preview invoice before printing or downloading
- Download invoice as PDF
- Print invoice directly
- Company logo display
- Environment variable configuration

## Setup

1. Clone the repository
   ```
   git clone https://github.com/your-username/invoice-generator.git
   cd invoice-generator
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`:
     ```
     cp .env.example .env
     ```
   - Edit the `.env` file with your company information

4. Add your company logo:
   - Place your logo image in the `public/uploads` directory
   - The most recently modified image will be used as the company logo

5. Start the server:
   ```
   npm start
   ```
   
   For development with auto-restart:
   ```
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:3000`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| COMPANY_NAME | Your company name | Your Company Name |
| COMPANY_ADDRESS | Your company address | Company Address |
| COMPANY_EMAIL | Company email | company@example.com |
| COMPANY_TAX_ID | Company tax ID | 0000000000000 |
| DEFAULT_CUSTOMER_CODE | Default customer code | C001 |

## Technologies Used

- Node.js
- Express.js
- EJS Templates
- Bootstrap 5
- jsPDF
- html2canvas
- dotenv for environment variables

## Structure

- `index.js` - Main server file
- `views/` - EJS templates
- `public/` - Static assets (JS, CSS)
  - `public/js/invoice.js` - Client-side invoice generation
  - `public/css/styles.css` - Custom styling
  - `public/uploads/` - Directory for storing logo images

## Git Repository

This project is configured for Git with proper `.gitignore` settings. The following files are excluded from version control:

- `node_modules/` - Node.js dependencies
- `.env` - Environment variables with sensitive information  
- `public/uploads/*` - User-uploaded logo files

## License

ISC 