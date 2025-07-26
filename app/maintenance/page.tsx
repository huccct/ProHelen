import { FaWrench } from 'react-icons/fa'

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8 max-w-md mx-auto">
        <div className="flex justify-center">
          <div className="p-4 bg-muted rounded-full">
            <FaWrench className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Maintenance Mode</h1>
          <p className="text-muted-foreground text-lg">
            We are currently performing system maintenance. Please try again later.
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          Estimated maintenance time: 30 minutes
        </div>
        <div className="pt-4">
          <div className="inline-flex items-center space-x-2 text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm">Maintenance in progress</span>
          </div>
        </div>
      </div>
    </div>
  )
}
