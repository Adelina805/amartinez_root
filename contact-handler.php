<?php

declare(strict_types=1);

$recipient = 'adelinaballerina1@gmail.com';
$subject = 'New contact form submission: Welcome to Adelina Martinez\'s Timeline at SDSU';

function clean_input(string $value): string
{
    $value = trim($value);
    $value = str_replace(["\r", "\n"], ' ', $value);
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Content-Type: text/plain; charset=UTF-8');
    echo 'Method not allowed.';
    exit;
}

$honeypot = trim((string)($_POST['honeypot'] ?? ''));
if ($honeypot !== '') {
    http_response_code(200);
    header('Content-Type: text/plain; charset=UTF-8');
    echo 'Thank you for your message.';
    exit;
}

$firstName = clean_input((string)($_POST['first_name'] ?? ''));
$lastName = clean_input((string)($_POST['last_name'] ?? ''));
$email = filter_var((string)($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$phone = clean_input((string)($_POST['phone'] ?? ''));
$message = clean_input((string)($_POST['message'] ?? ''));
$customQuestion = clean_input((string)($_POST['custom_question'] ?? ''));

if ($firstName === '' || $lastName === '' || $email === false || $phone === '' || $message === '' || $customQuestion === '') {
    http_response_code(400);
    header('Content-Type: text/plain; charset=UTF-8');
    echo 'Please complete all required fields.';
    exit;
}

$body = "First name: {$firstName}\n";
$body .= "Last name: {$lastName}\n";
$body .= "Email: {$email}\n";
$body .= "Phone: {$phone}\n";
$body .= "Custom question: {$customQuestion}\n\n";
$body .= "Message:\n{$message}\n";

$headers = [];
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: text/plain; charset=UTF-8';
$headers[] = 'From: Adelina Martinez Website <no-reply@localhost>';
$headers[] = 'Reply-To: ' . $email;

$sent = mail($recipient, $subject, $body, implode("\r\n", $headers));

if (!$sent) {
    http_response_code(500);
    header('Content-Type: text/plain; charset=UTF-8');
    echo 'The message could not be sent right now.';
    exit;
}

http_response_code(200);
header('Content-Type: text/plain; charset=UTF-8');
echo 'Thank you for your message! :D';
