function saveToFirebase() {
    /*var emailObject = {
        email: email
    };*/

    let email = document.getElementById("exampleInputEmail1");
    console.log(email);
    let suscribe = confirm("Deseas suscribirte a BT con el email" + email);

    suscribe ?
    firebase.database().ref('subscription-entries').push().set(email)
        .then(function(snapshot) {
            success(); // some success method
        }, function(error) {
            console.log('error' + error);
            error(); // some error method
        }) :
    alert("Suscripción cancelada")
}

