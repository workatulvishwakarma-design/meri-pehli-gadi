// ─── Role Permission Matrix ──────────────────────────────────────────
// Defines what each role can access across the system

export const ASSAM_CITIES = [
  'Guwahati', 'Dibrugarh', 'Tinsukia', 'Jorhat', 'Tezpur', 'Silchar',
  'Nagaon', 'Bongaigaon', 'Nalbari', 'Dhemaji', 'Goalpara', 'Lakhimpur',
  'Sivasagar', 'Golaghat', 'Barpeta', 'Karimganj', 'Hailakandi',
  'Diphu', 'Kokrajhar', 'Dhubri', 'Morigaon', 'Haflong',
] as const

export const ASSAM_CITY_SLUGS = ASSAM_CITIES.map(c =>
  c.toLowerCase().replace(/\s+/g, '-')
)

export function isAssamCity(cityName: string): boolean {
  return ASSAM_CITIES.some(
    c => c.toLowerCase() === cityName.toLowerCase()
  )
}

export function isAssamCitySlug(slug: string): boolean {
  return ASSAM_CITY_SLUGS.includes(slug.toLowerCase())
}

// ─── Permission Matrix ───────────────────────────────────────────────

export type Permission =
  | 'dashboard.view'
  | 'cars.view' | 'cars.create' | 'cars.edit' | 'cars.delete' | 'cars.import' | 'cars.export'
  | 'leads.view' | 'leads.edit' | 'leads.assign' | 'leads.export' | 'leads.notes'
  | 'finance.view' | 'finance.edit' | 'finance.export'
  | 'insurance.view' | 'insurance.edit' | 'insurance.export'
  | 'customers.view' | 'customers.edit'
  | 'blogs.view' | 'blogs.create' | 'blogs.edit' | 'blogs.delete'
  | 'dealers.view' | 'dealers.create' | 'dealers.edit'
  | 'users.view' | 'users.edit' | 'users.roles'
  | 'settings.view' | 'settings.edit'
  | 'analytics.view'

const ALL_PERMISSIONS: Permission[] = [
  'dashboard.view',
  'cars.view', 'cars.create', 'cars.edit', 'cars.delete', 'cars.import', 'cars.export',
  'leads.view', 'leads.edit', 'leads.assign', 'leads.export', 'leads.notes',
  'finance.view', 'finance.edit', 'finance.export',
  'insurance.view', 'insurance.edit', 'insurance.export',
  'customers.view', 'customers.edit',
  'blogs.view', 'blogs.create', 'blogs.edit', 'blogs.delete',
  'dealers.view', 'dealers.create', 'dealers.edit',
  'users.view', 'users.edit', 'users.roles',
  'settings.view', 'settings.edit',
  'analytics.view',
]

export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  SUPER_ADMIN: ALL_PERMISSIONS,

  ADMIN: ALL_PERMISSIONS,

  AGENT: [
    'dashboard.view',
    'leads.view', 'leads.edit', 'leads.notes', 'leads.export',
    'finance.view',
    'insurance.view',
    'customers.view',
    'analytics.view',
  ],

  DEALER: [
    'dashboard.view',
    'cars.view', 'cars.create', 'cars.edit', // own cars only
    'leads.view', 'leads.notes', // own leads only
    'customers.view',
  ],

  FINANCE_EXECUTIVE: [
    'dashboard.view',
    'finance.view', 'finance.edit', 'finance.export',
    'leads.view', 'leads.notes',
    'analytics.view',
  ],

  INSURANCE_EXECUTIVE: [
    'dashboard.view',
    'insurance.view', 'insurance.edit', 'insurance.export',
    'leads.view', 'leads.notes',
    'analytics.view',
  ],

  CONTENT_MANAGER: [
    'dashboard.view',
    'blogs.view', 'blogs.create', 'blogs.edit', 'blogs.delete',
    'cars.view',
  ],

  SELLER: [
    'dashboard.view',
    'cars.view', 'cars.create', 'cars.edit', // own cars only
  ],

  BUYER: [],
}

export function hasPermission(role: string, permission: Permission): boolean {
  const perms = ROLE_PERMISSIONS[role]
  return perms ? perms.includes(permission) : false
}

export function getPermissions(role: string): Permission[] {
  return ROLE_PERMISSIONS[role] || []
}

// Which sidebar sections a role can see
export function getVisibleSections(role: string): string[] {
  const perms = getPermissions(role)
  const sections: string[] = []

  if (perms.includes('dashboard.view')) sections.push('dashboard')
  if (perms.includes('cars.view')) sections.push('cars')
  if (perms.includes('leads.view')) sections.push('leads')
  if (perms.includes('finance.view')) sections.push('finance-leads')
  if (perms.includes('insurance.view')) sections.push('insurance-leads')
  if (perms.includes('customers.view')) sections.push('customers')
  if (perms.includes('blogs.view')) sections.push('blogs')
  if (perms.includes('dealers.view')) sections.push('dealers')
  if (perms.includes('users.view')) sections.push('users')
  if (perms.includes('settings.view')) sections.push('settings')
  if (perms.includes('analytics.view')) sections.push('analytics')

  return sections
}
