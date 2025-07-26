import { checkMaintenanceMode } from '@/lib/server-utils'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const isMaintenanceMode = await checkMaintenanceMode()
    return NextResponse.json({ maintenanceMode: isMaintenanceMode })
  }
  catch (error) {
    console.error('Error checking maintenance mode:', error)
    return NextResponse.json({ maintenanceMode: false })
  }
}
