const NotAdminPage = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">You are not an admin</h1>
      <p className="text-sm text-gray-500">Please contact support if you think this is an error</p>
    </div>
  )
}

export default NotAdminPage
