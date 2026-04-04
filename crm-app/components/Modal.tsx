'use client'

export function Modal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

export function ConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  isDangerous = false,
}: {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  title: string
  message: string
  isDangerous?: boolean
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full mx-4">
        <div className="p-6">
          <h2 className="text-lg font-bold mb-2">{title}</h2>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex gap-4">
            <button
              onClick={onCancel}
              className="btn btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`btn ${isDangerous ? 'btn-danger' : 'btn-primary'} flex-1`}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
