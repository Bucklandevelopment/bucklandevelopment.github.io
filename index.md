
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">

  <title>BCKDVMNT</title>
  <!--link rel="manifest" href="/manifest.json"-->
  
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
  
  <!--
    <link rel="stylesheet" type="text/css" href="/styles/style.css">
    <link rel="icon" href="images/favicon.ico" type="image/x-icon" />

    <link rel="apple-touch-icon" href="/images/icons/icon-152x152.png">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="apple-mobile-web-app-title" content="Unity PWA Games">
    <meta name="description" content="Unity PWA Games">
    <meta name="theme-color" content="#000" />
  -->

  <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>

  <!--script src="UnityProgress.js"></script>
  <script src="Build/UnityLoader.js"></script>

  
  <script>var gameInstance = UnityLoader.instantiate("gameContainer", "Build/zpowa.json", {onProgress: UnityProgress});</script-->
</head>

<body>

  <h1>BUCKDEVMENT Tecnologies</h1>

  <div class="form-group">
    <label for="exampleInputEmail1">Email address</label>
    <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
    <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
    <button type="button" class="btn btn-primary" onclick="saveToFirebase(email);">Subscribe</button>
  </div>

  <!--header class="header">
      <button id="butInstall" aria-label="Install" hidden></button>
  </!--header>

  <div class="main">
    <div class="webgl-content">
      <div id="gameContainer"></div>
    </div>      
  </div-->


  
  <!--script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
        .then((reg) => {
          console.log('Gracias por usar Thanks', reg);
        });
      });
    }
    </script>
  <script>        
    document.getElementById('gameContainer').style.width = window.outerWidth+ "px";
    document.getElementById('gameContainer').style.height = window.outerHeight + "px";       
  </script>

<script src="scripts/install.js"></script-->


<script src="/scripts/contact.js"></script>




<!-- The core Firebase JS SDK is always required and must be listed first -->
<script src="https://www.gstatic.com/firebasejs/7.6.2/firebase-app.js"></script>

<!-- TODO: Add SDKs for Firebase products that you want to use
     https://firebase.google.com/docs/web/setup#available-libraries -->
<script src="https://www.gstatic.com/firebasejs/7.6.2/firebase-analytics.js"></script>

<script>
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyBaEHqrcTj6caXwMVrLNOno05-30oi-YnE",
    authDomain: "buckdevelopment-970d5.firebaseapp.com",
    databaseURL: "https://buckdevelopment-970d5.firebaseio.com",
    projectId: "buckdevelopment-970d5",
    storageBucket: "buckdevelopment-970d5.appspot.com",
    messagingSenderId: "208427570066",
    appId: "1:208427570066:web:d31a948e0786eb3a68674b",
    measurementId: "G-09Z011W5BY"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
</script>

</body>
</html>

