import { redirect } from 'next/navigation'

export default function Home() {
  // Redirect to the main test for now
  // TODO: Create test list page
  redirect('/tests/2025-keyword-check')
}
