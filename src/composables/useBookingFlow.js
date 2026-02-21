import { ref, reactive, computed, watch, onMounted } from 'vue'
import { z } from 'zod'
import { useAppStore } from '@/stores/appStore'

export function useBookingFlow(route, router) {
  const store = useAppStore()

  // ----------------------
  // STATE
  // ----------------------

  const step = ref(1)
  const isSubmitting = ref(false)
  const showAuthModal = ref(false)
  const validationErrors = ref({})
  const bookedSessions = ref([])

  const services = [
    { id: 1, title: 'Individual Counselling', duration: '60 mins', price: 'NAD 650', type: 'online' },
    { id: 2, title: 'Online Therapy', duration: '60 mins', price: 'NAD 650', type: 'online' },
    { id: 3, title: 'Couples Counselling', duration: '90 mins', price: 'NAD 950', type: 'online' },
    { id: 4, title: 'Corporate / Events Counselling', duration: '60 mins+', price: 'Request Quotation', type: 'in-person' },
  ]

  const form = reactive({
    service: null,
    startDate: null,
    time: null,
    fullName: '',
    email: '',
    phone: '',
    message: '',
    organizationName: '',
    contactPerson: '',
    eventDetails: '',
    expectedDuration: ''
  })

  // ----------------------
  // DERIVED STATE
  // ----------------------

  const isOrganization = computed(() => form.service?.id === 4)

  const isAuthenticated = computed(() => !!store.currentUser)

  const canProceedToTime = computed(() => !!form.service)

  const canProceedToDetails = computed(() =>
    !!form.startDate && !!form.time
  )

  // ----------------------
  // VALIDATION
  // ----------------------

  const patientSchema = z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(8)
  })

  const orgSchema = z.object({
    organizationName: z.string().min(2),
    contactPerson: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(8)
  })

  function validateDetails() {
    validationErrors.value = {}

    const schema = isOrganization.value ? orgSchema : patientSchema
    const result = schema.safeParse(form)

    if (!result.success) {
      result.error.errors.forEach(e => {
        validationErrors.value[e.path[0]] = e.message
      })
      return false
    }

    return true
  }

  // ----------------------
  // AUTH BEHAVIOR
  // ----------------------

  watch(
    () => store.currentUser,
    user => {
      if (!user) return

      form.fullName = user.displayName || ''
      form.email = user.email || ''
    },
    { immediate: true }
  )

  // ----------------------
  // STEP NAVIGATION
  // ----------------------

  function goTo(next) {
    if (next === 3 && !isOrganization.value && !isAuthenticated.value) {
      showAuthModal.value = true
      return
    }

    if (next === 4 && !validateDetails()) {
      return
    }

    step.value = next
  }

  function back() {
    if (step.value > 1) step.value--
  }

  // ----------------------
  // BOOKING
  // ----------------------

  async function confirm() {
    if (!validateDetails()) return

    isSubmitting.value = true

    try {
      const payload = {
        serviceId: form.service.id,
        serviceTitle: form.service.title,
        startDate: form.startDate,
        time: form.time,
        bookingType: isOrganization.value ? 'organization' : 'individual',
        status: isOrganization.value ? 'quotation' : 'pending',
        userId: store.currentUser?.uid || null,
        createdAt: new Date()
      }

      if (isOrganization.value) {
        Object.assign(payload, {
          organizationName: form.organizationName,
          contactPerson: form.contactPerson,
          email: form.email,
          phone: form.phone,
          eventDetails: form.eventDetails,
          expectedDuration: form.expectedDuration
        })
      } else {
        Object.assign(payload, {
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          message: form.message
        })
      }

      const id = await store.sessionsActions.create(payload)

      step.value = 5
      return id
    } finally {
      isSubmitting.value = false
    }
  }

  // ----------------------
  // INITIALIZATION
  // ----------------------

  onMounted(() => {
    if (route.query.service) {
      const found = services.find(s => s.id === Number(route.query.service))
      if (found) {
        form.service = found
        step.value = 2
      }
    }
  })

  return {
    // state
    step,
    form,
    services,
    isOrganization,
    isAuthenticated,
    isSubmitting,
    showAuthModal,
    validationErrors,

    // guards
    canProceedToTime,
    canProceedToDetails,

    // actions
    goTo,
    back,
    confirm
  }
}