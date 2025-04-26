import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function SkeletonProfil() {
    return (
        <main className="bg-gray-100 w-full h-full mx-auto">
            <div className="pt-12">
                <div className="flex md:flex-row flex-col md:items-center items-start justify-between px-7 mt-10 gap-4 w-[87%] md:h-32 h-auto bg-white rounded-md border-b-4 border-b-[#08a6a0] mx-auto">
                    <div className="flex items-center justify-start gap-4 md:mt-0 mt-4">
                        <Skeleton circle width={96} height={96} /> {/* image profil */}
                        <Skeleton height={28} width={200} />       {/* nom complet */}
                    </div>

                    <div className="md:flex hidden">
                        <Skeleton height={40} width={160} />       {/* bouton desktop */}
                    </div>

                    <div className="md:hidden block mb-4">
                        <Skeleton height={24} width={120} />       {/* lien mobile */}
                    </div>
                </div>
            </div>

            <div className="pt-7 w-[87%] mx-auto">
                <Skeleton height={24} width={200} className="mb-4" /> {/* titre "Infos personnelles" */}

                <div className="grid grid-cols-2 gap-4">
                    {[...Array(7)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-white py-6 px-2 cursor-pointer mt-5 rounded-md shadow-md"
                        >
                            <Skeleton height={20} width={120} className="mb-2" />
                            <Skeleton height={18} width={160} className="mb-2" />
                            <Skeleton count={2} height={14} width={`95%`} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-[#e0f5f4] mt-5 p-3 w-[87%] mx-auto">
                <Skeleton height={16} width={`60%`} />
            </div>
        </main>
    );
}
