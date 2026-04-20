import { readFile } from 'fs/promises'
import path from 'path'
import type { Order } from '@/lib/supabase'
import { buildReceiptPdf } from '@/utils/receipt-core'

let logoDataUrlPromise: Promise<string | null> | null = null

async function getServerLogoDataUrl() {
  if (!logoDataUrlPromise) {
    logoDataUrlPromise = readFile(path.join(process.cwd(), 'public', 'logo.png'))
      .then(file => `data:image/png;base64,${file.toString('base64')}`)
      .catch(error => {
        console.error('Receipt logo read error:', error)
        return null
      })
  }

  return logoDataUrlPromise
}

export async function generateReceiptPdfAttachment(order: Order) {
  const logoDataUrl = await getServerLogoDataUrl()
  const { doc, fileName } = await buildReceiptPdf(order, logoDataUrl)
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'))

  return {
    filename: fileName,
    content: pdfBuffer,
    contentType: 'application/pdf',
  }
}
