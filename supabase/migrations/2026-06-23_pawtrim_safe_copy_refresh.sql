update public.products
set
  description = 'A compact electric pet nail grinder with LED visibility for more controlled at-home grooming routines.',
  short_description = 'Gentle LED grinder for calmer nail care at home.',
  headline = 'Trim Your Pet''s Nails With More Confidence at Home',
  subheadline = 'PawTrim LED Grinder is a gentle grooming tool designed to help make nail care easier, calmer and less stressful for pets and owners.',
  images = '["/placeholders/pawtrim-led-grinder.svg","/placeholders/pawtrim-led-grinder-2.svg"]'::jsonb,
  benefits = '["Built-in LED light for better visibility","Gentle grinding instead of harsh clipping","Designed for dogs and cats","Compact and easy to use at home","Helps make routine grooming feel more controlled"]'::jsonb,
  details = '{"Product type":"Electric Pet LED Nail Grinder","Bundle options":"1x, 2x Best Value, 3x Family Pack","Main concern":"Traditional clippers can feel stressful for pets and owners."}'::jsonb,
  faqs = '[{"question":"Is this for dogs and cats?","answer":"Yes. Use slow, gentle passes and follow your pet comfort level."},{"question":"How should I use it with a nervous pet?","answer":"Let your pet see and hear the grinder first, start with short sessions, use light pressure and offer breaks or rewards."},{"question":"Does it replace professional grooming?","answer":"It is designed for routine at-home nail care. For medical concerns, injuries or very difficult nails, contact a qualified groomer or veterinarian."}]'::jsonb,
  updated_at = now()
where slug = 'pawtrim-led-grinder'
  and (
    headline ilike '%safely%'
    or subheadline ilike '%safer%'
    or benefits::text ilike '%safer%'
  );
