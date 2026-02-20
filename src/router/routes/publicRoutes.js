// @src/router/routes/publicRoutes.js

export const publicRoutes = (lazy) => ({
		path: '/',
		component: lazy('LandingPage'),
		meta: {
			title: 'Psychologist in Namibia | Nangura Social Care',
			requiresAuth: false, 
			guestOnly: true
		},

		children: [
			{
				path: '',
				name: 'PublicPage',
				component: lazy('PublicPage', 'public'),
			},
			{
				path: '/booking-success',
				name: 'Success',
				component: lazy('BookingSuccess', 'client'),
			},
			{
				path: '/quick',
				name: 'quick',
				component: lazy('QuickLog', 'admin'),
			},
			{ path: '/session', name: 'BooSPage', component: lazy('AdminSchedule', 'admin') },
			{ path: '/booking', name: 'ClientBookingPage', component: lazy('BookingPage', 'client') },

			{ path: '/booking/success/:id', name: 'PublicBookingSuccess', component: lazy('BookingSuccess', 'client') },
			{ path: '/rack', name: 'Bssasda', component: lazy('ClientJournal', 'client') },
			{
				path: '/del',
				name: 'del',
				component: lazy('WellnessPulse', 'client'),
			},
			{
				path: 'about',
				name: 'AboutUs',
				component: lazy('About', 'public'),
			},
			/*{
				path: 'booking',
				name: 'BookingWizard',
				component: lazy('BookingWizard', 'public'),
			},
*/
			{
				path: 'fees',
				name: 'PricingView',
				component: lazy('PricingView', 'public'),
			},

			{ 
		      path: 'users', 
		      name: 'adfasf', 
		      component: lazy('Clients', 'admin'),
		      meta: {"title":"Clients"}
		    },
			/*{

				path: 'journal',
				name: 'journalresources',
				component: lazy('JournalView', 'public'),
			},*/
			{

				path: 'faq',
				name: 'faq',
				component: lazy('FaqView', 'public'),
			},

			{

				path: 'legal',
				name: 'legal',
				component: lazy('LegalView', 'public'),
			},

			{

				path: 'crisis',
				name: 'crisis',
				component: lazy('CrisisView', 'public'),
			},

			{
				path: 'contact',
				name: 'ContactUs',
				component: lazy('ContactView', 'public'),
				
			},

			{
			    path: 'services',
			    name: 'ServicesOverview',
			    component: lazy('ServiceOverview', 'services')
			 },

			{
			    path: 'services/:slug',
			    name: 'ServiceDetail',
			    component: lazy('ServiceDetails', 'services')
			  }

			/*

			// --------------------
			// SERVICES PARENT
			// --------------------

			{
				path: 'services',
				name: 'Services',
				component: lazy('ServicesView', 'public'),
							},

			// --------------------
			// SERVICE PAGES
			// --------------------

			{
				path: 'services/individual-counselling',
				name: 'IndividualCounselling',
				component: lazy('IndividualCounselling', 'services'),
				meta: {
					title: 'Individual Counselling in Namibia | Private Therapy',
					requiresAuth: false
				}
			},

			{
				path: 'services/couples-counselling',
				name: 'CouplesCounselling',
				component: lazy('CouplesCounselling', 'services'),
				meta: {
					title: 'Couples Counselling in Namibia | Marriage Therapy',
					requiresAuth: false
				}
			},

			{
				path: 'services/child-counselling',
				name: 'ChildCounselling',
				component: lazy('ChildCounselling', 'services'),
				meta: {
					title: 'Child Counselling in Namibia | Child Therapy Services',
					requiresAuth: false
				}
			},

			{
				path: 'services/trauma-counselling',
				name: 'TraumaCounselling',
				component: lazy('TraumaCounselling', 'services'),
				meta: {
					title: 'Trauma Counselling in Namibia | Trauma Recovery Support',
					requiresAuth: false
				}
			},

			{
				path: 'services/workplace-counselling',
				name: 'WorkplaceCounselling',
				component: lazy('WorkplaceCounselling', 'services'),
				meta: {
					title: 'Workplace & Burnout Counselling in Namibia',
					requiresAuth: false
				}
			},

			{
				path: 'services/online-therapy',
				name: 'OnlineTherapy',
				component: lazy('OnlineTherapy', 'services'),
				meta: {
					title: 'Online Counselling in Namibia | Secure Therapy Sessions',
					requiresAuth: false
				}
			},

			{
				path: 'services/in-person-therapy-tsumeb',
				name: 'InPersonTherapy',
				component: lazy('InPersonTherapy', 'services'),
				meta: {
					title: 'Psychologist in Tsumeb | In-Person Counselling',
					requiresAuth: false
				}
			},

			// --------------------
			// CRISIS PAGE
			// --------------------

			{
				path: 'crisis-support-namibia',
				name: 'CrisisSupport',
				component: lazy('CrisisSupport', 'public'),
				meta: {
					title: 'Mental Health Crisis Support in Namibia',
					requiresAuth: false
				}
			},

			// --------------------
			// LEGAL
			// --------------------

			{
				path: 'privacy-policy',
				name: 'PrivacyPolicy',
				component: lazy('PrivacyPolicy', 'legal'),
				meta: {
					title: 'Privacy Policy | Nangura Social Care',
					requiresAuth: false,
					layout: 'LegalLayout'
				}
			},

			{
				path: 'terms-of-service',
				name: 'TermsOfService',
				component: lazy('TermsOfService', 'legal'),
				meta: {
					title: 'Terms of Service | Nangura Social Care',
					requiresAuth: false,
					layout: 'LegalLayout'
				}
			},

			{
				path: 'cookie-policy',
				name: 'CookiePolicy',
				component: lazy('CookiePolicy', 'legal'),
				meta: {
					title: 'Cookie Policy | Nangura Social Care',
					requiresAuth: false,
					layout: 'LegalLayout'
				}
			},

			{
				path: 'disclaimer',
				name: 'Disclaimer',
				component: lazy('Disclaimer', 'legal'),
				meta: {
					title: 'Disclaimer | Nangura Social Care',
					requiresAuth: false,
					layout: 'LegalLayout'
				}
			}*/]
}
);