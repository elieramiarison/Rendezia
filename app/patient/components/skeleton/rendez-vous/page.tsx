import Skeleton from 'react-loading-skeleton';

export default function SkeletonCard() {
    return (
        <div className="p-4 border rounded-md shadow-md bg-white dark:bg-gray-800">
            <div className="mb-2">
                <Skeleton height={20} width={`60%`} />
                <Skeleton height={20} width={`80%`} />
            </div>
            <div className="mb-2">
                <Skeleton height={15} width={`100%`} />
                <Skeleton height={15} width={`90%`} />
                <Skeleton height={15} width={`95%`} />
            </div>
            <div className="flex gap-2 mt-3">
                <Skeleton height={36} width={`50%`} />
                <Skeleton height={36} width={`50%`} />
            </div>
        </div>
    );
}
