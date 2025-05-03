"use client"

import { useState, useEffect } from "react"
import { KeyRound, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface CredentialInfo {
  role: string;
  email: string;
  password: string;
}

export function CredentialsHelper() {
  const [showCredentials, setShowCredentials] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // Start animation on component mount
  useEffect(() => {
    const animationInterval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 1000)
    }, 3000)

    return () => clearInterval(animationInterval)
  }, [])

  const credentialsList: CredentialInfo[] = [
    { role: "Admin", email: "sumanjanaled@gmail.com", password: "Suman@1974" },
    { role: "Editor", email: "abc@gmail.com", password: "Suman@1974" },
    { role: "User", email: "worktodo116@gmail.com", password: "Suman@1974" }
  ]

  return (
    <div className="fixed right-4 top-4 z-50">
      <Button
        size="sm"
        variant="ghost"
        className={`rounded-full h-8 w-8 p-0 relative ${isAnimating ? 'animate-bounce' : ''} border-2 border-red-500 shadow-md`}
        onClick={() => setShowCredentials(!showCredentials)}
      >
        <KeyRound className="h-7 w-7 text-red-600" />
        <span className="absolute right-0 top-0 h-3 w-3 rounded-full bg-red-500 animate-pulse" />
      </Button>

      {showCredentials && (
        <Card className="absolute right-0 top-24 w-[280px] p-4 shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Test Credentials</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0" 
              onClick={() => setShowCredentials(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-3 mt-2">
            {credentialsList.map((cred, index) => (
              <div key={index} className="border rounded-md p-2">
                <div className="flex justify-between items-center mb-1">
                  <Badge 
                    variant={cred.role === "Admin" ? "destructive" : cred.role === "Editor" ? "default" : "secondary"}
                  >
                    {cred.role}
                  </Badge>
                </div>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-mono">{cred.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Password:</span>
                    <span className="font-mono">{cred.password}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}