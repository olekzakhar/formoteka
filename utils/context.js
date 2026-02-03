'use client'

import { createContext, useContext, useState } from "react"

// const initStoresContext = { all: [], current: null }
// const StoresContext = createContext(initStoresContext)

// export function StoresProvider({ children, currentStores }) {
//   const [stores, setStores] = useState(currentStores)

//   return (
//     <StoresContext.Provider value={{ stores, setStores }}>
//       {children}
//     </StoresContext.Provider>
//   )
// }

// export function useStoresContext() {
//   return useContext(StoresContext)
// }


// const initAllStoresContext = []
// const AllStoresContext = createContext(initAllStoresContext)

// export function AllStoresProvider({ children, allStoresArray }) {
//   const [allStores, setAllStores] = useState(allStoresArray)

//   return (
//     <AllStoresContext.Provider value={{ allStores, setAllStores }}>
//       {children}
//     </AllStoresContext.Provider>
//   )
// }

// export function useAllStoresContext() {
//   return useContext(AllStoresContext)
// }


// const initSimulationContext = { url: '' }
// const SimulationContext = createContext(initSimulationContext)

// export function SimulationProvider({ children, settings }) {
//   const [simulation, setSimulation] = useState(settings)

//   return (
//     <SimulationContext.Provider value={{ simulation, setSimulation }}>
//       {children}
//     </SimulationContext.Provider>
//   )
// }

// export function useSimulationContext() {
//   return useContext(SimulationContext)
// }


// const initCategoriesContext = []
// const CategoriesContext = createContext(initCategoriesContext)

// export function CategoriesProvider({ children, allCategories }) {
//   const [categories, setCategories] = useState(allCategories)

//   return (
//     <CategoriesContext.Provider value={{ categories, setCategories }}>
//       {children}
//     </CategoriesContext.Provider>
//   )
// }

// export function useCategoriesContext() {
//   return useContext(CategoriesContext)
// }


const initCategoriesContext = []
const CategoriesContext = createContext(initCategoriesContext)

export function CategoriesProvider({ children, allCategories }) {
  const [categories, setCategories] = useState(allCategories)

  return (
    <CategoriesContext.Provider value={{ categories, setCategories }}>
      {children}
    </CategoriesContext.Provider>
  )
}

export function useCategoriesContext() {
  return useContext(CategoriesContext)
}


const initLineItemsContext = {}
const LineItemsContext = createContext(initLineItemsContext)

export function LineItemsProvider({ children, allLineItems }) {
  const [lineItems, setLineItems] = useState(allLineItems)

  return (
    <LineItemsContext.Provider value={{ lineItems, setLineItems }}>
      {children}
    </LineItemsContext.Provider>
  )
}

export function useLineItemsContext() {
  return useContext(LineItemsContext)
}


const initSettingsContext = {}
const SettingsContext = createContext(initSettingsContext)

export function SettingsProvider({ children, initSettings }) {
  const [settings, setSettings] = useState(initSettings)

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettingsContext() {
  return useContext(SettingsContext)
}


const initFormContext = {}
const FormContext = createContext(initFormContext)

export function FormProvider({ children, initForm }) {
  const [form, setForm] = useState(initForm)

  return (
    <FormContext.Provider value={{ form, setForm }}>
      {children}
    </FormContext.Provider>
  )
}

export function useFormContext() {
  return useContext(FormContext)
}


const initFormsContext = []
const FormsContext = createContext(initFormsContext)

export function FormsProvider({ children, allForms }) {
  const [forms, setForms] = useState(allForms)

  return (
    <FormsContext.Provider value={{ forms, setForms }}>
      {children}
    </FormsContext.Provider>
  )
}

export function useFormsContext() {
  return useContext(FormsContext)
}
