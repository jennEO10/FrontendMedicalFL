interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({
  message = "Cargando...",
}: LoadingScreenProps) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-lg text-gray-600 dark:text-gray-400">{message}</p>
      </div>
    </div>
  );
}
