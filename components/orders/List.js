// import { Button } from '@/components/ui/button'

export default async function OrdersList({ slug }) {
  return (
    <div className="max-w-[700px] mx-auto">
      <div className="mb-6 px-3 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Заявки</h1>
        </div>
        {/* <Button variant="black" size="sm-black">
          Створити форму
        </Button> */}
      </div>

      {/* {error && (
        <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          Помилка завантаження форм: {error}
        </div>
      )} */}

      <div className="flex flex-col gap-4">
        Slug form: {slug}
      </div>
      <div>mknjk</div>
      <div>mknjk</div>
      <div>mknjk</div>
      {/* <div className="flex flex-col gap-4">
        {forms.map((form) => (
          <FormCard key={form.id} form={form} />
        ))}
      </div> */}
    </div>
  )
}
