import { useState } from 'react'
import Reveal from '../components/Reveal.jsx'
import Seal from '../components/Seal.jsx'

export default function Apply() {
  const [sent, setSent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  const [formData, setFormData] = useState({
    // Section 1 — About You
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    location: '',
    hearAbout: '',
    hearAboutOther: '',

    // Section 2 — Your Founder Story
    company: '',
    website: '',
    pitch: '',
    problem: '',
    stage: '',
    timeWorking: '',

    // Section 3 — The Human Side
    whyWild: '',
    gapsToFill: '',
    whatCanOffer: '',
    offGridComfort: '',

    // Section 4 — Logistics
    cohortSize: '',
    availability: '',
    availabilityMonths: '',
    dietary: '',
    anythingElse: '',

    // Declaration
    declaration: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (type === 'checkbox' && name === 'declaration') {
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)

    // Apps Script Web App URL from Environment Variables
    const scriptUrl = import.meta.env.VITE_SF_APPLY_SCRIPT_URL || 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'

    // Format final submission payload
    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      linkedin: formData.linkedin,
      location: formData.location,
      hearAbout: formData.hearAbout === 'Other' ? `Other: ${formData.hearAboutOther}` : formData.hearAbout,
      company: formData.company,
      website: formData.website || 'N/A',
      pitch: formData.pitch,
      problem: formData.problem,
      stage: formData.stage,
      timeWorking: formData.timeWorking,
      whyWild: formData.whyWild,
      gapsToFill: formData.gapsToFill,
      whatCanOffer: formData.whatCanOffer,
      offGridComfort: formData.offGridComfort,
      cohortSize: formData.cohortSize,
      availability: formData.availability === 'Yes - specific months' ? `Yes - specific months (${formData.availabilityMonths})` : formData.availability,
      dietary: formData.dietary || 'None',
      anythingElse: formData.anythingElse || 'None',
      submittedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    }

    try {
      // POST request to Google Apps Script Web App (no-cors mode as required)
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      })

      // Update UI to success state
      setSent(true)
      setIsSubmitting(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      console.error('Submission error:', err)
      setErrorMessage('Something went wrong submitting your application. Please check your connection and try again.')
      setIsSubmitting(false)
    }
  }

  const hearAboutOptions = ['Instagram', 'LinkedIn', 'Friend Referral', 'StrangerFounders.com', 'Other']
  const stageOptions = ['Idea', 'Prototype/MVP', 'Early Revenue', 'Scaling']
  const timeWorkingOptions = ['< 6 months', '6–12 months', '1–2 years', '3+ years']
  const offGridOptions = ['Yes', 'Yes, but a little nervous', "I'll adapt"]
  const cohortOptions = ['Intimate - 4 founders', 'Standard - 8 founders', 'No preference']
  const availabilityOptions = ['Yes - anytime', 'Yes - specific months', 'Not sure yet']

  return (
    <>
      <section className="page-hero">
        <div className="container narrow">
          <Reveal><span className="eyebrow">Founder Evaluation</span></Reveal>
          <Reveal as="h1" className="display" delay={1}>
            Become a stranger founder
          </Reveal>
          <Reveal as="p" className="lead muted" delay={2} style={{ maxWidth: '60ch' }}>
            An invite-only, off-grid founder retreat. 4 strangers meet in the wild — no stage, no audience, just real conversations. Follower count does not decide selection. Story, ambition, honesty, and business potential do.
          </Reveal>
        </div>
      </section>

      <section className="section-pad-sm" style={{ paddingTop: 8, paddingBottom: 100 }}>
        <div className="container narrow">
          {sent ? (
            <Reveal className="form-success">
              <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                <Seal size={104} />
              </div>
              <h3>Your application is in.</h3>
              <p className="lead muted" style={{ maxWidth: '46ch', margin: '0 auto' }}>
                Thank you. Every application is reviewed carefully. If there’s a seat with your name on it, you’ll hear from us soon.
              </p>
              <p className="script" style={{ fontSize: '1.6rem', marginTop: 22 }}>See you with the next strangers.</p>
            </Reveal>
          ) : (
            <form onSubmit={handleSubmit}>
              {errorMessage && (
                <div className="form-error-banner" style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '14px 18px', borderRadius: '8px', marginBottom: '24px', color: '#fca5a5', fontSize: '0.92rem' }}>
                  {errorMessage}
                </div>
              )}

              <div className="form-grid">
                
                {/* ── SECTION 1: ABOUT YOU ────────────────────────────── */}
                <div className="field full form-section-header" style={{ marginTop: '8px', marginBottom: '8px' }}>
                  <h2 style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '1.4rem', color: 'var(--copper-light)', borderBottom: '1px solid var(--forest-line-soft)', paddingBottom: '10px' }}>
                    Section 1 — About You
                  </h2>
                </div>

                {/* 1. Full Name */}
                <div className="field full">
                  <label htmlFor="name">1. Full Name *</label>
                  <input id="name" name="name" required placeholder="Your full name" value={formData.name} onChange={handleChange} />
                </div>

                {/* 2. Email Address */}
                <div className="field">
                  <label htmlFor="email">2. Email Address *</label>
                  <input id="email" name="email" type="email" required placeholder="you@example.com" value={formData.email} onChange={handleChange} />
                </div>

                {/* 3. Phone Number */}
                <div className="field">
                  <label htmlFor="phone">3. Phone Number / WhatsApp *</label>
                  <input id="phone" name="phone" type="tel" required placeholder="+91..." value={formData.phone} onChange={handleChange} />
                </div>

                {/* 4. LinkedIn URL */}
                <div className="field">
                  <label htmlFor="linkedin">4. LinkedIn Profile URL *</label>
                  <input id="linkedin" name="linkedin" required placeholder="https://linkedin.com/in/username" value={formData.linkedin} onChange={handleChange} />
                </div>

                {/* 5. City / Country */}
                <div className="field">
                  <label htmlFor="location">5. City / Country *</label>
                  <input id="location" name="location" required placeholder="e.g. Mumbai, India or London, UK" value={formData.location} onChange={handleChange} />
                </div>

                {/* 6. How did you hear */}
                <div className="field full" style={{ marginTop: '12px' }}>
                  <label>6. How did you hear about Stranger Founders? *</label>
                  <div className="radio-grid cols-3">
                    {hearAboutOptions.map(opt => (
                      <label key={opt} className={`radio-card ${formData.hearAbout === opt ? 'selected' : ''}`}>
                        <input type="radio" name="hearAbout" value={opt} required onChange={handleChange} checked={formData.hearAbout === opt} />
                        {opt}
                      </label>
                    ))}
                  </div>
                  {formData.hearAbout === 'Other' && (
                    <div className="field other-input">
                      <input name="hearAboutOther" required placeholder="Please specify how you heard about us" value={formData.hearAboutOther} onChange={handleChange} />
                    </div>
                  )}
                </div>


                {/* ── SECTION 2: YOUR FOUNDER STORY ──────────────────── */}
                <div className="field full form-section-header" style={{ marginTop: '28px', marginBottom: '8px' }}>
                  <h2 style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '1.4rem', color: 'var(--copper-light)', borderBottom: '1px solid var(--forest-line-soft)', paddingBottom: '10px' }}>
                    Section 2 — Your Founder Story
                  </h2>
                </div>

                {/* 7. Startup Name */}
                <div className="field">
                  <label htmlFor="company">7. What is your startup / venture? *</label>
                  <input id="company" name="company" required placeholder="Company or project name" value={formData.company} onChange={handleChange} />
                </div>

                {/* 8. Website Link */}
                <div className="field">
                  <label htmlFor="website">8. Website or App Link (Optional)</label>
                  <input id="website" name="website" placeholder="https://yourcompany.com" value={formData.website} onChange={handleChange} />
                </div>

                {/* 9. Campfire Pitch */}
                <div className="field full">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <label htmlFor="pitch">9. Describe what you're building in one sentence — your "campfire pitch" *</label>
                    <span style={{ fontSize: '0.75rem', color: formData.pitch.length > 200 ? '#ef4444' : 'var(--cream-faint)' }}>
                      {formData.pitch.length}/200
                    </span>
                  </div>
                  <textarea id="pitch" name="pitch" required maxLength={200} placeholder="One line pitch..." rows="2" value={formData.pitch} onChange={handleChange}></textarea>
                </div>

                {/* 10. Problem obsessed with */}
                <div className="field full">
                  <label htmlFor="problem">10. What problem are you obsessed with solving and why? *</label>
                  <textarea id="problem" name="problem" required placeholder="Describe the problem and why it matters to you..." rows="3" value={formData.problem} onChange={handleChange}></textarea>
                </div>

                {/* 11. Stage */}
                <div className="field full" style={{ marginTop: '12px' }}>
                  <label>11. What stage are you at? *</label>
                  <div className="radio-grid cols-2">
                    {stageOptions.map(opt => (
                      <label key={opt} className={`radio-card ${formData.stage === opt ? 'selected' : ''}`}>
                        <input type="radio" name="stage" value={opt} required onChange={handleChange} checked={formData.stage === opt} />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>

                {/* 12. Time working */}
                <div className="field full" style={{ marginTop: '12px' }}>
                  <label>12. How long have you been working on this? *</label>
                  <div className="radio-grid cols-2">
                    {timeWorkingOptions.map(opt => (
                      <label key={opt} className={`radio-card ${formData.timeWorking === opt ? 'selected' : ''}`}>
                        <input type="radio" name="timeWorking" value={opt} required onChange={handleChange} checked={formData.timeWorking === opt} />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>


                {/* ── SECTION 3: THE HUMAN SIDE ───────────────────────── */}
                <div className="field full form-section-header" style={{ marginTop: '28px', marginBottom: '8px' }}>
                  <h2 style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '1.4rem', color: 'var(--copper-light)', borderBottom: '1px solid var(--forest-line-soft)', paddingBottom: '10px' }}>
                    Section 3 — The Human Side
                  </h2>
                </div>

                {/* 13. Why wild */}
                <div className="field full">
                  <label htmlFor="whyWild">13. Why do you want to go into the wild with 3 strangers? *</label>
                  <textarea id="whyWild" name="whyWild" required placeholder="Be honest and authentic..." rows="3" value={formData.whyWild} onChange={handleChange}></textarea>
                </div>

                {/* 14. Gaps to fill */}
                <div className="field full">
                  <label htmlFor="gapsToFill">14. What kind of founder do you want to meet? What gaps do you have that they could fill? *</label>
                  <textarea id="gapsToFill" name="gapsToFill" required placeholder="Skills, perspectives, mindset..." rows="3" value={formData.gapsToFill} onChange={handleChange}></textarea>
                </div>

                {/* 15. What can offer */}
                <div className="field full">
                  <label htmlFor="whatCanOffer">15. What can you offer to the other 3 founders in the cohort? *</label>
                  <textarea id="whatCanOffer" name="whatCanOffer" required placeholder="Your strengths, insights, experiences..." rows="3" value={formData.whatCanOffer} onChange={handleChange}></textarea>
                </div>

                {/* 16. Off grid comfort */}
                <div className="field full" style={{ marginTop: '12px' }}>
                  <label>16. Are you comfortable with being off-grid and away from devices for 48 hours? *</label>
                  <div className="radio-grid cols-3">
                    {offGridOptions.map(opt => (
                      <label key={opt} className={`radio-card ${formData.offGridComfort === opt ? 'selected' : ''}`}>
                        <input type="radio" name="offGridComfort" value={opt} required onChange={handleChange} checked={formData.offGridComfort === opt} />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>


                {/* ── SECTION 4: LOGISTICS ─────────────────────────────── */}
                <div className="field full form-section-header" style={{ marginTop: '28px', marginBottom: '8px' }}>
                  <h2 style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '1.4rem', color: 'var(--copper-light)', borderBottom: '1px solid var(--forest-line-soft)', paddingBottom: '10px' }}>
                    Section 4 — Logistics
                  </h2>
                </div>

                {/* 17. Cohort size */}
                <div className="field full" style={{ marginTop: '12px' }}>
                  <label>17. Preferred cohort size *</label>
                  <div className="radio-grid cols-3">
                    {cohortOptions.map(opt => (
                      <label key={opt} className={`radio-card ${formData.cohortSize === opt ? 'selected' : ''}`}>
                        <input type="radio" name="cohortSize" value={opt} required onChange={handleChange} checked={formData.cohortSize === opt} />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>

                {/* 18. Availability */}
                <div className="field full" style={{ marginTop: '12px' }}>
                  <label>18. Are you available for a 48–72 hour experience? *</label>
                  <div className="radio-grid cols-3">
                    {availabilityOptions.map(opt => (
                      <label key={opt} className={`radio-card ${formData.availability === opt ? 'selected' : ''}`}>
                        <input type="radio" name="availability" value={opt} required onChange={handleChange} checked={formData.availability === opt} />
                        {opt}
                      </label>
                    ))}
                  </div>
                  {formData.availability === 'Yes - specific months' && (
                    <div className="field other-input">
                      <input name="availabilityMonths" required placeholder="Specify months (e.g. September - October 2025)" value={formData.availabilityMonths} onChange={handleChange} />
                    </div>
                  )}
                </div>

                {/* 19. Dietary */}
                <div className="field full">
                  <label htmlFor="dietary">19. Any dietary restrictions or physical limitations we should know about? (Optional)</label>
                  <textarea id="dietary" name="dietary" placeholder="Dietary, allergies, physical considerations..." rows="2" value={formData.dietary} onChange={handleChange}></textarea>
                </div>

                {/* 20. Anything else */}
                <div className="field full">
                  <label htmlFor="anythingElse">20. Anything else you'd like us to know? (Optional)</label>
                  <textarea id="anythingElse" name="anythingElse" placeholder="Final thoughts..." rows="2" value={formData.anythingElse} onChange={handleChange}></textarea>
                </div>

                {/* Declaration */}
                <div className="field full" style={{ marginTop: '20px', marginBottom: '20px' }}>
                  <label className="checkbox-card" style={{ background: 'transparent', borderColor: 'transparent', padding: '10px 0', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <input type="checkbox" name="declaration" required onChange={handleChange} checked={formData.declaration} style={{ position: 'relative', opacity: 1, width: '20px', height: '20px', marginTop: '4px', accentColor: 'var(--copper)' }} />
                    <span style={{ fontSize: '0.95rem', lineHeight: '1.5', color: 'var(--cream)' }}>
                      <strong>Declaration:</strong> I confirm that the information provided is accurate, and I understand that submitting this form does not guarantee selection for Stranger Founder. *
                    </span>
                  </label>
                </div>

              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 26, flexWrap: 'wrap' }}>
                <button type="submit" className="btn btn-primary" disabled={!formData.declaration || isSubmitting}>
                  {isSubmitting ? 'Submitting Application...' : 'Request My Invitation'} <span className="arw">→</span>
                </button>
                <p className="form-note">Invite-only. We read every application carefully.</p>
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
