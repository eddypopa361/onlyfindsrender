#!/usr/bin/env tsx

/**
 * Debug Supabase setup - check tables and admin status
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE!
const USER_EMAIL = 'doarcarlos666@gmail.com'

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

async function checkTables() {
  console.log('🔍 Checking database tables...')
  
  try {
    // Check products table
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('count', { count: 'exact', head: true })
    
    if (productsError) {
      console.log('❌ Products table error:', productsError.message)
    } else {
      console.log('✅ Products table exists')
    }

    // Check admins table
    const { data: admins, error: adminsError } = await supabase
      .from('admins')
      .select('count', { count: 'exact', head: true })
    
    if (adminsError) {
      console.log('❌ Admins table error:', adminsError.message)
    } else {
      console.log('✅ Admins table exists')
    }
  } catch (error) {
    console.log('❌ Table check failed:', error)
  }
}

async function checkAuthUsers() {
  console.log('👤 Checking authentication users...')
  
  try {
    const { data: users, error } = await supabase.auth.admin.listUsers()
    
    if (error) {
      console.log('❌ Auth users error:', error.message)
      return null
    }

    console.log(`Found ${users.users.length} users:`)
    users.users.forEach(user => {
      console.log(`- ${user.email} (ID: ${user.id})`)
    })

    const targetUser = users.users.find(u => u.email === USER_EMAIL)
    if (targetUser) {
      console.log(`✅ Target user found: ${targetUser.email} (${targetUser.id})`)
      return targetUser.id
    } else {
      console.log(`❌ Target user ${USER_EMAIL} not found`)
      return null
    }
  } catch (error) {
    console.log('❌ Auth check failed:', error)
    return null
  }
}

async function checkAdmins() {
  console.log('🔒 Checking admins table...')
  
  try {
    const { data: admins, error } = await supabase
      .from('admins')
      .select('*')
    
    if (error) {
      console.log('❌ Admins query error:', error.message)
      return
    }

    if (admins.length === 0) {
      console.log('⚠️ No admins found in database')
    } else {
      console.log(`Found ${admins.length} admins:`)
      admins.forEach(admin => {
        console.log(`- ${admin.email} (ID: ${admin.id})`)
      })
    }
  } catch (error) {
    console.log('❌ Admins check failed:', error)
  }
}

async function addAdminManually(userId: string) {
  console.log('➕ Adding admin manually...')
  
  try {
    const { data, error } = await supabase
      .from('admins')
      .insert({
        id: userId,
        email: USER_EMAIL,
        name: 'Carlos'
      })
      .select()
    
    if (error) {
      console.log('❌ Admin insert error:', error.message)
    } else {
      console.log('✅ Admin added successfully:', data)
    }
  } catch (error) {
    console.log('❌ Manual admin add failed:', error)
  }
}

async function main() {
  console.log('🐛 Debugging Supabase setup...')
  console.log(`📍 URL: ${SUPABASE_URL}`)
  
  await checkTables()
  const userId = await checkAuthUsers()
  await checkAdmins()
  
  if (userId) {
    await addAdminManually(userId)
    await checkAdmins()
  }
  
  console.log('\n✅ Debug complete!')
}

main().catch(console.error)