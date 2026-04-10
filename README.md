# CS-465 Full Stack Development with MEAN

## Travlr Getaways - Full Stack Web Application

### Architecture

In this project I used three different types of frontend development. Static HTML was the starting point in Module 1, which was simple but had no dynamic capabilities. Express with HBS templates added server-side rendering, allowing data from JSON files and later MongoDB to be displayed dynamically. The Angular SPA was the most advanced approach, running entirely on the client side and communicating with the backend only through RESTful API calls. MongoDB was chosen as the backend database because it stores data in a JSON-like document format, which pairs naturally with JavaScript and Node.js throughout the stack.
### Functionality

JSON is a lightweight data format that uses key-value pairs to structure data. Unlike JavaScript, JSON is just a text format and cannot contain functions or methods. JSON ties together the frontend and backend by serving as the common language for data exchange — the backend sends JSON responses through the API, and the frontend receives and displays that data. One major refactor I made was moving from reading trips data from a static JSON file to pulling it dynamically from MongoDB through the RESTful API. Another refactor was separating the trip card rendering into its own Angular component, which made the code reusable and easier to maintain across the application.

### Testing

Testing a full stack application requires testing at multiple levels. I tested all API endpoints, including GET, POST, PUT, and DELETE requests, using Postman. Without authentication, the POST, PUT, and DELETE endpoints return a 401 Unauthorized response, indicating that the JWT middleware is functioning properly. Those endpoints function as expected if you have a valid Bearer Token. The main difficulty with security testing is obtaining a fresh token before each test, since tokens expire after 1 hour.

### Reflection

This course enabled me to gain real full stack development skills for professional applications. I discovered how to create an entire web application from scratch using the MEAN stack, how to manage a database using MongoDB and Mongoose, how to build RESTful APIs, and how to add security with JWT authentication. I gained some practical experience in Git branching, debugging complex errors, and working through real development challenges. These are all skills that employers are looking for in full stack developers, and I feel much more confident in my ability to build and maintain web applications after completing this course.