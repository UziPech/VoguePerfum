-- Script Maestro: Confirmar Email y Dar Permisos de Admin
-- Ejecuta esto en el SQL Editor de Supabase

UPDATE auth.users
SET 
    -- 1. Confirmar el email automáticamente (para saltar el error "Email not confirmed")
    email_confirmed_at = now(),
    
    -- 2. Asignar rol de admin
    raw_user_meta_data = jsonb_set(
        coalesce(raw_user_meta_data, '{}'::jsonb),
        '{role}',
        '"admin"'
    )
WHERE email = 'isaacbalam016@gmail.com'; 

-- Verificar el resultado
SELECT email, email_confirmed_at, raw_user_meta_data 
FROM auth.users 
WHERE email = 'isaacbalam016@gmail.com';
