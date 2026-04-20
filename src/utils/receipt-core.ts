import { getPackageById } from '@/lib/packages'
import type { Order } from '@/lib/supabase'
import { THEME } from '@/lib/theme'

function hexToRgb(hex: string) {
  const normalized = hex.replace('#', '')
  const value = normalized.length === 3
    ? normalized.split('').map(char => `${char}${char}`).join('')
    : normalized

  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  }
}

function formatPrice(amount: number, currency: string) {
  if (currency === 'INR') {
    return `Rs. ${amount.toLocaleString('en-IN')}`
  }

  return `${currency} ${amount.toLocaleString('en-IN')}`
}

function formatDate(value?: string) {
  const date = new Date(value || Date.now())

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function formatReceiptId(orderId?: string) {
  return `#${orderId?.slice(0, 8).toUpperCase() || 'RECEIPT'}`
}

export function getReceiptFileName(order: Order) {
  return `CcharmyShah-Receipt-${order.id?.slice(0, 8) || 'receipt'}.pdf`
}

function drawLabelValue(
  doc: {
    setFont: (font: string, style: string) => void
    setFontSize: (size: number) => void
    setTextColor: (r: number, g: number, b: number) => void
    text: (text: string, x: number, y: number, options?: Record<string, unknown>) => void
  },
  input: {
    label: string
    value: string
    x: number
    y: number
    labelColor: { r: number; g: number; b: number }
    valueColor: { r: number; g: number; b: number }
  }
) {
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(input.labelColor.r, input.labelColor.g, input.labelColor.b)
  doc.text(input.label.toUpperCase(), input.x, input.y)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(input.valueColor.r, input.valueColor.g, input.valueColor.b)
  doc.text(input.value, input.x, input.y + 6)
}

export async function buildReceiptPdf(order: Order, logoDataUrl: string | null) {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ])

  const packageDetails = getPackageById(order.package_id)
  const colors = {
    rose: hexToRgb(THEME.colors.rose),
    roseDark: hexToRgb(THEME.colors.roseDark),
    roseLight: hexToRgb(THEME.colors.roseLight),
    teal: hexToRgb(THEME.colors.teal),
    tealLight: hexToRgb(THEME.colors.tealLight),
    sage: hexToRgb(THEME.colors.sage),
    cream: hexToRgb(THEME.colors.cream),
    ink: hexToRgb(THEME.colors.ink),
    muted: hexToRgb(THEME.colors.muted),
    white: hexToRgb(THEME.colors.white),
  }

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const amount = formatPrice(order.amount, order.currency)
  const issueDate = formatDate(order.created_at)
  const deliveryTime = packageDetails?.deliveryTime || 'As per selected package timeline'
  const features = packageDetails?.features ?? []

  doc.setFillColor(colors.cream.r, colors.cream.g, colors.cream.b)
  doc.rect(0, 0, pageWidth, pageHeight, 'F')

  doc.setFillColor(colors.roseDark.r, colors.roseDark.g, colors.roseDark.b)
  doc.rect(0, 0, pageWidth, 56, 'F')

  doc.setFillColor(colors.teal.r, colors.teal.g, colors.teal.b)
  doc.rect(0, 49, pageWidth, 7, 'F')

  doc.setFillColor(colors.rose.r, colors.rose.g, colors.rose.b)
  doc.circle(pageWidth - 20, 12, 18, 'F')
  doc.setFillColor(colors.tealLight.r, colors.tealLight.g, colors.tealLight.b)
  doc.circle(pageWidth - 48, 23, 10, 'F')

  if (logoDataUrl) {
    doc.setFillColor(colors.white.r, colors.white.g, colors.white.b)
    doc.roundedRect(16, 11, 24, 24, 5, 5, 'F')
    doc.addImage(logoDataUrl, 'PNG', 19, 14, 18, 18)
  }

  doc.setTextColor(colors.white.r, colors.white.g, colors.white.b)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(23)
  doc.text(THEME.site.name, 46, 20)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text(THEME.site.tagline, 46, 27)

  doc.setFillColor(colors.white.r, colors.white.g, colors.white.b)
  doc.roundedRect(pageWidth - 64, 13, 46, 18, 5, 5, 'F')
  doc.setTextColor(colors.roseDark.r, colors.roseDark.g, colors.roseDark.b)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text('BOOKING RECEIPT', pageWidth - 58, 20)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.text(formatReceiptId(order.id), pageWidth - 58, 26)

  doc.setFillColor(colors.white.r, colors.white.g, colors.white.b)
  doc.roundedRect(14, 66, pageWidth - 28, 44, 8, 8, 'F')
  doc.setDrawColor(colors.sage.r, colors.sage.g, colors.sage.b)
  doc.setLineWidth(0.5)
  doc.roundedRect(14, 66, pageWidth - 28, 44, 8, 8, 'S')

  drawLabelValue(doc, {
    label: 'Billed To',
    value: order.customer_name,
    x: 22,
    y: 78,
    labelColor: colors.muted,
    valueColor: colors.ink,
  })
  drawLabelValue(doc, {
    label: 'Issue Date',
    value: issueDate,
    x: 110,
    y: 78,
    labelColor: colors.muted,
    valueColor: colors.ink,
  })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(colors.muted.r, colors.muted.g, colors.muted.b)
  doc.text(order.customer_email, 22, 90)
  if (order.customer_phone) {
    doc.text(order.customer_phone, 22, 96)
  }

  drawLabelValue(doc, {
    label: 'Status',
    value: 'Paid',
    x: 110,
    y: 90,
    labelColor: colors.muted,
    valueColor: colors.teal,
  })
  if (order.razorpay_payment_id) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(colors.muted.r, colors.muted.g, colors.muted.b)
    doc.text(`Payment ID: ${order.razorpay_payment_id}`, 110, 102)
  }

  autoTable(doc, {
    startY: 120,
    margin: { left: 14, right: 14 },
    theme: 'grid',
    head: [['Service', 'Package', 'Delivery', 'Amount']],
    body: [[
      'Numerology Reading',
      order.package_name,
      deliveryTime,
      amount,
    ]],
    headStyles: {
      fillColor: [colors.rose.r, colors.rose.g, colors.rose.b],
      textColor: [colors.white.r, colors.white.g, colors.white.b],
      fontStyle: 'bold',
      halign: 'left',
      lineColor: [colors.rose.r, colors.rose.g, colors.rose.b],
    },
    bodyStyles: {
      fillColor: [colors.white.r, colors.white.g, colors.white.b],
      textColor: [colors.ink.r, colors.ink.g, colors.ink.b],
      lineColor: [colors.sage.r, colors.sage.g, colors.sage.b],
      cellPadding: 4,
    },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 58 },
      2: { cellWidth: 52 },
      3: { cellWidth: 26, halign: 'right' },
    },
  })

  const lineItemsBottom = (doc as { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY ?? 150

  doc.setFillColor(colors.roseLight.r, colors.roseLight.g, colors.roseLight.b)
  doc.roundedRect(132, lineItemsBottom + 8, 64, 24, 6, 6, 'F')
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(colors.muted.r, colors.muted.g, colors.muted.b)
  doc.text('TOTAL PAID', 140, lineItemsBottom + 18)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.setTextColor(colors.roseDark.r, colors.roseDark.g, colors.roseDark.b)
  doc.text(amount, 140, lineItemsBottom + 28)

  const featuresRows = features.length
    ? Array.from({ length: Math.ceil(features.length / 2) }, (_, index) => [
        `- ${features[index * 2]}`,
        features[index * 2 + 1] ? `- ${features[index * 2 + 1]}` : '',
      ])
    : [['- Personalized numerology consultation', '']]

  autoTable(doc, {
    startY: lineItemsBottom + 40,
    margin: { left: 14, right: 14 },
    theme: 'grid',
    head: [['Package Inclusions', '']],
    body: featuresRows,
    headStyles: {
      fillColor: [colors.teal.r, colors.teal.g, colors.teal.b],
      textColor: [colors.white.r, colors.white.g, colors.white.b],
      fontStyle: 'bold',
      halign: 'left',
      lineColor: [colors.teal.r, colors.teal.g, colors.teal.b],
    },
    bodyStyles: {
      fillColor: [colors.white.r, colors.white.g, colors.white.b],
      textColor: [colors.ink.r, colors.ink.g, colors.ink.b],
      lineColor: [colors.sage.r, colors.sage.g, colors.sage.b],
      cellPadding: 3.5,
      valign: 'middle',
    },
    columnStyles: {
      0: { cellWidth: 91 },
      1: { cellWidth: 91 },
    },
  })

  const inclusionsBottom = (doc as { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY ?? lineItemsBottom + 84
  const notesTop = inclusionsBottom + 8
  const notesHeight = order.notes ? 28 : 20

  doc.setFillColor(colors.white.r, colors.white.g, colors.white.b)
  doc.roundedRect(14, notesTop, pageWidth - 28, notesHeight, 6, 6, 'F')
  doc.setDrawColor(colors.sage.r, colors.sage.g, colors.sage.b)
  doc.roundedRect(14, notesTop, pageWidth - 28, notesHeight, 6, 6, 'S')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(colors.ink.r, colors.ink.g, colors.ink.b)
  doc.text('Booking Notes', 20, notesTop + 8)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(colors.muted.r, colors.muted.g, colors.muted.b)
  doc.text(
    order.notes || 'No additional notes were shared at the time of booking.',
    20,
    notesTop + 15,
    { maxWidth: pageWidth - 40 }
  )

  const footerY = pageHeight - 24
  doc.setFillColor(colors.roseDark.r, colors.roseDark.g, colors.roseDark.b)
  doc.rect(0, footerY, pageWidth, 24, 'F')
  doc.setTextColor(colors.white.r, colors.white.g, colors.white.b)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.text(
    `${THEME.site.email}  |  ${THEME.site.phone}  |  ${THEME.site.instagram.replace('https://', '')}`,
    pageWidth / 2,
    footerY + 9,
    { align: 'center' }
  )
  doc.text(
    'Thank you for choosing Ccharmy Shah. Your personalized report is now in progress.',
    pageWidth / 2,
    footerY + 16,
    { align: 'center' }
  )

  return {
    doc,
    fileName: getReceiptFileName(order),
  }
}
