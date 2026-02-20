// @src/router/routes/authRoutes.js

export const authRoutes = (lazy) => ({
  path: '/a',
  component: lazy('AuthLayout', 'auth'),
  meta: {
    "guestOnly": true
  },
  children: [

    { 
      path: '', 
      name: 'Login', 
      component: lazy('login', 'auth')
    },

    { 
      path: 'register', 
      name: 'Register', 
      component: lazy('register', 'auth')
    },

    { 
      path: 'forgot', 
      name: 'ForgotPassword', 
      component: lazy('send_reset', 'auth')
    },

    { 
      path: 'reset', 
      name: 'ResetPassword', 
      component: lazy('reset', 'auth')
    },

/*{ 
  path: 'verify', 
  name: 'VerifyEmail', 
  component: lazy('VerifyEmailView', 'auth')
},*/

  ]

});