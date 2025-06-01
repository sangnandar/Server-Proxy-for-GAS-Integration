<?php

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST' ||
    ($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '') !== 'XMLHttpRequest') {
  http_response_code(403); // log forbidden attempts
  header('Location: /'); // redirect to root
  exit;
}

header('Content-Type: application/json');

// Load and parse JSON input
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
  http_response_code(400);
  echo json_encode([
    'success' => false,
    'source'  => 'proxy',
    'message' => 'Invalid JSON input',
    'data'    => null
  ]);
  exit;
}

// Append API Key
$payload = [
  'apiKey' => GAS_API_KEY,
  'task' => 'getTheatreEvent',
  'data' => $input
];

// Prepare cURL for POST request
$apiUrl = GAS_API_URL;

$ch = curl_init($apiUrl);
curl_setopt_array($ch, [
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_POST => true,
  CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
  CURLOPT_POSTFIELDS => json_encode($payload)
]);

$response = curl_exec($ch);
$error    = curl_error($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Adjust response code because cURL might fails silently and lead to $httpCode = 0
http_response_code($httpCode ?: 500);

// Pass through response or return proxy error
if ($error) {
  echo json_encode([
    'success' => false,
    'source'  => 'proxy',
    'message' => $error,
    'data'    => null
  ]);
} else {
  echo $response; // no need for json_encode() because Apps Script already return JSON
}
