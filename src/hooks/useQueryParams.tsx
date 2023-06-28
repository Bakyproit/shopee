import { useSearchParams } from 'react-router-dom'
//lay params tren search
export default function useQueryParams() {
  const [searchParams] = useSearchParams()
  return Object.fromEntries([...searchParams])
}
