
<template>
<footer id="contact" class="bg-[var(--color-primary)] text-white pt-24 pb-12 rounded-t-[60px]">
      <div class="container mx-auto max-w-7xl px-6">
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div class="col-span-1 lg:col-span-2">
            <h3 class="font-serif text-4xl mb-6">Let's start your <br/> healing journey.</h3>
            <p class="text-white/60 font-light max-w-sm">Online Nationwide Namibia.</p>
          </div>
          <div>
            <h4 class="text-[var(--color-accent)] font-bold text-xs uppercase tracking-widest mb-6">Contact Details</h4>
            <div class="space-y-4 text-sm text-white/80">
              <p>
                <a href="tel:264812656253">
                  <i class="fas fa-phone mr-2 text-white/40"></i> +264 81 265 6253
                </a>
              </p>
              <p>
                <a href="mailto:info@nangurasocialcare.org">
                  <i class="fas fa-envelope mr-2 text-white/40"></i> info@nangurasocialcare.org
                </a>
              </p>

              <p>
                <a href="mailto:bertha@nangurasocialcare.org">
                  <i class="fas fa-envelope mr-2 text-white/40"></i> bertha@nangurasocialcare.org
                </a>
              </p>
              <p><i class="fas fa-clock mr-2 text-white/40"></i> Mon-Fri: 08:00 - 17:00</p>
              <p><i class="fas fa-clock mr-2 text-white/60"></i> Sat: 09:00 - 13:00</p>
            </div>
          </div>
          <div>
            <h4 class="text-[var(--color-accent)] font-bold text-xs uppercase tracking-widest mb-6">Location</h4>
            <p class="text-sm text-white/80 leading-relaxed">
              Online: Accessible Nationwide
            </p>
          </div>

          <div>
            <h4 class="text-[var(--color-accent)] font-bold text-xs uppercase tracking-widest mb-6">Other Links</h4>
            <p class="text-sm text-white/80 leading-relaxed">
              <router-link to="/legal">Legal</router-link> <br>
              <router-link to="/crisis">Crisis</router-link><br>
              <router-link to="/contact">Contact Us</router-link><br>
              <router-link to="/faq">Frequently Asked</router-link><br>
            </p>
          </div>
        </div>
        <div class="pt-8 border-t border-white/10 text-center text-xs text-white/40">
          © {{ new Date().getFullYear() }} Nangura Social Care. Confidential. Professional. Compassionate.
        </div>

        <div class="pt-1 text-center text-xs text-white/40">
          <p class="text-center text-sm text-white">
                Made with <span class="text-red-500">❤️</span> by
                <a href="https://wa.me/264858140709?text=I%20got%20your%20number%20via%nangurasocialcare.org.%20I%20would%20like%20to%20know%20more%20about%20your%20services"
                    target="_blank" rel="noopener noreferrer"
                    class="text-black hover:underline font-semibold">
                    Totisoft CC
                </a>
            </p>
        </div>
      </div>
    </footer>
</template>