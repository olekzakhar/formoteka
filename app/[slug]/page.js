// export default async function FormSlug({ params }) {
//   const { slug } = await params;
  
//   return (
//     <div>
//       Slug name: {slug}
//     </div>
//   );
// }






// import { notFound } from 'next/navigation'
// // import {
// //   SettingsProvider,
// //   FormProvider,
// //   CategoriesProvider,
// //   ProductsProvider
// // } from '@/utils/context'
// import { createClient } from '@/utils/supabase/server'
// import { getForm } from '@/server/action'
// // import { getSheetData } from '@/server/actionSheet'

// // import ThemesDefaultPage from '@/components/slug/themes/default/page'


// // const getCategoriesWithProducts = array => {
// //   return array?.reduce((acc, item) => {
// //     const category = item.category.toLowerCase().replace(' ', '_')

// //     if (!acc[category]) {
// //       acc[category] = []
// //     }

// //     acc[category].push(item)

// //     return acc
// //   }, {})
// // }

// export default async function SlugTemplate({ params, searchParams }) {
//   const { slug } = await params
//   const supabase = await createClient()
//   const { form, error } = await getForm(supabase, slug)

//   // let currentSettings
//   // let currentProducts
//   // let currentCategories

//   // if (!error) {
//   //   const { settings, products, categories } = await getSheetData(form.sheet_url)

//   //   currentSettings = settings
//   //   currentProducts = products
//   //   currentCategories = categories
//   // } else {
//   //   notFound()
//   // }

//   return (
//     // <FormProvider initForm={form}>
//     //   <SettingsProvider initSettings={currentSettings}>
//     //     <CategoriesProvider allCategories={currentCategories}>
//     //       <ProductsProvider allProducts={getCategoriesWithProducts(currentProducts)}>
//     //         <ThemesDefaultPage slug={slug} searchParams={searchParams} />
//     //       </ProductsProvider>
//     //     </CategoriesProvider>
//     //   </SettingsProvider>
//     // </FormProvider>
//     <div>
//       Slug: {slug}
//       <div>{form?.name}</div>
//       <div>{form?.is_public ? 'TRUE' : 'FALSE'}</div>

//       <div className="px-3 py-1.5 absolute bottom-4 right-4 bg-indigo-600 text-white/80 text-xs font-semibold rounded-full">Працює на Formoteka</div>
//     </div>
//   )
// }


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
