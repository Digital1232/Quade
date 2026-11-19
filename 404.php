<?php
// Serves the custom "Page not found" page with a real 404 status.
// .htaccess sends any missing URL on quadengg.com here.
http_response_code(404);
header('Content-Type: text/html; charset=utf-8');
readfile(__DIR__ . '/404/index.html');
