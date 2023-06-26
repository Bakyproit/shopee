import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from 'react-query'
import Input from 'src/components/Input'
// import { getRules } from 'src/utils/rule'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema, Schema } from 'src/utils/rule'
import { registerAccount } from 'src/apis/auth.api'
import { omit } from 'lodash'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponse } from 'src/types/utils.type'
import { useContext } from 'react'
import { AppContext } from 'src/context/app.context'
import Button from 'src/components/Button'
import path from 'src/constants/path'

// interface FormData {
//   email: string
//   password: string
//   confirm_password: string
// }

type FormData = Schema

export default function Register() {
  const { setIsAuthenticated  , setProfile} = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    // getValues,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  })

  //api
  const registerAccountMution = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => registerAccount(body)
  })
  // const rules = getRules(getValues)
  const onSubmit = handleSubmit((data) => {
    const body = omit(data, ['confirm_password'])
    registerAccountMution.mutate(body, {
      onSuccess: (data) => {
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
        navigate('/')
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<Omit<FormData, 'confirm_password'>>>(error)) {
          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof Omit<FormData, 'confirm_password'>, {
                message: formError[key as keyof Omit<FormData, 'confirm_password'>],
                type: 'Server'
              })
            })
          }
          // if (formError?.email) {
          //   setError('email', {
          //     message: formError.email,
          //     type: 'Server'
          //   })
          // }
          // if (formError?.password) {
          //   setError('password', {
          //     message: formError.password,
          //     type: 'Server'
          //   })
          // }
        }
      }
    })
  })

  return (
    <div>
      <div className='bg-orange'>
        <div className='container'>
          <div className='lg:grid-cols-5.lg:py-32 grid grid-cols-1 py-12 lg:pr-10'>
            <div className='w-96 lg:col-span-2 lg:col-start-4'>
              <form className='rounded bg-white p-8 shadow-sm' onSubmit={onSubmit} noValidate>
                <div className='text-2xl'>Đăng ký</div>
                <Input
                  name='email'
                  register={register}
                  type='email'
                  className='mt-8'
                  errorMessage={errors.email?.message}
                  placeholder='Email'
                  // rules={rules.email}
                />
                <Input
                  name='password'
                  register={register}
                  type='password'
                  className='mt-2'
                  errorMessage={errors.password?.message}
                  placeholder='Password'
                  // rules={rules.password}
                />
                <Input
                  name='confirm_password'
                  register={register}
                  type='password'
                  className='mt-2'
                  errorMessage={errors.confirm_password?.message}
                  placeholder='Nhập lại password'
                  // rules={rules.confirm_password}
                />
                <div className='mt-2'>
                  <Button
                    type='submit'
                    isLoading={registerAccountMution.isLoading}
                    disabled={registerAccountMution.isLoading}
                    className='flex h-10 w-full items-center  justify-center bg-red-500 px-2 py-3 text-center text-sm uppercase text-white hover:bg-red-600'
                  >
                    Đăng ký
                  </Button>
                </div>
                <div className='mt-8 flex justify-center '>
                  <span className='text-gray-400'>Bạn đã có tài khoản ? </span>
                  <Link className='text-red-400' to={path.login}>
                    Đăng nhập
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
