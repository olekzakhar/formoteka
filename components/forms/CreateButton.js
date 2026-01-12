// components/forms/Header

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { createForm } from '@/server/action'
import { FORMS_PATH } from '@/constants'

export default function FormsCreateButton({ userId }) {
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleCreateForm = async () => {
    setIsCreating(true)
    
    try {
      const { form, error } = await createForm(supabase, userId)
      
      if (error) {
        // console.error('Помилка створення форми:', error)
        alert('Не вдалося створити форму. Спробуйте ще раз.')
        setIsCreating(false)
        return
      }
      
      if (form) {
        // Перенаправляємо на сторінку форми
        router.push(`${FORMS_PATH}/${form.slug}`)
        router.refresh()
      }
    } catch (err) {
      // console.error('Помилка:', err)
      alert('Сталася помилка. Спробуйте ще раз.')
      setIsCreating(false)
    }
  }

  return (
    <Button
      variant="black"
      size="sm-black"
      onClick={handleCreateForm}
      loading={isCreating}
      disabled={isCreating}
    >
      {isCreating ? 'Створення...' : 'Створити форму'}
      Створити форму
    </Button>
  )
}
