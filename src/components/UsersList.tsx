import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Users } from 'lucide-react'

interface Profile {
  id: string
  user_id: string
  full_name: string | null
  email: string | null
  avatar_url: string | null
  created_at: string
}

interface UserRole {
  id: string
  user_id: string
  role: string
  created_at: string
}

const UsersList = () => {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [userRoles, setUserRoles] = useState<UserRole[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProfiles()
    fetchUserRoles()
    
    // Set up real-time subscriptions
    const profilesChannel = supabase
      .channel('profiles-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          console.log('Profile change received:', payload)
          
          if (payload.eventType === 'INSERT') {
            setProfiles(current => [...current, payload.new as Profile])
          } else if (payload.eventType === 'UPDATE') {
            setProfiles(current => 
              current.map(profile => 
                profile.id === payload.new.id ? payload.new as Profile : profile
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setProfiles(current => 
              current.filter(profile => profile.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    const rolesChannel = supabase
      .channel('user-roles-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_roles'
        },
        (payload) => {
          console.log('User role change received:', payload)
          
          if (payload.eventType === 'INSERT') {
            setUserRoles(current => [...current, payload.new as UserRole])
          } else if (payload.eventType === 'UPDATE') {
            setUserRoles(current => 
              current.map(role => 
                role.id === payload.new.id ? payload.new as UserRole : role
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setUserRoles(current => 
              current.filter(role => role.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(profilesChannel)
      supabase.removeChannel(rolesChannel)
    }
  }, [])

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProfiles(data || [])
    } catch (error) {
      console.error('Error fetching profiles:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUserRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')

      if (error) throw error
      setUserRoles(data || [])
    } catch (error) {
      console.error('Error fetching user roles:', error)
    }
  }

  const getUserRole = (userId: string) => {
    const role = userRoles.find(r => r.user_id === userId)
    return role?.role || 'buyer'
  }

  const getInitials = (name: string | null) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading users...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Users ({profiles.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {profiles.length === 0 ? (
            <p className="text-muted-foreground">No users yet. Sign up to see real-time updates!</p>
          ) : (
            profiles.map((profile) => (
              <div key={profile.id} className="flex items-center space-x-4 p-3 rounded-lg border">
                <Avatar>
                  <AvatarImage src={profile.avatar_url || undefined} />
                  <AvatarFallback>{getInitials(profile.full_name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {profile.full_name || 'Anonymous User'}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {profile.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Joined {new Date(profile.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant={getUserRole(profile.user_id) === 'seller' ? 'default' : 'secondary'}>
                  {getUserRole(profile.user_id)}
                </Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default UsersList