// export default async function FormSlug({ params }) {
//   const { slug } = await params;
  
//   return (
//     <div>
//       Slug name: {slug}
//     </div>
//   );
// }






import { notFound } from 'next/navigation'
// import {
//   SettingsProvider,
//   FormProvider,
//   CategoriesProvider,
//   ProductsProvider
// } from '@/utils/context'
import { createClient } from '@/utils/supabase/server'
import { getForm } from '@/server/action'
// import { getSheetData } from '@/server/actionSheet'

// import ThemesDefaultPage from '@/components/slug/themes/default/page'


// const getCategoriesWithProducts = array => {
//   return array?.reduce((acc, item) => {
//     const category = item.category.toLowerCase().replace(' ', '_')

//     if (!acc[category]) {
//       acc[category] = []
//     }

//     acc[category].push(item)

//     return acc
//   }, {})
// }

export default async function SlugTemplate({ params, searchParams }) {
  const { slug } = await params
  const supabase = await createClient()
  const { form, error } = await getForm(supabase, slug)

  // let currentSettings
  // let currentProducts
  // let currentCategories

  // if (!error) {
  //   const { settings, products, categories } = await getSheetData(form.sheet_url)

  //   currentSettings = settings
  //   currentProducts = products
  //   currentCategories = categories
  // } else {
  //   notFound()
  // }

  return (
    // <FormProvider initForm={form}>
    //   <SettingsProvider initSettings={currentSettings}>
    //     <CategoriesProvider allCategories={currentCategories}>
    //       <ProductsProvider allProducts={getCategoriesWithProducts(currentProducts)}>
    //         <ThemesDefaultPage slug={slug} searchParams={searchParams} />
    //       </ProductsProvider>
    //     </CategoriesProvider>
    //   </SettingsProvider>
    // </FormProvider>
    <div>
      Slug: {slug}
      <div>{form?.name}</div>
      <div>{form?.is_public ? 'TRUE' : 'FALSE'}</div>

      <div className="px-3 py-1.5 absolute bottom-4 right-4 bg-indigo-600 text-white/80 text-xs font-semibold rounded-full">Працює на Formoteka</div>
    </div>
  )
}
