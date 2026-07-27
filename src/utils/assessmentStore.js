const KEY = 'ffm_last_assessment'

export function saveAssessment(data) {
  sessionStorage.setItem(KEY, JSON.stringify(data))
}

export function loadAssessment() {
  try {
    const raw = sessionStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearAssessment() {
  sessionStorage.removeItem(KEY)
}
