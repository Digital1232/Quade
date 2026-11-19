<?php
/**
 * QUADE — contact / request-for-quote form handler.
 * Replaces the Divi contact form. Needs PHP's mail() on the host
 * (standard on cPanel / most shared hosting).
 */

// ---- Settings ------------------------------------------------------------
$TO_EMAIL   = 'admin@quadengg.com';          // where enquiries are delivered
$FROM_EMAIL = 'no-reply@quadengg.com';       // must be an address on your domain
$SUBJECT    = 'New message from QUADE website';
// --------------------------------------------------------------------------

header('Content-Type: application/json; charset=utf-8');

function respond($ok, $error = null) {
    if (!$ok) http_response_code(400);
    echo json_encode($error ? ['ok' => $ok, 'error' => $error] : ['ok' => $ok]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') respond(false, 'Invalid request.');

// Honeypot: real visitors never fill this hidden field.
if (!empty($_POST['website'])) respond(true);

$clean = function ($key) {
    $v = isset($_POST[$key]) ? trim((string) $_POST[$key]) : '';
    return str_replace(["\r", "\n", "%0a", "%0d"], ' ', $v);
};

$name     = $clean('name');
$email    = $clean('email');
$phone    = $clean('phone');
$services = $clean('services');
$message  = isset($_POST['message']) ? trim((string) $_POST['message']) : '';
$page     = $clean('page');

if ($name === '' || $email === '' || $phone === '' || $services === '' || $message === '') {
    respond(false, 'Please fill in all fields.');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) respond(false, 'Please enter a valid email address.');
if (!preg_match('/^[0-9\s\-]{10,12}$/', $phone)) respond(false, 'Phone: only numbers allowed, 10–12 characters.');

$allowed = ['Architectural Millwork', 'Laboratory Detailing', 'Quantity Take-offs', 'Custom Millwork Design'];
if (!in_array($services, $allowed, true)) respond(false, 'Please choose a service.');

$body  = "Name: $name\n";
$body .= "Email: $email\n";
$body .= "Phone: $phone\n";
$body .= "Services: $services\n";
$body .= "Page: $page\n\n";
$body .= "Message:\n$message\n";

$headers  = "From: QUADE Website <$FROM_EMAIL>\r\n";
$headers .= "Reply-To: $name <$email>\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$sent = @mail($TO_EMAIL, $SUBJECT, $body, $headers, '-f' . $FROM_EMAIL);
respond((bool) $sent, $sent ? null : 'Sorry, your message could not be sent. Please email admin@quadengg.com.');
