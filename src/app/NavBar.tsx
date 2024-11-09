'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverPanel,
  useClose
} from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { 
  Heart,
  Brain,
  Stethoscope,
  Bone,
  Baby,
  Scissors,
  FlaskConical,
  Pill,
  Radio,
  Eye,
  Syringe,
  HandCoins,
  Banknote,
  HeartPulse,
  Microscope,
  Ambulance,
  Users,
  BrainCircuit,
  BoneIcon,
  Ear,
  TestTube,
  Backpack,
  Radiation,
  Slice,
  Banana,
  Shield,
  Dna,
  Activity,
  Zap,
  BrainCog,
  Drill,
} from 'lucide-react'

const specialties = [
{ name: 'Anesthesiology',  color: '#FF6B6B', href: '/compensation/aggregated?specialty=cardiology', icon: HeartPulse }, 
{ name: 'Dermatology',  color: '#4ECDC4', href: '/compensation/aggregated?specialty=cardiology', icon:  Syringe}, 
{ name: 'Emergency Medicine',  color: '#45B7D1', href: '/compensation/aggregated?specialty=cardiology', icon: Ambulance }, 
{ name: 'Family Medicine',  color: '#96CEB4', href: '/compensation/aggregated?specialty=cardiology', icon: Users }, 
{ name: 'Internal Medicine',  color: '#FFEEAD', href: '/compensation/aggregated?specialty=cardiology', icon: Stethoscope }, 
{ name: 'Neurology',  color: '#D4A5A5', href: '/compensation/aggregated?specialty=cardiology', icon: Brain }, 
{ name: 'Obstetrics and Gynecology',  color: '#FFB6B9', href: '/compensation/aggregated?specialty=cardiology', icon: Baby }, 
{ name: 'Ophthalmology',  color: '#957DAD', href: '/compensation/aggregated?specialty=cardiology', icon: Eye }, 
{ name: 'Orthopaedic Surgery',  color: '#9DE0AD', href: '/compensation/aggregated?specialty=cardiology', icon: Bone }, 
{ name: 'Otolaryngology',  color: '#45B7D1', href: '/compensation/aggregated?specialty=cardiology', icon: Ear }, 
{ name: 'Pathology',  color: '#FF9999', href: '/compensation/aggregated?specialty=cardiology', icon: Microscope }, 
{ name: 'Pediatrics',  color: '#FFB347', href: '/compensation/aggregated?specialty=cardiology', icon:  Backpack}, 
{ name: 'Psychiatry',  color: '#C3B1E1', href: '/compensation/aggregated?specialty=cardiology', icon: BrainCircuit }, 
{ name: 'Radiology',  color: '#A8E6CF', href: '/compensation/aggregated?specialty=cardiology', icon:  Radio}, 
{ name: 'Surgery',  color: '#FF6B6B', href: '/compensation/aggregated?specialty=cardiology', icon: Slice }, 
{ name: 'Urology',  color: '#87CEEB', href: '/compensation/aggregated?specialty=cardiology', icon: Banana }, 
{ name: 'Medical Genetics and Genomics',  color: '#4B0082', href: '/compensation/aggregated?specialty=cardiology', icon: Dna }, 
{ name: 'Nuclear Medicine',  color: '#20B2AA', href: '/compensation/aggregated?specialty=cardiology', icon: Radiation }, 
{ name: 'Physical Medicine and Rehabilitation',  color: '#8FBC8F', href: '/compensation/aggregated?specialty=cardiology', icon: Activity }, 
{ name: 'Plastic Surgery',  color: '#DDA0DD', href: '/compensation/aggregated?specialty=cardiology', icon: Scissors }, 
{ name: 'Public Health and General Preventive Medicine',  color: '#B8860B', href: '/compensation/aggregated?specialty=cardiology', icon: Shield }, 
{ name: 'Radiation Oncology',  color: '#CD853F', href: '/compensation/aggregated?specialty=cardiology', icon: Zap }, 
{ name: 'Thoracic Surgery',  color: '#8B4513', href: '/compensation/aggregated?specialty=cardiology', icon: Heart }, 
{ name: 'Neurological Surgery',  color: '#800000', href: '/compensation/aggregated?specialty=cardiology', icon: BrainCog }, 
{ name: 'Colon and Rectcal Surgery',  color: '#8B0000', href: '/compensation/aggregated?specialty=cardiology', icon: Drill }, 
];

