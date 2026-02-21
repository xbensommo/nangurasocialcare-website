export const clientRoutes = (lazy) => ( {
  path: '/my',
  component: lazy('ClientPage', 'client'),
  meta: { 
    requiresAuth: true, 
    roles: ["user"] 
  },
  children: [
    { path: '', name: 'ClientHome', component: lazy('UserHomeFeed', 'client') },

    { path: 'book-session', name: 'BookingPage', component: lazy('BookingPage', 'client') },

    { path: 'book-next-session', name: 'AuthedBooking', component: lazy('AuthedBooking', 'client') },

    { path: 'profile', name: 'Profile ', component: lazy('ProfilePage', 'client') },

    { path: 'booking/success/:id', name: 'PuBookingSuccess', component: lazy('BookingSuccess', 'client') },
  ]
});