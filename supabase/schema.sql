-- ====================================================================
-- WORKOUT TRACKER — SUPABASE POSTGRESQL DATABASE SCHEMA & RLS POLICIES
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------------------
-- 1. PROFILES TABLE (User Profile Settings)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT,
  email TEXT,
  weight_unit TEXT DEFAULT 'kg' CHECK (weight_unit IN ('kg', 'lbs')),
  rest_timer_seconds INTEGER DEFAULT 90,
  rest_timer_auto_start BOOLEAN DEFAULT TRUE,
  weekly_goal INTEGER DEFAULT 4,
  sound_enabled BOOLEAN DEFAULT TRUE
);

-- Enable RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- --------------------------------------------------------------------
-- Trigger: Automatic Profile Creation on User Auth Register
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger binding
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- --------------------------------------------------------------------
-- 2. EXERCISES TABLE (Built-in + Custom User Exercises)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- NULL for global built-in exercises
  name TEXT NOT NULL,
  muscle_group TEXT NOT NULL,
  equipment TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'strength' CHECK (category IN ('strength', 'cardio')),
  is_custom BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Exercises
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

-- Exercises Policies
CREATE POLICY "Users can view global exercises or own custom exercises" 
  ON public.exercises FOR SELECT 
  USING (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Users can insert own custom exercises" 
  ON public.exercises FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own custom exercises" 
  ON public.exercises FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own custom exercises" 
  ON public.exercises FOR DELETE 
  USING (auth.uid() = user_id);

-- --------------------------------------------------------------------
-- 3. WORKOUT SESSIONS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_time TIMESTAMPTZ,
  duration_seconds INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  total_volume_kg NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Workout Sessions
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;

-- Workout Sessions Policies
CREATE POLICY "Users can manage own workout sessions" 
  ON public.workout_sessions FOR ALL 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

-- --------------------------------------------------------------------
-- 4. WORKOUT LOGS TABLE (Exercises attached to a Session)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.workout_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.workout_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES public.exercises(id) ON DELETE SET NULL,
  exercise_name TEXT NOT NULL,
  muscle_group TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'strength',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Workout Logs
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;

-- Workout Logs Policies
CREATE POLICY "Users can manage own workout logs" 
  ON public.workout_logs FOR ALL 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

-- --------------------------------------------------------------------
-- 5. WORKOUT SETS TABLE (Sets for Strength Exercises)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.workout_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  log_id UUID NOT NULL REFERENCES public.workout_logs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  set_number INTEGER NOT NULL,
  type TEXT NOT NULL DEFAULT 'normal' CHECK (type IN ('normal', 'warmup', 'drop', 'failure')),
  weight NUMERIC NOT NULL DEFAULT 0,
  reps INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  is_pr BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Workout Sets
ALTER TABLE public.workout_sets ENABLE ROW LEVEL SECURITY;

-- Workout Sets Policies
CREATE POLICY "Users can manage own workout sets" 
  ON public.workout_sets FOR ALL 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

-- --------------------------------------------------------------------
-- 6. CARDIO ENTRIES TABLE (Treadmill Cardio Metrics)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cardio_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  log_id UUID NOT NULL REFERENCES public.workout_logs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  duration_minutes NUMERIC NOT NULL DEFAULT 0,
  incline NUMERIC DEFAULT 0,
  speed NUMERIC DEFAULT 0,
  avg_heart_rate INTEGER,
  calories_burned INTEGER,
  distance_km NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Cardio Entries
ALTER TABLE public.cardio_entries ENABLE ROW LEVEL SECURITY;

-- Cardio Entries Policies
CREATE POLICY "Users can manage own cardio entries" 
  ON public.cardio_entries FOR ALL 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

-- --------------------------------------------------------------------
-- 7. BODY WEIGHT LOGS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.body_weight_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  weight NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Enable RLS for Body Weight Logs
ALTER TABLE public.body_weight_logs ENABLE ROW LEVEL SECURITY;

-- Body Weight Logs Policies
CREATE POLICY "Users can manage own body weight logs" 
  ON public.body_weight_logs FOR ALL 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

-- --------------------------------------------------------------------
-- 8. INITIAL GLOBAL EXERCISES SEED DATA
-- --------------------------------------------------------------------
INSERT INTO public.exercises (name, muscle_group, equipment, category) VALUES
  ('Barbell Bench Press', 'chest', 'barbell', 'strength'),
  ('Incline Dumbbell Press', 'chest', 'dumbbell', 'strength'),
  ('Barbell Squat', 'legs', 'barbell', 'strength'),
  ('Romanian Deadlift', 'legs', 'barbell', 'strength'),
  ('Lat Pulldown', 'back', 'cable', 'strength'),
  ('Seated Cable Row', 'back', 'cable', 'strength'),
  ('Overhead Dumbbell Press', 'shoulders', 'dumbbell', 'strength'),
  ('Lateral Raises', 'shoulders', 'dumbbell', 'strength'),
  ('Tricep Rope Pushdown', 'arms', 'cable', 'strength'),
  ('Dumbbell Bicep Curl', 'arms', 'dumbbell', 'strength'),
  ('Hanging Leg Raise', 'core', 'bodyweight', 'strength'),
  ('Treadmill Intervals / Incline Walk', 'cardio', 'treadmill', 'cardio')
ON CONFLICT DO NOTHING;