const callsToAction = [
  { name: 'Add Salary', color: '', href: '/submit', icon: HandCoins },
  { name: 'View Salaries', color: '', href: '/compensation/aggregated', icon: Banknote },
]

const SpecialtiesPopover = () => {
  const [isOpen, setIsOpen] = useState(false)
  const timeoutRef = useRef(null)
  const popoverRef = useRef(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 100) // Small delay to allow moving to popover panel
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const splitSpecialties = () => {
    const itemsPerColumn = Math.ceil(specialties.length / 3)
    return [
      specialties.slice(0, itemsPerColumn),
      specialties.slice(itemsPerColumn, itemsPerColumn * 2),
      specialties.slice(itemsPerColumn * 2)
    ]
  }

  const columns = splitSpecialties()

  return (
    <Popover className="relative" ref={popoverRef}>
      <PopoverButton
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="group inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900 hover:text-vibrant-teal focus:outline-none"
      >
        <span>Specialties</span>
        <ChevronDownIcon
          className={`h-5 w-5 flex-none text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </PopoverButton>

      {isOpen && (
        <PopoverPanel
  static
  onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseLeave}
  className="absolute left-0 top-full z-10 mt-2 w-screen max-w-2xl overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-gray-900/5"
>
  <div className="px-3 pt-4 pb-4">
    <div className="grid grid-cols-3 gap-x-4 gap-y-1">
      {columns.map((column, columnIndex) => (
        <div key={columnIndex}>
          {column.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group flex items-center gap-x-3 py-2 px-3 text-sm text-gray-700"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex h-6 w-6 flex-none items-center justify-center">
                <item.icon className="h-4 w-4 text-gray-400 group-hover:text-gray-900"/>
              </div>
              <span className="group-hover:text-gray-900">
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      ))}
    </div>
  </div>
  
  <div className="bg-gray-100">
    <div className="grid grid-cols-2 divide-x divide-gray-900/5">
      {callsToAction.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className="flex items-center justify-center gap-x-2.5 px-3 py-4 text-sm font-medium text-gray-900 hover:bg-gray-200"
          onClick={() => setIsOpen(false)}
        >
          <item.icon className="h-4 w-4 flex-none text-gray-400" />
          {item.name}
        </Link>
      ))}
    </div>
  </div>
  </PopoverPanel>
  )}
</Popover>
)
}

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white max-w-6xl mx-auto">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <Link href="/" className="flex items-center">
            <span className="sr-only">ClearMD</span>
            <img
              className="h-6 w-auto"
              src="/logo-large.png"
              alt="ClearMD Logo"
            />
          </Link>
          <div className="hidden lg:ml-8 lg:flex lg:gap-x-8">
            <SpecialtiesPopover />
          </div>
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Link
            href="/submit"
            className="text-sm font-semibold leading-6 text-gray-900 hover:text-vibrant-teal transition-colors"
          >
            Add Salary <span aria-hidden="true">→</span>
          </Link>
        </div>
      </nav>
      
      {/* Mobile menu - keeping your existing implementation */}
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">ClearMD</span>
              <img
                className="h-8 w-auto"
                src="/logo-large.png"
                alt="ClearMD Logo"
              />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <Disclosure as="div" className="-mx-3">
                  <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                    Specialties
                    <ChevronDownIcon className="h-5 w-5 flex-none group-data-[open]:rotate-180" aria-hidden="true" />
                  </DisclosureButton>
                  <DisclosurePanel className="mt-2 space-y-2">
                    {[...specialties, ...callsToAction].map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-x-3 rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <item.icon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
                        {item.name}
                      </Link>
                    ))}
                  </DisclosurePanel>
                </Disclosure>
              </div>
              <div className="py-6">
                <Link
                  href="/submit"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Add Salary
                </Link>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}