import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { getPresignedUploadUrl } from '../services/r2.js'
import { prisma } from '../lib/prisma.js'

export const filesRouter = Router()

// Get presigned upload URL
filesRouter.post('/upload-url', requireAuth, async (req, res) => {
  try {
    const { filename, contentType, orderId, fileType } = req.body
    const user = (req as any).dbUser

    const key = `orders/${orderId}/${Date.now()}-${filename}`
    const { url, publicUrl } = await getPresignedUploadUrl(key, contentType)

    // Save file record
    const file = await prisma.file.create({
      data: {
        filename,
        url: publicUrl,
        type: fileType,
        orderId,
        uploadedBy: user.id,
      },
    })

    res.json({ uploadUrl: url, file })
  } catch (error) {
    console.error('Upload URL error:', error)
    res.status(500).json({ error: 'Failed to generate upload URL' })
  }
})
