//Register

let registerForm = document.getElementById('registerForm');

if(registerForm){
    registerForm.addEventListener('submit', function(e){
        e.preventDefault();

        let name = document.getElementById('name').value;
        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;
        let confirmPassword = document.getElementById('confirmPassword').value;
         
        let msg = document.getElementById('msg');

        if( name === '' || email === '' || password === '' || confirmPassword === ''){
            msg.textContent = 'Please fill all fields';
            return;
        }

        if(password !== confirmPassword){
            msg.textContent = 'Passwords do not match';
            return;
        }
        let user = {
            name: name,
            email: email,
            password: password
        };

        localStorage.setItem('user', JSON.stringify(user));
        msg.textContent = 'Registration successful!';
            // Add logic to handle user registration here
    });
}


//Login
let loginForm = document.getElementById('loginForm');

if(loginForm){
    loginForm.addEventListener('submit', function(e){
        e.preventDefault();

        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;
        
        let storedUser = localStorage.getItem('user');
        

        if(!storedUser){
            msg.textContent = 'No user found. Please register first.';
            return;
        }

        let user = JSON.parse(storedUser);

        if(user.password === password){
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            window.location.href = 'dashboard.html';
        } else {
            msg.textContent = 'Invalid  password';

        }
    });
}

function bookHostel(hostelName) {
  const confirmBooking = confirm(`Do you want to book ${hostelName}?`);

  if (confirmBooking) {
    alert(`Successfully booked ${hostelName}!`);

    // Update current hostel dynamically
    document.querySelector(".current-hostel .card").innerHTML = `
      <h3>${hostelName}</h3>
      <p>Location: Updated</p>
      <p>Room: Assigned Soon</p>
      <p>Status: Active</p>
    `;
  }
}