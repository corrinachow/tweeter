$(function() {
  $("#register").on("click", registerForm);
  $("#login").on("click", loginForm);

  function registerForm(e) {
    e.preventDefault();
    $(".container").prepend(`<h2>Registration form</h2>
      <form method="POST" action="/tweets/register">
      <label for="email">email</label>
      <input type="email" name="email" value="hello@example.com">
      <input type="password" name="password" value="password">
      <input type='submit' value="Register">
  </form>`);
  }

  function loginForm(e) {
    e.preventDefault();
    $(
      ".container"
    ).prepend(`<h2>Login form</h2><form method="POST" action="/tweets/login">
  <label for="email">email</label>
  <input type='email' id="email" name="email" value="example@example.com">

  <label for="pword">password</label>
  <input type='
  password' id="pword" name="password" value="tests">

  <input type='submit' value="login">
</form>`);
  }
});
