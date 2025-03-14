<?php
header('Content-Type: application/json');

// 检查是否是 POST 请求，并且 code 参数存在
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !isset($_POST['code'])) {
    echo json_encode(['success' => false, 'error' => 'Invalid request.']);
    exit;
}

$phpCode = trim($_POST['code']);

if (empty($phpCode)) {
    echo json_encode(['success' => false, 'error' => 'No PHP code provided.']);
    exit;
}

// 检查 shell_exec 是否可用
if (!function_exists('shell_exec')) {
    echo json_encode(['success' => false, 'error' => 'shell_exec() is disabled on this server.']);
    exit;
}

// 创建临时 PHP 文件
$tmpFile = tempnam(sys_get_temp_dir(), 'php_') . '.php';
file_put_contents($tmpFile, $phpCode);

// 运行 PHP 语法检查
$escapedFile = escapeshellarg($tmpFile);
$output = shell_exec("php -l $escapedFile 2>&1");

// 删除临时文件
unlink($tmpFile);

// 解析结果
if (strpos($output, 'No syntax errors detected') !== false) {
    echo json_encode(['success' => true]);
} else {
    // 提取错误行号（如果存在）
    preg_match('/on line (\d+)/', $output, $matches);
    $lineNumber = isset($matches[1]) ? (int)$matches[1] : null;

    echo json_encode([
        'success' => false,
        'error' => trim($output),
        'line_number' => $lineNumber
    ]);
}
?>