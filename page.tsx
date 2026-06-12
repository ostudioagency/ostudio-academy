'use client'

import { useState, useEffect, useCallback } from 'react'
import { Download, RefreshCw, Users, Filter } from 'lucide-react'

type Entry = {
  id: string
  created_at: string
  full_name: string
  email: string
  phone: string | null
  city: string | null
  profile: string
  learning_goals: string[]
}

const profileLabels: Record<string, string> = {
  photographe: 'Photographe',
  createur: 'Créateur',
  entrepreneur: 'Entrepreneur',
  debutant: 'Débutant',
}

const profileColors: Record<string, string> = {
  photographe: 'bg-amber-50 text-amber-700 border-amber-200',
  createur: 'bg-purple-50 text-purple-700 border-purple-200',
  entrepreneur: 'bg-blue-50 text-blue-700 border-blue-200',
  debutant: 'bg-green-50 text-green-700 border-green-200',
}

export default function AdminPage() {
  const [secret, setSecret] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [entries, setEntries] = useState<Entry[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filterProfile, setFilterProfile] = useState('all')
  const [page, setPage] = useState(1)

  const fetchEntries = useCallback(async (secretKey: string, profileFilter = 'all', currentPage = 1) => {
    setLoading(true)
    setError('')

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '50',
        profile: profileFilter,
      })

      const res = await fetch(`/api/admin?${params}`, {
        headers: { 'x-admin-secret': secretKey },
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Accès refusé')
      }

      setEntries(data.data || [])
      setTotal(data.total || 0)
      setAuthenticated(true)
    } catch (err: any) {
      setError(err.message)
      setAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    fetchEntries(secret, filterProfile, page)
  }

  const handleFilter = (profile: string) => {
    setFilterProfile(profile)
    setPage(1)
    fetchEntries(secret, profile, 1)
  }

  const handleRefresh = () => {
    fetchEntries(secret, filterProfile, page)
  }

  const exportCSV = () => {
    const headers = ['Date', 'Nom', 'Courriel', 'Téléphone', 'Ville', 'Profil', 'Apprentissage']
    const rows = entries.map((e) => [
      new Date(e.created_at).toLocaleDateString('fr-CA'),
      e.full_name,
      e.email,
      e.phone || '',
      e.city || '',
      profileLabels[e.profile] || e.profile,
      (e.learning_goals || []).join(', '),
    ])

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `ostudio-waitlist-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  // Stats
  const stats = {
    total,
    photographe: entries.filter((e) => e.profile === 'photographe').length,
    createur: entries.filter((e) => e.profile === 'createur').length,
    entrepreneur: entries.filter((e) => e.profile === 'entrepreneur').length,
    debutant: entries.filter((e) => e.profile === 'debutant').length,
  }

  // Login screen
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="text-center mb-10">
            <div className="flex flex-col items-center mb-2">
              <span className="font-display text-2xl font-light tracking-widest text-cream">
                O'STUDIO
              </span>
              <span className="text-[9px] font-body tracking-widest uppercase text-gold mt-1">
                Academy
              </span>
            </div>
            <p className="text-cream/30 text-xs tracking-widest uppercase mt-4">
              Administration
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-body tracking-widest uppercase text-cream/40 mb-3">
                Clé d'accès
              </label>
              <input
                type="password"
                className="w-full bg-obsidian-soft border border-cream/10 text-cream font-body text-sm
                           px-4 py-3 placeholder:text-cream/20 focus:outline-none focus:border-gold
                           transition-colors duration-200"
                placeholder="••••••••••••"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs font-body">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !secret}
              className="w-full btn-gold disabled:opacity-40"
            >
              {loading ? 'Vérification…' : 'Accéder au tableau de bord'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-obsidian border-b border-gold/15 px-6 md:px-8 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="font-display text-lg font-light tracking-widest text-cream">
                O'STUDIO
              </span>
              <span className="text-[8px] font-body tracking-widest uppercase text-gold">
                Academy · Admin
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 text-xs font-body tracking-widest uppercase text-cream/50
                         hover:text-gold transition-colors duration-200"
            >
              <RefreshCw className="w-3 h-3" />
              <span className="hidden md:inline">Actualiser</span>
            </button>
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 btn-outline border-gold/40 text-gold/70 text-xs px-4 py-2"
            >
              <Download className="w-3 h-3" />
              Exporter CSV
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 md:px-8 py-10">
        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          <div className="md:col-span-1 bg-obsidian p-5">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-3.5 h-3.5 text-gold/60" />
              <span className="text-[10px] font-body tracking-widest uppercase text-cream/40">Total</span>
            </div>
            <p className="font-display text-3xl font-light text-cream">{total}</p>
          </div>

          {Object.entries(profileLabels).map(([key, label]) => (
            <div
              key={key}
              className="bg-white border border-obsidian/5 p-5 cursor-pointer hover:border-gold/30 transition-colors"
              onClick={() => handleFilter(filterProfile === key ? 'all' : key)}
            >
              <p className="text-[10px] font-body tracking-widest uppercase text-obsidian/40 mb-2">
                {label}
              </p>
              <p className="font-display text-3xl font-light text-obsidian">
                {stats[key as keyof typeof stats]}
              </p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="flex items-center gap-1.5 text-obsidian/40 mr-2">
            <Filter className="w-3 h-3" />
            <span className="text-xs font-body tracking-widest uppercase">Filtrer</span>
          </div>
          {['all', ...Object.keys(profileLabels)].map((p) => (
            <button
              key={p}
              onClick={() => handleFilter(p)}
              className={`text-xs font-body tracking-widest uppercase px-3 py-1.5 border transition-all duration-200 ${
                filterProfile === p
                  ? 'bg-obsidian text-cream border-obsidian'
                  : 'text-obsidian/50 border-obsidian/15 hover:border-gold/50 hover:text-obsidian'
              }`}
            >
              {p === 'all' ? 'Tous' : profileLabels[p]}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white border border-obsidian/5 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-6 h-6 border border-gold/30 border-t-gold rounded-full animate-spin" />
            </div>
          ) : entries.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-obsidian/30 font-body text-sm">Aucune inscription pour l'instant.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full admin-table">
                <thead className="border-b border-obsidian/5">
                  <tr className="px-6">
                    <th className="px-6 pt-5">Date</th>
                    <th className="px-6 pt-5">Nom</th>
                    <th className="px-6 pt-5">Courriel</th>
                    <th className="px-6 pt-5 hidden md:table-cell">Téléphone</th>
                    <th className="px-6 pt-5 hidden md:table-cell">Ville</th>
                    <th className="px-6 pt-5">Profil</th>
                    <th className="px-6 pt-5 hidden lg:table-cell">Apprentissage</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr key={entry.id} className="transition-colors duration-150">
                      <td className="px-6 text-obsidian/40 whitespace-nowrap">
                        {new Date(entry.created_at).toLocaleDateString('fr-CA', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 font-medium text-obsidian whitespace-nowrap">
                        {entry.full_name}
                      </td>
                      <td className="px-6 text-obsidian/60">
                        <a
                          href={`mailto:${entry.email}`}
                          className="hover:text-gold transition-colors duration-150"
                        >
                          {entry.email}
                        </a>
                      </td>
                      <td className="px-6 text-obsidian/50 hidden md:table-cell">
                        {entry.phone || <span className="text-obsidian/20">—</span>}
                      </td>
                      <td className="px-6 text-obsidian/50 hidden md:table-cell">
                        {entry.city || <span className="text-obsidian/20">—</span>}
                      </td>
                      <td className="px-6">
                        <span
                          className={`inline-block text-[10px] font-body tracking-wide border px-2 py-0.5 ${
                            profileColors[entry.profile] || 'bg-gray-50 text-gray-600 border-gray-200'
                          }`}
                        >
                          {profileLabels[entry.profile] || entry.profile}
                        </span>
                      </td>
                      <td className="px-6 hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {(entry.learning_goals || []).map((goal) => (
                            <span
                              key={goal}
                              className="text-[10px] font-body border border-obsidian/10 text-obsidian/50 px-1.5 py-0.5"
                            >
                              {goal}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer note */}
        <p className="mt-6 text-obsidian/30 text-xs font-body text-right">
          {entries.length} résultat{entries.length !== 1 ? 's' : ''} affichés · {total} inscrits au total
        </p>
      </div>
    </div>
  )
}
