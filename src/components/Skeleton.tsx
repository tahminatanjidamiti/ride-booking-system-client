import clsx from "clsx";

interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      className={clsx(
        "animate-pulse rounded-md bg-gray-300/60 dark:bg-gray-700/60",
        className
      )}
    />
  );
}