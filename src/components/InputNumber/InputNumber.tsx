import { InputHTMLAttributes, forwardRef } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
}
//ref
const InputNumber = forwardRef<HTMLInputElement, Props>(function InputNumberInner(
  {
    errorMessage,
    className,
    classNameError = 'mt-1 min-h-[1.25rem] text-sm text-red-600',
    classNameInput = 'h-10 w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm text-sm',
    onChange,
    ...rest
  },
  ref
) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if ((/^\d+$/.test(value) || value === '') && onChange) {
      onChange(event)
    }
  }
  return (
    <div>
      <div className={className}>
        <input className={classNameInput} {...rest} onChange={handleChange} ref={ref} />
        <div className={classNameError}>{errorMessage}</div>
      </div>
    </div>
  )
})

export default InputNumber
