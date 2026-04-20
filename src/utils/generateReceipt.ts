import type { Order } from '@/lib/supabase'
import { buildReceiptPdf } from '@/utils/receipt-core'

let logoDataUrlPromise: Promise<string | null> | null = null

async function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
        return
      }

      reject(new Error('Unable to read logo image'))
    }

    reader.onerror = () => reject(reader.error || new Error('Unable to read logo image'))
    reader.readAsDataURL(blob)
  })
}

async function getBrowserLogoDataUrl() {
  if (!logoDataUrlPromise) {
    logoDataUrlPromise = fetch('/logo.png', { cache: 'force-cache' })
      .then(async response => {
        if (!response.ok) {
          throw new Error('Unable to load receipt logo')
        }

        return blobToDataUrl(await response.blob())
      })
      .catch(error => {
        console.error('Receipt logo load error:', error)
        return null
      })
  }

  return logoDataUrlPromise
}

export async function generateReceiptPDF(order: Order): Promise<void> {
  const logoDataUrl = await getBrowserLogoDataUrl()
  const { doc, fileName } = await buildReceiptPdf(order, logoDataUrl)

  doc.save(fileName)
}
