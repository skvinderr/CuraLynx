import { motion } from 'framer-motion'

interface SecureMessagesCardProps {
  unreadCount: number
}

export function SecureMessagesCard({ unreadCount }: SecureMessagesCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg border-2 border-purple-100 overflow-hidden"
    >
      {/* Header */}
      <div className="px-8 py-6 border-b-2 border-purple-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl">
            💬
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Secure Messages</h2>
            <p className="text-xs text-gray-600 font-medium">HIPAA-compliant messaging</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-10 text-center space-y-6">
        <div className="inline-block p-4 bg-purple-100 rounded-full">
          <span className="text-4xl">📧</span>
        </div>

        <div>
          <p className="text-2xl text-gray-900 font-black">
            You have{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
            </span>
          </p>
          <p className="text-sm text-gray-600 mt-2 font-medium">
            Check your inbox to stay updated with your care team.
          </p>
        </div>

        <button className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition-all text-base">
          View My Inbox
        </button>
      </div>
    </motion.div>
  )
}
