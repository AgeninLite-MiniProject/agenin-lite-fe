

interface ErrorStateProps {
  title: string;
  message: string;
  imageSrc: string;
}

export const ErrorState = ({ title, message, imageSrc }: ErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] w-full p-6 text-center">
      <img 
        src={imageSrc} 
        alt="Error Illustration" 
        className="w-48 h-auto mb-6 object-contain drop-shadow-sm" 
      />
      <h2 className="text-xl font-bold text-slate-800 mb-2">{title}</h2>
      <p className="text-sm text-slate-500 max-w-sm mx-auto">{message}</p>
    </div>
  );
};
