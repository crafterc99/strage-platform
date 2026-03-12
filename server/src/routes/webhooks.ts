import { Router } from 'express'
import { prisma } from '../lib/prisma.js'

export const webhooksRouter = Router()

// Clerk webhook — sync new user signups to DB
webhooksRouter.post('/clerk', async (req, res) => {
  try {
    const payload = JSON.parse(req.body.toString())
    const { type, data } = payload

    if (type === 'user.created') {
      const email = data.email_addresses?.[0]?.email_address
      if (email) {
        await prisma.user.upsert({
          where: { clerkId: data.id },
          update: { email, name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || null },
          create: {
            clerkId: data.id,
            email,
            name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || null,
            role: 'CUSTOMER',
          },
        })
      }
    }

    if (type === 'user.updated') {
      const email = data.email_addresses?.[0]?.email_address
      if (email) {
        await prisma.user.update({
          where: { clerkId: data.id },
          data: { email, name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || null },
        })
      }
    }

    res.json({ received: true })
  } catch (error) {
    console.error('Clerk webhook error:', error)
    res.status(500).json({ error: 'Webhook processing failed' })
  }
})
