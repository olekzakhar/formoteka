// app/[slug]/page

import { notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getForm } from '@/server/action'
import { FormRenderer } from '@/components/form-builder/FormRenderer'

// Server Action для обробки order
async function handleFormOrder(data) {
  'use server'
  
  try {
    const supabase = await createClient()
    
    // Зберігаємо order в БД
    console.log('orderData', data)
    // const { error: insertError } = await supabase
    //   .from('form_orders')
    //   .insert({
    //     form_slug: data.orderData.formSlug,
    //     submitted_at: data.orderData.submittedAt,
    //     fields: data.orderData.fields,
    //     products: data.orderData.products,
    //     products_total: data.orderData.productsTotal,
    //   })

    // if (insertError) {
    //   console.error('Error saving order:', insertError)
    //   throw insertError
    // }

    // TODO: Відправити email якщо потрібно
    // await sendEmail({
    //   to: form.notification_email,
    //   subject: `New order for ${form.name}`,
    //   data: data.orderData,
    // })

    console.log('Form submitted successfully:', data)
    return { success: true }
  } catch (err) {
    console.error('Order error:', err)
    return { success: false, error: err.message }
  }
}

// Metadata для SEO
export async function generateMetadata({ params }) {
  const { slug } = await params
  const supabase = await createClient()
  const { form, error } = await getForm(supabase, slug)
  
  if (error || !form) {
    return {
      title: 'Form Not Found',
    }
  }

  return {
    title: form.name,
    description: form.description || `Fill out ${form.name}`,
  }
}

export default async function SlugTemplate({ params }) {
  const { slug } = await params
  const supabase = await createClient()
  const { form, error } = await getForm(supabase, slug)

  if (error || !form) {
    notFound()
  }

  // Перевірка чи форма публічна
  if (!form.is_public) {
    notFound()
  }

  return (
    <>
      <FormRenderer
        blocks={form?.form_data?.blocks || []}
        successBlocks={form?.success_message || []}
        submitButtonText={form?.form_data?.submitButtonText || 'Надіслати'}
        formDesign={form?.settings?.design || {
          backgroundColor: 'bg-background',
          textColor: 'text-foreground',
          headingColor: 'text-foreground',
          fontSize: 'medium',
          headingSize: 'large',
          stickyButton: false,
        }}
        formSlug={slug}
        formName={form.name}
        isPreview={false}
        onSubmitSuccess={handleFormOrder}
      />
      
      {/* Брендинг */}
      <div className="fixed bottom-4 right-4 px-3 py-1.5 bg-indigo-600 text-white/80 text-xs font-semibold rounded-full z-50">
        Працює на Formoteka
      </div>
    </>
  )
}
