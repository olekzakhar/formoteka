import Link from 'next/link'
import { cn } from '@/utils'

export default function BackLink({ path, pathName, className=undefined, backLink=undefined }) {
  const classes = '-ml-5 flex justify-center items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-800 cursor-pointer'
  const arrowLeftIcon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 lucide lucide-arrow-left"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg>

  return (
    <>
      {backLink
        ? <button
            onClick={() => backLink()}
            className={cn(
              classes,
              className
          )}>
            {arrowLeftIcon}
            Back to {pathName}
          </button>
        : <Link
            href={path}
            className={cn(
              classes,
              className
            )}>
            {arrowLeftIcon}
            Назад до {pathName}
          </Link>
      }
    </>
  )
}
