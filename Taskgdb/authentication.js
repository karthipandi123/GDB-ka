$( "#ContactForm1" ).validate({
    
  rules: {
            
            email: {
                required: true,
                email: true
            },
          password: {
            required: true,
              minlength:6
          } ,

            messages: {
                "email": {required: "Email is required!"},
                'password': {required: 'Password is required!'}

               
            }
    

  }
});