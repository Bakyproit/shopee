import { InputHTMLAttributes } from 'react'
import type { UseFormRegister, RegisterOptions } from 'react-hook-form'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>
  rules?: RegisterOptions
}

export default function Input({
  errorMessage,
  className,
  name,
  register,
  rules,
  classNameError = 'mt-1 min-h-[1.25rem] text-sm text-red-600',
  classNameInput = 'h-10 w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm text-sm',
  ...rest
}: Props) {
  const registerResult = register && name ? register(name, rules) : null
  return (
    <div>
      <div className={className}>
        <input className={classNameInput} {...registerResult} {...rest} />
        <div className={classNameError}>{errorMessage}</div>
      </div>
    </div>
  )
}
