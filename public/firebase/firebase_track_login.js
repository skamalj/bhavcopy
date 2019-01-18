      initApp = function() {
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            user.getIdToken().then(function(accessToken) {
              document.getElementById('sign-in-user').textContent = 'Hello '+ displayName+'!';
              document.getElementById('signOut').style.display = "block";
              document.getElementById('signIn').style.display = "none";
            });
          } else {
            // User is signed out.
            document.getElementById('sign-in-user').textContent = 'Hello Guest!';
            document.getElementById('signOut').style.display = "none";
            document.getElementById('signIn').style.display = "block";
          }
        }, function(error) {
          console.log(error);
        });
      };

      window.addEventListener('load', function() {
        initApp()
      });