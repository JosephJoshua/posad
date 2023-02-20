<?php

require 'logic.php';

if (isset($_POST['reigster'])) {
  if (registrasi($_POST) > 0) {
    echo "<script>alert('user baru berhasil ditambahkan!')</script>";
  } else {
    echo mysqli_error($db);
  }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <h1>Halaman Registrasi</h1>
  <form action="" method="post">
    <ul>
      <li>
        <label for="username">Username:</label>
        <input type="text" name="username" id="username">
      </li>
      <li>
        <label for="password">Password:</label>
        <input type="password" name="password" id="password">
      </li>
      <li>
        <label for="password_confirmation">Konfirmasi Password:</label>
        <input type="password" name="password_confirmation" id="password_confirmation">
      </li>

      <li>
        <button type="submit" name="register">Register</button>
      </li>
    </ul>
  </form>
</body>
</html>
