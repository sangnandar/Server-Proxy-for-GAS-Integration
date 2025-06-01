# Server Proxy for Google Apps Script Integration

Calling a Google Apps Script web app directly from the frontend without authentication (OAuth) introduces a security risk, as the endpoint may be exposed to the public. This project demonstrates how to mitigate that risk by introducing a **server-side proxy layer**, which hides the direct URL of the Apps Script endpoint and acts as a secure intermediary.

This example is implemented using **PHP** as the backend, and serves as a blueprint for building safer integrations between frontend applications and Google Apps Script backends.


## ⚙️ How It Works

Instead of allowing the frontend to access the Google Apps Script web app directly, the request is routed through a PHP-based server proxy. The proxy securely forwards the request to the Apps Script endpoint, receives the response, and then sends it back to the frontend. This pattern improves security by:

- Hiding the actual Apps Script URL from the browser
- Adding an optional layer of validation and access control in the proxy
- Centralizing request/response logging and error handling


## 📁 PHP Side (Frontend + Server Proxy)

This part is responsible for rendering the frontend and securely making the API call to Google Apps Script.

### `php/index.php`
The entry point of the web app. It renders an HTML page that will eventually display data retrieved from Google Sheets via Apps Script. It includes JavaScript code (`gsheets.js`) that handles user interaction and communicates with the proxy.

### `php/gsheets.js`
This JavaScript file is responsible for calling the `api-proxy.php` endpoint. It sends AJAX requests and processes the JSON response to render the content dynamically on the page.

### `php/api-proxy.php`
This is the **core server proxy**. It receives requests from the frontend, builds the corresponding HTTP request to the Apps Script web app, and forwards the result back to the browser. You can also add custom logic here to:
- Validate incoming requests
- Add API keys or headers if needed
- Filter or format the returned data


## 📄 Apps Script Side (Backend)

This part runs inside Google Apps Script and serves as the data provider.

### `config.gs`
Holds configuration constants and helpers used by the event dispatcher. This makes the system modular and easier to scale or customize.

🧩 Related: [Event Dispatcher in Apps Script](https://github.com/sangnandar/Event-Dispatcher-in-Apps-Script)

### `triggers.gs`
This script is the HTTP entry point in Apps Script. It defines the `doGet(e)` or `doPost(e)` function which Google Web Apps use as a handler for HTTP requests. It reads the request, passes it to the event dispatcher, and returns the appropriate response.

### `event-handlers.gs`
This file contains the logic for specific request types. Based on the dispatched action (e.g., `getSheetData`, `searchByKeyword`, etc.), the appropriate function is called to fetch data from Google Sheets or perform other operations.


## 🔁 Workflow

```mermaid
flowchart TD
  A[index.php] --> B[Server Proxy]
  B -->  C[Call Apps Script web app]
  C --> B
  B --> |Return data| A

  %% A --> D
  C ~~~ D[ ]:::title ~~~ E[ ] 
  A --> |using data| E[Render html]

  classDef title fill:none,stroke:none,color:black,font-size:20px,font-weight:bold;
````

1. `index.php` is loaded in the browser.
2. It triggers JavaScript (`gsheets.js`) to request data.
3. The request goes to the proxy (`api-proxy.php`) instead of the Apps Script directly.
4. The proxy sends the request to the Apps Script web app.
5. Apps Script processes the request using `triggers.gs` and `event-handlers.gs`.
6. The response travels back to the proxy, then to the browser.
7. The frontend renders the data into HTML.


## 🚀 Deploying the Apps Script Web App

To make the Apps Script backend available for your PHP proxy to access, you need to deploy it as a Web App.

📎 Official Guide: [Google Developers – Deploy a script as a web app](https://developers.google.com/apps-script/guides/web)


## ✅ Use Case

This architecture is particularly useful for:

* Protecting Google Apps Script endpoints from being exposed publicly
* Integrating Google Sheets or other Google Workspace services with a custom frontend
* Building hybrid systems with PHP backends and Apps Script automation
