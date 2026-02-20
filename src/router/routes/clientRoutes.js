export const clientRoutes = (lazy) => ( {
  path: '/my',
  component: lazy('ClientPage', 'client'),
  meta: { 
    requiresAuth: true, 
    roles: ["user"] 
  },
  children: [
    { path: '', name: 'ClientHome', component: lazy('UserHomeFeed', 'client') },

    { path: '/book-session', name: 'BookingPage', component: lazy('BookingPage', 'client') },

    { path: '/booking/success/:id', name: 'PuBookingSuccess', component: lazy('BookingSuccess', 'client') },
  ]
});