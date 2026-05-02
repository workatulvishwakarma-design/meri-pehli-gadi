'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Search, Navigation, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'

/* ─── City Data ──────────────────────────────────────────── */

interface City {
  name: string
  state: string
  slug: string
  isPopular?: boolean
}

const cities: City[] = [
  { name: 'Dibrugarh', state: 'Assam', slug: 'dibrugarh', isPopular: true },
  { name: 'Guwahati', state: 'Assam', slug: 'guwahati', isPopular: true },
  { name: 'Jorhat', state: 'Assam', slug: 'jorhat', isPopular: true },
  { name: 'Tinsukia', state: 'Assam', slug: 'tinsukia' },
  { name: 'Tezpur', state: 'Assam', slug: 'tezpur' },
  { name: 'Silchar', state: 'Assam', slug: 'silchar', isPopular: true },
  { name: 'Shillong', state: 'Meghalaya', slug: 'shillong' },
  { name: 'Imphal', state: 'Manipur', slug: 'imphal' },
  { name: 'Agartala', state: 'Tripura', slug: 'agartala' },
  { name: 'Mumbai', state: 'Maharashtra', slug: 'mumbai', isPopular: true },
  { name: 'Delhi NCR', state: 'Delhi', slug: 'delhi-ncr', isPopular: true },
  { name: 'Bangalore', state: 'Karnataka', slug: 'bangalore', isPopular: true },
  { name: 'Pune', state: 'Maharashtra', slug: 'pune' },
  { name: 'Hyderabad', state: 'Telangana', slug: 'hyderabad' },
  { name: 'Kolkata', state: 'West Bengal', slug: 'kolkata', isPopular: true },
  { name: 'Chennai', state: 'Tamil Nadu', slug: 'chennai' },
]

/* ─── Component ──────────────────────────────────────────── */

export function CityModal() {
  const [search, setSearch] = useState('')
  const showCityModal = useAppStore((s) => s.showCityModal)
  const setShowCityModal = useAppStore((s) => s.setShowCityModal)
  const setSelectedCity = useAppStore((s) => s.setSelectedCity)
  const selectedCity = useAppStore((s) => s.selectedCity)

  const filteredCities = useMemo(() => {
    if (!search.trim()) return cities
    const q = search.toLowerCase()
    return cities.filter(
      (c) => c.name.toLowerCase().includes(q) || c.state.toLowerCase().includes(q),
    )
  }, [search])

  const popularCities = useMemo(
    () => filteredCities.filter((c) => c.isPopular),
    [filteredCities],
  )

  const otherCities = useMemo(
    () => filteredCities.filter((c) => !c.isPopular),
    [filteredCities],
  )

  const handleSelectCity = (city: City) => {
    setSelectedCity(city.slug)
  }

  const handleDetectLocation = () => {
    setSelectedCity('dibrugarh')
  }

  const isSelected = (city: City) => selectedCity === city.slug

  return (
    <Dialog open={showCityModal} onOpenChange={setShowCityModal}>
      <DialogContent className="sm:max-w-[560px] max-h-[85vh] overflow-y-auto p-0">
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-r from-[#0a1628] to-[#1e3a5f] px-6 py-5 rounded-t-lg">
          <DialogHeader>
            <DialogTitle className="text-white text-lg font-bold flex items-center gap-2">
              <MapPin className="size-5 text-accent-orange" />
              Select Your City
            </DialogTitle>
            <DialogDescription className="text-white/70 text-sm mt-1">
              Choose your city to see cars available near you
            </DialogDescription>
          </DialogHeader>

          {/* Search Input */}
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for your city..."
              className="pl-9 pr-4 h-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-lg focus-visible:border-accent-orange/50 focus-visible:ring-accent-orange/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>

        {/* Detect Location Button */}
        <div className="px-6 pt-4">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 h-11 rounded-lg border-accent-blue/30 text-accent-blue hover:bg-accent-blue/5"
            onClick={handleDetectLocation}
          >
            <Navigation className="size-4" />
            <span className="text-sm font-medium">Detect My Location</span>
          </Button>
        </div>

        {/* City Grid */}
        <div className="px-6 py-4 space-y-5">
          {/* Popular Cities */}
          {popularCities.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Popular Cities
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                <AnimatePresence mode="popLayout">
                  {popularCities.map((city) => (
                    <motion.button
                      key={city.name}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.15 }}
                      onClick={() => handleSelectCity(city)}
                      className={cn(
                        'flex flex-col items-center gap-1 p-3 rounded-xl border transition-all duration-200',
                        'hover:border-accent-blue/50 hover:bg-accent-blue/5 hover:shadow-sm cursor-pointer',
                        isSelected(city)
                          ? 'border-accent-blue bg-accent-blue/10 shadow-sm'
                          : 'border-border/60 bg-background',
                      )}
                    >
                      <MapPin
                        className={cn(
                          'size-4',
                          isSelected(city) ? 'text-accent-blue' : 'text-muted-foreground',
                        )}
                      />
                      <span
                        className={cn(
                          'text-xs font-semibold leading-tight text-center',
                          isSelected(city) ? 'text-accent-blue' : 'text-foreground',
                        )}
                      >
                        {city.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{city.state}</span>
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Other Cities */}
          {otherCities.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Other Cities
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {otherCities.map((city) => (
                  <button
                    key={city.name}
                    onClick={() => handleSelectCity(city)}
                    className={cn(
                      'flex flex-col items-center gap-1 p-3 rounded-xl border transition-all duration-200',
                      'hover:border-accent-blue/50 hover:bg-accent-blue/5 hover:shadow-sm cursor-pointer',
                      isSelected(city)
                        ? 'border-accent-blue bg-accent-blue/10 shadow-sm'
                        : 'border-border/60 bg-background',
                    )}
                  >
                    <MapPin
                      className={cn(
                        'size-4',
                        isSelected(city) ? 'text-accent-blue' : 'text-muted-foreground',
                      )}
                    />
                    <span
                      className={cn(
                        'text-xs font-semibold leading-tight text-center',
                        isSelected(city) ? 'text-accent-blue' : 'text-foreground',
                      )}
                    >
                      {city.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{city.state}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {filteredCities.length === 0 && (
            <div className="text-center py-8">
              <MapPin className="size-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                No cities found for &ldquo;{search}&rdquo;
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Try searching for a different city
              </p>
            </div>
          )}
        </div>

        {/* Current Selection Footer */}
        <div className="px-6 py-4 border-t border-border/50 bg-muted/30 rounded-b-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Current selection:</span>
            <span className="text-sm font-semibold text-foreground capitalize flex items-center gap-1.5">
              <MapPin className="size-3.5 text-accent-orange" />
              {selectedCity}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
