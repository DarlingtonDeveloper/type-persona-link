# E3 Circle Profile System Implementation Guide

This guide will help you set up the E3 Circle profile system with user-specific routing, onboarding flow, and profile management.

## Overview

The system transforms the static profile page into a dynamic user onboarding and profile system where:

- Each user has a unique code (e.g., `EAVO53`) that serves as their URL route
- Users go through a 5-step onboarding process when first visiting their profile
- Completed profiles display their personalized social links and information
- All data is stored in Supabase with progress tracking

## Prerequisites

- Node.js & npm installed
- Supabase account and project set up
- The provided React/TypeScript codebase

## Step 1: Install Additional Dependencies

You may need to install additional packages if not already present:

```bash
npm install @radix-ui/react-progress @radix-ui/react-checkbox
```

## Step 2: Environment Variables

Ensure your Supabase credentials are properly configured in your environment:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## How It Works

### User Journey

1. **User visits their URL** (e.g., `yoursite.com/EAVO53`)
2. **System checks onboarding status:**
   - If `is_onboarding_complete = false` → Shows onboarding flow
   - If `is_onboarding_complete = true` → Shows completed profile

### Onboarding Flow Steps

1. **E3 Circle Registration**
   - E3 number (pre-filled, read-only)
   - Email address
   - Password & confirmation

2. **Personal Details**
   - Full name
   - Date of birth
   - Gender

3. **Additional Information**
   - Eye color
   - Relationship status
   - Job category & title

4. **Profile Display**
   - Mobile number
   - Up to 2 social/business links with categories
   - Profile photo upload
   - URL copying help instructions

5. **Terms & Privacy**
   - Terms & conditions acceptance
   - Privacy policy acceptance

### Data Persistence

- Progress is saved after each step completion
- Users can exit and resume where they left off
- `onboarding_step` field tracks current progress
- Form data is validated before proceeding

### Profile Display

Once completed, users see:
- Dynamic background based on time of day
- Profile photo or initials
- Typewriter bio with personalized text
- Social/business links with category-based icons
- Contact information (mobile, email)
- E3 Circle branding

## Key Features

### Smart Link Categories

Links are categorized with appropriate icons:
- **Social**: Instagram, LinkedIn, TikTok, etc.
- **Business**: Website, portfolio, etc.  
- **Industry-specific**: Fitness, Beauty, Clothing, Technology, etc.

### URL Help System

Users get clear instructions on how to copy URLs from their social media profiles and websites.

### Progressive Enhancement

- Mobile-first responsive design
- Time-based dynamic backgrounds
- Smooth animations and transitions
- Loading states and error handling

## Testing

1. **Test a user code URL**: Navigate to `/EAVO53` (or any user code)
2. **Complete onboarding flow**: Go through all 5 steps
3. **Test progress persistence**: Exit mid-flow and return
4. **Verify profile display**: Check completed profile shows correctly
5. **Test invalid codes**: Try non-existent user codes

## Security Considerations

⚠️ **Important**: This implementation stores passwords in plain text for demo purposes. In production:

1. **Hash passwords** using bcrypt or similar before storing
2. **Implement proper authentication** with JWT tokens
3. **Add rate limiting** for form submissions
4. **Validate all inputs** server-side
5. **Use HTTPS** in production
6. **Implement proper file upload** with virus scanning

## Customization

### Adding New Link Categories

```sql
INSERT INTO link_categories (name, icon_name) VALUES
('NewCategory', 'LucideIconName');
```

### Modifying Onboarding Steps

Edit the `ONBOARDING_STEPS` array and corresponding form sections in `OnboardingFlow.tsx`.

### Changing Profile Layout

Modify `CompletedProfile.tsx` to adjust the profile display layout and styling.

## Troubleshooting

### Common Issues

1. **User code not found**: Verify the code exists in the `users` table
2. **Supabase connection errors**: Check environment variables and RLS policies
3. **Images not uploading**: Implement proper file storage (not included in demo)
4. **Icons not displaying**: Ensure icon names match Lucide React icon names

### Database Debugging

```sql
-- Check user onboarding status
SELECT user_code, onboarding_step, is_onboarding_complete 
FROM users 
WHERE user_code = 'EAVO53';

-- View user links
SELECT ul.*, lc.name as category_name, lc.icon_name
FROM user_links ul
JOIN link_categories lc ON ul.category_id = lc.id
WHERE ul.user_id = 'user-uuid';
```

## Next Steps

Once basic functionality is working:

1. **Add authentication system** with proper password security
2. **Implement file upload** for profile photos
3. **Add admin panel** for managing users and categories
4. **Create analytics dashboard** for user engagement
5. **Add social sharing** functionality
6. **Implement email notifications** for important events
7. **Add profile editing** for completed users
8. **Create custom domains** for users (e.g., `username.e3circle.com`)

## Support

For questions or issues:
1. Check the browser console for errors
2. Verify Supabase table structure matches schema
3. Test with different user codes
4. Review component props and state flow

The system is designed to be modular and extensible, making it easy to add new features and customize the user experience.