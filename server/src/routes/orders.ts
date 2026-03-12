import { Router } from 'express'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
import { prisma } from '../lib/prisma.js'
import { sendOrderConfirmation, sendAdminNotification } from '../services/email.js'

export const ordersRouter = Router()

// Create new order (customer)
ordersRouter.post('/', requireAuth, async (req, res) => {
  try {
    const user = (req as any).dbUser

    // Generate order number: STR-YYYY-XXXX
    const year = new Date().getFullYear()
    const count = await prisma.order.count()
    const orderNumber = `STR-${year}-${String(count + 1).padStart(4, '0')}`

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: user.id,
        garmentType: req.body.garmentType,
        quantity: req.body.quantity,
        fabricType: req.body.fabricType,
        fabricWeight: req.body.fabricWeight,
        colorCodes: req.body.colorCodes,
        logoPlacement: req.body.logoPlacement,
        decorationMethod: req.body.decorationMethod,
        labelRequirements: req.body.labelRequirements,
        shippingAddress: req.body.shippingAddress,
        shippingMethod: req.body.shippingMethod,
        specialNotes: req.body.specialNotes,
        timelineRequest: req.body.timelineRequest,
      },
    })

    // Send emails (non-blocking)
    sendOrderConfirmation(user.email, order).catch(console.error)
    sendAdminNotification(order).catch(console.error)

    res.status(201).json(order)
  } catch (error) {
    console.error('Create order error:', error)
    res.status(500).json({ error: 'Failed to create order' })
  }
})

// List orders (customer: own, admin: all)
ordersRouter.get('/', requireAuth, async (req, res) => {
  try {
    const user = (req as any).dbUser
    const where = user.role === 'ADMIN' ? {} : { customerId: user.id }

    const orders = await prisma.order.findMany({
      where,
      include: { customer: { select: { name: true, email: true, company: true } } },
      orderBy: { createdAt: 'desc' },
    })

    res.json(orders)
  } catch (error) {
    console.error('List orders error:', error)
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
})

// Get single order
ordersRouter.get('/:id', requireAuth, async (req, res) => {
  try {
    const user = (req as any).dbUser
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        customer: { select: { name: true, email: true, company: true } },
        files: true,
        messages: { include: { author: { select: { name: true, role: true } } }, orderBy: { createdAt: 'asc' } },
      },
    })

    if (!order) {
      res.status(404).json({ error: 'Order not found' })
      return
    }

    // Customers can only see their own orders
    if (user.role !== 'ADMIN' && order.customerId !== user.id) {
      res.status(403).json({ error: 'Forbidden' })
      return
    }

    // Filter internal messages for customers
    if (user.role !== 'ADMIN') {
      order.messages = order.messages.filter((m: { internal: boolean }) => !m.internal)
    }

    res.json(order)
  } catch (error) {
    console.error('Get order error:', error)
    res.status(500).json({ error: 'Failed to fetch order' })
  }
})

// Update order status (admin only)
ordersRouter.patch('/:id/status', requireAdmin, async (req, res) => {
  try {
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status: req.body.status },
    })
    res.json(order)
  } catch (error) {
    console.error('Update status error:', error)
    res.status(500).json({ error: 'Failed to update status' })
  }
})

// Add message to order
ordersRouter.post('/:id/messages', requireAuth, async (req, res) => {
  try {
    const user = (req as any).dbUser
    const message = await prisma.message.create({
      data: {
        content: req.body.content,
        orderId: req.params.id,
        authorId: user.id,
        internal: user.role === 'ADMIN' && req.body.internal === true,
      },
      include: { author: { select: { name: true, role: true } } },
    })
    res.status(201).json(message)
  } catch (error) {
    console.error('Add message error:', error)
    res.status(500).json({ error: 'Failed to add message' })
  }
})
