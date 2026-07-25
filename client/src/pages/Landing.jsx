// src/pages/Landing.jsx
import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Landing() {
  const [form, setForm] = useState({ name: '', email: '', budget_range: '', message: '' })
  const [status, setStatus] = useState(null)

  const validate = () => {
    if (!form.name.trim()) return "Name is required"
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Valid email is required"
    if (!form.budget_range) return "Budget range is required"
    return null
  }

 const handleSubmit = async (e) => {
  e.preventDefault()

  const validationError = validate()
  if (validationError) {
    setStatus(validationError)
    return
  }

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })

    if (!res.ok) {
      const data = await res.json()
      setStatus(data.error)
    } else {
      setStatus("Thanks! We'll be in touch.")
      setForm({ name: '', email: '', budget_range: '', message: '' })
    }
  } catch (err) {
    setStatus("Something went wrong. Please try again.")
  }
}

  return (
  <div style={{ maxWidth: '500px', margin: '0 auto', padding: '2rem' }}>
    <h1>Get in Touch</h1>
    <p>Tell us about your project and we'll get back to you.</p>

    <form onSubmit={handleSubmit}>
      <div>
        <label>Name</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>

      <div>
        <label>Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
      </div>

      <div>
        <label>Budget Range</label>
        <select
          value={form.budget_range}
          onChange={(e) => setForm({ ...form, budget_range: e.target.value })}
          required
        >
          <option value="">Select a range</option>
          <option value="Under $1,000">Under $1,000</option>
          <option value="$1,000 - $5,000">$1,000 - $5,000</option>
          <option value="$5,000 - $10,000">$5,000 - $10,000</option>
          <option value="$10,000+">$10,000+</option>
        </select>
      </div>

      <div>
        <label>Message</label>
        <textarea
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          rows={4}
        />
      </div>

      {status && <p>{status}</p>}

      <button type="submit">Submit</button>
    </form>

    <footer style={{ marginTop: '3rem', fontSize: '0.85rem', textAlign: 'center' }}>
      Built for{' '}
      <a href="https://digitalheroesco.com" target="_blank" rel="noopener noreferrer">
        Digital Heroes Training Task
      </a>
    </footer>
  </div>
)
}