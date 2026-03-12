import type { Request, Response, NextFunction } from 'express'
import { getAuth } from '@clerk/express'
import { prisma } from '../lib/prisma.js'

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const { userId } = getAuth(req)
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) {
    res.status(401).json({ error: 'User not found' })
    return
  }

  // Attach user to request
  ;(req as any).dbUser = user
  next()
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const { userId } = getAuth(req)
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user || user.role !== 'ADMIN') {
    res.status(403).json({ error: 'Forbidden' })
    return
  }

  ;(req as any).dbUser = user
  next()
}
