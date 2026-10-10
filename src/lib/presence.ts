'use client';

import { supabase } from '@/lib/supabase';

// Live visitors through Supabase Realtime Presence: every open public page announces itself on
// this channel (nothing is written to the database); the admin panel only listens.
export const PRESENCE_CHANNEL = 'site-presence';

export interface PresenceMeta { path: string; since: number }
