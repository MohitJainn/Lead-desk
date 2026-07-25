// server/index.js
import express from 'express'
import cors from 'cors'
import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const app = express()
app.use(cors())
app.use(express.json())

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // service role key, backend-only, never expose to frontend
)

app.post('/api/leads', async (req, res) => {
  const { name, email, budget_range, message } = req.body

  // Server-side validation
  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Name is required' })
  }
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email is required' })
  }
  if (!budget_range) {
    return res.status(400).json({ error: 'Budget range is required' })
  }

  const { error } = await supabase.from('leads').insert([{ name, email, budget_range, message }])

  if (error) {
    return res.status(500).json({ error: 'Failed to save lead' })
  }

  res.status(201).json({ success: true })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))