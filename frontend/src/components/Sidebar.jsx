import { useChatStore } from '../store/useChatStore'
import { useEffect } from 'react'
import { Users } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import Sidebarskeleton from './skelton/Sidebarskeleton'

const Sidebar = () => {
  const { getUsers, users, selectedUser, isUserLoading } = useChatStore()
  const { onlineUsers } = useAuthStore()
  
  useEffect(() => {
    getUsers();
  }, [getUsers])  

  if (isUserLoading) {
    return <Sidebarskeleton />;
  }

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {users.length > 0 ? (
          users.map((user) => (
            <button
              key={user._id}
              onClick={() => useChatStore.setState({ selectedUser: user })}
              className={`
                w-full p-3 flex items-center gap-3
                hover:bg-base-300 transition-colors
                ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
              `}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.profilePic || "/user.png"}
                  alt={user.fullName}
                  className="size-12 object-cover rounded-full"
                />
              </div>

              {/* User info - only visible on larger screens */}
              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{user.fullName}</div>
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <div className={`size-2 rounded-full ${onlineUsers.includes(user._id) ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="text-center text-zinc-500 py-4">No users found</div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar