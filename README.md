Business Customer Management Web App
A Node.js and MySQL-powered web application designed to help businesses efficiently manage, store, and take ownership of their customer data. It offers a secure, scalable, and customisable database for each business, with seamless data retrieval powered by Google API integration—one of the most efficient solutions to date.

About the Project
Key Features: The app provides a suite of tools for managing and monetizing customer information:
- Customer Database Management: Create and manage a custom database of customers (e.g. contacts, leads, clients) with an intuitive web interface.
  
- Google API Integration: Input or retrieve customer details via Google APIs for convenience (for example, auto-filling address or company info from Google data).
  
- Full CRUD Operations: Perform full Create, Read, Update, Delete operations on customer data. Users can add new customer entries, view/search them, edit details, or remove entries as needed.
  
- Database Monetisation: Analyse and monetise customer databases – for instance, estimate the value of a customer list for business valuation or prepare data for a potential sale of the business. (This concept - - draws from how user bases add value to companies like WhatsApp.)
  
- GDPR Compliance Support: The app includes guidance for GDPR compliance (e.g. features to delete or export customer data), but responsibility for legal compliance rests with the users (the businesses using the app).

Technologies Used
This project was built with a modern web stack and deployment tools:
- Node.js – Backend runtime (with Express.js for the web server and RESTful routes).
- MySQL – Relational database for storing customer records (structured data storage).
- HTML & CSS – Front-end interface structure and styling (for the client-facing UI).
- Google APIs – Used for enhancing data input (e.g., retrieving customer info or auto-completing addresses via Google’s services).
- Ngrok – Utility for exposing the local development server to the internet (useful for testing webhooks or sharing a demo).
- DigitalOcean – Cloud hosting platform used to deploy the application (DigitalOcean Droplet running Node.js and MySQL for the live demo).


Test the application live here! - https://client-management.online

Repository Structure
Project2024/
- Index.js # Main backend logic
- Views/   # Html pages
- Route/   # Application routes


Why I Chose This Project
- I chose to create this project independently because I saw real potential in how valuable customer data can be for businesses. In today’s world, even companies that don’t sell physical products – like WhatsApp   can be valued in the billions purely because of their user base. This showed me how powerful structured customer information can be when it comes to pricing, growth, and long-term value. I wanted to explore      that idea further by building a tool that helps smaller businesses manage and understand their own customer data in a simple, practical way whilst also getting to know Node.js and the npm.

GDPR & Compliance
Each business is fully responsible for the GDPR compliance of the data they collect. The app does not enforce regulations but provides a structured way to handle customer data securely.
