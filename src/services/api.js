// Placeholder frontend-only "API" layer.
// Each function simulates a real network call (latency + resolved payload) so the
// rest of the app can be written exactly as it would be against a live backend.
// Swap the internals for real `fetch`/`axios` calls once the backend is ready.

import {
  generateInventory, generateNotifications, generateWeeklyScans, generateMonthlyReports,
  generateCategoryBreakdown, generateStatusBreakdown, generateStorageConditions,
  generateShelfLifeTrend, loadImagePixelData, buildAssessmentFromPixels,
  shelfLifeFromAssessment, recommendationsFromAssessment
} from '../data/mockData'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const ROLES = ['Consumer', 'Retail Manager', 'Warehouse Operator', 'Food Quality Inspector', 'Administrator']

export async function login({ email, password, role }) {
  await delay(900)
  if (!email || !password) {
    throw new Error('Email and password are required.')
  }
  const isAdmin = email.toLowerCase() === 'admin@fresheye.ai'
  const token = btoa(`${email}:${Date.now()}`)
  return {
    token,
    user: {
      id: `USR-${Math.floor(Math.random() * 9000 + 1000)}`,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      email,
      role: isAdmin ? 'Administrator' : (role || 'Consumer'),
      joinedAt: new Date().toISOString(),
      avatarSeed: Math.floor(Math.random() * 100)
    }
  }
}

export async function signup({ name, email, password, role }) {
  await delay(1100)
  if (!name || !email || !password) throw new Error('All fields are required.')
  const token = btoa(`${email}:${Date.now()}`)
  return {
    token,
    user: {
      id: `USR-${Math.floor(Math.random() * 9000 + 1000)}`,
      name,
      email,
      role: role || 'Consumer',
      joinedAt: new Date().toISOString(),
      avatarSeed: Math.floor(Math.random() * 100)
    }
  }
}

export async function uploadImage(file, foodInfo) {
  if (!file) throw new Error('No file provided.')
  if (!foodInfo?.name) throw new Error('Please tell us what food item this is before analyzing.')
  const [pixelStats] = await Promise.all([loadImagePixelData(file), delay(3000)])
  return buildAssessmentFromPixels(foodInfo, pixelStats)
}

export async function getPrediction(assessment) {
  await delay(600)
  const shelfLife = shelfLifeFromAssessment(assessment)
  const recommendations = recommendationsFromAssessment(assessment, shelfLife)
  return { shelfLife, recommendations }
}

export async function getInventory() {
  await delay(700)
  return generateInventory(48)
}

export async function getReports() {
  await delay(700)
  return {
    monthly: generateMonthlyReports(),
    weekly: generateWeeklyScans()
  }
}

export async function getAnalytics(inventory) {
  await delay(800)
  return {
    categoryBreakdown: generateCategoryBreakdown(inventory),
    statusBreakdown: generateStatusBreakdown(inventory),
    storageConditions: generateStorageConditions(),
    shelfLifeTrend: generateShelfLifeTrend(),
    weeklyScans: generateWeeklyScans()
  }
}

export async function getNotifications(inventory) {
  await delay(500)
  return generateNotifications(inventory)
}

export async function getRoles() {
  await delay(200)
  return ROLES
}
