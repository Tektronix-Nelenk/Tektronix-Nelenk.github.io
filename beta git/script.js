// script.js
function handleLogin() {
  const passwordInput = document.getElementById('password').value;

  // 設置正確的密碼
  const correctPassword = 'TOKEN-@developer_001'; // 直接使用密碼進行比較

  if (passwordInput === correctPassword) {
    // 跳轉到 home.html
    window.location.href = 'home/home.html';
  } else {
    alert('Incorrect password.');
  }
}