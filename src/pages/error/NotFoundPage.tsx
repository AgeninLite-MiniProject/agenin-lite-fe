import { ErrorState } from "@/components/ui/ErrorState";
import Image400 from "@/assets/400-page.webp";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center">
      <ErrorState 
        title="Halaman Tidak Ditemukan" 
        message="Maaf, halaman yang Anda tuju tidak tersedia atau telah dipindahkan." 
        imageSrc={Image400} 
      />
    </div>
  );
};

export default NotFoundPage;
