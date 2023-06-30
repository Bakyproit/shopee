import { yupResolver } from '@hookform/resolvers/yup'
// import { Omit } from 'lodash'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { Link, useNavigate } from 'react-router-dom'
import authApi from 'src/apis/auth.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import path from 'src/constants/path'
import { AppContext } from 'src/context/app.context'
import { ErrorResponse } from 'src/types/utils.type'
import { Schema, schema } from 'src/utils/rule'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'

type FormData = Pick<Schema, 'email' | 'password'>
const loginSchema = schema.pick(['email', 'password'])

export default function Login() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  //validate
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema)
  })
  // const rules = getRules()
  //api
  const loginMution = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => authApi.login(body)
  })
  const onSubmit = handleSubmit((data) => {
    // console.log('data', data)
    loginMution.mutate(data, {
      onSuccess: (data) => {
        // console.log(data)
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
        navigate('/')
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof FormData, {
                message: formError[key as keyof FormData],
                type: 'Server'
              })
            })
          }
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
              <form className=' rounded bg-white p-8 shadow-sm' onSubmit={onSubmit} noValidate>
                <div className='text-2xl'>Đăng nhập</div>
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
                  className='mt-3'
                  errorMessage={errors.password?.message}
                  placeholder='Password'
                  // rules={rules.password}
                />
                <div className='mt-3'>
                  <Button
                    disabled={loginMution.isLoading}
                    isLoading={loginMution.isLoading}
                    type='submit'
                    className='flex h-10 w-full items-center  justify-center bg-red-500 px-2 py-3 text-center text-sm uppercase text-white hover:bg-red-600'
                  >
                    Đăng nhập
                  </Button>
                </div>
                <div className='mt-8 flex justify-center'>
                  <span className='text-gray-400'>Bạn chưa có tài khoản ? </span>
                  <Link className='text-red-400' to={path.register}>
                    Đăng ký
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
