import { useState } from 'react'
import Reveal from '../components/Reveal.jsx'
import Seal from '../components/Seal.jsx'

export default function Apply() {
  const [sent, setSent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    handle: '',
    contentType: '',
    contentTypeOther: '',
    buildingBusiness: '',
    businessDesc: '',
    revenue: '',
    timeCreating: '',
    story: '',
    hardestPart: '',
    biggestStruggle: '',
    threeYears: '',
    expecting: [],
    expectingOther: '',
    whyInvited: '',
    declaration: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (type === 'checkbox' && name !== 'declaration') {
      // Handle the 'expecting' array
      setFormData((prev) => {
        const list = prev.expecting
        if (checked) return { ...prev, expecting: [...list, value] }
        return { ...prev, expecting: list.filter((item) => item !== value) }
      })
    } else if (type === 'checkbox' && name === 'declaration') {
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)

    const scriptUrl = import.meta.env.VITE_SF_APPLY_SCRIPT_URL || 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'

    const payload = {
      name: formData.name,
      fullName: formData.name,
      email: formData.email,
      phone: formData.phone,
      handle: formData.handle,
      socialHandle: formData.handle,
      contentType: formData.contentType === 'Other' ? `Other: ${formData.contentTypeOther}` : formData.contentType,
      contentTypeOther: formData.contentTypeOther,
      buildingBusiness: formData.buildingBusiness,
      businessBeyondContent: formData.buildingBusiness,
      businessDesc: formData.businessDesc,
      businessDescription: formData.businessDesc,
      revenue: formData.revenue,
      monthlyRevenue: formData.revenue,
      timeCreating: formData.timeCreating,
      contentExperience: formData.timeCreating,
      story: formData.story,
      hardestPart: formData.hardestPart,
      hardestMoment: formData.hardestPart,
      biggestStruggle: formData.biggestStruggle,
      threeYears: formData.threeYears,
      threeYearVision: formData.threeYears,
      expecting: formData.expecting.map(item => item === 'Other' ? `Other: ${formData.expectingOther}` : item).join(', '),
      expectations: formData.expecting.map(item => item === 'Other' ? `Other: ${formData.expectingOther}` : item).join(', '),
      communityExpectations: formData.expecting.map(item => item === 'Other' ? `Other: ${formData.expectingOther}` : item).join(', '),
      whyInvited: formData.whyInvited || 'N/A',
      submittedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    }

    try {
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      })

      setSent(true)
      setIsSubmitting(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      console.error('Submission error:', err)
      setErrorMessage('Something went wrong submitting your application. Please check your connection and try again.')
      setIsSubmitting(false)
    }
  }

  const contentTypes = ['Comedy', 'Lifestyle', 'Business', 'Education', 'Tech / AI', 'Fitness', 'Finance', 'Storytelling', 'Other']
  const businessTypes = ['Personal brand', 'Product / Brand', 'Agency', 'Community', 'Startup', 'Course / Education', 'Not yet']
  const revenueOptions = ['₹0–10,000', '₹10,000–50,000', '₹50,000–2L', '₹2L–10L', '₹10L+']
  const timeOptions = ['< 6 months', '6–12 months', '1–2 years', '2–5 years', '5+ years']
  const expectations = ['Clarity', 'Growth', 'Networking', 'Business opportunities', 'Accountability', 'Collaborations', 'Learning from other founders', 'Personal transformation', 'Other']

  return (
    <>
      <section className="page-hero">
        <div className="container narrow">
          <Reveal><span className="eyebrow">Season 01 Application</span></Reveal>
          <Reveal as="h1" className="display" delay={1}>
            Become a stranger founder
          </Reveal>
          <Reveal as="p" className="lead muted" delay={2} style={{ maxWidth: '60ch' }}>
            This is not a casting form. It is a founder and creator evaluation. Follower count does not decide selection. Story, ambition, honesty, business potential, and transformation value do.
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

                {/* 4. Handle */}
                <div className="field full">
                  <label htmlFor="handle">4. Instagram / YouTube Handle *</label>
                  <input id="handle" name="handle" required placeholder="@username or Channel URL" value={formData.handle} onChange={handleChange} />
                </div>

                {/* 5. Content Type */}
                <div className="field full" style={{ marginTop: '16px' }}>
                  <label>5. What type of content do you create? *</label>
                  <div className="radio-grid cols-3">
                    {contentTypes.map(type => (
                      <label key={type} className={`radio-card ${formData.contentType === type ? 'selected' : ''}`}>
                        <input type="radio" name="contentType" value={type} required onChange={handleChange} checked={formData.contentType === type} />
                        <span className="radio-label">{type}</span>
                        <span className="radio-custom-indicator">
                          {formData.contentType === type && <span className="radio-dot" />}
                        </span>
                      </label>
                    ))}
                  </div>
                  {formData.contentType === 'Other' && (
                    <div className="field other-input">
                      <input name="contentTypeOther" required placeholder="Please specify" value={formData.contentTypeOther} onChange={handleChange} />
                    </div>
                  )}
                </div>

                {/* 6. Building a business */}
                <div className="field full" style={{ marginTop: '16px' }}>
                  <label>6. Are you building a business beyond content? *</label>
                  <div className="radio-grid cols-3">
                    {businessTypes.map(type => (
                      <label key={type} className={`radio-card ${formData.buildingBusiness === type ? 'selected' : ''}`}>
                        <input type="radio" name="buildingBusiness" value={type} required onChange={handleChange} checked={formData.buildingBusiness === type} />
                        <span className="radio-label">{type}</span>
                        <span className="radio-custom-indicator">
                          {formData.buildingBusiness === type && <span className="radio-dot" />}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 7. What business */}
                <div className="field full">
                  <label htmlFor="businessDesc">7. What business are you building? (1–2 lines) *</label>
                  <textarea id="businessDesc" name="businessDesc" required placeholder="Describe your business..." rows="2" value={formData.businessDesc} onChange={handleChange}></textarea>
                </div>

                {/* 8. Revenue */}
                <div className="field full" style={{ marginTop: '16px' }}>
                  <label>8. What is your current monthly revenue? (Content + business combined) *</label>
                  <div className="radio-grid">
                    {revenueOptions.map(opt => (
                      <label key={opt} className={`radio-card ${formData.revenue === opt ? 'selected' : ''}`}>
                        <input type="radio" name="revenue" value={opt} required onChange={handleChange} checked={formData.revenue === opt} />
                        <span className="radio-label">{opt}</span>
                        <span className="radio-custom-indicator">
                          {formData.revenue === opt && <span className="radio-dot" />}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 9. Time creating */}
                <div className="field full" style={{ marginTop: '16px' }}>
                  <label>9. How long have you been creating content? *</label>
                  <div className="radio-grid">
                    {timeOptions.map(opt => (
                      <label key={opt} className={`radio-card ${formData.timeCreating === opt ? 'selected' : ''}`}>
                        <input type="radio" name="timeCreating" value={opt} required onChange={handleChange} checked={formData.timeCreating === opt} />
                        <span className="radio-label">{opt}</span>
                        <span className="radio-custom-indicator">
                          {formData.timeCreating === opt && <span className="radio-dot" />}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 10. Story */}
                <div className="field full">
                  <label htmlFor="story">10. Tell us your story in 4–5 lines. *</label>
                  <textarea id="story" name="story" required placeholder="Your journey so far..." rows="4" value={formData.story} onChange={handleChange}></textarea>
                </div>

                {/* 11. Hardest part */}
                <div className="field full">
                  <label htmlFor="hardestPart">11. What is the hardest part of your life or the moment that changed you forever? *</label>
                  <textarea id="hardestPart" name="hardestPart" required placeholder="Be honest and raw..." rows="4" value={formData.hardestPart} onChange={handleChange}></textarea>
                </div>

                {/* 12. Biggest struggle */}
                <div className="field full">
                  <label htmlFor="biggestStruggle">12. What is the biggest struggle you’re facing right now? *</label>
                  <textarea id="biggestStruggle" name="biggestStruggle" required placeholder="Business, personal, or creative..." rows="3" value={formData.biggestStruggle} onChange={handleChange}></textarea>
                </div>

                {/* 13. 3 years */}
                <div className="field full">
                  <label htmlFor="threeYears">13. Where do you see yourself in the next 3 years? *</label>
                  <textarea id="threeYears" name="threeYears" required placeholder="Your ultimate vision..." rows="3" value={formData.threeYears} onChange={handleChange}></textarea>
                </div>

                {/* 14. Expectations */}
                <div className="field full" style={{ marginTop: '16px' }}>
                  <label>14. What are you expecting from the Stranger Founder community? *</label>
                  <div className="checkbox-grid cols-3">
                    {expectations.map(opt => {
                      const isChecked = formData.expecting.includes(opt)
                      return (
                        <label key={opt} className={`checkbox-card ${isChecked ? 'selected' : ''}`}>
                          <input type="checkbox" name="expecting" value={opt} onChange={handleChange} checked={isChecked} />
                          <span className="checkbox-label">{opt}</span>
                          <span className="checkbox-custom-indicator">
                            {isChecked && (
                              <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.5 5L4.5 8L10.5 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                  {formData.expecting.includes('Other') && (
                    <div className="field other-input">
                      <input name="expectingOther" required placeholder="Please specify" value={formData.expectingOther} onChange={handleChange} />
                    </div>
                  )}
                </div>

                {/* 15. Why invited */}
                <div className="field full">
                  <label htmlFor="whyInvited">15. Why should you be invited to Stranger Founder? (Optional)</label>
                  <textarea id="whyInvited" name="whyInvited" placeholder="Make your final case..." rows="3" value={formData.whyInvited} onChange={handleChange}></textarea>
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
