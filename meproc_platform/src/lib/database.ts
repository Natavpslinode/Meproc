import { createClient } from '@supabase/supabase-js'
import { supabaseUrl, supabaseAnonKey } from './supabase'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface StudentProfile {
  id: string
  user_id: string
  full_name: string
  phone?: string
  registration_date: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CourseModule {
  id: string
  module_number: number
  title: string
  description: string
  content_overview?: string
  is_published: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface CourseMaterial {
  id: string
  module_id: string
  material_type: string
  file_name: string
  file_url: string
  file_size?: number
  mime_type?: string
  title?: string
  description?: string
  upload_date: string
  is_active: boolean
}

export interface StudentProgress {
  id: string
  user_id: string
  module_id: string
  is_completed: boolean
  completion_date?: string
  time_spent_minutes: number
  last_accessed: string
  created_at: string
}

export interface StudentCertificate {
  id: string
  user_id: string
  certificate_number: string
  student_name: string
  issue_date: string
  completion_date: string
  certificate_url?: string
  pdf_generated: boolean
  is_valid: boolean
  created_at: string
}

// Auth helper functions
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error getting user:', error);
    return null;
  }
  return user;
}

export async function signInWithEmailPassword(email: string, password: string) {
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithEmailPassword(email: string, password: string, fullName: string, phone?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.protocol}//${window.location.host}/auth/callback`
    }
  });

  if (error) throw error;

  // Create student profile if signup successful
  if (data.user) {
    const { error: profileError } = await supabase
      .from('student_profiles')
      .insert({
        user_id: data.user.id,
        full_name: fullName,
        phone: phone || null,
        is_active: true
      });

    if (profileError) {
      console.error('Error creating student profile:', profileError);
    }
  }

  return { data, error };
}

export async function signOut() {
  return await supabase.auth.signOut();
}

// Data fetching functions
export async function getCourseModules(): Promise<CourseModule[]> {
  const { data, error } = await supabase
    .from('course_modules')
    .select('*')
    .order('sort_order', { ascending: true });
    
  if (error) throw error;
  return data || [];
}

export async function getModuleMaterials(moduleId: string): Promise<CourseMaterial[]> {
  const { data, error } = await supabase
    .from('course_materials')
    .select('*')
    .eq('module_id', moduleId)
    .eq('is_active', true)
    .order('upload_date', { ascending: false });
    
  if (error) throw error;
  return data || [];
}

export async function getStudentProgress(userId: string): Promise<StudentProgress[]> {
  const { data, error } = await supabase
    .from('student_progress')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });
    
  if (error) throw error;
  return data || [];
}

export async function updateModuleProgress(userId: string, moduleId: string, completed: boolean) {
  const { data, error } = await supabase
    .from('student_progress')
    .upsert({
      user_id: userId,
      module_id: moduleId,
      is_completed: completed,
      completion_date: completed ? new Date().toISOString() : null,
      last_accessed: new Date().toISOString()
    }, {
      onConflict: 'user_id,module_id'
    });
    
  if (error) throw error;
  return data;
}

export async function getStudentCertificate(userId: string): Promise<StudentCertificate | null> {
  const { data, error } = await supabase
    .from('student_certificates')
    .select('*')
    .eq('user_id', userId)
    .eq('is_valid', true)
    .order('created_at', { ascending: false })
    .maybeSingle();
    
  if (error) throw error;
  return data;
}